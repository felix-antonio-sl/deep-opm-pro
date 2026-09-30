import { randomUUID } from "node:crypto";
import { AGENT_CAPABILITY_PROFILE } from "../../agent/capabilityProfile";
import type { Base } from "../../agent/contracts";
import { emptyTaskUsage, exhaustedTaskBudget, isTerminalTask, type TaskBudget } from "../../agent/taskState";
import type { StartTaskRequest, TaskView } from "../../agent/taskView";
import type { PersistenciaSesion } from "../modelPersistence";
import { agentAvailability, estimateTurnCost, type AgentConfig } from "./config";
import type { AgentProvider, JsonValue, ProviderMessage, ProviderToolCallMessage, ProviderToolDefinition, ProviderUsage } from "./provider";
import { assertAgentTaskScope, type AgentDocumentSnapshot, type AgentRepository, type AgentTaskRecord, type AgentTransaction } from "./repository";
import { modelTaskSources } from "./sourceAccess";

export interface ToolExecutionContext {
  session: PersistenciaSesion;
  task: AgentTaskRecord;
  intentVersion: number;
  leaseFence: number;
  signal: AbortSignal;
}

export interface ToolExecutionResult {
  output: JsonValue;
  halt?: "awaiting-decision" | "suspended" | "completed";
  reason?: string;
}

export interface TaskTools {
  definitions: Readonly<Record<string, ProviderToolDefinition>>;
  execute(call: ProviderToolCallMessage, context: ToolExecutionContext): Promise<ToolExecutionResult>;
  /** Rebuilt for each turn from the current document and the recorded intent. */
  context(session: PersistenciaSesion, task: AgentTaskRecord): Promise<string>;
}

export interface TaskRuntimeOptions {
  repository: AgentRepository;
  provider: AgentProvider;
  tools: TaskTools;
  config: AgentConfig;
  now?: () => number;
}

export class TaskRuntime {
  private readonly runs = new Map<string, Promise<void>>();
  private readonly aborts = new Map<string, AbortController>();
  private readonly workerId = randomUUID();
  private readonly now: () => number;

  constructor(private readonly options: TaskRuntimeOptions) {
    this.now = options.now ?? Date.now;
  }

  async start(session: PersistenciaSesion, input: StartTaskRequest): Promise<TaskView> {
    requireOperator(session);
    const availability = agentAvailability(this.options.config);
    if (!availability.available) throw new Error(availability.reason!);
    const outcome = input.outcome.trim();
    if (!outcome || outcome.length > 8_000) throw new Error("El encargo debe tener entre 1 y 8000 caracteres");
    if (!input.controllerId || !Number.isSafeInteger(input.clientSequence) || input.clientSequence < 0) {
      throw new Error("Controlador del documento inválido");
    }
    if (!["read", "propose", "edit"].includes(input.authority)) throw new Error("Autoridad no válida");
    const id = randomUUID();
    const stamp = this.stamp();
    const task = await this.options.repository.transaction(session, input.documentId, async (tx) => {
      const document = await tx.getDocument();
      if (!document) throw new Error("Documento no disponible");
      const model = document.effectiveModel;
      if (!input.scopeIds.length || input.scopeIds.some((ref) => !model.entidades[ref] && !model.estados[ref] && !model.opds[ref])) {
        throw new Error("El alcance debe identificar elementos del documento");
      }
      const sources = modelTaskSources(model);
      if (input.allowedSourceIds.some((sourceId) => !sources.some((source) => source.id === sourceId))) {
        throw new Error("Fuente no disponible en este documento");
      }
      const target = input.authority === "propose"
        ? { kind: "variant" as const, documentId: input.documentId, variantId: randomUUID() }
        : { kind: "current" as const, documentId: input.documentId };
      const record: AgentTaskRecord = {
        id, tenantId: session.tenantId, documentId: input.documentId, actorId: session.userId,
        status: "preparing", reason: null, createdAt: stamp, updatedAt: stamp,
        intent: {
          id, version: 1, target, outcome, scopeIds: [...input.scopeIds], exclusions: [...input.exclusions],
          allowedSourceIds: [...input.allowedSourceIds], sufficiency: input.sufficiency.length ? [...input.sufficiency] : [outcome],
          authority: input.authority, authorizationVersion: 1, rejectedAlternatives: [],
        },
        budget: { ...this.options.config.budget }, usage: emptyTaskUsage(), profile: { ...this.options.config.profile },
        transcript: [{ role: "user", content: outcome }],
        controller: {
          id: input.controllerId, clientSequence: input.clientSequence, workingCopyHash: input.workingCopyHash,
          expiresAt: new Date(this.now() + this.options.config.presenceTimeoutMs).toISOString(),
        },
        lease: { owner: null, fence: 0, expiresAt: null },
        results: [], pendingDecision: null, pendingCommit: null, dependencies: [],
      };
      if (target.kind === "variant") {
        await tx.putVariant({
          id: target.variantId, tenantId: session.tenantId, documentId: input.documentId, taskId: id,
          base: baseForTask(document, record), operations: [], createdAt: stamp, updatedAt: stamp, state: "open",
        });
      }
      await tx.putTask(record);
      await taskEvent(tx, record, "status");
      return record;
    });
    this.schedule(session, task);
    return taskView(task);
  }

