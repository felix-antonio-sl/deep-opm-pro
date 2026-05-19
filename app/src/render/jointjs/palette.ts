/**
 * Paleta de interaccion del canvas.
 *
 * No redefine la semantica OPM del diagrama: objeto/proceso/enlace siguen en
 * CANON/JOYAS. Estos valores gobiernan fondo, seleccion y gestos transitorios
 * para mantener el canvas alineado con el chrome sin importar `ui/tokens`.
 */
export const jointCanvasPalette = {
  background: "#F1F8FB",
  seleccion: "#007DB8",
  seleccionSuave: "rgba(0, 125, 184, 0.16)",
} as const;
