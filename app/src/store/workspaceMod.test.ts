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

  test("cambiar el rol Biblioteca exige confirmación y quitarlo nunca restaura Apunte", () => {
    store.setState({
      indice: {
        modelos: [{ id: "modelo-rol", carpetaId: null }],
        carpetas: [],
        recientes: [],
      },
    });

    store.getState().toggleBibliotecaModelo("modelo-rol");
    expect(store.getState().indice.modelos[0]?.esBiblioteca).toBeUndefined();
    expect(store.getState().dialogoRolBibliotecaModeloId).toBe("modelo-rol");
    store.getState().cancelarRolBiblioteca();
    expect(store.getState().indice.modelos[0]?.esBiblioteca).toBeUndefined();

    store.getState().toggleBibliotecaModelo("modelo-rol");
    store.getState().confirmarRolBiblioteca();
    expect(store.getState().indice.modelos[0]?.esBiblioteca).toBe(true);

    store.getState().toggleBibliotecaModelo("modelo-rol");
    store.getState().confirmarRolBiblioteca();
    expect(store.getState().indice.modelos[0]).toEqual({ id: "modelo-rol", carpetaId: null });
  });
});
