/**
 * Opciones de presentación del OPL. NO afectan el texto canónico (parser/roundtrip).
 * Consumidores: panel OPL (display), generarOpl/generarOplInteractivo (barrel).
 */
export type EsenciaVisibilidad = "siempre" | "solo-difiere" | "oculta";
export interface VisibilidadOpl {
  esencia: EsenciaVisibilidad;
  /**
   * Modo apunte: relaja R-NOM-PROC-1 para el bosquejo — los procesos con nombre
   * placeholder («Proceso», «Proceso 2»…) SÍ emiten OPL (existencia y enlaces),
   * preservando la bisimetría canvas↔OPL. El rigor (diagnóstico) sigue avisando.
   */
  esApunte?: boolean;
}
export const VISIBILIDAD_OPL_DEFAULT: VisibilidadOpl = { esencia: "siempre" };
