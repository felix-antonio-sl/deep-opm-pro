import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { codigoOpd } from "./NodoOpd";

describe("codigoOpd", () => {
  test("los controles del árbol usan targets mínimos de 24 px", () => {
    const source = readFileSync(new URL("./NodoOpd.tsx", import.meta.url), "utf8");
    expect(source).toMatch(/const markerBase[\s\S]*?width: "24px"[\s\S]*?height: "24px"/);
    expect(source).toMatch(/const actionBase[\s\S]*?width: "24px"[\s\S]*?height: "24px"/);
  });

  test("extrae prefijos canónicos de OPD y evita usar descripciones largas como código", () => {
    expect(codigoOpd("SD2.1: Procesar pedido descompuesto")).toBe("SD2.1");
    expect(codigoOpd("P5.4 - Servicios territoriales de campo")).toBe("P5.4");
    expect(codigoOpd("LF-04 - Submodelo de validación")).toBe("LF-04");
  });
});