  async instruct(session: PersistenciaSesion, documentId: string, taskId: string, text: string, expectedVersion: number): Promise<TaskView> {
    if (!text.trim() || text.length > 8_000) throw new Error("Corrección inválida");
    const task = await this.mutate(session, documentId, taskId, async (record, tx) => {
      if (isTerminalTask(record.status)) throw new Error("Esta tarea terminó; inicia otro encargo");
      if (record.intent.version !== expectedVersion) throw new Error("El encargo cambió; recupera su versión actual");
      record.intent.version++;
      closePendingToolCalls(record.transcript, "La corrección invalidó esta llamada antes de completar su resultado");
      record.transcript.push({ role: "user", content: text.trim() });
      record.intent.outcome += `\nCorrección: ${text.trim()}`;
      record.pendingCommit = null;
      record.pendingDecision = null;
      record.status = "preparing";
      record.reason = null;
      record.lease.fence++;
      record.lease.owner = null;
      record.lease.expiresAt = null;
      await taskEvent(tx, record, "invalidated");
    });
    this.aborts.get(taskId)?.abort();
    this.schedule(session, task);
    return taskView(task);
  }

  async stop(session: PersistenciaSesion, documentId: string, taskId: string): Promise<TaskView> {
    const task = await this.mutate(session, documentId, taskId, async (record) => {
      if (isTerminalTask(record.status)) return;
      record.status = "cancelled";
      record.reason = "operator-stop";
      record.intent.authorizationVersion++;
      record.pendingCommit = null;
      record.lease.fence++;
      record.lease.owner = null;
      record.lease.expiresAt = null;
    });
    this.aborts.get(taskId)?.abort();
    return taskView(task);
  }

