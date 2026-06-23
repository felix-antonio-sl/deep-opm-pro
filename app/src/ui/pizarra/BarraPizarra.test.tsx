import { describe, expect, test } from "bun:test";
import { BarraPizarra } from "./BarraPizarra";

/**
 * D7.2 — contrato estructural del componente (patrón SeccionAnclas / VitrinaEstereotipos):
 *  - lógica pura del mini-form a enlace: `barraPizarraEnlace.test.ts`
 *    (lista de extremos por OPD, guard del botón, catálogo de tipos);
 *  - lógica de store (promoción a enlace ok / rechazo ruidoso):
 *    `store/pizarra.test.ts`;
 *  - comportamiento UI in-vivo (segmented Objeto/Proceso/Enlace, selectores
 *    origen/destino/tipo, etiqueta y botón "Promover a enlace"): gate browser:smoke.
 */
describe("BarraPizarra contrato", () => {
  test("export es función componente", () => {
    expect(typeof BarraPizarra).toBe("function");
  });
});
