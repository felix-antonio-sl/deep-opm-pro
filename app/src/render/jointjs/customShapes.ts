import { dia } from "jointjs";
import { CANON_V2 } from "../../modelo/constantes.bauhaus";

// Shape minimalista para overlays SVG arbitrarios. No hereda de standard.Path
// para evitar el refD por defecto ('M 0 0 L 10 0 10 10 0 10 Z') que JointJS
// resuelve despues del 'd' explicito (joint.js dWrapper) y dibuja un rectangulo
// del bbox encima del path real. El arco del abanico (radios 30/35 al estilo
// OpCloud, shared.ts:5908-5912) se renderiza como SVG path puro.
//
// CANON-V2 Bauhaus (ronda 28 L4): stroke ink puro (antes `#586D8C` gris-azul).
// El strokeWidth se mantiene en 1.5 (consistente con los assets logicos OR/XOR
// del canon Dori que dibujan los arcos con grosor menor al de los enlaces).
const OpmAbanicoArc = dia.Element.define(
  "opm.AbanicoArc",
  {
    attrs: {
      body: {
        d: "M 0 0",
        fill: "none",
        stroke: CANON_V2.enlace.stroke,
        strokeWidth: 1.5,
      },
    },
  },
  {
    markup: [{ tagName: "path", selector: "body" }],
  },
);

export const opmShapes = {
  AbanicoArc: OpmAbanicoArc,
};
