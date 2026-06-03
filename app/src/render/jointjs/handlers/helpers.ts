import type { dia } from "jointjs";
import { CANVAS_GEOMETRICO_BASE } from "../../../modelo/layout";
import type { OpmJointMetadata } from "../proyeccion";

/**
 * Helpers compartidos entre handlers JointCanvas: lectura de metadata OPM
 * desde cells, decoders de selector joint, normalizadores de eventos del paper.
 *
 * Refs: opm-extracted/src/app/configuration/rappidEnviromentFunctionality/
 *       selectionConfiguration.ts:5-65 (patrón disjunto por evento).
 */

export const CANVAS_BASE = CANVAS_GEOMETRICO_BASE;
export const CANVAS_PADDING = 1800;
export const ZOOM_MIN = 0.5;
export const ZOOM_MAX = 1.6;

export function metadata(cell: dia.Cell): OpmJointMetadata | null {
  const value = cell.prop("opm") as OpmJointMetadata | undefined;
  if (
    value?.kind === "entidad" ||
    value?.kind === "enlace" ||
    value?.kind === "imagen-overlay" ||
    value?.kind === "imagen-insignia"
  ) return value;
  return null;
}

export function parteEntidadDesdeSelector(meta: OpmJointMetadata, selector: string | null): string | null {
  if (meta.kind !== "entidad" || !selector) return null;
  return meta.partesPlegadas?.find((parte) => parte.selector === selector)?.entidadId ?? null;
}

export function estadoDesdeSelector(meta: OpmJointMetadata, selector: string | null): string | null {
  if (meta.kind !== "entidad" || !selector) return null;
  return meta.estadosInteractivos?.find((estado) => estado.selector === selector)?.estadoId ?? null;
}

export function cellViewModel(cellView: dia.CellView): dia.Cell {
  return (cellView as unknown as { model: dia.Cell }).model;
}

export function graphEvents(graph: dia.Graph): { on(eventName: string, callback: (cell: dia.Cell) => void): void } {
  return graph as unknown as { on(eventName: string, callback: (cell: dia.Cell) => void): void };
}

export function jointSelector(target: EventTarget | null): string | null {
  if (!(target instanceof Element)) return null;
  return target.closest("[joint-selector]")?.getAttribute("joint-selector") ?? null;
}

export function paperView(paper: dia.Paper): { remove(): void } {
  return paper as unknown as { remove(): void };
}

// dia.Paper hereda de Backbone Events (que sí expone `.off`) pero los tipos
// públicos de jointjs solo declaran `.on`. Wrapper para desinstalar listeners
// sin abrir un cast en cada handler.
export function paperOff(
  paper: dia.Paper,
  event: string,
  handler: (...args: never[]) => void,
): void {
  (paper as unknown as { off(event: string, handler: (...args: never[]) => void): void }).off(event, handler);
}

export function ctrlEvento(evt: dia.Event): boolean {
  const event = evt as unknown as MouseEvent;
  return event.ctrlKey || event.metaKey;
}

export function shiftEvento(evt: dia.Event): boolean {
  return (evt as unknown as MouseEvent).shiftKey;
}

export function multiEvento(evt: dia.Event): boolean {
  return ctrlEvento(evt) || shiftEvento(evt);
}

export function posicionCanvasDesdeEvento(paper: dia.Paper, evt: dia.Event): { x: number; y: number } {
  const event = evt as unknown as MouseEvent;
  const paperConApi = paper as unknown as {
    pageToLocalPoint?: (x: number, y: number) => { x: number; y: number };
    clientToLocalPoint?: (x: number, y: number) => { x: number; y: number };
  };
  if (typeof paperConApi.pageToLocalPoint === "function" && Number.isFinite(event.pageX) && Number.isFinite(event.pageY)) {
    return paperConApi.pageToLocalPoint(event.pageX, event.pageY);
  }
  if (typeof paperConApi.clientToLocalPoint === "function" && Number.isFinite(event.clientX) && Number.isFinite(event.clientY)) {
    return paperConApi.clientToLocalPoint(event.clientX, event.clientY);
  }
  return { x: 0, y: 0 };
}

export function setPaperDimensions(paper: dia.Paper, dimensiones: { width: number; height: number }): void {
  (paper as unknown as { setDimensions(width: number, height: number): void }).setDimensions(dimensiones.width, dimensiones.height);
  const element = (paper as unknown as { el: HTMLElement }).el;
  element.style.width = `${dimensiones.width}px`;
  element.style.height = `${dimensiones.height}px`;
}

