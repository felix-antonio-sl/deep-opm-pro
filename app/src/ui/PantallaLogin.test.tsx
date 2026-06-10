import { describe, expect, test } from "bun:test";
import { PantallaLogin } from "./PantallaLogin";

/**
 * Contrato estructural (patrón SeccionApariciones): la lógica vive en el store
 * (auth.test.ts) y el flujo UI completo en e2e/auth.spec.ts.
 */
describe("PantallaLogin contrato", () => {
  test("export es función componente y produce vnode", () => {
    expect(typeof PantallaLogin).toBe("function");
    expect(<PantallaLogin />).toBeDefined();
  });
});
