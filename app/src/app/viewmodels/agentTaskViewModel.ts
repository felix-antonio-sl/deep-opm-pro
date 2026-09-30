import { useEffect, useState } from "preact/hooks";
import type { TaskStatus } from "../../agent/taskState";
import { taskStatusLabel } from "../../agent/taskState";
import type { AgentTaskPort, AgentTaskSnapshot } from "../ports/agentTaskPort";

export interface AgentTaskViewModel extends AgentTaskSnapshot {
  statusLabel: string;
  targetLabel: string;
  canStart: boolean;
  canCorrect: boolean;
  canContinue: boolean;
  canExtendBudget: boolean;
  canStop: boolean;
  canApply: boolean;
  canUndo: boolean;
  canReapply: boolean;
  showWorkingIndicator: boolean;
  hasDecision: boolean;
}

export function projectAgentTask(snapshot: AgentTaskSnapshot): AgentTaskViewModel {
  const task = snapshot.activeTask;
  const status = task?.status ?? null;
  const terminal = status === "completed" || status === "cancelled" || status === "failed";
  const active = status !== null && !terminal;
  const ready = snapshot.phase === "ready" && snapshot.action === null;
  return {
    ...snapshot,
    statusLabel: snapshot.phase === "loading"
      ? "Conectando"
      : snapshot.phase === "unavailable"
        ? "Agente no disponible"
        : status ? taskStatusLabel(status) : "Sin encargo activo",
    targetLabel: task?.intent.target.kind === "variant" ? "Variante" : task ? "Documento vigente" : "",
    canStart: ready && !active,
    canCorrect: ready && active,
    canContinue: ready && (status === "suspended" || status === "awaiting-decision"),
    canExtendBudget: ready && status === "suspended" && !!task?.reason?.includes("budget") && !!snapshot.availability?.budgetIncrement,
    canStop: ready && active,
    canApply: ready && !!snapshot.change?.diff && snapshot.change.status === "prepared" && task?.intent.authority === "propose",
    canUndo: ready && !!snapshot.lastAppliedChangeId,
    canReapply: ready && !!snapshot.lastUndoneChangeId,
    showWorkingIndicator: status === "preparing" || status === "working",
    hasDecision: !!task?.pendingDecision,
  };
}

export function useAgentTaskViewModel(port: AgentTaskPort | null): AgentTaskViewModel {
  const [snapshot, setSnapshot] = useState<AgentTaskSnapshot>(() => port?.snapshot() ?? emptySnapshot());
  useEffect(() => {
    if (!port) {
      setSnapshot(emptySnapshot());
      return;
    }
    setSnapshot(port.snapshot());
    const unsubscribe = port.subscribe(() => setSnapshot(port.snapshot()));
    void port.open();
    return unsubscribe;
  }, [port]);
  return projectAgentTask(snapshot);
}

function emptySnapshot(): AgentTaskSnapshot {
  return {
    documentId: "",
    phase: "unavailable",
    availability: null,
    tasks: [],
    activeTask: null,
    change: null,
    preparedChange: null,
    cursor: 0,
    action: null,
    error: null,
    pendingEdits: 0,
    pendingConflicts: 0,
    conflicts: [],
    lastAppliedChangeId: null,
    lastUndoneChangeId: null,
  };
}

export function isActiveTaskStatus(status: TaskStatus): boolean {
  return status === "preparing" || status === "working" || status === "awaiting-decision" || status === "suspended";
}
