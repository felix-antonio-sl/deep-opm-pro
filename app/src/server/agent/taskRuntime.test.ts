import { describe, expect, test } from "bun:test";
import type { StartTaskRequest } from "../../agent/taskView";
import { crearModelo } from "../../modelo/operaciones";
import { exportarModelo } from "../../serializacion/json";
import { construirModeloPersistido } from "../../persistencia/modelos";
import type { PersistenciaSesion } from "../modelPersistence";
import { loadAgentConfig } from "./config";
import type { AgentProvider, ProviderEvent, ProviderMessage } from "./provider";
import type { AgentRepository, AgentTaskRecord, AgentTransaction } from "./repository";
import { TaskRuntime, type TaskTools } from "./taskRuntime";

const session: PersistenciaSesion = { tenantId: "test-tenant", userId: "test-operator", auth: true, authKind: "operator" };
const input: StartTaskRequest = {
  documentId: "document", outcome: "Examinar el pedido", scopeIds: ["opd-1"], allowedSourceIds: [],
  exclusions: [], sufficiency: ["Resultado comprobado"], authority: "propose",
  controllerId: "browser", clientSequence: 0, workingCopyHash: "test-hash",
};

/** A transaction fake for scheduler tests. Persistence/rollback has its own integration tests. */
function repositoryFixture() {
  const tasks = new Map<string, AgentTaskRecord>();
  const model = crearModelo("Pedido");
  const document = {
    model: construirModeloPersistido({ id: "document", nombre: model.nombre, json: exportarModelo(model), revision: 1 }),
    effectiveJson: exportarModelo(model), effectiveModel: model, semanticHash: "test-hash",
    source: "saved" as const, autosaveCreatedAt: null, writable: true,
  };
  let sequence = 0;
  let queue: Promise<unknown> = Promise.resolve();
  const tx: AgentTransaction = {
    getDocument: async () => structuredClone(document),
    putModel: async (value) => value,
    getTask: async (id) => structuredClone(tasks.get(id) ?? null),
    putTask: async (task) => { tasks.set(task.id, structuredClone(task)); },
    getChange: async () => null, putChange: async () => undefined,
    getVariant: async () => null, putVariant: async () => undefined,
    getGrant: async () => null, putGrant: async () => undefined,
    appendEvent: async (event) => ({ ...event, sequence: ++sequence }),
  };
  const repo: AgentRepository = {
    transaction: async (_session, _documentId, work) => {
      const result = queue.then(() => work(tx));
      queue = result.catch(() => undefined);
      return result;
    },
    getTask: async (_session, _documentId, id) => structuredClone(tasks.get(id) ?? null),
    listTasks: async () => structuredClone([...tasks.values()]),
    listEvents: async () => [], getReceipt: async () => null,
  };
  return { repo, tasks };
}

function doneEvents(name = "finish_task"): ProviderEvent[] {
  return [
    { type: "tool-call", toolCallId: "call-1", name, args: {} },
    { type: "finish", reason: "tool-calls", usage: { status: "known", inputTokens: 20, outputTokens: 5 } },
  ];
}

function harness(provider: AgentProvider, overrides: Partial<TaskTools> = {}) {
  const fixture = repositoryFixture();
  let clock = Date.now();
  const calls: string[] = [];
  const tools: TaskTools = {
    definitions: { finish_task: { description: "Finish verified work", inputSchema: { type: "object" } } },
    context: async () => "Synthetic task context. Use finish_task to verify acceptance.",
    execute: async (call) => { calls.push(call.name); return { output: { verified: true }, halt: "completed" }; },
    ...overrides,
  };
  const config = loadAgentConfig({ OPFORJA_AGENT_ENABLED: "true", OPFORJA_AGENT_API_KEY: "synthetic-test-key" });
  const runtime = new TaskRuntime({ repository: fixture.repo, provider, tools, config, now: () => clock });
  return { ...fixture, runtime, calls, config, advance: (ms: number) => { clock += ms; } };
}

function deferred() {
  let release!: () => void;
  const promise = new Promise<void>((resolve) => { release = resolve; });
  return { promise, release };
}

