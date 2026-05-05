import { CANON } from "../../../modelo/constantes";
import type { Apariencia, Id } from "../../../modelo/tipos";
import type { FilaPlegadoParcialExtendida } from "../plegadoNesting";

/**
 * Primitivas de plegado parcial: dimensionado, markup y attrs de filas
 * inline. Consumidor principal: composer de entidad.
 */
export function dimensionesPlegadoParcial(apariencia: Apariencia, nombrePadre: string, filas: FilaPlegadoParcialExtendida[]): { width: number; height: number } {
  const textoMasLargo = [nombrePadre, ...filas.map(textoFilaPlegado)]
    .reduce((max, texto) => Math.max(max, texto.length), 0);
  const width = Math.max(apariencia.width, CANON.dims.cosaWidth, textoMasLargo * 7 + 36);
  const height = Math.max(apariencia.height, PLEGADO.headerHeight + filas.length * PLEGADO.rowHeight + PLEGADO.paddingBottom);
  return { width, height };
}

export function markupPlegadoParcial(bodyTag: "rect" | "ellipse", filas: FilaPlegadoParcialExtendida[]): Array<Record<string, unknown>> {
  const rows = filas.flatMap((fila, index) => [
    { tagName: "line", selector: `partSeparator${index}` },
    ...(fila.tipo === "parte" ? [{ tagName: "rect", selector: `partHit${index}` }] : []),
    { tagName: "text", selector: fila.tipo === "parte" ? `partLabel${index}` : `partCounter${index}` },
  ]);
  return [
    { tagName: bodyTag, selector: "body" },
    { tagName: "text", selector: "label" },
    ...rows,
  ];
}

export function attrsPlegadoParcial(
  attrsBase: Record<string, unknown>,
  size: { width: number; height: number },
  filas: FilaPlegadoParcialExtendida[],
): Record<string, unknown> {
  const attrs: Record<string, unknown> = {
    ...attrsBase,
    label: {
      ...(attrsBase.label as Record<string, unknown>),
      textWrap: { width: size.width - 24 },
    },
  };
  for (const [index, fila] of filas.entries()) {
    const y = PLEGADO.headerHeight + index * PLEGADO.rowHeight;
    attrs[`partSeparator${index}`] = {
      x1: 12,
      x2: size.width - 12,
      y1: y,
      y2: y,
      stroke: "#d9e0ea",
      strokeWidth: 1,
      pointerEvents: "none",
    };
    if (fila.tipo === "parte") {
      attrs[`partHit${index}`] = {
        x: 12,
        y,
        width: size.width - 24,
        height: PLEGADO.rowHeight,
        fill: "transparent",
        stroke: "transparent",
        cursor: "pointer",
      };
    }
    const selector = fila.tipo === "parte" ? `partLabel${index}` : `partCounter${index}`;
    attrs[selector] = {
      text: textoFilaPlegado(fila),
      x: size.width / 2,
      y: y + PLEGADO.rowHeight / 2,
      fill: fila.tipo === "parte" && !fila.extraida ? CANON.colores.texto : "#667085",
      fontFamily: CANON.dims.fontFamily,
      fontSize: 12,
      fontWeight: CANON.dims.fontWeight,
      fontStyle: fila.tipo === "contador" || fila.extraida ? "italic" : undefined,
      textDecoration: fila.tipo === "parte" && fila.extraida ? "line-through" : undefined,
      opacity: fila.tipo === "parte" && fila.extraida ? 0.64 : 1,
      textAnchor: "middle",
      textVerticalAnchor: "middle",
      textWrap: { width: size.width - 24, height: PLEGADO.rowHeight - 4 },
      pointerEvents: fila.tipo === "parte" ? "auto" : "none",
      cursor: fila.tipo === "parte" ? "pointer" : undefined,
    };
  }
  return attrs;
}

export function selectoresPartesPlegadas(filas: FilaPlegadoParcialExtendida[]): Array<{ selector: string; entidadId: Id }> {
  return filas.flatMap((fila, index) => fila.tipo === "parte"
    ? [
        { selector: `partLabel${index}`, entidadId: fila.entidadId },
        { selector: `partHit${index}`, entidadId: fila.entidadId },
      ]
    : []);
}

export function textoFilaPlegado(fila: FilaPlegadoParcialExtendida): string {
  if (fila.tipo === "contador") return fila.texto;
  return fila.indicadorNesting ? `${fila.indicadorNesting} ${fila.nombre}` : fila.nombre;
}

export const PLEGADO = {
  headerHeight: 38,
  rowHeight: 25,
  paddingBottom: 10,
} as const;

