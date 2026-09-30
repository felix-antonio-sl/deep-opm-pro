import type { Base, ChangeSet, CommitReceipt } from "../agent/contracts";
import type { SemanticInverse } from "../modelo/changes/types";
import type { SessionIdentity } from "./sessionIdentity";

export type LocalDocumentStatus = "synced" | "saved-here" | "conflict";
export type LocalJournalStatus = "pending" | "synced" | "conflict";
export type LocalWriteStatus =
  | { state: "idle" | "saved" | "saving" }
  | { state: "error"; message: string };

export interface LocalRemoteBase {
  /** Null means we retained an ancestor snapshot but have no trusted revision token for it. */
  revision: number | null;
  snapshotJson: string;
  base?: Base;
  witness?: unknown;
}

export interface LocalJournalEntry {
  id: string;
  localRevision: number;
  createdAt: string;
  status: LocalJournalStatus;
  snapshotJson: string;
  base: LocalRemoteBase | null;
  change: ChangeSet | null;
  inverse: SemanticInverse | null;
  receipt?: CommitReceipt;
  remoteRevision?: number;
}

export interface LocalConflictBranch {
  id: string;
  operationId: string;
  localRevision: number;
  baseSnapshotJson: string | null;
  localSnapshotJson: string;
  remoteSnapshotJson: string;
  remoteRevision: number;
  createdAt: string;
  status: "open" | "resolved";
  resolution?: "local" | "remote";
}

export interface LocalDocumentRecord {
  key: string;
  tenantId: string;
  userId: string;
  documentId: string;
  localRevision: number;
  lastSyncedLocalRevision: number;
  snapshotJson: string;
  remoteBase: LocalRemoteBase | null;
  status: LocalDocumentStatus;
  journal: LocalJournalEntry[];
  history: unknown[];
  conflicts: LocalConflictBranch[];
  updatedAt: string;
}

export interface LocalRepositoryStorage {
  read(key: string): Promise<LocalDocumentRecord | null>;
  list(tenantId: string, userId: string): Promise<LocalDocumentRecord[]>;
  transact<T>(
    key: string,
    update: (current: LocalDocumentRecord | null) => { record: LocalDocumentRecord | null; result: T },
  ): Promise<T>;
  getActiveIdentity(): Promise<SessionIdentity | null>;
  setActiveIdentity(identity: SessionIdentity | null): Promise<void>;
}

export interface SaveHereInput {
  identity: SessionIdentity;
  documentId: string;
  snapshotJson: string;
  expectedLocalRevision?: number;
  remoteBase?: LocalRemoteBase | null;
  initialSnapshotJson?: string;
  change?: ChangeSet;
  inverse?: SemanticInverse;
  history?: unknown[];
  operationId?: string;
}

export class LocalRevisionConflict extends Error {
  constructor(readonly current: LocalDocumentRecord | null) {
    super("La copia local cambió; vuelve a leer antes de guardar aquí");
    this.name = "LocalRevisionConflict";
  }
}

export class LocalOperationIdConflict extends Error {
  constructor(operationId: string) {
    super(`La identidad local ${operationId} ya se usó con otro contenido`);
    this.name = "LocalOperationIdConflict";
  }
}

/** A single IndexedDB record is the atomic local snapshot, journal and history envelope. */
export class LocalDocumentRepository {
  private readonly listeners = new Set<() => void>();
  private readonly writeStatuses = new Map<string, LocalWriteStatus>();

  constructor(
    private readonly storage: LocalRepositoryStorage = new IndexedDbLocalRepositoryStorage(),
    private readonly createId: () => string = defaultId,
    private readonly now: () => string = () => new Date().toISOString(),
  ) {}

  activateIdentity(identity: SessionIdentity): Promise<void> {
    return this.storage.setActiveIdentity(copyIdentity(identity)).then(() => this.notify());
  }

  clearActiveIdentity(): Promise<void> {
    return this.storage.setActiveIdentity(null).then(() => this.notify());
  }

