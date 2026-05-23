import { CANON_V2 } from "../../modelo/constantes.bauhaus";

/**
 * Paleta de interaccion del canvas (CANON-V2 Bauhaus, ronda 28 L4).
 *
 * No redefine la semantica OPM del diagrama: objeto/proceso/enlace siguen
 * en `CANON`/`CANON_V2`. Estos valores gobiernan fondo del paper, color
 * de seleccion (rubber band, halo) y gestos transitorios para mantener
 * el canvas alineado con el chrome Bauhaus.
 *
 * Cambios V1→V2:
 *   - `background`: `#F1F8FB` (azul corporate) → `#FAFAFA` (paper Bauhaus).
 *   - `seleccion`: `#007DB8` (cian) → `#C8392F` (cinabrio).
 *   - `seleccionSuave`: rgba cian → rgba cinabrio 10%.
 *
 * Tests asociados: `composers/halos.test.ts` (asserta jointCanvasPalette.seleccion).
 */
export const jointCanvasPalette = {
  background: CANON_V2.fondoCanvas,
  seleccion: CANON_V2.seleccion.color,
  seleccionSuave: CANON_V2.seleccion.fill,
} as const;
