import { beforeEach, describe, expect, test } from "bun:test";
import { crearModelo } from "../modelo/operaciones";
import { exportarModelo } from "../serializacion/json";
import { store } from "../store";

describe("slice carpetas", () => {
  beforeEach(() => {
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

  test("restaurarVersionComoCopia no usa fallback local sin backend", async () => {
    store.setState({
      modelosGuardados: [{
        id: "modelo-versionado",
        nombre: "Versionado",
        descripcion: "",
        creadoEn: "2026-06-06T00:00:00.000Z",
        actualizadoEn: "2026-06-06T00:00:00.000Z",
        versiones: [{
          id: "version-1",
          nombre: "Inicial",
          creadoEn: "2026-06-06T00:00:00.000Z",
          modeloPayloadKey: "version-1",
          bytes: 10,
        }],
      }],
    });

    await store.getState().restaurarVersionComoCopia("modelo-versionado", "version-1");

    expect(store.getState().mensaje).toBe("Backend de modelos no disponible");
  });

  test("eliminarVersionPorId no borra en navegador sin backend", () => {
    store.setState({
      indice: {
        modelos: [{ id: "modelo-versionado", carpetaId: null, versiones: [{
          id: "version-1",
          nombre: "Inicial",
          creadoEn: "2026-06-06T00:00:00.000Z",
          modeloPayloadKey: "version-1",
          bytes: 10,
        }] }],
        carpetas: [],
        recientes: [],
      },
      modelosGuardados: [{
        id: "modelo-versionado",
        nombre: "Versionado",
        descripcion: "",
        creadoEn: "2026-06-06T00:00:00.000Z",
        actualizadoEn: "2026-06-06T00:00:00.000Z",
        versiones: [{
          id: "version-1",
          nombre: "Inicial",
          creadoEn: "2026-06-06T00:00:00.000Z",
          modeloPayloadKey: "version-1",
          bytes: 10,
        }],
      }],
    });

    store.getState().eliminarVersionPorId("modelo-versionado", "version-1");

    expect(store.getState().mensaje).toBe("Backend de modelos no disponible");
  });
});
