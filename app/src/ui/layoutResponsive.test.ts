import { describe, expect, test } from "bun:test";
import {
  BREAKPOINT_MOBILE_MAX,
  BREAKPOINT_TABLET_MAX,
  permiteDockBiblioteca,
  permiteToolbarModeladoPesado,
  resolverBreakpoint,
  usaPanelesComoDrawers,
} from "./layoutResponsive";

describe("resolverBreakpoint — mapping ancho → breakpoint OPM", () => {
  test("a 390px (iPhone 12/13/14 portrait) resuelve mobile", () => {
    expect(resolverBreakpoint(390)).toBe("mobile");
  });

  test("a 768px (iPad portrait) resuelve tablet", () => {
    expect(resolverBreakpoint(768)).toBe("tablet");
  });

  test("a 1280px (laptop estandar) resuelve desktop", () => {
    expect(resolverBreakpoint(1280)).toBe("desktop");
  });

  test("respeta los limites canónicos < 640 / < 1024", () => {
    expect(resolverBreakpoint(BREAKPOINT_MOBILE_MAX - 1)).toBe("mobile");
    expect(resolverBreakpoint(BREAKPOINT_MOBILE_MAX)).toBe("tablet");
    expect(resolverBreakpoint(BREAKPOINT_TABLET_MAX - 1)).toBe("tablet");
    expect(resolverBreakpoint(BREAKPOINT_TABLET_MAX)).toBe("desktop");
  });

  test("entradas inválidas degradan a desktop por seguridad", () => {
    expect(resolverBreakpoint(Number.NaN)).toBe("desktop");
    expect(resolverBreakpoint(-100)).toBe("desktop");
    expect(resolverBreakpoint(Number.POSITIVE_INFINITY)).toBe("desktop");
  });
});

describe("predicados derivados del breakpoint", () => {
  test("permiteToolbarModeladoPesado: solo desktop", () => {
    expect(permiteToolbarModeladoPesado("desktop")).toBe(true);
    expect(permiteToolbarModeladoPesado("tablet")).toBe(false);
    expect(permiteToolbarModeladoPesado("mobile")).toBe(false);
  });

  test("permiteDockBiblioteca: bloquea mobile siempre", () => {
    expect(permiteDockBiblioteca("desktop")).toBe(true);
    expect(permiteDockBiblioteca("tablet")).toBe(true);
    expect(permiteDockBiblioteca("mobile")).toBe(false);
  });

  test("usaPanelesComoDrawers: tablet y mobile sí, desktop no", () => {
    expect(usaPanelesComoDrawers("desktop")).toBe(false);
    expect(usaPanelesComoDrawers("tablet")).toBe(true);
    expect(usaPanelesComoDrawers("mobile")).toBe(true);
  });
});
