import { describe, expect, test } from "bun:test";
import {
  ESTEREOTIPO_REQUIREMENT_ID,
  enumerarEstereotipos,
  esRequisito,
  estereotipoDe,
} from "./estereotipos";
import type { Entidad, Estereotipo, Modelo } from "./tipos";

function entidad(parcial: Partial<Entidad>): Entidad {
  return {
    id: "o-1",
    tipo: "objeto",
    nombre: "Cosa",
    esencia: "informacional",
    afiliacion: "sistemica",
    ...parcial,
  };
}

function modelo(estereotipos?: Record<string, Estereotipo>): Modelo {
  return {
    id: "m",
    nombre: "M",
    opdRaizId: "opd-raiz",
    opds: {},
    entidades: {},
    estados: {},
    enlaces: {},
    nextSeq: 1,
    ...(estereotipos ? { estereotipos } : {}),
  };
}

describe("estereotipos kernel", () => {
  test("esRequisito: true para el estereotipo de fábrica de requisito", () => {
    expect(esRequisito(entidad({ estereotipoId: ESTEREOTIPO_REQUIREMENT_ID }))).toBe(true);
  });

  test("esRequisito: false para otro estereotipo, sin estereotipo y undefined", () => {
    expect(esRequisito(entidad({ estereotipoId: "est-7" }))).toBe(false);
    expect(esRequisito(entidad({}))).toBe(false);
    expect(esRequisito(undefined)).toBe(false);
  });

  test("estereotipoDe: resuelve el de fábrica (requirement) sin estar en el catálogo", () => {
    const resuelto = estereotipoDe(modelo(), ESTEREOTIPO_REQUIREMENT_ID);
    expect(resuelto?.id).toBe(ESTEREOTIPO_REQUIREMENT_ID);
    expect(resuelto?.nombre).toBe("Requirement");
  });

  test("estereotipoDe: resuelve uno del catálogo del modelo", () => {
    const cat = { "est-1": { id: "est-1", nombre: "Actor" } };
    expect(estereotipoDe(modelo(cat), "est-1")?.nombre).toBe("Actor");
  });

  test("estereotipoDe: undefined cuando no existe ni en fábrica ni en catálogo", () => {
    expect(estereotipoDe(modelo(), "est-inexistente")).toBeUndefined();
  });

  test("enumerarEstereotipos: incluye fábrica + catálogo con orden estable por id", () => {
    const cat = {
      "est-2": { id: "est-2", nombre: "Beta" },
      "est-1": { id: "est-1", nombre: "Alfa" },
    };
    const lista = enumerarEstereotipos(modelo(cat));
    // Orden estable por id (ASCII): "-" (0x2D) ordena antes que ":" (0x3A).
    expect(lista.map((e) => e.id)).toEqual(["est-1", "est-2", ESTEREOTIPO_REQUIREMENT_ID]);
    // Y siempre incluye fábrica + catálogo completos.
    expect(new Set(lista.map((e) => e.id))).toEqual(new Set([ESTEREOTIPO_REQUIREMENT_ID, "est-1", "est-2"]));
  });

  test("enumerarEstereotipos: solo la fábrica cuando no hay catálogo", () => {
    expect(enumerarEstereotipos(modelo()).map((e) => e.id)).toEqual([ESTEREOTIPO_REQUIREMENT_ID]);
  });
});
