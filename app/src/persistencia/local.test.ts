import { beforeEach, describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto } from "../modelo/operaciones";
import { exportarModelo } from "../serializacion/json";
import { borrarModeloLocal, cargarModeloLocal, guardarModeloLocal, listarModelosLocales } from "./local";

describe("persistencia local estructurada", () => {
  beforeEach(() => {
    instalarLocalStorage();
  });

  test("lista, guarda, carga y borra modelos locales", () => {
    const modelo = crearModelo("Modelo persistente");
    const guardado = guardarModeloLocal({
      nombre: modelo.nombre,
      descripcion: "corte local",
      json: exportarModelo(modelo),
    });
    expect(guardado.ok).toBe(true);
    if (!guardado.ok) return;

    const listado = listarModelosLocales();
    expect(listado.ok).toBe(true);
    if (!listado.ok) return;
    expect(listado.value).toEqual([
      expect.objectContaining({
        id: guardado.value.id,
        nombre: "Modelo persistente",
        descripcion: "corte local",
      }),
    ]);

    const cargado = cargarModeloLocal(guardado.value.id);
    expect(cargado.ok).toBe(true);
    if (!cargado.ok) return;
    expect(cargado.value.json).toBe(exportarModelo(modelo));

    const borrado = borrarModeloLocal(guardado.value.id);
    expect(borrado.ok).toBe(true);
    expect(listarModelosLocales()).toEqual({ ok: true, value: [] });
  });

  test("guardar con id existente actualiza sin duplicar el indice", () => {
    const modelo = crearModelo("Modelo incremental");
    const inicial = guardarModeloLocal({ nombre: modelo.nombre, json: exportarModelo(modelo) });
    expect(inicial.ok).toBe(true);
    if (!inicial.ok) return;

    const actualizadoModelo = crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 });
    expect(actualizadoModelo.ok).toBe(true);
    if (!actualizadoModelo.ok) return;
    const actualizado = guardarModeloLocal({
      id: inicial.value.id,
      nombre: "Modelo incremental actualizado",
      json: exportarModelo(actualizadoModelo.value),
    });
    expect(actualizado.ok).toBe(true);
    if (!actualizado.ok) return;

    const listado = listarModelosLocales();
    expect(listado.ok).toBe(true);
    if (!listado.ok) return;
    expect(listado.value).toHaveLength(1);
    expect(listado.value[0]?.id).toBe(inicial.value.id);
    expect(listado.value[0]?.nombre).toBe("Modelo incremental actualizado");
    expect(cargarModeloLocal(inicial.value.id)).toEqual(expect.objectContaining({
      ok: true,
      value: expect.objectContaining({ json: exportarModelo(actualizadoModelo.value) }),
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
