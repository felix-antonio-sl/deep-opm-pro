import { beforeEach, describe, expect, test } from "bun:test";
import { crearModelo } from "../modelo/operaciones";
import { exportarModelo } from "../serializacion/json";
import { store } from "../store";

describe("slice workspaceMod", () => {
  beforeEach(() => {
    store.getState().activarReadOnly(false);
    store.getState().importarJson(exportarModelo(crearModelo("Workspace")));
    store.getState().listarModelosGuardados();
  });

  test("abrirCarpeta actualiza la carpeta actual sin tocar el modelo", () => {
    store.getState().abrirCarpeta(null);
    expect(store.getState().carpetaActualId).toBeNull();
    expect(store.getState().modelo.opdRaizId).toBeTruthy();
  });

  test("crearVersionAhora no usa fallback local sin backend", async () => {
    store.setState({ modeloPersistidoId: "modelo-versionado" });

    await store.getState().crearVersionAhora({ descripcion: "manual" });

    expect(store.getState().mensaje).toBe("Backend de modelos no disponible");
  });
});
