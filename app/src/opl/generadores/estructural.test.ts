import { describe, expect, test } from "bun:test";
import type { Enlace, Entidad, Modelo } from "../../modelo/tipos";
import { oracionEnlaceEstructural, oracionEntidad } from "./estructural";

describe("estructural OPL", () => {
  test("oracionEntidad conserva esencia y afiliacion", () => {
    const entidad: Entidad = { id: "e1", tipo: "objeto", nombre: "Nodo", esencia: "informacional", afiliacion: "sistemica" };
    expect(oracionEntidad(entidad)).toBe("**Nodo** es un objeto informacional y sistémico.");
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
