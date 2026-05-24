import { describe, expect, test } from "bun:test";
import { normalizarVelocidadSimulacion } from "./simulacion";

describe("normalizarVelocidadSimulacion", () => {
  test("clamp continuo al rango [0.25, 4]", () => {
    expect(normalizarVelocidadSimulacion(0.25)).toBe(0.25);
    expect(normalizarVelocidadSimulacion(4)).toBe(4);
    expect(normalizarVelocidadSimulacion(1.7)).toBe(1.7);
  });
  test("recorta fuera de rango a los extremos", () => {
    expect(normalizarVelocidadSimulacion(0.1)).toBe(0.25);
    expect(normalizarVelocidadSimulacion(10)).toBe(4);
  });
  test("NaN cae a 1; ±Infinity al extremo correspondiente", () => {
    expect(normalizarVelocidadSimulacion(Number.NaN)).toBe(1);
    expect(normalizarVelocidadSimulacion(Number.POSITIVE_INFINITY)).toBe(4);
    expect(normalizarVelocidadSimulacion(Number.NEGATIVE_INFINITY)).toBe(1);
  });
});
