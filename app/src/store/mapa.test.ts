import { describe, expect, test } from "bun:test";
import { store } from "../store";

describe("slice mapa", () => {
  test("abrirVistaMapa crea descriptor derivado y cerrarVistaMapa lo limpia", () => {
    store.getState().cargarDemo();

    store.getState().abrirVistaMapa();
    expect(store.getState().vistaMapaActiva).toBe(true);
    expect(store.getState().descriptorMapaCache).not.toBeNull();

    store.getState().cerrarVistaMapa();
    expect(store.getState().vistaMapaActiva).toBe(false);
    expect(store.getState().descriptorMapaCache).toBeNull();
  });
});
