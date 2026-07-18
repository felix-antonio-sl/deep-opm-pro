import { Buffer } from "node:buffer";
import {
  crearCookieSessionResolver,
  crearModelPersistenceFetchHandler,
  evaluarPoliticaCommit,
  PersistenciaConflictError,
  type AuthRepository,
  type BackendAutosalvadoPersistido,
  type BackendVersionPersistida,
  type ModelPersistenceRepository,
  type PersistenciaSesion,
} from "../src/server/modelPersistence";
import { autosaveTimestampAfter, baseWitnessMatches } from "../src/mesa/baseWitness";
import type { ModeloPersistido, ResumenModeloPersistido } from "../src/persistencia/modelos";
import type {
  WorkspaceIndice,
  WorkspacePersistido,
} from "../src/persistencia/workspace";
import { indiceVacio } from "../src/persistencia/workspace";
import { establecerEspecieCreada } from "../src/mesa/especieWorkspace";
import { especieDe } from "../src/persistencia/especie";
import { isTimestampAfter } from "../src/mesa/timestampOrder";
import { esPreferenciasUi, normalizarCarpetaIndice, normalizarModeloIndice } from "../src/persistencia/workspaceStorage";
import { aplicarPoliticaLogScaleVersiones, idsVersionesPodadas } from "../src/persistencia/politicaVersiones";
import type { VersionResumen } from "../src/modelo/tipos";
import { elegirSessionResolver } from "../src/server/sessionResolverSelector";

const HOST = process.env.MODEL_API_HOST ?? "0.0.0.0";
const PORT = Number(process.env.MODEL_API_PORT ?? "3001");
const DATABASE_URL = process.env.DATABASE_URL;
const SESSION_SECRET = process.env.MODEL_SESSION_SECRET;
const MAX_VERSIONES_POR_MODELO = Math.max(
  1,
  Number.parseInt(process.env.MODEL_MAX_VERSIONS_PER_MODEL ?? "30", 10) || 30,
);

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

