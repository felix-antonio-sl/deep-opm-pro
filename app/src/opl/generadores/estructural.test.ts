import { describe, expect, test } from "bun:test";
import type { Enlace, Entidad, Modelo } from "../../modelo/tipos";
import { oracionEnlaceEstructural, oracionEntidad, oracionValorAtributo } from "./estructural";

describe("estructural OPL", () => {
  test("oracionEntidad escinde esencia y afiliacion en dos oraciones (G2, D1-D4)", () => {
    const entidad: Entidad = { id: "e1", tipo: "objeto", nombre: "Nodo", esencia: "informacional", afiliacion: "sistemica" };
    expect(oracionEntidad(entidad)).toEqual(["**Nodo** es informacional.", "**Nodo** es sistémico."]);
  });

  test("agregacion emite consta de", () => {
    const modelo = modeloBase();
    const enlace: Enlace = { id: "l1", tipo: "agregacion", origenId: { kind: "entidad", id: "todo" }, destinoId: { kind: "entidad", id: "parte" }, etiqueta: "" };
    expect(oracionEnlaceEstructural(modelo, enlace)).toBe("**Todo** consta de **Parte**.");
  });

	  test("clasificacion emite instancia", () => {
    const modelo = modeloBase();
    const enlace: Enlace = { id: "l1", tipo: "clasificacion", origenId: { kind: "entidad", id: "todo" }, destinoId: { kind: "entidad", id: "parte" }, etiqueta: "" };
    expect(oracionEnlaceEstructural(modelo, enlace)).toBe("**Parte** es una instancia de **Todo**.");
	  });

  test("HU-17.016 emite atributo con placeholder, valor y unidad opcional", () => {
    const atributo: Entidad = {
      id: "temp",
      tipo: "objeto",
      nombre: "Temperatura",
      esencia: "informacional",
      afiliacion: "sistemica",
      esAtributo: true,
      unidad: "°C",
      valorSlot: { tipo: "float", placeholder: "value" },
    };

    expect(oracionValorAtributo(atributo)).toBe("**Temperatura** es valor [°C].");
    expect(oracionEntidad(atributo)).toEqual(["**Temperatura** es valor [°C]."]);
    expect(oracionEntidad({ ...atributo, valorSlot: { ...atributo.valorSlot!, valor: 25.5 } })).toEqual(["**Temperatura** es 25.5 [°C]."]);
    const { unidad: _unidad, ...sinUnidad } = atributo;
    expect(oracionEntidad({ ...sinUnidad, valorSlot: { ...atributo.valorSlot!, valor: 25 } })).toEqual(["**Temperatura** es 25."]);
  });
});

function modeloBase(): Modelo {
  return {
    id: "m1",
    nombre: "M",
    opdRaizId: "opd",
    opds: { opd: { id: "opd", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} } },
    entidades: {
      todo: { id: "todo", tipo: "objeto", nombre: "Todo", esencia: "informacional", afiliacion: "sistemica" },
      parte: { id: "parte", tipo: "objeto", nombre: "Parte", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {},
    enlaces: {},
    nextSeq: 1,
  };
}
