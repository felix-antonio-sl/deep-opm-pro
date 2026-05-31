// Colores semánticos OPM del canvas — espejo de dominio del invariante [JOYAS §1].
//
// `canvas/` no puede importar de `ui/` (dirección de capa prohibida), pero
// `colorHaloPorTipo` necesita los colores canónicos. La SSOT de diseño es
// `ui-forja/tokens.json` (gobernada por governance) y se proyecta en
// `ui/tokens.ts § canvas`. Aquí vive el espejo que esa capa requiere.
//
// La sincronía con `ui/tokens.ts` NO se confía a la disciplina: la garantiza
// `coloresCanon.test.ts`, que cruza ambas capas y rompe el build si divergen.
export const COLORES_CANON_OPM = {
  objeto: "#70E483",
  proceso: "#3BC3FF",
  enlace: "#586D8C",
} as const;

// Halo de enlaces sin clasificación semántica (espejo de `tokens.colors.acentoUi`).
export const COLOR_HALO_FALLBACK = "#8e2a2e";
