import type { Resultado } from "../modelo/tipos";
import type { VersionResumen } from "../modelo/tipos";
import {
  type ModeloPersistido,
  type ResumenModeloPersistido,
} from "./modelos";
import type { WorkspaceIndice } from "./workspace";
import { indiceVacio } from "./workspace";
import { esPreferenciasUi, normalizarCarpetaIndice, normalizarModeloIndice } from "./workspaceStorage";

const ENDPOINT = "/__deep-opm/modelos";
const WORKSPACE_ENDPOINT = "/__deep-opm/workspace";
const SESSION_ENDPOINT = "/__deep-opm/session";

export interface SesionBackend {
  tenantId: string;
  userId: string;
}

export interface VersionBackend {
  modeloId: string;
  version: VersionResumen;
  json: string;
}

export interface AutosalvadoBackend {
  modeloId: string;
  creadoEn: string;
  json: string;
}

export function persistenciaBackendHabilitada(): boolean {
  return typeof window !== "undefined" && typeof fetch === "function";
}

export async function obtenerSesionBackend(): Promise<Resultado<SesionBackend>> {
  if (!persistenciaBackendHabilitada()) return fallo("Persistencia backend no disponible");
  try {
    const response = await fetch(SESSION_ENDPOINT, { method: "GET" });
    const body = await leerJson(response);
    if (!response.ok) return fallo(errorDesdeBody(body) ?? "No se pudo iniciar sesión de workspace");
    const session = sesionDesdeBody(body);
    if (!session) return fallo("Respuesta de sesión inválida");
    return ok(session);
  } catch {
    return fallo("No se pudo conectar al backend de modelos");
  }
}

const AUTH_LOGIN_ENDPOINT = "/__deep-opm/auth/login";
const AUTH_LOGOUT_ENDPOINT = "/__deep-opm/auth/logout";

export type EstadoSesionBackend =
  | { estado: "autenticada"; session: SesionBackend }
  | { estado: "requiere-login" }
  | { estado: "error"; error: string };

/** Bootstrap auth-aware (spec §4): distingue 401 (login obligatorio) de caída del backend. */
export async function obtenerEstadoSesionBackend(): Promise<EstadoSesionBackend> {
  if (!persistenciaBackendHabilitada()) return { estado: "error", error: "Persistencia backend no disponible" };
  try {
    const response = await fetch(SESSION_ENDPOINT, { method: "GET" });
    if (response.status === 401) return { estado: "requiere-login" };
    const body = await leerJson(response);
    if (!response.ok) return { estado: "error", error: errorDesdeBody(body) ?? "No se pudo iniciar sesión de workspace" };
    const session = sesionDesdeBody(body);
    if (!session) return { estado: "error", error: "Respuesta de sesión inválida" };
    return { estado: "autenticada", session };
  } catch {
    return { estado: "error", error: "No se pudo conectar al backend de modelos" };
  }
}

