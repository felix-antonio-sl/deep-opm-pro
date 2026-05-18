import { describe, expect, test } from "bun:test";
import { panelOplMinimizadoEfectivo } from "./panelOplViewModel";

describe("panelOplMinimizadoEfectivo", () => {
  test("colapsa por default cuando no hay seleccion ni preferencia", () => {
    expect(panelOplMinimizadoEfectivo(undefined, null, null)).toBe(true);
  });

  test("expande por DataFlow cuando hay seleccion y el usuario no lo minimizo explicitamente", () => {
    expect(panelOplMinimizadoEfectivo(undefined, "ent-1", null)).toBe(false);
    expect(panelOplMinimizadoEfectivo(undefined, null, "link-1")).toBe(false);
  });

  test("respeta la preferencia explicita del usuario", () => {
    expect(panelOplMinimizadoEfectivo(false, null, null)).toBe(false);
    expect(panelOplMinimizadoEfectivo(true, "ent-1", null)).toBe(true);
  });
});