async function inicializarSchema(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS opforja_schema_migrations (
      version INTEGER PRIMARY KEY,
      nombre TEXT NOT NULL,
      aplicado_en TEXT NOT NULL
    )
  `;
  const aplicadasRows = (await sql`SELECT version FROM opforja_schema_migrations`) as Array<Record<string, unknown>>;
  const aplicadas = new Set(aplicadasRows.map((row) => Number(row.version)));
  for (const migracion of MIGRACIONES_SCHEMA) {
    if (aplicadas.has(migracion.version)) continue;
    await sql.begin(async (tx) => {
      await migracion.run(tx);
      await tx`
        INSERT INTO opforja_schema_migrations (version, nombre, aplicado_en)
        VALUES (${migracion.version}, ${migracion.nombre}, ${new Date().toISOString()})
      `;
    });
    logEvento("model_api_migration_applied", { version: migracion.version, nombre: migracion.nombre });
  }
}

const MIGRACIONES_SCHEMA = [
  {
    version: 1,
    nombre: "base_persistencia_modelos",
    async run(db: typeof sql) {
      await db`
        CREATE TABLE IF NOT EXISTS opforja_tenants (
          id TEXT PRIMARY KEY,
          creado_en TEXT NOT NULL
        )
      `;
      await db`
        CREATE TABLE IF NOT EXISTS opforja_users (
          id TEXT PRIMARY KEY,
          tenant_id TEXT NOT NULL,
          creado_en TEXT NOT NULL
        )
      `;
      await db`
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
          revision INTEGER NOT NULL DEFAULT 1,
          payload JSONB NOT NULL
        )
      `;
      await db`ALTER TABLE opforja_models ADD COLUMN IF NOT EXISTS tenant_id TEXT`;
      await db`ALTER TABLE opforja_models ADD COLUMN IF NOT EXISTS owner_id TEXT`;
      await db`UPDATE opforja_models SET tenant_id = 'tenant-legacy' WHERE tenant_id IS NULL`;
      await db`UPDATE opforja_models SET owner_id = 'user-legacy' WHERE owner_id IS NULL`;
      await db`ALTER TABLE opforja_models ALTER COLUMN tenant_id SET NOT NULL`;
      await db`ALTER TABLE opforja_models ALTER COLUMN owner_id SET NOT NULL`;
      await db`ALTER TABLE opforja_models DROP CONSTRAINT IF EXISTS opforja_models_pkey`;
      await db`ALTER TABLE opforja_models ADD PRIMARY KEY (tenant_id, id)`;
      await db`CREATE INDEX IF NOT EXISTS opforja_models_tenant_actualizado_idx ON opforja_models (tenant_id, actualizado_en DESC)`;
      await db`
        CREATE TABLE IF NOT EXISTS opforja_workspaces (
          tenant_id TEXT PRIMARY KEY,
          owner_id TEXT NOT NULL,
          actualizado_en TEXT NOT NULL,
          indice JSONB NOT NULL
        )
      `;
      await db`
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
      await db`CREATE INDEX IF NOT EXISTS opforja_versions_model_idx ON opforja_model_versions (tenant_id, modelo_id, creado_en DESC)`;
      await db`
        CREATE TABLE IF NOT EXISTS opforja_model_autosaves (
          tenant_id TEXT NOT NULL,
          modelo_id TEXT NOT NULL,
          owner_id TEXT NOT NULL,
          creado_en TEXT NOT NULL,
          payload JSONB NOT NULL,
          PRIMARY KEY (tenant_id, modelo_id)
        )
      `;
    },
  },
  {
    version: 2,
    nombre: "integridad_referencial_y_operacion",
    async run(db: typeof sql) {
      const ahora = new Date().toISOString();
      await db`
        INSERT INTO opforja_tenants (id, creado_en)
        SELECT DISTINCT tenant_id, ${ahora}
        FROM opforja_users
        ON CONFLICT (id) DO NOTHING
      `;
      await db`
        INSERT INTO opforja_tenants (id, creado_en)
        SELECT DISTINCT tenant_id, ${ahora}
        FROM opforja_models
        ON CONFLICT (id) DO NOTHING
      `;
      await db`
        INSERT INTO opforja_tenants (id, creado_en)
        SELECT DISTINCT tenant_id, ${ahora}
        FROM opforja_workspaces
        ON CONFLICT (id) DO NOTHING
      `;
      await db`
        INSERT INTO opforja_tenants (id, creado_en)
        SELECT DISTINCT tenant_id, ${ahora}
        FROM opforja_model_versions
        ON CONFLICT (id) DO NOTHING
      `;
      await db`
        INSERT INTO opforja_tenants (id, creado_en)
        SELECT DISTINCT tenant_id, ${ahora}
        FROM opforja_model_autosaves
        ON CONFLICT (id) DO NOTHING
      `;
      await db`
        INSERT INTO opforja_users (id, tenant_id, creado_en)
        SELECT DISTINCT owner_id, tenant_id, ${ahora}
        FROM opforja_models
        ON CONFLICT (id) DO NOTHING
      `;
      await db`
        INSERT INTO opforja_users (id, tenant_id, creado_en)
        SELECT DISTINCT owner_id, tenant_id, ${ahora}
        FROM opforja_workspaces
        ON CONFLICT (id) DO NOTHING
      `;
      await db`
        INSERT INTO opforja_users (id, tenant_id, creado_en)
        SELECT DISTINCT owner_id, tenant_id, ${ahora}
        FROM opforja_model_versions
        ON CONFLICT (id) DO NOTHING
      `;
      await db`
        INSERT INTO opforja_users (id, tenant_id, creado_en)
        SELECT DISTINCT owner_id, tenant_id, ${ahora}
        FROM opforja_model_autosaves
        ON CONFLICT (id) DO NOTHING
      `;
      await db`
        DELETE FROM opforja_model_versions v
        WHERE NOT EXISTS (
          SELECT 1 FROM opforja_models m
          WHERE m.tenant_id = v.tenant_id AND m.id = v.modelo_id
        )
      `;
      await db`
        DELETE FROM opforja_model_autosaves a
        WHERE NOT EXISTS (
          SELECT 1 FROM opforja_models m
          WHERE m.tenant_id = a.tenant_id AND m.id = a.modelo_id
        )
      `;
      await db`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'opforja_users_tenant_fk') THEN
            ALTER TABLE opforja_users
              ADD CONSTRAINT opforja_users_tenant_fk
              FOREIGN KEY (tenant_id) REFERENCES opforja_tenants(id) ON DELETE CASCADE;
          END IF;
        END $$;
      `;
      await db`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'opforja_models_tenant_fk') THEN
            ALTER TABLE opforja_models
              ADD CONSTRAINT opforja_models_tenant_fk
              FOREIGN KEY (tenant_id) REFERENCES opforja_tenants(id) ON DELETE CASCADE;
          END IF;
          IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'opforja_models_owner_fk') THEN
            ALTER TABLE opforja_models
              ADD CONSTRAINT opforja_models_owner_fk
              FOREIGN KEY (owner_id) REFERENCES opforja_users(id);
          END IF;
        END $$;
      `;
      await db`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'opforja_workspaces_tenant_fk') THEN
            ALTER TABLE opforja_workspaces
              ADD CONSTRAINT opforja_workspaces_tenant_fk
              FOREIGN KEY (tenant_id) REFERENCES opforja_tenants(id) ON DELETE CASCADE;
          END IF;
          IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'opforja_workspaces_owner_fk') THEN
            ALTER TABLE opforja_workspaces
              ADD CONSTRAINT opforja_workspaces_owner_fk
              FOREIGN KEY (owner_id) REFERENCES opforja_users(id);
          END IF;
        END $$;
      `;
      await db`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'opforja_versions_model_fk') THEN
            ALTER TABLE opforja_model_versions
              ADD CONSTRAINT opforja_versions_model_fk
              FOREIGN KEY (tenant_id, modelo_id) REFERENCES opforja_models(tenant_id, id) ON DELETE CASCADE;
          END IF;
          IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'opforja_versions_owner_fk') THEN
            ALTER TABLE opforja_model_versions
              ADD CONSTRAINT opforja_versions_owner_fk
              FOREIGN KEY (owner_id) REFERENCES opforja_users(id);
          END IF;
        END $$;
      `;
      await db`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'opforja_autosaves_model_fk') THEN
            ALTER TABLE opforja_model_autosaves
              ADD CONSTRAINT opforja_autosaves_model_fk
              FOREIGN KEY (tenant_id, modelo_id) REFERENCES opforja_models(tenant_id, id) ON DELETE CASCADE;
          END IF;
          IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'opforja_autosaves_owner_fk') THEN
            ALTER TABLE opforja_model_autosaves
              ADD CONSTRAINT opforja_autosaves_owner_fk
              FOREIGN KEY (owner_id) REFERENCES opforja_users(id);
          END IF;
        END $$;
      `;
      await db`CREATE INDEX IF NOT EXISTS opforja_users_tenant_idx ON opforja_users (tenant_id)`;
      await db`CREATE INDEX IF NOT EXISTS opforja_workspaces_owner_idx ON opforja_workspaces (owner_id)`;
      await db`CREATE INDEX IF NOT EXISTS opforja_versions_owner_idx ON opforja_model_versions (owner_id)`;
      await db`CREATE INDEX IF NOT EXISTS opforja_autosaves_owner_idx ON opforja_model_autosaves (owner_id)`;
      await db`CREATE INDEX IF NOT EXISTS opforja_autosaves_creado_idx ON opforja_model_autosaves (tenant_id, creado_en DESC)`;
    },
  },
  {
    version: 3,
    nombre: "optimistic_locking_modelos",
    async run(db: typeof sql) {
      await db`ALTER TABLE opforja_models ADD COLUMN IF NOT EXISTS revision INTEGER NOT NULL DEFAULT 1`;
      await db`UPDATE opforja_models SET revision = 1 WHERE revision IS NULL OR revision < 1`;
      await db`CREATE INDEX IF NOT EXISTS opforja_models_tenant_revision_idx ON opforja_models (tenant_id, id, revision)`;
    },
  },
  {
    // Auth v1 (docs/specs/auth-identidad-v1.md §1): cuentas + membresía.
    // Aditiva: no toca tablas existentes; rollback = MODEL_REQUIRE_AUTH=false.
    version: 4,
    nombre: "auth_identidad",
    async run(db: typeof sql) {
      await db`
        CREATE TABLE IF NOT EXISTS opforja_accounts (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          user_id TEXT NOT NULL REFERENCES opforja_users(id),
          creado_en TEXT NOT NULL,
          ultimo_login_en TEXT
        )
      `;
      await db`CREATE UNIQUE INDEX IF NOT EXISTS opforja_accounts_email_idx ON opforja_accounts (email)`;
      await db`
        CREATE TABLE IF NOT EXISTS opforja_account_tenants (
          account_id TEXT NOT NULL REFERENCES opforja_accounts(id) ON DELETE CASCADE,
          tenant_id TEXT NOT NULL REFERENCES opforja_tenants(id) ON DELETE CASCADE,
          rol TEXT NOT NULL DEFAULT 'owner',
          creado_en TEXT NOT NULL,
          PRIMARY KEY (account_id, tenant_id)
        )
      `;
    },
  },
  {
    version: 5,
    nombre: "optimistic_locking_workspace",
    async run(db: typeof sql) {
      await db`
        ALTER TABLE opforja_workspaces
        ADD COLUMN IF NOT EXISTS revision INTEGER NOT NULL DEFAULT 1
      `;
      await db`
        UPDATE opforja_workspaces
        SET revision = 1
        WHERE revision IS NULL OR revision < 1
      `;
    },
  },
] satisfies Array<{ version: number; nombre: string; run: (db: typeof sql) => Promise<void> }>;