  async continue(session: PersistenciaSesion, documentId: string, taskId: string, answer?: string, acceptReservedUsage = false, extendBudget = false): Promise<TaskView> {
    const task = await this.mutate(session, documentId, taskId, async (record) => {
      if (isTerminalTask(record.status)) throw new Error("La tarea ya terminó");
      if (record.status === "working" && record.lease.expiresAt && Date.parse(record.lease.expiresAt) > this.now()) {
        throw new Error("La tarea todavía tiene un ejecutor activo");
      }
      if (record.usage.usageUnknown && acceptReservedUsage) {
        // The full reserved upper bound stays spent. This explicit operator act
        // never resets tokens/cost or invents a measured provider charge.
        record.usage.usageUnknown = false;
        record.results.push({
          id: randomUUID(), kind: "warning", createdAt: this.stamp(),
          payload: { message: "Se conserva íntegra la reserva de la llamada sin uso informado; el gasto es una cota estimada" },
        });
      }
      if (extendBudget) {
        if (record.usage.usageUnknown || !record.reason?.includes("budget")) throw new Error("La ampliación requiere una tarea suspendida por presupuesto conocido");
        for (const key of Object.keys(record.budget) as Array<keyof TaskBudget>) record.budget[key] += this.options.config.budget[key];
        record.results.push({ id: randomUUID(), kind: "warning", createdAt: this.stamp(),
          payload: { message: "El operador amplió explícitamente el presupuesto; se conserva todo el consumo previo", maxTaskUsd: record.budget.maxTaskUsd } });
      }
      if (exhaustedTaskBudget(record.budget, record.usage)) throw new Error("La tarea necesita revisar su presupuesto antes de continuar");
      if (!record.controller || Date.parse(record.controller.expiresAt) <= this.now()) throw new Error("El documento debe estar abierto para continuar");
      if (record.pendingDecision && !answer?.trim()) throw new Error("Falta responder la decisión pendiente");
      closePendingToolCalls(record.transcript, "La llamada no terminó; comprueba los recibos antes de repetir efectos");
      if (answer?.trim()) record.transcript.push({ role: "user", content: answer.trim() });
      record.pendingDecision = null;
      record.status = "preparing";
      record.reason = null;
    });
    this.schedule(session, task);
    return taskView(task);
  }

  async presence(
    session: PersistenciaSesion, documentId: string, taskId: string,
    controller: { id: string; clientSequence: number; workingCopyHash: string },
  ): Promise<TaskView> {
    const task = await this.mutate(session, documentId, taskId, async (record) => {
      if (!controller.id || !Number.isSafeInteger(controller.clientSequence) || controller.clientSequence < 0) throw new Error("Controlador inválido");
      if (record.controller && record.controller.id !== controller.id && Date.parse(record.controller.expiresAt) > this.now()) {
        throw new Error("Otra ventana controla esta tarea; espera a que libere el documento");
      }
      if (record.controller?.id === controller.id && controller.clientSequence < record.controller.clientSequence) {
        throw new Error("Secuencia local anterior a la conocida");
      }
      record.controller = { ...controller, expiresAt: new Date(this.now() + this.options.config.presenceTimeoutMs).toISOString() };
    }, false);
    return taskView(task);
  }

  /** Tests and probes can await real execution; HTTP returns immediately after start. */
  async wait(taskId: string): Promise<void> {
    while (this.runs.has(taskId)) await this.runs.get(taskId);
  }

  /** Reading after a restart or disconnected controller exposes an actionable state. */
  async recoverExpired(session: PersistenciaSesion, documentId: string, taskId: string): Promise<AgentTaskRecord> {
    requireOperator(session);
    return this.options.repository.transaction(session, documentId, async (tx) => {
      const task = await tx.getTask(taskId);
      if (!task) throw new Error("Tarea no disponible");
      assertAgentTaskScope(task, session, documentId);
      if (task.status !== "working" && task.status !== "preparing") return task;
      const controllerExpired = !task.controller || Date.parse(task.controller.expiresAt) <= this.now();
      const leaseExpired = task.status === "working" && (!task.lease.expiresAt || Date.parse(task.lease.expiresAt) <= this.now());
      if (!controllerExpired && !leaseExpired) return task;
      task.status = "suspended";
      task.reason = controllerExpired ? "controller-absent" : "worker-interrupted";
      task.lease.fence++;
      task.lease.owner = null;
      task.lease.expiresAt = null;
      task.pendingCommit = null;
      closePendingToolCalls(task.transcript, "La ejecución fue interrumpida antes de confirmar este resultado");
      task.updatedAt = this.stamp();
      await tx.putTask(task);
      await taskEvent(tx, task, "status");
      return task;
    });
  }

