import { Buffer } from "node:buffer";
import { PersistenciaConflictError, type PersistenciaSesion } from "../modelPersistence";
import { selectedBaseJson, sourceFromState } from "../../mesa/baseWitness";
import { hidratarModelo } from "../../serializacion/json";
import { firmaSnapshotSubmodelo } from "../../modelo/submodelos/estado";
import type { ModeloPersistido } from "../../persistencia/modelos";
import type { BackendAutosalvadoPersistido } from "../modelPersistence";
import type { CommitReceipt, Target, TaskEvent } from "../../agent/contracts";
import {
  type AgentChangeRecord,
  type AgentDocumentSnapshot,
  type AgentRepository,
  type AgentTaskRecord,
  type AgentTransaction,
  type AgentVariantRecord,
} from "./repository";

/** Bun.SQL and its transaction view share this callable tagged-template shape. */
export type AgentSql = Bun.SQL;

export async function migrarTablasAgente(db: AgentSql): Promise<void> {
  await db`
    CREATE TABLE IF NOT EXISTS opforja_agent_tasks (
      tenant_id TEXT NOT NULL,
      document_id TEXT NOT NULL,
      id TEXT NOT NULL,
      actor_id TEXT NOT NULL,
      status TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      payload JSONB NOT NULL,
      PRIMARY KEY (tenant_id, document_id, id),
      FOREIGN KEY (tenant_id, document_id) REFERENCES opforja_models(tenant_id, id) ON DELETE CASCADE
    )
  `;
  await db`CREATE INDEX IF NOT EXISTS opforja_agent_tasks_actor_idx ON opforja_agent_tasks (tenant_id, document_id, actor_id, updated_at DESC)`;
  await db`
    CREATE TABLE IF NOT EXISTS opforja_agent_changes (
      tenant_id TEXT NOT NULL,
      document_id TEXT NOT NULL,
      change_id TEXT NOT NULL,
      task_id TEXT,
      status TEXT NOT NULL,
      request_hash TEXT NOT NULL,
      payload JSONB NOT NULL,
      PRIMARY KEY (tenant_id, document_id, change_id),
      FOREIGN KEY (tenant_id, document_id) REFERENCES opforja_models(tenant_id, id) ON DELETE CASCADE
    )
  `;
  await db`CREATE INDEX IF NOT EXISTS opforja_agent_changes_task_idx ON opforja_agent_changes (tenant_id, document_id, task_id)`;
  await db`
    CREATE TABLE IF NOT EXISTS opforja_agent_events (
      tenant_id TEXT NOT NULL,
      document_id TEXT NOT NULL,
      task_id TEXT NOT NULL,
      sequence BIGINT NOT NULL CHECK (sequence > 0),
      id TEXT NOT NULL,
      payload JSONB NOT NULL,
      PRIMARY KEY (tenant_id, document_id, task_id, sequence),
      UNIQUE (tenant_id, document_id, task_id, id),
      FOREIGN KEY (tenant_id, document_id, task_id) REFERENCES opforja_agent_tasks(tenant_id, document_id, id) ON DELETE CASCADE
    )
  `;
  await db`
    CREATE TABLE IF NOT EXISTS opforja_agent_results (
      tenant_id TEXT NOT NULL,
      document_id TEXT NOT NULL,
      task_id TEXT NOT NULL,
      result_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      payload JSONB NOT NULL,
      PRIMARY KEY (tenant_id, document_id, task_id, result_id),
      FOREIGN KEY (tenant_id, document_id, task_id) REFERENCES opforja_agent_tasks(tenant_id, document_id, id) ON DELETE CASCADE
    )
  `;
  await db`
    CREATE TABLE IF NOT EXISTS opforja_agent_variants (
      tenant_id TEXT NOT NULL,
      document_id TEXT NOT NULL,
      id TEXT NOT NULL,
      task_id TEXT,
      state TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      payload JSONB NOT NULL,
      PRIMARY KEY (tenant_id, document_id, id),
      FOREIGN KEY (tenant_id, document_id) REFERENCES opforja_models(tenant_id, id) ON DELETE CASCADE
    )
  `;
}

