import { Buffer } from "node:buffer";
import { crearModelPersistenceFetchHandler, type ModelPersistenceRepository } from "../src/server/modelPersistence";
import type { ModeloPersistido, ResumenModeloPersistido } from "../src/persistencia/local";

const HOST = process.env.MODEL_API_HOST ?? "0.0.0.0";
const PORT = Number(process.env.MODEL_API_PORT ?? "3001");
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL requerido para model-persistence-api");
}

const sql = new Bun.SQL(DATABASE_URL);
await inicializarSchema();

const handler = crearModelPersistenceFetchHandler({
  repo: repositorioPostgres(),
});

Bun.serve({
  hostname: HOST,
  port: PORT,
  fetch: handler,
});

console.log(`model-persistence-api listening on http://${HOST}:${PORT}`);

async function inicializarSchema(): Promise<void> {
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
  await sql`CREATE INDEX IF NOT EXISTS opforja_models_actualizado_idx ON opforja_models (actualizado_en DESC)`;
}

function repositorioPostgres(): ModelPersistenceRepository {
  return {
    async list(includePayload = false) {
      const rows = await sql`
        SELECT
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
          payload::text AS json
        FROM opforja_models
        ORDER BY actualizado_en DESC, nombre ASC
      `;
      return rows.map((row) => modeloDesdeRow(row, includePayload));
    },

    async get(id) {
      const rows = await sql`
        SELECT
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
          payload::text AS json
        FROM opforja_models
        WHERE id = ${id}
        LIMIT 1
      `;
      const row = rows[0];
      return row ? modeloDesdeRow(row, true) as ModeloPersistido : null;
    },

    async save(modelo) {
      const payloadBase64 = base64Utf8(modelo.json);
      const versionesBase64 = modelo.versiones ? base64Utf8(JSON.stringify(modelo.versiones)) : null;
      await sql`
        INSERT INTO opforja_models (
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
        ON CONFLICT (id) DO UPDATE SET
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

    async delete(id) {
      const rows = await sql`DELETE FROM opforja_models WHERE id = ${id} RETURNING id`;
      return rows.length > 0;
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
    ...(Array.isArray(row.versiones) ? { versiones: row.versiones as ResumenModeloPersistido["versiones"] } : {}),
    ...(typeof row.crear_version_al_guardar === "boolean" ? { crearVersionAlGuardar: row.crear_version_al_guardar } : {}),
  };
  if (!includePayload) return base;
  return {
    ...base,
    json: typeof row.json === "string" ? row.json : JSON.stringify(row.json ?? {}),
  };
}
