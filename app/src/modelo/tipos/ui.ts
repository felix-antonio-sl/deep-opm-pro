import type { Id } from "./comunes";
import type { EsenciaVisibilidad } from "../../opl/opciones";

/**
 * Tipos UI del workspace que NO pertenecen al JSON OPM canónico.
 * Cubre portapapeles visual transitorio (Ctrl+C/V) y preferencias UI por usuario.
 *
 * Refs: [Met §multi-OPD], [Glos 3.6],
 *       docs/HANDOFF.md §Decisiones Vigentes (multi-selección, divisor árbol/canvas,
 *       toggle ocultar nombres del árbol).
 */

export interface GridConfig {
  activa: boolean;
  paso: number;
  color: string;
  strokeWidth: number;
  escala: number;
  snapActivo: boolean;
}

// Estado UI transitorio para Ctrl+C/V visual. No pertenece al JSON OPM.
export interface UiPortapapelesVisual {
  apariencias: Array<{
    entidadId: Id;
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
  }>;
  enlaces: Array<{ enlaceId: Id }>;
  origenOpdId: Id;
  pegados?: number;
}

// Preferencias de UI del workspace. No pertenecen al JSON OPM canonico.
export interface PreferenciasUiUsuario {
  anchoPanelArbol?: number;
  /**
   * BUG-20260511T225343Z-696858: ancho del panel Inspector derecho (px).
   * Espejo de `anchoPanelArbol` con su propio clamp [240, 560] y default 300.
   */
  anchoPanelInspector?: number;
  anchoPanelOpleft?: number;
  nombresArbolVisibles?: boolean;
  arbolOrden?: "automatico" | "manual";
  arbolExpandidoPersistente?: Id[];
  cheatsheetVisible?: boolean;
  gridConfig?: GridConfig;
  oplNumeracionVisible?: boolean;
  /** Presentación: visibilidad de las oraciones de esencia/afiliación en el panel OPL. */
  oplEsenciaVisibilidad?: EsenciaVisibilidad;
  oplMinimizado?: boolean;
  oplBloquesContraidos?: Record<Id, true>;
  vistaCargar?: "tiles" | "lista";
  ordenCargar?: {
    columna: "nombre" | "descripcion" | "actualizadoEn" | "bytes";
    direccion: "asc" | "desc";
  };
  recientes?: Id[];
  traerConectadosUltimo?: Array<
    "procedural-habilitador" |
    "procedural-transformador" |
    "direccional" |
    "estructural"
  >;
}
