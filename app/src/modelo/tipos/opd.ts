import type { Apariencia } from "./apariencia";
import type { Id } from "./comunes";
import type { AparienciaEnlace } from "./enlace";

/**
 * Tipos del dominio OPD (Object-Process Diagram).
 * Cada OPD es una vista del modelo con apariencias de entidades y enlaces,
 * jerarquía padre/hijo (refinamiento) y orden opcional entre hermanos.
 *
 * Refs: SSOT opm-iso-19450-es.md §3.* (OPD), metodologia-opm-es.md.
 */

export interface Opd {
  id: Id;
  nombre: string;
  padreId: Id | null;
  apariencias: Record<Id, Apariencia>;
  enlaces: Record<Id, AparienciaEnlace>;
  /** Orden opcional entre hermanos para reordenamiento manual.
   *  Monotono entre hermanos de un mismo padre.
   *  Si no esta presente, se usa orden alfabetico por id. */
  ordenLocal?: number;
}
