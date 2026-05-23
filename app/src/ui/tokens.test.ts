import { describe, expect, test } from "bun:test";
import { colors, radii, shadows, spacing, stroke, tokens, transitions, typography } from "./tokens";

/**
 * Ronda 28 L1 — Paleta Bauhaus monocromática.
 *
 * Estos tests preservan la INTENCIÓN de los originales:
 *   1. Paleta canvas semántica permanece invariante [JOYAS §1].
 *   2. Acento UI no colisiona con stroke del canvas.
 *   3. La paleta es internamente coherente (acento ≠ acento suave, etc.).
 *   4. WCAG AA en pares de texto activo.
 *   5. Aliases legacy se preservan vía compat-shim.
 * Los valores literales cambian (Bauhaus monocromo + cinabrio + ultramar).
 */

describe("tokens.colors — paleta Bauhaus monocromática [JOYAS §1, ronda 28 L1]", () => {
  test("paleta canvas semántica permanece invariante [JOYAS §1]", () => {
    // L1 no toca el canvas (eso es L4). El contrato OPM clásico se mantiene.
    expect(colors.canvas.objeto).toBe("#70E483");
    expect(colors.canvas.proceso).toBe("#3BC3FF");
    expect(colors.canvas.enlace).toBe("#586D8C");
    expect(colors.canvas.fill).toBe("#fdffff");
    expect(colors.canvas.texto).toBe("#000002");
  });

  test("paleta Bauhaus base expone ink/paper/escala/accent/focus/warning", () => {
    expect(colors.ink).toBe("#0A0A0A");
    expect(colors.paper).toBe("#FAFAFA");
    expect(colors.ink90).toBe("#1A1A1A");
    expect(colors.ink70).toBe("#404040");
    expect(colors.ink50).toBe("#6E6E6E");
    expect(colors.ink30).toBe("#A8A8A8");
    expect(colors.ink15).toBe("#D2D2D2");
    expect(colors.ink08).toBe("#E8E8E8");
    expect(colors.ink04).toBe("#F2F2F2");
    expect(colors.accent).toBe("#C8392F");
    expect(colors.accentSoft).toBe("#F5DDDB");
    expect(colors.accentDark).toBe("#9F2519");
    expect(colors.focus).toBe("#1F3FA6");
    // Refinamiento 2026-05-23: warning ya no es terracota apagada — se eleva
    // a ocre saffron Klee (#C89033). El símbolo "terracota" se reasigna a
    // destructive secundario distinto de cinabrio.
    expect(colors.warning).toBe("#C89033");
    expect(colors.ocre).toBe("#C89033");
    expect(colors.bosque).toBe("#2D6B47");
    expect(colors.terracota).toBe("#8A3D2D"); // el hex viejo de warning, ahora destructive
  });

  test("acento UI (focus ultramar) no colisiona con stroke del proceso canónico", () => {
    expect(colors.acentoUi).toBe(colors.focus);
    expect(colors.acentoUi).not.toBe(colors.canvas.proceso);
  });

  test("chromeNeutral colapsa al gris medio Bauhaus (ink50)", () => {
    // Compat-shim: el chromeNeutral viejo (#586D8C, gris azulado) ahora
    // colapsa al gris monocromático ink50. Ya no comparte color con el
    // stroke canvas — la monocromaticidad es la nueva convención.
    expect(colors.chromeNeutral).toBe(colors.ink50);
  });

  test("acentoUiSuave es el tinte ultramar derivado del acento [shim ronda 28]", () => {
    expect(colors.acentoUiSuave).toBe(colors.focusSoft);
    expect(colors.acentoUiSuave).not.toBe(colors.acentoUi);
  });

  test("chromeNeutralSuave es el fondo claro derivado del chrome neutro [shim ronda 28]", () => {
    expect(colors.chromeNeutralSuave).toBe(colors.ink04);
    expect(colors.chromeNeutralSuave).not.toBe(colors.chromeNeutral);
  });

  test("tokens agregados exponen el módulo central completo", () => {
    expect(tokens.colors).toBe(colors);
    expect(tokens.spacing).toBe(spacing);
    expect(tokens.radii).toBe(radii);
    expect(tokens.shadows).toBe(shadows);
    expect(tokens.typography).toBe(typography);
    expect(tokens.stroke).toBe(stroke);
    expect(tokens.transitions).toBe(transitions);
  });

  test("spacing ronda 28 usa la escala Bauhaus 4/8/16/24/32/48", () => {
    expect(spacing).toEqual({ xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 });
  });

  test("radii ronda 28 colapsa a 2px máximo (Bauhaus = formas rotundas)", () => {
    // Ronda 28 L1: el chrome Bauhaus rechaza los bordes redondeados
    // suaves del corporate UI. Todo cromático colapsa a 2px — la
    // jerarquía se logra con tipografía y espaciado.
    expect(radii.none).toBe(0);
    expect(radii.xs).toBe(2);
    expect(radii.sm).toBe(2);
    expect(radii.control).toBe(2);
    expect(radii.md).toBe(2);
    expect(radii.lg).toBe(2);
    expect(radii.xl).toBe(2);
    expect(radii.pill).toBe(999); // preservado para badges circulares.
    expect(radii.full).toBe(9999); // preservado.
  });

  test("stroke ronda 28 expone jerarquía hairline/base/bold", () => {
    expect(stroke.hairline).toBe(1);
    expect(stroke.base).toBe(1.5);
    expect(stroke.bold).toBe(2);
  });

  test("shadows ronda 28 expone offsets planos sin blur (Bauhaus)", () => {
    // Sin blur gaussiano corporativo. Solo offsets duros sobre ink15.
    expect(shadows.none).toBe("none");
    expect(shadows.flat).toContain("4px 4px 0 0");
    expect(shadows.flatLarge).toContain("8px 8px 0 0");
    expect(shadows.flatXl).toContain("12px 12px 0 0");
    // Compat-shim: aliases semánticos siguen disponibles.
    expect(shadows.card).toBe(shadows.flat);
    expect(shadows.popover).toBe(shadows.flat);
    expect(shadows.modal).toBe(shadows.flatXl);
    expect(shadows.dialogo).toBe(shadows.flatLarge);
  });

  test("transitions ronda 28 colapsa a 150ms ease-out base", () => {
    expect(transitions.fast).toBe("150ms ease-out");
    expect(transitions.base).toBe("150ms ease-out");
    expect(transitions.slow).toBe("250ms ease-out");
  });

  test("typography ronda 28 usa Inter Tight chrome y conserva Arial canvas [JOYAS §3]", () => {
    expect(typography.familyChrome.startsWith('"Inter Tight"')).toBe(true);
    expect(typography.fontFamily.startsWith('"Inter Tight"')).toBe(true);
    expect(typography.fontFamilyMono.startsWith('"JetBrains Mono"')).toBe(true);
    // [JOYAS §3] el canvas SVG sigue siendo Arial — contrato invariante.
    expect(typography.familyCanvas).toBe("Arial");
    // Ronda 28: sizes.lg ahora 16 (antes 14, brief Bauhaus).
    expect(typography.sizes.lg).toBe(16);
    expect(typography.sizes.xl).toBe(20);
    expect(typography.sizes.xxl).toBe(28);
    expect(typography.weights.semibold).toBe(600);
  });

  test("contraste paper/ink supera AAA (>= 7:1, en realidad ~20:1)", () => {
    const ratio = contraste(colors.ink, colors.paper);
    expect(ratio).toBeGreaterThanOrEqual(7);
  });

  test("pares de texto activo cumplen WCAG AA 4.5:1 con paleta Bauhaus", () => {
    // En monocromo Bauhaus la mayoría de los pares colapsan a ink/paper o
    // accent/accentSoft. Lo que importa: el ratio sigue siendo legible.
    const pares = [
      ["texto primario", colors.textoPrimario, colors.fondoChrome],
      ["texto secundario", colors.textoSecundario, colors.fondoCard],
      ["texto slate", colors.textoSlate, colors.fondoElevado],
      // Refinamiento 2026-05-23: éxito, warning y destructive ya no son mono.
      ["success (bosque)", colors.exitoTexto, colors.exitoFondo],
      ["warning (ocre)", colors.alertaTexto, colors.advertenciaFondo],
      ["destructive (terracota)", colors.destructivoTexto, colors.destructivoFondo],
      ["error (cinabrio)", colors.errorTexto, colors.errorFondoIntenso],
      ["info (ultramar)", colors.infoTextoOscuro, colors.infoFondo],
      ["objeto chrome (bosque)", colors.verdeObjetoOscuro, colors.objetoFondo],
      ["opl (bosque)", colors.verdeOpl, colors.oplFondo],
      ["acento primario sobre paper", colors.fondoChrome, colors.acentoUi],
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
