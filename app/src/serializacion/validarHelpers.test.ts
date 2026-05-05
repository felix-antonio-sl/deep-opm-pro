import { describe, expect, test } from "bun:test";
import type { Modelo } from "../modelo/tipos";
import { esNumeroFinito, esRecord, esTipoEntidad } from "./validarHelpers";
import { validarReferenciasOpd } from "./validarIntegridad";
import { normalizarVersiones } from "./validarNormalizacion";

describe("validarHelpers", () => {
  test("esRecord distingue objetos de null y arrays", () => {
    expect(esRecord(null)).toBe(false);
    expect(esRecord([])).toBe(false);
    expect(esRecord({})).toBe(true);
  });

  test("guards de entidad y numeros finitos", () => {
    expect(esTipoEntidad("objeto")).toBe(true);
    expect(esTipoEntidad("foo")).toBe(false);
    expect(esNumeroFinito(Number.NaN)).toBe(false);
    expect(esNumeroFinito(Infinity)).toBe(false);
    expect(esNumeroFinito(0)).toBe(true);
  });

  test("normalizarVersiones descarta array invalido", () => {
    expect(normalizarVersiones("no-array")).toEqual([]);
    expect(normalizarVersiones([{ id: "v1" }])).toEqual([]);
  });

  test("validarReferenciasOpd falla si una apariencia apunta a enlace inexistente", () => {
    const modelo: Modelo = {
      id: "m-1",
      nombre: "Modelo",
      opdRaizId: "opd-1",
      nextSeq: 1,
      entidades: {},
      estados: {},
      enlaces: {},
      abanicos: {},
      opds: {
        "opd-1": {
          id: "opd-1",
          nombre: "SD",
          padreId: null,
          apariencias: {},
          enlaces: {
            "ae-1": { id: "ae-1", enlaceId: "missing", opdId: "opd-1", vertices: [] },
          },
        },
      },
    };

    const resultado = validarReferenciasOpd(modelo);

    expect(resultado.ok).toBe(false);
  });
});