/**
 * The current model table and autosave row are locked before callback code may
 * touch tasks. Legacy save/commit/autosave paths already lock the model first,
 * so the row is the shared serialization point across both APIs.
 */
export function crearRepoAgentePostgres(sql: Bun.SQL): AgentRepository {
  return {
    async transaction(session, documentId, work) {
      return sql.begin(async (db) => {
        const modelRows = await db<Array<Record<string, unknown>>>`
          SELECT id, nombre, descripcion, carpeta_id, creado_en, actualizado_en,
            ultima_apertura, autosalvado, archivado, archivado_en, archivado_auto,
            crear_version_al_guardar, revision, payload::text AS json
          FROM opforja_models
          WHERE tenant_id = ${session.tenantId} AND id = ${documentId}
          FOR UPDATE
        `;
        const model = modelRows[0] ? modelFromRow(modelRows[0]) : null;
        const autosaveRows = model ? await db<Array<Record<string, unknown>>>`
          SELECT creado_en, payload::text AS json
          FROM opforja_model_autosaves
          WHERE tenant_id = ${session.tenantId} AND modelo_id = ${documentId}
          FOR UPDATE
        ` : [];
        const autosave = autosaveRows[0] ? autosaveFromRow(documentId, autosaveRows[0]) : null;
        const workspaceRows = model ? await db<Array<Record<string, unknown>>>`
          SELECT indice
          FROM opforja_workspaces
          WHERE tenant_id = ${session.tenantId}
          FOR UPDATE
        ` : [];
        const writable = !workspaceRows[0] || !isLibraryEntry(workspaceRows[0].indice, documentId);
        let currentModel = model;
        let currentAutosave = autosave;

        const tx: AgentTransaction = {
          async getDocument() {
            if (!currentModel) return null;
            const savedJson = currentModel.json;
            const witnessState = {
              modelId: currentModel.id,
              saved: {
                revision: currentModel.revision ?? 0,
                updatedAt: currentModel.actualizadoEn,
                json: savedJson,
              },
              autosave: currentAutosave
                ? { createdAt: currentAutosave.creadoEn, json: currentAutosave.json }
                : null,
            };
            const effectiveJson = selectedBaseJson(witnessState);
            const hydrated = hidratarModelo(effectiveJson);
            if (!hydrated.ok) throw new PersistenciaConflictError("No se pudo leer el modelo vigente");
            return {
              model: currentModel,
              effectiveJson,
              effectiveModel: hydrated.value,
              semanticHash: firmaSnapshotSubmodelo(hydrated.value),
              source: sourceFromState(witnessState),
              autosaveCreatedAt: currentAutosave?.creadoEn ?? null,
              writable,
            } satisfies AgentDocumentSnapshot;
          },
          async putModel(next, expectedRevision) {
            if (!currentModel || currentModel.id !== documentId) throw new PersistenciaConflictError("El documento ya no existe");
            if ((currentModel.revision ?? 0) !== expectedRevision) throw new PersistenciaConflictError();
            const saved = await persistModelInTransaction(db, session, next, expectedRevision);
            currentModel = saved;
            currentAutosave = null;
            return saved;
          },
          async getTask(taskId) {
            const rows = await db`
              SELECT payload
              FROM opforja_agent_tasks
              WHERE tenant_id = ${session.tenantId} AND document_id = ${documentId} AND id = ${taskId}
              FOR UPDATE
            `;
            return rows[0] ? asJson<AgentTaskRecord>(rows[0].payload) : null;
          },
          async putTask(task) {
            await db`
              INSERT INTO opforja_agent_tasks (tenant_id, document_id, id, actor_id, status, updated_at, payload)
              VALUES (${session.tenantId}, ${documentId}, ${task.id}, ${task.actorId}, ${task.status}, ${task.updatedAt}, ${JSON.stringify(task)}::jsonb)
              ON CONFLICT (tenant_id, document_id, id) DO UPDATE SET
                actor_id = EXCLUDED.actor_id,
                status = EXCLUDED.status,
                updated_at = EXCLUDED.updated_at,
                payload = EXCLUDED.payload
            `;
            for (const result of task.results) {
              await db`
                INSERT INTO opforja_agent_results (tenant_id, document_id, task_id, result_id, created_at, payload)
                VALUES (${session.tenantId}, ${documentId}, ${task.id}, ${result.id}, ${result.createdAt}, ${JSON.stringify(result)}::jsonb)
                ON CONFLICT (tenant_id, document_id, task_id, result_id) DO NOTHING
              `;
            }
          },
          async getChange(changeId) {
            const rows = await db`
              SELECT payload
              FROM opforja_agent_changes
              WHERE tenant_id = ${session.tenantId} AND document_id = ${documentId} AND change_id = ${changeId}
              FOR UPDATE
            `;
            return rows[0] ? asJson<AgentChangeRecord>(rows[0].payload) : null;
          },
          async putChange(change) {
            await db`
              INSERT INTO opforja_agent_changes (tenant_id, document_id, change_id, task_id, status, request_hash, payload)
              VALUES (${session.tenantId}, ${documentId}, ${change.change.id}, ${change.change.taskId}, ${change.status}, ${change.requestHash}, ${JSON.stringify(change)}::jsonb)
              ON CONFLICT (tenant_id, document_id, change_id) DO UPDATE SET
                task_id = EXCLUDED.task_id,
                status = EXCLUDED.status,
                request_hash = EXCLUDED.request_hash,
                payload = EXCLUDED.payload
            `;
          },
          async getVariant(variantId) {
            const rows = await db`
              SELECT payload
              FROM opforja_agent_variants
              WHERE tenant_id = ${session.tenantId} AND document_id = ${documentId} AND id = ${variantId}
              FOR UPDATE
            `;
            return rows[0] ? asJson<AgentVariantRecord>(rows[0].payload) : null;
          },
          async putVariant(variant) {
            await db`
              INSERT INTO opforja_agent_variants (tenant_id, document_id, id, task_id, state, updated_at, payload)
              VALUES (${session.tenantId}, ${documentId}, ${variant.id}, ${variant.taskId}, ${variant.state}, ${variant.updatedAt}, ${JSON.stringify(variant)}::jsonb)
              ON CONFLICT (tenant_id, document_id, id) DO UPDATE SET
                task_id = EXCLUDED.task_id,
                state = EXCLUDED.state,
                updated_at = EXCLUDED.updated_at,
                payload = EXCLUDED.payload
            `;
          },
          async getGrant(changeId) {
            const change = await tx.getChange(changeId);
            return change?.grant ?? null;
          },
          async putGrant(changeId, grant) {
            const change = await tx.getChange(changeId);
            if (!change) throw new PersistenciaConflictError("Cambio preparado no disponible");
            await tx.putChange({ ...change, grant });
          },
          async appendEvent(event) {
            const sequenceRows = await db`
              SELECT COALESCE(MAX(sequence), 0) + 1 AS sequence
              FROM opforja_agent_events
              WHERE tenant_id = ${session.tenantId} AND document_id = ${documentId} AND task_id = ${event.taskId}
            `;
            const sequence = Number(sequenceRows[0]?.sequence ?? 1);
            const stored = { ...event, sequence };
            await db`
              INSERT INTO opforja_agent_events (tenant_id, document_id, task_id, sequence, id, payload)
              VALUES (${session.tenantId}, ${documentId}, ${event.taskId}, ${sequence}, ${event.id}, ${JSON.stringify(stored)}::jsonb)
            `;
            return stored;
          },
        };
        return work(tx);
      });
    },

    async getTask(session, documentId, taskId) {
      const rows = await sql`
        SELECT payload FROM opforja_agent_tasks
        WHERE tenant_id = ${session.tenantId} AND document_id = ${documentId} AND id = ${taskId}
        LIMIT 1
      `;
      return rows[0] ? asJson<AgentTaskRecord>(rows[0].payload) : null;
    },

    async listTasks(session, documentId) {
      const rows = await sql`
        SELECT payload FROM opforja_agent_tasks
        WHERE tenant_id = ${session.tenantId} AND document_id = ${documentId} AND actor_id = ${session.userId}
        ORDER BY updated_at DESC
      `;
      return (rows as Array<Record<string, unknown>>).map((row) => asJson<AgentTaskRecord>(row.payload));
    },

    async listEvents(session, documentId, taskId, after) {
      const rows = await sql`
        SELECT payload FROM opforja_agent_events
        WHERE tenant_id = ${session.tenantId} AND document_id = ${documentId}
          AND task_id = ${taskId} AND sequence > ${after}
        ORDER BY sequence ASC
      `;
      return (rows as Array<Record<string, unknown>>).map((row) => asJson<TaskEvent>(row.payload));
    },

    async getReceipt(session, target, changeId) {
      const rows = await sql`
        SELECT payload FROM opforja_agent_changes
        WHERE tenant_id = ${session.tenantId} AND document_id = ${target.documentId} AND change_id = ${changeId}
        LIMIT 1
      `;
      if (!rows[0]) return null;
      const record = asJson<AgentChangeRecord>(rows[0].payload);
      if (record.status !== "committed" || !record.receipt || !sameTarget(record.receipt.target, target)) return null;
      return record.receipt;
    },
  };
}

