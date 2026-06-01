import { describe, expect, test } from "bun:test";
import { rngSembrado } from "./rng";

describe("simulacion/rng", () => {
  test("misma semilla -> misma secuencia (reproducible)", () => {
    const a = rngSembrado(42), b = rngSembrado(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
  test("semillas distintas -> secuencias distintas", () => {
    const a = rngSembrado(1), b = rngSembrado(2);
    expect(a()).not.toBe(b());
  });
  test("valores en [0, 1)", () => {
    const r = rngSembrado(7);
    for (let i = 0; i < 100; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});
