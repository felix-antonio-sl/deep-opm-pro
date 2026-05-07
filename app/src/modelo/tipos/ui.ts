import type { EstiloApariencia } from "./apariencia";
import type { Id } from "./comunes";
import type { GridConfig } from "../../canvas/grid";

/**
 * Tipos UI del workspace que NO pertenecen al JSON OPM canónico.
 * Cubre portapapeles visual transitorio (Ctrl+C/V) y preferencias UI por usuario.
 *
 * Refs: [Met §multi-OPD], [Glos 3.6],
 *       docs/HANDOFF.md §Decisiones Vigentes (multi-selección, divisor árbol/canvas,
 *       toggle ocultar nombres del árbol).
 */

// Estado UI transitorio para Ctrl+C/V visual. No pertenece al JSON OPM.
export interface UiPortapapelesVisual {
  apariencias: Array<{
    entidadId: Id;
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
    estilo?: EstiloApariencia;
  }>;
  enlaces: Array<{ enlaceId: Id }>;
  origenOpdId: Id;
  pegados?: number;
}

// Preferencias de UI del workspace. No pertenecen al JSON OPM canonico.
export interface PreferenciasUiUsuario {
  anchoPanelArbol?: number;
  nombresArbolVisibles?: boolean;
  arbolOrden?: "automatico" | "manual";
  arbolExpandidoPersistente?: Id[];
  cheatsheetVisible?: boolean;
  gridConfig?: GridConfig;
  oplPosicion?: "inferior" | "lateral-derecho";
  oplNumeracionVisible?: boolean;
  oplMinimizado?: boolean;
  oplBloquesContraidos?: Record<Id, true>;
  /** [Met §8.8] Preferencia UI aditiva para ordenar plantillas privadas. */
  plantillasOrden?: "actualizado-desc" | "nombre-asc";
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
