import type { Resultado, VersionResumen } from "../modelo/tipos";

const FORMATO_PERSISTENCIA = "deep-opm-pro.persistencia.local.v1";
const INDEX_KEY = "deep-opm-pro:persistencia:index";
const MODEL_KEY_PREFIX = "deep-opm-pro:persistencia:modelo:";

export interface ResumenModeloPersistido {
  id: string;
  nombre: string;
  descripcion: string;
  creadoEn: string;
  actualizadoEn: string;
  carpetaId?: string | null;
  ultimaApertura?: string;
  autosalvado?: boolean;
  archivado?: boolean;
  archivadoEn?: string;
  archivadoAuto?: boolean;
  versiones?: VersionResumen[];
  crearVersionAlGuardar?: boolean;
}

export interface ModeloPersistido extends ResumenModeloPersistido {
  json: string;
}

export interface GuardarModeloLocalInput {
  id?: string | null;
  nombre: string;
  descripcion?: string;
  json: string;
  carpetaId?: string | null;
  ultimaApertura?: string;
  autosalvado?: boolean;
  archivado?: boolean;
  archivadoEn?: string;
  archivadoAuto?: boolean;
  versiones?: VersionResumen[];
  crearVersionAlGuardar?: boolean;
}

export type MetadataModeloLocalPatch = Partial<Pick<
  ResumenModeloPersistido,
  "nombre" | "descripcion" | "carpetaId" | "ultimaApertura" | "autosalvado" | "archivado" | "archivadoEn" | "archivadoAuto" | "versiones" | "crearVersionAlGuardar"
>>;

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
  const carpetaId = input.carpetaId ?? existente?.carpetaId;
  if (carpetaId !== undefined) {
    resumen.carpetaId = carpetaId;
  }
  const ultimaApertura = input.ultimaApertura ?? existente?.ultimaApertura;
  if (ultimaApertura !== undefined) {
    resumen.ultimaApertura = ultimaApertura;
  }
  const autosalvado = input.autosalvado ?? existente?.autosalvado;
  if (autosalvado !== undefined) {
    resumen.autosalvado = autosalvado;
  }
  const archivado = input.archivado ?? existente?.archivado;
  if (archivado !== undefined) {
    resumen.archivado = archivado;
  }
  const archivadoEn = input.archivadoEn ?? existente?.archivadoEn;
  if (archivadoEn !== undefined) {
    resumen.archivadoEn = archivadoEn;
  }
  const archivadoAuto = input.archivadoAuto ?? existente?.archivadoAuto;
  if (archivadoAuto !== undefined) {
    resumen.archivadoAuto = archivadoAuto;
  }
  const versiones = input.versiones ?? existente?.versiones;
  if (versiones !== undefined) {
    resumen.versiones = versiones;
  }
  const crearVersionAlGuardar = input.crearVersionAlGuardar ?? existente?.crearVersionAlGuardar;
  if (crearVersionAlGuardar !== undefined) {
    resumen.crearVersionAlGuardar = crearVersionAlGuardar;
  }
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

export function renombrarModeloLocal(id: string, nombre: string): Resultado<ModeloPersistido> {
  const storage = storageLocal();
  if (!storage.ok) return storage;
  const limpio = id.trim();
  const nuevoNombre = nombre.trim();
  if (!limpio) return fallo("Modelo local inválido");
  if (!nuevoNombre) return fallo("Ingresa un nombre de modelo");
  const indice = leerIndice(storage.value);
  const existente = indice.find((item) => item.id === limpio);
  if (!existente) return fallo("Modelo local no encontrado");
  const duplicado = indice.some((item) =>
    item.id !== limpio &&
    item.nombre.trim().toLocaleLowerCase("es-CL") === nuevoNombre.toLocaleLowerCase("es-CL")
  );
  if (duplicado) return fallo("Ya existe un modelo local con ese nombre");
  const cargado = cargarModeloLocal(limpio);
  if (!cargado.ok) return cargado;
  const json = renombrarModeloEnJson(cargado.value.json, nuevoNombre);
  const actualizado = aplicarPatchResumen(existente, { nombre: nuevoNombre });
  const modelo: ModeloPersistido = { ...cargado.value, ...actualizado, json };
  try {
    storage.value.setItem(modelKey(limpio), JSON.stringify({ formato: FORMATO_PERSISTENCIA, modelo } satisfies DocumentoPersistido));
    escribirIndice(storage.value, [actualizado, ...indice.filter((item) => item.id !== limpio)]);
  } catch {
    return fallo("No se pudo renombrar el modelo local");
  }
  return ok(modelo);
}

export function tocarUltimoUso(id: string, ahora = new Date().toISOString()): Resultado<ResumenModeloPersistido> {
  return actualizarMetadataModeloLocal(id, { ultimaApertura: ahora });
}

export function tocarUltimoUsoBatch(ids: string[], ahora = new Date().toISOString()): Resultado<ResumenModeloPersistido[]> {
  const actualizados: ResumenModeloPersistido[] = [];
  for (const id of ids) {
    const resultado = tocarUltimoUso(id, ahora);
    if (!resultado.ok) return resultado;
    actualizados.push(resultado.value);
  }
  return ok(actualizados);
}