  getActiveIdentity(): Promise<SessionIdentity | null> {
    return this.storage.getActiveIdentity();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getWriteStatus(identity: SessionIdentity, documentId: string): LocalWriteStatus {
    return this.writeStatuses.get(documentKey(identity, documentId)) ?? { state: "idle" };
  }

  setWriteStatus(identity: SessionIdentity, documentId: string, status: LocalWriteStatus): void {
    const key = documentKey(identity, documentId);
    const previous = this.writeStatuses.get(key);
    if (previous?.state === status.state &&
      (previous.state !== "error" || status.state !== "error" || previous.message === status.message)) return;
    this.writeStatuses.set(key, status);
    this.notify();
  }

  async loadDocument(identity: SessionIdentity, documentId: string): Promise<LocalDocumentRecord | null> {
    return this.storage.read(documentKey(identity, documentId));
  }

  async listDocuments(identity: SessionIdentity): Promise<LocalDocumentRecord[]> {
    return this.storage.list(identity.tenantId, identity.userId);
  }

  async seedRemoteSnapshot(input: {
    identity: SessionIdentity;
    documentId: string;
    base: LocalRemoteBase & { revision: number };
    history?: unknown[];
  }): Promise<LocalDocumentRecord> {
    assertIdentity(input.identity);
    assertDocumentId(input.documentId);
    return this.transact(documentKey(input.identity, input.documentId), (current) => {
      if (current) {
        if (current.journal.some((entry) => entry.status === "pending") &&
          !sameRemoteBase(current.remoteBase, input.base)) {
          const newest = [...current.journal].reverse().find((entry) => entry.status === "pending");
          if (newest) {
            const conflicted = createConflict(current, newest, input.base, this.now());
            return { record: conflicted, result: conflicted };
          }
        }
        if (current.status === "conflict" || current.journal.some((entry) => entry.status === "pending")) {
          return { record: current, result: current };
        }
      }
      const record = current
        ? { ...current, snapshotJson: input.base.snapshotJson, remoteBase: copyBase(input.base), status: "synced" as const, history: clone(input.history ?? current.history), updatedAt: this.now() }
        : {
            key: documentKey(input.identity, input.documentId),
            tenantId: input.identity.tenantId,
            userId: input.identity.userId,
            documentId: input.documentId,
            localRevision: 0,
            lastSyncedLocalRevision: 0,
            snapshotJson: input.base.snapshotJson,
            remoteBase: copyBase(input.base),
            status: "synced" as const,
            journal: [],
            history: clone(input.history ?? []),
            conflicts: [],
            updatedAt: this.now(),
          };
      return { record, result: record };
    });
  }

  async saveHere(input: SaveHereInput): Promise<LocalDocumentRecord> {
    assertIdentity(input.identity);
    assertDocumentId(input.documentId);
    if (typeof input.snapshotJson !== "string") throw new TypeError("snapshotJson debe ser texto");
    const key = documentKey(input.identity, input.documentId);
    return this.transact(key, (stored) => {
      const current = stored ?? createEmptyRecord(
        input.identity,
        input.documentId,
        input.remoteBase ?? null,
        input.initialSnapshotJson ?? "",
        this.now(),
      );
      if (current.snapshotJson === input.snapshotJson) {
        const record = input.history === undefined ? current : { ...current, history: clone(input.history), updatedAt: this.now() };
        return { record, result: record };
      }
      const operationId = input.operationId ?? this.createId();
      const existing = current.journal.find((entry) => entry.id === operationId);
      if (existing) {
        const sameRequest = existing.snapshotJson === input.snapshotJson &&
          existing.change?.id === input.change?.id &&
          existing.localRevision === (input.expectedLocalRevision ?? existing.localRevision);
        if (!sameRequest) throw new LocalOperationIdConflict(operationId);
        return { record: current, result: current };
      }
      if (input.expectedLocalRevision !== undefined && current.localRevision !== input.expectedLocalRevision) {
        throw new LocalRevisionConflict(current);
      }

      const revision = current.localRevision + 1;
      const entry: LocalJournalEntry = {
        id: operationId,
        localRevision: revision,
        createdAt: this.now(),
        status: "pending",
        snapshotJson: input.snapshotJson,
        base: copyBase(current.remoteBase),
        change: input.change ? clone(input.change) : null,
        inverse: input.inverse ? clone(input.inverse) : null,
      };
      const record: LocalDocumentRecord = {
        ...current,
        localRevision: revision,
        snapshotJson: input.snapshotJson,
        status: current.conflicts.some((conflict) => conflict.status === "open") ? "conflict" : "saved-here",
        journal: [...current.journal, entry],
        history: input.history === undefined ? current.history : clone(input.history),
        conflicts: current.conflicts.map((conflict) => conflict.status === "open"
          ? { ...conflict, localSnapshotJson: input.snapshotJson, localRevision: revision }
          : conflict),
        updatedAt: entry.createdAt,
      };
      return { record, result: record };
    });
  }

  async pendingOperations(identity: SessionIdentity, documentId: string): Promise<LocalJournalEntry[]> {
    const record = await this.loadDocument(identity, documentId);
    return (record?.journal ?? []).filter((entry) => entry.status === "pending").map(clone);
  }

  async markSynchronized(input: {
    identity: SessionIdentity;
    documentId: string;
    operationId: string;
    localRevision: number;
    snapshotJson: string;
    remoteRevision: number;
    receipt?: CommitReceipt;
  }): Promise<LocalDocumentRecord> {
    const key = documentKey(input.identity, input.documentId);
    return this.transact(key, (current) => {
      if (!current) throw new LocalRevisionConflict(null);
      const operation = current.journal.find((entry) => entry.id === input.operationId);
      if (!operation || operation.localRevision !== input.localRevision || operation.snapshotJson !== input.snapshotJson) {
        throw new LocalRevisionConflict(current);
      }
      const journal = current.journal.map((entry) => entry.status === "pending" && entry.localRevision <= input.localRevision
        ? {
            ...entry,
            status: "synced" as const,
            remoteRevision: input.remoteRevision,
            ...(input.receipt ? { receipt: clone(input.receipt) } : {}),
          }
        : entry.status === "pending" && entry.localRevision > input.localRevision
          ? { ...entry, base: { revision: input.remoteRevision, snapshotJson: input.snapshotJson } }
          : entry);
      const stillPending = journal.some((entry) => entry.status === "pending");
      const hasConflict = current.conflicts.some((conflict) => conflict.status === "open");
      const record = {
        ...current,
        remoteBase: { revision: input.remoteRevision, snapshotJson: input.snapshotJson },
        lastSyncedLocalRevision: Math.max(current.lastSyncedLocalRevision, input.localRevision),
        journal,
        status: hasConflict ? "conflict" as const : stillPending ? "saved-here" as const : "synced" as const,
        updatedAt: this.now(),
      };
      return { record, result: record };
    });
  }

  async recordConflict(input: {
    identity: SessionIdentity;
    documentId: string;
    operationId: string;
    remoteRevision: number;
    remoteSnapshotJson: string;
  }): Promise<LocalDocumentRecord> {
    const key = documentKey(input.identity, input.documentId);
    return this.transact(key, (current) => {
      if (!current) throw new LocalRevisionConflict(null);
      const operation = current.journal.find((entry) => entry.id === input.operationId);
      if (!operation) throw new LocalRevisionConflict(current);
      const conflictId = `conflict:${operation.id}`;
      const existing = current.conflicts.find((conflict) => conflict.id === conflictId);
      const conflict: LocalConflictBranch = existing ? {
        ...existing,
        localRevision: current.localRevision,
        localSnapshotJson: current.snapshotJson,
        remoteRevision: input.remoteRevision,
        remoteSnapshotJson: input.remoteSnapshotJson,
      } : {
        id: conflictId,
        operationId: operation.id,
        localRevision: current.localRevision,
        baseSnapshotJson: operation.base?.snapshotJson ?? null,
        localSnapshotJson: current.snapshotJson,
        remoteSnapshotJson: input.remoteSnapshotJson,
        remoteRevision: input.remoteRevision,
        createdAt: this.now(),
        status: "open",
      };
      const journal = current.journal.map((entry) => entry.status === "pending" && entry.localRevision <= operation.localRevision
        ? { ...entry, status: "conflict" as const }
        : entry);
      const record = {
        ...current,
        status: "conflict" as const,
        journal,
        conflicts: existing ? current.conflicts : [...current.conflicts, conflict],
        updatedAt: conflict.createdAt,
      };
      return { record, result: record };
    });
  }

  async resolveConflict(input: {
    identity: SessionIdentity;
    documentId: string;
    conflictId: string;
    choice: "local" | "remote";
  }): Promise<LocalDocumentRecord> {
    const key = documentKey(input.identity, input.documentId);
    return this.storage.transact(key, (current) => {
      if (!current) throw new LocalRevisionConflict(null);
      const conflict = current.conflicts.find((item) => item.id === input.conflictId && item.status === "open");
      if (!conflict) throw new Error("La rama en conflicto ya no está disponible");
      const revision = current.localRevision + 1;
      const snapshotJson = input.choice === "local" ? conflict.localSnapshotJson : conflict.remoteSnapshotJson;
      const resolved = { ...conflict, status: "resolved" as const, resolution: input.choice };
      const otherOpenConflict = current.conflicts.some((item) => item.id !== conflict.id && item.status === "open");
      const journal = input.choice === "local"
        ? [...current.journal, {
            id: this.createId(),
            localRevision: revision,
            createdAt: this.now(),
            status: "pending" as const,
            snapshotJson,
            base: { revision: conflict.remoteRevision, snapshotJson: conflict.remoteSnapshotJson },
            change: null,
            inverse: null,
          }]
        : current.journal.map((entry) => (entry.status === "conflict" || entry.status === "pending") && entry.localRevision <= current.localRevision
            ? { ...entry, status: "synced" as const, remoteRevision: conflict.remoteRevision }
            : entry);
      const record: LocalDocumentRecord = {
        ...current,
        localRevision: revision,
        lastSyncedLocalRevision: input.choice === "remote" ? revision : current.lastSyncedLocalRevision,
        snapshotJson,
        remoteBase: { revision: conflict.remoteRevision, snapshotJson: conflict.remoteSnapshotJson },
        status: otherOpenConflict ? "conflict" : input.choice === "local" ? "saved-here" : "synced",
        journal,
        conflicts: current.conflicts.map((item) => item.id === conflict.id ? resolved : item),
        updatedAt: this.now(),
      };
      return { record, result: record };
    });
  }

  recoveryJson(identity: SessionIdentity, documentId: string): Promise<string | null> {
    return this.loadDocument(identity, documentId).then((record) => record
      ? JSON.stringify({ format: "opforja.local-recovery.v1", document: record }, null, 2)
      : null);
  }

  private async transact<T>(
    key: string,
    update: (current: LocalDocumentRecord | null) => { record: LocalDocumentRecord | null; result: T },
  ): Promise<T> {
    const result = await this.storage.transact(key, update);
    this.notify();
    return result;
  }

  private notify(): void {
    for (const listener of this.listeners) listener();
  }
}

function createEmptyRecord(
  identity: SessionIdentity,
  documentId: string,
  remoteBase: LocalRemoteBase | null,
  initialSnapshotJson: string,
  now: string,
): LocalDocumentRecord {
  return {
    key: documentKey(identity, documentId),
    tenantId: identity.tenantId,
    userId: identity.userId,
    documentId,
    localRevision: 0,
    lastSyncedLocalRevision: 0,
    snapshotJson: remoteBase?.snapshotJson ?? initialSnapshotJson,
    remoteBase: copyBase(remoteBase),
    status: "synced",
    journal: [],
    history: [],
    conflicts: [],
    updatedAt: now,
  };
}

export function createLocalDocumentRepository(options: {
  storage?: LocalRepositoryStorage;
  databaseName?: string;
  createId?: () => string;
  now?: () => string;
} = {}): LocalDocumentRepository {
  return new LocalDocumentRepository(
    options.storage ?? new IndexedDbLocalRepositoryStorage(options.databaseName),
    options.createId,
    options.now,
  );
}

let sharedLocalRepository: LocalDocumentRepository | null = null;

export function getLocalDocumentRepository(): LocalDocumentRepository {
  sharedLocalRepository ??= createLocalDocumentRepository();
  return sharedLocalRepository;
}

export class IndexedDbLocalRepositoryStorage implements LocalRepositoryStorage {
  private database: Promise<IDBDatabase> | null = null;

