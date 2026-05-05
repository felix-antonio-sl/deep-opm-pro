import { describe, expect, test } from "bun:test";
import { store } from "../store";

describe("slice seleccion", () => {
  test("setSeleccion mantiene seleccion simple y vaciarSeleccion limpia el estado", () => {
    store.getState().cargarDemo();
    const id = Object.keys(store.getState().modelo.entidades)[0]!;

    store.getState().setSeleccion([id]);
    expect(store.getState().seleccionId).toBe(id);
    expect(store.getState().seleccionados).toEqual([id]);

    store.getState().vaciarSeleccion();
    expect(store.getState().seleccionados).toEqual([]);
    expect(store.getState().seleccionId).toBeNull();
  });
});