export async function iniciarSesionBackend(email: string, password: string): Promise<Resultado<SesionBackend>> {
  if (!persistenciaBackendHabilitada()) return fallo("Persistencia backend no disponible");
  try {
    const response = await fetch(AUTH_LOGIN_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const body = await leerJson(response);
    if (!response.ok) return fallo(errorDesdeBody(body) ?? "No se pudo iniciar sesión");
    const session = sesionDesdeBody(body);
    if (!session) return fallo("Respuesta de sesión inválida");
    return ok(session);
  } catch {
    return fallo("No se pudo conectar al backend de modelos");
  }
}

export async function cerrarSesionBackend(): Promise<Resultado<void>> {
  if (!persistenciaBackendHabilitada()) return fallo("Persistencia backend no disponible");
  try {
    const response = await fetch(AUTH_LOGOUT_ENDPOINT, { method: "POST" });
    if (!response.ok) return fallo("No se pudo cerrar la sesión");
    return ok(undefined);
  } catch {
    return fallo("No se pudo conectar al backend de modelos");
  }
}

export async function listarModelosBackend(): Promise<Resultado<ResumenModeloPersistido[]>> {
  if (!persistenciaBackendHabilitada()) return fallo("Persistencia backend no disponible");
  try {
    const response = await fetch(`${ENDPOINT}?includePayload=1`, { method: "GET" });
    const body = await leerJson(response);
    if (!response.ok) return fallo(errorDesdeBody(body) ?? "No se pudo listar modelos del servidor");
    const modelos = modelosDesdeBody(body);
    if (!modelos) return fallo("Respuesta de modelos inválida");
    return ok(modelos.map(resumenDesdeModelo));
  } catch {
    return fallo("No se pudo conectar al backend de modelos");
  }
}

export async function guardarModeloBackend(modelo: ModeloPersistido): Promise<Resultado<ModeloPersistido>> {
  if (!persistenciaBackendHabilitada()) return fallo("Persistencia backend no disponible");
  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ modelo }),
    });
    const body = await leerJson(response);
    if (!response.ok) return fallo(errorDesdeBody(body) ?? "No se pudo guardar en servidor");
    const guardado = modeloDesdeBody(body);
    if (!guardado) return fallo("Respuesta de guardado inválida");
    return ok(guardado);
  } catch {
    return fallo("No se pudo conectar al backend de modelos");
  }
}

export async function cargarModeloBackend(id: string): Promise<Resultado<ModeloPersistido>> {
  if (!persistenciaBackendHabilitada()) return fallo("Persistencia backend no disponible");
  try {
    const response = await fetch(`${ENDPOINT}/${encodeURIComponent(id)}`, { method: "GET" });
    const body = await leerJson(response);
    if (!response.ok) return fallo(errorDesdeBody(body) ?? "Modelo no encontrado en servidor");
    const modelo = modeloDesdeBody(body);
    if (!modelo) return fallo("Respuesta de modelo inválida");
    return ok(modelo);
  } catch {
    return fallo("No se pudo conectar al backend de modelos");
  }
}

export async function borrarModeloBackend(id: string): Promise<Resultado<void>> {
  if (!persistenciaBackendHabilitada()) return fallo("Persistencia backend no disponible");
  try {
    const response = await fetch(`${ENDPOINT}/${encodeURIComponent(id)}`, { method: "DELETE" });
    const body = await leerJson(response);
    if (!response.ok) return fallo(errorDesdeBody(body) ?? "No se pudo borrar en servidor");
    return ok(undefined);
  } catch {
    return fallo("No se pudo conectar al backend de modelos");
  }
}

export async function cargarWorkspaceBackend(): Promise<Resultado<WorkspaceIndice>> {
  if (!persistenciaBackendHabilitada()) return fallo("Persistencia backend no disponible");
  try {
    const response = await fetch(WORKSPACE_ENDPOINT, { method: "GET" });
    const body = await leerJson(response);
    if (!response.ok) return fallo(errorDesdeBody(body) ?? "No se pudo cargar workspace del servidor");
    const indice = workspaceDesdeBody(body);
    if (!indice) return fallo("Respuesta de workspace inválida");
    return ok(indice);
  } catch {
    return fallo("No se pudo conectar al backend de modelos");
  }
}

export async function guardarWorkspaceBackend(indice: WorkspaceIndice): Promise<Resultado<WorkspaceIndice>> {
  if (!persistenciaBackendHabilitada()) return fallo("Persistencia backend no disponible");
  try {
    const response = await fetch(WORKSPACE_ENDPOINT, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ indice }),
    });
    const body = await leerJson(response);
    if (!response.ok) return fallo(errorDesdeBody(body) ?? "No se pudo guardar workspace en servidor");
    const guardado = workspaceDesdeBody(body);
    if (!guardado) return fallo("Respuesta de workspace inválida");
    return ok(guardado);
  } catch {
    return fallo("No se pudo conectar al backend de modelos");
  }
}

