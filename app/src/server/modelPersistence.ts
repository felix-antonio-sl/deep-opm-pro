import type { ModeloPersistido, ResumenModeloPersistido } from "../persistencia/modelos";
import type { Especie } from "../persistencia/especie";
import type { WorkspacePersistido, WorkspaceWrite } from "../persistencia/workspace";
import { indiceVacio } from "../persistencia/workspace";
import { encodeSessionIdentity, SESSION_IDENTITY_HEADER } from "../persistencia/sessionIdentity";
import type { VersionResumen } from "../modelo/tipos";
import { type MesaBaseWitnessV1 } from "../mesa/baseWitness";
import { bundleTieneSello, evaluarPush, type VeredictoPush } from "../mesa/validarPush";
import { esSinDelta } from "../mesa/esSinDelta";
import { leerJsonRequest, responderJson } from "./persistenceHttp";
import { COOKIE_NAME, resolverSesionAnonima, manejarLogin } from "./persistenceSession";
import { validarModeloPersistido, validateWorkspaceWrite, validarVersionPersistida, validateModelRevisionCommit, validarAutosalvadoPersistido } from "./validatePersistence";
import type { AgentRepository } from "./agent/repository";
export { crearCookieSessionResolver } from "./persistenceSession";

export interface PersistenciaSesion {
  tenantId: string;
  userId: string;
  /** Identidad autenticada por cookie de login o Bearer; las anónimas no lo portan. */
  auth?: boolean;
  /** Distingue el navegador del carril Bearer para aplicar mínimo privilegio. */
  authKind?: "operator" | "agent";
  setCookie?: string;
}

export interface CuentaAuth {
  id: string;
  email: string;
  passwordHash: string;
  userId: string;
  tenantId: string;
}

export interface AuthRepository {
  /** email ya normalizado (lowercase+trim). null si no existe. */
  getCuentaPorEmail(email: string): Promise<CuentaAuth | null>;
  touchLogin?(accountId: string, fecha: string): Promise<void>;
}

export interface AuthOptions {
  repo: AuthRepository;
  /** Mismo MODEL_SESSION_SECRET con el que se firman las cookies. */
  secret: string;
  cookieName?: string;
  /** true ⇒ 401 en toda ruta de persistencia sin sesión autenticada (spec D3). */
  requireAuth?: boolean;
}

export interface PersistenciaSessionResolver {
  resolve(request: Request): Promise<PersistenciaSesion>;
}

export interface BackendVersionPersistida {
  modeloId: string;
  version: VersionResumen;
  json: string;
}

export interface BackendAutosalvadoPersistido {
  modeloId: string;
  creadoEn: string;
  json: string;
}

export interface BackendAutosaveWrite extends BackendAutosalvadoPersistido {
  revisionBase: number;
}

export type ModelRevisionBase =
  | { kind: "new" }
  | { kind: "existing"; witness: MesaBaseWitnessV1 };

export interface ModelRevisionCommit {
  model: ModeloPersistido;
  version: VersionResumen;
  base: ModelRevisionBase;
  speciesOnCreate?: Exclude<Especie, "biblioteca">;
  graduation?: {
    kind: "graduate";
    folderId: string | null;
    role: "work" | "library";
  };
  reopening?: {
    kind: "reopen";
  };
  confirmedByOperator?: boolean;
}

export interface CommittedModelRevision {
  model: ModeloPersistido;
  version: VersionResumen;
  workspace: WorkspacePersistido;
}

export function evaluarPoliticaCommit(
  commit: ModelRevisionCommit,
  destination?: {
    savedJson: string;
    autosaveJson: string | null;
    species: Especie;
  },
): VeredictoPush {
  const veredicto = evaluarPush({
    bundleJson: commit.model.json,
    ...(destination
      ? {
          destino: {
            tieneSello: bundleTieneSello(destination.savedJson) ||
              Boolean(destination.autosaveJson && bundleTieneSello(destination.autosaveJson)),
            especie: destination.species,
          },
        }
      : {}),
    baseFueAutosave: commit.base.kind === "existing" &&
      commit.base.witness.source === "autosave",
    confirmadoPorOperador: commit.confirmedByOperator === true,
    ...(!destination && commit.speciesOnCreate
      ? { especieAlCrear: commit.speciesOnCreate }
      : {}),
  });
  if (!veredicto.ok || !destination || commit.base.kind !== "existing") {
    return veredicto;
  }
  const selectedJson = commit.base.witness.source === "autosave"
    ? destination.autosaveJson
    : destination.savedJson;
  if (!commit.graduation && !commit.reopening && selectedJson !== null && esSinDelta(commit.model.json, selectedJson)) {
    return { ok: false, motivo: "sin cambios: no se crea revisión" };
  }
  return veredicto;
}

