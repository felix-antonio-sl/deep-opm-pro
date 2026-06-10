import { describe, expect, test } from "bun:test";
import { SeccionAnclas } from "./SeccionAnclas";

/**
 * W6.4 — contrato estructural del componente (patrón SeccionApariciones):
 *  - lógica pura: `anclasDe` (modelo/anclasNormativas.test.ts) y
 *    `formatearReferencia`/`etiquetaEstadoAncla` (anclasPresentacion.test.ts);
 *  - comportamiento UI: gate browser:smoke.
 */
describe("SeccionAnclas contrato", () => {
  test("export es función componente con un parámetro de props", () => {
    expect(typeof SeccionAnclas).toBe("function");
    expect(SeccionAnclas.length).toBe(1);
  });

  test("acepta target de los 4 niveles y produce un vnode", () => {
    expect(<SeccionAnclas target={{ tipo: "entidad", id: "ent-1" }} />).toBeDefined();
    expect(<SeccionAnclas target={{ tipo: "enlace", id: "enl-1" }} />).toBeDefined();
    expect(<SeccionAnclas target={{ tipo: "opd", id: "opd-1" }} titulo="Anclas del OPD" />).toBeDefined();
    expect(<SeccionAnclas target={{ tipo: "modelo" }} />).toBeDefined();
  });
});
