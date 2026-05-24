import { CODEX } from "./constantes.codex";

/**
 * Paleta de interaccion del canvas CANON-V3 Codex. Crimson es canal UI
 * exclusivo; los colores semanticos OPM viven en `constantes.codex.ts`.
 */
export const jointCanvasPalette = {
  background: CODEX.colores.paper,
  seleccion: CODEX.colores.crimson,
  seleccionSuave: CODEX.colores.crimsonSuave,
} as const;
