import { describe, expect, test } from "bun:test";
import { GRID_DEFAULT, clampValor, cuantizarPosicion, normalizarGridConfig, pasoGrid } from "./grid";

describe("canvas/grid", () => {
  test("cuantiza coordenadas al paso efectivo", () => {
    expect(cuantizarPosicion(24, 26, { ...GRID_DEFAULT, paso: 10, escala: 2 })).toEqual({ x: 20, y: 20 });
    expect(pasoGrid({ ...GRID_DEFAULT, paso: 12, escala: 1.5 })).toBe(18);
  });

  test("snap inactivo conserva la posicion original", () => {
    expect(cuantizarPosicion(24, 26, { ...GRID_DEFAULT, snapActivo: false })).toEqual({ x: 24, y: 26 });
    expect(cuantizarPosicion(24, 26, { ...GRID_DEFAULT, activa: false })).toEqual({ x: 24, y: 26 });
  });

  test("normaliza configuracion parcial y acota valores", () => {
    expect(normalizarGridConfig({ paso: 0, escala: 99, color: "red", strokeWidth: -1 })).toEqual({
      ...GRID_DEFAULT,
      paso: 4,
      escala: 8,
      strokeWidth: 0.5,
    });
  });

  test("clampValor limita dentro de rango", () => {
    expect(clampValor(70, 200, 30)).toBe(70);
    expect(clampValor(70, 200, 230)).toBe(200);
    expect(clampValor(70, 200, 120)).toBe(120);
  });
});
