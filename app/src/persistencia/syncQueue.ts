import type { SessionIdentity } from "./sessionIdentity";
import {
  LocalDocumentRepository,
  type LocalDocumentRecord,
  type LocalJournalEntry,
} from "./localRepository";

export interface SyncRemoteDocument {
  revision: number;
  snapshotJson: string;
  /** Opaque server CAS witness, retained by the transport only. */
  witness?: unknown;
}

export interface SyncTransport {
  readRemote(input: { identity: SessionIdentity; documentId: string }): Promise<SyncRemoteDocument>;
  commitRemote(input: {
    identity: SessionIdentity;
    documentId: string;
    operation: LocalJournalEntry;
    base: SyncRemoteDocument;
    confirmedByOperator?: boolean;
  }): Promise<SyncRemoteDocument>;
}

export type SyncResult =
  | { kind: "synced"; record: LocalDocumentRecord }
  | { kind: "pending"; reason: string; record: LocalDocumentRecord }
  | { kind: "conflict"; record: LocalDocumentRecord }
  | { kind: "missing" }
  | { kind: "identity-mismatch"; record: LocalDocumentRecord };

const inFlight = new Map<string, Promise<SyncResult>>();

/** Coalesces a burst of local checkpoints into one remote revision per observed base. */
export function synchronizeDocument(
  repository: LocalDocumentRepository,
  identity: SessionIdentity,
  documentId: string,
  transport: SyncTransport,
  options: { confirmedByOperator?: boolean } = {},
): Promise<SyncResult> {
  const key = JSON.stringify([identity.tenantId, identity.userId, documentId]);
  const current = inFlight.get(key);
  if (current) return current;
  const request = synchronizeDocumentOnce(repository, identity, documentId, transport, options)
    .finally(() => inFlight.delete(key));
  inFlight.set(key, request);
  return request;
}

async function synchronizeDocumentOnce(
  repository: LocalDocumentRepository,
  identity: SessionIdentity,
  documentId: string,
  transport: SyncTransport,
  options: { confirmedByOperator?: boolean },
): Promise<SyncResult> {
  let record = await repository.loadDocument(identity, documentId);
  if (!record) return { kind: "missing" };
  if (record.status === "conflict" || record.conflicts.some((conflict) => conflict.status === "open")) {
    return { kind: "conflict", record };
  }

  while (true) {
    record = await repository.loadDocument(identity, documentId);
    if (!record) return { kind: "missing" };
    const pending = record.journal
      .filter((entry) => entry.status === "pending")
      .sort((left, right) => left.localRevision - right.localRevision);
    const first = pending[0];
    const newest = pending[pending.length - 1];
    if (!first || !newest) return { kind: "synced", record };

    let remote: SyncRemoteDocument;
    try {
      remote = await transport.readRemote({ identity, documentId });
    } catch (error) {
      return { kind: "pending", reason: errorMessage(error), record };
    }

    // A previous request may have committed an intermediate checkpoint while
    // newer edits arrived locally. A matching durable snapshot is its receipt.
    const acknowledged = [...pending].reverse().find((entry) => entry.snapshotJson === remote.snapshotJson);
    if (acknowledged) {
      try {
        await repository.markSynchronized({
          identity,
          documentId,
          operationId: acknowledged.id,
          localRevision: acknowledged.localRevision,
          snapshotJson: acknowledged.snapshotJson,
          remoteRevision: remote.revision,
        });
      } catch {
        const latest = await repository.loadDocument(identity, documentId);
        if (!latest) return { kind: "missing" };
        return { kind: "pending", reason: "La revisión local cambió durante el acuse remoto", record: latest };
      }
      continue;
    }

    const operation: LocalJournalEntry = { ...newest, base: first.base };
    // The locally retained ancestor snapshot is the safety condition. Its
    // revision may be unknown (offline open) or may have advanced while the
    // exact same content remained effective. The transport still commits
    // against its freshly-read CAS witness, so a concurrent write after this
    // read is rejected remotely.
    if (!operation.base || remote.snapshotJson !== operation.base.snapshotJson) {
      const conflicted = await repository.recordConflict({
        identity,
        documentId,
        operationId: newest.id,
        remoteRevision: remote.revision,
        remoteSnapshotJson: remote.snapshotJson,
      });
      return { kind: "conflict", record: conflicted };
    }

    try {
      const applied = await transport.commitRemote({
        identity,
        documentId,
        operation,
        base: remote,
        ...(options.confirmedByOperator !== undefined ? { confirmedByOperator: options.confirmedByOperator } : {}),
      });
      if (applied.snapshotJson !== operation.snapshotJson || applied.revision <= remote.revision) {
        return resolveAfterUncertainCommit(repository, identity, documentId, operation, remote, transport, "El servidor devolvió un acuse que no corresponde a la operación local");
      }
      await repository.markSynchronized({
        identity,
        documentId,
        operationId: operation.id,
        localRevision: operation.localRevision,
        snapshotJson: operation.snapshotJson,
        remoteRevision: applied.revision,
      });
    } catch (error) {
      return resolveAfterUncertainCommit(repository, identity, documentId, operation, remote, transport, errorMessage(error));
    }
  }
}

async function resolveAfterUncertainCommit(
  repository: LocalDocumentRepository,
  identity: SessionIdentity,
  documentId: string,
  operation: LocalJournalEntry,
  expectedBase: SyncRemoteDocument,
  transport: SyncTransport,
  reason: string,
): Promise<SyncResult> {
  let latest: SyncRemoteDocument;
  try {
    latest = await transport.readRemote({ identity, documentId });
  } catch {
    const record = await repository.loadDocument(identity, documentId);
    return record ? { kind: "pending", reason, record } : { kind: "missing" };
  }
  if (latest.snapshotJson === operation.snapshotJson) {
    try {
      const record = await repository.markSynchronized({
        identity,
        documentId,
        operationId: operation.id,
        localRevision: operation.localRevision,
        snapshotJson: operation.snapshotJson,
        remoteRevision: latest.revision,
      });
      return { kind: "synced", record };
    } catch {
      const record = await repository.loadDocument(identity, documentId);
      return record ? { kind: "pending", reason: "El acuse remoto llegó después de una edición local", record } : { kind: "missing" };
    }
  }
  if (latest.revision === expectedBase.revision && latest.snapshotJson === expectedBase.snapshotJson) {
    const record = await repository.loadDocument(identity, documentId);
    return record ? { kind: "pending", reason, record } : { kind: "missing" };
  }
  const record = await repository.recordConflict({
    identity,
    documentId,
    operationId: operation.id,
    remoteRevision: latest.revision,
    remoteSnapshotJson: latest.snapshotJson,
  });
  return { kind: "conflict", record };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "La sincronización remota no está disponible";
}
