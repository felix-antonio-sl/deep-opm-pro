import type {
  AuthRepository,
  BackendAutosalvadoPersistido,
  BackendVersionPersistida,
  CuentaAuth,
  ModelPersistenceRepository,
  PersistenciaSesion,
} from "./modelPersistence";
import { evaluarPoliticaCommit, PersistenciaConflictError } from "./modelPersistence";
import { hashPassword } from "./passwordHash";
import type { ModeloPersistido, ResumenModeloPersistido } from "../persistencia/modelos";
import {
  indiceVacio,
  type WorkspacePersistido,
} from "../persistencia/workspace";
import { autosaveTimestampAfter, baseWitnessMatches } from "../mesa/baseWitness";
import {
  establecerEspecieCreada,
  registrarVersionEnWorkspace,
} from "../mesa/especieWorkspace";
import { especieDe } from "../persistencia/especie";
import { isTimestampAfter } from "../mesa/timestampOrder";

/**
 * Sesión por defecto del repositorio en memoria. Coincide con la que devuelve
 * `resolverSesionAnonima()` (el resolver por defecto de
 * `crearModelPersistenceFetchHandler`) para que el modelo sembrado quede bajo
 * el mismo tenant que las requests anónimas.
 */
export const SESION_MEMORIA_POR_DEFECTO: PersistenciaSesion = {
  tenantId: "tenant-test",
  userId: "user-test",
};

/**
 * Repositorio de persistencia en memoria: implementación completa del contrato
 * `ModelPersistenceRepository` sin Postgres. Consumidores:
 *  - tests (`modelPersistence.test.ts`), que ejercen el handler contra él, y
 *  - el middleware dev de vite (`devModelPersistence`), que da backend de
 *    modelos/workspace/sesión a `bun run dev` sin levantar Postgres — la
 *    persistencia es backend-only desde el corte C5 y el dev server no tiene
 *    Postgres, así que sin esto los flujos de guardar/cargar/workspace no
 *    existen en dev ni en el smoke.
 *
 * Deliberadamente efímero: no persiste entre reinicios del proceso.
 */
