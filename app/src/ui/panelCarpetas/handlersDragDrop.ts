import type { Id } from "../../modelo/tipos";

export type DragWorkspacePayload = { tipo: "modelo" | "carpeta"; itemId: Id };
export type AccionDropCarpetas = "mover" | "copiar";

export const MIME_WORKSPACE = "application/x-deep-opm-workspace";

/**
 * Handlers HTML5 del panel de carpetas. PanelCarpetas los usa sin mover la
 * logica al store, manteniendo el componente prop-driven.
 */
export function iniciarDragWorkspace(event: DragEvent, payload: DragWorkspacePayload): void {
  event.dataTransfer?.setData(MIME_WORKSPACE, JSON.stringify(payload));
  if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
}

export function leerDragWorkspace(event: DragEvent): DragWorkspacePayload | null {
  const raw = event.dataTransfer?.getData(MIME_WORKSPACE);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { tipo?: string; itemId?: string };
    if ((parsed.tipo === "modelo" || parsed.tipo === "carpeta") && typeof parsed.itemId === "string") {
      return { tipo: parsed.tipo, itemId: parsed.itemId };
    }
  } catch {
    return null;
  }
  return null;
}

export function accionDropDesdeEvento(event: Pick<DragEvent, "ctrlKey" | "metaKey">): AccionDropCarpetas {
  return event.ctrlKey || event.metaKey ? "copiar" : "mover";
}

export function puedeAceptarDrop(
  payload: DragWorkspacePayload | null,
  carpetaDestinoId: Id | null,
): boolean {
  if (!payload) return false;
  return !(payload.tipo === "carpeta" && payload.itemId === carpetaDestinoId);
}
