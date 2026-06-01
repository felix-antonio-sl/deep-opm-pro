import type { Id } from "./comunes";

/**
 * Tipos del dominio Apariencia (proyección visual de una entidad en un OPD).
 * Cubre Apariencia, modo de plegado y layout de estados.
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
  modoTamano?: ModoTamano;
  modoPlegado?: ModoPlegado;
  ordenPartes?: OrdenPartesPlegado;
  parteExtraidaDe?: { padreAparienciaId: Id; parteEntidadId: Id };
  contextoRefinamiento?: ContextoRefinamientoApariencia;
  /** Ports dinámicos OPCloud-style usados como puntos de conexión por enlace. */
  ports?: Record<Id, PuertoApariencia>;
  /**
   * Supresión de estados POR APARICIÓN (per-OPD), análoga a OpmVisualState
   * .suppress() de OPCloud. IDs de estado ocultos localmente en ESTA aparición,
   * sin afectar las demás apariciones del objeto ni el modelo global.
   *
   * Refinamiento de la supresión GLOBAL `Estado.suprimido`: la visibilidad
   * efectiva es el meet (∧) de ambas — global domina, local refina (ver
   * `estadoVisibleEnAparicion` en `modelo/visibilidadEstados.ts`).
   *
   * SELLO cat-thinking (`urn:fxsl:kb:icas-topoi`): la visibilidad de estados es
   * un presheaf `Vis : OPD^op → Set`; cada `Apariencia` realiza la fibra del
   * objeto en su OPD, así que el dato local vive en la fibra (no en `Estado`,
   * que colapsaría todas las fibras a una sección global). Fibras ortogonales →
   * sin invariante cruzado O(N²); por eso una lista por aparición basta.
   *
   * Ausente = ninguno suprimido localmente (compat hacia atrás: campo opcional,
   * no rompe modelos serializados previos). Normalizado: sin duplicados.
   */
  estadosSuprimidos?: Id[];
}
