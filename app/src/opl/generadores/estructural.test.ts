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

  test("exhibicion opcional emite forma posesiva natural", () => {
    const modelo = modeloAuto();
    const enlace: Enlace = {
      id: "l1",
      tipo: "exhibicion",
      origenId: { kind: "entidad", id: "auto" },
      destinoId: { kind: "entidad", id: "techo" },
      etiqueta: "",
      multiplicidadDestino: "0..1",
    };

    expect(oracionEnlaceEstructural(modelo, enlace)).toBe("**Auto** tiene un **Techo Descapotable** opcional.");
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

describe("oracionEntidad — visibilidad de esencia (VisibilidadOpl)", () => {
  const base: Entidad = { id: "o1", tipo: "objeto", nombre: "Sensor", esencia: "informacional", afiliacion: "sistemica" };

  test("siempre (default): emite esencia y afiliación", () => {
    expect(oracionEntidad(base)).toEqual(["**Sensor** es informacional.", "**Sensor** es sistémico."]);
  });

  test("oculta: no emite ni esencia ni afiliación", () => {
    expect(oracionEntidad(base, { esencia: "oculta" })).toEqual([]);
  });

  test("solo-difiere: omite las que coinciden con el default canónico", () => {
    expect(oracionEntidad(base, { esencia: "solo-difiere" })).toEqual([]);
  });

  test("solo-difiere: emite solo las que difieren del default", () => {
    const fisicoAmbiental: Entidad = { ...base, esencia: "fisica", afiliacion: "ambiental" };
    expect(oracionEntidad(fisicoAmbiental, { esencia: "solo-difiere" })).toEqual(["**Sensor** es físico.", "**Sensor** es ambiental."]);
  });

  test("solo-difiere: caso mixto (esencia default, afiliación difiere)", () => {
    const mixto: Entidad = { ...base, afiliacion: "ambiental" };
    expect(oracionEntidad(mixto, { esencia: "solo-difiere" })).toEqual(["**Sensor** es ambiental."]);
  });

  test("proceso físico: solo-difiere emite la esencia que difiere del default", () => {
    const proceso: Entidad = { id: "p1", tipo: "proceso", nombre: "Combustión", esencia: "fisica", afiliacion: "sistemica" };
    expect(oracionEntidad(proceso, { esencia: "solo-difiere" })).toEqual(["*Combustión* es físico."]);
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

function modeloAuto(): Modelo {
  return {
    id: "m1",
    nombre: "M",
    opdRaizId: "opd",
    opds: { opd: { id: "opd", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} } },
    entidades: {
      auto: { id: "auto", tipo: "objeto", nombre: "Auto", esencia: "informacional", afiliacion: "sistemica" },
      techo: { id: "techo", tipo: "objeto", nombre: "Techo Descapotable", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {},
    enlaces: {},
    nextSeq: 1,
  };
}
