import { describe, expect, it } from "bun:test";
import { COLOR_HALO_FALLBACK, COLORES_CANON_OPM } from "./coloresCanon";
import { tokens } from "../ui/tokens";

// Guardia de conmutatividad: `canvas/coloresCanon` es el espejo de dominio del
// invariante OPM que `ui/tokens § canvas` también proyecta. Este test cruza
// ambas capas a propósito (un test sí puede) y rompe el build si divergen,
// volviendo el drift imposible-de-mergear en vez de confiarlo a la disciplina.
describe("coloresCanon ↔ ui/tokens (anti-drift)", () => {
  it("los 3 colores semánticos OPM coinciden con tokens.colors.canvas", () => {
    expect(COLORES_CANON_OPM.objeto).toBe(tokens.colors.canvas.objeto);
    expect(COLORES_CANON_OPM.proceso).toBe(tokens.colors.canvas.proceso);
    expect(COLORES_CANON_OPM.enlace).toBe(tokens.colors.canvas.enlace);
  });

  it("el halo fallback coincide con tokens.colors.acentoUi", () => {
    expect(COLOR_HALO_FALLBACK).toBe(tokens.colors.acentoUi);
  });
});
