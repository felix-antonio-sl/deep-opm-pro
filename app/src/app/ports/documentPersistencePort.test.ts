import { describe, expect, test } from "bun:test";
import { LocalDocumentRepository, type LocalDocumentRecord, type LocalRepositoryStorage } from "../../persistencia/localRepository";
import type { SyncTransport } from "../../persistencia/syncQueue";
import { exportarModelo } from "../../serializacion/json";
import { modeloInicial } from "../../store/modelo";
import { crearOpmStore } from "../../store";
import type { SessionIdentity } from "../../persistencia/sessionIdentity";
import { createDocumentPersistencePort } from "./documentPersistencePort";

class MemoryStorage implements LocalRepositoryStorage {
  records = new Map<string, LocalDocumentRecord>();
  async read(key: string) { const value = this.records.get(key); return value ? structuredClone(value) : null; }
  async list(tenantId: string, userId: string) {
    return [...this.records.values()].filter((item) => item.tenantId === tenantId && item.userId === userId).map((item) => structuredClone(item));
  }
  async transact<T>(key: string, update: (current: LocalDocumentRecord | null) => { record: LocalDocumentRecord | null; result: T }): Promise<T> {
    const next = update(await this.read(key));
    if (next.record) this.records.set(key, structuredClone(next.record));
    else this.records.delete(key);
    return next.result;
  }
  async getActiveIdentity(): Promise<SessionIdentity | null> { return null; }
  async setActiveIdentity(): Promise<void> {}
}

class UnavailableStorage extends MemoryStorage {
  failure: "read" | "transact";
  constructor(failure: "read" | "transact") { super(); this.failure = failure; }
  override async read(key: string): Promise<LocalDocumentRecord | null> {
    if (this.failure === "read") throw new Error("IndexedDB no disponible para leer");
    return super.read(key);
  }
  override async transact<T>(key: string, update: (current: LocalDocumentRecord | null) => { record: LocalDocumentRecord | null; result: T }): Promise<T> {
    if (this.failure === "transact") throw new Error("IndexedDB no disponible para escribir");
    return super.transact(key, update);
  }
}

const authenticated = (identity: SessionIdentity) => ({ status: "authenticated" as const, identity });
const noHistory: unknown[] = [];

