import { describe, expect, test } from "bun:test";
import { colorTextoParaFill, normalizarHex6 } from "./colores";

describe("composer colores", () => {
  test("elige texto oscuro para fill claro canonico", () => {
    expect(colorTextoParaFill("#70E483")).toBe("#000002");
  });

  test("elige texto blanco para fill oscuro y normaliza hex corto", () => {
    expect(normalizarHex6("#fff")).toBe("#ffffff");
    expect(colorTextoParaFill("#123")).toBe("#ffffff");
  });
});
