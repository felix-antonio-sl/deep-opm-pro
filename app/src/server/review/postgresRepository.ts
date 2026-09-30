import { selectedBaseJson, sourceFromState } from "../../mesa/baseWitness";
import { hidratarModelo } from "../../serializacion/json";
import { reviewAnchorExists } from "../../modelo/review";
import type { ModeloPersistido } from "../../persistencia/modelos";
import type { PersistenciaSesion } from "../modelPersistence";
import type {
  ReviewAnnotation,
  ReviewResolution,
  ReviewShareOwnerView,
  ReviewShareRecord,
} from "../../modelo/review";
import type {
  ReviewAnnotationInput,
  ReviewDocumentSnapshot,
  ReviewPublicRecord,
  ReviewRepository,
  ReviewShareRequest,
} from "./repository";
import { ReviewConflictError, ReviewInvalidError, ReviewNotFoundError } from "./errors";
import { canonicalWorkingCopyHash } from "./hash";

export type ReviewSql = Bun.SQL;

/** A revision share owns a private immutable JSON snapshot; it does not pin a prunable version row. */
export async function migrarTablasReview(db: ReviewSql): Promise<void> {
  await db`
    CREATE TABLE IF NOT EXISTS opforja_review_shares (
      tenant_id TEXT NOT NULL,
      document_id TEXT NOT NULL,
      id TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      revoked_at TEXT,
      permissions JSONB NOT NULL,
      snapshot JSONB NOT NULL,
      PRIMARY KEY (tenant_id, document_id, id),
      FOREIGN KEY (tenant_id, document_id) REFERENCES opforja_models(tenant_id, id) ON DELETE CASCADE
    )
  `;
  await db`CREATE INDEX IF NOT EXISTS opforja_review_shares_owner_idx ON opforja_review_shares (tenant_id, document_id, owner_id, created_at DESC)`;
  await db`
    CREATE TABLE IF NOT EXISTS opforja_review_annotations (
      tenant_id TEXT NOT NULL,
      document_id TEXT NOT NULL,
      share_id TEXT NOT NULL,
      id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      payload JSONB NOT NULL,
      PRIMARY KEY (tenant_id, document_id, share_id, id),
      FOREIGN KEY (tenant_id, document_id, share_id)
        REFERENCES opforja_review_shares(tenant_id, document_id, id) ON DELETE CASCADE
    )
  `;
  await db`
    CREATE TABLE IF NOT EXISTS opforja_review_resolutions (
      tenant_id TEXT NOT NULL,
      document_id TEXT NOT NULL,
      share_id TEXT NOT NULL,
      annotation_id TEXT NOT NULL,
      id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      payload JSONB NOT NULL,
      PRIMARY KEY (tenant_id, document_id, share_id, annotation_id, id),
      FOREIGN KEY (tenant_id, document_id, share_id, annotation_id)
        REFERENCES opforja_review_annotations(tenant_id, document_id, share_id, id) ON DELETE CASCADE
    )
  `;
  await db`CREATE INDEX IF NOT EXISTS opforja_review_resolutions_annotation_idx ON opforja_review_resolutions (tenant_id, document_id, share_id, annotation_id, created_at)`;
}

