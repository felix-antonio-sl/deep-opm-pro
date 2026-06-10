import { describe, expect, test } from "bun:test";
import { VistaModelosLectura } from "./VistaModelosLectura";

/**
 * Contrato estructural (patrón SeccionApariciones): la lógica pura vive en
 * seleccionModelos.test.ts y el flujo UI completo en e2e/mobile-readonly.spec.ts.
 */
describe("VistaModelosLectura contrato", () => {
  test("export es función componente con un parámetro de props", () => {
    expect(typeof VistaModelosLectura).toBe("function");
    expect(VistaModelosLectura.length).toBe(1);
    expect(<VistaModelosLectura onAbierto={() => {}} />).toBeDefined();
  });
});
