import { describe, expect, test } from "bun:test";
import { store } from "../store";

describe("slice enlaces", () => {
  test("elegirTipoEnlace abre modo enlace y cancelarEnlace lo limpia", () => {
    store.getState().cargarDemo();
    const id = Object.keys(store.getState().modelo.entidades)[0]!;

    store.getState().seleccionarEntidad(id);
    store.getState().elegirTipoEnlace("instrumento");
    expect(store.getState().modoEnlace).toEqual({ tipo: "instrumento", origenId: id });

    store.getState().cancelarEnlace();
    expect(store.getState().modoEnlace).toBeNull();
  });
});
