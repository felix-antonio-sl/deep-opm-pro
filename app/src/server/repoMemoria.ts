import type {
  AuthRepository,
  BackendAutosalvadoPersistido,
  BackendVersionPersistida,
  CuentaAuth,
  ModelPersistenceRepository,
  PersistenciaSesion,
} from "./modelPersistence";
import { hashPassword } from "./passwordHash";
import type { ModeloPersistido, ResumenModeloPersistido } from "../persistencia/modelos";
import { indiceVacio, type WorkspaceIndice } from "../persistencia/workspace";

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
  const workspaces = new Map<string, WorkspaceIndice>();
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
      datos.set(clave(session, modelo.id), modelo);
      return modelo;
    },
    async delete(session, id) {
      return datos.delete(clave(session, id));
    },
    async getWorkspace(session) {
      return workspaces.get(session.tenantId) ?? indiceVacio();
    },
    async saveWorkspace(session, indice) {
      workspaces.set(session.tenantId, indice);
      return indice;
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
      versiones.set(claveVersion(session, version.modeloId, version.version.id), version);
      return version;
    },
    async deleteVersion(session, modeloId, versionId) {
      return versiones.delete(claveVersion(session, modeloId, versionId));
    },
    async getAutosave(session, modeloId) {
      return autosaves.get(clave(session, modeloId)) ?? null;
    },
    async saveAutosave(session, autosave) {
      autosaves.set(clave(session, autosave.modeloId), autosave);
      return autosave;
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
