/**
 * Opciones de presentación del OPL. NO afectan el texto canónico (parser/roundtrip).
 * Consumidores: panel OPL (display), generarOpl/generarOplInteractivo (barrel).
 */
export type EsenciaVisibilidad = "siempre" | "solo-difiere" | "oculta";
export interface VisibilidadOpl { esencia: EsenciaVisibilidad; }
export const VISIBILIDAD_OPL_DEFAULT: VisibilidadOpl = { esencia: "siempre" };
