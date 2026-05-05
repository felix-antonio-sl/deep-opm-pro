import { dia } from "jointjs";

// Shape minimalista para overlays SVG arbitrarios. No hereda de standard.Path
// para evitar el refD por defecto ('M 0 0 L 10 0 10 10 0 10 Z') que JointJS
// resuelve despues del 'd' explicito (joint.js dWrapper) y dibuja un rectangulo
// del bbox encima del path real. El arco del abanico (radios 30/35 al estilo
// OpCloud, shared.ts:5908-5912) se renderiza como SVG path puro.
const OpmAbanicoArc = dia.Element.define(
  "opm.AbanicoArc",
  {
    attrs: {
      body: {
        d: "M 0 0",
        fill: "none",
        stroke: "#586D8C",
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
