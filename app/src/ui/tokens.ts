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
 * de render.
 *
 * Alcance ronda 13.0 T1.2 (steipete §2): se añaden dos tokens "Suaves" para
 * fondos derivados del acento y del chrome neutro (`acentoUiSuave`,
 * `chromeNeutralSuave`), usados por activeButton/stickyBadge/activeSelect en
 * `Toolbar.tsx`. Migración completa a tokens (Inspector, MenuContextual*,
 * spacing/radii/typography) sigue diferida a ronda 13 grande T2.2.
 */
export const colors = {
  acentoUi: "#3DA8FF",
  acentoUiSuave: "#eaf8ff",
  acentoSecundario: "#1a3763",
  chromeNeutral: "#586D8C",
  chromeNeutralSuave: "#e8eef5",
  canvas: {
    objeto: "#70E483",
    proceso: "#3BC3FF",
    enlace: "#586D8C",
    fill: "#fdffff",
    texto: "#000002",
  },
} as const;
