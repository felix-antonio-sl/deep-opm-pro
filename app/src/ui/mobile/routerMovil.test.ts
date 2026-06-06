import { describe, expect, test } from "bun:test";
import { parsearPathMobile, construirPathMobile, VISTAS_VALIDAS } from "./routerMovil";

describe("parsearPathMobile", () => {
  test("null si no empieza por /m/", () => {
    expect(parsearPathMobile("/")).toBeNull();
    expect(parsearPathMobile("/modelo/foo")).toBeNull();
    expect(parsearPathMobile("")).toBeNull();
  });

  test("parsea /m/:modeloId base", () => {
    expect(parsearPathMobile("/m/mi-modelo")).toEqual({
      modeloId: "mi-modelo",
      opdId: null,
      vista: null,
    });
  });

  test("parsea /m/:modeloId/opd/:opdId", () => {
    expect(parsearPathMobile("/m/mi-modelo/opd/opd-123")).toEqual({
      modeloId: "mi-modelo",
      opdId: "opd-123",
      vista: null,
    });
  });

  test("parsea /m/:modeloId/vista/:vista", () => {
    expect(parsearPathMobile("/m/mi-modelo/vista/opl")).toEqual({
      modeloId: "mi-modelo",
      opdId: null,
      vista: "opl",
    });
  });

  test("parsea /m/:modeloId/opd/:opdId/vista/:vista completa", () => {
    expect(parsearPathMobile("/m/mi-modelo/opd/opd-123/vista/diagrama")).toEqual({
      modeloId: "mi-modelo",
      opdId: "opd-123",
      vista: "diagrama",
    });
  });

  test("ignora segmentos malformados después de lo válido", () => {
    expect(parsearPathMobile("/m/mi-modelo/opd/opd-123/extra/vista/opl")).toEqual({
      modeloId: "mi-modelo",
      opdId: "opd-123",
      vista: null,
    });
  });

  test("rechaza IDs vacíos", () => {
    expect(parsearPathMobile("/m/")).toBeNull();
  });

  test("rechaza IDs con caracteres inválidos", () => {
    expect(parsearPathMobile("/m/mi modelo")).toBeNull();
    expect(parsearPathMobile("/m/mi%20modelo")).toBeNull(); // decodeURIComponent falla el regex
  });

  test("vista inválida devuelve null en vista", () => {
    expect(parsearPathMobile("/m/mi-modelo/vista/inexistente")).toEqual({
      modeloId: "mi-modelo",
      opdId: null,
      vista: null,
    });
  });

  test("IDs con guiones, puntos, dos puntos y underscores", () => {
    expect(parsearPathMobile("/m/modelo-hodom_v1.6:completo")).toEqual({
      modeloId: "modelo-hodom_v1.6:completo",
      opdId: null,
      vista: null,
    });
  });
});

describe("construirPathMobile", () => {
  test("reconstruye path mínimo", () => {
    expect(construirPathMobile({ modeloId: "mi-modelo", opdId: null, vista: null })).toBe("/m/mi-modelo");
  });

  test("reconstruye con opd", () => {
    expect(construirPathMobile({ modeloId: "mi-modelo", opdId: "opd-123", vista: null })).toBe("/m/mi-modelo/opd/opd-123");
  });

  test("reconstruye con vista", () => {
    expect(construirPathMobile({ modeloId: "mi-modelo", opdId: null, vista: "acerca" })).toBe("/m/mi-modelo/vista/acerca");
  });

  test("reconstruye completa", () => {
    expect(construirPathMobile({ modeloId: "mi-modelo", opdId: "opd-123", vista: "diagrama" })).toBe("/m/mi-modelo/opd/opd-123/vista/diagrama");
  });

  test("ignora vista inválida", () => {
    expect(construirPathMobile({ modeloId: "mi-modelo", opdId: null, vista: "invalid" })).toBe("/m/mi-modelo");
  });

  test("codifica segmentos", () => {
    expect(construirPathMobile({ modeloId: "a b", opdId: null, vista: null })).toBe("/m/a%20b");
  });
});
