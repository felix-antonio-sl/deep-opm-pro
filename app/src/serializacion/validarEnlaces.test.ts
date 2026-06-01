import { describe, expect, test } from "bun:test";
import { extremoEntidad } from "../modelo/extremos";
import type { Enlace, Entidad, Estado, Opd } from "../modelo/tipos";
import {
  validarAbanicos,
  validarEnlaces,
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

  test("acepta subtipoModificador coherente y rechaza incoherente", () => {
    const entidadesProcedural: Record<string, Entidad> = {
      ...entidades,
      "p-1": { id: "p-1", tipo: "proceso", nombre: "Procesar", esencia: "informacional", afiliacion: "sistemica" },
    };
    const ok = validarEnlaces({
      "l-1": { id: "l-1", tipo: "consumo", origenId: extremoEntidad("e-1"), destinoId: extremoEntidad("p-1"), etiqueta: "", modificador: "evento", subtipoModificador: "E", probabilidad: 0.7 },
    }, entidadesProcedural, estados);
    expect(ok.ok).toBe(true);
    if (ok.ok) expect(ok.value["l-1"]?.subtipoModificador).toBe("E");

    const invalido = validarEnlaces({
      "l-1": { id: "l-1", tipo: "consumo", origenId: extremoEntidad("e-1"), destinoId: extremoEntidad("p-1"), etiqueta: "", modificador: "evento", subtipoModificador: "C" },
    }, entidadesProcedural, estados);
    expect(invalido.ok).toBe(false);
  });

  test("acepta multiplicidad canonica y rechaza invalida", () => {
    expect(validarMultiplicidadOpcional("l-1", "multiplicidadDestino", "1..N").ok).toBe(true);
    expect(validarMultiplicidadOpcional("l-1", "multiplicidadDestino", "abc").ok).toBe(false);
  });

  test("acepta abanico procedural con endpoint y portId compartidos", () => {
    const entidadesProcedural: Record<string, Entidad> = {
      ...entidades,
      "p-1": { id: "p-1", tipo: "proceso", nombre: "Procesar", esencia: "informacional", afiliacion: "sistemica" },
    };
    const enlaces: Record<string, Enlace> = {
      "l-1": { id: "l-1", tipo: "consumo", origenId: extremoEntidad("e-2"), destinoId: { kind: "entidad", id: "p-1", portId: "port-fan" }, etiqueta: "" },
      "l-2": { id: "l-2", tipo: "consumo", origenId: extremoEntidad("e-3"), destinoId: { kind: "entidad", id: "p-1", portId: "port-fan" }, etiqueta: "" },
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
      "ab-1": { id: "ab-1", opdId: "opd-1", puertoEntidadId: "p-1", operador: "O", enlaceIds: ["l-1", "l-2"] },
    }, opds, enlaces, entidadesProcedural, estados);

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value["ab-1"]).toMatchObject({
      puertoEntidadId: "p-1",
      puertoComun: {
        entidadId: "p-1",
        lado: "destino",
        portId: "port-fan",
      },
    });
  });

  test("rechaza abanico cuyo puerto comun declarado no coincide con las ramas", () => {
    const entidadesProcedural: Record<string, Entidad> = {
      ...entidades,
      "p-1": { id: "p-1", tipo: "proceso", nombre: "Procesar", esencia: "informacional", afiliacion: "sistemica" },
    };
    const enlaces: Record<string, Enlace> = {
      "l-1": { id: "l-1", tipo: "consumo", origenId: extremoEntidad("e-2"), destinoId: { kind: "entidad", id: "p-1", portId: "port-fan" }, etiqueta: "" },
      "l-2": { id: "l-2", tipo: "consumo", origenId: extremoEntidad("e-3"), destinoId: { kind: "entidad", id: "p-1", portId: "port-fan" }, etiqueta: "" },
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
      "ab-1": {
        id: "ab-1",
        opdId: "opd-1",
        puertoEntidadId: "p-1",
        puertoComun: { entidadId: "p-1", lado: "destino", portId: "otro-puerto" },
        operador: "O",
        enlaceIds: ["l-1", "l-2"],
      },
    }, opds, enlaces, entidadesProcedural, estados);

    expect(resultado.ok).toBe(false);
  });

  test("rechaza abanico estructural aunque comparta entidad", () => {
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

    expect(resultado.ok).toBe(false);
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
