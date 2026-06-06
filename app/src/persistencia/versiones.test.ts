import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto } from "../modelo/operaciones";
import {
  aplicarPoliticaLogScaleVersiones,
  construirVersionPersistible,
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

describe("versiones manuales backend-only", () => {
  test("crea metadata y payload persistible sin storage navegador", () => {
    const modelo = crearModelo("Versionado");
    const persistible = construirVersionPersistible(modelo, { descripcion: "corte manual" });

    expect(persistible.version.descripcion).toBe("corte manual");
    expect(persistible.version.modeloPayloadKey).toBe(persistible.version.id);
    expect(persistible.json).toContain("Versionado");
    expect(crearVersionResultado(modelo, { descripcion: "corte manual" })).toEqual({
      ok: true,
      value: expect.objectContaining({ descripcion: "corte manual" }),
    });
  });

  test("restaurarVersion exige backend y falla de forma explicita", async () => {
    await expect(restaurarVersion("v1")).rejects.toThrow("Versión no disponible sin backend");
    expect(await restaurarVersionResultado("v1")).toEqual({
      ok: false,
      error: { codigo: "version_no_encontrada", mensaje: "Versión no disponible sin backend" },
    });
  });

  test("lista versiones recientes primero y elimina referencia del workspace", () => {
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

  test("aplica política log-scale y máximo absoluto 10", () => {
    const base = new Date("2026-05-06T12:00:00.000Z");
    const versiones = Array.from({ length: 100 }, (_, index) => ({
      id: `v-${index}`,
      creadoEn: new Date(base.getTime() - index * 22 * 60 * 60 * 1000).toISOString(),
      nombre: `v-${index}`,
      modeloPayloadKey: `version-${index}`,
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
      modeloPayloadKey: "v1",
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
