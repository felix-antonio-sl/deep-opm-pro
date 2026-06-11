import { describe, expect, test } from "bun:test";
import { crearOpmStore } from "./store";

describe("crearOpmStore", () => {
  test("crea instancias frescas para tests sin reutilizar entidades del singleton previo", () => {
    const primero = crearOpmStore();
    primero.getState().crearObjetoDemo();
    expect(Object.values(primero.getState().modelo.entidades)).toHaveLength(1);

    const segundo = crearOpmStore();
    expect(Object.values(segundo.getState().modelo.entidades)).toHaveLength(0);
    expect(segundo.getState().dirty).toBe(false);
  });
});
