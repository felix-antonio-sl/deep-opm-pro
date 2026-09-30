import { describe, expect, test } from "bun:test";
import type { TaskView } from "../../agent/taskView";
import type { AgentTaskSnapshot } from "../ports/agentTaskPort";
import { projectAgentTask } from "./agentTaskViewModel";

const task: TaskView = {
  id: "task-1",
  documentId: "doc-1",
  status: "working",
  reason: null,
  intent: {
    id: "task-1", version: 1, target: { kind: "variant", documentId: "doc-1", variantId: "v1" },
    outcome: "Completar Entregar", scopeIds: ["p1"], exclusions: [], allowedSourceIds: [], sufficiency: [],
    authority: "propose", authorizationVersion: 1, rejectedAlternatives: [],
  },
  createdAt: "2026-09-23T00:00:00.000Z",
  updatedAt: "2026-09-23T00:00:00.000Z",
  budget: { maxModelCalls: 12, maxToolCalls: 40, maxInputTokens: 120_000, maxOutputTokens: 16_000, maxTaskUsd: 1, timeoutMs: 600_000 },
  usage: { modelCalls: 1, toolCalls: 2, inputTokens: 100, outputTokens: 20, estimatedUsd: 0.001, activeMs: 20, usageUnknown: false },
  model: "test-model",
  results: [],
  pendingDecision: null,
  pendingCommit: null,
  controller: null,
};

function snapshot(overrides: Partial<AgentTaskSnapshot> = {}): AgentTaskSnapshot {
  return {
    documentId: "doc-1", phase: "ready", availability: { available: true, reason: null, profile: {}, model: "test-model" },
    tasks: [], activeTask: null, change: null, preparedChange: null, cursor: 0, action: null, error: null,
    pendingEdits: 0, pendingConflicts: 0, conflicts: [],
    lastAppliedChangeId: null, lastUndoneChangeId: null, ...overrides,
  };
}

describe("agentTaskViewModel", () => {
  test("allows a first task only when the service is available and idle", () => {
    expect(projectAgentTask(snapshot()).canStart).toBe(true);
    expect(projectAgentTask(snapshot({ phase: "unavailable" })).canStart).toBe(false);
    expect(projectAgentTask(snapshot({ action: "starting" })).canStart).toBe(false);
  });

  test("projects a running proposal with correction, stop, target and working indicator", () => {
    const view = projectAgentTask(snapshot({ activeTask: task }));
    expect(view.statusLabel).toBe("Trabajando");
    expect(view.targetLabel).toBe("Variante");
    expect(view.canCorrect).toBe(true);
    expect(view.canStop).toBe(true);
    expect(view.showWorkingIndicator).toBe(true);
    expect(view.canContinue).toBe(false);
  });

  test("suspended and decision-waiting tasks continue without being treated as stopped", () => {
    for (const status of ["suspended", "awaiting-decision"] as const) {
      const view = projectAgentTask(snapshot({ activeTask: { ...task, status } }));
      expect(view.canContinue).toBe(true);
      expect(view.canStop).toBe(true);
      expect(view.canCorrect).toBe(true);
    }
  });

  test("budget extension appears only for a known budget suspension with a published increment", () => {
    const suspended = { ...task, status: "suspended" as const, reason: "cost-budget" };
    const configured = {
      available: true, reason: null, profile: {}, model: "test-model",
      budgetIncrement: { maxModelCalls: 12, maxToolCalls: 40, maxInputTokens: 120_000, maxOutputTokens: 16_000, maxTaskUsd: 1, timeoutMs: 600_000 },
    };
    expect(projectAgentTask(snapshot({ activeTask: suspended, availability: configured })).canExtendBudget).toBe(true);
    expect(projectAgentTask(snapshot({ activeTask: suspended })).canExtendBudget).toBe(false);
    expect(projectAgentTask(snapshot({ activeTask: { ...suspended, reason: "usage-unavailable" }, availability: configured })).canExtendBudget).toBe(false);
  });

  test("terminal tasks permit a new task and expose exact undo or reapply affordance", () => {
    const completed = projectAgentTask(snapshot({
      activeTask: { ...task, status: "completed" }, lastAppliedChangeId: "change-1",
    }));
    expect(completed.canStart).toBe(true);
    expect(completed.canCorrect).toBe(false);
    expect(completed.canStop).toBe(false);
    expect(completed.canUndo).toBe(true);
    expect(completed.canReapply).toBe(false);

    const undone = projectAgentTask(snapshot({ lastUndoneChangeId: "change-1" }));
    expect(undone.canReapply).toBe(true);
  });

  test("only a prepared proposal can be manually applied", () => {
    const proposal = { ...task, status: "awaiting-decision" as const, pendingCommit: { changeId: "change-1" } };
    const baseChange = { change: { id: "change-1", taskId: "task-1", actorId: "u", intentVersion: 1,
      target: task.intent.target, base: { revision: 1, semanticHash: "s", workingCopyHash: "w", clientSequence: 0, profileVersion: "v" },
      readIds: [], writeIds: [], dependencies: [], explanation: "", operations: [] }, status: "prepared" as const,
      diff: { changes: [], opl: [] } };
    expect(projectAgentTask(snapshot({ activeTask: proposal, change: baseChange })).canApply).toBe(true);
    expect(projectAgentTask(snapshot({ activeTask: { ...proposal, intent: { ...proposal.intent, authority: "edit" } }, change: baseChange })).canApply).toBe(false);
    expect(projectAgentTask(snapshot({ activeTask: proposal, change: { ...baseChange, status: "rejected" } })).canApply).toBe(false);
  });

  test("disabled service remains an explicit unavailable state", () => {
    const view = projectAgentTask(snapshot({ phase: "unavailable", availability: { available: false, reason: "Runtime no configurado", profile: {}, model: "" } }));
    expect(view.statusLabel).toBe("Agente no disponible");
    expect(view.canStart).toBe(false);
  });
});
