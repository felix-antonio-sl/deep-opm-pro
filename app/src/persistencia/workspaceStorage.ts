import type { PreferenciasUiUsuario, Resultado } from "../modelo/tipos";
import type { MapaWorkspace, WorkspaceIndice } from "./workspace";
import { indiceVacio } from "./workspace";

export const WORKSPACE_INDEX_KEY = "deep-opm-pro:persistencia:workspace";
export const PREF_MOSTRAR_ARCHIVADOS_KEY = "deep-opm-pro:ui:mostrar-archivados";
export const PREF_MOSTRAR_VERSIONES_KEY = "deep-opm-pro:ui:mostrar-versiones";

export interface WorkspaceStoragePort {
  readLocalStorage(key: string): string | null;
  writeLocalStorage(key: string, value: string): void;
}

export function leerIndiceWorkspaceDesdeStorage(storage: WorkspaceStoragePort): WorkspaceIndice {
  try {
    const raw = storage.readLocalStorage(WORKSPACE_INDEX_KEY);
    if (!raw) return indiceVacio();
    const parsed = JSON.parse(raw);
    if (!esRecord(parsed)) return indiceVacio();
    return {
      modelos: Array.isArray(parsed.modelos) ? parsed.modelos.map(normalizarModeloIndice).filter((m): m is WorkspaceIndice["modelos"][number] => m !== null) : [],
      carpetas: Array.isArray(parsed.carpetas) ? parsed.carpetas.map(normalizarCarpetaIndice).filter((c): c is WorkspaceIndice["carpetas"][number] => c !== null) : [],
      recientes: Array.isArray(parsed.recientes) ? parsed.recientes.filter((r: unknown) => typeof r === "string") : [],
      ...(esPreferenciasUi(parsed.preferenciasUi) ? { preferenciasUi: parsed.preferenciasUi } : {}),
    };
  } catch {
    return indiceVacio();
  }
}

export function escribirIndiceWorkspaceEnStorage(storage: WorkspaceStoragePort, indice: WorkspaceIndice): Resultado<void> {
  try {
    storage.writeLocalStorage(WORKSPACE_INDEX_KEY, JSON.stringify(indice));
    return { ok: true, value: undefined };
  } catch {
    return { ok: false, error: "No se pudo escribir índice de workspace" };
  }
}

export function leerPreferenciaBooleanaDesdeStorage(storage: WorkspaceStoragePort, key: string, fallback: boolean): boolean {
  try {
    const raw = storage.readLocalStorage(key);
    if (raw === "true") return true;
    if (raw === "false") return false;
  } catch {
    // storage no disponible
  }
  return fallback;
}

export function escribirPreferenciaBooleanaEnStorage(storage: WorkspaceStoragePort, key: string, value: boolean): Resultado<void> {
  try {
    storage.writeLocalStorage(key, value ? "true" : "false");
    return { ok: true, value: undefined };
  } catch {
    return { ok: false, error: "No se pudo escribir preferencia local" };
  }
}

export function normalizarModeloIndice(value: unknown): WorkspaceIndice["modelos"][number] | null {
  if (!esRecord(value) || typeof value.id !== "string") return null;
  return {
    id: value.id,
    carpetaId: typeof value.carpetaId === "string" || value.carpetaId === null ? value.carpetaId : null,
    ...(typeof value.archivado === "boolean" ? { archivado: value.archivado } : {}),
    ...(typeof value.archivadoEn === "string" ? { archivadoEn: value.archivadoEn } : {}),
    ...(Array.isArray(value.versiones) ? { versiones: value.versiones as NonNullable<WorkspaceIndice["modelos"][number]["versiones"]> } : {}),
    ...(esMapaWorkspace(value.mapa) ? { mapa: value.mapa } : {}),
  };
}

export function normalizarCarpetaIndice(value: unknown): WorkspaceIndice["carpetas"][number] | null {
  if (!esRecord(value) || typeof value.id !== "string") return null;
  return {
    id: value.id,
    nombre: typeof value.nombre === "string" ? value.nombre : value.id,
    padreId: typeof value.padreId === "string" || value.padreId === null ? value.padreId : null,
    creadoEn: typeof value.creadoEn === "number" ? value.creadoEn : 0,
    ...(typeof value.archivada === "boolean" ? { archivada: value.archivada } : {}),
    ...(typeof value.archivadaEn === "string" ? { archivadaEn: value.archivadaEn } : {}),
  };
}

export function esMapaWorkspace(value: unknown): value is MapaWorkspace {
  if (!esRecord(value)) return false;
  if (value.zoom !== undefined && typeof value.zoom !== "number") return false;
  if (value.panX !== undefined && typeof value.panX !== "number") return false;
  if (value.panY !== undefined && typeof value.panY !== "number") return false;
  if (value.profundidadMaxima !== undefined && value.profundidadMaxima !== null && typeof value.profundidadMaxima !== "number") return false;
  if (value.subarbolRaizId !== undefined && value.subarbolRaizId !== null && typeof value.subarbolRaizId !== "string") return false;
  if (value.criterioResaltado !== undefined && !esCriterioResaltado(value.criterioResaltado)) return false;
  if (value.autoRefresh !== undefined && typeof value.autoRefresh !== "boolean") return false;
  return true;
}

export function esPreferenciasUi(value: unknown): value is PreferenciasUiUsuario {
  if (!esRecord(value)) return false;
  if (value.anchoPanelArbol !== undefined && typeof value.anchoPanelArbol !== "number") return false;
  if (value.anchoPanelInspector !== undefined && typeof value.anchoPanelInspector !== "number") return false;
  if (value.nombresArbolVisibles !== undefined && typeof value.nombresArbolVisibles !== "boolean") return false;
  if (value.cheatsheetVisible !== undefined && typeof value.cheatsheetVisible !== "boolean") return false;
  if (value.gridConfig !== undefined && !esRecord(value.gridConfig)) return false;
  return true;
}

function esCriterioResaltado(value: unknown): boolean {
  return value === "procesos" || value === "objetos" || value === "densidad" || value === "issues";
}

function esRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
