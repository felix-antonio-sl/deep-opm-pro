import { CANON } from "../../modelo/constantes";
import { rutaEtiquetaNormalizada } from "../../modelo/rutas";
import type { Enlace } from "../../modelo/tipos";
import { labelTextWrap } from "./labelText";

export function etiquetasRuta(enlace: Enlace): Array<Record<string, unknown>> {
  const text = rutaEtiquetaNormalizada(enlace.rutaEtiqueta);
  if (!text) return [];
  return [{
    markup: [{ tagName: "text", selector: "label" }],
    attrs: {
      label: {
        text,
        ...labelTextWrap(text),
        fill: "#475467",
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
  }];
}