export interface ModelPersistenceRepository {
  /** Present only when this persistence adapter shares its model transaction with agent state. */
  agentRepository?: AgentRepository;
  touchSession?(session: PersistenciaSesion): Promise<void>;
  list(session: PersistenciaSesion, includePayload?: boolean): Promise<Array<ModeloPersistido | ResumenModeloPersistido>>;
  get(session: PersistenciaSesion, id: string): Promise<ModeloPersistido | null>;
  save(session: PersistenciaSesion, modelo: ModeloPersistido): Promise<ModeloPersistido>;
  delete(session: PersistenciaSesion, id: string): Promise<boolean>;
  getWorkspace?(session: PersistenciaSesion): Promise<WorkspacePersistido | null>;
  saveWorkspace?(session: PersistenciaSesion, write: WorkspaceWrite): Promise<WorkspacePersistido>;
  listVersions?(session: PersistenciaSesion, modeloId: string): Promise<VersionResumen[]>;
  getVersion?(session: PersistenciaSesion, modeloId: string, versionId: string): Promise<BackendVersionPersistida | null>;
  saveVersion?(session: PersistenciaSesion, version: BackendVersionPersistida): Promise<BackendVersionPersistida>;
  deleteVersion?(session: PersistenciaSesion, modeloId: string, versionId: string): Promise<boolean>;
  commitRevision?(session: PersistenciaSesion, commit: ModelRevisionCommit): Promise<CommittedModelRevision>;
  getAutosave?(session: PersistenciaSesion, modeloId: string): Promise<BackendAutosalvadoPersistido | null>;
  saveAutosave?(session: PersistenciaSesion, autosave: BackendAutosaveWrite): Promise<BackendAutosalvadoPersistido>;
  health?(): Promise<boolean>;
}

export class PersistenciaConflictError extends Error {
  constructor(message = "Modelo desactualizado; recarga antes de guardar") {
    super(message);
    this.name = "PersistenciaConflictError";
  }
}

export interface ModelPersistenceOptions {
  repo: ModelPersistenceRepository;
  sessionResolver?: PersistenciaSessionResolver;
  maxBodyBytes?: number;
  /** Auth v1: presente ⇒ endpoints login/logout activos; requireAuth gobierna el gate. */
  auth?: AuthOptions;
  /** Agent HTTP surface after the same session, tenant, and identity gates. */
  agentHandler?: (request: Request, session: PersistenciaSesion) => Promise<Response>;
  /** Public capability links resolve a fixed snapshot without creating an editor session. */
  reviewPublicHandler?: (request: Request) => Promise<Response>;
  reviewOperatorHandler?: (request: Request, session: PersistenciaSesion) => Promise<Response>;
}

const ENDPOINT = "/__deep-opm/modelos";

const WORKSPACE_ENDPOINT = "/__deep-opm/workspace";

const SESSION_ENDPOINT = "/__deep-opm/session";

const AGENT_ENDPOINT = "/__deep-opm/agent";
const REVIEW_ENDPOINT = "/__deep-opm/review";
const REVIEW_OPERATOR_ENDPOINT = `${REVIEW_ENDPOINT}/grants`;

const DEFAULT_MAX_BODY_BYTES = 15 * 1024 * 1024;

const AUTH_LOGIN_ENDPOINT = "/__deep-opm/auth/login";

const AUTH_LOGOUT_ENDPOINT = "/__deep-opm/auth/logout";

