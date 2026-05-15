import { describe, expect, test } from "bun:test";
import { GLOSA_BIENVENIDA_OPM } from "./PantallaInicio";

describe("GLOSA_BIENVENIDA_OPM", () => {
  test("mantiene los cuatro términos OPM core del boot CN-DEF", () => {
    expect(GLOSA_BIENVENIDA_OPM.map((item) => item.termino)).toEqual([
      "Cosa",
      "OPD",
      "Apariencia",
      "Enlace",
    ]);
  });

  test("usa el texto literal de la glosa de bienvenida IFML", () => {
    expect([...GLOSA_BIENVENIDA_OPM]).toEqual([
      { termino: "Cosa", definicion: "objeto o proceso del sistema que modelas." },
      { termino: "OPD", definicion: "diagrama donde dibujas cosas y enlaces." },
      { termino: "Apariencia", definicion: "cómo aparece una cosa en un OPD; la misma cosa puede aparecer en varios OPDs." },
      { termino: "Enlace", definicion: "relación entre dos cosas." },
    ]);
  });
});
