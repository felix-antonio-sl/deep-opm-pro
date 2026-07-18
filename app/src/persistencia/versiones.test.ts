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

  test("aplica política log-scale y máximo 10 cuando no hay versiones preservadas", () => {
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

  test("protege el hito recién insertado aunque su timestamp caiga fuera del bucket", () => {
    const ahora = new Date("2026-07-17T12:00:00.000Z");
    const futuras = Array.from({ length: 10 }, (_, index) => ({
      id: `future-${index}`,
      creadoEn: `2027-01-01T00:00:${String(index).padStart(2, "0")}.000Z`,
      nombre: `future-${index}`,
      modeloPayloadKey: `future-${index}`,
      bytes: 1,
    }));
    const hito = {
      id: "hito-commit",
      creadoEn: ahora.toISOString(),
      nombre: "hito",
      modeloPayloadKey: "hito-commit",
      bytes: 1,
    };

    const retenidas = aplicarPoliticaLogScaleVersiones(
      [...futuras, hito],
      ahora,
      10,
      hito.id,
    );

    expect(retenidas).toHaveLength(10);
    expect(retenidas.some((version) => version.id === hito.id)).toBe(true);
  });

  test("maxTotal=1 conserva toda versión preservar=true y también el hito protegido", () => {
    const ahora = new Date("2026-07-18T12:00:00.000Z");
    const preservadaA = {
      id: "preservada-a",
      creadoEn: "2026-07-18T11:00:00.000Z",
      nombre: "preservada A",
      preservar: true,
      modeloPayloadKey: "preservada-a",
      bytes: 1,
    };
    const preservadaB = {
      id: "preservada-b",
      creadoEn: "2026-07-18T11:30:00.000Z",
      nombre: "preservada B",
      preservar: true,
      modeloPayloadKey: "preservada-b",
      bytes: 1,
    };
    const protegida = {
      id: "hito-commit",
      creadoEn: "2026-07-18T09:00:00.000Z",
      nombre: "hito",
      modeloPayloadKey: "hito-commit",
      bytes: 1,
    };
    const descartable = {
      id: "descartable",
      creadoEn: "2026-07-18T10:00:00.000Z",
      nombre: "descartable",
      modeloPayloadKey: "descartable",
      bytes: 1,
    };

    const retenidas = aplicarPoliticaLogScaleVersiones(
      [preservadaA, preservadaB, protegida, descartable],
      ahora,
      1,
      protegida.id,
    );

    expect(retenidas.map((version) => version.id).sort()).toEqual([
      "hito-commit",
      "preservada-a",
      "preservada-b",
    ]);
    expect(idsVersionesPodadas(
      [preservadaA, preservadaB, protegida, descartable],
      retenidas,
    )).toEqual(["descartable"]);
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
