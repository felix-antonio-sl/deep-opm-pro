/**
 * Paleta UI mínima — separada de la paleta semántica del canvas.
 *
 * Citas SSOT:
 * - [JOYAS §1] paleta canónica canvas (invariante): #70E483 Object stroke,
 *   #3BC3FF Process stroke, #586D8C link stroke, #fdffff fill, #000002 text.
 *
 * Rationale (auditoría comparativa OPCloud, 2026-05-07):
 *   El acento UI no debe colisionar con el color semántico de proceso del
 *   canvas. `#3BC3FF` es color semántico de proceso (canvas) y NO debería
 *   reusarse como acento UI en chrome (toolbar, diálogos, halos). El acento
 *   UI primario es `#3DA8FF` — más saturado, distinguible por daltónicos.
 *
 * Alcance ronda 12.1 (mínimo): solo `colors.acentoUi`, `colors.acentoSecundario`
 * y `colors.chromeNeutral` se introducen como tokens de UI. La sección
 * `colors.canvas` se expone únicamente como referencia documental — no es
 * para uso UI; el canvas semántico se mantiene con literales en su capa
 * de render. Migración completa a tokens (Toolbar, Inspector, MenuContextual*,
 * spacing/radii/typography) está diferida a ronda 13 dedicada.
 */
export const colors = {
  acentoUi: "#3DA8FF",
  acentoSecundario: "#1a3763",
  chromeNeutral: "#586D8C",
  canvas: {
    objeto: "#70E483",
    proceso: "#3BC3FF",
    enlace: "#586D8C",
    fill: "#fdffff",
    texto: "#000002",
  },
} as const;
