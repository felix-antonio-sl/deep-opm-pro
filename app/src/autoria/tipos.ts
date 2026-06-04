// Tipos públicos del módulo de autoría headless (dominio-agnóstico).
// El módulo permite construir un Modelo OPM programáticamente (DSL imperativo re-entrante) y
// emitir un bundle validado (deep-opm-pro.modelo.v0) + OPL + reporte, con layout canónico.
import type { AvisoDiagnostico } from "../modelo/diagnostico";
import type {
  EstadoAncla,
  Id,
  Modificador,
  NivelAutoridad,
  RatificacionAncla,
  ReferenciaNorma,
} from "../modelo/tipos";

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
  /** Cardinalidad del lado origen (prefijo `2..N`, `+`, `*`); espejo de `multiplicidadDestino`. W4.1 Tanda 1 (#31). */
  multiplicidadOrigen?: string;
  multiplicidadDestino?: string;
  /** Modificador reactivo (evento/condición/no) del enlace; solo legal en enlaces procedurales. */
  modificador?: Modificador;
  /**
   * Demora de invocación (`después de Ns`). Solo legal en enlaces `invocacion`; delega a
   * `definirDemora` del kernel. W4.1 Tanda 1 (#21).
   */
  demora?: string;
}

/**
 * Target de un ancla normativa expresado en claves de dominio (W5.1). El DSL las resuelve a ids:
 * - `{ entidad }` / `{ opd }` por clave estable de dominio;
 * - `{ enlace }` por el Id que `enlazar()` devuelve (los enlaces no tienen clave de dominio);
 * - `{ modelo: true }` para el modelo entero.
 */
export type TargetAnclaEntrada =
  | { entidad: EntKey }
  | { enlace: Id }
  | { opd: OpdKey }
  | { modelo: true };

/** Opciones de un ancla normativa (W5.1). `claveProto` es la clave estable nacida en el proto. */
export interface OpcionesAncla {
  /** Clave estable de trazabilidad nacida en el proto (slug, p.ej. `frontera-art17`). Obligatoria. */
  claveProto: string;
  /** `vigente` (hecho) o `pendiente-ratificacion` ([RATIFICAR]). Default `vigente`. */
  estado?: EstadoAncla;
  /** 0..N normas (verbatim). */
  referencias?: ReferenciaNorma[];
  /** Glosa del autor. */
  nota?: string;
  /**
   * Sub-estructura C1 (solo para `pendiente-ratificacion`). Si se pasa `nivelAutoridad`
   * suelto se arma una ratificación `estadoRatificacion:"pendiente"` por conveniencia.
   */
  ratificacion?: RatificacionAncla;
  /** Azúcar: nivel de autoridad declarado; arma `ratificacion` pendiente si no se pasó `ratificacion`. */
  nivelAutoridad?: NivelAutoridad;
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
