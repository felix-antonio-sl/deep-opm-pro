import { describe, expect, test } from "bun:test";
import { esNombreProcesoPlaceholder } from "../../modelo/nombresCanonicos";
import type { Entidad } from "../../modelo/tipos";
import { entidadOplEsEmitible, hintEntidad, listarOpl, refEntidad } from "./refsHints";

describe("refsHints OPL", () => {
  test("refEntidad crea referencia canonica de entidad", () => {
    expect(refEntidad("e1")).toEqual({ tipo: "entidad", id: "e1" });
  });

  test("hintEntidad conserva markdown por tipo de entidad", () => {
    const entidad: Entidad = { id: "e1", tipo: "objeto", nombre: "Pedido", esencia: "informacional", afiliacion: "sistemica" };
    expect(hintEntidad(entidad)).toMatchObject({ texto: "**Pedido**", markdown: "objeto", rol: "nombre" });
  });

  test("listarOpl usa y final", () => {
    expect(listarOpl(["A", "B", "C"])).toBe("A, B y C");
  });

  test("suprime procesos placeholder de OPL", () => {
    const procesoPlaceholder: Entidad = {
      id: "p1",
      tipo: "proceso",
      nombre: "Proceso",
      esencia: "informacional",
      afiliacion: "sistemica",
    };
    const procesoCanonico: Entidad = {
      ...procesoPlaceholder,
      id: "p2",
      nombre: "Procesar Pedido",
    };

    expect(esNombreProcesoPlaceholder(procesoPlaceholder.nombre)).toBe(true);
    expect(entidadOplEsEmitible(procesoPlaceholder)).toBe(false);
    expect(entidadOplEsEmitible(procesoCanonico)).toBe(true);
  });
});
