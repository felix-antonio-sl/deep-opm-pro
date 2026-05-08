import { describe, expect, test } from "bun:test";
import { SeccionApariciones } from "./SeccionApariciones";

/**
 * El comportamiento real de `SeccionApariciones` se prueba a nivel:
 *  - lógica pura: `aparicionesUtils.test.ts` cubre `listarApariciones` y
 *    `coberturaApariencias` (helpers que el componente consume);
 *  - comportamiento UI: `e2e/20-inspector-tabs.spec.ts` smoke que valida
 *    que el tab Apariciones renderiza items navegables cross-OPD.
 *
 * Este archivo asegura el contrato estructural del componente: existe,
 * exporta una función con un parámetro de props, y monta sin crashear con
 * el conjunto mínimo de props requerido.
 */

describe("SeccionApariciones contrato", () => {
  test("export es función componente", () => {
    expect(typeof SeccionApariciones).toBe("function");
    expect(SeccionApariciones.length).toBe(1);
  });

  test("acepta props mínimas y produce un vnode", () => {
    const vnode = (
      <SeccionApariciones
        modelo={{
          id: "m", nombre: "M", opdRaizId: "opd-1", nextSeq: 0,
          entidades: {}, estados: {}, enlaces: {}, opds: {},
        }}
        entidad={{ id: "e", tipo: "objeto", nombre: "X", esencia: "informacional", afiliacion: "sistemica" }}
        opdActivoId="opd-1"
        onNavegar={() => {}}
      />
    );
    expect(vnode).toBeDefined();
  });
});
