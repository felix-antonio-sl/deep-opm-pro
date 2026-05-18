import type { Id, Modelo, Resultado, VersionResumen } from "../modelo/tipos";
import { exportarModelo, hidratarModelo } from "../serializacion/json";
import type { WorkspaceIndice } from "./workspace";

const VERSION_KEY_PREFIX = "deep-opm-pro:version:";

export type CodigoErrorVersion =
  | "storage_no_disponible"
  | "storage_escritura_fallida"
  | "storage_lectura_fallida"
  | "storage_borrado_fallido"
  | "version_no_encontrada"
  | "snapshot_no_encontrado"
  | "snapshot_corrupto";

export interface ErrorVersion {
  codigo: CodigoErrorVersion;
  mensaje: string;
  detalle?: string;
}

export type ResultadoVersion<T> = Resultado<T, ErrorVersion>;

export function crearVersion(
  modelo: Modelo,
  opts: { nombre?: string; descripcion?: string; preservar?: boolean; ahora?: string } = {},
): VersionResumen {
  const resultado = crearVersionResultado(modelo, opts);
  if (!resultado.ok) throw new Error(resultado.error.mensaje);
  return resultado.value;
}

export function crearVersionResultado(
  modelo: Modelo,
  opts: { nombre?: string; descripcion?: string; preservar?: boolean; ahora?: string } = {},
): ResultadoVersion<VersionResumen> {
  const storage = storageLocal();
  if (!storage.ok) return storage;
  const versionId = generarId();
  const creadoEn = opts.ahora ?? new Date().toISOString();
  const payload = exportarModelo(modelo);
  const modeloPayloadKey = claveVersion(modelo.id, versionId);
  try {
    storage.value.setItem(modeloPayloadKey, payload);
  } catch {
    return falloVersion("storage_escritura_fallida", "No se pudo crear versión");
  }
  return okVersion({
    id: versionId,
    creadoEn,
    nombre: opts.nombre?.trim() || `Snapshot ${formatearFechaCorta(creadoEn)}`,
    ...(opts.descripcion?.trim() ? { descripcion: opts.descripcion.trim() } : {}),
    ...(opts.preservar ? { preservar: true } : {}),
    modeloPayloadKey,
    bytes: payload.length,
  });
}

export function listarVersiones(workspace: WorkspaceIndice, modeloId: Id): VersionResumen[] {
  return [...(workspace.modelos.find((modelo) => modelo.id === modeloId)?.versiones ?? [])]
    .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
}

export async function restaurarVersion(versionIdOClave: Id): Promise<Modelo> {
  const resultado = await restaurarVersionResultado(versionIdOClave);
  if (!resultado.ok) throw new Error(resultado.error.mensaje);
  return resultado.value;
}

export async function restaurarVersionResultado(versionIdOClave: Id): Promise<ResultadoVersion<Modelo>> {
  const storage = storageLocal();
  if (!storage.ok) return storage;
  let key: string | null;
  try {
    key = versionIdOClave.startsWith(VERSION_KEY_PREFIX)
      ? versionIdOClave
      : buscarClaveVersion(storage.value, versionIdOClave);
  } catch {
    return falloVersion("storage_lectura_fallida", "No se pudo leer versión");
  }
  if (!key) return falloVersion("version_no_encontrada", "Versión no encontrada");
  let payload: string | null;
  try {
    payload = storage.value.getItem(key);
  } catch {
    return falloVersion("storage_lectura_fallida", "No se pudo leer versión");
  }
  if (!payload) return falloVersion("snapshot_no_encontrado", "Snapshot de versión no encontrado");
  const hidratado = hidratarModelo(payload);
  if (!hidratado.ok) return falloVersion("snapshot_corrupto", hidratado.error, hidratado.error);
  return okVersion(hidratado.value);
}

export function eliminarVersion(
  workspace: WorkspaceIndice,
  modeloId: Id,
  versionId: Id,
): WorkspaceIndice {
  const resultado = eliminarVersionResultado(workspace, modeloId, versionId);
  if (!resultado.ok) throw new Error(resultado.error.mensaje);
  return resultado.value;
}

