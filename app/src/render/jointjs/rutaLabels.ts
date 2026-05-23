import { CANON } from "../../modelo/constantes";
import { rutaEtiquetaNormalizada } from "../../modelo/rutas";
import type { Enlace } from "../../modelo/tipos";
import { aplicarLayoutLabel, LABEL_KEY_RUTA, type LayoutLabelsEnlace } from "./labelLayout";
import { labelTextWrap } from "./labelText";

export function etiquetasRuta(enlace: Enlace, labelPositions?: LayoutLabelsEnlace, wrapWidth?: number): Array<Record<string, unknown>> {
  const text = rutaEtiquetaNormalizada(enlace.rutaEtiqueta);
  if (!text) return [];
  return [aplicarLayoutLabel({
    markup: [{ tagName: "text", selector: "label" }],
    attrs: {
      label: {
        text,
        ...labelTextWrap(text, wrapWidth),
        // CANON-V2 (ronda 28 L4): ink70 (antes #475467 slate).
        fill: "#404040",
        fontFamily: CANON.dims.fontFamily,
        fontSize: 12,
        fontWeight: 700,
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        pointerEvents: "none",
      },
    },
    position: {
      distance: 0.33,
      offset: -24,
      angle: 0,
      args: {
        keepGradient: false,
        ensureLegibility: true,
      },
    },
  }, LABEL_KEY_RUTA, labelPositions)];
}
