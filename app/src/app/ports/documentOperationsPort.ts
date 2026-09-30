import type { Base, ChangeSet, CommitReceipt } from "../../agent/contracts";
import type { ChangeValidation, SemanticInverse } from "../../modelo/changes/types";
import type { Modelo } from "../../modelo/tipos";
import { validateInverse } from "../../modelo/changes/apply";
import { exportarModelo } from "../../serializacion/json";
import {
  documentIdForState,
  flushDocumentOperations,
  getDocumentOperationsController,
  getPendingDocumentConflicts,
  onIntentHistoryAction,
  onPendingCommit,
  obtenerEstadoStore,
  prepareDocumentCommit,
  reconcileDocumentCommit,
  releaseDocumentCommit,
  submitDocumentChange,
  type RuntimePendingCommit,
  type RuntimeReconcileResult,
} from "../../store/runtime";
import { intentHistory } from "../../store/intentHistory";
import { resolveCommitFailure, resolveUnknownReceipt, type DocumentOperationsController } from "../../store/documentOperations";

export type OperationPolicy = "review" | "delegated";

export interface DocumentOperationsState {
  documentId: string;
  controllerId: string;
  clientSequence: number;
  base: Base | null;
  workingCopyHash: string;
  reservation: null | {
    changeId: string;
    status: "preparing" | "granted" | "unknown";
    expiresAt: number | null;
  };
  pendingEdits: number;
  pendingConflicts: number;
}

export interface DocumentOperationConflict {
  id: string;
  reason: string;
  references: string[];
  recoveryJson: string;
}

export type SubmitChangeResult =
  | { kind: "applied"; changeId: string; sequence: number; model: Modelo; inverse: SemanticInverse }
  | { kind: "prepared"; pendingId: string }
  | { kind: "rejected"; validation: Extract<ChangeValidation, { kind: "rejected" }> };

export interface PreparedCommitResult<Grant> {
  kind: "prepared";
  grant: Grant;
  base: Base;
}

export interface CommitResponse {
  receipt: CommitReceipt;
  modelJson: string;
  base: Base;
  inverse: SemanticInverse;
}

export interface PendingCommitEvent extends RuntimePendingCommit {}
export type ReconcileResult = RuntimeReconcileResult;

export interface DocumentOperationsPort<Grant = unknown> {
  snapshot(): DocumentOperationsState;
  subscribe(listener: (state: DocumentOperationsState) => void): () => void;
  onPendingCommit(listener: (event: PendingCommitEvent) => void): () => void;
  listConflicts(): DocumentOperationConflict[];
  submit(change: ChangeSet): SubmitChangeResult;
  flush(): Promise<Base>;
  prepareCommit(change: ChangeSet, policy: OperationPolicy): Promise<PreparedCommitResult<Grant>>;
  /** Consumes the one-use grant, commits, and integrates or resolves the receipt. */
  commit(changeId: string): Promise<ReconcileResult>;
  reconcile(response: CommitResponse): Promise<ReconcileResult>;
  resolveUnknown(changeId: string): Promise<ReconcileResult | { kind: "unknown" }>;
  undo(changeId: string): Promise<ReconcileResult>;
  reapply(changeId: string): Promise<ReconcileResult>;
  dispose(): void;
}

export interface DocumentOperationsTransport<Grant = unknown> {
  prepareCommit(input: {
    documentId: string;
    change: ChangeSet;
    policy: OperationPolicy;
    controllerId: string;
    clientSequence: number;
    workingCopyHash: string;
  }): Promise<{ grant: Grant; expiresAt: string }>;
  commit(input: { documentId: string; changeId: string; grant: Grant }): Promise<CommitResponse>;
  resolveReceipt(input: { target: ChangeSet["target"]; changeId: string }): Promise<CommitResponse | null>;
  getChange?(input: { target: ChangeSet["target"]; changeId: string }): Promise<ChangeSet | null>;
  prepareUndo(input: {
    documentId: string;
    sourceChangeId: string;
    controllerId: string;
    clientSequence: number;
    workingCopyHash: string;
  }): Promise<{ change: ChangeSet }>;
  prepareReapply(input: {
    documentId: string;
    sourceChangeId: string;
    controllerId: string;
    clientSequence: number;
    workingCopyHash: string;
  }): Promise<{ change: ChangeSet }>;
}

/**
 * Adapts the one store-owned queue for an exact persisted-document/tab key.
 * The application supplies authenticated HTTP transport; this layer owns no
 * credentials and does not create a second queue.
 */
