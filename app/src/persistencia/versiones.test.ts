import { beforeEach, describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto } from "../modelo/operaciones";
import {
  aplicarPoliticaLogScaleVersiones,
  claveVersion,
  crearVersion,
  crearVersionResultado,
  eliminarVersion,
  eliminarVersionResultado,
  filtrarVersionesVisibles,
  idsVersionesPodadas,
  listarVersiones,
  restaurarVersion,
  restaurarVersionResultado,
} from "./versiones";
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

  test("expone resultado tipado al crear y restaurar versiones", async () => {
    const modelo = crearModelo("Versionado");
    const creado = crearVersionResultado(modelo, { descripcion: "corte manual" });

    expect(creado.ok).toBe(true);
    if (!creado.ok) throw new Error(creado.error.mensaje);

    const restaurado = await restaurarVersionResultado(creado.value.modeloPayloadKey);
    expect(restaurado.ok).toBe(true);
    if (!restaurado.ok) throw new Error(restaurado.error.mensaje);
    expect(restaurado.value.nombre).toBe("Versionado");
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

  test("elimina con resultado tipado sin tocar formato del workspace", () => {
    const modelo = crearModelo("Versionado");
    const version = crearVersion(modelo, { nombre: "v1" });
    const workspace: WorkspaceIndice = {
      carpetas: [],
      modelos: [{ id: modelo.id, carpetaId: null, versiones: [version] }],
      recientes: [],
    };

    const actualizado = eliminarVersionResultado(workspace, modelo.id, version.id);
    expect(actualizado.ok).toBe(true);
    if (!actualizado.ok) throw new Error(actualizado.error.mensaje);
    expect(actualizado.value.modelos[0]?.versiones).toEqual([]);
  });

  test("devuelve errores tipados cuando storage local no esta disponible", async () => {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: undefined,
    });

    const modelo = crearModelo("Versionado");
    const creado = crearVersionResultado(modelo);
    expect(creado).toEqual({
      ok: false,
      error: { codigo: "storage_no_disponible", mensaje: "Storage local no disponible" },
    });

    const restaurado = await restaurarVersionResultado("version-inexistente");
    expect(restaurado).toEqual({
      ok: false,
      error: { codigo: "storage_no_disponible", mensaje: "Storage local no disponible" },
    });

    const eliminado = eliminarVersionResultado({
      carpetas: [],
      modelos: [{
        id: modelo.id,
        carpetaId: null,
        versiones: [{
          id: "v1",
          creadoEn: "2026-05-06T00:00:00.000Z",
          nombre: "v1",
          modeloPayloadKey: "deep-opm-pro:version:modelo:v1",
          bytes: 1,
        }],
      }],
      recientes: [],
    }, modelo.id, "v1");
    expect(eliminado).toEqual({
      ok: false,
      error: { codigo: "storage_no_disponible", mensaje: "Storage local no disponible" },
    });
  });

  test("devuelve error tipado si el payload de version no existe o es invalido", async () => {
    const versionId = "v1";
    localStorage.setItem(claveVersion("modelo", versionId), "{");

    const invalido = await restaurarVersionResultado(versionId);
    expect(invalido.ok).toBe(false);
    if (invalido.ok) throw new Error("Se esperaba error");
    expect(invalido.error.codigo).toBe("snapshot_corrupto");
    expect(invalido.error.detalle?.length).toBeGreaterThan(0);

    localStorage.removeItem(claveVersion("modelo", versionId));
    const faltante = await restaurarVersionResultado(claveVersion("modelo", versionId));
    expect(faltante).toEqual({
      ok: false,
      error: { codigo: "snapshot_no_encontrado", mensaje: "Snapshot de versión no encontrado" },
    });
    await expect(restaurarVersion(claveVersion("modelo", versionId))).rejects.toThrow("Snapshot de versión no encontrado");
  });

  test("tipa fallos de storage al escribir, leer y borrar versiones", async () => {
    const modelo = crearModelo("Versionado");

    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: storageConFallos({ setItem: true }),
    });
    expect(crearVersionResultado(modelo)).toEqual({
      ok: false,
      error: { codigo: "storage_escritura_fallida", mensaje: "No se pudo crear versión" },
    });

    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: storageConFallos({ getItem: true }),
    });
    expect(await restaurarVersionResultado(claveVersion(modelo.id, "v1"))).toEqual({
      ok: false,
      error: { codigo: "storage_lectura_fallida", mensaje: "No se pudo leer versión" },
    });

    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: storageConFallos({ removeItem: true }),
    });
    const eliminado = eliminarVersionResultado({
      carpetas: [],
      modelos: [{
        id: modelo.id,
        carpetaId: null,
        versiones: [{
          id: "v1",
          creadoEn: "2026-05-06T00:00:00.000Z",
          nombre: "v1",
          modeloPayloadKey: claveVersion(modelo.id, "v1"),
          bytes: 1,
        }],
      }],
      recientes: [],
    }, modelo.id, "v1");
    expect(eliminado).toEqual({
      ok: false,
      error: { codigo: "storage_borrado_fallido", mensaje: "No se pudo eliminar versión" },
    });
  });

  test("aplica política log-scale y máximo absoluto 10", () => {
    const base = new Date("2026-05-06T12:00:00.000Z");
    const versiones = Array.from({ length: 100 }, (_, index) => ({
      id: `v-${index}`,
      creadoEn: new Date(base.getTime() - index * 22 * 60 * 60 * 1000).toISOString(),
      nombre: `v-${index}`,
      modeloPayloadKey: `deep-opm-pro:version:modelo:v-${index}`,
      bytes: 10 + index,
    }));

    const retenidas = aplicarPoliticaLogScaleVersiones(versiones, base);

    expect(retenidas.length).toBeLessThanOrEqual(10);
    expect(retenidas[0]?.id).toBe("v-0");
    expect(idsVersionesPodadas(versiones, retenidas).length).toBe(90);
  });

  test("filtrarVersionesVisibles respeta toggle", () => {
    const versiones = [{
      id: "v1",
      creadoEn: "2026-05-06T00:00:00.000Z",
      nombre: "v1",
      modeloPayloadKey: "deep-opm-pro:version:modelo:v1",
      bytes: 1,
    }];
    expect(filtrarVersionesVisibles(versiones, false)).toEqual([]);
    expect(filtrarVersionesVisibles(versiones, true)).toHaveLength(1);
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

function storageConFallos(fallos: { setItem?: boolean; getItem?: boolean; removeItem?: boolean }): Storage {
  return {
    length: 1,
    key: () => claveVersion("modelo", "v1"),
    getItem: () => {
      if (fallos.getItem) throw new Error("getItem");
      return "{}";
    },
    setItem: () => {
      if (fallos.setItem) throw new Error("setItem");
    },
    removeItem: () => {
      if (fallos.removeItem) throw new Error("removeItem");
    },
    clear: () => undefined,
  } as Storage;
}
