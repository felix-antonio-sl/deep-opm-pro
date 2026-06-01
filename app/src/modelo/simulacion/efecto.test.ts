import { describe, expect, test } from "bun:test";
import { efectoUnico, tomarUnico, type Efecto } from "./efecto";

describe("simulacion/efecto", () => {
  test("efectoUnico produce exactamente un sucesor con peso 1 (F=Identidad)", () => {
    const e = efectoUnico({ n: 7 });
    expect(e.sucesores.length).toBe(1);
    expect(e.sucesores[0]!.peso).toBe(1);
    expect(e.sucesores[0]!.estado).toEqual({ n: 7 });
  });

  test("tomarUnico devuelve el estado del primer sucesor", () => {
    expect(tomarUnico(efectoUnico("x"))).toBe("x");
  });

  test("tomarUnico lanza si no hay sucesores", () => {
    const vacio: Efecto<number> = { sucesores: [] };
    expect(() => tomarUnico(vacio)).toThrow();
  });
});