describe("integrated task runtime", () => {
  test("output truncation preserves measured usage but dispatches no candidate tools", async () => {
    const h = harness({ async *stream() {
      yield { type: "tool-call", toolCallId: "looks-complete", name: "finish_task", args: {} };
      yield { type: "finish", reason: "length", usage: { status: "known", inputTokens: 20, outputTokens: 100 } };
    } });
    const task = await h.runtime.start(session, input);
    await h.runtime.wait(task.id);
    expect(h.calls).toHaveLength(0);
    expect(h.tasks.get(task.id)).toMatchObject({ status: "suspended", reason: "incomplete-turn", usage: { outputTokens: 100, usageUnknown: false } });
  });

  test("only an explicit budget extension resumes a quota stop and keeps prior consumption", async () => {
    let turn = 0;
    const h = harness({ async *stream() { yield* doneEvents(++turn === 1 ? "inspect" : "finish_task"); } }, {
      execute: async (call) => call.name === "finish_task" ? { output: {}, halt: "completed" } : { output: { inspected: true } },
    });
    h.config.budget.maxModelCalls = 1;
    const started = await h.runtime.start(session, input);
    await h.runtime.wait(started.id);
    const priorCost = h.tasks.get(started.id)!.usage.estimatedUsd;
    await expect(h.runtime.continue(session, input.documentId, started.id)).rejects.toThrow("presupuesto");
    await h.runtime.continue(session, input.documentId, started.id, undefined, false, true);
    await h.runtime.wait(started.id);
    expect(h.tasks.get(started.id)).toMatchObject({ status: "completed", budget: { maxModelCalls: 2 }, usage: { modelCalls: 2 } });
    expect(h.tasks.get(started.id)!.usage.estimatedUsd).toBeGreaterThan(priorCost);
  });

  test("expired controller presence blocks a completed provider turn before tool dispatch", async () => {
    let advance = (_milliseconds: number) => {};
    const h = harness({ async *stream() { advance(46_000); yield* doneEvents(); } });
    advance = h.advance;
    const task = await h.runtime.start(session, input);
    await h.runtime.wait(task.id);
    expect(h.calls).toHaveLength(0);
    expect(h.tasks.get(task.id)).toMatchObject({ status: "suspended", reason: "controller-or-lease-expired", usage: { usageUnknown: false, modelCalls: 1 } });
  });

  test("a truncated stream never executes a previously emitted tool call", async () => {
    const h = harness({ async *stream() {
      yield { type: "tool-call", toolCallId: "partial-turn", name: "finish_task", args: {} };
      yield { type: "error", error: { code: "stream-truncated", message: "Interrupted" } };
    } });
    const task = await h.runtime.start(session, input);
    await h.runtime.wait(task.id);
    expect(h.calls).toEqual([]);
    expect(h.tasks.get(task.id)?.status).toBe("suspended");
    expect(h.tasks.get(task.id)?.usage.usageUnknown).toBe(true);
    expect(h.tasks.get(task.id)!.usage.estimatedUsd).toBeGreaterThan(0);
  });

  test("completion requires a verified tool outcome, not the end of a stream", async () => {
    const h = harness({ async *stream() { yield* doneEvents(); } });
    const task = await h.runtime.start(session, input);
    await h.runtime.wait(task.id);
    expect(h.calls).toEqual(["finish_task"]);
    expect(h.tasks.get(task.id)?.status).toBe("completed");
    expect(h.tasks.get(task.id)?.usage).toMatchObject({ inputTokens: 20, outputTokens: 5, usageUnknown: false });
    const plain = harness({ async *stream() {
      yield { type: "finish", reason: "stop", usage: { status: "known", inputTokens: 10, outputTokens: 10 } };
    } });
    const other = await plain.runtime.start(session, input);
    await plain.runtime.wait(other.id);
    expect(plain.tasks.get(other.id)).toMatchObject({ status: "suspended", reason: "result-not-verified" });
  });

  test("stop wins over an in-flight provider result and preserves accounting", async () => {
    const started = deferred();
    const finish = deferred();
    const h = harness({ async *stream() {
      started.release(); await finish.promise; yield* doneEvents();
    } });
    const task = await h.runtime.start(session, input);
    await started.promise;
    await h.runtime.stop(session, input.documentId, task.id);
    finish.release();
    await h.runtime.wait(task.id);
    expect(h.calls).toEqual([]);
    expect(h.tasks.get(task.id)).toMatchObject({ status: "cancelled", usage: { inputTokens: 20, outputTokens: 5 } });
  });

  test("steering retains the task and rejects tools from the old intent version", async () => {
    const started = deferred();
    const finish = deferred();
    let turns = 0;
    const messages: readonly ProviderMessage[][] = [];
    const h = harness({ async *stream(request) {
      (messages as ProviderMessage[][]).push([...request.messages]);
      if (++turns === 1) { started.release(); await finish.promise; }
      yield* doneEvents();
    } });
    const task = await h.runtime.start(session, input);
    await started.promise;
    const corrected = await h.runtime.instruct(session, input.documentId, task.id, "El retiro no necesita repartidor", 1);
    expect(corrected.id).toBe(task.id);
    finish.release();
    await h.runtime.wait(task.id);
    expect(turns).toBe(2);
    expect(h.calls).toEqual(["finish_task"]);
    expect(h.tasks.get(task.id)).toMatchObject({ status: "completed", intent: { version: 2, authority: "propose" } });
    expect(messages[1]?.some((message) => message.role === "user" && message.content.includes("no necesita repartidor"))).toBe(true);
  });

  test("a task budget stops another model call without discarding its outcome", async () => {
    const h = harness({ async *stream() { yield* doneEvents("read_context"); } }, {
      execute: async () => ({ output: { read: true } }),
    });
    h.config.budget.maxModelCalls = 1;
    const task = await h.runtime.start(session, input);
    await h.runtime.wait(task.id);
    expect(h.tasks.get(task.id)).toMatchObject({ status: "suspended", reason: "model-call-budget", usage: { modelCalls: 1 } });
  });

  test("a halted tool batch records unexecuted calls explicitly for a valid continuation", async () => {
    const h = harness({ async *stream() {
      yield { type: "tool-call", toolCallId: "decision", name: "ask_decision", args: {} };
      yield { type: "tool-call", toolCallId: "unexecuted", name: "apply_change", args: {} };
      yield doneEvents()[1]!;
    } }, { execute: async () => ({ output: { question: "Qué ruta" }, halt: "awaiting-decision" }) });
    const task = await h.runtime.start(session, input);
    await h.runtime.wait(task.id);
    const record = h.tasks.get(task.id)!;
    expect(record.status).toBe("awaiting-decision");
    expect(record.transcript.some((message) => message.role === "tool" && message.toolCallId === "unexecuted" && message.content.includes("not-completed"))).toBe(true);
  });

  test("external agent credentials cannot grant themselves integrated task authority", async () => {
    const h = harness({ async *stream() { yield* doneEvents(); } });
    await expect(h.runtime.start({ ...session, authKind: "agent" }, input)).rejects.toThrow();
    expect(h.tasks.size).toBe(0);
  });
});
