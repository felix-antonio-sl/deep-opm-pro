import type { AmbitoPlantilla, Id, Plantilla, PlantillaIndice, Resultado } from "../modelo/tipos";
import type { ModeloPersistido } from "./local";

/**
 * CRUD local de plantillas privadas. Namespace independiente `opm:plantilla:*`.
 * Citas SSOT: [Met §8.8] plantillas privadas/organizacionales/globales y copia
 * local desacoplada al insertar; [V-52]/[V-123] apariencias múltiples sin
 * colapsar existencia entre modelos.
 * Evidencia OPCloud: opm-extracted/src/app/dialogs/templates-import/templates-import.ts.
 */

const FORMATO_PLANTILLA = "deep-opm-pro.plantilla.local.v1";
const LISTA_KEY = "opm:plantillas-lista";
const PLANTILLA_KEY_PREFIX = "opm:plantilla:";
const INDICE_KEY_PREFIX = "opm:plantilla-indice:";

interface DocumentoPlantilla {
  formato: typeof FORMATO_PLANTILLA;
  plantilla: Plantilla;
}

interface DocumentoIndice {
  formato: typeof FORMATO_PLANTILLA;
  plantilla: PlantillaIndice;
}

export interface GuardarPlantillaInput {
  nombre: string;
  descripcion?: string;
  modeloPersistido: ModeloPersistido;
  ambito?: AmbitoPlantilla;
}

export function listarPlantillas(ambito?: AmbitoPlantilla): Resultado<PlantillaIndice[]> {
  const storage = storageLocal();
  if (!storage.ok) return storage;
  const ids = leerLista(storage.value);
  const plantillas = ids
    .map((id) => leerIndice(storage.value, id))
    .filter((plantilla): plantilla is PlantillaIndice => plantilla !== null)
    .filter((plantilla) => ambito === undefined || plantilla.ambito === ambito);
  return ok(ordenarPorActualizacion(plantillas));
}

export function guardarPlantilla(input: GuardarPlantillaInput): Resultado<Plantilla> {
  const storage = storageLocal();
  if (!storage.ok) return storage;
  const nombre = input.nombre.trim();
  if (!nombre) return fallo("Ingresa un nombre de plantilla");
  const ambito = input.ambito ?? "privado";
  if (ambito !== "privado") return fallo("Disponible cuando se habilite multi-usuario");
  const descripcion = input.descripcion?.trim();
  const ahora = new Date().toISOString();
  const id = generarId();
  const contenido: ModeloPersistido = {
    ...input.modeloPersistido,
    id: input.modeloPersistido.id || id,
    nombre: input.modeloPersistido.nombre || nombre,
    descripcion: input.modeloPersistido.descripcion ?? "",
  };
  const plantilla: Plantilla = {
    id,
    nombre,
    ...(descripcion ? { descripcion } : {}),
    ambito,
    contenido,
    creadoEn: ahora,
    actualizadoEn: ahora,
  };
  const indice = indiceDesdePlantilla(plantilla);
  try {
    storage.value.setItem(plantillaKey(id), JSON.stringify({ formato: FORMATO_PLANTILLA, plantilla } satisfies DocumentoPlantilla));
    storage.value.setItem(indiceKey(id), JSON.stringify({ formato: FORMATO_PLANTILLA, plantilla: indice } satisfies DocumentoIndice));
    escribirLista(storage.value, [id, ...leerLista(storage.value).filter((item) => item !== id)]);
  } catch {
    return fallo("No se pudo guardar la plantilla local");
  }
  return ok(plantilla);
}

export function cargarPlantilla(id: Id): Resultado<Plantilla> {
  const storage = storageLocal();
  if (!storage.ok) return storage;
  const limpio = id.trim();
  if (!limpio) return fallo("Plantilla inválida");
  const parsed = parseJson(storage.value.getItem(plantillaKey(limpio)));
  if (!esRecord(parsed) || parsed.formato !== FORMATO_PLANTILLA) return fallo("Plantilla no encontrada");
  const plantilla = normalizarPlantilla(parsed.plantilla);
  if (!plantilla) return fallo("Plantilla corrupta");
  return ok(plantilla);
}

export function borrarPlantilla(id: Id): Resultado<void> {
  const storage = storageLocal();
  if (!storage.ok) return storage;
  const limpio = id.trim();
  if (!limpio) return fallo("Plantilla inválida");
  try {
    storage.value.removeItem(plantillaKey(limpio));
    storage.value.removeItem(indiceKey(limpio));
    escribirLista(storage.value, leerLista(storage.value).filter((item) => item !== limpio));
  } catch {
    return fallo("No se pudo borrar la plantilla local");
  }
  return ok(undefined);
}

