import { beforeEach, describe, expect, test } from "bun:test";
import { crearModelo } from "../modelo/operaciones";
import { exportarModelo } from "../serializacion/json";
import { store } from "../store";

describe("slice persistencia", () => {
  beforeEach(() => {
    instalarLocalStorage();
    store.getState().activarReadOnly(false);
    store.getState().importarJson(exportarModelo(crearModelo()));
  });

  test("listarModelosGuardados conserva el contrato de arreglo publico", () => {
    store.getState().listarModelosGuardados();
    expect(Array.isArray(store.getState().modelosGuardados)).toBe(true);
  });

  test("guardarLocal en read-only redirige a Guardar Como y deja copia editable", () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "Modelo publicado" });
    const idPublicado = store.getState().modeloPersistidoId;
    expect(idPublicado).toBeTruthy();

    store.getState().activarReadOnly(true);
    store.getState().guardarLocal();

    expect(store.getState().readOnly).toBe(false);
    expect(store.getState().modeloPersistidoId).not.toBe(idPublicado);
    expect(store.getState().modelo.nombre).toBe("Modelo publicado copia");
    expect(store.getState().mensaje).toBe("Modelo en solo lectura — guardando como copia nueva");
    expect(store.getState().modelosGuardados.map((modelo) => modelo.nombre).sort()).toEqual([
      "Modelo publicado",
      "Modelo publicado copia",
    ]);
  });

  test("BUG-20260602T014326Z-6ce450: Guardar como permite actualizar el modelo actual con su mismo nombre", () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "HODOM completo v14", descripcion: "Base" });
    const idPersistido = store.getState().modeloPersistidoId;
    expect(idPersistido).toBeTruthy();

    store.getState().crearProcesoDemo();
    expect(store.getState().dirty).toBe(true);
    store.getState().abrirGuardarComo();
    store.getState().guardarComoLocalConDescripcion({
      nombre: "HODOM completo v14",
      descripcion: "Actualizado desde Guardar como",
    });

    expect(store.getState().dialogoGuardarComoAbierto).toBe(false);
    expect(store.getState().modeloPersistidoId).toBe(idPersistido);
    expect(store.getState().dirty).toBe(false);
    expect(store.getState().descripcionModeloLocal).toBe("Actualizado desde Guardar como");
    expect(store.getState().modelosGuardados.filter((modelo) => modelo.nombre === "HODOM completo v14")).toHaveLength(1);
  });

  test("permite guardar modelos importados con version semantica en el nombre", () => {
    store.getState().importarJson(exportarModelo(crearModelo("HODOM completo v1.4")));

    store.getState().guardarComoLocalConDescripcion({
      nombre: "HODOM completo v1.4",
      descripcion: "Importado",
    });

    expect(store.getState().mensaje).toBe("Modelo guardado exitosamente");
    expect(store.getState().modeloPersistidoId).toBeTruthy();
    expect(store.getState().modelosGuardados).toContainEqual(expect.objectContaining({
      nombre: "HODOM completo v1.4",
      descripcion: "Importado",
    }));
  });
});

function instalarLocalStorage(): void {
  const datos = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => datos.get(key) ?? null,
      setItem: (key: string, value: string) => datos.set(key, value),
      removeItem: (key: string) => datos.delete(key),
      clear: () => datos.clear(),
    },
  });
}
