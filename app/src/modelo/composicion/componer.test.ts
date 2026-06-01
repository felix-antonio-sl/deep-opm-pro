import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto } from "../operaciones";
import type { Modelo, Resultado } from "../tipos";
import { componerModelos } from "./componer";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

function unObjeto(nombre: string): Modelo {
  let m = crearModelo();
  m = must(crearObjeto(m, m.opdRaizId, { x: 100, y: 100 }, nombre));
  return m;
}

describe("composicion/componer", () => {
  test("union disjunta (compartidas vacio) conserva entidades de ambos", () => {
    const compuesto = must(componerModelos(unObjeto("A"), unObjeto("B"), {}));
    const nombres = Object.values(compuesto.entidades)
      .map((e) => e.nombre)
      .sort();
    expect(nombres).toEqual(["A", "B"]);
  });

  test("law-composicion-unidad: componer con modelo vacio preserva entidades", () => {
    const a = unObjeto("A");
    const vacio = crearModelo();
    const compuesto = must(componerModelos(a, vacio, {}));
    const objetosA = Object.values(a.entidades).length;
    const objetosC = Object.values(compuesto.entidades).length;
    expect(objetosC).toBe(objetosA);
  });

  test("law-composicion-no-duplica: una entidad compartida aparece una sola vez", () => {
    const a = unObjeto("Comun");
    const b = unObjeto("Comun");
    const idComunA = Object.values(a.entidades)[0]!.id;
    const idComunB = Object.values(b.entidades)[0]!.id;
    const compuesto = must(componerModelos(a, b, { [idComunB]: idComunA }));
    const comunes = Object.values(compuesto.entidades).filter(
      (e) => e.nombre === "Comun"
    );
    expect(comunes).toHaveLength(1);
  });

  test("no hay colision de IDs tras componer (todos los ids son unicos)", () => {
    const compuesto = must(componerModelos(unObjeto("A"), unObjeto("B"), {}));
    const ids = Object.keys(compuesto.entidades);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("componerModelos es puro: no muta los modelos de entrada", () => {
    const a = unObjeto("A");
    const b = unObjeto("B");
    const antesA = JSON.stringify(a);
    const antesB = JSON.stringify(b);
    componerModelos(a, b, {});
    expect(JSON.stringify(a)).toBe(antesA);
    expect(JSON.stringify(b)).toBe(antesB);
  });

  test("rechaza compartidas con clave inexistente en B", () => {
    const a = unObjeto("A");
    const b = unObjeto("B");
    const r = componerModelos(a, b, { "id-inexistente": "id-inexistente-a" });
    expect(r.ok).toBe(false);
  });

  test("rechaza compartidas con valor inexistente en A", () => {
    const a = unObjeto("A");
    const b = unObjeto("B");
    const idComunB = Object.values(b.entidades)[0]!.id;
    const r = componerModelos(a, b, { [idComunB]: "id-inexistente-a" });
    expect(r.ok).toBe(false);
  });

  test("el compuesto tiene su propio nextSeq independiente", () => {
    const a = unObjeto("A");
    const b = unObjeto("B");
    const compuesto = must(componerModelos(a, b, {}));
    expect(compuesto.nextSeq).toBeGreaterThan(
      Math.max(a.nextSeq, b.nextSeq)
    );
  });
});
