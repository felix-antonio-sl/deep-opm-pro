import type { Id, Modelo, VersionResumen } from "../modelo/tipos";
import { exportarModelo, hidratarModelo } from "../serializacion/json";
import type { WorkspaceIndice } from "./workspace";

const VERSION_KEY_PREFIX = "deep-opm-pro:version:";

export function crearVersion(
  modelo: Modelo,
  opts: { nombre?: string; descripcion?: string; preservar?: boolean; ahora?: string } = {},
): VersionResumen {
  const versionId = generarId();
  const creadoEn = opts.ahora ?? new Date().toISOString();
  const payload = exportarModelo(modelo);
  const modeloPayloadKey = claveVersion(modelo.id, versionId);
  storageLocal().setItem(modeloPayloadKey, payload);
  return {
    id: versionId,
    creadoEn,
    nombre: opts.nombre?.trim() || `Snapshot ${formatearFechaCorta(creadoEn)}`,
    ...(opts.descripcion?.trim() ? { descripcion: opts.descripcion.trim() } : {}),
    ...(opts.preservar ? { preservar: true } : {}),
    modeloPayloadKey,
    bytes: payload.length,
  };
}

export function listarVersiones(workspace: WorkspaceIndice, modeloId: Id): VersionResumen[] {
  return [...(workspace.modelos.find((modelo) => modelo.id === modeloId)?.versiones ?? [])]
    .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
}

export async function restaurarVersion(versionIdOClave: Id): Promise<Modelo> {
  const storage = storageLocal();
  const key = versionIdOClave.startsWith(VERSION_KEY_PREFIX)
    ? versionIdOClave
    : buscarClaveVersion(storage, versionIdOClave);
  if (!key) throw new Error("Versión no encontrada");
  const payload = storage.getItem(key);
  if (!payload) throw new Error("Snapshot de versión no encontrado");
  const hidratado = hidratarModelo(payload);
  if (!hidratado.ok) throw new Error(hidratado.error);
  return hidratado.value;
}

export function eliminarVersion(
  workspace: WorkspaceIndice,
  modeloId: Id,
  versionId: Id,
): WorkspaceIndice {
  const modelo = workspace.modelos.find((item) => item.id === modeloId);
  const version = modelo?.versiones?.find((item) => item.id === versionId);
  if (version) storageLocal().removeItem(version.modeloPayloadKey);
  return {
    ...workspace,
    modelos: workspace.modelos.map((item) =>
      item.id === modeloId
        ? { ...item, versiones: (item.versiones ?? []).filter((v) => v.id !== versionId) }
        : item,
    ),
  };
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

function storageLocal(): Storage {
  if (typeof globalThis.localStorage === "undefined") {
    throw new Error("Storage local no disponible");
  }
  return globalThis.localStorage;
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
