import { describe, expect, test } from "bun:test";
import { VitrinaEstereotipos } from "./VitrinaEstereotipos";

/**
 * D6.4 — contrato estructural del componente (patrón SeccionAnclas):
 *  - lógica pura de agrupación: `estereotiposVitrina.test.ts`;
 *  - lógica de store (injerto / captura): `store/capacidadesOpcloudUi.test.ts`;
 *  - comportamiento UI in-vivo: gate browser:smoke.
 */
describe("VitrinaEstereotipos contrato", () => {
  test("export es función componente", () => {
    expect(typeof VitrinaEstereotipos).toBe("function");
  });
});
