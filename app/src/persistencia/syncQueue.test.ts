import { describe, expect, test } from "bun:test";
import { LocalDocumentRepository, type LocalDocumentRecord, type LocalRepositoryStorage } from "./localRepository";
import { synchronizeDocument, type SyncRemoteDocument, type SyncTransport } from "./syncQueue";

function recordOf(result: Awaited<ReturnType<typeof synchronizeDocument>>): LocalDocumentRecord {
  if (result.kind === "missing") throw new Error("Expected a local document record");
  return result.record;
}

class MemoryStorage implements LocalRepositoryStorage {
  records = new Map<string, LocalDocumentRecord>();
  async read(key: string) { const value = this.records.get(key); return value ? structuredClone(value) : null; }
  async list(tenantId: string, userId: string) { return [...this.records.values()].filter((item) => item.tenantId === tenantId && item.userId === userId).map((item) => structuredClone(item)); }
  async transact<T>(key: string, update: (current: LocalDocumentRecord | null) => { record: LocalDocumentRecord | null; result: T }): Promise<T> {
    const current = await this.read(key);
    const next = update(current);
    if (next.record) this.records.set(key, structuredClone(next.record));
    else this.records.delete(key);
    return next.result;
  }
  async getActiveIdentity() { return null; }
  async setActiveIdentity() {}
}

const identity = { tenantId: "tenant-a", userId: "user-a" };
const initial: SyncRemoteDocument = { revision: 3, snapshotJson: "base" };

function setup() {
  const repository = new LocalDocumentRepository(new MemoryStorage(), (() => { let value = 0; return () => `local-${++value}`; })(), () => "2026-09-23T12:00:00.000Z");
  return repository;
}

