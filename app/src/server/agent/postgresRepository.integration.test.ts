import { randomUUID } from "node:crypto";
import { expect, test } from "bun:test";
import { AGENT_CAPABILITY_PROFILE } from "../../agent/capabilityProfile";
import type { Base, ChangeSet } from "../../agent/contracts";
import { createOrderFixture } from "../../agent/fixtures/order";
import { exportarModelo, carpetaIdDeJson } from "../../serializacion/json";
import { construirModeloPersistido } from "../../persistencia/modelos";
import type { PersistenciaSesion } from "../modelPersistence";
import { ChangeGateway } from "./changeGateway";
import { crearRepoAgentePostgres, migrarTablasAgente, persistModelInTransaction } from "./postgresRepository";

const databaseUrl = process.env.OPFORJA_TEST_DATABASE_URL;

test.skipIf(!databaseUrl)("Postgres repository shares CAS, rollback, and legacy model-row locks", async () => {
  const sql = new Bun.SQL(databaseUrl!);
  const suffix = randomUUID().replaceAll("-", "");
  const tenantId = "agent-test-" + suffix;
  const userId = "agent-user-" + suffix;
  const documentId = "agent-document-" + suffix;
  const session: PersistenciaSesion = { tenantId, userId, auth: true, authKind: "operator" };
  let seeded = false;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS opforja_tenants (id TEXT PRIMARY KEY, creado_en TEXT NOT NULL)
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS opforja_users (id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, creado_en TEXT NOT NULL)
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS opforja_models (
        tenant_id TEXT NOT NULL, owner_id TEXT NOT NULL, id TEXT NOT NULL,
        nombre TEXT NOT NULL, descripcion TEXT NOT NULL DEFAULT '', carpeta_id TEXT,
        creado_en TEXT NOT NULL, actualizado_en TEXT NOT NULL, ultima_apertura TEXT,
        autosalvado BOOLEAN, archivado BOOLEAN, archivado_en TEXT, archivado_auto BOOLEAN,
        crear_version_al_guardar BOOLEAN, versiones JSONB, revision INTEGER NOT NULL DEFAULT 1,
        payload JSONB NOT NULL, PRIMARY KEY (tenant_id, id)
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS opforja_model_autosaves (
        tenant_id TEXT NOT NULL, modelo_id TEXT NOT NULL, owner_id TEXT NOT NULL,
        creado_en TEXT NOT NULL, payload JSONB NOT NULL, PRIMARY KEY (tenant_id, modelo_id)
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS opforja_workspaces (tenant_id TEXT PRIMARY KEY, indice JSONB NOT NULL)
    `;
    await sql`INSERT INTO opforja_tenants (id, creado_en) VALUES (${tenantId}, ${new Date().toISOString()}) ON CONFLICT DO NOTHING`;
    await sql`INSERT INTO opforja_users (id, tenant_id, creado_en) VALUES (${userId}, ${tenantId}, ${new Date().toISOString()}) ON CONFLICT DO NOTHING`;
    await migrarTablasAgente(sql);

    const fixture = createOrderFixture();
    const initial = construirModeloPersistido({
      id: documentId, nombre: fixture.model.nombre, json: exportarModelo(fixture.model), revision: 1,
    }, undefined, "2026-09-23T12:00:00.000Z");
    await sql.begin((tx) => persistModelInTransaction(tx, session, initial, null));
    seeded = true;

    const repository = crearRepoAgentePostgres(sql);
    const gateway = new ChangeGateway({ repository, now: () => Date.parse("2026-09-23T12:01:00.000Z") });
    const before = await repository.transaction(session, documentId, async (tx) => {
      const document = await tx.getDocument();
      if (!document) throw new Error("Seeded model missing");
      return document;
    });
    const canonical = exportarModelo(before.effectiveModel, carpetaIdDeJson(before.effectiveJson));
    const base: Base = {
      revision: before.model.revision ?? 0, semanticHash: before.semanticHash,
      workingCopyHash: await sha256(canonical), clientSequence: 0, profileVersion: AGENT_CAPABILITY_PROFILE,
    };
    const change: ChangeSet = {
      id: "commit-" + suffix, taskId: null, actorId: userId, intentVersion: null,
      target: { kind: "current", documentId }, base,
      operations: [{
        operationId: "op-" + suffix, preconditions: [], kind: "createObject", id: "entity-" + suffix,
        opdId: fixture.model.opdRaizId, name: "Confirmado", position: { x: 520, y: 480 },
      }],
      readIds: [], writeIds: [], dependencies: [], explanation: "Prueba de commit aislado",
    };
    const grant = await gateway.prepareCommit(session, change, {
      kind: "review", controllerId: "pg-browser", clientSequence: 0, workingCopyHash: base.workingCopyHash,
    });
    const stored = await repository.transaction(session, documentId, (tx) => tx.getChange(change.id));
    if (!stored) throw new Error("Prepared change missing");
    const commit = await gateway.commit(session, stored.change, grant);
    expect(commit).toMatchObject({ kind: "committed", receipt: { previousRevision: 1, revision: 2 } });
    expect(await gateway.commit(session, stored.change, grant)).toMatchObject({
      kind: "committed", recovered: true, receipt: commit.kind === "committed" ? commit.receipt : undefined,
    });

    const docAfterCommit = await getDocument(repository, session, documentId);
    const lockAcquired = deferred<void>();
    const releaseAgent = deferred<void>();
    const agentWriter = repository.transaction(session, documentId, async (tx) => {
      const doc = await tx.getDocument();
      if (!doc) throw new Error("Document missing under agent lock");
      lockAcquired.resolve();
      await releaseAgent.promise;
      return tx.putModel({ ...doc.model, nombre: "Agente", actualizadoEn: "2026-09-23T12:02:00.000Z" }, doc.model.revision ?? 0);
    });
    await lockAcquired.promise;

    let legacyLocked = false;
    const legacyWriter = sql.begin(async (tx) => {
      const rows = await tx`
        SELECT revision FROM opforja_models
        WHERE tenant_id = ${tenantId} AND id = ${documentId}
        FOR UPDATE
      `;
      legacyLocked = true;
      const revision = Number(rows[0]?.revision);
      return persistModelInTransaction(tx, session, {
        ...docAfterCommit.model, nombre: "Legacy", actualizadoEn: "2026-09-23T12:03:00.000Z",
      }, revision);
    });
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(legacyLocked).toBe(false);
    releaseAgent.resolve();
    await Promise.all([agentWriter, legacyWriter]);
    const afterInterleaving = await getDocument(repository, session, documentId);
    expect(afterInterleaving.model.revision).toBe(4);
    expect(afterInterleaving.model.nombre).toBe("Legacy");

    const rollbackBase = afterInterleaving.model;
    const rollbackChange: ChangeSet = { ...change, id: "rollback-" + suffix };
    await expect(repository.transaction(session, documentId, async (tx) => {
      await tx.putModel({ ...rollbackBase, nombre: "No debe persistir" }, rollbackBase.revision ?? 0);
      await tx.putChange({
        change: rollbackChange, requestHash: "rollback-hash", status: "committed",
        createdAt: "2026-09-23T12:04:00.000Z", receipt: null, inverse: null, grant: null,
      });
      throw new Error("simulated failure before transaction commit");
    })).rejects.toThrow("simulated failure");
    const afterRollback = await getDocument(repository, session, documentId);
    expect(afterRollback.model.revision).toBe(4);
    expect(afterRollback.model.nombre).toBe("Legacy");
    expect(await repository.transaction(session, documentId, (tx) => tx.getChange(rollbackChange.id))).toBeNull();
  } finally {
    if (seeded) {
      await sql`DELETE FROM opforja_agent_events WHERE tenant_id = ${tenantId}`;
      await sql`DELETE FROM opforja_agent_results WHERE tenant_id = ${tenantId}`;
      await sql`DELETE FROM opforja_agent_changes WHERE tenant_id = ${tenantId}`;
      await sql`DELETE FROM opforja_agent_variants WHERE tenant_id = ${tenantId}`;
      await sql`DELETE FROM opforja_agent_tasks WHERE tenant_id = ${tenantId}`;
      await sql`DELETE FROM opforja_model_autosaves WHERE tenant_id = ${tenantId}`;
      await sql`DELETE FROM opforja_models WHERE tenant_id = ${tenantId}`;
    }
    await sql.close();
  }
});

async function getDocument(repository: ReturnType<typeof crearRepoAgentePostgres>, session: PersistenciaSesion, id: string) {
  return repository.transaction(session, id, async (tx) => {
    const document = await tx.getDocument();
    if (!document) throw new Error("Postgres document missing");
    return document;
  });
}

function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
