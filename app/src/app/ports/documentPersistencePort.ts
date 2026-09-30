import type { SessionIdentity } from "../../persistencia/sessionIdentity";
import {
  createBackendDocumentSyncTransport,
  getDocumentLocalIdentity,
  type DocumentLocalIdentity,
} from "../../persistencia/backend";
import {
  getLocalDocumentRepository,
  type LocalConflictBranch,
  type LocalDocumentRecord,
  type LocalDocumentRepository,
  type LocalRemoteBase,
} from "../../persistencia/localRepository";
import { synchronizeDocument, type SyncResult, type SyncTransport } from "../../persistencia/syncQueue";
import { localDocumentSnapshotInput, restoreLocalDocumentRecord } from "../../store/runtime";

export type LocalPersistenceLabel = "empty" | "saving" | "saved-here" | "synced" | "conflict" | "volatile";
export type RemotePersistenceState = "local-only" | "offline" | "idle" | "pending" | "syncing" | "synced" | "conflict";

export interface DocumentPersistenceState {
  documentId: string;
  identity: DocumentLocalIdentity["status"];
  local: LocalPersistenceLabel;
  remote: RemotePersistenceState;
  localRevision: number | null;
  lastSyncedLocalRevision: number | null;
  remoteRevision: number | null;
  pendingOperations: number;
  conflicts: LocalConflictBranch[];
  error: string | null;
  durableSnapshotMatchesCurrent: boolean;
}

export interface DocumentPersistenceSnapshotSource {
  snapshotJson: string;
  initialSnapshotJson: string;
  remoteBase: LocalRemoteBase | null;
  history: unknown[];
}

export interface DocumentPersistencePort {
  snapshot(): DocumentPersistenceState;
  subscribe(listener: (state: DocumentPersistenceState) => void): () => void;
  openLocal(): Promise<LocalDocumentRecord | null>;
  saveHere(): Promise<LocalDocumentRecord>;
  synchronize(): Promise<SyncResult | { kind: "local-only" } | { kind: "offline" }>;
  resolveConflict(conflictId: string, choice: "local" | "remote"): Promise<LocalDocumentRecord>;
  recoveryJson(): Promise<string | null>;
  dispose(): void;
}

export interface CreateDocumentPersistencePortOptions {
  repository?: LocalDocumentRepository;
  transport?: SyncTransport;
  resolveIdentity?: () => DocumentLocalIdentity;
  snapshot?: (documentId: string) => DocumentPersistenceSnapshotSource | null;
}

