import { describe, expect, test } from "bun:test";
import {
  LocalDocumentRepository,
  type LocalDocumentRecord,
  type LocalRepositoryStorage,
} from "./localRepository";

class MemoryLocalStorage implements LocalRepositoryStorage {
  readonly records = new Map<string, LocalDocumentRecord>();
  activeIdentity: { tenantId: string; userId: string } | null = null;
  failNextWrite = false;

  async read(key: string): Promise<LocalDocumentRecord | null> {
    const record = this.records.get(key);
    return record ? structuredClone(record) : null;
  }

  async list(tenantId: string, userId: string): Promise<LocalDocumentRecord[]> {
    return [...this.records.values()]
      .filter((record) => record.tenantId === tenantId && record.userId === userId)
      .map((record) => structuredClone(record));
  }

  async transact<T>(
    key: string,
    update: (current: LocalDocumentRecord | null) => { record: LocalDocumentRecord | null; result: T },
  ): Promise<T> {
    const result = update(await this.read(key));
    if (this.failNextWrite) {
      this.failNextWrite = false;
      throw new DOMException("Quota exceeded", "QuotaExceededError");
    }
    if (result.record) this.records.set(key, structuredClone(result.record));
    else this.records.delete(key);
    return result.result;
  }

  async getActiveIdentity(): Promise<{ tenantId: string; userId: string } | null> {
    return this.activeIdentity ? { ...this.activeIdentity } : null;
  }

  async setActiveIdentity(identity: { tenantId: string; userId: string } | null): Promise<void> {
    this.activeIdentity = identity ? { ...identity } : null;
  }
}

const identity = { tenantId: "tenant-a", userId: "user-a" };
const base = { revision: 4, snapshotJson: '{"modelo":"base"}' };

describe("LocalDocumentRepository", () => {
  test("commits snapshot and journal atomically and partitions documents by account", async () => {
    const storage = new MemoryLocalStorage();
    const repository = new LocalDocumentRepository(storage, () => "local-op-1", () => "2026-09-23T12:00:00.000Z");
    await repository.activateIdentity(identity);
    await repository.seedRemoteSnapshot({ identity, documentId: "doc-1", base, history: [] });

    const saved = await repository.saveHere({
      identity,
      documentId: "doc-1",
      snapshotJson: '{"modelo":"local"}',
      history: [{ changeId: "intent-1" }],
      expectedLocalRevision: 0,
    });

    expect(saved.localRevision).toBe(1);
    expect(saved.snapshotJson).toBe('{"modelo":"local"}');
    expect(saved.journal).toHaveLength(1);
    expect(saved.journal[0]?.status).toBe("pending");
    expect(saved.history).toHaveLength(1);
    expect(await repository.loadDocument({ tenantId: "tenant-b", userId: "user-b" }, "doc-1")).toBeNull();
    expect(await repository.getActiveIdentity()).toEqual(identity);
  });

  test("keeps the prior durable revision and journal when the IndexedDB write fails", async () => {
    const storage = new MemoryLocalStorage();
    const repository = new LocalDocumentRepository(storage, () => "local-op-2", () => "2026-09-23T12:00:00.000Z");
    await repository.seedRemoteSnapshot({ identity, documentId: "doc-1", base, history: [] });
    storage.failNextWrite = true;

    await expect(repository.saveHere({
      identity,
      documentId: "doc-1",
      snapshotJson: '{"modelo":"local"}',
      expectedLocalRevision: 0,
    })).rejects.toMatchObject({ name: "QuotaExceededError" });

    const record = await repository.loadDocument(identity, "doc-1");
    expect(record?.localRevision).toBe(0);
    expect(record?.snapshotJson).toBe(base.snapshotJson);
    expect(record?.journal).toHaveLength(0);
  });

  test("acknowledges only the exact local revision and snapshot", async () => {
    const storage = new MemoryLocalStorage();
    const repository = new LocalDocumentRepository(storage, (() => { let id = 0; return () => `local-op-${++id}`; })(), () => "2026-09-23T12:00:00.000Z");
    await repository.seedRemoteSnapshot({ identity, documentId: "doc-1", base, history: [] });
    const first = await repository.saveHere({ identity, documentId: "doc-1", snapshotJson: "local-1", expectedLocalRevision: 0 });
    const second = await repository.saveHere({ identity, documentId: "doc-1", snapshotJson: "local-2", expectedLocalRevision: first.localRevision });

    const acknowledged = await repository.markSynchronized({
      identity,
      documentId: "doc-1",
      operationId: first.journal[0]!.id,
      localRevision: first.localRevision,
      snapshotJson: "local-1",
      remoteRevision: 5,
    });

    expect(acknowledged.localRevision).toBe(second.localRevision);
    expect(acknowledged.snapshotJson).toBe("local-2");
    expect(acknowledged.status).toBe("saved-here");
    expect(acknowledged.journal.find((entry) => entry.id === first.journal[0]!.id)?.status).toBe("synced");
    expect(acknowledged.journal.find((entry) => entry.id === second.journal[1]!.id)?.status).toBe("pending");
  });

  test("retains both branches when a remote base changed and resolves only by explicit branch choice", async () => {
    const storage = new MemoryLocalStorage();
    const repository = new LocalDocumentRepository(storage, () => "local-op-3", () => "2026-09-23T12:00:00.000Z");
    await repository.seedRemoteSnapshot({ identity, documentId: "doc-1", base, history: [] });
    const local = await repository.saveHere({ identity, documentId: "doc-1", snapshotJson: "local-branch", expectedLocalRevision: 0 });
    const conflict = await repository.recordConflict({
      identity,
      documentId: "doc-1",
      operationId: local.journal[0]!.id,
      remoteRevision: 5,
      remoteSnapshotJson: "remote-branch",
    });

    expect(conflict.snapshotJson).toBe("local-branch");
    expect(conflict.status).toBe("conflict");
    expect(conflict.conflicts[0]).toMatchObject({ localSnapshotJson: "local-branch", remoteSnapshotJson: "remote-branch", status: "open" });

    const resolved = await repository.resolveConflict({
      identity,
      documentId: "doc-1",
      conflictId: conflict.conflicts[0]!.id,
      choice: "remote",
    });
    expect(resolved.snapshotJson).toBe("remote-branch");
    expect(resolved.status).toBe("synced");
    expect(resolved.conflicts[0]?.status).toBe("resolved");
  });
});
