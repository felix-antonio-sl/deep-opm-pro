import type { dia } from "jointjs";
import type { OpmJointMetadata } from "../proyeccion";

/**
 * Helpers compartidos entre handlers JointCanvas: lectura de metadata OPM
 * desde cells, decoders de selector joint, normalizadores de eventos del paper.
 *
 * Refs: opm-extracted/src/app/configuration/rappidEnviromentFunctionality/
 *       selectionConfiguration.ts:5-65 (patrón disjunto por evento).
 */

export const CANVAS_BASE = { width: 1800, height: 1200 } as const;
export const CANVAS_PADDING = 240;
export const ZOOM_MIN = 0.25;
export const ZOOM_MAX = 2;

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

export function dimensionesPaper(cells: dia.Cell.JSON[]): { width: number; height: number } {
  let maxX: number = CANVAS_BASE.width;
  let maxY: number = CANVAS_BASE.height;
  for (const cell of cells) {
    const position = cell.position as { x?: number; y?: number } | undefined;
    const size = cell.size as { width?: number; height?: number } | undefined;
    if (!position) continue;
    maxX = Math.max(maxX, (position.x ?? 0) + (size?.width ?? 0) + CANVAS_PADDING);
    maxY = Math.max(maxY, (position.y ?? 0) + (size?.height ?? 0) + CANVAS_PADDING);
  }
  return { width: Math.ceil(maxX), height: Math.ceil(maxY) };
}

export type RefHolder<T> = { current: T };