describe("DocumentPersistencePort", () => {
  test("saves the first local checkpoint before any remote read and preserves its captured ancestor", async () => {
    const identity = { tenantId: "tenant-local", userId: "user-local" };
    const repository = new LocalDocumentRepository(new MemoryStorage(), () => "first-checkpoint");
    let reads = 0;
    let writes = 0;
    const transport: SyncTransport = {
      async readRemote() { reads += 1; return { revision: 8, snapshotJson: "remote branch" }; },
      async commitRemote() { writes += 1; return { revision: 9, snapshotJson: "unexpected" }; },
    };
    const port = createDocumentPersistencePort("doc-first-checkpoint", {
      repository,
      transport,
      resolveIdentity: () => authenticated(identity),
      snapshot: () => ({
        snapshotJson: "local edit from ancestor",
        initialSnapshotJson: "opened ancestor",
        remoteBase: { revision: null, snapshotJson: "opened ancestor" },
        history: noHistory,
      }),
    });

    const saved = await port.saveHere();
    expect(saved.snapshotJson).toBe("local edit from ancestor");
    expect(saved.remoteBase).toEqual({ revision: null, snapshotJson: "opened ancestor" });
    expect(reads).toBe(0);

    const result = await port.synchronize();
    expect(result.kind).toBe("conflict");
    expect(reads).toBe(1);
    expect(writes).toBe(0);
    expect(port.snapshot().conflicts[0]).toMatchObject({
      baseSnapshotJson: "opened ancestor",
      localSnapshotJson: "local edit from ancestor",
      remoteSnapshotJson: "remote branch",
    });
    port.dispose();
  });

  test("does not restore an account's local document when identity changes during its read", async () => {
    const accountA = { tenantId: "tenant-a", userId: "user-a" };
    const accountB = { tenantId: "tenant-b", userId: "user-b" };
    const repository = new LocalDocumentRepository(new MemoryStorage());
    const modelJson = exportarModelo(modeloInicial);
    await repository.seedRemoteSnapshot({
      identity: accountA,
      documentId: "doc-account-race",
      base: { revision: 1, snapshotJson: modelJson },
    });
    const originalLoad = repository.loadDocument.bind(repository);
    let loadCount = 0;
    let beginDelayedRead!: () => void;
    let continueDelayedRead!: () => void;
    const delayedReadStarted = new Promise<void>((resolve) => { beginDelayedRead = resolve; });
    const delayedRead = new Promise<void>((resolve) => { continueDelayedRead = resolve; });
    repository.loadDocument = async (identity, documentId) => {
      loadCount += 1;
      const found = await originalLoad(identity, documentId);
      if (loadCount === 2) {
        beginDelayedRead();
        await delayedRead;
      }
      return found;
    };

    let currentIdentity = authenticated(accountA);
    const port = createDocumentPersistencePort("doc-account-race", {
      repository,
      resolveIdentity: () => currentIdentity,
      snapshot: () => null,
    });
    await new Promise((resolve) => setTimeout(resolve, 0));

    const store = crearOpmStore({ conectarRuntimeGlobal: true });
    expect(store.getState().modeloPersistidoId).toBeNull();
    const opening = port.openLocal();
    await delayedReadStarted;
    currentIdentity = authenticated(accountB);
    expect(port.snapshot().local).toBe("empty");
    continueDelayedRead();

    await expect(opening).rejects.toThrow("La cuenta cambió");
    expect(store.getState().modeloPersistidoId).toBeNull();
    expect(store.getState().pestanasAbiertas.some((tab) => tab.modeloId === "doc-account-race")).toBe(false);
    port.dispose();
  });

  test("keeps a human edit made while conflict resolution waits for IndexedDB", async () => {
    const identity = { tenantId: "tenant-conflict", userId: "user-conflict" };
    const repository = new LocalDocumentRepository(new MemoryStorage(), () => "conflict-op");
    await repository.seedRemoteSnapshot({ identity, documentId: "doc-conflict-race", base: { revision: 2, snapshotJson: "ancestor" } });
    const local = await repository.saveHere({ identity, documentId: "doc-conflict-race", snapshotJson: "local branch", expectedLocalRevision: 0 });
    await repository.recordConflict({
      identity,
      documentId: "doc-conflict-race",
      operationId: local.journal[0]!.id,
      remoteRevision: 3,
      remoteSnapshotJson: "remote branch",
    });
    const originalResolve = repository.resolveConflict.bind(repository);
    let beginResolution!: () => void;
    let finishResolution!: () => void;
    const resolutionStarted = new Promise<void>((resolve) => { beginResolution = resolve; });
    const resolutionGate = new Promise<void>((resolve) => { finishResolution = resolve; });
    repository.resolveConflict = async (input) => {
      beginResolution();
      await resolutionGate;
      return originalResolve(input);
    };
    let editorSnapshot = "local branch";
    const port = createDocumentPersistencePort("doc-conflict-race", {
      repository,
      resolveIdentity: () => authenticated(identity),
      snapshot: () => ({
        snapshotJson: editorSnapshot,
        initialSnapshotJson: "ancestor",
        remoteBase: { revision: 2, snapshotJson: "ancestor" },
        history: noHistory,
      }),
    });

    const resolution = port.resolveConflict("conflict:conflict-op", "remote");
    await resolutionStarted;
    editorSnapshot = "new human edit";
    finishResolution();

    await expect(resolution).rejects.toThrow("El documento cambió mientras se resolvía el conflicto");
    expect(editorSnapshot).toBe("new human edit");
    expect((await repository.loadDocument(identity, "doc-conflict-race"))?.snapshotJson).toBe("remote branch");
    port.dispose();
  });

  for (const failure of ["read", "transact"] as const) {
    test(`marks local state volatile and exports the current edit when IndexedDB ${failure} fails`, async () => {
      const identity = { tenantId: `tenant-${failure}`, userId: `user-${failure}` };
      const repository = new LocalDocumentRepository(new UnavailableStorage(failure));
      const port = createDocumentPersistencePort(`doc-volatile-${failure}`, {
        repository,
        resolveIdentity: () => authenticated(identity),
        snapshot: () => ({
          snapshotJson: `current edit despite ${failure} failure`,
          initialSnapshotJson: "opened ancestor",
          remoteBase: { revision: 4, snapshotJson: "opened ancestor" },
          history: [{ cursor: 2 }],
        }),
      });
      await new Promise((resolve) => setTimeout(resolve, 0));

      await expect(port.saveHere()).rejects.toThrow("IndexedDB no disponible");
      const state = port.snapshot();
      expect(state.local).toBe("volatile");
      expect(state.durableSnapshotMatchesCurrent).toBe(false);
      expect(state.error).toContain("IndexedDB no disponible");

      const recovery = await port.recoveryJson();
      expect(recovery).not.toBeNull();
      const artifact = JSON.parse(recovery!) as {
        volatile: boolean;
        error: string;
        document: { tenantId: string; userId: string; snapshotJson: string; history: unknown[] };
      };
      expect(artifact.volatile).toBe(true);
      expect(artifact.error).toContain("IndexedDB no disponible");
      expect(artifact.document).toMatchObject({
        tenantId: identity.tenantId,
        userId: identity.userId,
        snapshotJson: `current edit despite ${failure} failure`,
        history: [{ cursor: 2 }],
      });
      port.dispose();
    });
  }
});
