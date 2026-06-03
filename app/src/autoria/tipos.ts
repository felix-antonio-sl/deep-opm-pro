// Tipos públicos del módulo de autoría headless (dominio-agnóstico).
// El módulo permite construir un Modelo OPM programáticamente (DSL imperativo re-entrante) y
// emitir un bundle validado (deep-opm-pro.modelo.v0) + OPL + reporte, con layout canónico.
import type { AvisoDiagnostico } from "../modelo/diagnostico";
import type { Modificador } from "../modelo/tipos";

/** Clave estable de dominio para una entidad (objeto/proceso). El autor la elige; el DSL la mapea a un Id. */
export type EntKey = string;
/** Clave estable de dominio para un OPD. */
export type OpdKey = string;

/** Extremo de un enlace expresado en claves de dominio: una entidad, o un estado de una entidad. */
export type ExtremoEntrada = EntKey | { estado: string; entidad: EntKey };

/** Opciones de un enlace procedural/estructural. */
export interface OpcionesEnlace {
  etiqueta?: string;
  /** Estado de entrada del destino (para efecto/consumo con transición explícita). */
  entrada?: string;
  /** Estado de salida del destino. */
  salida?: string;
  multiplicidadDestino?: string;
  /** Modificador reactivo (evento/condición) del enlace; solo legal en enlaces procedurales objeto→proceso. */
  modificador?: Modificador;
}

/** Opciones de creación del autor (metadatos del modelo). */
export interface OpcionesAutor {
  id?: string;
  nombre?: string;
}

/** Opciones de emisión del bundle. */
export interface OpcionesBundle {
  /** Líneas de descripción de dominio embebidas en `modelo.descripcion` (narrativa del consumidor). */
  descripcion?: string[];
  /** Líneas extra de dominio para el reporte (p.ej. notas de adjudicación/decisión del consumidor). */
  reporteExtra?: string[];
  /** Si true (default), lanza ante avisos de severidad `error` o round-trip inestable. */
  lanzarEnError?: boolean;
}

/** Resultado de emitir un bundle. */
export interface ResultadoBundle {
  /** JSON serializado del bundle `deep-opm-pro.modelo.v0`, listo para importar en opforja. */
  json: string;
  /** OPL forward emitido (líneas unidas por salto de línea). */
  opl: string;
  /** Reporte de validación genérico (markdown). */
  reporte: string;
  conteos: { entidades: number; estados: number; enlaces: number; opds: number };
  /** Avisos del diagnóstico nativo (metodológicos/visuales no bloqueantes; los `error` lanzan si lanzarEnError). */
  avisos: AvisoDiagnostico[];
}