  constructor(private readonly databaseName = "opforja-local") {}

  async read(key: string): Promise<LocalDocumentRecord | null> {
    const db = await this.open();
    const tx = db.transaction("documents", "readonly");
    const request = tx.objectStore("documents").get(key) as IDBRequest<LocalDocumentRecord | undefined>;
    const value = await requestResult(request);
    return value ? clone(value) : null;
  }

  async list(tenantId: string, userId: string): Promise<LocalDocumentRecord[]> {
    const db = await this.open();
    const tx = db.transaction("documents", "readonly");
    const request = tx.objectStore("documents").getAll() as IDBRequest<LocalDocumentRecord[]>;
    const values = await requestResult(request);
    return values.filter((record) => record.tenantId === tenantId && record.userId === userId).map(clone);
  }

  async transact<T>(
    key: string,
    update: (current: LocalDocumentRecord | null) => { record: LocalDocumentRecord | null; result: T },
  ): Promise<T> {
    const db = await this.open();
    return new Promise<T>((resolve, reject) => {
      const tx = db.transaction("documents", "readwrite");
      const store = tx.objectStore("documents");
      const request = store.get(key) as IDBRequest<LocalDocumentRecord | undefined>;
      let result: T;
      let failure: unknown = null;
      request.onsuccess = () => {
        try {
          const change = update(request.result ? clone(request.result) : null);
          result = change.result;
          if (change.record) store.put(change.record);
          else store.delete(key);
        } catch (error) {
          failure = error;
          tx.abort();
        }
      };
      tx.oncomplete = () => resolve(result!);
      tx.onabort = () => reject(failure ?? tx.error ?? new Error("La transacción local se canceló"));
      tx.onerror = () => reject(failure ?? tx.error ?? new Error("Falló el almacenamiento local"));
    });
  }

