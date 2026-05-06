import type { EstiloApariencia } from "./apariencia";
import type { Id } from "./comunes";

/**
 * Tipos UI del workspace que NO pertenecen al JSON OPM canónico.
 * Cubre portapapeles visual transitorio (Ctrl+C/V) y preferencias UI por usuario.
 *
 * Refs: docs/HANDOFF.md §Decisiones Vigentes (multi-selección, divisor árbol/canvas,
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
  cheatsheetVisible?: boolean;
}
