/**
 * Opciones de generación del OPL.
 * - `esencia` es de PRESENTACIÓN: no afecta el texto canónico (parser/roundtrip).
 * - `esApunte` es de RÉGIMEN: excepción de apunte a R-ENT-2 (spec-forja-opl-es).
 * Consumidores: panel OPL, export Markdown, contexto skill, vista móvil.
 */
export type EsenciaVisibilidad = "siempre" | "solo-difiere" | "oculta";
export interface VisibilidadOpl {
  esencia: EsenciaVisibilidad;
  /**
   * Régimen apunte: excepción de apunte a R-ENT-2 — en un boceto, las cosas con
   * nombre placeholder («Proceso», «Proceso 2»…) SÍ emiten OPL (existencia y
   * enlaces), preservando la bisimetría canvas↔OPL en TODAS las superficies
   * (panel, editor libre, export, puente skill, móvil). El diagnóstico de
   * nominación (R-NOM-PROC-1 deverbal) sigue avisando. En régimen riguroso
   * (default) la supresión R-ENT-2 se mantiene.
   */
  esApunte?: boolean;
}
export const VISIBILIDAD_OPL_DEFAULT: VisibilidadOpl = { esencia: "siempre" };
