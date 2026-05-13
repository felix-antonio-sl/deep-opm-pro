import type { Id } from "./comunes";

/**
 * Tipos del dominio Apariencia (proyección visual de una entidad en un OPD).
 * Cubre Apariencia, estilo visual, modo de plegado y layout de estados.
 *
 * Refs: SSOT opm-visual-es.md V-1..V-240, JOYAS §dimensiones,
 *       opm-extracted/src/app/models/DrawnPart/OpmObject.ts:5-15.
 */

export type ModoPlegado = "completo" | "parcial" | "plegado" | "desplegado";
export type OrdenPartesPlegado = "alfabetico" | "creacion";
export type LayoutEstados = "horizontal" | "vertical";
export type ModoTamano = "auto" | "manual";
export type RolContextoRefinamiento = "contorno" | "interno" | "externo";

export interface ContextoRefinamientoApariencia {
  tipo: "descomposicion";
  refinableEntidadId: Id;
  rol: RolContextoRefinamiento;
  contenedorAparienciaId?: Id;
  enlacesPadreIds?: Id[];
}

export interface EstiloApariencia {
  fill?: string;
  borderColor?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number | "normal" | "bold";
  fontStyle?: "normal" | "italic";
  textColor?: string;
  textAnchor?: "start" | "middle" | "end";
}

export interface PuertoApariencia {
  /** Coordenadas relativas 0..1 dentro del bbox de la apariencia. */
  x: number;
  y: number;
}

export interface Apariencia {
  id: Id;
  entidadId: Id;
  opdId: Id;
  x: number;
  y: number;
  width: number;
  height: number;
  estilo?: EstiloApariencia;
  modoTamano?: ModoTamano;
  modoPlegado?: ModoPlegado;
  ordenPartes?: OrdenPartesPlegado;
  parteExtraidaDe?: { padreAparienciaId: Id; parteEntidadId: Id };
  contextoRefinamiento?: ContextoRefinamientoApariencia;
  /** Ports dinámicos OPCloud-style usados como puntos de conexión por enlace. */
  ports?: Record<Id, PuertoApariencia>;
}
