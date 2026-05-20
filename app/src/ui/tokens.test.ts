import { describe, expect, test } from "bun:test";
import { colors, radii, shadows, spacing, tokens, typography } from "./tokens";

describe("tokens.colors — paleta UI mínima [JOYAS §1]", () => {
  test("paleta canvas semántica permanece invariante", () => {
    expect(colors.canvas.objeto).toBe("#70E483");
    expect(colors.canvas.proceso).toBe("#3BC3FF");
    expect(colors.canvas.enlace).toBe("#586D8C");
    expect(colors.canvas.fill).toBe("#fdffff");
    expect(colors.canvas.texto).toBe("#000002");
  });

  test("acento UI deriva del proceso canónico sin colisionar con su stroke", () => {
    expect(colors.acentoUi).toBe("#007DB8");
    expect(colors.acentoUi).not.toBe(colors.canvas.proceso);
  });

  test("chromeNeutral coincide con stroke de enlace por convención compartida", () => {
    expect(colors.chromeNeutral).toBe("#586D8C");
    expect(colors.chromeNeutral).toBe(colors.canvas.enlace);
  });

  test("acentoUiSuave es el fondo claro derivado del acento UI [ronda 13.0 T1.2]", () => {
    expect(colors.acentoUiSuave).toBe("#DDF7FF");
    expect(colors.acentoUiSuave).not.toBe(colors.acentoUi);
  });

  test("chromeNeutralSuave es el fondo claro derivado del chrome neutro [ronda 13.0 T1.2]", () => {
    expect(colors.chromeNeutralSuave).toBe("#EDF4FA");
    expect(colors.chromeNeutralSuave).not.toBe(colors.chromeNeutral);
  });

  test("tokens agregados exponen el módulo central completo [ronda 13 L2]", () => {
    expect(tokens.colors).toBe(colors);
    expect(tokens.spacing).toBe(spacing);
    expect(tokens.radii).toBe(radii);
    expect(tokens.shadows).toBe(shadows);
    expect(tokens.typography).toBe(typography);
  });

  test("spacing usa la escala chrome observable 4/8/12/16/24/32", () => {
    expect(spacing).toEqual({ xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 });
  });

  test("radii ronda 23 cubre la escala respiratoria 6/8/12/16", () => {
    // chrome estética: subir radii del chrome (sm→6 / md→8 / lg→12 / xl→16)
    // sin tocar xs (3), control (5), pill/full. El canvas (JOYAS §2) no
    // consume radii — solo afecta cards, modales, inputs.
    expect(radii.xs).toBe(3);
    expect(radii.sm).toBe(6);
    expect(radii.control).toBe(5);
    expect(radii.md).toBe(8);
    expect(radii.lg).toBe(12);
    expect(radii.xl).toBe(16);
    expect(radii.pill).toBe(999);
    expect(radii.full).toBe(9999);
  });

  test("shadows ronda 23 expone escala xs/sm/md/lg y reasigna aliases", () => {
    // chrome estética: elevación algo más explícita para separar paneles,
    // menús y modales sin tocar el canvas.
    expect(shadows.xs).toBe("0 1px 2px rgba(15, 23, 42, 0.05)");
    expect(shadows.sm).toBe("0 3px 8px rgba(15, 23, 42, 0.07)");
    expect(shadows.md).toBe("0 10px 24px rgba(15, 23, 42, 0.10)");
    expect(shadows.lg).toBe("0 20px 44px rgba(15, 23, 42, 0.14)");
    expect(shadows.card).toBe(shadows.xs);
    expect(shadows.popover).toBe(shadows.sm);
    expect(shadows.dialogo).toBe(shadows.md);
    expect(shadows.modal).toBe(shadows.lg);
  });

  test("typography ronda 23 usa system-ui chrome y conserva Arial canvas", () => {
    expect(typography.familyChrome.startsWith('"Inter"')).toBe(true);
    expect(typography.familyChrome).toContain("system-ui");
    // [JOYAS §3] el canvas SVG sigue siendo Arial — contrato invariante.
    expect(typography.familyCanvas).toBe("Arial");
    expect(typography.sizes.lg).toBe(14);
    expect(typography.weights.semibold).toBe(600);
  });

  test("pares de texto activo cumplen WCAG AA 4.5:1", () => {
    const pares = [
      ["texto primario", colors.textoPrimario, colors.fondoChrome],
      ["texto secundario", colors.textoSecundario, colors.fondoCard],
      ["texto slate", colors.textoSlate, colors.fondoElevado],
      ["success", colors.exitoTexto, colors.exitoFondo],
      ["warning", colors.alertaTexto, colors.advertenciaFondo],
      ["error", colors.errorTexto, colors.errorFondoIntenso],
      ["info", colors.infoTextoOscuro, colors.infoFondo],
      ["objeto chrome", colors.verdeObjetoOscuro, colors.objetoFondo],
      ["opl", colors.verdeOpl, colors.oplFondo],
      ["acento primario", colors.fondoChrome, colors.acentoUi],
    ] as const;

    for (const [nombre, foreground, background] of pares) {
      expect(contraste(foreground, background), nombre).toBeGreaterThanOrEqual(4.5);
    }
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
  if (!/^[0-9a-f]{6}$/i.test(value)) throw new Error(`Color hex inválido: ${hex}`);
  return [0, 2, 4].map((index) => Number.parseInt(value.slice(index, index + 2), 16)) as [number, number, number];
}