export function crearRepoReviewPostgres(sql: ReviewSql): ReviewRepository {
  return {
    async createShare(session, input, id, tokenHash, now) {
      return sql.begin(async (db) => {
        const document = await readLockedDocument(db, session, input.documentId, "UPDATE");
        if (!document || document.ownerId !== session.userId) throw new ReviewNotFoundError();
        if (document.revision !== input.expectedRevision ||
            canonicalWorkingCopyHash(document.modelJson) !== input.expectedWorkingCopyHash) {
          throw new ReviewConflictError();
        }
        const hydrated = hidratarModelo(document.modelJson);
        if (!hydrated.ok) throw new ReviewNotFoundError();
        const sourceMap = hydrated.value.mesaExploracion?.fuentes ?? {};
        if (input.includedSourceIds.some((sourceId) => !Object.hasOwn(sourceMap, sourceId))) {
          throw new ReviewInvalidError("Una de las fuentes elegidas ya no está disponible en esta revisión");
        }
        const snapshot = {
          revision: document.revision,
          source: document.source,
          capturedAt: now,
          modelName: hydrated.value.nombre,
          modelJson: document.modelJson,
          includedSourceIds: [...input.includedSourceIds],
        } satisfies ReviewShareRecord["snapshot"];
        const share: ReviewShareRecord = {
          id,
          tenantId: session.tenantId,
          documentId: input.documentId,
          ownerId: session.userId,
          tokenHash,
          createdAt: now,
          revokedAt: null,
          permissions: { annotate: input.annotate },
          snapshot,
        };
        await db`
          INSERT INTO opforja_review_shares
            (tenant_id, document_id, id, owner_id, token_hash, created_at, revoked_at, permissions, snapshot)
          VALUES (
            ${session.tenantId}, ${input.documentId}, ${id}, ${session.userId}, ${tokenHash}, ${now}, NULL,
            ${JSON.stringify(share.permissions)}::jsonb, ${JSON.stringify(snapshot)}::jsonb
          )
        `;
        return share;
      });
    },

    async listShares(session, documentId) {
      const rows = await sql<Array<Record<string, unknown>>>`
        SELECT id, owner_id, permissions, snapshot, created_at, revoked_at
        FROM opforja_review_shares
        WHERE tenant_id = ${session.tenantId} AND document_id = ${documentId} AND owner_id = ${session.userId}
        ORDER BY created_at DESC
      `;
      return rows.map((row) => ownerView({
        id: String(row.id), tenantId: session.tenantId, documentId, ownerId: String(row.owner_id),
        tokenHash: "", createdAt: String(row.created_at), revokedAt: row.revoked_at ? String(row.revoked_at) : null,
        permissions: asJson(row.permissions), snapshot: asJson(row.snapshot),
      }));
    },

    async getOwnerReview(session, documentId, shareId) {
      return sql.begin(async (db) => {
        const rows = await db<Array<Record<string, unknown>>>`
          SELECT tenant_id, document_id, id, owner_id, token_hash, created_at, revoked_at, permissions, snapshot
          FROM opforja_review_shares
          WHERE tenant_id = ${session.tenantId} AND document_id = ${documentId} AND id = ${shareId}
            AND owner_id = ${session.userId}
          FOR SHARE
        `;
        const row = rows[0];
        if (!row) return null;
        const share = shareFromRow(row);
        return { share, annotations: await readAnnotations(db, share) };
      });
    },

    async revokeShare(session, documentId, shareId, now) {
      const rows = await sql`
        UPDATE opforja_review_shares SET revoked_at = ${now}
        WHERE tenant_id = ${session.tenantId} AND document_id = ${documentId}
          AND id = ${shareId} AND owner_id = ${session.userId} AND revoked_at IS NULL
        RETURNING id
      `;
      return rows.length > 0;
    },

    async getPublic(tokenHash) {
      return sql.begin(async (db) => {
  const rows = await db<Array<Record<string, unknown>>>`
          SELECT tenant_id, document_id, id, owner_id, token_hash, created_at, revoked_at, permissions, snapshot
          FROM opforja_review_shares
          WHERE token_hash = ${tokenHash} AND revoked_at IS NULL
          FOR SHARE
        `;
        const row = rows[0];
        if (!row) return null;
        const share = shareFromRow(row);
        const annotations = await readAnnotations(db, share);
        return { share, annotations };
      });
    },

    async createAnnotation(tokenHash, input, annotation) {
      return sql.begin(async (db) => {
        const rows = await db`
          SELECT tenant_id, document_id, id, owner_id, token_hash, created_at, revoked_at, permissions, snapshot
          FROM opforja_review_shares WHERE token_hash = ${tokenHash} AND revoked_at IS NULL FOR UPDATE
        `;
        const row = rows[0];
        if (!row) return null;
        const share = shareFromRow(row);
        if (!share.permissions.annotate || share.documentId !== annotation.documentId || share.id !== annotation.shareId) return null;
        await db`
          INSERT INTO opforja_review_annotations (tenant_id, document_id, share_id, id, created_at, payload)
          VALUES (${share.tenantId}, ${share.documentId}, ${share.id}, ${annotation.id}, ${annotation.createdAt}, ${JSON.stringify(annotation)}::jsonb)
        `;
        return annotation;
      });
    },

    async resolveAnnotation(session, documentId, shareId, annotationId, resolution) {
      return sql.begin(async (db) => {
        const shareRows = await db`
          SELECT tenant_id, document_id, id, owner_id, token_hash, created_at, revoked_at, permissions, snapshot
          FROM opforja_review_shares
          WHERE tenant_id = ${session.tenantId} AND document_id = ${documentId} AND id = ${shareId}
            AND owner_id = ${session.userId}
          FOR UPDATE
        `;
        const shareRow = shareRows[0];
        if (!shareRow) return null;
        const share = shareFromRow(shareRow);
        const annotationRows = await db`
          SELECT payload::text AS payload FROM opforja_review_annotations
          WHERE tenant_id = ${session.tenantId} AND document_id = ${documentId}
            AND share_id = ${shareId} AND id = ${annotationId}
          FOR UPDATE
        `;
        const annotationRow = annotationRows[0];
        if (!annotationRow) return null;
        const baseAnnotation = asJson<ReviewAnnotation>(annotationRow.payload);
        const current = await readLockedDocument(db, session, documentId, "SHARE");
        if (!current) return null;
        const hydrated = hidratarModelo(current.modelJson);
        if (!hydrated.ok) return null;
        const storedResolution: ReviewResolution = {
          ...resolution,
          revision: current.revision,
          anchorPresent: reviewAnchorExists(hydrated.value, baseAnnotation.anchor),
        };
        await db`
          INSERT INTO opforja_review_resolutions
            (tenant_id, document_id, share_id, annotation_id, id, created_at, payload)
          VALUES (
            ${session.tenantId}, ${documentId}, ${shareId}, ${annotationId}, ${storedResolution.id},
            ${storedResolution.at}, ${JSON.stringify(storedResolution)}::jsonb
          )
        `;
        return { ...baseAnnotation, resolutions: [...baseAnnotation.resolutions, storedResolution] };
      });
    },
  };
}