/** Shared legacy/agent writer. Do not split its model row from the transaction receipt. */
export async function persistModelInTransaction(
  db: AgentSql,
  session: PersistenciaSesion,
  model: ModeloPersistido,
  currentRevision: number | null,
): Promise<ModeloPersistido> {
  const payloadBase64 = base64Utf8(model.json);
  const versionsBase64 = model.versiones ? base64Utf8(JSON.stringify(model.versiones)) : null;
  const nextRevision = currentRevision === null ? 1 : currentRevision + 1;
  const savedRows = await db`
    INSERT INTO opforja_models (
      tenant_id, owner_id, id, nombre, descripcion, carpeta_id, creado_en,
      actualizado_en, ultima_apertura, autosalvado, archivado, archivado_en,
      archivado_auto, crear_version_al_guardar, versiones, revision, payload
    )
    VALUES (
      ${session.tenantId}, ${session.userId}, ${model.id}, ${model.nombre},
      ${model.descripcion}, ${model.carpetaId ?? null}, ${model.creadoEn},
      ${model.actualizadoEn}, ${model.ultimaApertura ?? null}, ${model.autosalvado ?? null},
      ${model.archivado ?? null}, ${model.archivadoEn ?? null}, ${model.archivadoAuto ?? null},
      ${model.crearVersionAlGuardar ?? null},
      CASE WHEN ${versionsBase64}::text IS NULL THEN NULL ELSE convert_from(decode(${versionsBase64}, 'base64'), 'UTF8')::jsonb END,
      ${nextRevision}, convert_from(decode(${payloadBase64}, 'base64'), 'UTF8')::jsonb
    )
    ON CONFLICT (tenant_id, id) DO UPDATE SET
      owner_id = EXCLUDED.owner_id,
      nombre = EXCLUDED.nombre,
      descripcion = EXCLUDED.descripcion,
      carpeta_id = EXCLUDED.carpeta_id,
      actualizado_en = EXCLUDED.actualizado_en,
      ultima_apertura = EXCLUDED.ultima_apertura,
      autosalvado = EXCLUDED.autosalvado,
      archivado = EXCLUDED.archivado,
      archivado_en = EXCLUDED.archivado_en,
      archivado_auto = EXCLUDED.archivado_auto,
      crear_version_al_guardar = EXCLUDED.crear_version_al_guardar,
      versiones = EXCLUDED.versiones,
      revision = EXCLUDED.revision,
      payload = EXCLUDED.payload
    WHERE opforja_models.revision = ${currentRevision ?? -1}
    RETURNING id
  `;
  if (savedRows.length === 0) throw new PersistenciaConflictError();
  if (model.autosalvado === true) {
    await upsertAutosaveInTransaction(db, session, {
      modeloId: model.id,
      creadoEn: new Date(Date.parse(model.actualizadoEn) + 1).toISOString(),
      json: model.json,
    });
  } else if (model.autosalvado === false) {
    await db`DELETE FROM opforja_model_autosaves WHERE tenant_id = ${session.tenantId} AND modelo_id = ${model.id}`;
  }
  return { ...model, revision: nextRevision };
}

