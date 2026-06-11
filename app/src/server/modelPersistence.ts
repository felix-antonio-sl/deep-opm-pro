import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { Buffer } from "node:buffer";
import { HASH_SENUELO, verifyPassword } from "./passwordHash";
import type { ModeloPersistido, ResumenModeloPersistido } from "../persistencia/modelos";
import type { WorkspaceIndice } from "../persistencia/workspace";
import { indiceVacio } from "../persistencia/workspace";
import { esPreferenciasUi, normalizarCarpetaIndice, normalizarModeloIndice } from "../persistencia/workspaceStorage";
import type { VersionResumen } from "../modelo/tipos";

export interface PersistenciaSesion {
  tenantId: string;
  userId: string;
  /** true ⇔ la cookie nació de un login (auth v1). Las anónimas no lo portan. */
  auth?: boolean;
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

export interface ModelPersistenceRepository {
  touchSession?(session: PersistenciaSesion): Promise<void>;
  list(session: PersistenciaSesion, includePayload?: boolean): Promise<Array<ModeloPersistido | ResumenModeloPersistido>>;
  get(session: PersistenciaSesion, id: string): Promise<ModeloPersistido | null>;
  save(session: PersistenciaSesion, modelo: ModeloPersistido): Promise<ModeloPersistido>;
  delete(session: PersistenciaSesion, id: string): Promise<boolean>;
  getWorkspace?(session: PersistenciaSesion): Promise<WorkspaceIndice | null>;
  saveWorkspace?(session: PersistenciaSesion, indice: WorkspaceIndice): Promise<WorkspaceIndice>;
  listVersions?(session: PersistenciaSesion, modeloId: string): Promise<VersionResumen[]>;
  getVersion?(session: PersistenciaSesion, modeloId: string, versionId: string): Promise<BackendVersionPersistida | null>;
  saveVersion?(session: PersistenciaSesion, version: BackendVersionPersistida): Promise<BackendVersionPersistida>;
  deleteVersion?(session: PersistenciaSesion, modeloId: string, versionId: string): Promise<boolean>;
  getAutosave?(session: PersistenciaSesion, modeloId: string): Promise<BackendAutosalvadoPersistido | null>;
  saveAutosave?(session: PersistenciaSesion, autosave: BackendAutosalvadoPersistido): Promise<BackendAutosalvadoPersistido>;
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
}

const ENDPOINT = "/__deep-opm/modelos";
const WORKSPACE_ENDPOINT = "/__deep-opm/workspace";
const SESSION_ENDPOINT = "/__deep-opm/session";
const DEFAULT_MAX_BODY_BYTES = 15 * 1024 * 1024;
const COOKIE_NAME = "opforja_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;
const AUTH_LOGIN_ENDPOINT = "/__deep-opm/auth/login";
const AUTH_LOGOUT_ENDPOINT = "/__deep-opm/auth/logout";
// Cookie autenticada más corta que la anónima (spec §2): 30 días, rotada por login.
const AUTH_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

interface TokenSesionFirmado {
  tenantId: string;
  userId: string;
  iat: number;
  exp: number;
  auth?: boolean;
  nonce?: string;
}

export function crearModelPersistenceFetchHandler(options: ModelPersistenceOptions) {
  const maxBodyBytes = options.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES;
  const sessionResolver = options.sessionResolver ?? resolverSesionAnonima();
  return async (request: Request): Promise<Response> => {
    const url = new URL(request.url);
    if (url.pathname === "/healthz") {
      const ok = options.repo.health ? await options.repo.health() : true;
      return responderJson(ok ? 200 : 503, { ok });
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

    const esRutaPersistencia = url.pathname === SESSION_ENDPOINT ||
      url.pathname === WORKSPACE_ENDPOINT ||
      url.pathname === ENDPOINT ||
      url.pathname.startsWith(`${ENDPOINT}/`);
    if (!esRutaPersistencia) {
      return responderJson(404, { error: "Not found" });
    }

    const session = await sessionResolver.resolve(request);
    if (options.auth?.requireAuth && session.auth !== true) {
      // 401 sin session ⇒ sin Set-Cookie: bajo login obligatorio no se acuñan
      // tenants anónimos (spec D3/§2). Las cookies anónimas viejas caen aquí.
      return responderJson(401, { error: "No autenticado" });
    }
    try {
      if (options.repo.touchSession) await options.repo.touchSession(session);

      if (request.method === "GET" && url.pathname === SESSION_ENDPOINT) {
        return responderJson(200, { session: { tenantId: session.tenantId, userId: session.userId, ...(session.auth === true ? { auth: true } : {}) } }, session);
      }

      if (request.method === "GET" && url.pathname === WORKSPACE_ENDPOINT) {
        const indice = options.repo.getWorkspace ? await options.repo.getWorkspace(session) : null;
        return responderJson(200, { indice: indice ?? indiceVacio() }, session);
      }

      if ((request.method === "POST" || request.method === "PUT") && url.pathname === WORKSPACE_ENDPOINT) {
        if (!options.repo.saveWorkspace) return responderJson(501, { error: "Workspace backend no disponible" }, session);
        const payload = await leerJsonRequest(request, maxBodyBytes);
        const indice = validarWorkspaceIndice(payload);
        const guardado = await options.repo.saveWorkspace(session, indice);
        return responderJson(200, { indice: guardado }, session);
      }

      if (request.method === "GET" && url.pathname === ENDPOINT) {
        const includePayload = url.searchParams.get("includePayload") === "1";
        const modelos = await options.repo.list(session, includePayload);
        return responderJson(200, { modelos }, session);
      }

      const partes = partesRutaModelo(url.pathname);
      const id = partes[0] ?? "";

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

export function crearCookieSessionResolver(secret: string, cookieName = COOKIE_NAME): PersistenciaSessionResolver {
  return {
    async resolve(request) {
      const token = leerCookie(request.headers.get("cookie") ?? "", cookieName);
      const payload = token ? verificarTokenSesion(token, secret) : null;
      if (payload) return payload;
      const tenantId = `tenant-${randomBytes(16).toString("hex")}`;
      const userId = `user-${randomBytes(16).toString("hex")}`;
      const ahora = ahoraEpochSeconds();
      const firmado = firmarTokenSesion({ tenantId, userId, iat: ahora, exp: ahora + SESSION_MAX_AGE_SECONDS }, secret);
      const secure = esRequestSeguro(request) ? "; Secure" : "";
      return {
        tenantId,
        userId,
        setCookie: `${cookieName}=${firmado}; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}; HttpOnly; SameSite=Lax${secure}`,
      };
    },
  };
}

function resolverSesionAnonima(): PersistenciaSessionResolver {
  return {
    async resolve() {
      return { tenantId: "tenant-test", userId: "user-test" };
    },
  };
}

async function leerJsonRequest(request: Request, maxBodyBytes: number): Promise<unknown> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > maxBodyBytes) {
    throw new Error("Payload demasiado grande");
  }
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maxBodyBytes) throw new Error("Payload demasiado grande");
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("JSON invalido");
  }
}

function partesRutaModelo(pathname: string): string[] {
  if (!pathname.startsWith(`${ENDPOINT}/`)) return [];
  return pathname
    .slice(`${ENDPOINT}/`.length)
    .split("/")
    .filter(Boolean)
    .map((parte) => decodeURIComponent(parte).trim());
}

function validarModeloPersistido(input: unknown): ModeloPersistido {
  if (!esRecord(input)) throw new Error("Modelo persistido invalido");
  const record = esRecord(input.modelo) ? input.modelo : input;
  if (!esRecord(record)) throw new Error("Modelo persistido invalido");
  if (typeof record.id !== "string" || !record.id.trim()) throw new Error("Modelo persistido invalido: id");
  if (typeof record.nombre !== "string" || !record.nombre.trim()) throw new Error("Modelo persistido invalido: nombre");
  if (typeof record.creadoEn !== "string") throw new Error("Modelo persistido invalido: creadoEn");
  if (typeof record.actualizadoEn !== "string") throw new Error("Modelo persistido invalido: actualizadoEn");
  if (typeof record.json !== "string" || !record.json.trim()) throw new Error("Modelo persistido invalido: json");
  try {
    JSON.parse(record.json);
  } catch {
    throw new Error("Modelo persistido invalido: json");
  }
  const base: ModeloPersistido = {
    id: record.id,
    nombre: record.nombre,
    descripcion: typeof record.descripcion === "string" ? record.descripcion : "",
    creadoEn: record.creadoEn,
    actualizadoEn: record.actualizadoEn,
    json: record.json,
  };
  if (record.carpetaId === null || typeof record.carpetaId === "string") base.carpetaId = record.carpetaId;
  if (typeof record.ultimaApertura === "string") base.ultimaApertura = record.ultimaApertura;
  if (typeof record.autosalvado === "boolean") base.autosalvado = record.autosalvado;
  if (typeof record.archivado === "boolean") base.archivado = record.archivado;
  if (typeof record.archivadoEn === "string") base.archivadoEn = record.archivadoEn;
  if (typeof record.archivadoAuto === "boolean") base.archivadoAuto = record.archivadoAuto;
  if (Array.isArray(record.versiones)) base.versiones = record.versiones.filter(esVersionResumen);
  if (typeof record.crearVersionAlGuardar === "boolean") base.crearVersionAlGuardar = record.crearVersionAlGuardar;
  if (typeof record.revision === "number" && Number.isInteger(record.revision) && record.revision >= 0) {
    base.revision = record.revision;
  }
  return base;
}

function validarWorkspaceIndice(input: unknown): WorkspaceIndice {
  if (!esRecord(input)) throw new Error("Workspace persistido invalido");
  const record = esRecord(input.indice) ? input.indice : input;
  if (!esRecord(record)) throw new Error("Workspace persistido invalido");
  return {
    modelos: Array.isArray(record.modelos)
      ? record.modelos.map(normalizarModeloIndice).filter((modelo): modelo is WorkspaceIndice["modelos"][number] => modelo !== null)
      : [],
    carpetas: Array.isArray(record.carpetas)
      ? record.carpetas.map(normalizarCarpetaIndice).filter((carpeta): carpeta is WorkspaceIndice["carpetas"][number] => carpeta !== null)
      : [],
    recientes: Array.isArray(record.recientes) ? record.recientes.filter((id): id is string => typeof id === "string") : [],
    ...(typeof record.busquedaGlobalUltima === "string" ? { busquedaGlobalUltima: record.busquedaGlobalUltima } : {}),
    ...(esPreferenciasUi(record.preferenciasUi) ? { preferenciasUi: record.preferenciasUi } : {}),
  };
}

function validarVersionPersistida(modeloId: string, input: unknown): BackendVersionPersistida {
  if (!esRecord(input)) throw new Error("Version persistida invalida");
  const version = esRecord(input.version) ? input.version : null;
  const json = typeof input.json === "string" ? input.json : typeof input.payload === "string" ? input.payload : "";
  if (!version || !esVersionResumen(version)) throw new Error("Version persistida invalida");
  validarJsonString(json, "Version persistida invalida: json");
  return {
    modeloId,
    version: {
      id: version.id,
      creadoEn: version.creadoEn,
      nombre: version.nombre,
      ...(typeof version.descripcion === "string" ? { descripcion: version.descripcion } : {}),
      ...(version.preservar === true ? { preservar: true } : {}),
      modeloPayloadKey: version.modeloPayloadKey,
      bytes: version.bytes,
    },
    json,
  };
}

function validarAutosalvadoPersistido(modeloId: string, input: unknown): BackendAutosalvadoPersistido {
  if (!esRecord(input)) throw new Error("Autosalvado persistido invalido");
  const json = typeof input.json === "string" ? input.json : "";
  validarJsonString(json, "Autosalvado persistido invalido: json");
  return {
    modeloId,
    creadoEn: typeof input.creadoEn === "string" ? input.creadoEn : new Date().toISOString(),
    json,
  };
}

function validarJsonString(json: string, error: string): void {
  if (!json.trim()) throw new Error(error);
  try {
    JSON.parse(json);
  } catch {
    throw new Error(error);
  }
}

function esVersionResumen(value: unknown): value is VersionResumen {
  if (!esRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.creadoEn !== "string" ||
    typeof value.nombre !== "string" ||
    typeof value.modeloPayloadKey !== "string" ||
    typeof value.bytes !== "number") {
    return false;
  }
  return true;
}

function responderJson(status: number, payload: unknown, session?: PersistenciaSesion): Response {
  const headers = new Headers({ "content-type": "application/json; charset=utf-8" });
  if (session?.setCookie) headers.set("set-cookie", session.setCookie);
  return new Response(JSON.stringify(payload), {
    status,
    headers,
  });
}

function esRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function esErrorPayload(message: string): boolean {
  return message.startsWith("Payload") ||
    message.startsWith("JSON") ||
    message.startsWith("Modelo persistido") ||
    message.startsWith("Workspace persistido") ||
    message.startsWith("Version persistida") ||
    message.startsWith("Autosalvado persistido");
}

function leerCookie(cookies: string, name: string): string | null {
  for (const part of cookies.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (rawName === name) return rawValue.join("=") || null;
  }
  return null;
}

function esRequestSeguro(request: Request): boolean {
  if (request.headers.get("x-forwarded-proto") === "https") return true;
  const host = request.headers.get("host") ?? "";
  if (host && !host.startsWith("localhost") && !host.startsWith("127.0.0.1")) return true;
  try {
    return new URL(request.url).protocol === "https:";
  } catch {
    return false;
  }
}

async function manejarLogin(request: Request, auth: AuthOptions, maxBodyBytes: number): Promise<Response> {
  let body: unknown;
  try {
    body = await leerJsonRequest(request, maxBodyBytes);
  } catch (error) {
    return responderJson(400, { error: error instanceof Error ? error.message : "JSON invalido" });
  }
  if (!esRecord(body) || typeof body.email !== "string" || typeof body.password !== "string") {
    return responderJson(400, { error: "Login invalido: email y password requeridos" });
  }
  const email = body.email.trim().toLowerCase();
  const cuenta = await auth.repo.getCuentaPorEmail(email);
  // Verificación SIEMPRE (señuelo si no hay cuenta): respuesta y costo uniformes,
  // sin oráculo de existencia de email (spec §3).
  const valida = verifyPassword(body.password, cuenta?.passwordHash ?? HASH_SENUELO);
  if (!cuenta || !valida) return responderJson(401, { error: "Credenciales inválidas" });

  const ahora = ahoraEpochSeconds();
  if (auth.repo.touchLogin) await auth.repo.touchLogin(cuenta.id, new Date(ahora * 1000).toISOString());
  const cookieName = auth.cookieName ?? COOKIE_NAME;
  const token = firmarTokenSesion({
    tenantId: cuenta.tenantId,
    userId: cuenta.userId,
    iat: ahora,
    exp: ahora + AUTH_SESSION_MAX_AGE_SECONDS,
    auth: true,
    // Rotación por login (spec §2): el nonce hace único cada token emitido.
    nonce: randomBytes(8).toString("hex"),
  }, auth.secret);
  const secure = esRequestSeguro(request) ? "; Secure" : "";
  const session: PersistenciaSesion = {
    tenantId: cuenta.tenantId,
    userId: cuenta.userId,
    auth: true,
    setCookie: `${cookieName}=${token}; Path=/; Max-Age=${AUTH_SESSION_MAX_AGE_SECONDS}; HttpOnly; SameSite=Lax${secure}`,
  };
  return responderJson(200, { session: { tenantId: session.tenantId, userId: session.userId, auth: true } }, session);
}

function firmarTokenSesion(payload: TokenSesionFirmado, secret: string): string {
  const encoded = base64UrlEncode(JSON.stringify(payload));
  return `${encoded}.${firma(encoded, secret)}`;
}

function verificarTokenSesion(token: string, secret: string): PersistenciaSesion | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const expected = firma(encoded, secret);
  if (!compararConstante(signature, expected)) return null;
  try {
    const parsed = JSON.parse(base64UrlDecode(encoded));
    if (!esRecord(parsed) || typeof parsed.tenantId !== "string" || typeof parsed.userId !== "string") return null;
    if (typeof parsed.exp !== "number" || !Number.isFinite(parsed.exp)) return null;
    if (typeof parsed.iat !== "number" || !Number.isFinite(parsed.iat)) return null;
    if (parsed.exp <= ahoraEpochSeconds()) return null;
    return {
      tenantId: parsed.tenantId,
      userId: parsed.userId,
      ...(parsed.auth === true ? { auth: true } : {}),
    };
  } catch {
    return null;
  }
}

function ahoraEpochSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

function firma(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function compararConstante(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}
