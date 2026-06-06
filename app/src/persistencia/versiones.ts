import type { Id, Modelo, Resultado, VersionResumen } from "../modelo/tipos";
import { exportarModelo } from "../serializacion/json";
import { compactarJsonDocumento } from "./compactacion";
import type { WorkspaceIndice } from "./workspace";
export { aplicarPoliticaLogScaleVersiones, idsVersionesPodadas } from "./politicaVersiones";

export type CodigoErrorVersion =
  | "version_no_encontrada"
  | "snapshot_no_encontrado"
  | "snapshot_corrupto";

export interface ErrorVersion {
  codigo: CodigoErrorVersion;
  mensaje: string;
  detalle?: string;
}

export type ResultadoVersion<T> = Resultado<T, ErrorVersion>;

export interface VersionPersistible {
  version: VersionResumen;
  json: string;
}

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
  const persistible = construirVersionPersistible(modelo, opts);
  return okVersion(persistible.version);
}

export function construirVersionPersistible(
  modelo: Modelo,
  opts: { nombre?: string; descripcion?: string; preservar?: boolean; ahora?: string } = {},
): VersionPersistible {
  const versionId = generarId();
  const creadoEn = opts.ahora ?? new Date().toISOString();
  const payload = compactarJsonDocumento(exportarModelo(modelo));
  return {
    version: {
      id: versionId,
      creadoEn,
      nombre: opts.nombre?.trim() || `Snapshot ${formatearFechaCorta(creadoEn)}`,
      ...(opts.descripcion?.trim() ? { descripcion: opts.descripcion.trim() } : {}),
      ...(opts.preservar ? { preservar: true } : {}),
      modeloPayloadKey: versionId,
      bytes: payload.length,
    },
    json: payload,
  };
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
  void versionIdOClave;
  return falloVersion("version_no_encontrada", "Versión no disponible sin backend");
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
  if (!modelo) return falloVersion("version_no_encontrada", "Versión no encontrada");
  return okVersion({
    ...workspace,
    modelos: workspace.modelos.map((item) =>
      item.id === modeloId
        ? { ...item, versiones: (item.versiones ?? []).filter((v) => v.id !== versionId) }
        : item,
    ),
  });
}

export function filtrarVersionesVisibles(versiones: VersionResumen[], mostrarVersiones: boolean): VersionResumen[] {
  if (!mostrarVersiones) return [];
  return [...versiones].sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
}

function generarId(): Id {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `version-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
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