export function crearRepoMemoria(
  inicial: ModeloPersistido[] = [],
  sesionInicial: PersistenciaSesion = SESION_MEMORIA_POR_DEFECTO,
): ModelPersistenceRepository {
  const datos = new Map(inicial.map((modelo) => [clave(sesionInicial, modelo.id), modelo]));
  const workspaces = new Map<string, WorkspacePersistido>();
  const versiones = new Map<string, BackendVersionPersistida>();
  const autosaves = new Map<string, BackendAutosalvadoPersistido>();
  return {
    async list(session, includePayload = false) {
      const modelos = [...datos.entries()]
        .filter(([key]) => key.startsWith(`${session.tenantId}:`))
        .map(([, modelo]) => modelo)
        .sort((a, b) => b.actualizadoEn.localeCompare(a.actualizadoEn));
      return includePayload ? modelos : modelos.map(({ json: _json, ...resumen }) => resumen satisfies ResumenModeloPersistido);
    },
    async get(session, id) {
      return datos.get(clave(session, id)) ?? null;
    },
    async save(session, modelo) {
      const modelKey = clave(session, modelo.id);
      const current = datos.get(modelKey);
      const currentRevision = current?.revision ?? 0;
      if (current && modelo.revision !== currentRevision) {
        throw new PersistenciaConflictError();
      }
      if (!current && modelo.revision !== undefined) {
        throw new PersistenciaConflictError("El modelo ya no existe");
      }
      const saved = { ...modelo, revision: current ? currentRevision + 1 : 1 };
      datos.set(modelKey, saved);
      if (saved.autosalvado === true) {
        autosaves.set(modelKey, {
          modeloId: saved.id,
          creadoEn: autosaveTimestampAfter(saved.actualizadoEn),
          json: saved.json,
        });
      } else if (saved.autosalvado === false) {
        autosaves.delete(modelKey);
      }
      return saved;
    },
    async delete(session, id) {
      const modelKey = clave(session, id);
      const deleted = datos.delete(modelKey);
      autosaves.delete(modelKey);
      for (const key of versiones.keys()) {
        if (key.startsWith(`${session.tenantId}:${id}:`)) versiones.delete(key);
      }
      return deleted;
    },
    async getWorkspace(session) {
      return workspaces.get(session.tenantId) ?? null;
    },
    async saveWorkspace(session, write) {
      const current = workspaces.get(session.tenantId);
      const currentRevision = current?.revision ?? 0;
      if (write.revisionBase !== currentRevision) {
        throw new PersistenciaConflictError("Workspace desactualizado; recarga antes de guardar");
      }
      const saved = {
        indice: write.indice,
        revision: currentRevision + 1,
      };
      workspaces.set(session.tenantId, saved);
      return saved;
    },
    async listVersions(session, modeloId) {
      return [...versiones.entries()]
        .filter(([key]) => key.startsWith(`${session.tenantId}:${modeloId}:`))
        .map(([, item]) => item.version);
    },
    async getVersion(session, modeloId, versionId) {
      return versiones.get(claveVersion(session, modeloId, versionId)) ?? null;
    },
    async saveVersion(session, version) {
      const versionKey = claveVersion(session, version.modeloId, version.version.id);
      if (versiones.has(versionKey)) {
        throw new PersistenciaConflictError("La versión ya existe");
      }
      versiones.set(versionKey, version);
      return version;
    },
    async deleteVersion(session, modeloId, versionId) {
      return versiones.delete(claveVersion(session, modeloId, versionId));
    },
    async commitRevision(session, commit) {
      const modelKey = clave(session, commit.model.id);
      const current = datos.get(modelKey) ?? null;
      const workspace = workspaces.get(session.tenantId) ?? {
        indice: indiceVacio(),
        revision: 0,
      };
      if (current && workspace.indice.modelos.some((item) =>
        item.id === current.id && item.esBiblioteca === true
      )) {
        throw new PersistenciaConflictError("Destino biblioteca es solo-lectura");
      }
      if (commit.base.kind === "new") {
        if (current) throw new PersistenciaConflictError("El modelo ya existe; ejecuta pull antes de actualizar");
        if (!commit.speciesOnCreate) throw new PersistenciaConflictError("La creación exige especie");
        const veredicto = evaluarPoliticaCommit(commit);
        if (!veredicto.ok) throw new PersistenciaConflictError(veredicto.motivo);
      } else {
        const currentRevision = current?.revision ?? 0;
        const autosave = autosaves.get(modelKey) ?? null;
        if (!current ||
          commit.base.witness.modelId !== commit.model.id ||
          commit.model.revision !== currentRevision ||
          !baseWitnessMatches(commit.base.witness, {
            modelId: current.id,
            saved: {
              revision: currentRevision,
              updatedAt: current.actualizadoEn,
              json: current.json,
            },
            autosave: autosave
              ? { createdAt: autosave.creadoEn, json: autosave.json }
              : null,
          })) {
          throw new PersistenciaConflictError();
        }
        const entry = workspace.indice.modelos.find((item) => item.id === current.id);
        const veredicto = evaluarPoliticaCommit(commit, {
          savedJson: current.json,
          autosaveJson: autosave?.json ?? null,
          species: entry ? especieDe(entry) : "modelo",
        });
        if (!veredicto.ok) throw new PersistenciaConflictError(veredicto.motivo);
      }

      const versionKey = claveVersion(session, commit.model.id, commit.version.id);
      if (versiones.has(versionKey)) {
        throw new PersistenciaConflictError("La versión ya existe");
      }
      const saved: ModeloPersistido = {
        ...commit.model,
        autosalvado: false,
        revision: current ? (current.revision ?? 0) + 1 : 1,
      };
      datos.set(modelKey, saved);
      autosaves.delete(modelKey);
      versiones.set(versionKey, {
        modeloId: saved.id,
        version: commit.version,
        json: saved.json,
      });
      const indiceConEspecie = !current && commit.speciesOnCreate
        ? establecerEspecieCreada(
            workspace.indice,
            saved.id,
            commit.speciesOnCreate,
          )
        : workspace.indice;
      const workspaceGuardado = {
        indice: registrarVersionEnWorkspace(
          indiceConEspecie,
          saved.id,
          commit.version,
        ),
        revision: workspace.revision + 1,
      };
      workspaces.set(session.tenantId, workspaceGuardado);
      return {
        model: saved,
        version: commit.version,
        workspace: workspaceGuardado,
      };
    },
    async getAutosave(session, modeloId) {
      return autosaves.get(clave(session, modeloId)) ?? null;
    },
    async saveAutosave(session, autosave) {
      const modelKey = clave(session, autosave.modeloId);
      const current = datos.get(modelKey);
      if (!current || current.revision !== autosave.revisionBase) {
        throw new PersistenciaConflictError();
      }
      const { revisionBase: _revisionBase, ...input } = autosave;
      const existingAutosave = autosaves.get(modelKey);
      if (existingAutosave &&
        !isTimestampAfter(input.creadoEn, existingAutosave.creadoEn)) {
        throw new PersistenciaConflictError("El autosalvado es anterior al ya persistido");
      }
      const persisted = {
        ...input,
        creadoEn: isTimestampAfter(input.creadoEn, current.actualizadoEn)
          ? input.creadoEn
          : autosaveTimestampAfter(current.actualizadoEn),
      };
      autosaves.set(clave(session, autosave.modeloId), persisted);
      datos.set(modelKey, { ...current, autosalvado: true });
      return persisted;
    },
    async health() {
      return true;
    },
  };
}

export interface CuentaSeedMemoria {
  email: string;
  password: string;
  tenantId: string;
  userId: string;
}

/**
 * Auth repo en memoria (auth v1): para los tests del handler y para el dev
 * server con MODEL_REQUIRE_AUTH=true (lane e2e auth). Espejo del contrato
 * Postgres de model-persistence-api.
 */
export function crearAuthRepoMemoria(seeds: CuentaSeedMemoria[]): AuthRepository {
  const cuentas: CuentaAuth[] = seeds.map((seed, indice) => ({
    id: `acc-${indice}`,
    email: seed.email.trim().toLowerCase(),
    passwordHash: hashPassword(seed.password),
    userId: seed.userId,
    tenantId: seed.tenantId,
  }));
  return {
    async getCuentaPorEmail(email) {
      return cuentas.find((cuenta) => cuenta.email === email) ?? null;
    },
  };
}

export function clave(session: PersistenciaSesion, id: string): string {
  return `${session.tenantId}:${id}`;
}

export function claveVersion(session: PersistenciaSesion, modeloId: string, versionId: string): string {
  return `${session.tenantId}:${modeloId}:${versionId}`;
}
