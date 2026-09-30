import type { Base, CommitReceipt, TaskIntent } from "./contracts";
import type { TaskBudget, TaskStatus, TaskUsage } from "./taskState";
import type { SemanticInverse } from "../modelo/changes/types";

export interface StartTaskRequest {
  documentId: string;
  outcome: string;
  scopeIds: string[];
  allowedSourceIds: string[];
  exclusions: string[];
  sufficiency: string[];
  authority: "read" | "propose" | "edit";
  controllerId: string;
  clientSequence: number;
  workingCopyHash: string;
}

/** Browser projection: no service credentials, provider transcript, or worker lease. */
export interface TaskView {
  id: string;
  documentId: string;
  status: TaskStatus;
  reason: string | null;
  intent: TaskIntent;
  createdAt: string;
  updatedAt: string;
  budget: TaskBudget;
  usage: TaskUsage;
  model: string;
  results: Array<{ id: string; kind: "proposal" | "answer" | "warning"; payload: unknown; createdAt: string }>;
  pendingDecision: unknown;
  pendingCommit: { changeId: string } | null;
  controller: { id: string; expiresAt: string } | null;
}

export interface AppliedChangeView {
  kind: "committed";
  receipt: CommitReceipt;
  modelJson: string;
  base: Base;
  inverse: SemanticInverse;
}
