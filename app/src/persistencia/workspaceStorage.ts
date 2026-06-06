import type { PreferenciasUiUsuario } from "../modelo/tipos";
import type { MapaWorkspace, WorkspaceIndice } from "./workspace";
import { indiceVacio } from "./workspace";

export function normalizarWorkspaceIndice(value: unknown): WorkspaceIndice {
  if (!esRecord(value)) return indiceVacio();
  return {
    modelos: Array.isArray(value.modelos)
      ? value.modelos.map(normalizarModeloIndice).filter((m): m is WorkspaceIndice["modelos"][number] => m !== null)
      : [],
    carpetas: Array.isArray(value.carpetas)
      ? value.carpetas.map(normalizarCarpetaIndice).filter((c): c is WorkspaceIndice["carpetas"][number] => c !== null)
      : [],
    recientes: Array.isArray(value.recientes) ? value.recientes.filter((r: unknown): r is string => typeof r === "string") : [],
    ...(esPreferenciasUi(value.preferenciasUi) ? { preferenciasUi: value.preferenciasUi } : {}),
  };
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
