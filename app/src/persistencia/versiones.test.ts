import { beforeEach, describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto } from "../modelo/operaciones";
import { claveVersion, crearVersion, eliminarVersion, listarVersiones, restaurarVersion } from "./versiones";
import type { WorkspaceIndice } from "./workspace";

describe("versiones manuales L4", () => {
  beforeEach(() => {
    instalarLocalStorage();
  });

  test("crea snapshot manual restaurable desde localStorage", async () => {
    const modelo = crearModelo("Versionado");
    const version = crearVersion(modelo, { descripcion: "corte manual" });

    expect(version.descripcion).toBe("corte manual");
    expect(typeof localStorage.getItem(claveVersion(modelo.id, version.id))).toBe("string");

    const restaurado = await restaurarVersion(version.id);
    expect(restaurado.nombre).toBe("Versionado");
    expect(restaurado.id).toBe(modelo.id);
  });

  test("lista versiones recientes primero y elimina payload asociado", () => {
    let modelo = crearModelo("Versionado");
    const v1 = { ...crearVersion(modelo, { nombre: "v1" }), creadoEn: "2026-05-05T00:00:00.000Z" };
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 10, y: 20 }, "Objeto"));
    const v2 = { ...crearVersion(modelo, { nombre: "v2" }), creadoEn: "2026-05-05T00:00:01.000Z" };
    const workspace: WorkspaceIndice = {
      carpetas: [],
      modelos: [{ id: modelo.id, carpetaId: null, versiones: [v1, v2] }],
      recientes: [],
    };

    expect(listarVersiones(workspace, modelo.id).map((version) => version.id)).toEqual([v2.id, v1.id]);

    const actualizado = eliminarVersion(workspace, modelo.id, v1.id);
    expect(actualizado.modelos[0]?.versiones?.map((version) => version.id)).toEqual([v2.id]);
    expect(localStorage.getItem(v1.modeloPayloadKey)).toBeNull();
  });
});

function must<T>(resultado: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function instalarLocalStorage(): void {
  const datos = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      get length() {
        return datos.size;
      },
      key: (index: number) => Array.from(datos.keys())[index] ?? null,
      getItem: (key: string) => datos.get(key) ?? null,
      setItem: (key: string, value: string) => datos.set(key, value),
      removeItem: (key: string) => datos.delete(key),
      clear: () => datos.clear(),
    },
  });
}
