import { describe, expect, test } from "bun:test";
import { colors, radii, shadows, spacing, stroke, tokens, transitions, typography } from "./tokens";

/**
 * Ronda Codex L1 - tokens editoriales.
 *
 * Intencion preservada respecto de la bateria anterior:
 *   1. El canvas semantico OPCloud/JOYAS permanece invariante y lo migra L4.
 *   2. La paleta chrome pivota a Codex: papel, tinta, crimson UI-only y canon OPM.
 *   3. Los aliases legacy siguen disponibles via compat-shim.
 *   4. Los pares activos mantienen contraste WCAG.
 */

describe("tokens.colors - contrato Codex [ronda-codex L1]", () => {
  test("paleta canvas semantica permanece invariante [JOYAS §1]", () => {
    expect(colors.canvas.objeto).toBe("#70E483");
    expect(colors.canvas.objetoSuave).toBe("#70e483");
    expect(colors.canvas.proceso).toBe("#3BC3FF");
    expect(colors.canvas.procesoSuave).toBe("#3bc3ff");
    expect(colors.canvas.enlace).toBe("#586D8C");
    expect(colors.canvas.enlaceSuave).toBe("#586d8c");
    expect(colors.canvas.fill).toBe("#fdffff");
    expect(colors.canvas.texto).toBe("#000002");
  });

  test("paleta Codex base expone papel, tinta, crimson y canon OPM", () => {
    expect(colors.paper).toBe("#fafaf8");
    expect(colors.paperWarm).toBe("#eeece2");
    expect(colors.ink).toBe("#171511");
    expect(colors.inkMid).toBe("#5a564c");
    expect(colors.inkSoft).toBe("#807b6e");
    expect(colors.inkFaint).toBe("#b5b0a4");
    expect(colors.rule).toBe("#d3cec1");
    expect(colors.ruleStrong).toBe("#aea899");
    expect(colors.crimson).toBe("#8e2a2e");
    expect(colors.opm.object).toBe("#27613f");
    expect(colors.opm.process).toBe("#1d3f78");
    expect(colors.opm.state).toBe("#68711f");
    expect(colors.opm.stateFill).toBe("#dedacb");
  });

  test("crimson es UI-only y no colisiona con el canon OPM/canvas", () => {
    expect(colors.accent).toBe(colors.crimson);
    expect(colors.focus).toBe(colors.crimson);
    expect(colors.crimson).not.toBe(colors.canvas.proceso);
    expect(colors.crimson).not.toBe(colors.opm.process);
  });

  test("compat-shim conserva claves vivas de alta frecuencia", () => {
    expect(colors.ink15).toBe(colors.rule);
    expect(colors.fondoChrome).toBe(colors.paper);
    expect(colors.fondoCard).toBe(colors.paperWarm);
    expect(colors.bordeControl).toBe(colors.ruleStrong);
    expect(colors.textoPrimario).toBe(colors.ink);
    expect(colors.textoSecundario).toBe(colors.inkMid);
    expect(colors.exitoBase).toBe(colors.opm.object);
    expect(colors.azulAccion).toBe(colors.crimson);
    expect(colors.verdeOpl).toBe(colors.opm.object);
    expect(colors.oplTokenTexto).toBe(colors.inkSoft);
  });

  test("tokens agregados exponen el modulo central completo", () => {
    expect(tokens.colors).toBe(colors);
    expect(tokens.spacing).toBe(spacing);
    expect(tokens.radii).toBe(radii);
    expect(tokens.stroke).toBe(stroke);
    expect(tokens.shadows).toBe(shadows);
    expect(tokens.transitions).toBe(transitions);
    expect(tokens.typography).toBe(typography);
    expect(tokens.bibliotecaDock).toBeDefined();
    expect(tokens.inspectorTabs).toBeDefined();
    expect(tokens.editorOplHonesto).toBeDefined();
    expect(tokens.mobileNav).toBeDefined();
  });

  test("spacing preserva la escala 4/8/16/24/32/48 para compatibilidad", () => {
    expect(spacing).toEqual({ xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 });
  });

  test("radii Codex colapsa el chrome a cero y conserva capsulas", () => {
    expect(radii.none).toBe(0);
    expect(radii.xs).toBe(0);
    expect(radii.sm).toBe(0);
    expect(radii.control).toBe(0);
    expect(radii.md).toBe(0);
    expect(radii.lg).toBe(0);
    expect(radii.xl).toBe(0);
    expect(radii.pill).toBe(999);
    expect(radii.full).toBe(9999);
  });

  test("stroke expone hairline/base/bold y canon OPM aditivo", () => {
    expect(stroke.hairline).toBe(1);
    expect(stroke.base).toBe(1.5);
    expect(stroke.bold).toBe(2);
    expect(stroke.opm.object).toBe(1.5);
    expect(stroke.opm.process).toBe(1.5);
    expect(stroke.opm.state).toBe(1.2);
    expect(stroke.opm.link).toBe(1);
    expect(stroke.opm.triangle).toBe(1.2);
  });

  test("shadows Codex elimina blur/elevacion y conserva rings especiales", () => {
    expect(shadows.none).toBe("none");
    expect(shadows.flat).toBe("none");
    expect(shadows.flatLarge).toBe("none");
    expect(shadows.flatXl).toBe("none");
    expect(shadows.card).toBe("none");
    expect(shadows.popover).toBe("none");
    expect(shadows.modal).toBe("none");
    expect(shadows.dialogo).toBe("none");
    expect(shadows.dropProceso).toContain(colors.crimson);
    expect(shadows.panelInset).toContain(colors.rule);
    expect(shadows.seleccionadoInset).toContain(colors.crimson);
    expect(shadows.swatchActivo).toContain(colors.crimson);
  });

  test("transitions Codex usa timings breves para cambios de color", () => {
    expect(transitions.fast).toBe("120ms ease");
    expect(transitions.base).toBe("120ms ease");
    expect(transitions.slow).toBe("150ms ease");
  });

  test("typography Codex usa Inria y conserva Arial canvas [JOYAS §3]", () => {
    expect(typography.serif.startsWith('"Inria Serif"')).toBe(true);
    expect(typography.sans.startsWith('"Inria Sans"')).toBe(true);
    expect(typography.mono.startsWith('"JetBrains Mono Variable"')).toBe(true);
    expect(typography.familyChrome.startsWith('"Inria Serif"')).toBe(true);
    expect(typography.fontFamily.startsWith('"Inria Serif"')).toBe(true);
    expect(typography.fontFamilyMono.startsWith('"JetBrains Mono Variable"')).toBe(true);
    expect(typography.familyCanvas).toBe("Arial");
    expect(typography.ls.tight).toBe("-0.01em");
    expect(typography.ls.body).toBe("-0.005em");
    expect(typography.fs.fs13).toBe(13.5);
    expect(typography.sizes.base).toBe(13.5);
    expect(typography.sizes.md).toBe(13.5);
    expect(typography.sizes.lg).toBe(14);
    expect(typography.sizes.xxl).toBe(22);
    // Codex L6: pesos descolapsados — medium=500, semibold=600 (tokens.css §pesos).
    expect(typography.weights.light).toBe(300);
    expect(typography.weights.regular).toBe(400);
    expect(typography.weights.medium).toBe(500);
    expect(typography.weights.semibold).toBe(600);
    expect(typography.weights.bold).toBe(700);
    expect(typography.weightMedium).toBe(500);
    expect(typography.weightSemibold).toBe(600);
    expect(typography.weightHeavy).toBe(700);
  });

  test("compat-shim publico conserva aliases cromaticos usados por CSS/componentes vivos", () => {
    const claves = [
      "ink02",
      "ink90",
      "ink70",
      "ink50",
      "ink30",
      "ink15",
      "ink08",
      "ink04",
      "paper02",
      "paper04",
      "accent",
      "accentSoft",
      "accentDark",
      "focus",
      "focusSoft",
      "focusDark",
      "ocre",
      "ocreSoft",
      "ocreDark",
      "bosque",
      "bosqueSoft",
      "bosqueDark",
      "terracota",
      "terracotaSoft",
      "terracotaDark",
      "warning",
      "warningSoft",
      "warningDark",
      "success",
      "successSoft",
      "successDark",
      "destructive",
    ] as const;

    for (const clave of claves) {
      expect(clave in colors, clave).toBe(true);
      expect(typeof colors[clave]).toBe("string");
    }
  });

  test("contraste Codex supera umbrales WCAG requeridos", () => {
    expect(contraste(colors.ink, colors.paper), "ink/paper AAA").toBeGreaterThanOrEqual(7);
    expect(contraste(colors.inkMid, colors.paper), "inkMid/paper AA").toBeGreaterThanOrEqual(4.5);
    expect(contraste(colors.crimson, colors.paper), "crimson/paper AA").toBeGreaterThanOrEqual(4.5);
  });
});

function contraste(foreground: string, background: string): number {
  const valores = [luminancia(foreground), luminancia(background)].sort((a, b) => b - a);
  const mayor = valores[0] ?? 0;
  const menor = valores[1] ?? 0;
  return (mayor + 0.05) / (menor + 0.05);
}

function luminancia(hex: string): number {
  const [r, g, b] = rgb(hex).map((value) => {
    const normalizado = value / 255;
    return normalizado <= 0.03928
      ? normalizado / 12.92
      : ((normalizado + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
}

function rgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(value)) throw new Error(`Color hex invalido: ${hex}`);
  return [0, 2, 4].map((index) => Number.parseInt(value.slice(index, index + 2), 16)) as [number, number, number];
}