export async function guardarVersionBackend(modeloId: string, version: VersionResumen, json: string): Promise<Resultado<VersionBackend>> {
  if (!persistenciaBackendHabilitada()) return fallo("Persistencia backend no disponible");
  try {
    const response = await fetch(`${ENDPOINT}/${encodeURIComponent(modeloId)}/versiones`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ version, json }),
    });
    const body = await leerJson(response);
    if (!response.ok) return fallo(errorDesdeBody(body) ?? "No se pudo guardar versión en servidor");
    const guardada = versionDesdeBody(body);
    if (!guardada) return fallo("Respuesta de versión inválida");
    return ok(guardada);
  } catch {
    return fallo("No se pudo conectar al backend de modelos");
  }
}

export async function cargarVersionBackend(modeloId: string, versionId: string): Promise<Resultado<VersionBackend>> {
  if (!persistenciaBackendHabilitada()) return fallo("Persistencia backend no disponible");
  try {
    const response = await fetch(`${ENDPOINT}/${encodeURIComponent(modeloId)}/versiones/${encodeURIComponent(versionId)}`);
    const body = await leerJson(response);
    if (!response.ok) return fallo(errorDesdeBody(body) ?? "Versión no encontrada en servidor");
    const version = versionDesdeBody(body);
    if (!version) return fallo("Respuesta de versión inválida");
    return ok(version);
  } catch {
    return fallo("No se pudo conectar al backend de modelos");
  }
}

export async function borrarVersionBackend(modeloId: string, versionId: string): Promise<Resultado<void>> {
  if (!persistenciaBackendHabilitada()) return fallo("Persistencia backend no disponible");
  try {
    const response = await fetch(`${ENDPOINT}/${encodeURIComponent(modeloId)}/versiones/${encodeURIComponent(versionId)}`, { method: "DELETE" });
    const body = await leerJson(response);
    if (!response.ok) return fallo(errorDesdeBody(body) ?? "No se pudo borrar versión en servidor");
    return ok(undefined);
  } catch {
    return fallo("No se pudo conectar al backend de modelos");
  }
}

export async function guardarAutosalvadoBackend(modeloId: string, json: string, creadoEn = new Date().toISOString()): Promise<Resultado<AutosalvadoBackend>> {
  if (!persistenciaBackendHabilitada()) return fallo("Persistencia backend no disponible");
  try {
    const response = await fetch(`${ENDPOINT}/${encodeURIComponent(modeloId)}/autosave`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ creadoEn, json }),
    });
    const body = await leerJson(response);
    if (!response.ok) return fallo(errorDesdeBody(body) ?? "No se pudo guardar autosalvado en servidor");
    const autosave = autosalvadoDesdeBody(body);
    if (!autosave) return fallo("Respuesta de autosalvado inválida");
    return ok(autosave);
  } catch {
    return fallo("No se pudo conectar al backend de modelos");
  }
}

function modelosDesdeBody(body: unknown): ModeloPersistido[] | null {
  if (!esRecord(body) || !Array.isArray(body.modelos)) return null;
  const modelos = body.modelos.map(normalizarModeloPersistido).filter((modelo): modelo is ModeloPersistido => modelo !== null);
  return modelos.length === body.modelos.length ? modelos : null;
}

function modeloDesdeBody(body: unknown): ModeloPersistido | null {
  if (!esRecord(body)) return null;
  return normalizarModeloPersistido(body.modelo);
}

function sesionDesdeBody(body: unknown): SesionBackend | null {
  if (!esRecord(body) || !esRecord(body.session)) return null;
  const { tenantId, userId } = body.session;
  return typeof tenantId === "string" && typeof userId === "string" ? { tenantId, userId } : null;
}

function workspaceDesdeBody(body: unknown): WorkspaceIndice | null {
  if (!esRecord(body)) return null;
  const value = esRecord(body.indice) ? body.indice : body;
  return normalizarWorkspace(value);
}

