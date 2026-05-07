/**
 * Avisos metodologicos blandos derivados del modelo OPM.
 *
 * Citas SSOT: [Met §metodologia] [Met §inzoom] [Met §unfold]
 * [Glos 3.55 Object] [Glos 3.69 Process].
 *
 * Contrato ronda 13 L3: AvisoMetodologico NO se serializa; se calcula en
 * runtime como DataFlow puro Modelo -> AvisoMetodologico[].
 */

import type { Id } from "./comunes";

export type SeveridadAviso = "info" | "advertencia" | "sugerencia";

export type CodigoChecker =
  | "PROCESO_NOMBRE_FORMA_VERBAL"
  | "OBJETO_NOMBRE_SINGULAR"
  | "INZOOM_CONTENIDO_INSUFICIENTE"
  | "UNFOLD_CONTENIDO_INSUFICIENTE"
  | "PROCESO_NO_TRANSFORMA"
  | "PROCESO_SISTEMICO_DESCONECTADO";

export interface AvisoMetodologico {
  codigo: CodigoChecker;
  severidad: SeveridadAviso;
  entidadId?: Id;
  opdId?: Id;
  mensaje: string;
  rationale?: string;
}