export async function upsertAutosaveInTransaction(
  db: AgentSql,
  session: PersistenciaSesion,
  autosave: BackendAutosalvadoPersistido,
): Promise<void> {
  const payloadBase64 = base64Utf8(autosave.json);
  await db`
    INSERT INTO opforja_model_autosaves (tenant_id, modelo_id, owner_id, creado_en, payload)
    VALUES (${session.tenantId}, ${autosave.modeloId}, ${session.userId}, ${autosave.creadoEn}, convert_from(decode(${payloadBase64}, 'base64'), 'UTF8')::jsonb)
    ON CONFLICT (tenant_id, modelo_id) DO UPDATE SET owner_id = EXCLUDED.owner_id,
      creado_en = EXCLUDED.creado_en, payload = EXCLUDED.payload
  `;
}

function modelFromRow(row: Record<string, unknown>): ModeloPersistido {
  return {
    id: String(row.id),
    nombre: String(row.nombre),
    descripcion: typeof row.descripcion === "string" ? row.descripcion : "",
    creadoEn: String(row.creado_en),
    actualizadoEn: String(row.actualizado_en),
    json: typeof row.json === "string" ? row.json : JSON.stringify(row.json ?? {}),
    ...(row.carpeta_id === null || typeof row.carpeta_id === "string" ? { carpetaId: row.carpeta_id } : {}),
    ...(typeof row.ultima_apertura === "string" ? { ultimaApertura: row.ultima_apertura } : {}),
    ...(typeof row.autosalvado === "boolean" ? { autosalvado: row.autosalvado } : {}),
    ...(typeof row.archivado === "boolean" ? { archivado: row.archivado } : {}),
    ...(typeof row.archivado_en === "string" ? { archivadoEn: row.archivado_en } : {}),
    ...(typeof row.archivado_auto === "boolean" ? { archivadoAuto: row.archivado_auto } : {}),
    ...(typeof row.crear_version_al_guardar === "boolean" ? { crearVersionAlGuardar: row.crear_version_al_guardar } : {}),
    ...(typeof row.revision === "number" ? { revision: row.revision } : {}),
  };
}