function versionDesdeBody(body: unknown): VersionBackend | null {
  if (!esRecord(body) ||
    typeof body.modeloId !== "string" ||
    !esRecord(body.version) ||
    typeof body.json !== "string") {
    return null;
  }
  const version = normalizarVersionResumen(body.version);
  return version ? { modeloId: body.modeloId, version, json: body.json } : null;
}

function autosalvadoDesdeBody(body: unknown): AutosalvadoBackend | null {
  if (!esRecord(body) ||
    typeof body.modeloId !== "string" ||
    typeof body.creadoEn !== "string" ||
    typeof body.json !== "string") {
    return null;
  }
  return { modeloId: body.modeloId, creadoEn: body.creadoEn, json: body.json };
}

function normalizarModeloPersistido(value: unknown): ModeloPersistido | null {
  if (!esRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.nombre !== "string" ||
    typeof value.creadoEn !== "string" ||
    typeof value.actualizadoEn !== "string" ||
    typeof value.json !== "string") {
    return null;
  }
  return {
    id: value.id,
    nombre: value.nombre,
    descripcion: typeof value.descripcion === "string" ? value.descripcion : "",
    creadoEn: value.creadoEn,
    actualizadoEn: value.actualizadoEn,
    json: value.json,
    ...(value.carpetaId === null || typeof value.carpetaId === "string" ? { carpetaId: value.carpetaId } : {}),
    ...(typeof value.ultimaApertura === "string" ? { ultimaApertura: value.ultimaApertura } : {}),
    ...(typeof value.autosalvado === "boolean" ? { autosalvado: value.autosalvado } : {}),
    ...(typeof value.archivado === "boolean" ? { archivado: value.archivado } : {}),
    ...(typeof value.archivadoEn === "string" ? { archivadoEn: value.archivadoEn } : {}),
    ...(typeof value.archivadoAuto === "boolean" ? { archivadoAuto: value.archivadoAuto } : {}),
    ...(Array.isArray(value.versiones) ? { versiones: value.versiones.filter(esVersionResumen) } : {}),
    ...(typeof value.crearVersionAlGuardar === "boolean" ? { crearVersionAlGuardar: value.crearVersionAlGuardar } : {}),
    ...(typeof value.revision === "number" && Number.isInteger(value.revision) && value.revision >= 0 ? { revision: value.revision } : {}),
  };
}

function resumenDesdeModelo(modelo: ModeloPersistido): ResumenModeloPersistido {
  const { json: _json, ...resumen } = modelo;
  return resumen;
}

function normalizarWorkspace(value: unknown): WorkspaceIndice {
  if (!esRecord(value)) return indiceVacio();
  return {
    modelos: Array.isArray(value.modelos)
      ? value.modelos.map(normalizarModeloIndice).filter((modelo): modelo is WorkspaceIndice["modelos"][number] => modelo !== null)
      : [],
    carpetas: Array.isArray(value.carpetas)
      ? value.carpetas.map(normalizarCarpetaIndice).filter((carpeta): carpeta is WorkspaceIndice["carpetas"][number] => carpeta !== null)
      : [],
    recientes: Array.isArray(value.recientes) ? value.recientes.filter((id): id is string => typeof id === "string") : [],
    ...(typeof value.busquedaGlobalUltima === "string" ? { busquedaGlobalUltima: value.busquedaGlobalUltima } : {}),
    ...(esPreferenciasUi(value.preferenciasUi) ? { preferenciasUi: value.preferenciasUi } : {}),
  };
}

async function leerJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function errorDesdeBody(body: unknown): string | null {
  return esRecord(body) && typeof body.error === "string" ? body.error : null;
}

function esVersionResumen(value: unknown): value is VersionResumen {
  return normalizarVersionResumen(value) !== null;
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

function esRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo<T = never>(error: string): Resultado<T> {
  return { ok: false, error };
}
