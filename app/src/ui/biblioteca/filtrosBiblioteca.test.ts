/**
 * Tests del filtro puro de la Biblioteca dock (L3 ronda 20).
 *
 * Cubre: defaults, filtro tipo, filtro soloOpdActivo, query, combinaciones,
 * orden alfabético es-CL, conteo de apariciones global y por OPD activo.
 */
import { describe, expect, test } from "bun:test";
import type { Apariencia, Entidad, Modelo, Opd } from "../../modelo/tipos";
import {
  FILTROS_DEFAULT,
  filtrarEntidades,
  type FiltrosBiblioteca,
} from "./filtrosBiblioteca";

function entidad(id: string, nombre: string, tipo: "objeto" | "proceso" = "objeto"): Entidad {
  return {
    id,
    nombre,
    tipo,
    esencia: "fisica",
    afiliacion: "sistemica",
  };
}

function apariencia(id: string, entidadId: string, opdId: string): Apariencia {
  return {
    id,
    entidadId,
    opdId,
    x: 0,
    y: 0,
    width: 100,
    height: 60,
  };
}

function opdConApariencias(
  id: string,
  nombre: string,
  padreId: string | null,
  apariencias: Apariencia[],
): Opd {
  return {
    id,
    nombre,
    padreId,
    apariencias: Object.fromEntries(apariencias.map((a) => [a.id, a])),
    enlaces: {},
  };
}

function modeloFixture(): Modelo {
  const entidades: Modelo["entidades"] = {
    "e-motor": entidad("e-motor", "Motor", "objeto"),
    "e-pieza": entidad("e-pieza", "Pieza", "objeto"),
    "e-armar": entidad("e-armar", "Armar", "proceso"),
    "e-probar": entidad("e-probar", "Probar motor", "proceso"),
    "e-tornillo": entidad("e-tornillo", "Tornillo", "objeto"),
  };
  const opds: Modelo["opds"] = {
    "opd-raiz": opdConApariencias("opd-raiz", "SD", null, [
      apariencia("a-motor-raiz", "e-motor", "opd-raiz"),
      apariencia("a-armar-raiz", "e-armar", "opd-raiz"),
    ]),
    "opd-armar": opdConApariencias("opd-armar", "Armar in-zoom", "opd-raiz", [
      apariencia("a-motor-armar", "e-motor", "opd-armar"),
      apariencia("a-pieza-armar", "e-pieza", "opd-armar"),
      apariencia("a-armar-armar", "e-armar", "opd-armar"),
    ]),
  };
  return {
    id: "modelo-test",
    nombre: "Modelo test",
    opdRaizId: "opd-raiz",
    opds,
    entidades,
    estados: {},
    enlaces: {},
    nextSeq: 100,
  };
}

describe("filtrarEntidades", () => {
  test("defaults: devuelve todas las entidades ordenadas alfabeticamente es-CL", () => {
    const modelo = modeloFixture();
    const items = filtrarEntidades(modelo, "opd-raiz", FILTROS_DEFAULT);
    const nombres = items.map((i) => i.entidad.nombre);
    expect(nombres).toEqual(["Armar", "Motor", "Pieza", "Probar motor", "Tornillo"]);
  });

  test("filtro tipo=objeto: solo objetos", () => {
    const modelo = modeloFixture();
    const filtros: FiltrosBiblioteca = { ...FILTROS_DEFAULT, tipo: "objeto" };
    const items = filtrarEntidades(modelo, "opd-raiz", filtros);
    expect(items.map((i) => i.entidad.id)).toEqual(["e-motor", "e-pieza", "e-tornillo"]);
  });

  test("filtro tipo=proceso: solo procesos", () => {
    const modelo = modeloFixture();
    const filtros: FiltrosBiblioteca = { ...FILTROS_DEFAULT, tipo: "proceso" };
    const items = filtrarEntidades(modelo, "opd-raiz", filtros);
    expect(items.map((i) => i.entidad.id)).toEqual(["e-armar", "e-probar"]);
  });

  test('query="motor": filtra case-insensitive en nombre', () => {
    const modelo = modeloFixture();
    const filtros: FiltrosBiblioteca = { ...FILTROS_DEFAULT, query: "motor" };
    const items = filtrarEntidades(modelo, "opd-raiz", filtros);
    expect(items.map((i) => i.entidad.id)).toEqual(["e-motor", "e-probar"]);
  });

  test("query con espacios: trim aplicado, mayusculas/minusculas no importan", () => {
    const modelo = modeloFixture();
    const items = filtrarEntidades(modelo, "opd-raiz", {
      ...FILTROS_DEFAULT,
      query: "  MOTOR  ",
    });
    expect(items.map((i) => i.entidad.id)).toEqual(["e-motor", "e-probar"]);
  });

  test("soloOpdActivo=true en opd-raiz: solo entidades con apariencia ahi", () => {
    const modelo = modeloFixture();
    const filtros: FiltrosBiblioteca = { ...FILTROS_DEFAULT, soloOpdActivo: true };
    const items = filtrarEntidades(modelo, "opd-raiz", filtros);
    expect(items.map((i) => i.entidad.id)).toEqual(["e-armar", "e-motor"]);
  });

  test("soloOpdActivo=true en opd-armar: motor, pieza, armar", () => {
    const modelo = modeloFixture();
    const filtros: FiltrosBiblioteca = { ...FILTROS_DEFAULT, soloOpdActivo: true };
    const items = filtrarEntidades(modelo, "opd-armar", filtros);
    expect(items.map((i) => i.entidad.id)).toEqual(["e-armar", "e-motor", "e-pieza"]);
  });

  test("combinacion tipo=proceso + query=motor + soloOpdActivo=false", () => {
    const modelo = modeloFixture();
    const filtros: FiltrosBiblioteca = {
      tipo: "proceso",
      query: "motor",
      soloOpdActivo: false,
    };
    const items = filtrarEntidades(modelo, "opd-raiz", filtros);
    expect(items.map((i) => i.entidad.id)).toEqual(["e-probar"]);
  });

  test("combinacion tipo=objeto + soloOpdActivo=true en opd-raiz", () => {
    const modelo = modeloFixture();
    const filtros: FiltrosBiblioteca = {
      tipo: "objeto",
      query: "",
      soloOpdActivo: true,
    };
    const items = filtrarEntidades(modelo, "opd-raiz", filtros);
    expect(items.map((i) => i.entidad.id)).toEqual(["e-motor"]);
  });

  test("apareceEnOpdActivo y totalApariciones se calculan correctamente", () => {
    const modelo = modeloFixture();
    const items = filtrarEntidades(modelo, "opd-raiz", FILTROS_DEFAULT);
    const motor = items.find((i) => i.entidad.id === "e-motor");
    expect(motor?.apareceEnOpdActivo).toBe(true);
    expect(motor?.totalApariciones).toBe(2);
    const tornillo = items.find((i) => i.entidad.id === "e-tornillo");
    expect(tornillo?.apareceEnOpdActivo).toBe(false);
    expect(tornillo?.totalApariciones).toBe(0);
  });

  test("modelo sin entidades: devuelve lista vacia", () => {
    const modelo: Modelo = {
      ...modeloFixture(),
      entidades: {},
    };
    const items = filtrarEntidades(modelo, "opd-raiz", FILTROS_DEFAULT);
    expect(items).toEqual([]);
  });

  test("query sin coincidencias: lista vacia", () => {
    const modelo = modeloFixture();
    const items = filtrarEntidades(modelo, "opd-raiz", {
      ...FILTROS_DEFAULT,
      query: "zzz",
    });
    expect(items).toEqual([]);
  });
});
