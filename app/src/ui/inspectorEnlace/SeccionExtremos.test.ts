import { describe, expect, test } from "bun:test";
import { seccionExtremosVisible } from "./SeccionExtremos";

describe("seccionExtremosVisible — reanclaje de extremos por tipo de enlace", () => {
  // BUG-20260530T214922Z-fb6c2c: los enlaces estructurales fundamentales no
  // podían reanclarse a su cosa origen/destino porque la sección "Extremos"
  // del inspector (con DialogoMoverPuerto) se ocultaba para no-procedurales,
  // pese a que el kernel (apuntarExtremoEnlace/validarFirmaEnlace) ya lo admite.
  test("muestra extremos en enlaces procedurales", () => {
    for (const tipo of ["agente", "instrumento", "consumo", "resultado", "efecto", "invocacion"] as const) {
      expect(seccionExtremosVisible(tipo)).toBe(true);
    }
  });

  test("muestra extremos en enlaces estructurales fundamentales", () => {
    for (const tipo of ["agregacion", "exhibicion", "generalizacion", "clasificacion"] as const) {
      expect(seccionExtremosVisible(tipo)).toBe(true);
    }
  });
});
