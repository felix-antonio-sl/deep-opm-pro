import { describe, expect, test } from "bun:test";
import { store } from "../store";

describe("slice workspaceMod", () => {
  test("abrirCarpeta actualiza la carpeta actual sin tocar el modelo", () => {
    store.getState().abrirCarpeta(null);
    expect(store.getState().carpetaActualId).toBeNull();
    expect(store.getState().modelo.opdRaizId).toBeTruthy();
  });
});