function autosaveFromRow(modelId: string, row: Record<string, unknown>): BackendAutosalvadoPersistido {
  return {
    modeloId: modelId,
    creadoEn: String(row.creado_en),
    json: typeof row.json === "string" ? row.json : JSON.stringify(row.json ?? {}),
  };
}

function asJson<T>(value: unknown): T {
  if (typeof value === "string") return JSON.parse(value) as T;
  return value as T;
}

function base64Utf8(value: string): string {
  return Buffer.from(value, "utf8").toString("base64");
}

function isLibraryEntry(rawIndex: unknown, documentId: string): boolean {
  let index = rawIndex;
  if (typeof index === "string") {
    try { index = JSON.parse(index) as unknown; } catch { return false; }
  }
  if (typeof index !== "object" || index === null || Array.isArray(index)) return false;
  const models = (index as { modelos?: unknown }).modelos;
  return Array.isArray(models) && models.some((item) =>
    typeof item === "object" && item !== null && !Array.isArray(item) &&
    (item as { id?: unknown }).id === documentId &&
    (item as { esBiblioteca?: unknown }).esBiblioteca === true,
  );
}

function sameTarget(left: Target, right: Target): boolean {
  return left.kind === right.kind && left.documentId === right.documentId &&
    (left.kind !== "variant" || right.kind === "variant" && left.variantId === right.variantId);
}
