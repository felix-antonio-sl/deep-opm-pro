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

  test("acento UI no colisiona con color semántico de proceso", () => {
    expect(colors.acentoUi).toBe("#3DA8FF");
    expect(colors.acentoUi).not.toBe(colors.canvas.proceso);
  });

  test("chromeNeutral coincide con stroke de enlace por convención compartida", () => {
    expect(colors.chromeNeutral).toBe("#586D8C");
    expect(colors.chromeNeutral).toBe(colors.canvas.enlace);
  });

  test("acentoUiSuave es el fondo claro derivado del acento UI [ronda 13.0 T1.2]", () => {
    expect(colors.acentoUiSuave).toBe("#eaf8ff");
    expect(colors.acentoUiSuave).not.toBe(colors.acentoUi);
  });

  test("chromeNeutralSuave es el fondo claro derivado del chrome neutro [ronda 13.0 T1.2]", () => {
    expect(colors.chromeNeutralSuave).toBe("#e8eef5");
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

  test("radii cubre la escala canónica requerida 4/6/8", () => {
    expect(radii.sm).toBe(4);
    expect(radii.md).toBe(6);
    expect(radii.lg).toBe(8);
  });

  test("shadow de diálogo centraliza el valor repetido T2.4", () => {
    expect(shadows.dialogo).toBe("0 12px 30px rgba(15, 23, 42, 0.16)");
  });

  test("typography conserva Arial chrome y pesos observados", () => {
    expect(typography.familyChrome).toBe("Arial, sans-serif");
    expect(typography.familyCanvas).toBe("Arial");
    expect(typography.sizes.lg).toBe(14);
    expect(typography.weights.semibold).toBe(600);
  });
});