export function createDocumentOperationsPort<Grant = unknown>(
  documentId: string,
  transport: DocumentOperationsTransport<Grant>,
): DocumentOperationsPort<Grant> {
  const controller = getDocumentOperationsController(documentId) as DocumentOperationsController<Grant, unknown>;
  const listeners = new Set<(state: DocumentOperationsState) => void>();
  const pendingListeners = new Set<(event: PendingCommitEvent) => void>();
  let lastWorkingCopyHash = "";
  let disposed = false;

  const snapshot = (): DocumentOperationsState => {
    const state = controller.snapshot();
    const base = state.base;
    return {
      documentId,
      controllerId: state.controllerId,
      clientSequence: state.clientSequence,
      base,
      workingCopyHash: base?.workingCopyHash ?? lastWorkingCopyHash,
      reservation: state.reservation
        ? { changeId: state.reservation.changeId, status: state.reservation.status, expiresAt: state.reservation.expiresAt }
        : null,
      pendingEdits: state.pendingEdits.length,
      pendingConflicts: getPendingDocumentConflicts(documentId).length,
    };
  };
  const notify = () => {
    if (disposed) return;
    const next = snapshot();
    for (const listener of listeners) listener(next);
  };
  const applyResponse = async (response: CommitResponse): Promise<ReconcileResult> => {
    const result = reconcileDocumentCommit(response);
    if (result.kind !== "integrated") return result;
    lastWorkingCopyHash = response.base.workingCopyHash;
    notify();
    // After a clean integration, flush the rebased working copy so the next
    // task/presence is bound to its current server hash and local sequence.
    if (result.conflicts === 0 && getPendingDocumentConflicts(documentId).length === 0) {
      try { lastWorkingCopyHash = (await flushDocumentOperations(documentId)).workingCopyHash; } catch { /* Receipt is integrated; next explicit flush reports the persistence error. */ }
    }
    notify();
    return result;
  };

  const port: DocumentOperationsPort<Grant> = {
    snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    onPendingCommit(listener) {
      pendingListeners.add(listener);
      return () => pendingListeners.delete(listener);
    },
    listConflicts() {
      return getPendingDocumentConflicts(documentId).map((conflict) => ({
        id: conflict.pendingId,
        reason: conflict.reason ?? "La edición quedó en conflicto",
        references: [...(conflict.references ?? [])],
        recoveryJson: exportarModelo(conflict.candidate),
      }));
    },
    submit(change) {
      if (change.target.documentId !== documentId) {
        return { kind: "rejected", validation: { kind: "rejected", code: "invalid-change", message: "El cambio apunta a otro documento", references: [change.target.documentId] } };
      }
      const result = submitDocumentChange(documentId, change);
      notify();
      return result;
    },
    async flush() {
      const base = await flushDocumentOperations(documentId);
      lastWorkingCopyHash = base.workingCopyHash;
      notify();
      return base;
    },
    async prepareCommit(change, policy) {
      if (change.target.documentId !== documentId) throw new Error("El cambio apunta a otro documento");
      const result = await prepareDocumentCommit<Grant>({
        change,
        base: change.base,
        policy,
        issueGrant: (request) => transport.prepareCommit({
          documentId,
          change: request.change,
          policy,
          controllerId: request.controllerId,
          clientSequence: request.clientSequence,
          workingCopyHash: request.workingCopyHash,
        }),
      });
      notify();
      if (result.kind !== "prepared") {
        const detail = result.kind === "stale-base" || result.kind === "grant-failed" ? result.reason : result.kind;
        throw new Error(`No se pudo reservar el commit: ${detail}`);
      }
      lastWorkingCopyHash = result.base.workingCopyHash;
      return { kind: "prepared", grant: result.grant, base: result.base };
    },
    async commit(changeId) {
      const claim = controller.claimCommitGrant(changeId);
      if (claim.kind === "already-submitted") {
        const resolved = await port.resolveUnknown(changeId);
        if (resolved.kind === "integrated") return resolved;
        notify();
        throw new Error("El commit ya fue enviado; el recibo sigue pendiente de consulta");
      }
      if (claim.kind === "expired") {
        releaseDocumentCommit(documentId, changeId, "El permiso venció o ya fue consumido");
        notify();
        throw new Error("El permiso de commit venció antes de enviarse");
      }
      if (claim.kind !== "claimed") throw new Error("El permiso de commit no está disponible para enviarse");
      const grant = claim.grant;
      notify();
      try {
        const response = await transport.commit({ documentId, changeId, grant });
        return await applyResponse(response);
      } catch (error) {
        const outcome = await resolveCommitFailure({
          error,
          controller,
          changeId,
          release: () => releaseDocumentCommit(documentId, changeId, messageOf(error)),
          lookup: () => transport.resolveReceipt({ target: { kind: "current", documentId }, changeId }),
          reconcile: applyResponse,
        });
        notify();
        if (outcome.kind === "rejected") throw error;
        if (outcome.kind === "resolved" && outcome.value.kind === "integrated") return outcome.value;
        throw error;
      }
    },
    reconcile(response) {
      return applyResponse(response);
    },
    async resolveUnknown(changeId) {
      const result = await resolveUnknownReceipt({
        controller,
        changeId,
        lookup: () => transport.resolveReceipt({ target: { kind: "current", documentId }, changeId }),
        reconcile: applyResponse,
      });
      notify();
      return result.kind === "resolved" ? result.value : result;
    },
    async undo(sourceChangeId) {
      const entry = intentHistory.get(documentId, sourceChangeId);
      const current = obtenerEstadoStore();
      if (documentIdForState(current) !== documentId) return { kind: "rejected", reason: "Activa el documento antes de revertirlo" };
      if (entry) {
        const validation = validateInverse(current.modelo, entry.inverse);
        if (validation.kind === "conflict") {
          intentHistory.markUndoConflict(documentId, sourceChangeId, validation);
          notify();
          return { kind: "rejected", reason: validation.reason };
        }
        if (entry.status !== "undo-pending") intentHistory.markUndoPending(documentId, sourceChangeId);
      }
      try {
        const base = await port.flush();
        const prepared = await transport.prepareUndo({
          documentId,
          sourceChangeId,
          controllerId: controller.controllerId,
          clientSequence: base.clientSequence,
          workingCopyHash: base.workingCopyHash,
        });
        const result = await prepareDocumentCommit<Grant>({
          change: prepared.change,
          base,
          policy: "review",
          historyAction: { kind: "undo", sourceChangeId },
          issueGrant: (request) => transport.prepareCommit({
            documentId,
            change: request.change,
            policy: "review",
            controllerId: request.controllerId,
            clientSequence: request.clientSequence,
            workingCopyHash: request.workingCopyHash,
          }),
        });
        if (result.kind !== "prepared") throw new Error(result.kind === "stale-base" ? result.reason : result.kind);
        const integrated = await port.commit(prepared.change.id);
        notify();
        return integrated;
      } catch (error) {
        if (entry && controller.snapshot().reservation === null) intentHistory.cancelUndoPending(documentId, sourceChangeId);
        notify();
        throw error;
      }
    },
    async reapply(sourceChangeId) {
      const entry = intentHistory.get(documentId, sourceChangeId);
      if (entry && entry.status !== "undone") return { kind: "rejected", reason: "La intención no está en estado deshecho" };
      if (entry && !intentHistory.markReapplyPending(documentId, sourceChangeId)) return { kind: "rejected", reason: "La intención ya está cambiando" };
      try {
        const base = await port.flush();
        const prepared = await transport.prepareReapply({
          documentId,
          sourceChangeId,
          controllerId: controller.controllerId,
          clientSequence: base.clientSequence,
          workingCopyHash: base.workingCopyHash,
        });
        const change = prepared.change;
        const result = await prepareDocumentCommit<Grant>({
          change,
          base,
          policy: "review",
          historyAction: { kind: "reapply", sourceChangeId },
          issueGrant: (request) => transport.prepareCommit({
            documentId,
            change: request.change,
            policy: "review",
            controllerId: request.controllerId,
            clientSequence: request.clientSequence,
            workingCopyHash: request.workingCopyHash,
          }),
        });
        if (result.kind !== "prepared") throw new Error(result.kind === "stale-base" ? result.reason : result.kind);
        return await port.commit(change.id);
      } catch (error) {
        if (entry && controller.snapshot().reservation === null) intentHistory.cancelReapplyPending(documentId, sourceChangeId);
        throw error;
      } finally { notify(); }
    },
    dispose() {
      disposed = true;
      unsubscribeController();
      unsubscribePending();
      unsubscribeHistory();
      listeners.clear();
      pendingListeners.clear();
    },
  };

  const unsubscribeController = controller.subscribe(notify);
  const unsubscribePending = onPendingCommit((event) => {
    if (event.documentId !== documentId) return;
    for (const listener of pendingListeners) listener(event);
    notify();
  });
  const unsubscribeHistory = onIntentHistoryAction((action, entry) => {
    if (entry.documentId !== documentId) return;
    const work = action === "undo" ? port.undo(entry.changeId) : port.reapply(entry.changeId);
    void work.catch(() => notify());
  });
  return port;
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : "La operación de documento falló";
}
