import { describe, expect, test } from "bun:test";
import type { TaskEvent } from "../../agent/contracts";
import type { TaskView } from "../../agent/taskView";
import type { AgentClient, AgentAvailability, AgentChangeView } from "../../persistencia/agentClient";
import { createAgentTaskPort } from "./agentTaskPort";
import type { DocumentOperationConflict, DocumentOperationsPort, DocumentOperationsState } from "./documentOperationsPort";

const availability: AgentAvailability = { available: true, reason: null, profile: {}, model: "test-model" };

function task(status: TaskView["status"]): TaskView {
  return {
    id: "task-1", documentId: "doc-1", status, reason: null,
    intent: {
      id: "intent-1", version: 1, target: { kind: "current", documentId: "doc-1" }, outcome: "Completar el modelo",
      scopeIds: ["opd-1"], exclusions: [], allowedSourceIds: [], sufficiency: [], authority: "propose",
      authorizationVersion: 1, rejectedAlternatives: [],
    },
    createdAt: "2026-09-23T00:00:00.000Z", updatedAt: "2026-09-23T00:00:00.000Z",
    budget: { maxModelCalls: 12, maxToolCalls: 40, maxInputTokens: 120_000, maxOutputTokens: 16_000, maxTaskUsd: 1, timeoutMs: 600_000 },
    usage: { modelCalls: 0, toolCalls: 0, inputTokens: 0, outputTokens: 0, estimatedUsd: 0, activeMs: 0, usageUnknown: false },
    model: "test-model", results: [], pendingDecision: null, pendingCommit: null,
    controller: { id: "controller-1", expiresAt: "2026-09-23T00:10:00.000Z" },
  };
}

function operations(): DocumentOperationsPort {
  const base = { revision: 1, semanticHash: "semantic", workingCopyHash: "working", clientSequence: 0, profileVersion: "profile" };
  return {
    snapshot: () => ({ documentId: "doc-1", controllerId: "controller-1", clientSequence: 0, base, workingCopyHash: base.workingCopyHash, reservation: null, pendingEdits: 0, pendingConflicts: 0 }),
    subscribe: () => () => undefined,
    onPendingCommit: () => () => undefined,
    listConflicts: () => [],
    submit: () => ({ kind: "rejected", validation: { kind: "rejected", code: "invalid-change", message: "unused", references: [] } }),
    flush: async () => base,
    prepareCommit: async () => { throw new Error("unused"); },
    commit: async () => ({ kind: "rejected", reason: "unused" }),
    reconcile: async () => ({ kind: "rejected", reason: "unused" }),
    resolveUnknown: async () => ({ kind: "unknown" }),
    undo: async () => ({ kind: "rejected", reason: "unused" }),
    reapply: async () => ({ kind: "rejected", reason: "unused" }),
    dispose: () => undefined,
  } as unknown as DocumentOperationsPort;
}

function client(overrides: Partial<AgentClient>): AgentClient {
  return {
    status: async () => availability,
    listTasks: async () => [],
    getTask: async () => ({ task: task("working"), cursor: 0 }),
    startTask: async () => task("working"),
    instruct: async () => task("working"),
    continueTask: async () => task("working"),
    stop: async () => task("cancelled"),
    presence: async (_documentId, _taskId, _input) => task("working"),
    getChange: async () => { throw new Error("unused"); },
    prepareChange: async () => { throw new Error("unused"); },
    prepareUndo: async () => { throw new Error("unused"); },
    prepareReapply: async () => { throw new Error("unused"); },
    grant: async () => { throw new Error("unused"); },
    commit: async () => { throw new Error("unused"); },
    getReceipt: async () => ({ receipt: null, applied: null }),
    resolveReceipt: async () => null,
    subscribeEvents: async () => undefined,
    ...overrides,
  };
}

function event(sequence: number): TaskEvent {
  return { id: `event-${sequence}`, taskId: "task-1", sequence, kind: "status", revision: null, resultId: null };
}

function until(predicate: () => boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const check = () => {
      if (predicate()) return resolve();
      if (Date.now() - started > 1_000) return reject(new Error("condition was not reached"));
      setTimeout(check, 0);
    };
    check();
  });
}

function untilAbort(signal: AbortSignal): Promise<void> {
  if (signal.aborted) return Promise.resolve();
  return new Promise((resolve) => signal.addEventListener("abort", () => resolve(), { once: true }));
}

