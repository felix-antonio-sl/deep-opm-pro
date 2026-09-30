import type { AgentChangeView, AgentClient, AgentAvailability, AgentCommitGrant, PreparedAgentChange } from "../../persistencia/agentClient";
import { createDocumentOperationsPort, type DocumentOperationConflict, type DocumentOperationsPort, type DocumentOperationsTransport, type OperationPolicy } from "./documentOperationsPort";
import type { TaskEvent } from "../../agent/contracts";
import type { TaskView } from "../../agent/taskView";
import { isTerminalTask } from "../../agent/taskState";

export type AgentPortPhase = "loading" | "ready" | "unavailable" | "error";
export type AgentPortAction = "starting" | "correcting" | "continuing" | "stopping" | "loading-change" | "applying" | "undoing" | "reapplying" | null;

export interface AgentTaskSnapshot {
  documentId: string;
  phase: AgentPortPhase;
  availability: AgentAvailability | null;
  tasks: TaskView[];
  activeTask: TaskView | null;
  change: AgentChangeView | null;
  preparedChange: PreparedAgentChange | null;
  cursor: number;
  action: AgentPortAction;
  error: string | null;
  pendingEdits: number;
  pendingConflicts: number;
  conflicts: DocumentOperationConflict[];
  lastAppliedChangeId: string | null;
  lastUndoneChangeId: string | null;
}

export interface NewAgentTask {
  outcome: string;
  scopeIds: string[];
  allowedSourceIds?: string[];
  exclusions?: string[];
  sufficiency?: string[];
  authority: "propose" | "edit";
}

/** Application-facing task and change seam. Runtime and credentials stay behind AgentClient. */
export interface AgentTaskPort {
  snapshot(): AgentTaskSnapshot;
  subscribe(listener: () => void): () => void;
  open(): Promise<void>;
  start(input: NewAgentTask): Promise<void>;
  instruct(text: string): Promise<void>;
  continueTask(answer?: string, acceptReservedUsage?: boolean, extendBudget?: boolean): Promise<void>;
  stop(): Promise<void>;
  review(changeId: string): Promise<void>;
  apply(changeId: string, policy?: OperationPolicy): Promise<void>;
  undo(changeId: string): Promise<void>;
  reapply(changeId: string): Promise<void>;
  dispose(): void;
}

export interface AgentTaskPortOptions<Grant = unknown> {
  documentId: string;
  client: AgentClient;
  operations: DocumentOperationsPort<Grant>;
}

/** Adapts authenticated agent HTTP calls to the document's existing write-ordering port. */
export function createAgentDocumentOperationsPort(documentId: string, client: AgentClient, signal?: AbortSignal): DocumentOperationsPort<AgentCommitGrant> {
  const transport: DocumentOperationsTransport<AgentCommitGrant> = {
    async prepareCommit({ documentId: targetDocumentId, change, policy, controllerId, clientSequence, workingCopyHash }) {
      const grant = await client.grant({
        documentId: targetDocumentId,
        changeId: change.id,
        kind: policy,
        controllerId,
        clientSequence,
        workingCopyHash,
      }, signal);
      return { grant, expiresAt: grant.expiresAt };
    },
    async commit({ documentId: targetDocumentId, changeId, grant }) {
      const applied = await client.commit(targetDocumentId, changeId, grant, signal);
      return { receipt: applied.receipt, modelJson: applied.modelJson, base: applied.base, inverse: applied.inverse };
    },
    async resolveReceipt({ changeId }) {
      const applied = await client.resolveReceipt(documentId, changeId, signal);
      return applied ? { receipt: applied.receipt, modelJson: applied.modelJson, base: applied.base, inverse: applied.inverse } : null;
    },
    async prepareUndo({ documentId: targetDocumentId, sourceChangeId, controllerId, clientSequence, workingCopyHash }) {
      const prepared = await client.prepareUndo(targetDocumentId, sourceChangeId, controllerId, clientSequence, workingCopyHash, signal);
      return { change: prepared.change };
    },
    async prepareReapply({ documentId: targetDocumentId, sourceChangeId, controllerId, clientSequence, workingCopyHash }) {
      return client.prepareReapply(targetDocumentId, sourceChangeId, controllerId, clientSequence, workingCopyHash, signal);
    },
    async getChange({ target, changeId }) {
      return (await client.getChange(target.documentId, changeId, signal)).change;
    },
  };
  return createDocumentOperationsPort(documentId, transport);
}