async function readLockedDocument(
  db: ReviewSql,
  session: PersistenciaSesion,
  documentId: string,
  lock: "UPDATE" | "SHARE",
): Promise<ReviewDocumentSnapshot | null> {
  const modelRows = lock === "UPDATE" ? await db`
    SELECT owner_id, nombre, actualizado_en, revision, payload::text AS json
    FROM opforja_models WHERE tenant_id = ${session.tenantId} AND id = ${documentId} FOR UPDATE
  ` : await db`
    SELECT owner_id, nombre, actualizado_en, revision, payload::text AS json
    FROM opforja_models WHERE tenant_id = ${session.tenantId} AND id = ${documentId} FOR SHARE
  `;
  const model = modelRows[0];
  if (!model) return null;
  const autosaveRows = lock === "UPDATE" ? await db`
    SELECT creado_en, payload::text AS json FROM opforja_model_autosaves
    WHERE tenant_id = ${session.tenantId} AND modelo_id = ${documentId} FOR UPDATE
  ` : await db`
    SELECT creado_en, payload::text AS json FROM opforja_model_autosaves
    WHERE tenant_id = ${session.tenantId} AND modelo_id = ${documentId} FOR SHARE
  `;
  const autosave = autosaveRows[0] ? { createdAt: String(autosaveRows[0].creado_en), json: String(autosaveRows[0].json) } : null;
  const state = {
    modelId: documentId,
    saved: { revision: Number(model.revision ?? 0), updatedAt: String(model.actualizado_en), json: String(model.json) },
    autosave,
  };
  return {
    ownerId: String(model.owner_id),
    revision: Number(model.revision ?? 0),
    source: sourceFromState(state),
    modelJson: selectedBaseJson(state),
    modelName: String(model.nombre),
  };
}

function shareFromRow(row: Record<string, unknown>): ReviewShareRecord {
  return {
    id: String(row.id),
    tenantId: String(row.tenant_id),
    documentId: String(row.document_id),
    ownerId: String(row.owner_id),
    tokenHash: String(row.token_hash),
    createdAt: String(row.created_at),
    revokedAt: row.revoked_at ? String(row.revoked_at) : null,
    permissions: asJson(row.permissions),
    snapshot: asJson(row.snapshot),
  };
}

function ownerView(share: ReviewShareRecord): ReviewShareOwnerView {
  const hydrated = hidratarModelo(share.snapshot.modelJson);
  const sources = hydrated.ok ? hydrated.value.mesaExploracion?.fuentes ?? {} : {};
  return {
    id: share.id,
    documentId: share.documentId,
    revision: share.snapshot.revision,
    source: share.snapshot.source,
    modelName: share.snapshot.modelName,
    createdAt: share.createdAt,
    revokedAt: share.revokedAt,
    permissions: share.permissions,
    includedSources: share.snapshot.includedSourceIds.map((id) => ({ id, title: sources[id]?.titulo ?? "Fuente de texto" })),
  };
}

async function readAnnotations(db: ReviewSql, share: ReviewShareRecord): Promise<ReviewAnnotation[]> {
  const rows = await db<Array<Record<string, unknown>>>`
    SELECT id, payload::text AS payload FROM opforja_review_annotations
    WHERE tenant_id = ${share.tenantId} AND document_id = ${share.documentId} AND share_id = ${share.id}
    ORDER BY created_at, id
  `;
  const resolutions = await db`
    SELECT annotation_id, payload::text AS payload FROM opforja_review_resolutions
    WHERE tenant_id = ${share.tenantId} AND document_id = ${share.documentId} AND share_id = ${share.id}
    ORDER BY created_at, id
  `;
  const grouped = new Map<string, ReviewResolution[]>();
  for (const row of resolutions) {
    const list = grouped.get(String(row.annotation_id)) ?? [];
    list.push(asJson<ReviewResolution>(row.payload));
    grouped.set(String(row.annotation_id), list);
  }
  return rows.map((row) => {
    const annotation = asJson<ReviewAnnotation>(row.payload);
    return { ...annotation, resolutions: grouped.get(String(row.id)) ?? [] };
  });
}

function asJson<T>(value: unknown): T {
  if (typeof value === "string") {
    const parsed: unknown = JSON.parse(value);
    return (typeof parsed === "string" ? JSON.parse(parsed) : parsed) as T;
  }
  return value as T;
}
