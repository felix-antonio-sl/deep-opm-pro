import { describe, expect, test } from "bun:test";
import {
  canTransitionTask,
  DEFAULT_TASK_BUDGET,
  emptyTaskUsage,
  exhaustedTaskBudget,
  isTerminalTask,
} from "./taskState";

describe("integrated task lifecycle", () => {
  test("a completed stream cannot implicitly resume a terminal task", () => {
    for (const status of ["completed", "cancelled", "failed"] as const) {
      expect(isTerminalTask(status)).toBe(true);
      expect(canTransitionTask(status, "working")).toBe(false);
      expect(canTransitionTask(status, "preparing")).toBe(false);
    }
  });

  test("resuming work first revalidates in preparing; cancellation remains available", () => {
    for (const status of ["suspended", "awaiting-decision"] as const) {
      expect(canTransitionTask(status, "preparing")).toBe(true);
      expect(canTransitionTask(status, "working")).toBe(false);
      expect(canTransitionTask(status, "cancelled")).toBe(true);
    }
  });

  test("unknown accounting suspends rather than granting a fresh budget", () => {
    expect(exhaustedTaskBudget(DEFAULT_TASK_BUDGET, emptyTaskUsage())).toBeNull();
    expect(exhaustedTaskBudget(DEFAULT_TASK_BUDGET, {
      ...emptyTaskUsage(), usageUnknown: true,
    })).toBe("usage-unavailable");
    expect(exhaustedTaskBudget(DEFAULT_TASK_BUDGET, {
      ...emptyTaskUsage(), modelCalls: 12,
    })).toBe("model-call-budget");
    expect(exhaustedTaskBudget(DEFAULT_TASK_BUDGET, {
      ...emptyTaskUsage(), estimatedUsd: 1,
    })).toBe("cost-budget");
  });
});
