import type { Resultado } from "../modelo/tipos";
import {
  espejarModeloLocal,
  type ModeloPersistido,
  type ResumenModeloPersistido,
} from "./local";

const ENDPOINT = "/__deep-opm/modelos";

export function persistenciaBackendHabilitada(): boolean {
  return typeof window !== "undefined" && typeof fetch === "function";
}

export async function listarModelosBackendConCache(): Promise<Resultado<ResumenModeloPersistido[]>> {
  if (!persistenciaBackendHabilitada()) return fallo("Persistencia backend no disponible");
  try {
    const response = await fetch(`${ENDPOINT}?includePayload=1`, { method: "GET" });
    const body = await leerJson(response);
    if (!response.ok) return fallo(errorDesdeBody(body) ?? "No se pudo listar modelos del servidor");
    const modelos = modelosDesdeBody(body);
    if (!modelos) return fallo("Respuesta de modelos inválida");
    for (const modelo of modelos) {
      espejarModeloLocal(modelo);
    }
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
    espejarModeloLocal(guardado);
    return ok(guardado);
  } catch {
    return fallo("No se pudo conectar al backend de modelos");
  }
}

export async function cargarModeloBackendConCache(id: string): Promise<Resultado<ModeloPersistido>> {
  if (!persistenciaBackendHabilitada()) return fallo("Persistencia backend no disponible");
  try {
    const response = await fetch(`${ENDPOINT}/${encodeURIComponent(id)}`, { method: "GET" });
    const body = await leerJson(response);
    if (!response.ok) return fallo(errorDesdeBody(body) ?? "Modelo no encontrado en servidor");
    const modelo = modeloDesdeBody(body);
    if (!modelo) return fallo("Respuesta de modelo inválida");
    espejarModeloLocal(modelo);
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

function modelosDesdeBody(body: unknown): ModeloPersistido[] | null {
  if (!esRecord(body) || !Array.isArray(body.modelos)) return null;
  const modelos = body.modelos.map(normalizarModeloPersistido).filter((modelo): modelo is ModeloPersistido => modelo !== null);
  return modelos.length === body.modelos.length ? modelos : null;
}

function modeloDesdeBody(body: unknown): ModeloPersistido | null {
  if (!esRecord(body)) return null;
  return normalizarModeloPersistido(body.modelo);
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
  };
}

function resumenDesdeModelo(modelo: ModeloPersistido): ResumenModeloPersistido {
  const { json: _json, ...resumen } = modelo;
  return resumen;
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

function esVersionResumen(value: unknown): boolean {
  return esRecord(value) &&
    typeof value.id === "string" &&
    typeof value.creadoEn === "string" &&
    typeof value.nombre === "string" &&
    typeof value.modeloPayloadKey === "string" &&
    typeof value.bytes === "number";
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
