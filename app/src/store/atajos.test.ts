import { describe, expect, test } from "bun:test";
import {
  ATAJOS_SLICE_KEYS,
  createAtajosSlice,
  incrementarFrecuenciaUsoCommandPalette,
} from "./atajos";
import type { OpmStore } from "./tipos";

describe("frecuencia Command Palette", () => {
  test("expone una capacidad de atajos con contrato propio", () => {
    const slice = createAtajosSlice(() => undefined, () => ({
      frecuenciaUsoCommandPalette: {},
    } as OpmStore));

    expect(Object.keys(slice).sort()).toEqual([...ATAJOS_SLICE_KEYS].sort());
  });

  test("incrementa item existente sin mutar el mapa original", () => {
    const actual = { "accion-inzoom": 2 };
    const siguiente = incrementarFrecuenciaUsoCommandPalette(actual, "accion-inzoom");

    expect(siguiente).toEqual({ "accion-inzoom": 3 });
    expect(actual).toEqual({ "accion-inzoom": 2 });
  });

  test("ignora ids vacios", () => {
    expect(incrementarFrecuenciaUsoCommandPalette({ a: 1 }, " ")).toEqual({ a: 1 });
  });

  test("registrarUsoCommandPalette actualiza frecuencia en memoria del slice", () => {
    const estado = { frecuenciaUsoCommandPalette: {} as Record<string, number> };
    const slice = createAtajosSlice((partial) => Object.assign(estado, partial), () => estado as OpmStore);

    slice.registrarUsoCommandPalette("menu-tabla-enlaces");
    slice.registrarUsoCommandPalette("menu-tabla-enlaces");

    expect(estado.frecuenciaUsoCommandPalette).toEqual({ "menu-tabla-enlaces": 2 });
  });
});
