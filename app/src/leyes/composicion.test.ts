import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto, crearProceso, crearEnlace } from "../modelo/operaciones";
import { componerModelos } from "../modelo/composicion";
import { verificarLinealidad } from "../modelo/composicion";
import type { Modelo, Resultado } from "../modelo/tipos";

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