await inicializarSchema();

// Auth v1 (spec §3): fail-closed — el gate de login está activo salvo opt-out
// explícito MODEL_REQUIRE_AUTH=false (rollback spec §7, no toca datos).
const REQUIRE_AUTH = process.env.MODEL_REQUIRE_AUTH !== "false";

const cookieResolver = crearCookieSessionResolver(SESSION_SECRET);
const AGENT_TOKEN = process.env.MODEL_AGENT_TOKEN;
const AGENT_IDENTITY = process.env.MODEL_AGENT_IDENTITY; // "tenantId:userId"

// Envoltorio delgado: lee `process.env` y delega la DECISIÓN al selector
// puro (`src/server/sessionResolverSelector.ts`, Task 8 FIX 2+FIX 3) —
// testeado ahí sin necesidad de arrancar este script (Bun.serve + Postgres
// en el top-level).
function construirSessionResolver() {
  return elegirSessionResolver({ token: AGENT_TOKEN, identity: AGENT_IDENTITY }, cookieResolver, (habilitado) =>
    logEvento("model_api_agent_token", { habilitado }),
  );
}

const handler = crearModelPersistenceFetchHandler({
  repo: repositorioPostgres(),
  sessionResolver: construirSessionResolver(),
  auth: { repo: authRepositorioPostgres(), secret: SESSION_SECRET, requireAuth: REQUIRE_AUTH },
});

