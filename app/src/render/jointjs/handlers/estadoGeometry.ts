import type { dia } from "jointjs";
import { ANCLAS_RELOJ_ENLACE, puertoRelativoAnclaEnlace, type AnclaRelojEnlace } from "../../../modelo/anclajesEnlace";
import { ESTADOS } from "../composers/estados";

export type ResizeHandleEstado = "nw" | "ne" | "se" | "sw";

export interface RectEstado {
  x: number;
  y: number;
  width: number;
  height: number;
}

const MIN_GESTO_ESTADO = 3;
const MARGEN_TOP_ESTADO = 6;

export function selectorCapsulaDesdeSelector(selector: string | null): string | null {
  if (!selector) return null;
  const match = /^(stateCapsule|stateLabel|stateFinalInner|stateDefaultMarker|stateCurrentMarker)(\d+)$/.exec(selector);
  return match ? `stateCapsule${match[2]}` : null;
}

export function indiceEstadoDesdeSelector(selectorCapsula: string): number {
  return Number.parseInt(selectorCapsula.replace("stateCapsule", ""), 10);
}

export function rectSelectorEstado(element: dia.Element, selector: string): RectEstado {
  const attrs = (element.attr(selector) as { x?: number; y?: number; width?: number; height?: number } | undefined) ?? {};
  return {
    x: Number.isFinite(attrs.x) ? Number(attrs.x) : 0,
    y: Number.isFinite(attrs.y) ? Number(attrs.y) : 0,
    width: Number.isFinite(attrs.width) ? Number(attrs.width) : ESTADOS.minWidth,
    height: Number.isFinite(attrs.height) ? Number(attrs.height) : ESTADOS.capsuleHeight,
  };
}

export function gestoEstadoSuperaUmbral(inicio: { x: number; y: number }, actual: { x: number; y: number }): boolean {
  return Math.abs(actual.x - inicio.x) >= MIN_GESTO_ESTADO || Math.abs(actual.y - inicio.y) >= MIN_GESTO_ESTADO;
}

export function limitarRectEstadoAElemento(element: dia.Element, rect: RectEstado): RectEstado {
  return limitarRectEstado(rect, element.size());
}

export function limitarRectEstado(rect: RectEstado, size: { width: number; height: number }): RectEstado {
  const minX = ESTADOS.paddingX;
  const minY = MARGEN_TOP_ESTADO;
  const maxWidth = Math.max(ESTADOS.minWidth, size.width - ESTADOS.paddingX * 2);
  const maxHeight = Math.max(ESTADOS.capsuleHeight, size.height - MARGEN_TOP_ESTADO - ESTADOS.paddingBottom);
  const width = Math.round(clamp(rect.width, ESTADOS.minWidth, maxWidth));
  const height = Math.round(clamp(rect.height, ESTADOS.capsuleHeight, maxHeight));
  const maxX = Math.max(minX, size.width - ESTADOS.paddingX - width);
  const maxY = Math.max(minY, size.height - ESTADOS.paddingBottom - height);
  return {
    x: Math.round(clamp(rect.x, minX, maxX)),
    y: Math.round(clamp(rect.y, minY, maxY)),
    width,
    height,
  };
}

export function aplicarRectEstadoLive(element: dia.Element, index: number, rect: RectEstado): void {
  const prevCapsule = (element.attr(`stateCapsule${index}`) as Record<string, unknown> | undefined) ?? {};
  element.attr(`stateCapsule${index}`, { ...prevCapsule, ...rect });
  const prevFinal = (element.attr(`stateFinalInner${index}`) as Record<string, unknown> | undefined) ?? {};
  element.attr(`stateFinalInner${index}`, {
    ...prevFinal,
    x: rect.x + 3,
    y: rect.y + 3,
    width: Math.max(0, rect.width - 6),
    height: Math.max(0, rect.height - 6),
  });
  const prevLabel = (element.attr(`stateLabel${index}`) as Record<string, unknown> | undefined) ?? {};
  element.attr(`stateLabel${index}`, { ...prevLabel, x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 });
  const prevDefault = (element.attr(`stateDefaultMarker${index}`) as Record<string, unknown> | undefined) ?? {};
  element.attr(`stateDefaultMarker${index}`, { ...prevDefault, x: rect.x + rect.width - 10, y: rect.y + 7 });
  const prevCurrent = (element.attr(`stateCurrentMarker${index}`) as Record<string, unknown> | undefined) ?? {};
  element.attr(`stateCurrentMarker${index}`, { ...prevCurrent, x: rect.x + 10, y: rect.y + 7 });

  for (const anchor of ANCLAS_RELOJ_ENLACE) {
    const selector = `connect-anchor-${anchor.toLowerCase()}-state${index}`;
    const prev = (element.attr(selector) as Record<string, unknown> | undefined) ?? {};
    element.attr(selector, { ...prev, ...puntoAnchorEstado(rect, anchor) });
  }
  for (const handle of ["nw", "ne", "se", "sw"] as const) {
    const selector = `resize-state${index}-${handle}`;
    const prev = element.attr(selector) as Record<string, unknown> | undefined;
    if (!prev) continue;
    element.attr(selector, { ...prev, ...puntoHandleEstado(rect, handle) });
  }
}

export function marcarDragEstado(element: dia.Element, selectorCapsula: string, activo: boolean): void {
  const previo = (element.attr(selectorCapsula) as Record<string, unknown> | undefined) ?? {};
  element.attr(selectorCapsula, { ...previo, "data-dragging": activo ? "true" : undefined });
}

export function marcarGestoEstadoActivo(paper: dia.Paper, activo: boolean): void {
  const el = (paper as unknown as { el: HTMLElement }).el;
  if (activo) el.setAttribute("data-opm-state-gesture", "true");
  else el.removeAttribute("data-opm-state-gesture");
}

export function puntoHandleEstado(rect: RectEstado, handle: ResizeHandleEstado): { x: number; y: number } {
  const cx = handle.includes("w") ? rect.x : rect.x + rect.width;
  const cy = handle.includes("n") ? rect.y : rect.y + rect.height;
  return { x: cx - 4, y: cy - 4 };
}

function puntoAnchorEstado(rect: RectEstado, anchor: AnclaRelojEnlace): { cx: number; cy: number } {
  const rel = puertoRelativoAnclaEnlace(anchor);
  return {
    cx: rect.x + rel.x * rect.width,
    cy: rect.y + rel.y * rect.height,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
