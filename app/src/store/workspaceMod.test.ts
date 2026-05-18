import { beforeEach, describe, expect, test } from "bun:test";
import { crearModelo } from "../modelo/operaciones";
import { exportarModelo } from "../serializacion/json";
import { store } from "../store";

describe("slice workspaceMod", () => {
  beforeEach(() => {
    instalarLocalStorage();
    store.getState().activarReadOnly(false);
    store.getState().importarJson(exportarModelo(crearModelo("Workspace")));
    store.getState().listarModelosGuardados();
  });

  test("abrirCarpeta actualiza la carpeta actual sin tocar el modelo", () => {
    store.getState().abrirCarpeta(null);
    expect(store.getState().carpetaActualId).toBeNull();
    expect(store.getState().modelo.opdRaizId).toBeTruthy();
  });

  test("crearVersionAhora propaga error tipado de version sin lanzar excepcion", async () => {
    const storage = instalarLocalStorage();
    store.getState().guardarComoLocal({ nombre: "Versionado" });

    storage.fallarSetVersion = true;
    await store.getState().crearVersionAhora({ descripcion: "manual" });

    expect(store.getState().mensaje).toBe("No se pudo crear versión");
  });
});

function instalarLocalStorage(): { fallarSetVersion: boolean } {
  const datos = new Map<string, string>();
  const control = { fallarSetVersion: false };
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      get length() {
        return datos.size;
      },
      key: (index: number) => Array.from(datos.keys())[index] ?? null,
      getItem: (key: string) => datos.get(key) ?? null,
      setItem: (key: string, value: string) => {
        if (control.fallarSetVersion && key.startsWith("deep-opm-pro:version:")) throw new Error("setItem");
        datos.set(key, value);
      },
      removeItem: (key: string) => datos.delete(key),
      clear: () => datos.clear(),
    },
  });
  return control;
}