describe("synchronizeDocument", () => {
  test("coalesces a burst of durable checkpoints into one remote revision", async () => {
    const repository = setup();
    await repository.seedRemoteSnapshot({ identity, documentId: "doc-1", base: initial });
    const first = await repository.saveHere({ identity, documentId: "doc-1", snapshotJson: "local-1", expectedLocalRevision: 0 });
    const second = await repository.saveHere({ identity, documentId: "doc-1", snapshotJson: "local-2", expectedLocalRevision: first.localRevision });
    expect(second.journal[1]?.base).toMatchObject({ revision: initial.revision, snapshotJson: "base" });
    let remote = { ...initial };
    const sent: string[] = [];
    const transport: SyncTransport = {
      async readRemote() { return { ...remote }; },
      async commitRemote({ operation }) {
        sent.push(operation.id);
        remote = { revision: remote.revision + 1, snapshotJson: operation.snapshotJson };
        return { ...remote };
      },
    };

    const result = await synchronizeDocument(repository, identity, "doc-1", transport);

    expect(result.kind).toBe("synced");
    expect(sent).toEqual(["local-2"]);
    expect(remote).toEqual({ revision: 4, snapshotJson: "local-2" });
    expect(recordOf(result).journal.every((entry) => entry.status === "synced")).toBe(true);
  });

  test("resolves a lost response by reading the matching remote snapshot without resending", async () => {
    const repository = setup();
    await repository.seedRemoteSnapshot({ identity, documentId: "doc-1", base: initial });
    const local = await repository.saveHere({ identity, documentId: "doc-1", snapshotJson: "local", expectedLocalRevision: 0 });
    let remote = { ...initial };
    let sends = 0;
    const transport: SyncTransport = {
      async readRemote() { return { ...remote }; },
      async commitRemote({ operation }) {
        sends += 1;
        remote = { revision: 4, snapshotJson: operation.snapshotJson };
        throw new Error("response lost after durable commit");
      },
    };

    const result = await synchronizeDocument(repository, identity, "doc-1", transport);

    expect(result.kind).toBe("synced");
    expect(sends).toBe(1);
    expect(recordOf(result).lastSyncedLocalRevision).toBe(local.localRevision);
  });

  test("acknowledges a committed checkpoint when a newer local edit arrived in flight", async () => {
    const repository = setup();
    await repository.seedRemoteSnapshot({ identity, documentId: "doc-1", base: initial });
    const first = await repository.saveHere({ identity, documentId: "doc-1", snapshotJson: "local-1", expectedLocalRevision: 0 });
    let remote = { ...initial };
    const transport: SyncTransport = {
      async readRemote() { return { ...remote }; },
      async commitRemote({ operation }) {
        remote = { revision: remote.revision + 1, snapshotJson: operation.snapshotJson };
        await repository.saveHere({ identity, documentId: "doc-1", snapshotJson: "local-2", expectedLocalRevision: first.localRevision });
        throw new Error("response lost after commit");
      },
    };

    const pending = await synchronizeDocument(repository, identity, "doc-1", transport);
    expect(pending.kind).toBe("synced");
    const record = await repository.loadDocument(identity, "doc-1");
    expect(record?.status).toBe("saved-here");
    expect(record?.journal).toMatchObject([
      { snapshotJson: "local-1", status: "synced" },
      { snapshotJson: "local-2", status: "pending", base: { revision: 4, snapshotJson: "local-1" } },
    ]);
  });

  test("retains local and remote branches when related declarations changed remotely", async () => {
    const repository = setup();
    await repository.seedRemoteSnapshot({ identity, documentId: "doc-1", base: initial });
    const local = await repository.saveHere({ identity, documentId: "doc-1", snapshotJson: "local declaration A + B", expectedLocalRevision: 0 });
    let sends = 0;
    const transport: SyncTransport = {
      async readRemote() { return { revision: 4, snapshotJson: "remote declaration A + C" }; },
      async commitRemote() { sends += 1; return { revision: 5, snapshotJson: "unexpected" }; },
    };

    const result = await synchronizeDocument(repository, identity, "doc-1", transport);

    expect(result.kind).toBe("conflict");
    expect(sends).toBe(0);
    expect(recordOf(result).snapshotJson).toBe("local declaration A + B");
    expect(recordOf(result).conflicts[0]).toMatchObject({
      baseSnapshotJson: "base",
      localSnapshotJson: "local declaration A + B",
      remoteSnapshotJson: "remote declaration A + C",
      remoteRevision: 4,
      status: "open",
    });
    expect(recordOf(result).journal.find((entry) => entry.id === local.journal[0]?.id)?.status).toBe("conflict");
  });

  test("does not silently synchronize a first offline checkpoint after the remote ancestor diverged", async () => {
    const repository = setup();
    const unknownRevisionAncestor = { revision: null, snapshotJson: "opened ancestor" };
    await repository.saveHere({
      identity,
      documentId: "doc-unknown-base",
      snapshotJson: "local edit from opened ancestor",
      initialSnapshotJson: unknownRevisionAncestor.snapshotJson,
      remoteBase: unknownRevisionAncestor,
      expectedLocalRevision: 0,
    });
    let sends = 0;
    const transport: SyncTransport = {
      async readRemote() { return { revision: 8, snapshotJson: "newer remote branch" }; },
      async commitRemote() { sends += 1; return { revision: 9, snapshotJson: "must not apply" }; },
    };

    const result = await synchronizeDocument(repository, identity, "doc-unknown-base", transport);

    expect(result.kind).toBe("conflict");
    expect(sends).toBe(0);
    expect(recordOf(result).conflicts[0]).toMatchObject({
      baseSnapshotJson: "opened ancestor",
      localSnapshotJson: "local edit from opened ancestor",
      remoteSnapshotJson: "newer remote branch",
      remoteRevision: 8,
      status: "open",
    });
  });

  test("uses exact ancestor equality when its revision advanced without changing the snapshot", async () => {
    const repository = setup();
    await repository.saveHere({
      identity,
      documentId: "doc-same-ancestor",
      snapshotJson: "local edit",
      initialSnapshotJson: "same ancestor",
      remoteBase: { revision: null, snapshotJson: "same ancestor" },
      expectedLocalRevision: 0,
    });
    let remote = { revision: 12, snapshotJson: "same ancestor" };
    let sends = 0;
    const transport: SyncTransport = {
      async readRemote() { return { ...remote }; },
      async commitRemote({ operation, base }) {
        sends += 1;
        expect(base).toEqual({ revision: 12, snapshotJson: "same ancestor" });
        remote = { revision: 13, snapshotJson: operation.snapshotJson };
        return { ...remote };
      },
    };

    const result = await synchronizeDocument(repository, identity, "doc-same-ancestor", transport);

    expect(result.kind).toBe("synced");
    expect(sends).toBe(1);
    expect(recordOf(result).remoteBase).toEqual(remote);
  });

  test("duplicate concurrent sync requests share one in-flight commit", async () => {
    const repository = setup();
    await repository.seedRemoteSnapshot({ identity, documentId: "doc-1", base: initial });
    await repository.saveHere({ identity, documentId: "doc-1", snapshotJson: "local", expectedLocalRevision: 0 });
    let release!: (value: SyncRemoteDocument) => void;
    let started!: () => void;
    const commitStarted = new Promise<void>((resolve) => { started = resolve; });
    let sends = 0;
    const transport: SyncTransport = {
      async readRemote() { return { ...initial }; },
      commitRemote() {
        sends += 1;
        started();
        return new Promise((resolve) => { release = resolve; });
      },
    };

    const first = synchronizeDocument(repository, identity, "doc-1", transport);
    const second = synchronizeDocument(repository, identity, "doc-1", transport);
    await commitStarted;
    expect(sends).toBe(1);
    release({ revision: 4, snapshotJson: "local" });
    expect((await first).kind).toBe("synced");
    expect((await second).kind).toBe("synced");
  });

  test("keeps a network failure pending for a later reconnect", async () => {
    const repository = setup();
    await repository.seedRemoteSnapshot({ identity, documentId: "doc-1", base: initial });
    await repository.saveHere({ identity, documentId: "doc-1", snapshotJson: "local", expectedLocalRevision: 0 });
    const transport: SyncTransport = {
      async readRemote() { throw new Error("offline"); },
      async commitRemote() { throw new Error("must not send while read is offline"); },
    };

    const result = await synchronizeDocument(repository, identity, "doc-1", transport);

    expect(result.kind).toBe("pending");
    expect(recordOf(result).status).toBe("saved-here");
    expect(recordOf(result).journal[0]?.status).toBe("pending");
  });
});
