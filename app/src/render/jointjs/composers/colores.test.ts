import { describe, expect, test } from "bun:test";
import { colorTextoParaFill, normalizarHex6 } from "./colores";

describe("composer colores", () => {
  test("elige tinta Codex para fills claros y transparentes", () => {
    expect(colorTextoParaFill("transparent")).toBe("#171511");
    expect(colorTextoParaFill("#ece9e1")).toBe("#171511");
  });

  test("elige tinta Codex para fill paper", () => {
    expect(colorTextoParaFill("#fafaf8")).toBe("#171511");
  });

  test("elige texto blanco para fill oscuro y normaliza hex corto", () => {
    expect(normalizarHex6("#fff")).toBe("#ffffff");
    expect(colorTextoParaFill("#123")).toBe("#ffffff");
  });
});