/** Coordinates task transport with the single document-operation ordering port. */
export function createAgentTaskPort<Grant = unknown>(options: AgentTaskPortOptions<Grant>): AgentTaskPort {
  const listeners = new Set<() => void>();
  const controller = new AbortController();
  const autoApplying = new Set<string>();
  let heartbeat: ReturnType<typeof setInterval> | null = null;
  let eventRun: Promise<void> | null = null;
  let eventController: AbortController | null = null;
  let eventEpoch = 0;
  const initialOperations = options.operations.snapshot();
  let snapshot: AgentTaskSnapshot = {
    documentId: options.documentId,
    phase: "loading",
    availability: null,
    tasks: [],
    activeTask: null,
    change: null,
    preparedChange: null,
    cursor: 0,
    action: null,
    error: null,
    pendingEdits: initialOperations.pendingEdits,
    pendingConflicts: initialOperations.pendingConflicts,
    conflicts: options.operations.listConflicts(),
    lastAppliedChangeId: null,
    lastUndoneChangeId: null,
  };

  const update = (patch: Partial<AgentTaskSnapshot>) => {
    snapshot = { ...snapshot, ...patch };
    for (const listener of listeners) listener();
  };
  const unsubscribeOperations = options.operations.subscribe((state) => {
    update({
      pendingEdits: state.pendingEdits,
      pendingConflicts: state.pendingConflicts,
      conflicts: options.operations.listConflicts(),
    });
  });
  const signal = controller.signal;
  const activeTask = () => snapshot.activeTask;
  const withAction = async <T>(action: Exclude<AgentPortAction, null>, work: () => Promise<T>): Promise<T> => {
    update({ action, error: null });
    try { return await work(); }
    catch (error) {
      update({ error: messageOf(error) });
      throw error;
    } finally {
      update({ action: null });
    }
  };

  const refreshTask = async (taskId: string, nextCursor?: number): Promise<TaskView> => {
    const response = await options.client.getTask(options.documentId, taskId, signal);
    const task = response.task;
    const currentCursor = nextCursor === undefined ? response.cursor : Math.max(nextCursor, response.cursor);
    update({
      activeTask: task,
      tasks: replaceTask(snapshot.tasks, task),
      cursor: currentCursor,
      error: null,
    });
    if (isTerminalTask(task.status)) stopTaskActivity();
    const candidateChangeId = task.pendingCommit?.changeId ?? completedProposalChangeId(task);
    if (candidateChangeId) {
      try {
        const change = await options.client.getChange(options.documentId, candidateChangeId, signal);
        update({ change, preparedChange: null });
      } catch (error) {
        update({ error: messageOf(error) });
      }
    }
    if (task.intent.authority === "edit" && task.pendingCommit && !autoApplying.has(task.id)) {
      const changeId = task.pendingCommit.changeId;
      autoApplying.add(task.id);
      void withAction("applying", async () => {
        await commitChange(changeId, "delegated");
        const latest = await options.client.getTask(options.documentId, task.id, signal);
        update({ activeTask: latest.task, tasks: replaceTask(snapshot.tasks, latest.task), cursor: latest.cursor });
        if (!isTerminalTask(latest.task.status) && !latest.task.pendingDecision) {
          const continued = await options.client.continueTask(options.documentId, task.id, {}, signal);
          update({ activeTask: continued, tasks: replaceTask(snapshot.tasks, continued) });
        }
        await refreshTask(task.id);
      }).catch((error) => update({ error: `No se pudo completar el cambio delegado: ${messageOf(error)}` }))
        .finally(() => autoApplying.delete(task.id));
    }
    return task;
  };

  const subscribeToTask = (task: TaskView, cursor: number) => {
    if (signal.aborted) return;
    if (!isNonTerminal(task.status)) {
      stopTaskActivity();
      return;
    }
    if (eventRun && snapshot.activeTask?.id === task.id) return;
    eventController?.abort();
    const stream = new AbortController();
    eventController = stream;
    const epoch = ++eventEpoch;
    const abortStream = () => stream.abort();
    signal.addEventListener("abort", abortStream, { once: true });
    eventRun = options.client.subscribeEvents({
      documentId: options.documentId,
      taskId: task.id,
      after: cursor,
      signal: stream.signal,
      onEvent: (event: TaskEvent) => {
        update({ cursor: event.sequence });
        void refreshTask(task.id, event.sequence).catch((error) => update({ error: messageOf(error) }));
      },
      onSnapshotRequired: () => undefined,
    }).catch((error) => {
      if (!signal.aborted && !stream.signal.aborted) update({ error: messageOf(error) });
    }).finally(() => {
      signal.removeEventListener("abort", abortStream);
      if (epoch !== eventEpoch) return;
      eventRun = null;
      if (!signal.aborted && !stream.signal.aborted) {
        void refreshTask(task.id).then((latest) => subscribeToTask(latest, snapshot.cursor));
      }
    });
  };

  const sendPresence = async () => {
    const task = activeTask();
    if (!task || !isNonTerminal(task.status) || signal.aborted) return;
    const state = options.operations.snapshot();
    try {
      await options.client.presence(options.documentId, task.id, {
        controllerId: state.controllerId,
        clientSequence: state.clientSequence,
        workingCopyHash: state.workingCopyHash,
      }, signal);
    } catch (error) {
      update({ error: messageOf(error) });
    }
  };

  const startHeartbeat = () => {
    if (heartbeat) clearInterval(heartbeat);
    heartbeat = setInterval(() => { void sendPresence(); }, 10_000);
  };

  const stopTaskActivity = () => {
    if (heartbeat) clearInterval(heartbeat);
    heartbeat = null;
    eventEpoch++;
    eventController?.abort();
    eventController = null;
    eventRun = null;
  };

  const commitChange = async (sourceChangeId: string, policy: OperationPolicy): Promise<string> => {
    const base = await options.operations.flush();
    const state = options.operations.snapshot();
    const task = activeTask();
    if (!task) throw new Error("No hay una tarea activa para aplicar el cambio.");
    await options.client.presence(options.documentId, task.id, {
      controllerId: state.controllerId,
      clientSequence: base.clientSequence,
      workingCopyHash: base.workingCopyHash,
    }, signal);
    const prepared = await options.client.prepareChange(options.documentId, sourceChangeId, signal);
    await options.operations.prepareCommit(prepared.change, policy);
    const integrated = await options.operations.commit(prepared.change.id);
    if (integrated.kind !== "integrated") throw new Error(integrated.reason);
    update({ lastAppliedChangeId: integrated.changeId, preparedChange: prepared, change: null });
    return integrated.changeId;
  };

  return {
    snapshot: () => snapshot,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    async open() {
      update({ phase: "loading", error: null });
      try {
        const reservation = options.operations.snapshot().reservation;
        if (reservation?.status === "unknown") await options.operations.resolveUnknown(reservation.changeId);
        const availability = await options.client.status(signal);
        if (!availability.available) {
          update({ phase: "unavailable", availability, tasks: [], activeTask: null, error: availability.reason });
          return;
        }
        const tasks = await options.client.listTasks(options.documentId, signal);
        const task = tasks.find((candidate) => isNonTerminal(candidate.status)) ?? tasks[0] ?? null;
        update({
          phase: "ready",
          availability,
          tasks,
          activeTask: task,
          error: null,
        });
        if (task) {
          const current = await refreshTask(task.id);
          if (!isTerminalTask(current.status)) {
            startHeartbeat();
            subscribeToTask(current, snapshot.cursor);
            await sendPresence();
          }
        }
      } catch (error) {
        if (!signal.aborted) update({ phase: "error", error: messageOf(error) });
      }
    },
    async start(input) {
      const outcome = input.outcome.trim();
      if (!outcome) throw new Error("Escribe qué quieres conseguir.");
      return withAction("starting", async () => {
        const base = await options.operations.flush();
        const state = options.operations.snapshot();
        const task = await options.client.startTask({
          documentId: options.documentId,
          outcome,
          scopeIds: [...input.scopeIds],
          allowedSourceIds: input.allowedSourceIds ?? [],
          exclusions: input.exclusions ?? [],
          sufficiency: input.sufficiency ?? [],
          authority: input.authority,
          controllerId: state.controllerId,
          clientSequence: base.clientSequence,
          workingCopyHash: base.workingCopyHash,
        }, signal);
        update({ activeTask: task, tasks: replaceTask(snapshot.tasks, task), change: null, cursor: 0 });
        startHeartbeat();
        subscribeToTask(task, 0);
        await sendPresence();
        await refreshTask(task.id);
      });
    },
    async instruct(text) {
      const task = activeTask();
      if (!task) throw new Error("No hay un encargo activo que corregir.");
      return withAction("correcting", async () => {
        const base = await options.operations.flush();
        const state = options.operations.snapshot();
        await options.client.presence(options.documentId, task.id, {
          controllerId: state.controllerId,
          clientSequence: base.clientSequence,
          workingCopyHash: base.workingCopyHash,
        }, signal);
        const updated = await options.client.instruct(options.documentId, task, text, signal);
        update({ activeTask: updated, tasks: replaceTask(snapshot.tasks, updated), change: null, cursor: 0 });
        await refreshTask(updated.id);
      });
    },
    async continueTask(answer, acceptReservedUsage = false, extendBudget = false) {
      const task = activeTask();
      if (!task) throw new Error("No hay un encargo para continuar.");
      return withAction("continuing", async () => {
        await options.operations.flush();
        const state = options.operations.snapshot();
        await options.client.presence(options.documentId, task.id, {
          controllerId: state.controllerId, clientSequence: state.clientSequence, workingCopyHash: state.workingCopyHash,
        }, signal);
        const updated = await options.client.continueTask(options.documentId, task.id, {
          ...(answer ? { answer } : {}), acceptReservedUsage, extendBudget,
        }, signal);
        update({ activeTask: updated, tasks: replaceTask(snapshot.tasks, updated) });
        await refreshTask(updated.id);
      });
    },
    async stop() {
      const task = activeTask();
      if (!task) return;
      await withAction("stopping", async () => {
        const updated = await options.client.stop(options.documentId, task.id, signal);
        update({ activeTask: updated, tasks: replaceTask(snapshot.tasks, updated), change: null });
        if (isTerminalTask(updated.status)) stopTaskActivity();
      });
    },
    async review(changeId) {
      return withAction("loading-change", async () => {
        const change = await options.client.getChange(options.documentId, changeId, signal);
        update({ change, preparedChange: null });
      });
    },
    async apply(changeId, policy = "review") {
      const task = activeTask();
      if (!task) throw new Error("La propuesta no tiene una tarea de origen.");
      await withAction("applying", async () => {
        await commitChange(changeId, policy);
        if (!isTerminalTask(task.status) && task.intent.authority === "propose") {
          const latest = await options.client.getTask(options.documentId, task.id, signal);
          if (!isTerminalTask(latest.task.status) && !latest.task.pendingDecision) {
            const updated = await options.client.continueTask(options.documentId, task.id, {}, signal);
            update({ activeTask: updated, tasks: replaceTask(snapshot.tasks, updated) });
          }
        }
        await refreshTask(task.id);
      });
    },
    async undo(changeId) {
      return withAction("undoing", async () => {
        const integrated = await options.operations.undo(changeId);
        if (integrated.kind !== "integrated") throw new Error(integrated.reason);
        update({ lastUndoneChangeId: changeId, lastAppliedChangeId: null });
      });
    },
    async reapply(changeId) {
      return withAction("reapplying", async () => {
        const result = await options.operations.reapply(changeId);
        if (result.kind !== "integrated") throw new Error(result.reason);
        update({ lastAppliedChangeId: result.changeId, lastUndoneChangeId: null });
      });
    },
    dispose() {
      stopTaskActivity();
      controller.abort();
      unsubscribeOperations();
      listeners.clear();
    },
  };
}

function isNonTerminal(status: TaskView["status"]): boolean {
  return status !== "completed" && status !== "cancelled" && status !== "failed";
}

function replaceTask(tasks: TaskView[], task: TaskView): TaskView[] {
  return [task, ...tasks.filter((item) => item.id !== task.id)].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function completedProposalChangeId(task: TaskView): string | null {
  if (task.status !== "completed" || task.intent.authority !== "propose") return null;
  const committed = new Set<string>();
  for (const result of task.results) {
    const payload = recordOf(result.payload);
    const receipt = recordOf(payload?.receipt);
    if (payload?.kind === "committed-change" && typeof receipt?.changeId === "string") committed.add(receipt.changeId);
  }
  // A completed task that already committed a result must not resurface an
  // earlier proposal as though it were still awaiting review.
  if (committed.size > 0) return null;
  for (const result of [...task.results].reverse()) {
    const payload = recordOf(result.payload);
    if ((payload?.kind === "proposal" || payload?.kind === "validated-change")
      && typeof payload.changeId === "string") return payload.changeId;
  }
  return null;
}

function recordOf(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : "La operación de la tarea falló";
}
