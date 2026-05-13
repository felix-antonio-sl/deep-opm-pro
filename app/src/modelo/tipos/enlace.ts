import type { Id } from "./comunes";

/**
 * Tipos del dominio Enlace (link en OPM).
 * Cubre tipos canónicos (estructurales y procedurales), extremos polimorfos
 * (entidad o estado), modificadores (condición/evento/no), derivación en
 * refinamiento externo, estilo visual y apariencia (vértices manuales).
 *
 * Refs: SSOT opm-iso-19450-es.md §3.* (Link), opm-visual-es.md V-237/V-239,
 *       opm-extracted/src/app/models/DrawnPart/Links/AggregationLink.ts,
 *       opm-extracted/src/app/models/DrawnPart/Links/EffectLink.ts:117.
 */

export type TipoEnlace =
  | "agregacion"
  | "exhibicion"
  | "generalizacion"
  | "clasificacion"
  | "agente"
  | "instrumento"
  | "consumo"
  | "resultado"
  | "efecto"
  | "invocacion";

export type DerivacionOrigen = "automatico" | "manual";
export type ExtremoKind = "entidad" | "estado";
export type Modificador = "condicion" | "evento" | "no";
export type SubtipoModificador = "C" | "E" | "no";

export interface EnlaceEstilo {
  color?: string;
  strokeWidth?: number;
  dashArray?: string;
}

export interface ExtremoEnlace {
  kind: ExtremoKind;
  id: Id;
  /** Port dinámico de la apariencia visible cuando el extremo es entidad. */
  portId?: Id;
}

export interface DerivacionEnlace {
  tipo: "enlace-externo-refinamiento";
  refinamientoId: Id;
  enlacePadreId: Id;
  origen?: DerivacionOrigen;
}

export interface Enlace {
  id: Id;
  tipo: TipoEnlace;
  origenId: ExtremoEnlace;
  destinoId: ExtremoEnlace;
  etiqueta: string;
  multiplicidadOrigen?: string;
  multiplicidadDestino?: string;
  estilo?: EnlaceEstilo;
  modificador?: Modificador;
  subtipoModificador?: SubtipoModificador;
  probabilidad?: number;
  demora?: string;
  rutaEtiqueta?: string;
  /** Separa o asocia manualmente ramas de una relación estructural fundamental. */
  grupoEstructuralId?: Id;
  derivado?: DerivacionEnlace;
}

export interface AnclajeSimboloEstructural {
  /** Offset horizontal relativo al centro del simbolo estructural. */
  dx: number;
  /** Offset vertical relativo al centro del simbolo estructural. */
  dy: number;
}

export interface AnclajesSimboloEstructural {
  /** Puerto del tramo comun que llega desde la cosa refinable. */
  refinable?: AnclajeSimboloEstructural;
  /** Puerto de salida hacia la cosa refinadora de esta rama. */
  refinador?: AnclajeSimboloEstructural;
}

export interface AparienciaEnlace {
  id: Id;
  enlaceId: Id;
  opdId: Id;
  vertices: Array<{ x: number; y: number }>;
  /** Centro persistido del símbolo estructural OPCloud (triángulo/bus). */
  symbolPos?: { x: number; y: number };
  /** Offsets persistidos de los puertos del símbolo, relativos a symbolPos. */
  symbolAnchors?: AnclajesSimboloEstructural;
}