  async getActiveIdentity(): Promise<SessionIdentity | null> {
    const db = await this.open();
    const tx = db.transaction("session", "readonly");
    const request = tx.objectStore("session").get("active") as IDBRequest<{ identity: SessionIdentity | null } | undefined>;
    const value = await requestResult(request);
    return value?.identity ? copyIdentity(value.identity) : null;
  }

  async setActiveIdentity(identity: SessionIdentity | null): Promise<void> {
    const db = await this.open();
    await transactionDone(db.transaction("session", "readwrite"), (tx) => {
      const store = tx.objectStore("session");
      if (identity) store.put({ id: "active", identity: copyIdentity(identity) });
      else store.delete("active");
    });
  }

  private open(): Promise<IDBDatabase> {
    if (this.database) return this.database;
    if (typeof indexedDB === "undefined") return Promise.reject(new Error("IndexedDB no está disponible"));
    this.database = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.databaseName, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("documents")) db.createObjectStore("documents", { keyPath: "key" });
        if (!db.objectStoreNames.contains("session")) db.createObjectStore("session", { keyPath: "id" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error("No se pudo abrir IndexedDB"));
      request.onblocked = () => reject(new Error("IndexedDB está bloqueado por otra versión abierta"));
    }).catch((error) => {
      this.database = null;
      throw error;
    });
    return this.database!;
  }
}

