import { describe, expect, test } from "bun:test";
import type { Entidad } from "../../modelo/tipos";
import {
  generarPreviewEstadoAdicional,
  generarPreviewEstadosIniciales,
  normalizarNombreEstado,
  validarNombreEstado,
} from "./previewEstadosOpl";

const entidad: Entidad = {
  id: "o-1",
  tipo: "objeto",
  nombre: "Orden",
  esencia: "informacional",
  afiliacion: "sistemica",
};

describe("validarNombreEstado", () => {
  test("rechaza vacío", () => {
    expect(validarNombreEstado("", [])).toEqual({ ok: false, razon: "El nombre no puede estar vacío" });
  });

  test("rechaza whitespace", () => {
    expect(validarNombreEstado("   ", [])).toEqual({ ok: false, razon: "El nombre no puede estar vacío" });
  });

  test("rechaza duplicado local case-insensitive", () => {
    expect(validarNombreEstado(" abierto ", ["Abierto"])).toEqual({ ok: false, razon: "Ya existe un estado con ese nombre" });
  });

  test("rechaza caracteres de control", () => {
    expect(validarNombreEstado("abierto\ncerrado", [])).toEqual({ ok: false, razon: "El nombre contiene caracteres no permitidos" });
  });

  test("rechaza nombres sobre 200 caracteres", () => {
    expect(validarNombreEstado("a".repeat(201), [])).toEqual({ ok: false, razon: "El nombre excede 200 caracteres" });
  });

  test("normaliza espacios internos y retorna nombre válido", () => {
    expect(validarNombreEstado("  en   espera  ", [])).toEqual({ ok: true, nombre: "en espera" });
  });
});

describe("normalizarNombreEstado", () => {
  test("hace trim y colapsa espacios internos", () => {
    expect(normalizarNombreEstado("  en   espera  ")).toBe("en espera");
  });
});

describe("generarPreviewEstadosIniciales", () => {
  test("genera OPL D8 con dos nombres válidos", () => {
    expect(generarPreviewEstadosIniciales(entidad, "abierta", "cerrada")).toEqual({
      texto: "**Orden** se encuentra en uno de los siguientes estados: **abierta** o **cerrada**.",
      esValido: true,
    });
  });

  test("retorna inválido si falta un nombre", () => {
    expect(generarPreviewEstadosIniciales(entidad, "abierta", "")).toMatchObject({
      texto: "",
      esValido: false,
      error: "El nombre no puede estar vacío",
    });
  });
});

describe("generarPreviewEstadoAdicional", () => {
  test("genera preview para estado adicional", () => {
    expect(generarPreviewEstadoAdicional(entidad, "pausada")).toEqual({
      texto: "**Orden** suma el estado **pausada**.",
      esValido: true,
    });
  });

  test("retorna inválido si duplica uno existente", () => {
    expect(generarPreviewEstadoAdicional(entidad, "cerrada", ["cerrada"])).toMatchObject({
      texto: "",
      esValido: false,
      error: "Ya existe un estado con ese nombre",
    });
  });
});
