import { describe, expect, test } from "bun:test";
import { codigoOpd } from "./NodoOpd";

describe("codigoOpd", () => {
  test("extrae prefijos canónicos de OPD y evita usar descripciones largas como código", () => {
    expect(codigoOpd("SD2.1: Procesar pedido descompuesto")).toBe("SD2.1");
    expect(codigoOpd("P5.4 - Servicios territoriales de campo")).toBe("P5.4");
    expect(codigoOpd("LF-04 - Submodelo de validación")).toBe("LF-04");
  });
});