export function crearModelPersistenceFetchHandler(options: ModelPersistenceOptions) {
  const maxBodyBytes = options.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES;
  const sessionResolver = options.sessionResolver ?? resolverSesionAnonima();
  return async (request: Request): Promise<Response> => {
    const url = new URL(request.url);
    if (url.pathname === "/healthz") {
      const ok = options.repo.health ? await options.repo.health() : true;
      return responderJson(ok ? 200 : 503, { ok });
    }

    const reviewOperator = url.pathname === REVIEW_OPERATOR_ENDPOINT ||
      url.pathname.startsWith(`${REVIEW_OPERATOR_ENDPOINT}/`);
    if (!reviewOperator && url.pathname.startsWith(`${REVIEW_ENDPOINT}/`)) {
      return options.reviewPublicHandler
        ? options.reviewPublicHandler(request)
        : responderJson(404, { error: "Revisión no disponible" });
    }

    if (options.auth && request.method === "POST" && url.pathname === AUTH_LOGIN_ENDPOINT) {
      return manejarLogin(request, options.auth, maxBodyBytes);
    }
    if (options.auth && request.method === "POST" && url.pathname === AUTH_LOGOUT_ENDPOINT) {
      const cookieName = options.auth.cookieName ?? COOKIE_NAME;
      return responderJson(200, { ok: true }, {
        tenantId: "",
        userId: "",
        setCookie: `${cookieName}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`,
      });
    }

    const esRutaPersistencia = reviewOperator || url.pathname === SESSION_ENDPOINT ||
      url.pathname === WORKSPACE_ENDPOINT ||
      url.pathname === ENDPOINT ||
      url.pathname.startsWith(`${ENDPOINT}/`) ||
      url.pathname === AGENT_ENDPOINT ||
      url.pathname.startsWith(`${AGENT_ENDPOINT}/`);
    if (!esRutaPersistencia) {
      return responderJson(404, { error: "Not found" });
    }

    const session = await sessionResolver.resolve(request);
    if (options.auth?.requireAuth && session.auth !== true) {
      // 401 sin session ⇒ sin Set-Cookie: bajo login obligatorio no se acuñan
      // tenants anónimos (spec D3/§2). Las cookies anónimas viejas caen aquí.
      return responderJson(401, { error: "No autenticado" });
    }
    if (session.authKind === "agent" &&
      (reviewOperator || url.pathname === AGENT_ENDPOINT || url.pathname.startsWith(`${AGENT_ENDPOINT}/`) ||
        !rutaPermitidaParaAgente(request, url))) {
      return responderJson(403, {
        error: "El token de agente solo permite lectura y commit atómico de revisiones",
      }, session);
    }
    if (session.authKind === "operator" &&
      url.pathname !== SESSION_ENDPOINT &&
      request.headers.get(SESSION_IDENTITY_HEADER) !== encodeSessionIdentity(session)) {
      return responderJson(401, {
        error: "La identidad de sesión cambió; vuelva a iniciar sesión",
      });
    }
    try {
      if (options.repo.touchSession) await options.repo.touchSession(session);

      if (reviewOperator) {
        if (session.auth !== true) return responderJson(401, { error: "No autenticado" });
        if (!options.reviewOperatorHandler) return responderJson(501, { error: "Revisiones no disponibles" }, session);
        return await options.reviewOperatorHandler(request, session);
      }

      if (url.pathname === AGENT_ENDPOINT || url.pathname.startsWith(`${AGENT_ENDPOINT}/`)) {
        if (session.auth !== true) return responderJson(401, { error: "No autenticado" });
        if (!options.agentHandler) return responderJson(501, { error: "Runtime de agente no disponible" }, session);
        return await options.agentHandler(request, session);
      }

      if (request.method === "GET" && url.pathname === SESSION_ENDPOINT) {
        return responderJson(200, { session: { tenantId: session.tenantId, userId: session.userId, ...(session.auth === true ? { auth: true } : {}) } }, session);
      }

      if (request.method === "GET" && url.pathname === WORKSPACE_ENDPOINT) {
        const workspace = options.repo.getWorkspace ? await options.repo.getWorkspace(session) : null;
        return responderJson(200, workspace ?? { indice: indiceVacio(), revision: 0 }, session);
      }

      if ((request.method === "POST" || request.method === "PUT") && url.pathname === WORKSPACE_ENDPOINT) {
        if (!options.repo.saveWorkspace) return responderJson(501, { error: "Workspace backend no disponible" }, session);
        const payload = await leerJsonRequest(request, maxBodyBytes);
        const write = validateWorkspaceWrite(payload);
        const guardado = await options.repo.saveWorkspace(session, write);
        return responderJson(200, guardado, session);
      }

      if (request.method === "GET" && url.pathname === ENDPOINT) {
        const includePayload = url.searchParams.get("includePayload") === "1";
        const modelos = await options.repo.list(session, includePayload);
        return responderJson(200, { modelos }, session);
      }

      const partes = partesRutaModelo(url.pathname);
      const id = partes[0] ?? "";

      if (id && partes[1] === "revisiones" && partes.length === 2 && request.method === "POST") {
        if (!options.repo.commitRevision) {
          return responderJson(501, { error: "Commit de revisión no disponible" }, session);
        }
        const payload = await leerJsonRequest(request, maxBodyBytes);
        const commit = validateModelRevisionCommit(id, payload);
        const committed = await options.repo.commitRevision(session, commit);
        return responderJson(200, committed, session);
      }

      if (id && partes[1] === "versiones") {
        const versionId = partes[2] ?? "";
        if (request.method === "GET" && !versionId) {
          const versiones = options.repo.listVersions ? await options.repo.listVersions(session, id) : [];
          return responderJson(200, { versiones }, session);
        }
        if (request.method === "GET" && versionId) {
          const version = options.repo.getVersion ? await options.repo.getVersion(session, id, versionId) : null;
          return version ? responderJson(200, version, session) : responderJson(404, { error: "Version no encontrada" }, session);
        }
        if ((request.method === "POST" || request.method === "PUT") && !versionId) {
          if (!options.repo.saveVersion) return responderJson(501, { error: "Versiones backend no disponibles" }, session);
          const payload = await leerJsonRequest(request, maxBodyBytes);
          const version = validarVersionPersistida(id, payload);
          const guardada = await options.repo.saveVersion(session, version);
          return responderJson(200, guardada, session);
        }
        if (request.method === "DELETE" && versionId) {
          const deleted = options.repo.deleteVersion ? await options.repo.deleteVersion(session, id, versionId) : false;
          return responderJson(deleted ? 200 : 404, deleted ? { ok: true } : { error: "Version no encontrada" }, session);
        }
      }

      if (id && partes[1] === "autosave") {
        if (request.method === "GET") {
          const autosave = options.repo.getAutosave ? await options.repo.getAutosave(session, id) : null;
          return autosave ? responderJson(200, autosave, session) : responderJson(404, { error: "Autosalvado no encontrado" }, session);
        }
        if (request.method === "POST" || request.method === "PUT") {
          if (!options.repo.saveAutosave) return responderJson(501, { error: "Autosalvado backend no disponible" }, session);
          const payload = await leerJsonRequest(request, maxBodyBytes);
          const autosave = validarAutosalvadoPersistido(id, payload);
          const guardado = await options.repo.saveAutosave(session, autosave);
          return responderJson(200, guardado, session);
        }
      }

      if (request.method === "GET" && id && partes.length === 1) {
        const modelo = await options.repo.get(session, id);
        return modelo ? responderJson(200, { modelo }, session) : responderJson(404, { error: "Modelo no encontrado" }, session);
      }

      if ((request.method === "POST" || request.method === "PUT") && url.pathname === ENDPOINT) {
        const payload = await leerJsonRequest(request, maxBodyBytes);
        const modelo = validarModeloPersistido(payload);
        const guardado = await options.repo.save(session, modelo);
        return responderJson(200, { modelo: guardado }, session);
      }

      if (request.method === "DELETE" && id && partes.length === 1) {
        const deleted = await options.repo.delete(session, id);
        return responderJson(deleted ? 200 : 404, deleted ? { ok: true } : { error: "Modelo no encontrado" }, session);
      }

      return responderJson(405, { error: "Metodo no permitido" }, session);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo procesar la persistencia";
      if (error instanceof PersistenciaConflictError) return responderJson(409, { error: message }, session);
      return responderJson(esErrorPayload(message) ? 400 : 500, { error: message }, session);
    }
  };
}

function partesRutaModelo(pathname: string): string[] {
  if (!pathname.startsWith(`${ENDPOINT}/`)) return [];
  return pathname
    .slice(`${ENDPOINT}/`.length)
    .split("/")
    .filter(Boolean)
    .map((parte) => decodeURIComponent(parte).trim());
}

function rutaPermitidaParaAgente(request: Request, url: URL): boolean {
  if (request.method === "GET") return true;
  if (request.method !== "POST") return false;
  const partes = partesRutaModelo(url.pathname);
  return Boolean(partes[0] && partes.length === 2 && partes[1] === "revisiones");
}

function esErrorPayload(message: string): boolean {
  return message.startsWith("Payload") ||
    message.startsWith("JSON") ||
    message.startsWith("Modelo persistido") ||
    message.startsWith("Revision de modelo") ||
    message.startsWith("Workspace persistido") ||
    message.startsWith("Version persistida") ||
    message.startsWith("Autosalvado persistido");
}
