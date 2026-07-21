import { describe, expect, test } from "bun:test";
import { TABS_MOBILE, type VistaMobile } from "./ModoRevisionMobile";

/**
 * Ronda 21 L2: el render del componente lo cubre el smoke E2E
 * `e2e/22-responsive-review.spec.ts` (DOM real, viewport 390x844). Aquí
 * verificamos solo el contrato puro: orden, identidad y cobertura de tabs.
 */

describe("ModoRevisionMobile · contrato de TABS_MOBILE", () => {
  test("expone exactamente las 4 vistas del brief en orden canónico", () => {
    const ids: VistaMobile[] = TABS_MOBILE.map((tab) => tab.id);
    expect(ids).toEqual(["canvas", "opds", "opl", "issues"]);
  });

  test("cada tab tiene etiqueta corta (cabe a 390px en 4 columnas)", () => {
    // El límite permite "Diagnóstico" (11 chars) sin recurrir a abreviaturas.
    // A 390px / 4 tabs
    // (~97px ancho - padding xs:4*2) la etiqueta entra holgada en typography
    // size xs (11px) con whiteSpace:nowrap + textOverflow:ellipsis como
    // salvavidas para viewports más angostos.
    for (const tab of TABS_MOBILE) {
      expect(tab.etiqueta.length).toBeLessThanOrEqual(12);
      expect(tab.etiqueta.length).toBeGreaterThan(0);
    }
  });

  test("cada tab declara testId con prefijo mobile-tab- estable", () => {
    for (const tab of TABS_MOBILE) {
      expect(tab.testId).toBe(`mobile-tab-${tab.id}`);
    }
  });

  test("cada tab tiene icono no vacío para feedback visual", () => {
    for (const tab of TABS_MOBILE) {
      expect(tab.icono.length).toBeGreaterThan(0);
    }
  });

  test("ids son únicos (no hay duplicados)", () => {
    const ids = TABS_MOBILE.map((tab) => tab.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
