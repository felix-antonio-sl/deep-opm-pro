// V-8: el export SVG preserva el canal alfa real; solo colapsa el caso opaco.
import { describe, expect, test } from "bun:test";
import { normalizarColoresSvg } from "./mapaExport";

describe("normalizarColoresSvg (V-8)", () => {
  test("colapsa rgba opaco a rgb", () => {
    expect(normalizarColoresSvg('<rect fill="rgba(23, 21, 17, 1)"/>')).toBe('<rect fill="rgb(23, 21, 17)"/>');
  });

  test("preserva el alfa semántico (<1) — sombra de esencia física", () => {
    const svg = '<feDropShadow flood-color="rgba(23, 21, 17, 0.68)"/>';
    expect(normalizarColoresSvg(svg)).toBe(svg);
  });

  test("mixto: normaliza opacos y conserva translúcidos en el mismo SVG", () => {
    const svg = '<g fill="rgba(1, 2, 3, 1)" stroke="rgba(4, 5, 6, 0.5)"/>';
    expect(normalizarColoresSvg(svg)).toBe('<g fill="rgb(1, 2, 3)" stroke="rgba(4, 5, 6, 0.5)"/>');
  });
});
