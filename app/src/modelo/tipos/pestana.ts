import type { Id, PestanaId } from "./comunes";
import type { Modelo } from "./modelo";

/**
 * Tipos del dominio Pestaña (multi-pestaña sesión-only ronda 7).
 * Cada pestaña tiene modelo independiente, historial undo y metadata de
 * persistencia local. NO se serializa en JSON OPM.
 *
 * Refs: docs/HANDOFF.md §Decisiones Vigentes (multi-pestaña sesión-only),
 *       opm-extracted/src/app/modules/app/tabsService.ts:5-130.
 */

export type OrigenPestana = "nuevo" | "asistente" | "importado" | "persistido";
export type HistorialEntrada = Modelo;

export interface Pestana {
  id: PestanaId;
  etiqueta: string;
  modeloId: Id | null;
  modelo: Modelo;
  cargadoDesde: OrigenPestana;
  dirty: boolean;
  historialUndo: HistorialEntrada[];
  cursorUndo: number;
  vistaMapaActivaPestana: boolean;
  seleccionadosPestana?: Id[];
  snapshotJson?: string;
  descripcionModeloLocal?: string;
}