Bun.serve({
  hostname: HOST,
  port: PORT,
  fetch: async (request) => {
    const inicio = performance.now();
    const url = new URL(request.url);
    const response = await handler(request);
    logEvento("model_api_request", {
      method: request.method,
      path: url.pathname,
      status: response.status,
      durationMs: Math.round(performance.now() - inicio),
    });
    return response;
  },
});

logEvento("model_api_started", { host: HOST, port: PORT, maxVersionesPorModelo: MAX_VERSIONES_POR_MODELO });

function authRepositorioPostgres(): AuthRepository {
  return {
    async getCuentaPorEmail(email) {
      const rows = await sql`
        SELECT a.id, a.email, a.password_hash, a.user_id, m.tenant_id
        FROM opforja_accounts a
        JOIN opforja_account_tenants m ON m.account_id = a.id
        WHERE a.email = ${email}
        ORDER BY m.creado_en ASC
        LIMIT 1
      `;
      const row = rows[0];
      if (!row) return null;
      return {
        id: String(row.id),
        email: String(row.email),
        passwordHash: String(row.password_hash),
        userId: String(row.user_id),
        tenantId: String(row.tenant_id),
      };
    },
    async touchLogin(accountId, fecha) {
      await sql`UPDATE opforja_accounts SET ultimo_login_en = ${fecha} WHERE id = ${accountId}`;
    },
  };
}

