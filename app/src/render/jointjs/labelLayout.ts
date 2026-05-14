import type { Apariencia, PosicionLabelEnlace } from "../../modelo/tipos";

export const LABEL_KEY_ETIQUETA = "etiqueta";
export const LABEL_KEY_RUTA = "ruta";
export const LABEL_KEY_MULTIPLICIDAD_ORIGEN = "multiplicidad:origen";
export const LABEL_KEY_MULTIPLICIDAD_DESTINO = "multiplicidad:destino";
export const LABEL_KEY_MODIFICADOR = "modificador";
export const LABEL_KEY_PROBABILIDAD = "probabilidad";
export const LABEL_KEY_DEMORA = "demora";
export const LABEL_KEY_TASA = "tasa";
export const LABEL_KEY_TIEMPO_MINIMO = "tiempo:minimo";
export const LABEL_KEY_TIEMPO_MAXIMO = "tiempo:maximo";
export const LABEL_KEY_REQUISITOS = "requisitos";
export const LABEL_KEY_BACKWARD_TAG = "backwardTag";
export const LABEL_KEY_PROXY_ORIGEN = "proxy:origen";
export const LABEL_KEY_PROXY_DESTINO = "proxy:destino";
export const LABEL_KEY_ORDEN = "orden";

const LABEL_KEY_FIELD = "opmLabelKey";
const LABEL_KEY_ATTR = "data-opm-label-key";
const FONT_SIZE_LABEL = 12;
const MARGEN_LABEL_SHAPES = 20;
const WRAP_MIN = 40;
const WRAP_MAX = 260;

export type LayoutLabelsEnlace = Record<string, PosicionLabelEnlace> | undefined;

export function aplicarLayoutLabel(
  label: Record<string, unknown>,
  key: string,
  positions?: LayoutLabelsEnlace,
): Record<string, unknown> {
  const attrs = (label.attrs as Record<string, unknown> | undefined) ?? {};
  const labelAttrs = (attrs.label as Record<string, unknown> | undefined) ?? {};
  const posicionPersistida = positions?.[key];
  const position = (label.position as Record<string, unknown> | undefined) ?? {};
  return {
    ...label,
    [LABEL_KEY_FIELD]: key,
    attrs: {
      ...attrs,
      label: {
        ...labelAttrs,
        [LABEL_KEY_ATTR]: key,
        pointerEvents: "visiblePainted",
      },
    },
    position: posicionPersistida
      ? {
          ...position,
          distance: posicionPersistida.distance,
          ...(posicionPersistida.offset !== undefined ? { offset: posicionPersistida.offset } : {}),
          ...(posicionPersistida.angle !== undefined ? { angle: posicionPersistida.angle } : {}),
        }
      : position,
  };
}

export function labelKeyDesdeJoint(label: unknown): string | null {
  if (!label || typeof label !== "object") return null;
  const item = label as Record<string, unknown>;
  if (typeof item[LABEL_KEY_FIELD] === "string") return item[LABEL_KEY_FIELD];
  const attrs = item.attrs as Record<string, unknown> | undefined;
  const labelAttrs = attrs?.label as Record<string, unknown> | undefined;
  return typeof labelAttrs?.[LABEL_KEY_ATTR] === "string" ? labelAttrs[LABEL_KEY_ATTR] : null;
}

export function posicionLabelDesdeJoint(label: unknown): PosicionLabelEnlace | null {
  if (!label || typeof label !== "object") return null;
  const position = (label as Record<string, unknown>).position;
  if (typeof position === "number") return Number.isFinite(position) ? { distance: position } : null;
  if (!position || typeof position !== "object") return null;
  const pos = position as Record<string, unknown>;
  if (typeof pos.distance !== "number" || !Number.isFinite(pos.distance)) return null;
  const offset = offsetDesdeJoint(pos.offset);
  if (pos.offset !== undefined && offset === null) return null;
  const angle = typeof pos.angle === "number" && Number.isFinite(pos.angle) ? pos.angle : undefined;
  return {
    distance: pos.distance,
    ...(offset !== undefined && offset !== null ? { offset } : {}),
    ...(angle !== undefined ? { angle } : {}),
  };
}

export function anchoWrapEntreApariencias(text: string, origen: Apariencia, destino: Apariencia, fallback = 132): number {
  if (text.trim().length === 0) return fallback;
  const visible = largoSegmentoVisible(origen, destino);
  if (!Number.isFinite(visible) || visible <= 0) return fallback;
  const inner = Math.max(WRAP_MIN, visible - MARGEN_LABEL_SHAPES * 2);
  const estimado = estimarAnchoTexto(text);
  return Math.round(Math.max(WRAP_MIN, Math.min(WRAP_MAX, inner, estimado)));
}

function offsetDesdeJoint(offset: unknown): PosicionLabelEnlace["offset"] | null | undefined {
  if (offset === undefined) return undefined;
  if (typeof offset === "number") return Number.isFinite(offset) ? offset : null;
  if (!offset || typeof offset !== "object") return null;
  const value = offset as Record<string, unknown>;
  if (typeof value.x !== "number" || typeof value.y !== "number") return null;
  if (!Number.isFinite(value.x) || !Number.isFinite(value.y)) return null;
  return { x: value.x, y: value.y };
}

function largoSegmentoVisible(origen: Apariencia, destino: Apariencia): number {
  const centroOrigen = centro(origen);
  const centroDestino = centro(destino);
  const salidaOrigen = interseccionRect(centroDestino, centroOrigen, origen);
  const entradaDestino = interseccionRect(centroOrigen, centroDestino, destino);
  if (!salidaOrigen || !entradaDestino) return distancia(centroOrigen, centroDestino);
  return distancia(salidaOrigen, entradaDestino);
}

function centro(apariencia: Apariencia): { x: number; y: number } {
  return {
    x: apariencia.x + apariencia.width / 2,
    y: apariencia.y + apariencia.height / 2,
  };
}

function interseccionRect(
  desde: { x: number; y: number },
  hacia: { x: number; y: number },
  rect: Apariencia,
): { x: number; y: number } | null {
  const edges = [
    [{ x: rect.x, y: rect.y }, { x: rect.x + rect.width, y: rect.y }],
    [{ x: rect.x, y: rect.y + rect.height }, { x: rect.x + rect.width, y: rect.y + rect.height }],
    [{ x: rect.x, y: rect.y }, { x: rect.x, y: rect.y + rect.height }],
    [{ x: rect.x + rect.width, y: rect.y }, { x: rect.x + rect.width, y: rect.y + rect.height }],
  ] as const;
  let mejor: { punto: { x: number; y: number }; d: number } | null = null;
  for (const [a, b] of edges) {
    const punto = interseccionSegmentos(desde, hacia, a, b);
    if (!punto) continue;
    const d = distancia(punto, hacia);
    if (!mejor || d < mejor.d) mejor = { punto, d };
  }
  return mejor?.punto ?? null;
}

function interseccionSegmentos(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  p4: { x: number; y: number },
): { x: number; y: number } | null {
  const denom = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  if (denom === 0) return null;
  const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / denom;
  const u = -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / denom;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return {
    x: p1.x + t * (p2.x - p1.x),
    y: p1.y + t * (p2.y - p1.y),
  };
}

function distancia(a: { x: number; y: number }, b: { x: number; y: number }): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function estimarAnchoTexto(text: string): number {
  return Math.max(WRAP_MIN, text.trim().length * FONT_SIZE_LABEL * 0.62);
}