export function eliminarVersionResultado(
  workspace: WorkspaceIndice,
  modeloId: Id,
  versionId: Id,
): ResultadoVersion<WorkspaceIndice> {
  const modelo = workspace.modelos.find((item) => item.id === modeloId);
  const version = modelo?.versiones?.find((item) => item.id === versionId);
  if (version) {
    const storage = storageLocal();
    if (!storage.ok) return storage;
    try {
      storage.value.removeItem(version.modeloPayloadKey);
    } catch {
      return falloVersion("storage_borrado_fallido", "No se pudo eliminar versión");
    }
  }
  return okVersion({
    ...workspace,
    modelos: workspace.modelos.map((item) =>
      item.id === modeloId
        ? { ...item, versiones: (item.versiones ?? []).filter((v) => v.id !== versionId) }
        : item,
    ),
  });
}

export function aplicarPoliticaLogScaleVersiones(
  versiones: VersionResumen[],
  ahora = new Date(),
  maxTotal = 10,
): VersionResumen[] {
  const preservadas = versiones.filter((version) => version.preservar);
  const candidatas = versiones
    .filter((version) => !version.preservar && Number.isFinite(Date.parse(version.creadoEn)))
    .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
  const buckets: Record<"dia" | "semana" | "mes" | "historico", { max: number; versiones: VersionResumen[] }> = {
    dia: { max: 10, versiones: [] },
    semana: { max: 7, versiones: [] },
    mes: { max: 4, versiones: [] },
    historico: { max: 1, versiones: [] },
  };
  for (const version of candidatas) {
    const edadDias = (ahora.getTime() - Date.parse(version.creadoEn)) / (24 * 60 * 60 * 1000);
    if (edadDias <= 1) buckets.dia.versiones.push(version);
    else if (edadDias <= 7) buckets.semana.versiones.push(version);
    else if (edadDias <= 30) buckets.mes.versiones.push(version);
    else buckets.historico.versiones.push(version);
  }
  return [
    ...preservadas,
    ...buckets.dia.versiones.slice(0, buckets.dia.max),
    ...buckets.semana.versiones.slice(0, buckets.semana.max),
    ...buckets.mes.versiones.slice(0, buckets.mes.max),
    ...buckets.historico.versiones.slice(0, buckets.historico.max),
  ]
    .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn))
    .slice(0, Math.max(1, maxTotal));
}

export function idsVersionesPodadas(versionesAntes: VersionResumen[], versionesDespues: VersionResumen[]): Id[] {
  const retenidas = new Set(versionesDespues.map((version) => version.id));
  return versionesAntes.filter((version) => !retenidas.has(version.id)).map((version) => version.id);
}

export function filtrarVersionesVisibles(versiones: VersionResumen[], mostrarVersiones: boolean): VersionResumen[] {
  if (!mostrarVersiones) return [];
  return [...versiones].sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
}

export function claveVersion(modeloId: Id, versionId: Id): string {
  return `${VERSION_KEY_PREFIX}${modeloId}:${versionId}`;
}

function storageLocal(): ResultadoVersion<Storage> {
  try {
    if (typeof globalThis.localStorage === "undefined") {
      return falloVersion("storage_no_disponible", "Storage local no disponible");
    }
    return okVersion(globalThis.localStorage);
  } catch {
    return falloVersion("storage_no_disponible", "Storage local no disponible");
  }
}

function generarId(): Id {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `version-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function buscarClaveVersion(storage: Storage, versionId: Id): string | null {
  const suffix = `:${versionId}`;
  for (let i = 0; i < storage.length; i += 1) {
    const key = storage.key(i);
    if (key?.startsWith(VERSION_KEY_PREFIX) && key.endsWith(suffix)) return key;
  }
  return null;
}

function formatearFechaCorta(iso: string): string {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return iso;
  return fecha.toLocaleString("es-CL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function okVersion<T>(value: T): ResultadoVersion<T> {
  return { ok: true, value };
}

function falloVersion<T = never>(codigo: CodigoErrorVersion, mensaje: string, detalle?: string): ResultadoVersion<T> {
  return { ok: false, error: detalle ? { codigo, mensaje, detalle } : { codigo, mensaje } };
}