  private schedule(session: PersistenciaSesion, task: AgentTaskRecord): void {
    if (this.runs.has(task.id)) return;
    const run = this.run(session, task.documentId, task.id).catch(async () => {
      await this.mutate(session, task.documentId, task.id, async (record) => {
        if (!isTerminalTask(record.status)) { record.status = "suspended"; record.reason = "execution-error"; }
      }).catch(() => undefined);
    }).finally(async () => {
      this.runs.delete(task.id);
      this.aborts.delete(task.id);
      const latest = await this.options.repository.getTask(session, task.documentId, task.id).catch(() => null);
      if (latest?.status === "preparing") this.schedule(session, latest);
    });
    this.runs.set(task.id, run);
  }

  private async run(session: PersistenciaSesion, documentId: string, taskId: string): Promise<void> {
    for (;;) {
      const task = await this.claim(session, documentId, taskId);
      if (!task) return;
      const controller = new AbortController();
      this.aborts.set(taskId, controller);
      const input = await this.options.tools.context(session, task);
      const messages: ProviderMessage[] = [{ role: "system", content: input }, ...task.transcript];
      const remainingOutput = Math.floor(task.budget.maxOutputTokens - task.usage.outputTokens);
      const outputLimit = Math.min(4_096, remainingOutput);
      // UTF-8 byte count plus protocol allowance conservatively bounds request tokens.
      const reserveInput = Buffer.byteLength(JSON.stringify({ messages, tools: this.options.tools.definitions }), "utf8") + 2_048;
      const reserveCost = estimateTurnCost(this.options.config.pricing!, reserveInput, outputLimit);
      if (outputLimit < 1 || task.usage.inputTokens + reserveInput > task.budget.maxInputTokens || task.usage.estimatedUsd + reserveCost > task.budget.maxTaskUsd) {
        await this.suspendTurn(session, task, "request-budget");
        return;
      }
      const reserved = await this.updateTurn(session, task, (record) => {
        record.usage.modelCalls++;
        record.usage.inputTokens += reserveInput;
        record.usage.outputTokens += outputLimit;
        record.usage.estimatedUsd += reserveCost;
        record.usage.usageUnknown = true;
      });
      if (!reserved) return;
      const started = this.now();
      const timeout = setTimeout(() => controller.abort(), this.options.config.requestTimeoutMs);
      const calls: ProviderToolCallMessage[] = [];
      let text = "";
      let finished = false;
      let usage: ProviderUsage | null = null;
      let failure: string | null = null;
      try {
        for await (const event of this.options.provider.stream({
          profile: task.profile, sessionId: task.id, messages, tools: this.options.tools.definitions,
          limits: { maxOutputTokens: outputLimit },
        }, controller.signal)) {
          if (event.type === "text-delta") text = (text + event.text).slice(0, 64_000);
          if (event.type === "tool-call") calls.push({ id: event.toolCallId, name: event.name, args: event.args });
          if (event.type === "usage") usage = event.usage;
          if (event.type === "error") failure = event.error.code;
          if (event.type === "finish") {
            finished = true; usage = event.usage;
            if (event.reason !== "stop" && event.reason !== "tool-calls") failure = "incomplete-turn";
          }
        }
      } catch {
        failure = controller.signal.aborted ? "cancelled" : "provider-error";
      } finally {
        clearTimeout(timeout);
      }
      // Accounting is retained even if an operator invalidated the turn meanwhile.
      await this.mutate(session, documentId, taskId, async (record) => {
        record.usage.activeMs += Math.max(0, this.now() - started);
        if (usage?.status === "known") {
          record.usage.inputTokens += usage.inputTokens - reserveInput;
          record.usage.outputTokens += usage.outputTokens - outputLimit;
          record.usage.estimatedUsd += estimateTurnCost(this.options.config.pricing!, usage.inputTokens, usage.outputTokens) - reserveCost;
          record.usage.usageUnknown = false;
        }
      }, false);
      if (failure || !finished || usage?.status !== "known") {
        await this.suspendTurn(session, task, failure ?? (finished ? "usage-unavailable" : "stream-truncated"));
        return;
      }
      if (new Set(calls.map((call) => call.id)).size !== calls.length) {
        await this.suspendTurn(session, task, "invalid-tool-call-identity");
        return;
      }
      if (!await this.updateTurn(session, task, (record) => {
        record.transcript.push({ role: "assistant", content: text, ...(calls.length ? { toolCalls: calls } : {}) });
      })) return;
      if (!calls.length) {
        // A normal stream ending is not proof of the task's acceptance.
        await this.suspendTurn(session, task, "result-not-verified");
        return;
      }
      for (const call of calls) {
        let current: AgentTaskRecord | null = null;
        if (!await this.updateTurn(session, task, (record) => {
          if (record.usage.toolCalls >= record.budget.maxToolCalls) {
            record.status = "suspended"; record.reason = "tool-call-budget";
            return;
          }
          record.usage.toolCalls++;
          current = structuredClone(record);
        })) return;
        if (!current) return;
        let result: ToolExecutionResult;
        try {
          result = await this.options.tools.execute(call, {
            session, task: current!, intentVersion: task.intent.version, leaseFence: task.lease.fence, signal: controller.signal,
          });
        } catch {
          result = { output: { error: "tool-rejected", message: "La herramienta rechazó la solicitud; revisa sus argumentos y el contexto vigente" } };
        }
        const updated = await this.updateTurn(session, task, (record) => {
          record.transcript.push({ role: "tool", toolCallId: call.id, name: call.name, content: JSON.stringify(result.output) });
          if (result.halt) {
            closePendingToolCalls(record.transcript, "Esta llamada quedó pendiente al detener el turno; no se ejecutó");
            record.status = result.halt; record.reason = result.reason ?? null;
          }
        });
        if (!updated || result.halt) return;
      }
    }
  }

