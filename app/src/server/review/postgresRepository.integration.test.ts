import { randomUUID } from "node:crypto";
import { expect, test } from "bun:test";
import { crearModelo } from "../../modelo/operaciones/creacion";
import { exportarModelo } from "../../serializacion/json";
import type { PersistenciaSesion } from "../modelPersistence";
import { createReviewService } from "./service";
import { crearRepoReviewPostgres, migrarTablasReview } from "./postgresRepository";
import { canonicalWorkingCopyHash } from "./hash";
import { Buffer } from "node:buffer";

const databaseUrl = process.env.OPFORJA_TEST_DATABASE_URL;

test.skipIf(!databaseUrl)("Postgres review shares snapshot the effective autosave and revoke by exact owner", async () => {
  const sql = new Bun.SQL(databaseUrl!);
  const suffix = randomUUID().replaceAll("-", "");
  const tenantId = `review-test-${suffix}`;
  const ownerId = `review-owner-${suffix}`;
  const otherId = `review-other-${suffix}`;
  const documentId = `review-document-${suffix}`;
  const now = "2026-02-01T12:00:00.000Z";
  const owner: PersistenciaSesion = { tenantId, userId: ownerId, auth: true, authKind: "operator" };
  const other: PersistenciaSesion = { tenantId, userId: otherId, auth: true, authKind: "operator" };
  let seeded = false;
  try {
    await sql`CREATE TABLE IF NOT EXISTS opforja_tenants (id TEXT PRIMARY KEY, creado_en TEXT NOT NULL)`;
    await sql`CREATE TABLE IF NOT EXISTS opforja_users (id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, creado_en TEXT NOT NULL)`;
    await sql`CREATE TABLE IF NOT EXISTS opforja_models (
      tenant_id TEXT NOT NULL, owner_id TEXT NOT NULL, id TEXT NOT NULL,
      nombre TEXT NOT NULL, descripcion TEXT NOT NULL DEFAULT '', carpeta_id TEXT,
      creado_en TEXT NOT NULL, actualizado_en TEXT NOT NULL, ultima_apertura TEXT,
      autosalvado BOOLEAN, archivado BOOLEAN, archivado_en TEXT, archivado_auto BOOLEAN,
      crear_version_al_guardar BOOLEAN, versiones JSONB, revision INTEGER NOT NULL DEFAULT 1,
      payload JSONB NOT NULL, PRIMARY KEY (tenant_id, id)
    )`;
    await sql`CREATE TABLE IF NOT EXISTS opforja_model_autosaves (
      tenant_id TEXT NOT NULL, modelo_id TEXT NOT NULL, owner_id TEXT NOT NULL,
      creado_en TEXT NOT NULL, payload JSONB NOT NULL, PRIMARY KEY (tenant_id, modelo_id)
    )`;
    await migrarTablasReview(sql);
    const createdAt = "2026-01-01T00:00:00.000Z";
    await sql`INSERT INTO opforja_tenants (id, creado_en) VALUES (${tenantId}, ${createdAt}) ON CONFLICT DO NOTHING`;
    await sql`INSERT INTO opforja_users (id, tenant_id, creado_en) VALUES (${ownerId}, ${tenantId}, ${createdAt}) ON CONFLICT DO NOTHING`;
    const saved = exportarModelo(crearModelo("Guardado anterior"));
    const autosave = exportarModelo(crearModelo("Copia de trabajo vigente"));
    await sql`
      INSERT INTO opforja_models (tenant_id, owner_id, id, nombre, creado_en, actualizado_en, revision, payload)
      VALUES (${tenantId}, ${ownerId}, ${documentId}, 'Guardado anterior', ${createdAt}, '2026-01-01T00:00:00.000Z', 8,
        convert_from(decode(${base64(saved)}, 'base64'), 'UTF8')::jsonb)
    `;
    seeded = true;
    await sql`
      INSERT INTO opforja_model_autosaves (tenant_id, modelo_id, owner_id, creado_en, payload)
      VALUES (${tenantId}, ${documentId}, ${ownerId}, '2026-01-02T00:00:00.000Z',
        convert_from(decode(${base64(autosave)}, 'base64'), 'UTF8')::jsonb)
    `;
    const service = createReviewService({ repository: crearRepoReviewPostgres(sql), now: () => now });
    const createResponse = await service.handleOperator(new Request("http://local/__deep-opm/review/grants", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({
        documentId, includedSourceIds: [], annotate: true, expectedRevision: 8,
        expectedWorkingCopyHash: canonicalWorkingCopyHash(autosave)!,
      }),
    }), owner);
    expect(createResponse.status).toBe(201);
    const created = await createResponse.json() as { token: string; share: { id: string; revision: number; source: string; modelName: string } };
    expect(created.share).toMatchObject({ revision: 8, source: "autosave", modelName: "Copia de trabajo vigente" });
    const savedTokenHash = await sql<Array<{ token_hash: string; snapshot: { modelJson?: string } }>>`
      SELECT token_hash, snapshot FROM opforja_review_shares WHERE tenant_id = ${tenantId} AND document_id = ${documentId}
    `;
    expect(savedTokenHash[0]?.token_hash).not.toBe(created.token);

    const nextVersion = exportarModelo(crearModelo("Modelo actualizado después de compartir"));
    const nextVersionBase64 = base64(nextVersion);
    await sql`
      UPDATE opforja_models SET nombre = 'Modelo actualizado después de compartir', actualizado_en = '2026-01-03T00:00:00.000Z',
        revision = 9, payload = convert_from(decode(${nextVersionBase64}, 'base64'), 'UTF8')::jsonb
      WHERE tenant_id = ${tenantId} AND id = ${documentId}
    `;
    await sql`
      UPDATE opforja_model_autosaves SET creado_en = '2026-01-04T00:00:00.000Z',
        payload = convert_from(decode(${nextVersionBase64}, 'base64'), 'UTF8')::jsonb
      WHERE tenant_id = ${tenantId} AND modelo_id = ${documentId}
    `;
    const path = `/__deep-opm/review/${created.token}`;
    const read = await service.handlePublic(new Request(`http://local${path}`));
    expect(read.status).toBe(200);
    const publicView = await read.json() as { share: { revision: number; modelName: string }; modelJson: string };
    expect(publicView.share).toMatchObject({ revision: 8, modelName: "Copia de trabajo vigente" });
    expect(publicView.modelJson).not.toContain(documentId);

    const annotationResponse = await service.handlePublic(new Request(`http://local${path}/annotations`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ anchor: { kind: "model" }, text: "Revisar supuestos" }),
    }));
    expect(annotationResponse.status).toBe(201);
    const annotation = (await annotationResponse.json() as { annotation: { id: string; revision: number } }).annotation;
    expect(annotation.revision).toBe(8);
    for (const [outcome, note] of [["addressed", "Actualizado"], ["kept", "Se mantiene el fundamento"]] as const) {
      const resolutionResponse = await service.handleOperator(new Request(
        `http://local/__deep-opm/review/grants/${created.share.id}/annotations/${annotation.id}/resolve?documentId=${documentId}`,
        { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ outcome, note }) },
      ), owner);
      expect(resolutionResponse.status).toBe(200);
    }
    const ownerReview = await service.handleOperator(new Request(
      `http://local/__deep-opm/review/grants/${created.share.id}?documentId=${documentId}`,
    ), owner);
    const ownerView = await ownerReview.json() as { annotations: Array<{ id: string; text: string; resolutions: Array<{ revision: number; anchorPresent: boolean }> }> };
    expect(ownerView.annotations).toHaveLength(1);
    expect(ownerView.annotations[0]).toMatchObject({ text: "Revisar supuestos" });
    expect(ownerView.annotations[0]?.resolutions).toHaveLength(2);
    expect(ownerView.annotations[0]?.resolutions[0]).toMatchObject({ revision: 9, anchorPresent: true });
    const storedResolutions = await sql<Array<{ count: number }>>`
      SELECT COUNT(*)::int AS count FROM opforja_review_resolutions
      WHERE tenant_id = ${tenantId} AND document_id = ${documentId}
        AND share_id = ${created.share.id} AND annotation_id = ${annotation.id}
    `;
    expect(Number(storedResolutions[0]?.count)).toBe(2);

    const otherCreate = await service.handleOperator(new Request("http://local/__deep-opm/review/grants", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({
        documentId, includedSourceIds: [], annotate: true, expectedRevision: 9,
        expectedWorkingCopyHash: canonicalWorkingCopyHash(nextVersion)!,
      }),
    }), other);
    expect(otherCreate.status).toBe(404);
    const listByOther = await service.handleOperator(new Request(`http://local/__deep-opm/review/grants?documentId=${documentId}`), other);
    expect((await listByOther.json() as { shares: unknown[] }).shares).toHaveLength(0);

    const grant = await service.handleOperator(new Request(`http://local/__deep-opm/review/grants?documentId=${documentId}`), owner);
    const shares = (await grant.json() as { shares: Array<{ id: string }> }).shares;
    const revokeByOther = await service.handleOperator(new Request(`http://local/__deep-opm/review/grants/${shares[0]!.id}?documentId=${documentId}`, { method: "DELETE" }), other);
    expect(revokeByOther.status).toBe(404);
    const revoke = await service.handleOperator(new Request(`http://local/__deep-opm/review/grants/${shares[0]!.id}?documentId=${documentId}`, { method: "DELETE" }), owner);
    expect(revoke.status).toBe(200);
    expect((await service.handlePublic(new Request(`http://local${path}`))).status).toBe(404);
  } finally {
    if (seeded) await sql`DELETE FROM opforja_models WHERE tenant_id = ${tenantId} AND id = ${documentId}`;
    await sql`DELETE FROM opforja_review_shares WHERE tenant_id = ${tenantId} AND document_id = ${documentId}`;
    await sql.end();
  }
});

function base64(value: string): string {
  return Buffer.from(value, "utf8").toString("base64");
}