export function listarRecientes(limite = 12): Resultado<ResumenModeloPersistido[]> {
  const listado = listarModelosLocales();
  if (!listado.ok) return listado;
  return ok([...listado.value]
    .filter((modelo) => !modelo.archivado)
    .sort((a, b) => fechaUso(b).localeCompare(fechaUso(a)))
    .slice(0, Math.max(0, limite)));
}

export function borrarModeloLocal(id: string): Resultado<void> {
  const storage = storageLocal();
  if (!storage.ok) return storage;
  const limpio = id.trim();
  if (!limpio) return fallo("Modelo local inválido");
  const indice = leerIndice(storage.value);
  const existente = indice.find((item) => item.id === limpio);
  try {
    storage.value.removeItem(modelKey(limpio));
    for (const version of existente?.versiones ?? []) {
      storage.value.removeItem(version.modeloPayloadKey);
    }
    escribirIndice(storage.value, indice.filter((item) => item.id !== limpio));
  } catch {
    return fallo("No se pudo borrar el modelo local");
  }
  return ok(undefined);
}

export function actualizarMetadataModeloLocal(id: string, patch: MetadataModeloLocalPatch): Resultado<ResumenModeloPersistido> {
  const storage = storageLocal();
  if (!storage.ok) return storage;
  const limpio = id.trim();
  if (!limpio) return fallo("Modelo local inválido");
  const indice = leerIndice(storage.value);
  const resumen = indice.find((item) => item.id === limpio);
  if (!resumen) return fallo("Modelo local no encontrado");
  const cargado = cargarModeloLocal(limpio);
  if (!cargado.ok) return cargado;
  const actualizado = aplicarPatchResumen(resumen, patch);
  const documento: DocumentoPersistido = {
    formato: FORMATO_PERSISTENCIA,
    modelo: { ...cargado.value, ...actualizado, json: cargado.value.json },
  };
  try {
    storage.value.setItem(modelKey(limpio), JSON.stringify(documento));
    escribirIndice(storage.value, [actualizado, ...indice.filter((item) => item.id !== limpio)]);
  } catch {
    return fallo("No se pudo actualizar metadata local");
  }
  return ok(actualizado);
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
  const base: ResumenModeloPersistido = {
    id: value.id,
    nombre: value.nombre,
    descripcion: typeof value.descripcion === "string" ? value.descripcion : "",
    creadoEn: value.creadoEn,
    actualizadoEn: value.actualizadoEn,
  };
  if (value.carpetaId !== undefined && (value.carpetaId === null || typeof value.carpetaId === "string")) {
    base.carpetaId = value.carpetaId;
  }
  if (typeof value.ultimaApertura === "string") {
    base.ultimaApertura = value.ultimaApertura;
  }
  if (typeof value.autosalvado === "boolean") {
    base.autosalvado = value.autosalvado;
  }
  if (typeof value.archivado === "boolean") {
    base.archivado = value.archivado;
  }
  if (typeof value.archivadoEn === "string") {
    base.archivadoEn = value.archivadoEn;
  }
  if (typeof value.archivadoAuto === "boolean") {
    base.archivadoAuto = value.archivadoAuto;
  }
  if (Array.isArray(value.versiones)) {
    const versiones = value.versiones
      .map(normalizarVersionResumen)
      .filter((version): version is VersionResumen => version !== null);
    if (versiones.length > 0) base.versiones = versiones;
  }
  if (typeof value.crearVersionAlGuardar === "boolean") {
    base.crearVersionAlGuardar = value.crearVersionAlGuardar;
  }
  return base;
}

function aplicarPatchResumen(resumen: ResumenModeloPersistido, patch: MetadataModeloLocalPatch): ResumenModeloPersistido {
  const actualizado: ResumenModeloPersistido = { ...resumen };
  if ("nombre" in patch && typeof patch.nombre === "string") actualizado.nombre = patch.nombre;
  if ("descripcion" in patch && typeof patch.descripcion === "string") actualizado.descripcion = patch.descripcion;
  if ("carpetaId" in patch) actualizado.carpetaId = patch.carpetaId;
  if ("ultimaApertura" in patch) actualizado.ultimaApertura = patch.ultimaApertura;
  if ("autosalvado" in patch) actualizado.autosalvado = patch.autosalvado;
  if ("archivado" in patch) actualizado.archivado = patch.archivado;
  if ("archivadoEn" in patch) actualizado.archivadoEn = patch.archivadoEn;
  if ("archivadoAuto" in patch) actualizado.archivadoAuto = patch.archivadoAuto;
  if ("versiones" in patch) actualizado.versiones = patch.versiones;
  if ("crearVersionAlGuardar" in patch) actualizado.crearVersionAlGuardar = patch.crearVersionAlGuardar;
  return actualizado;
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

function fechaUso(modelo: ResumenModeloPersistido): string {
  return modelo.ultimaApertura ?? modelo.actualizadoEn ?? modelo.creadoEn;
}

function renombrarModeloEnJson(json: string, nombre: string): string {
  const parsed = parseJson(json);
  if (!esRecord(parsed) || !esRecord(parsed.modelo)) return json;
  return JSON.stringify({
    ...parsed,
    modelo: {
      ...parsed.modelo,
      nombre,
    },
  }, null, 2);
}
