import type { Id } from "../modelo/tipos";
import type { SemanticChangeBatch, SemanticOperation } from "../modelo/changes/types";

export type { SemanticOperation } from "../modelo/changes/types";

export type Target =
  | { kind: "current"; documentId: string }
  | { kind: "variant"; documentId: string; variantId: string };

export interface Base {
  revision: number;
  semanticHash: string;
  workingCopyHash: string;
  clientSequence: number;
  profileVersion: string;
}

export interface Dependency {
  kind: "element" | "source" | "assumption" | "decision";
  id: string;
  version: string;
}

export interface TaskIntent {
  id: string;
  version: number;
  target: Target;
  outcome: string;
  scopeIds: string[];
  exclusions: string[];
  allowedSourceIds: string[];
  sufficiency: string[];
  authority: "read" | "propose" | "edit";
  authorizationVersion: number;
  rejectedAlternatives: Array<{ description: string; reason: string }>;
}

export interface ChangeSet extends SemanticChangeBatch {
  taskId: string | null;
  actorId: string;
  intentVersion: number | null;
  target: Target;
  base: Base;
  readIds: Id[];
  writeIds: Id[];
  dependencies: Dependency[];
  explanation: string;
}

export interface CommitReceipt {
  changeId: Id;
  target: Target;
  previousRevision: number;
  revision: number;
  appliedOperationIds: string[];
  inverseId: Id;
}

export interface TaskEvent {
  id: Id;
  taskId: Id;
  sequence: number;
  kind: "status" | "result" | "decision" | "committed" | "invalidated";
  revision: number | null;
  resultId: Id | null;
}