describe("AgentTaskPort event lifecycle", () => {
  test("a terminal snapshot after an event stops the stream without reconnecting", async () => {
    let taskReads = 0;
    let subscriptions = 0;
    let heartbeatCalls = 0;
    const port = createAgentTaskPort({
      documentId: "doc-1",
      operations: operations(),
      client: client({
        listTasks: async () => [task("working")],
        getTask: async () => ({ task: task(++taskReads === 1 ? "working" : "completed"), cursor: taskReads - 1 }),
        presence: async () => { heartbeatCalls++; return task("working"); },
        subscribeEvents: async ({ onEvent, signal }) => { subscriptions++; onEvent(event(1)); await untilAbort(signal); },
      }),
    });

    await port.open();
    await until(() => port.snapshot().activeTask?.status === "completed");
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(subscriptions).toBe(1);
    expect(heartbeatCalls).toBe(1);
    port.dispose();
  });

  test("a required snapshot refreshes the cursor before reconnecting", async () => {
    let taskReads = 0;
    let subscriptions = 0;
    const cursors: number[] = [];
    const port = createAgentTaskPort({
      documentId: "doc-1",
      operations: operations(),
      client: client({
        listTasks: async () => [task("working")],
        getTask: async () => ({ task: task("working"), cursor: taskReads++ === 0 ? 0 : 4 }),
        subscribeEvents: async ({ after, onSnapshotRequired, signal }) => {
          subscriptions++;
          cursors.push(after);
          if (subscriptions === 1) { onSnapshotRequired(); return; }
          await untilAbort(signal);
        },
      }),
    });

    await port.open();
    await until(() => subscriptions >= 2);
    expect(cursors).toEqual([0, 4]);
    port.dispose();
  });

  test("a completed proposal remains reviewable, and a committed proposal is not resurfaced", async () => {
    const proposalTask = {
      ...task("completed"),
      results: [{
        id: "proposal-result", kind: "proposal" as const, createdAt: "2026-09-23T00:01:00.000Z",
        payload: { kind: "proposal", changeId: "candidate-1" },
      }],
    };
    const proposal = {
      change: {
        id: "candidate-1", taskId: proposalTask.id, actorId: "user-1", intentVersion: 1,
        target: proposalTask.intent.target,
        base: { revision: 1, semanticHash: "semantic", workingCopyHash: "working", clientSequence: 0, profileVersion: "profile" },
        readIds: [], writeIds: [], dependencies: [], explanation: "Crea el objeto requerido.", operations: [],
      },
      status: "prepared" as const, diff: { changes: [], opl: [] },
    } satisfies AgentChangeView;
    let changeReads = 0;
    const port = createAgentTaskPort({
      documentId: "doc-1", operations: operations(),
      client: client({
        listTasks: async () => [proposalTask],
        getTask: async () => ({ task: proposalTask, cursor: 2 }),
        getChange: async () => { changeReads++; return proposal; },
      }),
    });

    await port.open();
    expect(port.snapshot().change?.change.id).toBe("candidate-1");
    expect(changeReads).toBe(1);
    port.dispose();

    const committedTask = {
      ...proposalTask,
      results: [...proposalTask.results, {
        id: "committed-result", kind: "answer" as const, createdAt: "2026-09-23T00:02:00.000Z",
        payload: { kind: "committed-change", receipt: { changeId: "candidate-1" } },
      }],
    };
    changeReads = 0;
    const committedPort = createAgentTaskPort({
      documentId: "doc-1", operations: operations(),
      client: client({
        listTasks: async () => [committedTask],
        getTask: async () => ({ task: committedTask, cursor: 3 }),
        getChange: async () => { changeReads++; return proposal; },
      }),
    });

    await committedPort.open();
    expect(committedPort.snapshot().change).toBeNull();
    expect(changeReads).toBe(0);
    committedPort.dispose();
  });

  test("local pending edits and recoverable conflicts remain visible while the agent is unavailable", async () => {
    const ops = operations();
    let state: DocumentOperationsState = {
      ...ops.snapshot(), pendingEdits: 2, pendingConflicts: 0,
    };
    const operationsObserver: { current: ((value: DocumentOperationsState) => void) | null } = { current: null };
    let conflicts: DocumentOperationConflict[] = [];
    ops.snapshot = () => state;
    ops.subscribe = (listener) => { operationsObserver.current = listener; return () => { operationsObserver.current = null; }; };
    ops.listConflicts = () => conflicts;
    const port = createAgentTaskPort({
      documentId: "doc-1", operations: ops,
      client: client({ status: async () => ({ ...availability, available: false, reason: "Agente desactivado" }) }),
    });

    await port.open();
    expect(port.snapshot().phase).toBe("unavailable");
    expect(port.snapshot().pendingEdits).toBe(2);
    expect(port.snapshot().conflicts).toEqual([]);

    conflicts = [{ id: "local-conflict", reason: "La edición necesita resolverse sobre la nueva base", references: ["object-1"], recoveryJson: "{\"model\":true}" }];
    state = { ...state, pendingEdits: 1, pendingConflicts: 1 };
    operationsObserver.current?.(state);
    expect(port.snapshot().pendingEdits).toBe(1);
    expect(port.snapshot().pendingConflicts).toBe(1);
    expect(port.snapshot().conflicts[0]?.recoveryJson).toBe("{\"model\":true}");
    port.dispose();
  });
});
