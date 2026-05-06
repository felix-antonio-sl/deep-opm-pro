import type { Id } from "../../../modelo/tipos";

/**
 * Tipos del descriptor del meta-grafo del mapa del sistema + constantes
 * de layout + helpers genéricos de manipulación del descriptor.
 *
 * Refs: HU-21.* mapa del sistema.
 */

export interface NodoMapa {
  opdId: Id;
  nombre: string;
  tipoRefinamiento: "descompuesto" | "desplegado" | "raiz";
  bbox: { x: number; y: number; w: number; h: number };
  profundidad: number;
  thumbnailEntidades: number;
  thumbnailEnlaces: number;
  thumbnailProcesos: number;
  thumbnailObjetos: number;
  thumbnailEstados: number;
  estiloResaltado?: EstiloResaltadoMapa;
  marcadorActivo?: boolean;
  marcadorVisitado?: boolean;
}

export interface AristaMapa {
  desdeOpdId: Id;
  haciaOpdId: Id;
}

export interface DescriptorMapa {
  nodos: NodoMapa[];
  aristas: AristaMapa[];
  bboxTotal: { w: number; h: number };
}

export type EstiloResaltadoMapa = "verde-lima" | "cyan" | "gris" | "azul" | "naranja";

export type CriterioResaltado =
  | "predominanciaProceso"
  | "predominanciaObjeto"
  | "tieneEstados"
  | "raiz"
  | "ninguno";

export interface EstadisticasModelo {
  totalEntidades: number;
  totalEnlaces: number;
  totalOpds: number;
  profundidadMaxima: number;
  totalRamas: number;
  porTipoCosa: { proceso: number; objeto: number; estados: number };
  porFamiliaEnlace: {
    agregacion: number;
    etiquetado: number;
    procedural: number;
    logico: number;
  };
}

export interface JointCellJson {
  id: string;
  type: string;
  markup?: Array<{ tagName: string; selector: string }>;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  attrs?: Record<string, unknown>;
  z?: number;
  source?: { id: string };
  target?: { id: string };
}

export const NODE_W = 200;
export const NODE_H = 150;
export const NODE_GAP_X = 60;
export const NODE_GAP_Y = 120;

export function clonarDescriptor(descriptor: DescriptorMapa): DescriptorMapa {
  return {
    nodos: descriptor.nodos.map((nodo) => ({ ...nodo, bbox: { ...nodo.bbox } })),
    aristas: descriptor.aristas.map((arista) => ({ ...arista })),
    bboxTotal: { ...descriptor.bboxTotal },
  };
}

export function descriptorConNodos(descriptor: DescriptorMapa, nodos: NodoMapa[]): DescriptorMapa {
  const ids = new Set(nodos.map((nodo) => nodo.opdId));
  return recalcularBbox({
    nodos: nodos.map((nodo) => ({ ...nodo })),
    aristas: descriptor.aristas
      .filter((arista) => ids.has(arista.desdeOpdId) && ids.has(arista.haciaOpdId))
      .map((arista) => ({ ...arista })),
    bboxTotal: { ...descriptor.bboxTotal },
  });
}

export function recalcularBbox(descriptor: DescriptorMapa): DescriptorMapa {
  if (descriptor.nodos.length === 0) return { ...descriptor, bboxTotal: { w: NODE_W, h: NODE_H } };
  const minX = Math.min(...descriptor.nodos.map((nodo) => nodo.bbox.x));
  const maxX = Math.max(...descriptor.nodos.map((nodo) => nodo.bbox.x + nodo.bbox.w));
  const maxY = Math.max(...descriptor.nodos.map((nodo) => nodo.bbox.y + nodo.bbox.h));
  return {
    ...descriptor,
    bboxTotal: {
      w: Math.max(NODE_W, maxX - minX + NODE_GAP_X),
      h: Math.max(NODE_H, maxY + NODE_GAP_Y),
    },
  };
}
