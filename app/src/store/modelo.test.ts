import { describe, expect, test } from "bun:test";
import { store } from "../store";

describe("slice modelo", () => {
  test("deshacer y rehacer conservan el historial publico", () => {
    store.getState().nuevoModelo();
    expect(store.getState().puedeDeshacer).toBe(false);

    store.getState().crearObjetoDemo();
    expect(store.getState().puedeDeshacer).toBe(true);
    const conObjeto = Object.keys(store.getState().modelo.entidades).length;

    store.getState().deshacer();
    expect(Object.keys(store.getState().modelo.entidades)).toHaveLength(0);
    expect(store.getState().puedeRehacer).toBe(true);

    store.getState().rehacer();
    expect(Object.keys(store.getState().modelo.entidades)).toHaveLength(conObjeto);
  });
});
