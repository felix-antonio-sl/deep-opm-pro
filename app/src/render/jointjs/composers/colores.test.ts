import { describe, expect, test } from "bun:test";
import { colorTextoParaFill, normalizarHex6 } from "./colores";

describe("composer colores", () => {
  test("elige texto ink puro para fill objeto lavado V2 (verde papel)", () => {
    // CANON-V2 (ronda 28 L4): fill objeto pasa de #70E483 (verde V1) a
    // #EFF7EB (verde papel lavado). Ambos son claros → texto ink puro
    // `#0A0A0A` (antes #000002 cuasi-negro V1).
    expect(colorTextoParaFill("#EFF7EB")).toBe("#0A0A0A");
  });

  test("elige texto ink puro para fill proceso lavado V2 (azul papel)", () => {
    expect(colorTextoParaFill("#E8F0F8")).toBe("#0A0A0A");
  });

  test("elige texto blanco para fill oscuro y normaliza hex corto", () => {
    expect(normalizarHex6("#fff")).toBe("#ffffff");
    expect(colorTextoParaFill("#123")).toBe("#ffffff");
  });
});
