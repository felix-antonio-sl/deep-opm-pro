/** Task lifecycle shared by the server and its browser projection. */
export type TaskStatus =
  | "preparing"
  | "working"
  | "awaiting-decision"
  | "suspended"
  | "completed"
  | "cancelled"
  | "failed";

const transitions: Record<TaskStatus, readonly TaskStatus[]> = {
  preparing: ["working", "suspended", "cancelled", "failed"],
  working: ["awaiting-decision", "suspended", "completed", "cancelled", "failed"],
  "awaiting-decision": ["preparing", "suspended", "cancelled"],
  suspended: ["preparing", "cancelled"],
  completed: [],
  cancelled: [],
  failed: [],
};

export function isTerminalTask(status: TaskStatus): boolean {
  return status === "completed" || status === "cancelled" || status === "failed";
}

export function canTransitionTask(from: TaskStatus, to: TaskStatus): boolean {
  return from === to || transitions[from].includes(to);
}

export function taskStatusLabel(status: TaskStatus): string {
  const labels: Record<TaskStatus, string> = {
    preparing: "Preparando",
    working: "Trabajando",
    "awaiting-decision": "Necesita una decisión",
    suspended: "Suspendido",
    completed: "Completado",
    cancelled: "Detenido",
    failed: "No se pudo completar",
  };
  return labels[status];
}

export interface TaskBudget {
  maxModelCalls: number;
  maxToolCalls: number;
  maxInputTokens: number;
  maxOutputTokens: number;
  maxTaskUsd: number;
  timeoutMs: number;
}

export interface TaskUsage {
  modelCalls: number;
  toolCalls: number;
  inputTokens: number;
  outputTokens: number;
  estimatedUsd: number;
  activeMs: number;
  /** Unknown usage holds the task for explicit recovery, never counts as zero. */
  usageUnknown: boolean;
}

export const DEFAULT_TASK_BUDGET: Readonly<TaskBudget> = {
  maxModelCalls: 12,
  maxToolCalls: 40,
  maxInputTokens: 120_000,
  maxOutputTokens: 16_000,
  maxTaskUsd: 1,
  timeoutMs: 600_000,
};

export function emptyTaskUsage(): TaskUsage {
  return {
    modelCalls: 0,
    toolCalls: 0,
    inputTokens: 0,
    outputTokens: 0,
    estimatedUsd: 0,
    activeMs: 0,
    usageUnknown: false,
  };
}

export function exhaustedTaskBudget(budget: TaskBudget, usage: TaskUsage): string | null {
  if (usage.usageUnknown) return "usage-unavailable";
  if (usage.modelCalls >= budget.maxModelCalls) return "model-call-budget";
  if (usage.toolCalls >= budget.maxToolCalls) return "tool-call-budget";
  if (usage.inputTokens >= budget.maxInputTokens) return "input-token-budget";
  if (usage.outputTokens >= budget.maxOutputTokens) return "output-token-budget";
  if (usage.estimatedUsd >= budget.maxTaskUsd) return "cost-budget";
  if (usage.activeMs >= budget.timeoutMs) return "time-budget";
  return null;
}
