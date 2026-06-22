import { describe, expect, test } from "bun:test";
import { agruparEstereotipos } from "./estereotiposVitrina";
import { ESTEREOTIPO_REQUIREMENT_ID } from "./estereotipos";
import type { PlantillaEstereotipo } from "./tipos";

/**
 * D6.4 — agrupación pura para la Vitrina de estereotipos.
 * Marcadores (sin plantilla) / objetos (1 entidad) / enlaces (2 ent + ≥1 enlace)
 * / patrones compuestos (resto con plantilla). Sin DOM, sin store.
 */

function plantillaCon(entidades: number, enlaces: number): PlantillaEstereotipo {
  const ents: Record<string, never> = {};
  for (let i = 0; i < entidades; i += 1) ents[`o-${i + 1}`] = {} as never;
  const enls: Record<string, never> = {};
  for (let i = 0; i < enlaces; i += 1) enls[`e-${i + 1}`] = {} as never;
  return {
    entidades: ents as never,
    estados: {},
    enlaces: enls as never,
    apariencias: {},
  };
}

describe("agruparEstereotipos", () => {
  test("el requirement de fábrica (sin plantilla) cae en marcadores", () => {
    const grupos = agruparEstereotipos([
      { id: ESTEREOTIPO_REQUIREMENT_ID, nombre: "Requirement" },
    ]);
    expect(grupos.marcadores.map((e) => e.id)).toEqual([ESTEREOTIPO_REQUIREMENT_ID]);
    expect(grupos.objetos).toHaveLength(0);
    expect(grupos.enlaces).toHaveLength(0);
    expect(grupos.patrones).toHaveLength(0);
  });

  test("una plantilla de 1 entidad cae en objetos", () => {
    const grupos = agruparEstereotipos([
      { id: "est-1", nombre: "Servicio", plantilla: plantillaCon(1, 0) },
    ]);
    expect(grupos.objetos.map((e) => e.id)).toEqual(["est-1"]);
    expect(grupos.enlaces).toHaveLength(0);
    expect(grupos.patrones).toHaveLength(0);
  });

  test("una plantilla de 2 entidades + 1 enlace cae en enlaces", () => {
    const grupos = agruparEstereotipos([
      { id: "est-2", nombre: "Flujo", plantilla: plantillaCon(2, 1) },
    ]);
    expect(grupos.enlaces.map((e) => e.id)).toEqual(["est-2"]);
    expect(grupos.objetos).toHaveLength(0);
    expect(grupos.patrones).toHaveLength(0);
  });

  test("2 entidades sin enlace y 3+ entidades caen en patrones compuestos", () => {
    const grupos = agruparEstereotipos([
      { id: "est-3", nombre: "Par suelto", plantilla: plantillaCon(2, 0) },
      { id: "est-4", nombre: "Triada", plantilla: plantillaCon(3, 2) },
    ]);
    expect(grupos.patrones.map((e) => e.id)).toEqual(["est-3", "est-4"]);
    expect(grupos.enlaces).toHaveLength(0);
    expect(grupos.objetos).toHaveLength(0);
  });
});
