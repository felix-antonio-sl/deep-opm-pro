import { CANON } from "../../../modelo/constantes";
import { formatearNombreCompuesto } from "../../../modelo/objetoMetadata";
import { estadosDeEntidad } from "../../../modelo/operaciones";
import { modoPlegadoApariencia } from "../../../modelo/plegado";
import type { Apariencia, Entidad, Estado, Id, Modelo, Posicion } from "../../../modelo/tipos";

/**
 * Composer de estados embebidos: dimensiones, capsulas y puntos de anclaje
 * para estados OPM contenidos por objetos. Consumidores: entidad y enlace.
 */
export function dimensionesConEstados(apariencia: Apariencia, nombre: string, estados: Estado[], layout: Entidad["layoutEstados"]): { width: number; height: number } {
  const capsulas = estados.map((estado) => anchoCapsulaEstado(estado.nombre));
  const vertical = layout === "vertical";
  const anchoEstados = vertical
    ? Math.max(...capsulas, ESTADOS.minWidth)
    : capsulas.reduce((total, ancho) => total + ancho, 0) + Math.max(0, capsulas.length - 1) * ESTADOS.gap;
  const altoEstados = vertical
    ? estados.length * ESTADOS.capsuleHeight + Math.max(0, estados.length - 1) * ESTADOS.gap
    : ESTADOS.regionHeight;
  const width = Math.max(apariencia.width, CANON.dims.cosaWidth, nombre.length * 7 + 24, anchoEstados + ESTADOS.paddingX * 2);
  const height = Math.max(apariencia.height, CANON.dims.cosaHeight + altoEstados + ESTADOS.paddingBottom);
  return { width, height };
}

export function anchoCapsulaEstado(nombre: string): number {
  return Math.max(ESTADOS.minWidth, nombre.length * 7 + ESTADOS.paddingHorizontal * 2);
}

interface EndpointVisual {
  apariencia: Apariencia;
  proxy?: { entidadId: Id; nombre: string };
  punto?: Posicion;
}

export interface RectCapsulaEstado {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function rectCapsulaEstado(modelo: Modelo, apariencia: Apariencia, estadoId: Id): RectCapsulaEstado | null {
  const estado = modelo.estados[estadoId];
  const entidad = estado ? modelo.entidades[estado.entidadId] : undefined;
  if (!estado || !entidad) return null;
  if (modoPlegadoApariencia(apariencia) === "parcial") return null;
  const estados = estadosDeEntidad(modelo, entidad.id).filter((item) => !item.suprimido);
  const index = estados.findIndex((item) => item.id === estadoId);
  if (index < 0) return null;
  const size = dimensionesConEstados(apariencia, formatearNombreCompuesto(entidad), estados, entidad.layoutEstados);
  const anchos = estados.map((item) => anchoCapsulaEstado(item.nombre));
  const vertical = entidad.layoutEstados === "vertical";
  const anchoActual = anchos[index] ?? ESTADOS.minWidth;
  const anchoTotal = vertical
    ? anchoActual
    : anchos.reduce((total, ancho) => total + ancho, 0) + Math.max(0, anchos.length - 1) * ESTADOS.gap;
  const xInicial = (size.width - anchoTotal) / 2;
  const x = vertical
    ? xInicial
    : xInicial + anchos.slice(0, index).reduce((total, ancho) => total + ancho + ESTADOS.gap, 0);
  const altoTotal = vertical
    ? estados.length * ESTADOS.capsuleHeight + Math.max(0, estados.length - 1) * ESTADOS.gap
    : ESTADOS.capsuleHeight;
  const yBase = size.height - ESTADOS.paddingBottom - altoTotal;
  const y = vertical
    ? yBase + index * (ESTADOS.capsuleHeight + ESTADOS.gap)
    : yBase;
  return {
    x: apariencia.x + x,
    y: apariencia.y + y,
    width: anchoActual,
    height: ESTADOS.capsuleHeight,
  };
}

export function puntoCapsulaEstado(modelo: Modelo, apariencia: Apariencia, estadoId: Id): Posicion | null {
  const rect = rectCapsulaEstado(modelo, apariencia, estadoId);
  if (!rect) return null;
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

/**
 * BUG-1fc4d2: el extremo de un enlace que apunta a un estado debe resolverse
 * como sub-selector del cell padre (no como punto literal {x,y}). El selector
 * `stateCapsuleN` matchea con el sub-rect montado por composers/entidad.ts
 * (markupConEstados/attrsConEstados). Devolver `null` cuando el estado no es
 * visible en la apariencia (modo plegado parcial, suprimido, no encontrado)
 * para que el caller fallback al endpoint del cell padre por id.
 */
export function selectorCapsulaEstado(
  modelo: Modelo,
  apariencia: Apariencia,
  estadoId: Id,
): { selector: string } | null {
  const estado = modelo.estados[estadoId];
  const entidad = estado ? modelo.entidades[estado.entidadId] : undefined;
  if (!estado || !entidad) return null;
  if (modoPlegadoApariencia(apariencia) === "parcial") return null;
  const estados = estadosDeEntidad(modelo, entidad.id).filter((item) => !item.suprimido);
  const index = estados.findIndex((item) => item.id === estadoId);
  if (index < 0) return null;
  return { selector: `stateCapsule${index}` };
}

export const ESTADOS = {
  capsuleHeight: 24,
  minWidth: 52,
  paddingHorizontal: 6,
  paddingX: 8,
  paddingBottom: 6,
  gap: 4,
  radius: 8,
  fontSize: 13,
  regionHeight: 34,
} as const;
