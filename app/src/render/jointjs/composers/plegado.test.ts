import { describe, expect, test } from "bun:test";
import type { FilaPlegadoParcialExtendida } from "../plegadoNesting";
import { attrsPlegadoParcial, dimensionesPlegadoParcial, markupPlegadoParcial, selectoresPartesPlegadas, textoFilaPlegado } from "./plegado";

describe("composer plegado", () => {
  test("calcula dimensiones y markup de filas plegadas", () => {
    const size = dimensionesPlegadoParcial(apariencia, "Vehiculo", filas);
    const markup = markupPlegadoParcial("rect", filas);

    expect(size.height).toBe(123);
    expect(markup.some((item) => item.selector === "partHit0")).toBe(true);
    expect(markup.some((item) => item.selector === "partCounter2")).toBe(true);
  });

  test("proyecta attrs y selectores interactivos de partes", () => {
    const attrs = attrsPlegadoParcial({ label: { text: "Vehiculo" } }, { width: 180, height: 123 }, filas);

    expect((attrs.partLabel1 as Record<string, unknown>).text).toBe("▸ Parte extraida");
    expect((attrs.partLabel1 as Record<string, unknown>).textDecoration).toBe("line-through");
    expect(textoFilaPlegado(filas[0] as FilaPlegadoParcialExtendida)).toBe("Parte A");
    expect(selectoresPartesPlegadas(filas)).toEqual([
      { selector: "partLabel0", entidadId: "parte-a" },
      { selector: "partHit0", entidadId: "parte-a" },
      { selector: "partLabel1", entidadId: "parte-b" },
      { selector: "partHit1", entidadId: "parte-b" },
    ]);
  });
});

const apariencia = {
  id: "ap-1",
  entidadId: "vehiculo",
  opdId: "opd-1",
  x: 0,
  y: 0,
  width: 135,
  height: 60,
};

const filas: FilaPlegadoParcialExtendida[] = [
  { tipo: "parte", entidadId: "parte-a", nombre: "Parte A", extraida: false, tienePartes: false },
  { tipo: "parte", entidadId: "parte-b", nombre: "Parte extraida", extraida: true, tienePartes: true, indicadorNesting: "▸" },
  { tipo: "contador", cantidad: 2, texto: "y 2 partes mas" },
];
