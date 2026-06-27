import { describe, expect, test } from "bun:test";
import { createModeloSlice } from "../modelo";
import type { OpmStore } from "../tipos";
import {
  MODELO_SLICE_CAPABILITIES,
  MODELO_SLICE_KEYS,
  MODELO_SLICE_OPTIONAL_INITIAL_KEYS,
} from "./contrato";

describe("contrato del slice modelo", () => {
  test("agrupa claves por capacidades sin duplicados", () => {
    const claves = MODELO_SLICE_KEYS;
    expect(new Set(claves).size).toBe(claves.length);
    expect(Object.keys(MODELO_SLICE_CAPABILITIES).sort()).toEqual([
      "anclaje",
      "appFlow",
      "canvasCommands",
      "entityCommands",
      "linkCommands",
      "opdCommands",
      "oplCommands",
      "sessionState",
      "stateCommands",
    ]);
  });

  test("el composer runtime expone el contrato declarado", () => {
    const slice = createModeloSlice(() => undefined, () => ({} as OpmStore));
    const declaradasIniciales = [...MODELO_SLICE_KEYS]
      .filter((clave) => !MODELO_SLICE_OPTIONAL_INITIAL_KEYS.includes(clave as never))
      .sort();

    expect(Object.keys(slice).sort()).toEqual(declaradasIniciales);
  });
});
