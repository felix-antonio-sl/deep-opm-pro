import { Buffer } from "node:buffer";
import {
  crearCookieSessionResolver,
  crearModelPersistenceFetchHandler,
  type BackendAutosalvadoPersistido,
  type BackendVersionPersistida,
  type ModelPersistenceRepository,
  type PersistenciaSesion,
} from "../src/server/modelPersistence";
import type { ModeloPersistido, ResumenModeloPersistido } from "../src/persistencia/local";
import type { WorkspaceIndice } from "../src/persistencia/workspace";
import { indiceVacio } from "../src/persistencia/workspace";
import { esPreferenciasUi, normalizarCarpetaIndice, normalizarModeloIndice } from "../src/persistencia/workspaceStorage";
import type { VersionResumen } from "../src/modelo/tipos";

const HOST = process.env.MODEL_API_HOST ?? "0.0.0.0";
const PORT = Number(process.env.MODEL_API_PORT ?? "3001");
const DATABASE_URL = process.env.DATABASE_URL;
const SESSION_SECRET = process.env.MODEL_SESSION_SECRET;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL requerido para model-persistence-api");
}
// Blindaje 2026-06-06 (auditoría persistencia, crítico #1): el default
// "opforja-dev-session" estaba en código público → cualquiera podía forjar
// cookies de otro tenant. Fail-fast: sin secret real NO se levanta el servicio.
if (!SESSION_SECRET || SESSION_SECRET === "opforja-dev-session" || SESSION_SECRET.length < 32) {
  throw new Error(
    "MODEL_SESSION_SECRET requerido (≥32 chars, distinto del default histórico). Genera uno: openssl rand -hex 32",
  );
}

const sql = new Bun.SQL(DATABASE_URL);
await inicializarSchema();

const handler = crearModelPersistenceFetchHandler({
  repo: repositorioPostgres(),
  sessionResolver: crearCookieSessionResolver(SESSION_SECRET),
});

Bun.serve({
  hostname: HOST,
  port: PORT,
  fetch: handler,
});

console.log(`model-persistence-api listening on http://${HOST}:${PORT}`);