export function localDocumentKey(identity: SessionIdentity, documentId: string): string {
  assertIdentity(identity);
  assertDocumentId(documentId);
  return documentKey(identity, documentId);
}

export function isQuotaError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "QuotaExceededError" ||
    Boolean(error && typeof error === "object" && (error as { name?: unknown }).name === "QuotaExceededError");
}

function createConflict(
  record: LocalDocumentRecord,
  operation: LocalJournalEntry,
  remoteBase: LocalRemoteBase & { revision: number },
  now: string,
): LocalDocumentRecord {
  const id = `conflict:${operation.id}`;
  const conflict: LocalConflictBranch = {
    id,
    operationId: operation.id,
    localRevision: record.localRevision,
    baseSnapshotJson: operation.base?.snapshotJson ?? null,
    localSnapshotJson: record.snapshotJson,
    remoteSnapshotJson: remoteBase.snapshotJson,
    remoteRevision: remoteBase.revision,
    createdAt: now,
    status: "open",
  };
  const conflicts = record.conflicts.some((item) => item.id === id) ? record.conflicts : [...record.conflicts, conflict];
  return {
    ...record,
    status: "conflict",
    conflicts,
    journal: record.journal.map((entry) => entry.status === "pending" && entry.localRevision <= operation.localRevision
      ? { ...entry, status: "conflict" as const }
      : entry),
    updatedAt: now,
  };
}

function sameRemoteBase(left: LocalRemoteBase | null, right: LocalRemoteBase): boolean {
  return left?.revision === right.revision && left.snapshotJson === right.snapshotJson;
}

function copyBase(base: LocalRemoteBase | null): LocalRemoteBase | null {
  return base ? clone(base) : null;
}

function documentKey(identity: SessionIdentity, documentId: string): string {
  return JSON.stringify([identity.tenantId, identity.userId, documentId]);
}

function assertIdentity(identity: SessionIdentity): void {
  if (!identity.tenantId.trim() || !identity.userId.trim()) throw new TypeError("La identidad local requiere tenantId y userId");
}

function assertDocumentId(documentId: string): void {
  if (!documentId.trim()) throw new TypeError("documentId es requerido");
}

function copyIdentity(identity: SessionIdentity): SessionIdentity {
  assertIdentity(identity);
  return { tenantId: identity.tenantId, userId: identity.userId };
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function defaultId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Falló la lectura local"));
  });
}

function transactionDone(tx: IDBTransaction, enqueue: (tx: IDBTransaction) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    try { enqueue(tx); } catch (error) { tx.abort(); reject(error); return; }
    tx.oncomplete = () => resolve();
    tx.onabort = () => reject(tx.error ?? new Error("La transacción local se canceló"));
    tx.onerror = () => reject(tx.error ?? new Error("Falló el almacenamiento local"));
  });
}
