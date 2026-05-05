import { describe, expect, test } from "bun:test";
import { limitarAnchoPanel } from "./divisorPanel";

describe("divisor arrastrable del panel de árbol", () => {
  test("normaliza el ancho dentro del rango operativo", () => {
    expect(limitarAnchoPanel(80)).toBe(160);
    expect(limitarAnchoPanel(240)).toBe(240);
    expect(limitarAnchoPanel(900)).toBe(600);
  });

  test("recupera el ancho por defecto cuando el valor no es numerico", () => {
    expect(limitarAnchoPanel(Number.NaN)).toBe(240);
    expect(limitarAnchoPanel(Number.POSITIVE_INFINITY)).toBe(240);
  });
});