// Canvas infinito: tras `paper.fitToContent({allowNewOrigin:'any'})` el origen
// del paper (translate) puede desplazarse cuando el contenido crece hacia
// arriba/izquierda. El pan del canvas principal es scroll DOM del viewport, así
// que para que el contenido NO salte en pantalla el scroll debe seguir ese
// desplazamiento: scroll += (translateDespues - translateAntes). Clamp a 0
// porque scrollLeft/scrollTop nunca son negativos.
export function calcularAjusteScroll(
  scrollAntes: { left: number; top: number },
  translateAntes: { tx: number; ty: number },
  translateDespues: { tx: number; ty: number },
): { left: number; top: number } {
  return {
    left: Math.max(0, scrollAntes.left + (translateDespues.tx - translateAntes.tx)),
    top: Math.max(0, scrollAntes.top + (translateDespues.ty - translateAntes.ty)),
  };
}

export interface AjustePaper {
  translateAntes: { tx: number; ty: number };
  translateDespues: { tx: number; ty: number };
}

interface PaperFitApi {
  translate(): { tx?: number; ty?: number };
  getContentArea?: (opt?: { useModelGeometry?: boolean }) => { width?: number; height?: number };
  fitToContent(opt: {
    allowNewOrigin?: "positive" | "negative" | "any";
    padding?: number;
    minWidth?: number;
    minHeight?: number;
    useModelGeometry?: boolean;
  }): unknown;
}

/**
 * Canvas infinito: ajusta el paper al bbox de su contenido con
 * `fitToContent({allowNewOrigin:'any'})` — crece/desplaza sus límites en
 * cualquier dirección (incluidas coordenadas negativas), reemplazando el piso
 * fijo + crecimiento solo +X/+Y. `minWidth/minHeight` (tamaño del viewport)
 * hacen que un OPD vacío parta a pantalla. fitToContent ya actualiza el tamaño
 * del host vía `setDimensions`; aquí devolvemos el translate (origen) antes y
 * después para que el caller compense el scroll del viewport y el contenido no
 * salte (ver `calcularAjusteScroll`).
 */
export function ajustarPaperAContenido(
  paper: dia.Paper,
  opts: { minWidth?: number; minHeight?: number; padding?: number } = {},
): AjustePaper {
  const api = paper as unknown as PaperFitApi;
  const t0 = api.translate();
  const translateAntes = { tx: t0.tx ?? 0, ty: t0.ty ?? 0 };
  // Sin contenido NO se añade aire: fitToContent suma el padding a las
  // dimensiones siempre (Paper.mjs), así que un padding generoso sobre un OPD
  // vacío produciría un paper de 2×padding en vez del viewport. Con contenido
  // vacío el padding es 0 → el paper cae a minWidth/minHeight (parte a pantalla).
  const area = api.getContentArea?.({ useModelGeometry: true });
  const hayContenido = !!area && (area.width ?? 0) > 0 && (area.height ?? 0) > 0;
  api.fitToContent({
    allowNewOrigin: "any",
    useModelGeometry: true,
    padding: hayContenido ? (opts.padding ?? CANVAS_PADDING) : 0,
    ...(opts.minWidth !== undefined ? { minWidth: opts.minWidth } : {}),
    ...(opts.minHeight !== undefined ? { minHeight: opts.minHeight } : {}),
  });
  const t1 = api.translate();
  const translateDespues = { tx: t1.tx ?? 0, ty: t1.ty ?? 0 };
  return { translateAntes, translateDespues };
}

/**
 * Bbox del contenido en coordenadas del paper (post translate+scale), o null si
 * no hay contenido. Coincide con el sistema de coordenadas del scroll DOM del
 * viewport, por lo que sirve para recentrar la vista en el contenido.
 */
export function contentBBoxPaper(
  paper: dia.Paper,
): { x: number; y: number; width: number; height: number } | null {
  const api = paper as unknown as {
    getContentBBox?: (opt?: { useModelGeometry?: boolean }) => { x: number; y: number; width: number; height: number } | null;
  };
  if (typeof api.getContentBBox !== "function") return null;
  try {
    const bbox = api.getContentBBox({ useModelGeometry: true });
    if (!bbox || !(bbox.width > 0) || !(bbox.height > 0)) return null;
    return bbox;
  } catch {
    return null;
  }
}

export type RefHolder<T> = { current: T };
