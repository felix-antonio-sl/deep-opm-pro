import type { Apariencia } from "./apariencia";
import type { Id } from "./comunes";
import type { AparienciaEnlace } from "./enlace";
import type { OpdVista } from "./extensiones";

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
  vista?: OpdVista;
  /** Orden opcional entre hermanos para reordenamiento manual.
   *  Monotono entre hermanos de un mismo padre.
   *  Si no esta presente, se usa orden alfabetico por id. */
  ordenLocal?: number;
  /** Orden temporal declarado de los subprocesos de la descomposicion que este
   *  OPD realiza (R-INV-2/2A/2C): secuencia de bandas, cada banda un conjunto de
   *  subprocesos en paralelo (anticadena). Es la presentacion del preorden por su
   *  funcion rango y la fuente de verdad del orden, de la que derivan la banda Y
   *  del layout y el OPL «en paralelo… en esa secuencia». Ausente ⇒ fallback a la
   *  topologia de invocaciones (retrocompat). Solo aplica a in-zoom de proceso.
   *  Ver docs/specs/2026-06-14-invocacion-implicita-bimodal-design.md */
  ordenInzoom?: Id[][];
}
