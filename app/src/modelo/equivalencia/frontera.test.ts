import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto, crearProceso, crearEnlace } from "../operaciones";
import type { Modelo, Resultado } from "../tipos";
import { fronteraDe } from "./frontera";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

function construirPConEntradaSalida(): {
  modelo: Modelo;
  procesoId: string;
  aId: string;
  bId: string;
} {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 60 }, "MateriaPrima"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 160 }, "Producto"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 320, y: 110 }, "Transformar"));
  const a = Object.values(modelo.entidades).find((e) => e.nombre === "MateriaPrima")!;
  const b = Object.values(modelo.entidades).find((e) => e.nombre === "Producto")!;
  const p = Object.values(modelo.entidades).find((e) => e.tipo === "proceso")!;
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, a.id, p.id, "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, p.id, b.id, "resultado"));
  return { modelo, procesoId: p.id, aId: a.id, bId: b.id };
}

function construirPConAgente(): { modelo: Modelo; procesoId: string; agenteId: string } {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Operador"));
  const ag = Object.values(modelo.entidades).find((e) => e.nombre === "Operador")!;
  modelo = { ...modelo, entidades: { ...modelo.entidades, [ag.id]: { ...ag, esencia: "fisica" } } };
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 320, y: 100 }, "Operar"));
  const p = Object.values(modelo.entidades).find((e) => e.tipo === "proceso")!;
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, ag.id, p.id, "agente"));
  return { modelo, procesoId: p.id, agenteId: ag.id };
}

function construirProcesoAislado(): { modelo: Modelo; procesoId: string } {
  let modelo = crearModelo();
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 100 }, "Solitario"));
  const p = Object.values(modelo.entidades).find((e) => e.tipo === "proceso")!;
  return { modelo, procesoId: p.id };
}

describe("equivalencia/frontera", () => {
  test("fronteraDe incluye las entidades enlazadas al proceso padre (consumo + resultado)", () => {
    const { modelo, procesoId, aId, bId } = construirPConEntradaSalida();
    const f = new Set(fronteraDe(modelo, procesoId));
    expect(f.has(aId)).toBe(true);
    expect(f.has(bId)).toBe(true);
    expect(f.size).toBe(2);
  });

  test("fronteraDe incluye al agente (habilitador)", () => {
    const { modelo, procesoId, agenteId } = construirPConAgente();
    const f = new Set(fronteraDe(modelo, procesoId));
    expect(f.has(agenteId)).toBe(true);
  });

  test("fronteraDe de un proceso sin enlaces devuelve conjunto vacio", () => {
    const { modelo, procesoId } = construirProcesoAislado();
    expect(fronteraDe(modelo, procesoId)).toEqual([]);
  });

  test("fronteraDe es pura: no muta el modelo", () => {
    const { modelo, procesoId } = construirPConEntradaSalida();
    const antes = JSON.stringify(modelo);
    fronteraDe(modelo, procesoId);
    expect(JSON.stringify(modelo)).toBe(antes);
  });
});
