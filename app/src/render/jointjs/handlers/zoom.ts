import type { dia } from "jointjs";
import { registrarAtajo } from "../../../ui/atajosTeclado";
import { ZOOM_MAX, ZOOM_MIN } from "./helpers";

/**
 * Handlers de zoom JointCanvas: Ctrl+rueda zoom-in-cursor y Ctrl+0 fit a pantalla.
 * El registry global atajosTeclado.ts maneja Ctrl+0; el wheel se cablea en el host.
 *
 * Refs: docs/HANDOFF.md §Decisiones Vigentes (atajos centralizados ronda 7).
 */

export function cablearZoomWheel(args: {
  host: HTMLElement;
  paperRef: { current: dia.Paper | null | undefined };
}): () => void {
  const manejarWheel = (event: WheelEvent) => {
    if (!event.ctrlKey && !event.metaKey) return;
    const paper = args.paperRef.current;
    if (!paper) return;
    event.preventDefault();
    zoomCanvasEnCursor(paper, event);
  };
  args.host.addEventListener("wheel", manejarWheel, { passive: false });
  return () => args.host.removeEventListener("wheel", manejarWheel);
}

export function cablearZoomFit(paperRef: { current: dia.Paper | null | undefined }): () => void {
  return registrarAtajo({
    combo: "Ctrl+0",
    ctx: "canvas",
    categoria: "vista",
    descripcion: "Ajustar OPD activo a pantalla",
    handler: () => fitCanvasAPantalla(paperRef.current ?? undefined),
  });
}

export function fitCanvasAPantalla(paper: dia.Paper | undefined): void {
  const paperConFit = paper as unknown as {
    scaleContentToFit?: (options: {
      padding: number;
      minScale: number;
      maxScale: number;
      preserveAspectRatio: boolean;
    }) => void;
  } | undefined;
  paperConFit?.scaleContentToFit?.({
    padding: 40,
    minScale: ZOOM_MIN,
    maxScale: ZOOM_MAX,
    preserveAspectRatio: true,
  });
}

export function zoomCanvasEnCursor(paper: dia.Paper, event: WheelEvent): void {
  const paperConZoom = paper as unknown as {
    scale(): { sx?: number; sy?: number };
    scale(sx: number, sy: number, ox?: number, oy?: number): void;
    clientToLocalPoint?: (x: number, y: number) => { x: number; y: number };
  };
  const escalaActual = paperConZoom.scale().sx ?? paperConZoom.scale().sy ?? 1;
  const siguiente = limitarZoom(escalaActual * (event.deltaY < 0 ? 1.1 : 0.9));
  const punto = paperConZoom.clientToLocalPoint?.(event.clientX, event.clientY);
  if (punto) {
    paperConZoom.scale(siguiente, siguiente, punto.x, punto.y);
    return;
  }
  paperConZoom.scale(siguiente, siguiente);
}

function limitarZoom(valor: number): number {
  return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, valor));
}
