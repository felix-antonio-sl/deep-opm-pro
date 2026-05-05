import type { Resultado } from "../modelo/tipos";

const FORMATO_PERSISTENCIA = "deep-opm-pro.persistencia.local.v1";
const INDEX_KEY = "deep-opm-pro:persistencia:index";
const MODEL_KEY_PREFIX = "deep-opm-pro:persistencia:modelo:";

export interface ResumenModeloPersistido {
  id: string;
  nombre: string;
  descripcion: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface ModeloPersistido extends ResumenModeloPersistido {
  json: string;
}

export interface GuardarModeloLocalInput {
  id?: string | null;
  nombre: string;
  descripcion?: string;
  json: string;
}

interface IndicePersistencia {
  formato: typeof FORMATO_PERSISTENCIA;
  modelos: ResumenModeloPersistido[];
}

interface DocumentoPersistido {
  formato: typeof FORMATO_PERSISTENCIA;
  modelo: ModeloPersistido;
}

export function listarModelosLocales(): Resultado<ResumenModeloPersistido[]> {
  const storage = storageLocal();
  if (!storage.ok) return storage;
  return ok(ordenarPorActualizacion(leerIndice(storage.value)));
}

export function guardarModeloLocal(input: GuardarModeloLocalInput): Resultado<ModeloPersistido> {
  const storage = storageLocal();
  if (!storage.ok) return storage;
  const nombre = input.nombre.trim() || "Modelo OPM";
  const descripcion = typeof input.descripcion === "string" ? input.descripcion.trim() : "";
  const id = input.id?.trim() || generarId();
  const ahora = new Date().toISOString();
  const indice = leerIndice(storage.value);
  const existente = indice.find((item) => item.id === id);
  const resumen: ResumenModeloPersistido = {
    id,
    nombre,
    descripcion,
    creadoEn: existente?.creadoEn ?? ahora,
    actualizadoEn: ahora,
  };
  const modelo: ModeloPersistido = { ...resumen, json: input.json };

  try {
    storage.value.setItem(modelKey(id), JSON.stringify({ formato: FORMATO_PERSISTENCIA, modelo } satisfies DocumentoPersistido));
    escribirIndice(storage.value, [resumen, ...indice.filter((item) => item.id !== id)]);
  } catch {
    return fallo("No se pudo guardar en storage local");
  }

  return ok(modelo);
}

export function cargarModeloLocal(id: string): Resultado<ModeloPersistido> {
  const storage = storageLocal();
  if (!storage.ok) return storage;
  const limpio = id.trim();
  if (!limpio) return fallo("Modelo local inválido");
  const raw = storage.value.getItem(modelKey(limpio));
  if (!raw) return fallo("Modelo local no encontrado");
  const parsed = parseJson(raw);
  if (!esRecord(parsed) || parsed.formato !== FORMATO_PERSISTENCIA) {
    return fallo("Modelo local corrupto");
  }
  const modelo = normalizarModeloPersistido(parsed.modelo);
  if (!modelo) {
    return fallo("Modelo local corrupto");
  }
  return ok(modelo);
}

export function borrarModeloLocal(id: string): Resultado<void> {
  const storage = storageLocal();
  if (!storage.ok) return storage;
  const limpio = id.trim();
  if (!limpio) return fallo("Modelo local inválido");
  const indice = leerIndice(storage.value);
  try {
    storage.value.removeItem(modelKey(limpio));
    escribirIndice(storage.value, indice.filter((item) => item.id !== limpio));
  } catch {
    return fallo("No se pudo borrar el modelo local");
  }
  return ok(undefined);
}

function leerIndice(storage: Storage): ResumenModeloPersistido[] {
  const parsed = parseJson(storage.getItem(INDEX_KEY));
  if (!esRecord(parsed) || parsed.formato !== FORMATO_PERSISTENCIA || !Array.isArray(parsed.modelos)) return [];
  return parsed.modelos
    .map(normalizarResumenModeloPersistido)
    .filter((modelo): modelo is ResumenModeloPersistido => modelo !== null);
}

function escribirIndice(storage: Storage, modelos: ResumenModeloPersistido[]): void {
  const indice: IndicePersistencia = {
    formato: FORMATO_PERSISTENCIA,
    modelos: ordenarPorActualizacion(modelos),
  };
  storage.setItem(INDEX_KEY, JSON.stringify(indice));
}

function ordenarPorActualizacion(modelos: ResumenModeloPersistido[]): ResumenModeloPersistido[] {
  return [...modelos].sort((a, b) => b.actualizadoEn.localeCompare(a.actualizadoEn));
}

function storageLocal(): Resultado<Storage> {
  try {
    if (typeof globalThis.localStorage === "undefined") return fallo("Storage local no disponible");
    return ok(globalThis.localStorage);
  } catch {
    return fallo("Storage local no disponible");
  }
}

function modelKey(id: string): string {
  return `${MODEL_KEY_PREFIX}${id}`;
}

function generarId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `modelo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function parseJson(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function normalizarModeloPersistido(value: unknown): ModeloPersistido | null {
  const resumen = normalizarResumenModeloPersistido(value);
  if (!resumen || !esRecord(value) || typeof value.json !== "string") return null;
  return { ...resumen, json: value.json };
}

function normalizarResumenModeloPersistido(value: unknown): ResumenModeloPersistido | null {
  if (!esRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.nombre !== "string" ||
    typeof value.creadoEn !== "string" ||
    typeof value.actualizadoEn !== "string") {
    return null;
  }
  return {
    id: value.id,
    nombre: value.nombre,
    descripcion: typeof value.descripcion === "string" ? value.descripcion : "",
    creadoEn: value.creadoEn,
    actualizadoEn: value.actualizadoEn,
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
