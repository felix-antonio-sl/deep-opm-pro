import { describe, expect, test } from "bun:test";
import { debeAnimarTokensSim, tokensViajeDelPaso } from "./animacionTokens";
import type { FocoPasoSimulacion } from "./foco";

const focoEn = (opdId: string, enlaces: string[]): FocoPasoSimulacion => ({
  paso: { opdId } as FocoPasoSimulacion["paso"],
  procesoActivoId: "p1",
  entidadesInvolucradasIds: [],
  enlacesInvolucradosIds: enlaces,
});

describe("debeAnimarTokensSim", () => {
  test("anima cuando el paso vive en el OPD visible y no es headless", () => {
    expect(debeAnimarTokensSim(focoEn("SD", ["e1"]), "SD", false)).toBe(true);
  });
  test("no anima en headless", () => {
    expect(debeAnimarTokensSim(focoEn("SD", ["e1"]), "SD", true)).toBe(false);
  });
  test("no anima si el paso está en otro OPD", () => {
    expect(debeAnimarTokensSim(focoEn("SD1", ["e1"]), "SD", false)).toBe(false);
  });
  test("no anima sin paso activo", () => {
    const sinPaso: FocoPasoSimulacion = { paso: null, procesoActivoId: null, entidadesInvolucradasIds: [], enlacesInvolucradosIds: [] };
    expect(debeAnimarTokensSim(sinPaso, "SD", false)).toBe(false);
  });
  test("no anima sin enlaces", () => {
    expect(debeAnimarTokensSim(focoEn("SD", []), "SD", false)).toBe(false);
  });
});

describe("tokensViajeDelPaso", () => {
  test("devuelve los enlaces involucrados del foco", () => {
    expect(tokensViajeDelPaso(focoEn("SD", ["e1", "e2"]))).toEqual(["e1", "e2"]);
  });
});
