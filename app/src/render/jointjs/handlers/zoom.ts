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
  viewport?: HTMLElement | null | undefined;
  paperRef: { current: dia.Paper | null | undefined };
}): () => void {
  const manejarWheel = (event: WheelEvent) => {
    if (!event.ctrlKey && !event.metaKey) return;
    const paper = args.paperRef.current;
    if (!paper) return;
    event.preventDefault();
    zoomCanvasEnCursor(paper, event, { viewport: args.viewport });
  };
  args.host.addEventListener("wheel", manejarWheel, { passive: false });
  return () => args.host.removeEventListener("wheel", manejarWheel);
}

export function cablearZoomFit(
  paperRef: { current: dia.Paper | null | undefined },
  viewportRef?: { current: HTMLElement | null | undefined },
): () => void {
  return registrarAtajo({
    combo: "Ctrl+0",
    ctx: "canvas",
    categoria: "vista",
    descripcion: "Ajustar OPD activo a pantalla",
    descripcionLarga: "Encuadra el OPD activo al área visible del canvas",
    handler: () => fitCanvasAPantalla(paperRef.current ?? undefined, viewportRef?.current),
  });
}

export function fitCanvasAPantalla(paper: dia.Paper | undefined, viewport?: HTMLElement | null): void {
  if (!paper) return;
  const paperConFit = paper as unknown as {
    transformToFitContent?: (options: {
      padding: number;
      minScale: number;
      maxScale: number;
      preserveAspectRatio: boolean;
      useModelGeometry: boolean;
      horizontalAlign: "left" | "middle" | "right";
      verticalAlign: "top" | "middle" | "bottom";
      fittingBBox?: { x: number; y: number; width: number; height: number };
    }) => void;
    scaleContentToFit?: (options: {
      padding: number;
      minScale: number;
      maxScale: number;
      preserveAspectRatio: boolean;
    }) => void;
  } | undefined;
  if (!paperConFit) return;
  const fittingBBox = viewport && viewport.clientWidth > 0 && viewport.clientHeight > 0
    ? {
        x: viewport.scrollLeft,
        y: viewport.scrollTop,
        width: viewport.clientWidth,
        height: viewport.clientHeight,
      }
    : undefined;
  if (typeof paperConFit.transformToFitContent === "function") {
    paperConFit.transformToFitContent({
      padding: 40,
      minScale: ZOOM_MIN,
      maxScale: ZOOM_MAX,
      preserveAspectRatio: true,
      useModelGeometry: true,
      horizontalAlign: "middle",
      verticalAlign: "middle",
      ...(fittingBBox ? { fittingBBox } : {}),
    });
    refrescarVisibilidadPaper(paper);
    return;
  }
  paperConFit.scaleContentToFit?.({
    padding: 40,
    minScale: ZOOM_MIN,
    maxScale: ZOOM_MAX,
    preserveAspectRatio: true,
  });
  refrescarVisibilidadPaper(paper);
}

export function zoomCanvasEnCursor(
  paper: dia.Paper,
  event: WheelEvent,
  opciones: { viewport?: HTMLElement | null | undefined } = {},
): void {
  const paperConZoom = paper as unknown as {
    model?: { getBBox?: () => { x: number; y: number; width: number; height: number } | null };
    scale(): { sx?: number; sy?: number };
    scale(sx: number, sy?: number): void;
    translate(): { tx?: number; ty?: number };
    translate(tx: number, ty: number): void;
    scaleUniformAtPoint?: (scale: number, point: { x: number; y: number }) => void;
    clientToLocalPoint?: (x: number, y: number) => { x: number; y: number };
    localToPaperPoint?: (point: { x: number; y: number }) => { x: number; y: number };
  };
  const escalaActual = paperConZoom.scale().sx ?? paperConZoom.scale().sy ?? 1;
  const siguiente = calcularSiguienteZoom(escalaActual, event);
  const punto = puntoAnclaZoom(paperConZoom, event, opciones.viewport);
  if (punto) {
    if (typeof paperConZoom.scaleUniformAtPoint === "function") {
      paperConZoom.scaleUniformAtPoint(siguiente, punto);
      refrescarVisibilidadPaper(paper);
      return;
    }
    const puntoPaperAntes = paperConZoom.localToPaperPoint?.(punto);
    paperConZoom.scale(siguiente, siguiente);
    const puntoPaperDespues = paperConZoom.localToPaperPoint?.(punto);
    if (puntoPaperAntes && puntoPaperDespues) {
      const translate = paperConZoom.translate();
      paperConZoom.translate(
        (translate.tx ?? 0) + puntoPaperAntes.x - puntoPaperDespues.x,
        (translate.ty ?? 0) + puntoPaperAntes.y - puntoPaperDespues.y,
      );
    }
    refrescarVisibilidadPaper(paper);
    return;
  }
  paperConZoom.scale(siguiente, siguiente);
  refrescarVisibilidadPaper(paper);
}

function puntoAnclaZoom(
  paper: {
    model?: { getBBox?: () => { x: number; y: number; width: number; height: number } | null };
    clientToLocalPoint?: (x: number, y: number) => { x: number; y: number };
  },
  event: WheelEvent,
  viewport?: HTMLElement | null | undefined,
): { x: number; y: number } | undefined {
  const target = typeof Element !== "undefined" && event.target instanceof Element ? event.target : null;
  const sobreCelda = Boolean(target?.closest(".joint-cell,[model-id]"));
  if (sobreCelda) return paper.clientToLocalPoint?.(event.clientX, event.clientY);

  const bbox = paper.model?.getBBox?.();
  if (bbox && bbox.width > 0 && bbox.height > 0) {
    return { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
  }

  if (viewport && viewport.clientWidth > 0 && viewport.clientHeight > 0) {
    const rect = viewport.getBoundingClientRect();
    return paper.clientToLocalPoint?.(rect.left + viewport.clientWidth / 2, rect.top + viewport.clientHeight / 2);
  }

  return paper.clientToLocalPoint?.(event.clientX, event.clientY);
}

export function calcularSiguienteZoom(escalaActual: number, event: Pick<WheelEvent, "deltaY" | "deltaMode">): number {
  const deltaPixeles = normalizarWheelDelta(event);
  const factor = limitarFactorZoom(Math.exp(-deltaPixeles * 0.00008));
  return limitarZoom(escalaActual * factor);
}

function normalizarWheelDelta(event: Pick<WheelEvent, "deltaY" | "deltaMode">): number {
  if (event.deltaMode === 1) return event.deltaY * 16;
  if (event.deltaMode === 2) return event.deltaY * 800;
  return event.deltaY;
}

function limitarFactorZoom(factor: number): number {
  return Math.max(0.995, Math.min(1.005, factor));
}

function limitarZoom(valor: number): number {
  return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, valor));
}

function refrescarVisibilidadPaper(paper: dia.Paper): void {
  const paperConRender = paper as unknown as {
    wakeUp?: () => void;
    checkViewport?: () => void;
  };
  paperConRender.wakeUp?.();
  paperConRender.checkViewport?.();
}
