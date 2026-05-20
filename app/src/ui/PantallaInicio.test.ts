import { describe, expect, test } from "bun:test";
import { DIMENSION_ACCION_BIENVENIDA_PX, GLOSA_BIENVENIDA_OPM } from "./PantallaInicio";

/**
 * Ronda 23 L3 #7: el banner inline ya no muestra la glosa OPM ni los tiles
 * de recientes (eso vivía en el overlay legacy). Las exportaciones se
 * conservan como constantes estables porque el archivo `PantallaInicio.tsx`
 * sigue siendo el módulo canónico de bienvenida y otros consumidores las
 * pueden referenciar como SSOT de copy histórica.
 */
describe("GLOSA_BIENVENIDA_OPM (constante estable)", () => {
  test("conserva los cuatro términos OPM core del boot CN-DEF", () => {
    expect(GLOSA_BIENVENIDA_OPM.map((item) => item.termino)).toEqual([
      "Cosa",
      "OPD",
      "Apariencia",
      "Enlace",
    ]);
  });

  test("expone el texto literal histórico de la glosa", () => {
    expect([...GLOSA_BIENVENIDA_OPM]).toEqual([
      { termino: "Cosa", definicion: "objeto o proceso del sistema que modelas." },
      { termino: "OPD", definicion: "diagrama donde dibujas cosas y enlaces." },
      { termino: "Apariencia", definicion: "cómo aparece una cosa en un OPD; la misma cosa puede aparecer en varios OPDs." },
      { termino: "Enlace", definicion: "relación entre dos cosas." },
    ]);
  });
});

describe("dimensiones nominales de bienvenida", () => {
  test("preserva la dimensión histórica de la acción primaria", () => {
    expect(DIMENSION_ACCION_BIENVENIDA_PX).toBeGreaterThanOrEqual(160);
  });
});