  private async claim(session: PersistenciaSesion, documentId: string, taskId: string): Promise<AgentTaskRecord | null> {
    return this.options.repository.transaction(session, documentId, async (tx) => {
      const task = await tx.getTask(taskId);
      if (!task) return null;
      assertAgentTaskScope(task, session, documentId);
      if (task.status !== "preparing" && task.status !== "working") return null;
      const reason = exhaustedTaskBudget(task.budget, task.usage)
        ?? (task.profile.model !== this.options.config.profile.model || task.profile.provider !== this.options.config.profile.provider || task.profile.protocol !== this.options.config.profile.protocol ? "provider-profile-changed" : null)
        ?? (!task.controller || Date.parse(task.controller.expiresAt) <= this.now() ? "controller-absent" : null);
      if (reason) {
        task.status = "suspended"; task.reason = reason; task.updatedAt = this.stamp();
        await tx.putTask(task); await taskEvent(tx, task, "status");
        return null;
      }
      if (task.lease.owner && task.lease.owner !== this.workerId && task.lease.expiresAt && Date.parse(task.lease.expiresAt) > this.now()) return null;
      if (task.lease.owner !== this.workerId) task.lease.fence++;
      task.lease.owner = this.workerId;
      task.lease.expiresAt = new Date(this.now() + this.options.config.workerLeaseMs).toISOString();
      task.status = "working"; task.updatedAt = this.stamp();
      await tx.putTask(task); await taskEvent(tx, task, "status");
      return structuredClone(task);
    });
  }

