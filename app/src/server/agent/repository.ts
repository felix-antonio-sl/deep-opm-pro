import type { Base, ChangeSet, CommitReceipt, Dependency, Target, TaskEvent, TaskIntent } from "../../agent/contracts";
import type { TaskBudget, TaskStatus, TaskUsage } from "../../agent/taskState";
import type { JsonValue, ProviderMessage, ProviderProfile } from "./provider";
import type { SemanticInverse } from "../../modelo/changes/types";
import type { Modelo } from "../../modelo/tipos";
import type { ModeloPersistido } from "../../persistencia/modelos";
import type { PersistenciaSesion } from "../modelPersistence";
import type { CommitGrantRecord } from "./commitGrant";
import type { TaskSource } from "./sourceAccess";

export interface AgentDocumentSnapshot {
  model: ModeloPersistido;
  /** JSON selected by the same timestamp rule as the existing mesa base witness. */
  effectiveJson: string;
  effectiveModel: Modelo;
  semanticHash: string;
  source: "saved" | "autosave";
  autosaveCreatedAt: string | null;
  writable: boolean;
}

export interface AgentTaskController {
  id: string;
  expiresAt: string;
  clientSequence: number;
  workingCopyHash: string;
}

export interface AgentTaskLease {
  owner: string | null;
  fence: number;
  expiresAt: string | null;
}

export interface AgentTaskResult {
  id: string;
  kind: "proposal" | "answer" | "warning";
  payload: JsonValue;
  createdAt: string;
}

/** Durable runtime state. Reasoning text is intentionally not a required field. */
export interface AgentTaskRecord {
  id: string;
  tenantId: string;
  documentId: string;
  actorId: string;
  status: TaskStatus;
  reason: string | null;
  intent: TaskIntent;
  createdAt: string;
  updatedAt: string;
  budget: TaskBudget;
  usage: TaskUsage;
  profile: ProviderProfile;
  transcript: ProviderMessage[];
  controller: AgentTaskController | null;
  lease: AgentTaskLease;
  results: AgentTaskResult[];
  pendingDecision: JsonValue | null;
  pendingCommit: { changeId: string } | null;
  /** Captured by source-reading tools; optional for tasks that use model-only context. */
  dependencies?: Dependency[];
  /** Explicitly included sources; never populated by following embedded links. */
  sources?: TaskSource[];
}

export type AgentChangeStatus = "prepared" | "committed" | "rejected";

export interface AgentChangeRecord {
  change: ChangeSet;
  requestHash: string;
  /** Present only for a server-derived inverse; never accepted as client data. */
  undoOf?: string;
  /** The committed inverse, kept atomically for undo/reapply after reopening. */
  reversedBy?: string;
  status: AgentChangeStatus;
  createdAt: string;
  receipt: CommitReceipt | null;
  inverse: SemanticInverse | null;
  grant: CommitGrantRecord | null;
}

export interface AgentVariantRecord {
  id: string;
  tenantId: string;
  documentId: string;
  taskId: string | null;
  base: Base;
  operations: ChangeSet["operations"];
  createdAt: string;
  updatedAt: string;
  state: "open" | "incorporated" | "discarded";
}

export interface AgentTransaction {
  getDocument(): Promise<AgentDocumentSnapshot | null>;
  /** Compare-and-swap on the single canonical opforja_models row. */
  putModel(model: ModeloPersistido, expectedRevision: number): Promise<ModeloPersistido>;
  getTask(taskId: string): Promise<AgentTaskRecord | null>;
  putTask(task: AgentTaskRecord): Promise<void>;
  getChange(changeId: string): Promise<AgentChangeRecord | null>;
  putChange(change: AgentChangeRecord): Promise<void>;
  getVariant(variantId: string): Promise<AgentVariantRecord | null>;
  putVariant(variant: AgentVariantRecord): Promise<void>;
  getGrant(changeId: string): Promise<CommitGrantRecord | null>;
  putGrant(changeId: string, grant: CommitGrantRecord | null): Promise<void>;
  appendEvent(event: Omit<TaskEvent, "sequence">): Promise<TaskEvent>;
}

export interface AgentRepository {
  /**
   * Serializes every agent mutation for a document. PostgreSQL takes the same
   * row lock used by legacy save/autosave/commit; callbacks must remain local
   * and bounded and never call a model provider.
   */
  transaction<T>(
    session: PersistenciaSesion,
    documentId: string,
    work: (tx: AgentTransaction) => Promise<T>,
  ): Promise<T>;
  getTask(session: PersistenciaSesion, documentId: string, taskId: string): Promise<AgentTaskRecord | null>;
  listTasks(session: PersistenciaSesion, documentId: string): Promise<AgentTaskRecord[]>;
  listEvents(
    session: PersistenciaSesion,
    documentId: string,
    taskId: string,
    after: number,
  ): Promise<TaskEvent[]>;
  getReceipt(
    session: PersistenciaSesion,
    target: Target,
    changeId: string,
  ): Promise<CommitReceipt | null>;
  deleteDocument?(session: PersistenciaSesion, documentId: string): Promise<void>;
}

export function assertAgentTaskScope(
  task: AgentTaskRecord,
  session: PersistenciaSesion,
  documentId: string,
): void {
  if (task.tenantId !== session.tenantId || task.documentId !== documentId || task.actorId !== session.userId) {
    throw new Error("Tarea no disponible");
  }
}