export function renombrarPlantilla(id: Id, nombre: string, descripcion?: string): Resultado<PlantillaIndice> {
  const cargada = cargarPlantilla(id);
  if (!cargada.ok) return cargada;
  const limpio = nombre.trim();
  if (!limpio) return fallo("Ingresa un nombre de plantilla");
  const actualizada: Plantilla = {
    ...cargada.value,
    nombre: limpio,
    actualizadoEn: new Date().toISOString(),
  };
  if (descripcion?.trim()) actualizada.descripcion = descripcion.trim();
  else delete actualizada.descripcion;
  const storage = storageLocal();
  if (!storage.ok) return storage;
  const indice = indiceDesdePlantilla(actualizada);
  try {
    storage.value.setItem(plantillaKey(id), JSON.stringify({ formato: FORMATO_PLANTILLA, plantilla: actualizada } satisfies DocumentoPlantilla));
    storage.value.setItem(indiceKey(id), JSON.stringify({ formato: FORMATO_PLANTILLA, plantilla: indice } satisfies DocumentoIndice));
  } catch {
    return fallo("No se pudo renombrar la plantilla local");
  }
  return ok(indice);
}

function indiceDesdePlantilla(plantilla: Plantilla): PlantillaIndice {
  return {
    id: plantilla.id,
    nombre: plantilla.nombre,
    ...(plantilla.descripcion ? { descripcion: plantilla.descripcion } : {}),
    ambito: plantilla.ambito,
    creadoEn: plantilla.creadoEn,
    actualizadoEn: plantilla.actualizadoEn,
  };
}

function normalizarPlantilla(value: unknown): Plantilla | null {
  if (!esRecord(value)) return null;
  if (typeof value.id !== "string" || typeof value.nombre !== "string") return null;
  if (!esAmbitoPlantilla(value.ambito)) return null;
  if (!esModeloPersistido(value.contenido)) return null;
  if (typeof value.creadoEn !== "string" || typeof value.actualizadoEn !== "string") return null;
  return {
    id: value.id,
    nombre: value.nombre,
    ...(typeof value.descripcion === "string" && value.descripcion ? { descripcion: value.descripcion } : {}),
    ambito: value.ambito,
    contenido: value.contenido,
    creadoEn: value.creadoEn,
    actualizadoEn: value.actualizadoEn,
  };
}

function leerIndice(storage: Storage, id: Id): PlantillaIndice | null {
  const parsed = parseJson(storage.getItem(indiceKey(id)));
  if (!esRecord(parsed) || parsed.formato !== FORMATO_PLANTILLA) return null;
  const item = parsed.plantilla;
  if (!esRecord(item) || typeof item.id !== "string" || typeof item.nombre !== "string") return null;
  if (!esAmbitoPlantilla(item.ambito) || typeof item.creadoEn !== "string" || typeof item.actualizadoEn !== "string") return null;
  return {
    id: item.id,
    nombre: item.nombre,
    ...(typeof item.descripcion === "string" && item.descripcion ? { descripcion: item.descripcion } : {}),
    ambito: item.ambito,
    creadoEn: item.creadoEn,
    actualizadoEn: item.actualizadoEn,
  };
}

function leerLista(storage: Storage): Id[] {
  const parsed = parseJson(storage.getItem(LISTA_KEY));
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((id): id is Id => typeof id === "string" && id.length > 0);
}

function escribirLista(storage: Storage, ids: Id[]): void {
  storage.setItem(LISTA_KEY, JSON.stringify([...new Set(ids)]));
}

function ordenarPorActualizacion(plantillas: PlantillaIndice[]): PlantillaIndice[] {
  return [...plantillas].sort((a, b) => b.actualizadoEn.localeCompare(a.actualizadoEn));
}

function storageLocal(): Resultado<Storage> {
  try {
    if (typeof globalThis.localStorage === "undefined") return fallo("Storage local no disponible");
    return ok(globalThis.localStorage);
  } catch {
    return fallo("Storage local no disponible");
  }
}

function plantillaKey(id: Id): string {
  return `${PLANTILLA_KEY_PREFIX}${id}`;
}

function indiceKey(id: Id): string {
  return `${INDICE_KEY_PREFIX}${id}`;
}

function generarId(): Id {
  if (typeof globalThis.crypto?.randomUUID === "function") return `plantilla-${globalThis.crypto.randomUUID()}`;
  return `plantilla-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function esAmbitoPlantilla(value: unknown): value is AmbitoPlantilla {
  return value === "privado" || value === "organizacional" || value === "global";
}

function esModeloPersistido(value: unknown): value is ModeloPersistido {
  return esRecord(value) &&
    typeof value.id === "string" &&
    typeof value.nombre === "string" &&
    typeof value.descripcion === "string" &&
    typeof value.creadoEn === "string" &&
    typeof value.actualizadoEn === "string" &&
    typeof value.json === "string";
}

function parseJson(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function esRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
