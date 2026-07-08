import { describe, expect, test } from "bun:test";
import { OPFORJA_BUILD, OPFORJA_FECHA, OPFORJA_VERSION } from "./version";

describe("version", () => {
  // Fuera del build de producción (unit tests: sin `define` de vite) los globals
  // no existen y caemos a los valores de desarrollo — sin lanzar ReferenceError.
  test("cae al valor de desarrollo sin los globals del build", () => {
    expect(OPFORJA_FECHA).toBe("dev");
    expect(OPFORJA_BUILD).toBe("local");
  });

  test("la etiqueta visible es la fecha", () => {
    expect(OPFORJA_VERSION).toBe(OPFORJA_FECHA);
  });
});