/** One persistence adapter for an exact backend model id or local tab id. */
export function createDocumentPersistencePort(
  documentId: string,
  options: CreateDocumentPersistencePortOptions = {},
): DocumentPersistencePort {
  if (!documentId.trim()) throw new TypeError("documentId es requerido");
  const repository = options.repository ?? getLocalDocumentRepository();
  const transport = options.transport ?? createBackendDocumentSyncTransport();
  const identityResolver = options.resolveIdentity ?? getDocumentLocalIdentity;
  const sourceResolver = options.snapshot ?? localDocumentSnapshotInput;
  const listeners = new Set<(state: DocumentPersistenceState) => void>();
  let record: LocalDocumentRecord | null = null;
  let recordIdentityKey: string | null = null;
  let refreshIdentityKey: string | null = null;
  let remoteIdentityKey: string | null = null;
  let remote: RemotePersistenceState = documentId.startsWith("local:") ? "local-only" : "idle";
  let disposed = false;
  let refreshSequence = 0;

  const currentIdentity = (): DocumentLocalIdentity => identityResolver();
  const identityKey = (identity: DocumentLocalIdentity): string | null =>
    identity.status === "authenticated" || identity.status === "offline"
      ? JSON.stringify([identity.identity.tenantId, identity.identity.userId])
      : null;
  const assertIdentityCurrent = (identity: Extract<DocumentLocalIdentity, { identity: SessionIdentity }>) => {
    if (!sameIdentity(identity.identity, currentIdentity())) {
      throw new Error("La cuenta cambió mientras se realizaba la operación local");
    }
  };
  const markStorageFailure = (identity: Extract<DocumentLocalIdentity, { identity: SessionIdentity }>, error: unknown) => {
    if (!sameIdentity(identity.identity, currentIdentity())) return;
    repository.setWriteStatus(identity.identity, documentId, {
      state: "error",
      message: error instanceof Error ? error.message : "No se pudo acceder al almacenamiento local",
    });
  };
  const currentSource = (): DocumentPersistenceSnapshotSource | null => sourceResolver(documentId);
  const refresh = async () => {
    const sequence = ++refreshSequence;
    const identity = currentIdentity();
    if (identity.status !== "authenticated" && identity.status !== "offline") {
      record = null;
      recordIdentityKey = null;
      refreshIdentityKey = null;
      remoteIdentityKey = null;
      if (identity.status === "unauthenticated") remote = "idle";
      notify();
      return;
    }
    const requestedIdentityKey = identityKey(identity);
    refreshIdentityKey = requestedIdentityKey;
    let next: LocalDocumentRecord | null;
    try {
      next = await repository.loadDocument(identity.identity, documentId);
    } catch (error) {
      if (disposed || sequence !== refreshSequence || !sameIdentity(identity.identity, currentIdentity())) return;
      refreshIdentityKey = requestedIdentityKey;
      markStorageFailure(identity, error);
      return;
    }
    if (disposed || sequence !== refreshSequence || !sameIdentity(identity.identity, currentIdentity())) return;
    record = next;
    recordIdentityKey = requestedIdentityKey;
    refreshIdentityKey = requestedIdentityKey;
    notify();
  };
  const snapshot = (): DocumentPersistenceState => {
    const identity = currentIdentity();
    if (identity.status !== "authenticated" && identity.status !== "offline") {
      return {
        documentId,
        identity: identity.status,
        local: "empty",
        remote: documentId.startsWith("local:") ? "local-only" : "idle",
        localRevision: null,
        lastSyncedLocalRevision: null,
        remoteRevision: null,
        pendingOperations: 0,
        conflicts: [],
        error: null,
        durableSnapshotMatchesCurrent: false,
      };
    }
    const activeIdentityKey = identityKey(identity);
    if (recordIdentityKey !== activeIdentityKey && refreshIdentityKey !== activeIdentityKey) void refresh();
    const visibleRecord = recordIdentityKey === activeIdentityKey ? record : null;
    const current = currentSource();
    const write = repository.getWriteStatus(identity.identity, documentId);
    const durableSnapshotMatchesCurrent = write.state !== "error" && Boolean(visibleRecord && current && visibleRecord.snapshotJson === current.snapshotJson);
    const openConflicts = visibleRecord?.conflicts.filter((conflict) => conflict.status === "open") ?? [];
    const pendingOperations = visibleRecord?.journal.filter((entry) => entry.status === "pending").length ?? 0;
    let local: LocalPersistenceLabel = visibleRecord ? visibleRecord.status : "empty";
    if (write.state === "error") local = "volatile";
    else if (write.state === "saving" || (current && !durableSnapshotMatchesCurrent)) local = "saving";
    else if (visibleRecord && !durableSnapshotMatchesCurrent && !current) local = visibleRecord.status;
    const activeRemote = remoteIdentityKey === activeIdentityKey
      ? remote
      : documentId.startsWith("local:") ? "local-only" : "idle";
    const remoteState: RemotePersistenceState = documentId.startsWith("local:")
      ? "local-only"
      : identity.status === "offline"
        ? "offline"
        : activeRemote === "syncing"
          ? "syncing"
          : openConflicts.length > 0 || visibleRecord?.status === "conflict"
            ? "conflict"
            : pendingOperations > 0
              ? "pending"
              : visibleRecord?.status === "synced"
                ? "synced"
                : activeRemote;
    return {
      documentId,
      identity: identity.status,
      local,
      remote: remoteState,
      localRevision: visibleRecord?.localRevision ?? null,
      lastSyncedLocalRevision: visibleRecord?.lastSyncedLocalRevision ?? null,
      remoteRevision: visibleRecord?.remoteBase?.revision ?? null,
      pendingOperations,
      conflicts: openConflicts.map((conflict) => structuredClone(conflict)),
      error: write.state === "error" ? write.message : null,
      durableSnapshotMatchesCurrent,
    };
  };
  const notify = () => {
    if (disposed) return;
    const next = snapshot();
    for (const listener of listeners) listener(next);
  };

  const unsubscribeRepository = repository.subscribe(() => { void refresh(); });
  const onOnline = () => {
    if (!documentId.startsWith("local:")) {
      remoteIdentityKey = identityKey(currentIdentity());
      remote = "pending";
      notify();
    }
  };
  const onOffline = () => {
    if (!documentId.startsWith("local:")) {
      remoteIdentityKey = identityKey(currentIdentity());
      remote = "offline";
      notify();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
  }
  void refresh();

  return {
    snapshot,
    subscribe(listener) {
      listeners.add(listener);
      listener(snapshot());
      return () => listeners.delete(listener);
    },
    async openLocal() {
      const identity = requireLocalIdentity(currentIdentity());
      let found: LocalDocumentRecord | null;
      try {
        found = await repository.loadDocument(identity.identity, documentId);
      } catch (error) {
        markStorageFailure(identity, error);
        throw error;
      }
      assertIdentityCurrent(identity);
      if (repository.getWriteStatus(identity.identity, documentId).state === "error") {
        repository.setWriteStatus(identity.identity, documentId, { state: "idle" });
      }
      record = found;
      recordIdentityKey = identityKey(identity);
      if (found) {
        await restoreLocalDocumentRecord(found, { replaceDirty: false });
        assertIdentityCurrent(identity);
      }
      notify();
      return found;
    },
    async saveHere() {
      const identity = requireLocalIdentity(currentIdentity());
      const source = currentSource();
      if (!source) throw new Error("Activa este documento antes de guardar una copia local");
      repository.setWriteStatus(identity.identity, documentId, { state: "saving" });
      try {
        const existing = await repository.loadDocument(identity.identity, documentId);
        assertIdentityCurrent(identity);
        const saved = await repository.saveHere({
          identity: identity.identity,
          documentId,
          snapshotJson: source.snapshotJson,
          initialSnapshotJson: source.initialSnapshotJson,
          ...(!existing ? { remoteBase: source.remoteBase } : {}),
          expectedLocalRevision: existing?.localRevision ?? 0,
          history: source.history,
        });
        assertIdentityCurrent(identity);
        record = saved;
        recordIdentityKey = identityKey(identity);
        repository.setWriteStatus(identity.identity, documentId, { state: "saved" });
        notify();
        return saved;
      } catch (error) {
        markStorageFailure(identity, error);
        throw error;
      }
    },
    async synchronize() {
      const requestedIdentity = requireLocalIdentity(currentIdentity());
      await this.saveHere();
      assertIdentityCurrent(requestedIdentity);
      if (documentId.startsWith("local:")) return { kind: "local-only" };
      const identity = requestedIdentity;
      remoteIdentityKey = identityKey(identity);
      if (identity.status !== "authenticated") {
        remote = "offline";
        notify();
        return { kind: "offline" };
      }
      remote = "syncing";
      notify();
      try {
        const result = await synchronizeDocument(repository, identity.identity, documentId, transport, { confirmedByOperator: true });
        assertIdentityCurrent(identity);
        if (result.kind !== "missing") record = result.record;
        if (result.kind !== "missing") recordIdentityKey = identityKey(identity);
        remote = result.kind === "conflict" ? "conflict" : result.kind === "pending" ? "pending" : "synced";
        notify();
        return result;
      } catch (error) {
        if (sameIdentity(identity.identity, currentIdentity())) {
          remoteIdentityKey = identityKey(identity);
          remote = "pending";
          notify();
        }
        throw error;
      }
    },
    async resolveConflict(conflictId, choice) {
      const identity = requireLocalIdentity(currentIdentity());
      const startingSnapshot = currentSource()?.snapshotJson ?? null;
      const resolved = await repository.resolveConflict({ identity: identity.identity, documentId, conflictId, choice });
      assertIdentityCurrent(identity);
      if ((currentSource()?.snapshotJson ?? null) !== startingSnapshot) {
        throw new Error("El documento cambió mientras se resolvía el conflicto; la copia conservada sigue disponible");
      }
      record = resolved;
      recordIdentityKey = identityKey(identity);
      await restoreLocalDocumentRecord(resolved, { replaceDirty: true });
      assertIdentityCurrent(identity);
      notify();
      return resolved;
    },
    async recoveryJson() {
      const identity = currentIdentity();
      if (identity.status !== "authenticated" && identity.status !== "offline") return null;
      let durable: string | null = null;
      let storageFailure: { error: unknown } | null = null;
      try {
        durable = await repository.recoveryJson(identity.identity, documentId);
      } catch (error) {
        storageFailure = { error };
      }
      assertIdentityCurrent(identity);
      if (storageFailure) markStorageFailure(identity, storageFailure.error);
      assertIdentityCurrent(identity);
      const source = currentSource();
      const write = repository.getWriteStatus(identity.identity, documentId);
      if (!source) return durable;
      let persisted: LocalDocumentRecord | null = null;
      if (durable) {
        try {
          persisted = (JSON.parse(durable) as { document?: LocalDocumentRecord }).document ?? null;
        } catch {
          persisted = null;
        }
      }
      const visibleRecord = recordIdentityKey === identityKey(identity) ? record : null;
      const document = persisted ?? visibleRecord;
      if (write.state !== "error" && durable && persisted?.snapshotJson === source.snapshotJson) return durable;
      const reason = write.state === "error"
        ? write.message
        : storageFailure?.error instanceof Error
          ? storageFailure.error.message
          : document
            ? "La copia local confirmada no incluye los cambios actuales"
            : "El borrador actual todavía no tiene una copia local confirmada";
      return serializeVolatileRecovery(identity.identity, documentId, source, document, reason);
    },
    dispose() {
      disposed = true;
      refreshSequence += 1;
      unsubscribeRepository();
      if (typeof window !== "undefined") {
        window.removeEventListener("online", onOnline);
        window.removeEventListener("offline", onOffline);
      }
      listeners.clear();
    },
  };
}

function requireLocalIdentity(identity: DocumentLocalIdentity): Extract<DocumentLocalIdentity, { identity: SessionIdentity }> {
  if (identity.status !== "authenticated" && identity.status !== "offline") {
    throw new Error("No hay una identidad previamente autenticada para guardar esta copia local");
  }
  return identity;
}

function sameIdentity(identity: SessionIdentity, current: DocumentLocalIdentity): boolean {
  return (current.status === "authenticated" || current.status === "offline") &&
    current.identity.tenantId === identity.tenantId && current.identity.userId === identity.userId;
}

function serializeVolatileRecovery(
  identity: SessionIdentity,
  documentId: string,
  source: DocumentPersistenceSnapshotSource,
  record: LocalDocumentRecord | null,
  error: string,
): string {
  const now = new Date().toISOString();
  const document: LocalDocumentRecord = {
    key: JSON.stringify([identity.tenantId, identity.userId, documentId]),
    tenantId: identity.tenantId,
    userId: identity.userId,
    documentId,
    localRevision: record?.localRevision ?? 0,
    lastSyncedLocalRevision: record?.lastSyncedLocalRevision ?? 0,
    snapshotJson: source.snapshotJson,
    remoteBase: source.remoteBase,
    status: record?.status ?? "saved-here",
    journal: record?.journal ?? [],
    history: source.history,
    conflicts: record?.conflicts ?? [],
    updatedAt: now,
  };
  return JSON.stringify({
    format: "opforja.local-recovery.v1",
    volatile: true,
    error,
    document,
  }, null, 2);
}
