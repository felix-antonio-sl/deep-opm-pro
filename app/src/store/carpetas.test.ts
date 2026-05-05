import { describe, expect, test } from "bun:test";
import { store } from "../store";

describe("slice carpetas", () => {
  test("dialogos de carpetas abren y cierran sin alterar seleccion", () => {
    store.getState().vaciarSeleccion();
    store.getState().abrirDialogoBuscarGlobal();
    expect(store.getState().dialogoBuscarGlobalAbierto).toBe(true);

    store.getState().cerrarDialogoBuscarGlobal();
    expect(store.getState().dialogoBuscarGlobalAbierto).toBe(false);
    expect(store.getState().seleccionados).toEqual([]);
  });
});
