import type { Id } from "./comunes";

/**
 * Tipos del dominio Estado (estado de objeto en OPM).
 * Cubre Estado, designaciones (inicial/final/default/current con exclusiones
 * SSOT) y duración temporal canónica.
 *
 * Refs: SSOT opm-iso-19450-es.md §3.71 (State), opm-opl-es.md D5-D8,
 *       JOYAS §9 (formato canónico de duración).
 */

export type DesignacionEstado = "inicial" | "final" | "default" | "current";
export type UnidadTiempo = "ms" | "s" | "min" | "h" | "dia" | "sem" | "mes" | "año";

export interface DuracionTemporal {
  unidad: UnidadTiempo;
  min: number;
  nominal: number;
  max: number;
}

export interface Estado {
  id: Id;
  entidadId: Id;
  nombre: string;
  esInicial?: boolean;
  esFinal?: boolean;
  designaciones?: DesignacionEstado[];
  duracion?: DuracionTemporal;
  suprimido?: boolean;
  /**
   * Orden explícito dentro del objeto propietario. Cuando está presente, manda
   * sobre el orden por secuencia de id (fallback histórico). Introducido en
   * 2026-05-23 para soportar `reordenarEstado` (ver `operaciones/estados.ts`).
   * Los estados que no lo tengan se ordenan después por secuencia de id;
   * `reordenarEstado` normaliza al conjunto completo al primer reorder.
   */
  orden?: number;
}
