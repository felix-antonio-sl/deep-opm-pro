import { describe, expect, test } from "bun:test";
import { verificarEquivalencia } from "../modelo/equivalencia";
import type { Id, Modelo, Resultado } from "../modelo/tipos";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

function modeloMinimoConFrontiera(): { modelo: Modelo; padreId: Id; opdA: Id; opdB: Id; entA: Id; entB: Id } {
  const modelo: Modelo = {
    id: "m-ley",
    nombre: "Ley",
    opdRaizId: "r",
    opds: {
      r: { id: "r", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} },
      a: { id: "a", nombre: "SD1-A", padreId: "r", apariencias: {}, enlaces: {} },
      b: { id: "b", nombre: "SD1-B", padreId: "r", apariencias: {}, enlaces: {} },
    },
    entidades: {
      pa: { id: "pa", tipo: "proceso", nombre: "P", esencia: "informacional", afiliacion: "sistemica" },
      e1: { id: "e1", tipo: "objeto", nombre: "In", esencia: "fisica", afiliacion: "sistemica" },
      e2: { id: "e2", tipo: "objeto", nombre: "Out", esencia: "fisica", afiliacion: "sistemica" },
    },
    estados: {},
    enlaces: {
      c1: { id: "c1", tipo: "consumo", origenId: { kind: "entidad", id: "e1" }, destinoId: { kind: "entidad", id: "pa" }, etiqueta: "" },
      r1: { id: "r1", tipo: "resultado", origenId: { kind: "entidad", id: "pa" }, destinoId: { kind: "entidad", id: "e2" }, etiqueta: "" },
    },
    nextSeq: 100,
  };
  modelo.opds.r!.apariencias = {
    apa: { id: "apa", entidadId: "pa", opdId: "r", x: 200, y: 100, width: 140, height: 60 },
    ap1: { id: "ap1", entidadId: "e1", opdId: "r", x: 80, y: 120, width: 120, height: 50 },
    ap2: { id: "ap2", entidadId: "e2", opdId: "r", x: 360, y: 120, width: 120, height: 50 },
  };
  modelo.opds.r!.enlaces = {
    ae1: { id: "ae1", enlaceId: "c1", opdId: "r", vertices: [] },
    ae2: { id: "ae2", enlaceId: "r1", opdId: "r", vertices: [] },
  };
  modelo.opds.a!.apariencias = {
    apa: { id: "apa", entidadId: "pa", opdId: "a", x: 200, y: 100, width: 140, height: 60 },
    ap1: { id: "ap1", entidadId: "e1", opdId: "a", x: 80, y: 120, width: 120, height: 50 },
    ap2: { id: "ap2", entidadId: "e2", opdId: "a", x: 360, y: 120, width: 120, height: 50 },
  };
  modelo.opds.b!.apariencias = {
    apa: { id: "apa", entidadId: "pa", opdId: "b", x: 200, y: 100, width: 140, height: 60 },
    ap1: { id: "ap1", entidadId: "e1", opdId: "b", x: 80, y: 120, width: 120, height: 50 },
    ap2: { id: "ap2", entidadId: "e2", opdId: "b", x: 360, y: 120, width: 120, height: 50 },
  };
  return { modelo, padreId: "pa", opdA: "a", opdB: "b", entA: "e1", entB: "e2" };
}

describe("LEY law-equivalencia-frontera", () => {
  test("reflexiva: mismo OPD en ambos lados → equivalente", () => {
    const { modelo, padreId, opdA } = modeloMinimoConFrontiera();
    const r = verificarEquivalencia(modelo, { padreId, opdA, opdB: opdA });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.equivalente).toBe(true);
  });

  test("simetrica: intercambiar opdA/opdB no cambia el veredicto", () => {
    const { modelo, padreId, opdA, opdB } = modeloMinimoConFrontiera();
    const r1 = verificarEquivalencia(modelo, { padreId, opdA, opdB });
    const r2 = verificarEquivalencia(modelo, { padreId, opdA: opdB, opdB: opdA });
    expect(r1.ok && r2.ok).toBe(true);
    if (r1.ok && r2.ok) expect(r1.value.equivalente).toBe(r2.value.equivalente);
  });

  test("verificarEquivalencia es pura: no muta el modelo", () => {
    const { modelo, padreId, opdA, opdB } = modeloMinimoConFrontiera();
    const antes = JSON.stringify(modelo);
    verificarEquivalencia(modelo, { padreId, opdA, opdB });
    expect(JSON.stringify(modelo)).toBe(antes);
  });
});
