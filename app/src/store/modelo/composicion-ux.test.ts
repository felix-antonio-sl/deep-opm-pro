import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { crearEnlace, crearModelo, crearObjeto, crearProceso } from "../../modelo/operaciones";
import type { Id, Modelo, Resultado } from "../../modelo/tipos";
import { guardarModeloLocal } from "../../persistencia/local";
import { exportarModelo } from "../../serializacion/json";
import { store } from "../../store";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function entidadId(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

beforeEach(() => {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: storageFake(),
  });
  store.getState().importarJson(exportarModelo(crearModelo("Base")));
});

afterEach(() => {
  Reflect.deleteProperty(globalThis, "localStorage");
});

describe("componerConModeloGuardado — UX del Piso 1", () => {
  test("abre y cierra el diálogo de composición", () => {
    store.getState().abrirDialogoComposicion();
    expect(store.getState().dialogoComposicionAbierto).toBe(true);

    store.getState().cerrarDialogoComposicion();
    expect(store.getState().dialogoComposicionAbierto).toBe(false);
  });

  test("carga un modelo guardado, aplica compartidas y materializa el compuesto en el modelo activo", () => {
    let a = crearModelo("Modelo A");
    a = must(crearObjeto(a, a.opdRaizId, { x: 20, y: 80 }, "Cliente"));
    a = must(crearProceso(a, a.opdRaizId, { x: 220, y: 80 }, "Comprar"));
    a = must(crearEnlace(a, a.opdRaizId, entidadId(a, "Cliente"), entidadId(a, "Comprar"), "consumo"));

    let b = crearModelo("Modelo B");
    b = must(crearObjeto(b, b.opdRaizId, { x: 20, y: 80 }, "Cliente"));
    b = must(crearObjeto(b, b.opdRaizId, { x: 300, y: 80 }, "Factura"));
    const clienteA = entidadId(a, "Cliente");
    const clienteB = entidadId(b, "Cliente");

    store.getState().importarJson(exportarModelo(a));
    const guardado = guardarModeloLocal({
      id: "modelo-b",
      nombre: "Modelo B",
      json: exportarModelo(b),
    });
    expect(guardado.ok).toBe(true);
    store.getState().abrirDialogoComposicion();

    store.getState().componerConModeloGuardado({
      modeloId: "modelo-b",
      compartidas: { [clienteB]: clienteA },
    });

    const estado = store.getState();
    expect(estado.dialogoComposicionAbierto).toBe(false);
    expect(estado.opdActivoId).toBe(estado.modelo.opdRaizId);
    expect(estado.puedeDeshacer).toBe(true);
    expect(estado.mensaje).toContain("Modelo compuesto");
    expect(Object.values(estado.modelo.entidades).filter((entidad) => entidad.nombre === "Cliente")).toHaveLength(1);
    expect(Object.values(estado.modelo.entidades).some((entidad) => entidad.nombre === "Factura")).toBe(true);
  });

  test("informa error si el modelo local no existe y no muta el modelo activo", () => {
    const antes = exportarModelo(store.getState().modelo);

    store.getState().componerConModeloGuardado({ modeloId: "inexistente", compartidas: {} });

    expect(exportarModelo(store.getState().modelo)).toBe(antes);
    expect(store.getState().mensaje).toBe("Modelo local no encontrado");
  });
});

function storageFake(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    key(index: number) {
      return [...data.keys()][index] ?? null;
    },
    getItem(key: string) {
      return data.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      data.set(key, value);
    },
    removeItem(key: string) {
      data.delete(key);
    },
    clear() {
      data.clear();
    },
  };
}
