import { beforeEach, describe, expect, test } from "bun:test";
import { crearModelo } from "../modelo/operaciones";
import { exportarModelo } from "../serializacion/json";
import { store } from "../store";

describe("slice carpetas", () => {
  beforeEach(() => {
    instalarLocalStorage();
    store.getState().activarReadOnly(false);
    store.getState().importarJson(exportarModelo(crearModelo("Carpetas")));
    store.getState().listarModelosGuardados();
  });

  test("dialogos de carpetas abren y cierran sin alterar seleccion", () => {
    store.getState().vaciarSeleccion();
    store.getState().abrirDialogoBuscarGlobal();
    expect(store.getState().dialogoBuscarGlobalAbierto).toBe(true);

    store.getState().cerrarDialogoBuscarGlobal();
    expect(store.getState().dialogoBuscarGlobalAbierto).toBe(false);
    expect(store.getState().seleccionados).toEqual([]);
  });

  test("restaurarVersionComoCopia propaga error tipado si falta payload", async () => {
    const storage = instalarLocalStorage();
    store.getState().guardarComoLocal({ nombre: "Versionado", crearVersionAlGuardar: true });
    const modeloId = store.getState().modeloPersistidoId;
    const version = store.getState().modelosGuardados.find((modelo) => modelo.id === modeloId)?.versiones?.[0];
    expect(modeloId).toBeTruthy();
    expect(version).toBeTruthy();
    if (!modeloId || !version) throw new Error("No se creo version inicial");

    storage.datos.delete(version.modeloPayloadKey);
    await store.getState().restaurarVersionComoCopia(modeloId, version.id);

    expect(store.getState().mensaje).toBe("Snapshot de versión no encontrado");
  });

  test("eliminarVersionPorId propaga error tipado de borrado", () => {
    const storage = instalarLocalStorage();
    store.getState().guardarComoLocal({ nombre: "Versionado", crearVersionAlGuardar: true });
    const modeloId = store.getState().modeloPersistidoId;
    const version = store.getState().modelosGuardados.find((modelo) => modelo.id === modeloId)?.versiones?.[0];
    expect(modeloId).toBeTruthy();
    expect(version).toBeTruthy();
    if (!modeloId || !version) throw new Error("No se creo version inicial");

    storage.fallarRemoveVersion = true;
    store.getState().eliminarVersionPorId(modeloId, version.id);

    expect(store.getState().mensaje).toBe("No se pudo eliminar versión");
  });
});

function instalarLocalStorage(): { datos: Map<string, string>; fallarRemoveVersion: boolean } {
  const datos = new Map<string, string>();
  const control = { datos, fallarRemoveVersion: false };
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      get length() {
        return datos.size;
      },
      key: (index: number) => Array.from(datos.keys())[index] ?? null,
      getItem: (key: string) => datos.get(key) ?? null,
      setItem: (key: string, value: string) => datos.set(key, value),
      removeItem: (key: string) => {
        if (control.fallarRemoveVersion && key.startsWith("deep-opm-pro:version:")) throw new Error("removeItem");
        datos.delete(key);
      },
      clear: () => datos.clear(),
    },
  });
  return control;
}