async function inicializarSchema(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS opforja_tenants (
      id TEXT PRIMARY KEY,
      creado_en TEXT NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS opforja_users (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      creado_en TEXT NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS opforja_models (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      descripcion TEXT NOT NULL DEFAULT '',
      carpeta_id TEXT,
      creado_en TEXT NOT NULL,
      actualizado_en TEXT NOT NULL,
      ultima_apertura TEXT,
      autosalvado BOOLEAN,
      archivado BOOLEAN,
      archivado_en TEXT,
      archivado_auto BOOLEAN,
      crear_version_al_guardar BOOLEAN,
      versiones JSONB,
      payload JSONB NOT NULL
    )
  `;
  await sql`ALTER TABLE opforja_models ADD COLUMN IF NOT EXISTS tenant_id TEXT`;
  await sql`ALTER TABLE opforja_models ADD COLUMN IF NOT EXISTS owner_id TEXT`;
  await sql`UPDATE opforja_models SET tenant_id = 'tenant-legacy' WHERE tenant_id IS NULL`;
  await sql`UPDATE opforja_models SET owner_id = 'user-legacy' WHERE owner_id IS NULL`;
  await sql`ALTER TABLE opforja_models ALTER COLUMN tenant_id SET NOT NULL`;
  await sql`ALTER TABLE opforja_models ALTER COLUMN owner_id SET NOT NULL`;
  await sql`ALTER TABLE opforja_models DROP CONSTRAINT IF EXISTS opforja_models_pkey`;
  await sql`ALTER TABLE opforja_models ADD PRIMARY KEY (tenant_id, id)`;
  await sql`CREATE INDEX IF NOT EXISTS opforja_models_tenant_actualizado_idx ON opforja_models (tenant_id, actualizado_en DESC)`;

  await sql`
    CREATE TABLE IF NOT EXISTS opforja_workspaces (
      tenant_id TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL,
      actualizado_en TEXT NOT NULL,
      indice JSONB NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS opforja_model_versions (
      tenant_id TEXT NOT NULL,
      modelo_id TEXT NOT NULL,
      id TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      creado_en TEXT NOT NULL,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      preservar BOOLEAN NOT NULL DEFAULT false,
      modelo_payload_key TEXT NOT NULL,
      bytes INTEGER NOT NULL,
      payload JSONB NOT NULL,
      PRIMARY KEY (tenant_id, modelo_id, id)
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS opforja_versions_model_idx ON opforja_model_versions (tenant_id, modelo_id, creado_en DESC)`;
  await sql`
    CREATE TABLE IF NOT EXISTS opforja_model_autosaves (
      tenant_id TEXT NOT NULL,
      modelo_id TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      creado_en TEXT NOT NULL,
      payload JSONB NOT NULL,
      PRIMARY KEY (tenant_id, modelo_id)
    )
  `;
}

function repositorioPostgres(): ModelPersistenceRepository {
  return {
    async touchSession(session) {
      await asegurarSesion(session);
    },

    async list(session, includePayload = false) {
      const rows = await sql`
        SELECT
          m.id,
          m.nombre,
          m.descripcion,
          m.carpeta_id,
          m.creado_en,
          m.actualizado_en,
          m.ultima_apertura,
          m.autosalvado,
          m.archivado,
          m.archivado_en,
          m.archivado_auto,
          m.crear_version_al_guardar,
          COALESCE((
            SELECT jsonb_agg(jsonb_build_object(
              'id', v.id,
              'creadoEn', v.creado_en,
              'nombre', v.nombre,
              'descripcion', v.descripcion,
              'preservar', v.preservar,
              'modeloPayloadKey', v.modelo_payload_key,
              'bytes', v.bytes
            ) ORDER BY v.creado_en DESC)
            FROM opforja_model_versions v
            WHERE v.tenant_id = m.tenant_id AND v.modelo_id = m.id
          ), m.versiones) AS versiones,
          m.payload::text AS json
        FROM opforja_models m
        WHERE m.tenant_id = ${session.tenantId}
        ORDER BY m.actualizado_en DESC, m.nombre ASC
      `;
      return rows.map((row) => modeloDesdeRow(row, includePayload));
    },

    async get(session, id) {
      const rows = await sql`
        SELECT
          m.id,
          m.nombre,
          m.descripcion,
          m.carpeta_id,
          m.creado_en,
          m.actualizado_en,
          m.ultima_apertura,
          m.autosalvado,
          m.archivado,
          m.archivado_en,
          m.archivado_auto,
          m.crear_version_al_guardar,
          COALESCE((
            SELECT jsonb_agg(jsonb_build_object(
              'id', v.id,
              'creadoEn', v.creado_en,
              'nombre', v.nombre,
              'descripcion', v.descripcion,
              'preservar', v.preservar,
              'modeloPayloadKey', v.modelo_payload_key,
              'bytes', v.bytes
            ) ORDER BY v.creado_en DESC)
            FROM opforja_model_versions v
            WHERE v.tenant_id = m.tenant_id AND v.modelo_id = m.id
          ), m.versiones) AS versiones,
          m.payload::text AS json
        FROM opforja_models m
        WHERE m.tenant_id = ${session.tenantId} AND m.id = ${id}
        LIMIT 1
      `;
      const row = rows[0];
      return row ? modeloDesdeRow(row, true) as ModeloPersistido : null;
    },

    async save(session, modelo) {
      const payloadBase64 = base64Utf8(modelo.json);
      const versionesBase64 = modelo.versiones ? base64Utf8(JSON.stringify(modelo.versiones)) : null;
      await sql`
        INSERT INTO opforja_models (
          tenant_id,
          owner_id,
          id,
          nombre,
          descripcion,
          carpeta_id,
          creado_en,
          actualizado_en,
          ultima_apertura,
          autosalvado,
          archivado,
          archivado_en,
          archivado_auto,
          crear_version_al_guardar,
          versiones,
          payload
        )
        VALUES (
          ${session.tenantId},
          ${session.userId},
          ${modelo.id},
          ${modelo.nombre},
          ${modelo.descripcion},
          ${modelo.carpetaId ?? null},
          ${modelo.creadoEn},
          ${modelo.actualizadoEn},
          ${modelo.ultimaApertura ?? null},
          ${modelo.autosalvado ?? null},
          ${modelo.archivado ?? null},
          ${modelo.archivadoEn ?? null},
          ${modelo.archivadoAuto ?? null},
          ${modelo.crearVersionAlGuardar ?? null},
          CASE
            WHEN ${versionesBase64}::text IS NULL THEN NULL
            ELSE convert_from(decode(${versionesBase64}, 'base64'), 'UTF8')::jsonb
          END,
          convert_from(decode(${payloadBase64}, 'base64'), 'UTF8')::jsonb
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
          payload = EXCLUDED.payload
      `;
      return modelo;
    },

    async delete(session, id) {
      await sql`DELETE FROM opforja_model_autosaves WHERE tenant_id = ${session.tenantId} AND modelo_id = ${id}`;
      await sql`DELETE FROM opforja_model_versions WHERE tenant_id = ${session.tenantId} AND modelo_id = ${id}`;
      const rows = await sql`DELETE FROM opforja_models WHERE tenant_id = ${session.tenantId} AND id = ${id} RETURNING id`;
      return rows.length > 0;
    },

    async getWorkspace(session) {
      const rows = await sql`
        SELECT indice
        FROM opforja_workspaces
        WHERE tenant_id = ${session.tenantId}
        LIMIT 1
      `;
      return rows[0] ? normalizarWorkspace(rows[0].indice) : null;
    },

    async saveWorkspace(session, indice) {
      const indiceBase64 = base64Utf8(JSON.stringify(indice));
      const actualizadoEn = new Date().toISOString();
      await sql`
        INSERT INTO opforja_workspaces (tenant_id, owner_id, actualizado_en, indice)
        VALUES (
          ${session.tenantId},
          ${session.userId},
          ${actualizadoEn},
          convert_from(decode(${indiceBase64}, 'base64'), 'UTF8')::jsonb
        )
        ON CONFLICT (tenant_id) DO UPDATE SET
          owner_id = EXCLUDED.owner_id,
          actualizado_en = EXCLUDED.actualizado_en,
          indice = EXCLUDED.indice
      `;
      return indice;
    },

    async listVersions(session, modeloId) {
      const rows = await sql`
        SELECT id, creado_en, nombre, descripcion, preservar, modelo_payload_key, bytes
        FROM opforja_model_versions
        WHERE tenant_id = ${session.tenantId} AND modelo_id = ${modeloId}
        ORDER BY creado_en DESC
      `;
      return rows.map(versionDesdeRow).filter((version): version is VersionResumen => version !== null);
    },

    async getVersion(session, modeloId, versionId) {
      const rows = await sql`
        SELECT id, creado_en, nombre, descripcion, preservar, modelo_payload_key, bytes, payload::text AS json
        FROM opforja_model_versions
        WHERE tenant_id = ${session.tenantId} AND modelo_id = ${modeloId} AND id = ${versionId}
        LIMIT 1
      `;
      const row = rows[0];
      const version = row ? versionDesdeRow(row) : null;
      if (!row || !version) return null;
      return {
        modeloId,
        version,
        json: typeof row.json === "string" ? row.json : JSON.stringify(row.json ?? {}),
      };
    },

    async saveVersion(session, version) {
      const payloadBase64 = base64Utf8(version.json);
      await sql`
        INSERT INTO opforja_model_versions (
          tenant_id,
          modelo_id,
          id,
          owner_id,
          creado_en,
          nombre,
          descripcion,
          preservar,
          modelo_payload_key,
          bytes,
          payload
        )
        VALUES (
          ${session.tenantId},
          ${version.modeloId},
          ${version.version.id},
          ${session.userId},
          ${version.version.creadoEn},
          ${version.version.nombre},
          ${version.version.descripcion ?? null},
          ${version.version.preservar ?? false},
          ${version.version.modeloPayloadKey},
          ${version.version.bytes},
          convert_from(decode(${payloadBase64}, 'base64'), 'UTF8')::jsonb
        )
        ON CONFLICT (tenant_id, modelo_id, id) DO UPDATE SET
          owner_id = EXCLUDED.owner_id,
          creado_en = EXCLUDED.creado_en,
          nombre = EXCLUDED.nombre,
          descripcion = EXCLUDED.descripcion,
          preservar = EXCLUDED.preservar,
          modelo_payload_key = EXCLUDED.modelo_payload_key,
          bytes = EXCLUDED.bytes,
          payload = EXCLUDED.payload
      `;
      return version;
    },

    async deleteVersion(session, modeloId, versionId) {
      const rows = await sql`
        DELETE FROM opforja_model_versions
        WHERE tenant_id = ${session.tenantId} AND modelo_id = ${modeloId} AND id = ${versionId}
        RETURNING id
      `;
      return rows.length > 0;
    },

    async getAutosave(session, modeloId) {
      const rows = await sql`
        SELECT creado_en, payload::text AS json
        FROM opforja_model_autosaves
        WHERE tenant_id = ${session.tenantId} AND modelo_id = ${modeloId}
        LIMIT 1
      `;
      const row = rows[0];
      if (!row) return null;
      return {
        modeloId,
        creadoEn: String(row.creado_en),
        json: typeof row.json === "string" ? row.json : JSON.stringify(row.json ?? {}),
      };
    },

    async saveAutosave(session, autosave) {
      const payloadBase64 = base64Utf8(autosave.json);
      await sql`
        INSERT INTO opforja_model_autosaves (tenant_id, modelo_id, owner_id, creado_en, payload)
        VALUES (
          ${session.tenantId},
          ${autosave.modeloId},
          ${session.userId},
          ${autosave.creadoEn},
          convert_from(decode(${payloadBase64}, 'base64'), 'UTF8')::jsonb
        )
        ON CONFLICT (tenant_id, modelo_id) DO UPDATE SET
          owner_id = EXCLUDED.owner_id,
          creado_en = EXCLUDED.creado_en,
          payload = EXCLUDED.payload
      `;
      return autosave;
    },

    async health() {
      try {
        await sql`SELECT 1`;
        return true;
      } catch {
        return false;
      }
    },
  };
}

async function asegurarSesion(session: PersistenciaSesion): Promise<void> {
  const ahora = new Date().toISOString();
  await sql`
    INSERT INTO opforja_tenants (id, creado_en)
    VALUES (${session.tenantId}, ${ahora})
    ON CONFLICT (id) DO NOTHING
  `;
  await sql`
    INSERT INTO opforja_users (id, tenant_id, creado_en)
    VALUES (${session.userId}, ${session.tenantId}, ${ahora})
    ON CONFLICT (id) DO NOTHING
  `;
}

function base64Utf8(value: string): string {
  return Buffer.from(value, "utf8").toString("base64");
}

function modeloDesdeRow(row: Record<string, unknown>, includePayload: boolean): ModeloPersistido | ResumenModeloPersistido {
  const base: ResumenModeloPersistido = {
    id: String(row.id),
    nombre: String(row.nombre),
    descripcion: typeof row.descripcion === "string" ? row.descripcion : "",
    creadoEn: String(row.creado_en),
    actualizadoEn: String(row.actualizado_en),
    ...(row.carpeta_id === null || typeof row.carpeta_id === "string" ? { carpetaId: row.carpeta_id } : {}),
    ...(typeof row.ultima_apertura === "string" ? { ultimaApertura: row.ultima_apertura } : {}),
    ...(typeof row.autosalvado === "boolean" ? { autosalvado: row.autosalvado } : {}),
    ...(typeof row.archivado === "boolean" ? { archivado: row.archivado } : {}),
    ...(typeof row.archivado_en === "string" ? { archivadoEn: row.archivado_en } : {}),
    ...(typeof row.archivado_auto === "boolean" ? { archivadoAuto: row.archivado_auto } : {}),
    ...(typeof row.crear_version_al_guardar === "boolean" ? { crearVersionAlGuardar: row.crear_version_al_guardar } : {}),
  };
  const versiones = versionesDesdeRow(row.versiones);
  if (versiones.length > 0) base.versiones = versiones;
  if (!includePayload) return base;
  return {
    ...base,
    json: typeof row.json === "string" ? row.json : JSON.stringify(row.json ?? {}),
  };
}

function versionDesdeRow(row: Record<string, unknown>): VersionResumen | null {
  if (typeof row.id !== "string" ||
    typeof row.creado_en !== "string" ||
    typeof row.nombre !== "string" ||
    typeof row.modelo_payload_key !== "string" ||
    typeof row.bytes !== "number") {
    return null;
  }
  return {
    id: row.id,
    creadoEn: row.creado_en,
    nombre: row.nombre,
    ...(typeof row.descripcion === "string" ? { descripcion: row.descripcion } : {}),
    ...(row.preservar === true ? { preservar: true } : {}),
    modeloPayloadKey: row.modelo_payload_key,
    bytes: row.bytes,
  };
}

function versionesDesdeRow(value: unknown): VersionResumen[] {
  const parsed = typeof value === "string" ? parseJson(value) : value;
  if (!Array.isArray(parsed)) return [];
  return parsed.map(normalizarVersionResumen).filter((version): version is VersionResumen => version !== null);
}

function normalizarVersionResumen(value: unknown): VersionResumen | null {
  if (!esRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.creadoEn !== "string" ||
    typeof value.nombre !== "string" ||
    typeof value.modeloPayloadKey !== "string" ||
    typeof value.bytes !== "number") {
    return null;
  }
  return {
    id: value.id,
    creadoEn: value.creadoEn,
    nombre: value.nombre,
    ...(typeof value.descripcion === "string" ? { descripcion: value.descripcion } : {}),
    ...(value.preservar === true ? { preservar: true } : {}),
    modeloPayloadKey: value.modeloPayloadKey,
    bytes: value.bytes,
  };
}

function normalizarWorkspace(value: unknown): WorkspaceIndice {
  const parsed = typeof value === "string" ? parseJson(value) : value;
  if (!esRecord(parsed)) return indiceVacio();
  return {
    modelos: Array.isArray(parsed.modelos)
      ? parsed.modelos.map(normalizarModeloIndice).filter((modelo): modelo is WorkspaceIndice["modelos"][number] => modelo !== null)
      : [],
    carpetas: Array.isArray(parsed.carpetas)
      ? parsed.carpetas.map(normalizarCarpetaIndice).filter((carpeta): carpeta is WorkspaceIndice["carpetas"][number] => carpeta !== null)
      : [],
    recientes: Array.isArray(parsed.recientes) ? parsed.recientes.filter((id): id is string => typeof id === "string") : [],
    ...(typeof parsed.busquedaGlobalUltima === "string" ? { busquedaGlobalUltima: parsed.busquedaGlobalUltima } : {}),
    ...(esPreferenciasUi(parsed.preferenciasUi) ? { preferenciasUi: parsed.preferenciasUi } : {}),
  };
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function esRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