  private async updateTurn(session: PersistenciaSesion, expected: AgentTaskRecord, edit: (task: AgentTaskRecord) => void): Promise<boolean> {
    return this.options.repository.transaction(session, expected.documentId, async (tx) => {
      const task = await tx.getTask(expected.id);
      if (!task) return false;
      if (!isCurrentTurn(task, expected.intent.version, expected.lease.fence, this.now())) {
        if (task.status === "working" && task.intent.version === expected.intent.version && task.lease.fence === expected.lease.fence) {
          task.status = "suspended"; task.reason = "controller-or-lease-expired";
          task.lease.fence++; task.lease.owner = null; task.lease.expiresAt = null;
          task.pendingCommit = null;
          task.updatedAt = this.stamp();
          await tx.putTask(task); await taskEvent(tx, task, "status");
        }
        return false;
      }
      assertAgentTaskScope(task, session, expected.documentId);
      edit(task);
      task.updatedAt = this.stamp();
      await tx.putTask(task);
      await taskEvent(tx, task, "status");
      return true;
    });
  }

  private async suspendTurn(session: PersistenciaSesion, expected: AgentTaskRecord, reason: string): Promise<void> {
    await this.updateTurn(session, expected, (task) => { task.status = "suspended"; task.reason = reason; });
  }

  private async mutate(
    session: PersistenciaSesion, documentId: string, taskId: string,
    edit: (task: AgentTaskRecord, tx: AgentTransaction) => Promise<void>, emit = true,
  ): Promise<AgentTaskRecord> {
    requireOperator(session);
    return this.options.repository.transaction(session, documentId, async (tx) => {
      const task = await tx.getTask(taskId);
      if (!task) throw new Error("Tarea no disponible");
      assertAgentTaskScope(task, session, documentId);
      await edit(task, tx);
      task.updatedAt = this.stamp();
      await tx.putTask(task);
      if (emit) await taskEvent(tx, task, "status");
      return structuredClone(task);
    });
  }

  private stamp(): string { return new Date(this.now()).toISOString(); }
}

export function requireOperator(session: PersistenciaSesion): void {
  if (session.authKind === "agent") throw new Error("El cliente externo no administra tareas integradas");
}

export function isCurrentTurn(task: AgentTaskRecord, intentVersion: number, fence: number, now = Date.now()): boolean {
  return task.status === "working" && task.intent.version === intentVersion && task.lease.fence === fence
    && Boolean(task.controller && Date.parse(task.controller.expiresAt) > now)
    && Boolean(task.lease.expiresAt && Date.parse(task.lease.expiresAt) > now);
}

export function baseForTask(document: AgentDocumentSnapshot, task: AgentTaskRecord): Base {
  return {
    revision: document.model.revision ?? 1, semanticHash: document.semanticHash,
    workingCopyHash: task.controller?.workingCopyHash ?? document.semanticHash,
    clientSequence: task.controller?.clientSequence ?? 0, profileVersion: AGENT_CAPABILITY_PROFILE,
  };
}

export async function taskEvent(tx: AgentTransaction, task: AgentTaskRecord, kind: "status" | "result" | "decision" | "committed" | "invalidated", resultId: string | null = null): Promise<void> {
  await tx.appendEvent({ id: randomUUID(), taskId: task.id, kind, revision: null, resultId });
}

export function taskView(task: AgentTaskRecord): TaskView {
  return {
    id: task.id, documentId: task.documentId, status: task.status, reason: task.reason,
    intent: task.intent, createdAt: task.createdAt, updatedAt: task.updatedAt, budget: task.budget,
    usage: task.usage, model: task.profile.model, results: task.results,
    pendingDecision: task.pendingDecision, pendingCommit: task.pendingCommit,
    controller: task.controller ? { id: task.controller.id, expiresAt: task.controller.expiresAt } : null,
  };
}

function closePendingToolCalls(messages: ProviderMessage[], reason: string): void {
  const pending = new Map<string, ProviderToolCallMessage>();
  for (const message of messages) {
    if (message.role === "assistant") for (const call of message.toolCalls ?? []) pending.set(call.id, call);
    if (message.role === "tool") pending.delete(message.toolCallId);
  }
  for (const call of pending.values()) {
    messages.push({ role: "tool", toolCallId: call.id, name: call.name, content: JSON.stringify({ status: "not-completed", reason }) });
  }
}