function repositorioPostgres(): ModelPersistenceRepository {
  return {
    async touchSession(session) {
      await asegurarSesion(session);
    },

    async list(session, includePayload = false) {
      const rows = (await sql`
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
          m.revision,
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
      `) as Array<Record<string, unknown>>;
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
          m.revision,
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
      return sql.begin(async (tx) => {
        const actualRows = await tx`
          SELECT revision
          FROM opforja_models
          WHERE tenant_id = ${session.tenantId} AND id = ${modelo.id}
          FOR UPDATE
        `;
        const actual = actualRows[0];
        const revisionActual = typeof actual?.revision === "number" ? actual.revision : null;
        if (revisionActual !== null && modelo.revision !== revisionActual) {
          throw new PersistenciaConflictError();
        }
        if (revisionActual === null && modelo.revision !== undefined) {
          throw new PersistenciaConflictError("El modelo ya no existe");
        }
        return persistModelInTransaction(tx, session, modelo, revisionActual);
      });
    },

    async delete(session, id) {
      return sql.begin(async (tx) => {
        const locked = await tx`
          SELECT id
          FROM opforja_models
          WHERE tenant_id = ${session.tenantId} AND id = ${id}
          FOR UPDATE
        `;
        if (locked.length === 0) return false;
        await tx`DELETE FROM opforja_model_autosaves WHERE tenant_id = ${session.tenantId} AND modelo_id = ${id}`;
        await tx`DELETE FROM opforja_model_versions WHERE tenant_id = ${session.tenantId} AND modelo_id = ${id}`;
        await tx`DELETE FROM opforja_models WHERE tenant_id = ${session.tenantId} AND id = ${id}`;
        return true;
      });
    },

    async getWorkspace(session) {
      const rows = await sql`
        SELECT indice, revision
        FROM opforja_workspaces
        WHERE tenant_id = ${session.tenantId}
        LIMIT 1
      `;
      return rows[0]
        ? {
            indice: normalizarWorkspace(rows[0].indice),
            revision: Number(rows[0].revision),
          }
        : null;
    },

    async saveWorkspace(session, write) {
      return sql.begin(async (tx) => {
        const workspace = await lockWorkspaceInTransaction(tx, session);
        if (workspace.revision !== write.revisionBase) {
          throw new PersistenciaConflictError(
            "Workspace desactualizado; recarga antes de guardar",
          );
        }
        return persistWorkspaceInTransaction(
          tx,
          session,
          write.indice,
          workspace.revision,
        );
      });
    },

    async listVersions(session, modeloId) {
      const rows = (await sql`
        SELECT id, creado_en, nombre, descripcion, preservar, modelo_payload_key, bytes
        FROM opforja_model_versions
        WHERE tenant_id = ${session.tenantId} AND modelo_id = ${modeloId}
        ORDER BY creado_en DESC
      `) as Array<Record<string, unknown>>;
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
      await sql.begin(async (tx) => {
        await persistFreshVersionInTransaction(tx, session, version);
      });
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

    async commitRevision(session, commit) {
      return sql.begin(async (tx) => {
        const currentRows = await tx`
          SELECT revision, actualizado_en, payload::text AS json
          FROM opforja_models
          WHERE tenant_id = ${session.tenantId} AND id = ${commit.model.id}
          FOR UPDATE
        `;
        const current = currentRows[0];

        if (!current) {
          if (commit.base.kind !== "new") throw new PersistenciaConflictError();
          if (!commit.speciesOnCreate) throw new PersistenciaConflictError("La creación exige especie");
          const workspace = await lockWorkspaceInTransaction(tx, session);
          const veredicto = evaluarPoliticaCommit(commit);
          if (!veredicto.ok) throw new PersistenciaConflictError(veredicto.motivo);
          const saved = await persistModelInTransaction(
            tx,
            session,
            { ...commit.model, autosalvado: false },
            null,
          );
          await persistFreshVersionInTransaction(tx, session, {
            modeloId: saved.id,
            version: commit.version,
            json: saved.json,
          });
          await persistWorkspaceInTransaction(
            tx,
            session,
            establecerEspecieCreada(
              workspace.indice,
              saved.id,
              commit.speciesOnCreate,
            ),
            workspace.revision,
          );
          return { model: saved, version: commit.version };
        }

        if (commit.base.kind !== "existing") {
          throw new PersistenciaConflictError("El modelo ya existe; ejecuta pull antes de actualizar");
        }
        const workspace = await lockWorkspaceInTransaction(tx, session);
        if (workspace.indice.modelos.some((item) =>
          item.id === commit.model.id && item.esBiblioteca === true
        )) {
          throw new PersistenciaConflictError("Destino biblioteca es solo-lectura");
        }
        const revision = typeof current.revision === "number" ? current.revision : 0;
        const autosaveRows = await tx`
          SELECT creado_en, payload::text AS json
          FROM opforja_model_autosaves
          WHERE tenant_id = ${session.tenantId} AND modelo_id = ${commit.model.id}
          FOR UPDATE
        `;
        const autosave = autosaveRows[0];
        const matches = commit.model.revision === revision && baseWitnessMatches(commit.base.witness, {
          modelId: commit.model.id,
          saved: {
            revision,
            updatedAt: String(current.actualizado_en),
            json: typeof current.json === "string" ? current.json : JSON.stringify(current.json ?? {}),
          },
          autosave: autosave
            ? {
                createdAt: String(autosave.creado_en),
                json: typeof autosave.json === "string" ? autosave.json : JSON.stringify(autosave.json ?? {}),
              }
            : null,
        });
        if (!matches) throw new PersistenciaConflictError();
        const entry = workspace.indice.modelos.find((item) => item.id === commit.model.id);
        const veredicto = evaluarPoliticaCommit(commit, {
          savedJson: typeof current.json === "string"
            ? current.json
            : JSON.stringify(current.json ?? {}),
          autosaveJson: autosave
            ? (typeof autosave.json === "string"
                ? autosave.json
                : JSON.stringify(autosave.json ?? {}))
            : null,
          species: entry ? especieDe(entry) : "modelo",
        });
        if (!veredicto.ok) throw new PersistenciaConflictError(veredicto.motivo);

        const saved = await persistModelInTransaction(
          tx,
          session,
          { ...commit.model, autosalvado: false },
          revision,
        );
        await persistFreshVersionInTransaction(tx, session, {
          modeloId: saved.id,
          version: commit.version,
          json: saved.json,
        });
        return { model: saved, version: commit.version };
      });
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
      return sql.begin(async (tx) => {
        const currentRows = await tx`
          SELECT revision, actualizado_en
          FROM opforja_models
          WHERE tenant_id = ${session.tenantId} AND id = ${autosave.modeloId}
          FOR UPDATE
        `;
        const currentRevision = currentRows[0]?.revision;
        if (currentRevision !== autosave.revisionBase) throw new PersistenciaConflictError();

        const autosaveRows = await tx`
          SELECT creado_en
          FROM opforja_model_autosaves
          WHERE tenant_id = ${session.tenantId} AND modelo_id = ${autosave.modeloId}
        `;
        const existingAutosaveAt = autosaveRows[0]?.creado_en;
        if (existingAutosaveAt !== undefined &&
          !isTimestampAfter(autosave.creadoEn, String(existingAutosaveAt))) {
          throw new PersistenciaConflictError("El autosalvado es anterior al ya persistido");
        }
        const currentUpdatedAt = String(currentRows[0]?.actualizado_en ?? "");
        const normalized = {
          ...autosave,
          creadoEn: isTimestampAfter(autosave.creadoEn, currentUpdatedAt)
            ? autosave.creadoEn
            : autosaveTimestampAfter(currentUpdatedAt),
        };
        await upsertAutosaveInTransaction(tx, session, normalized);
        await tx`
          UPDATE opforja_models
          SET autosalvado = true
          WHERE tenant_id = ${session.tenantId} AND id = ${autosave.modeloId}
        `;
        return {
          modeloId: autosave.modeloId,
          creadoEn: normalized.creadoEn,
          json: autosave.json,
        };
      });
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

async function persistModelInTransaction(
  db: typeof sql,
  session: PersistenciaSesion,
  model: ModeloPersistido,
  currentRevision: number | null,
): Promise<ModeloPersistido> {
  const payloadBase64 = base64Utf8(model.json);
  const versionsBase64 = model.versiones ? base64Utf8(JSON.stringify(model.versiones)) : null;
  const nextRevision = currentRevision === null ? 1 : currentRevision + 1;
  const savedRows = await db`
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
      revision,
      payload
    )
    VALUES (
      ${session.tenantId},
      ${session.userId},
      ${model.id},
      ${model.nombre},
      ${model.descripcion},
      ${model.carpetaId ?? null},
      ${model.creadoEn},
      ${model.actualizadoEn},
      ${model.ultimaApertura ?? null},
      ${model.autosalvado ?? null},
      ${model.archivado ?? null},
      ${model.archivadoEn ?? null},
      ${model.archivadoAuto ?? null},
      ${model.crearVersionAlGuardar ?? null},
      CASE
        WHEN ${versionsBase64}::text IS NULL THEN NULL
        ELSE convert_from(decode(${versionsBase64}, 'base64'), 'UTF8')::jsonb
      END,
      ${nextRevision},
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
      revision = EXCLUDED.revision,
      payload = EXCLUDED.payload
    WHERE opforja_models.revision = ${currentRevision ?? -1}
    RETURNING id
  `;
  if (savedRows.length === 0) throw new PersistenciaConflictError();

  if (model.autosalvado === true) {
    await upsertAutosaveInTransaction(db, session, {
      modeloId: model.id,
      creadoEn: autosaveTimestampAfter(model.actualizadoEn),
      json: model.json,
    });
  } else if (model.autosalvado === false) {
    await db`
      DELETE FROM opforja_model_autosaves
      WHERE tenant_id = ${session.tenantId} AND modelo_id = ${model.id}
    `;
  }

  return { ...model, revision: nextRevision };
}

async function persistFreshVersionInTransaction(
  db: typeof sql,
  session: PersistenciaSesion,
  version: BackendVersionPersistida,
): Promise<void> {
  if (!await insertVersionInTransaction(db, session, version)) {
    throw new PersistenciaConflictError("La versión ya existe");
  }
  await podarVersionesPostgres(db, session, version.modeloId, version.version.id);
}

async function insertVersionInTransaction(
  db: typeof sql,
  session: PersistenciaSesion,
  version: BackendVersionPersistida,
): Promise<boolean> {
  const payloadBase64 = base64Utf8(version.json);
  const rows = await db`
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
    ON CONFLICT (tenant_id, modelo_id, id) DO NOTHING
    RETURNING id
  `;
  return rows.length > 0;
}

async function upsertAutosaveInTransaction(
  db: typeof sql,
  session: PersistenciaSesion,
  autosave: BackendAutosalvadoPersistido,
): Promise<void> {
  const payloadBase64 = base64Utf8(autosave.json);
  await db`
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
}

async function lockWorkspaceInTransaction(
  db: typeof sql,
  session: PersistenciaSesion,
): Promise<WorkspacePersistido> {
  const now = new Date().toISOString();
  const emptyBase64 = base64Utf8(JSON.stringify(indiceVacio()));
  await db`
    INSERT INTO opforja_workspaces (
      tenant_id,
      owner_id,
      actualizado_en,
      indice,
      revision
    )
    VALUES (
      ${session.tenantId},
      ${session.userId},
      ${now},
      convert_from(decode(${emptyBase64}, 'base64'), 'UTF8')::jsonb,
      0
    )
    ON CONFLICT (tenant_id) DO NOTHING
  `;
  const rows = await db`
    SELECT indice, revision
    FROM opforja_workspaces
    WHERE tenant_id = ${session.tenantId}
    FOR UPDATE
  `;
  return {
    indice: normalizarWorkspace(rows[0]?.indice),
    revision: Number(rows[0]?.revision ?? 0),
  };
}

async function persistWorkspaceInTransaction(
  db: typeof sql,
  session: PersistenciaSesion,
  index: WorkspaceIndice,
  currentRevision: number,
): Promise<WorkspacePersistido> {
  const indexBase64 = base64Utf8(JSON.stringify(index));
  const revision = currentRevision + 1;
  await db`
    UPDATE opforja_workspaces
    SET
      owner_id = ${session.userId},
      actualizado_en = ${new Date().toISOString()},
      indice = convert_from(decode(${indexBase64}, 'base64'), 'UTF8')::jsonb,
      revision = ${revision}
    WHERE tenant_id = ${session.tenantId} AND revision = ${currentRevision}
  `;
  return { indice: index, revision };
}

async function asegurarSesion(session: PersistenciaSesion): Promise<void> {
  const ahora = new Date().toISOString();
  await sql.begin(async (tx) => {
    await tx`
      INSERT INTO opforja_tenants (id, creado_en)
      VALUES (${session.tenantId}, ${ahora})
      ON CONFLICT (id) DO NOTHING
    `;
    await tx`
      INSERT INTO opforja_users (id, tenant_id, creado_en)
      VALUES (${session.userId}, ${session.tenantId}, ${ahora})
      ON CONFLICT (id) DO NOTHING
    `;
  });
}

async function podarVersionesPostgres(
  db: typeof sql,
  session: PersistenciaSesion,
  modeloId: string,
  protectedVersionId?: string,
): Promise<void> {
  const rows = (await db`
    SELECT id, creado_en, nombre, descripcion, preservar, modelo_payload_key, bytes
    FROM opforja_model_versions
    WHERE tenant_id = ${session.tenantId} AND modelo_id = ${modeloId}
    ORDER BY creado_en DESC
  `) as Array<Record<string, unknown>>;
  const versiones = rows.map(versionDesdeRow).filter((version): version is VersionResumen => version !== null);
  const retenidas = aplicarPoliticaLogScaleVersiones(
    versiones,
    new Date(),
    MAX_VERSIONES_POR_MODELO,
    protectedVersionId,
  );
  const podadas = idsVersionesPodadas(versiones, retenidas);
  for (const versionId of podadas) {
    await db`
      DELETE FROM opforja_model_versions
      WHERE tenant_id = ${session.tenantId} AND modelo_id = ${modeloId} AND id = ${versionId}
    `;
  }
  if (podadas.length > 0) {
    logEvento("model_api_versions_pruned", {
      tenant: idLog(session.tenantId),
      modeloId: idLog(modeloId),
      count: podadas.length,
      retained: retenidas.length,
    });
  }
}

function logEvento(evento: string, data: Record<string, unknown> = {}): void {
  console.log(JSON.stringify({ ts: new Date().toISOString(), evento, ...data }));
}

function idLog(id: string): string {
  return id.length <= 12 ? id : `${id.slice(0, 12)}…`;
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
    ...(typeof row.revision === "number" ? { revision: row.revision } : {}),
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
