import { describe, expect, test } from "bun:test";
import { extremoEntidad } from "../modelo/extremos";
import type { Enlace, Entidad, Estado, Opd } from "../modelo/tipos";
import {
  validarAbanicos,
  validarEnlaces,
  validarEstiloEnlaceOpcional,
  validarMultiplicidadOpcional,
} from "./validarEnlaces";

const entidades: Record<string, Entidad> = {
  "e-1": { id: "e-1", tipo: "objeto", nombre: "Todo", esencia: "fisica", afiliacion: "sistemica" },
  "e-2": { id: "e-2", tipo: "objeto", nombre: "Parte A", esencia: "fisica", afiliacion: "sistemica" },
  "e-3": { id: "e-3", tipo: "objeto", nombre: "Parte B", esencia: "fisica", afiliacion: "sistemica" },
};
const estados: Record<string, Estado> = {};

describe("validarEnlaces", () => {
  test("acepta enlace de agregacion entre objetos", () => {
    const resultado = validarEnlaces({
      "l-1": { id: "l-1", tipo: "agregacion", origenId: extremoEntidad("e-1"), destinoId: extremoEntidad("e-2"), etiqueta: "" },
    }, entidades, estados);

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value["l-1"]?.tipo).toBe("agregacion");
  });

  test("acepta multiplicidad canonica y rechaza invalida", () => {
    expect(validarMultiplicidadOpcional("l-1", "multiplicidadDestino", "1..N").ok).toBe(true);
    expect(validarMultiplicidadOpcional("l-1", "multiplicidadDestino", "abc").ok).toBe(false);
  });

  test("acepta estilo de enlace", () => {
    const resultado = validarEstiloEnlaceOpcional("l-1", { color: "#FF0000", strokeWidth: 3, dashArray: "4 4" });

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value).toEqual({ color: "#ff0000", strokeWidth: 3, dashArray: "4 4" });
  });

  test("acepta abanico con enlaces del mismo tipo", () => {
    const enlaces: Record<string, Enlace> = {
      "l-1": { id: "l-1", tipo: "agregacion", origenId: extremoEntidad("e-1"), destinoId: extremoEntidad("e-2"), etiqueta: "" },
      "l-2": { id: "l-2", tipo: "agregacion", origenId: extremoEntidad("e-1"), destinoId: extremoEntidad("e-3"), etiqueta: "" },
    };
    const opds: Record<string, Opd> = {
      "opd-1": {
        id: "opd-1",
        nombre: "SD",
        padreId: null,
        apariencias: {},
        enlaces: {
          "ae-1": { id: "ae-1", enlaceId: "l-1", opdId: "opd-1", vertices: [] },
          "ae-2": { id: "ae-2", enlaceId: "l-2", opdId: "opd-1", vertices: [] },
        },
      },
    };

    const resultado = validarAbanicos({
      "ab-1": { id: "ab-1", opdId: "opd-1", puertoEntidadId: "e-1", operador: "O", enlaceIds: ["l-1", "l-2"] },
    }, opds, enlaces, entidades, estados);

    expect(resultado.ok).toBe(true);
  });

  test("rechaza abanico con tipos de enlace distintos", () => {
    const enlaces: Record<string, Enlace> = {
      "l-1": { id: "l-1", tipo: "agregacion", origenId: extremoEntidad("e-1"), destinoId: extremoEntidad("e-2"), etiqueta: "" },
      "l-2": { id: "l-2", tipo: "exhibicion", origenId: extremoEntidad("e-1"), destinoId: extremoEntidad("e-3"), etiqueta: "" },
    };
    const opds: Record<string, Opd> = {
      "opd-1": {
        id: "opd-1",
        nombre: "SD",
        padreId: null,
        apariencias: {},
        enlaces: {
          "ae-1": { id: "ae-1", enlaceId: "l-1", opdId: "opd-1", vertices: [] },
          "ae-2": { id: "ae-2", enlaceId: "l-2", opdId: "opd-1", vertices: [] },
        },
      },
    };

    const resultado = validarAbanicos({
      "ab-1": { id: "ab-1", opdId: "opd-1", puertoEntidadId: "e-1", operador: "O", enlaceIds: ["l-1", "l-2"] },
    }, opds, enlaces, entidades, estados);

    expect(resultado.ok).toBe(false);
  });
});
