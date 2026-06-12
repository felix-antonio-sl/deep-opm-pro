// V-8: el export SVG preserva el canal alfa real; solo colapsa el caso opaco.
import { describe, expect, test } from "bun:test";
import { normalizarColoresSvg, removerChromeEdicionSvg } from "./mapaExport";

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

describe("removerChromeEdicionSvg (V-227)", () => {
  test("remueve halos de selección balanceando grupos anidados", () => {
    const svg = '<svg><g model-id="e-1"><rect/></g><g model-id="seleccion-ap-1" class="x"><g><path/></g></g><g model-id="e-2"/></svg>';
    const limpio = removerChromeEdicionSvg(svg);
    expect(limpio).not.toContain("seleccion-ap-1");
    expect(limpio).toContain('model-id="e-1"');
    expect(limpio).toContain('model-id="e-2"');
  });

  test("remueve la capa de tools de JointJS", () => {
    const svg = '<svg><g class="joint-tools-layer"><g><circle/></g></g><g model-id="e-1"><rect/></g></svg>';
    const limpio = removerChromeEdicionSvg(svg);
    expect(limpio).not.toContain("joint-tools");
    expect(limpio).toContain('model-id="e-1"');
  });

  test("CONSERVA el canal de simulación (snapshot declarado, R-OPD-SIM-6)", () => {
    const svg = '<svg><g model-id="sim-proceso-ap-1"><ellipse data-opm-sim="process-active"/></g></svg>';
    expect(removerChromeEdicionSvg(svg)).toBe(svg);
  });
});
