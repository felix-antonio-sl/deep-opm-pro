import { describe, expect, test } from "bun:test";
import { store } from "../store";

describe("slice persistencia", () => {
  test("listarModelosGuardados conserva el contrato de arreglo publico", () => {
    store.getState().listarModelosGuardados();
    expect(Array.isArray(store.getState().modelosGuardados)).toBe(true);
  });
});
