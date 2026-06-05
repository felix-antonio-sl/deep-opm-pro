import { CANON } from "../../../modelo/constantes";
import { nombreCanonicoEstado } from "../../../modelo/nombresCanonicos";
import { formatearNombreCompuesto } from "../../../modelo/objetoMetadata";
import { estadosDeEntidad } from "../../../modelo/operaciones";
import { modoPlegadoApariencia } from "../../../modelo/plegado";
import { estadoVisibleEnAparicion } from "../../../modelo/visibilidadEstados";
import type { Apariencia, Entidad, Estado, Id, Modelo, Posicion } from "../../../modelo/tipos";

/**
 * Composer de estados embebidos: dimensiones, capsulas y puntos de anclaje
 * para estados OPM contenidos por objetos. Consumidores: entidad y enlace.
 */
export function dimensionesConEstados(apariencia: Apariencia, nombre: string, estados: Estado[], layout: Entidad["layoutEstados"]): { width: number; height: number } {
  // Pasa el Estado completo (no solo el nombre) para que la compensacion de
  // designacion inicial/final participe del calculo (BUG-7ae086).
  const capsulas = estados.map((estado) => anchoCapsulaEstado(estadoRenderCanonico(estado)));
  const altos = estados.map(altoCapsulaEstado);
  const vertical = layout === "vertical";
  const anchoEstados = vertical
    ? Math.max(...capsulas, ESTADOS.minWidth)
    : capsulas.reduce((total, ancho) => total + ancho, 0) + Math.max(0, capsulas.length - 1) * ESTADOS.gap;
  const altoEstados = vertical
    ? altos.reduce((total, alto) => total + alto, 0) + Math.max(0, altos.length - 1) * ESTADOS.gap
    : Math.max(ESTADOS.regionHeight, Math.max(...altos, ESTADOS.capsuleHeight) + ESTADOS.paddingBottom + 4);
  const boundsManuales = boundsEstadosManuales(estados);
  const width = Math.max(
    apariencia.width,
    CANON.dims.cosaWidth,
    nombre.length * 7 + 24,
    anchoEstados + ESTADOS.paddingX * 2,
    boundsManuales.width,
  );
  const height = Math.max(apariencia.height, CANON.dims.cosaHeight + altoEstados + ESTADOS.paddingBottom, boundsManuales.height);
  return { width, height };
}

export function anchoCapsulaEstado(estado: Estado | string): number {
  const nombre = typeof estado === "string" ? estado : estado.nombre;
  const manual = typeof estado === "string" ? undefined : estado.width;
  // BUG-7ae086: 8 px/char (alineado a entidad.ts) — 7 subestimaba la serif italica y
  // recortaba la ultima letra en nombres largos. La designacion inicial/final agrega
  // stroke (3px inicial / doble contorno final) que consume interior de la capsula.
  const designada = typeof estado !== "string" && (estado.esInicial || estado.esFinal || (estado.designaciones ?? []).length > 0);
  const margenDesignacion = designada ? 6 : 0;
  return Math.max(ESTADOS.minWidth, manual ?? 0, nombre.length * 8 + ESTADOS.paddingHorizontal * 2 + margenDesignacion);
}

export function altoCapsulaEstado(estado: Estado): number {
  return Math.max(ESTADOS.capsuleHeight, estado.height ?? 0);
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
  // Predicado efectivo por aparición (SELLO 2): el índice de cápsula DEBE
  // calcularse sobre el mismo conjunto visible que renderiza entidad.ts
  // (visibles = ¬global ∧ ¬local), o los selectores stateCapsuleN se desalinean.
  const estados = estadosDeEntidad(modelo, entidad.id).filter((item) => estadoVisibleEnAparicion(item, apariencia));
  const index = estados.findIndex((item) => item.id === estadoId);
  if (index < 0) return null;
  const size = dimensionesConEstados(apariencia, formatearNombreCompuesto(entidad), estados, entidad.layoutEstados);
  const rect = rectCapsulaEstadoLocal(size, estados, entidad.layoutEstados, index);
  if (!rect) return null;
  return {
    x: apariencia.x + rect.x,
    y: apariencia.y + rect.y,
    width: rect.width,
    height: rect.height,
  };
}

export function rectCapsulaEstadoLocal(
  size: { width: number; height: number },
  estados: Estado[],
  layout: Entidad["layoutEstados"],
  index: number,
): RectCapsulaEstado | null {
  const estado = estados[index];
  if (!estado) return null;
  const anchos = estados.map((item) => anchoCapsulaEstado(estadoRenderCanonico(item)));
  const altos = estados.map(altoCapsulaEstado);
  const vertical = layout === "vertical";
  const anchoActual = anchos[index] ?? ESTADOS.minWidth;
  const altoActual = altos[index] ?? ESTADOS.capsuleHeight;
  const anchoTotal = vertical
    ? anchoActual
    : anchos.reduce((total, ancho) => total + ancho, 0) + Math.max(0, anchos.length - 1) * ESTADOS.gap;
  const xInicial = (size.width - anchoTotal) / 2;
  const x = vertical
    ? xInicial
    : xInicial + anchos.slice(0, index).reduce((total, ancho) => total + ancho + ESTADOS.gap, 0);
  const altoTotal = vertical
    ? altos.reduce((total, alto) => total + alto, 0) + Math.max(0, altos.length - 1) * ESTADOS.gap
    : Math.max(...altos, ESTADOS.capsuleHeight);
  const yBase = size.height - ESTADOS.paddingBottom - altoTotal;
  const y = vertical
    ? yBase + altos.slice(0, index).reduce((total, alto) => total + alto + ESTADOS.gap, 0)
    : yBase;
  return {
    x: typeof estado.x === "number" && Number.isFinite(estado.x) ? estado.x : x,
    y: typeof estado.y === "number" && Number.isFinite(estado.y) ? estado.y : y,
    width: anchoActual,
    height: altoActual,
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
  const estados = estadosDeEntidad(modelo, entidad.id).filter((item) => estadoVisibleEnAparicion(item, apariencia));
  const index = estados.findIndex((item) => item.id === estadoId);
  if (index < 0) return null;
  return { selector: `stateCapsule${index}` };
}

function estadoRenderCanonico(estado: Estado): Estado {
  return { ...estado, nombre: nombreCanonicoEstado(estado) };
}

function boundsEstadosManuales(estados: Estado[]): { width: number; height: number } {
  let width = 0;
  let height = 0;
  for (const estado of estados) {
    const capsuleWidth = anchoCapsulaEstado(estadoRenderCanonico(estado));
    const capsuleHeight = altoCapsulaEstado(estado);
    if (typeof estado.x === "number" && Number.isFinite(estado.x)) {
      width = Math.max(width, estado.x + capsuleWidth + ESTADOS.paddingX);
    }
    if (typeof estado.y === "number" && Number.isFinite(estado.y)) {
      height = Math.max(height, estado.y + capsuleHeight + ESTADOS.paddingBottom);
    }
  }
  return { width, height };
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
