import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto, crearProceso, crearEnlace } from "../modelo/operaciones";
import { componerModelos } from "../modelo/composicion";
import { verificarLinealidad } from "../modelo/composicion";
import { validarModelo } from "../modelo/validaciones";
import type { ExtremoEnlace, Modelo, Resultado } from "../modelo/tipos";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

function construirDosConsumidoresLineales(): {
  a: Modelo;
  b: Modelo;
  compartidas: Record<string, string>;
} {
  let a = crearModelo();
  a = must(crearObjeto(a, a.opdRaizId, { x: 100, y: 100 }, "Bateria"));
  const objA = Object.values(a.entidades).find((e) => e.tipo === "objeto")!;
  a = { ...a, entidades: { ...a.entidades, [objA.id]: { ...objA, lineal: true } } };
  a = must(crearProceso(a, a.opdRaizId, { x: 300, y: 100 }, "Motor A"));
  const procA = Object.values(a.entidades).find((e) => e.tipo === "proceso")!;
  a = must(crearEnlace(a, a.opdRaizId, objA.id, procA.id, "consumo"));

  let b = crearModelo();
  b = must(crearObjeto(b, b.opdRaizId, { x: 100, y: 100 }, "Bateria"));
  const objB = Object.values(b.entidades).find((e) => e.tipo === "objeto")!;
  b = { ...b, entidades: { ...b.entidades, [objB.id]: { ...objB, lineal: true } } };
  b = must(crearProceso(b, b.opdRaizId, { x: 300, y: 100 }, "Motor B"));
  const procB = Object.values(b.entidades).find((e) => e.tipo === "proceso")!;
  b = must(crearEnlace(b, b.opdRaizId, objB.id, procB.id, "consumo"));

  return { a, b, compartidas: { [objB.id]: objA.id } };
}

describe("LEY law-composicion-respeta-lineal", () => {
  test("identificar un objeto lineal consumido en ambos lados produce error-linealidad en el compuesto", () => {
    const { a, b, compartidas } = construirDosConsumidoresLineales();
    const compuesto = must(componerModelos(a, b, compartidas));
    expect(
      verificarLinealidad(compuesto).some(
        (o) => o.severidad === "error-linealidad"
      )
    ).toBe(true);
  });

  test("componerModelos es puro: no muta los modelos de entrada", () => {
    const { a, b, compartidas } = construirDosConsumidoresLineales();
    const antesA = JSON.stringify(a);
    const antesB = JSON.stringify(b);
    componerModelos(a, b, compartidas);
    expect(JSON.stringify(a)).toBe(antesA);
    expect(JSON.stringify(b)).toBe(antesB);
  });

  test("verificarLinealidad sobre el compuesto no afecta los modelos de entrada", () => {
    const { a, b, compartidas } = construirDosConsumidoresLineales();
    const compuesto = must(componerModelos(a, b, compartidas));
    const antesA = JSON.stringify(a);
    const antesB = JSON.stringify(b);
    verificarLinealidad(compuesto);
    expect(JSON.stringify(a)).toBe(antesA);
    expect(JSON.stringify(b)).toBe(antesB);
  });
});

/** Modelo mínimo con estructura interna: proceso `P{suf}` -(resultado)-> objeto `O{suf}`. */
function procesoObjeto(suf: string): Modelo {
  let m = crearModelo();
  m = must(crearProceso(m, m.opdRaizId, { x: 100, y: 100 }, `P${suf}`));
  const p = Object.values(m.entidades).find((e) => e.tipo === "proceso")!;
  m = must(crearObjeto(m, m.opdRaizId, { x: 300, y: 100 }, `O${suf}`));
  const o = Object.values(m.entidades).find((e) => e.tipo === "objeto")!;
  m = must(crearEnlace(m, m.opdRaizId, p.id, o.id, "resultado"));
  return m;
}

/**
 * Firma estructural INVARIANTE A IDS: multiconjunto de entidades por (tipo,nombre)
 * y de enlaces por (tipo, nombreOrigen→nombreDestino). Permite comparar dos
 * composiciones que difieren solo en el namespacing de ids.
 */
function firmaEstructural(m: Modelo): { entidades: string[]; enlaces: string[] } {
  const nombreEntidad = (id: string): string => m.entidades[id]?.nombre ?? id;
  const nombreExtremo = (e: ExtremoEnlace): string =>
    e.kind === "estado" ? nombreEntidad(m.estados[e.id]?.entidadId ?? e.id) : nombreEntidad(e.id);
  return {
    entidades: Object.values(m.entidades).map((e) => `${e.tipo}:${e.nombre}`).sort(),
    enlaces: Object.values(m.enlaces)
      .map((l) => `${l.tipo}:${nombreExtremo(l.origenId)}->${nombreExtremo(l.destinoId)}`)
      .sort(),
  };
}

describe("LEY law-composicion-asociativa", () => {
  test("(a∘b)∘c ≅ a∘(b∘c) módulo namespacing: misma firma estructural", () => {
    const a = procesoObjeto("A");
    const b = procesoObjeto("B");
    const c = procesoObjeto("C");
    const izq = must(componerModelos(must(componerModelos(a, b, {})), c, {}));
    const der = must(componerModelos(a, must(componerModelos(b, c, {})), {}));
    expect(firmaEstructural(izq)).toEqual(firmaEstructural(der));
    // y conserva las 3 estructuras (no colapsa ni duplica).
    expect(firmaEstructural(izq).entidades).toEqual(
      ["objeto:OA", "objeto:OB", "objeto:OC", "proceso:PA", "proceso:PB", "proceso:PC"],
    );
    expect(firmaEstructural(izq).enlaces).toHaveLength(3);
  });
});

describe("LEY law-composicion-bien-tipada", () => {
  test("componer dos modelos válidos no introduce avisos de error en el compuesto", () => {
    const a = procesoObjeto("A");
    const b = procesoObjeto("B");
    const erroresA = validarModelo(a, a.opdRaizId).filter((av) => av.severidad === "error");
    const erroresB = validarModelo(b, b.opdRaizId).filter((av) => av.severidad === "error");
    expect(erroresA).toHaveLength(0);
    expect(erroresB).toHaveLength(0);
    const compuesto = must(componerModelos(a, b, {}));
    const erroresC = validarModelo(compuesto, compuesto.opdRaizId).filter((av) => av.severidad === "error");
    expect(erroresC).toHaveLength(0);
  });
});
