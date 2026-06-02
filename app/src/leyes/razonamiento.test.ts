import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto, crearProceso, crearEnlace } from "../modelo/operaciones";
import { derivar } from "../modelo/razonamiento";
import type { Id, Modelo, Resultado } from "../modelo/tipos";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}
function idPorNombre(modelo: Modelo, nombre: string): Id {
  return Object.values(modelo.entidades).find((e) => e.nombre === nombre)!.id;
}

// Fabricar →(resultado) Pieza →(consumo) Ensamblar
function modeloCadena(): Modelo {
  let m = crearModelo();
  m = must(crearProceso(m, m.opdRaizId, { x: 100, y: 100 }, "Fabricar"));
  m = must(crearObjeto(m, m.opdRaizId, { x: 300, y: 100 }, "Pieza"));
  m = must(crearProceso(m, m.opdRaizId, { x: 500, y: 100 }, "Ensamblar"));
  m = must(crearEnlace(m, m.opdRaizId, idPorNombre(m, "Fabricar"), idPorNombre(m, "Pieza"), "resultado"));
  m = must(crearEnlace(m, m.opdRaizId, idPorNombre(m, "Pieza"), idPorNombre(m, "Ensamblar"), "consumo"));
  return m;
}

describe("LEY law-derivacion", () => {
  test("pura: derivar no muta el modelo", () => {
    const m = modeloCadena();
    const antes = JSON.stringify(m);
    derivar(m, { tipo: "requerido-por", procesoId: idPorNombre(m, "Ensamblar") });
    expect(JSON.stringify(m)).toBe(antes);
  });

  test("determinista: dos llamadas idénticas dan el mismo resultado", () => {
    const m = modeloCadena();
    const c = { tipo: "afectan-a", entidadId: idPorNombre(m, "Pieza") } as const;
    expect(derivar(m, c)).toEqual(derivar(m, c));
  });

  test("todo inferido: ningún hecho derivado se confunde con uno declarado", () => {
    const m = modeloCadena();
    const r = derivar(m, { tipo: "requerido-por", procesoId: idPorNombre(m, "Ensamblar") });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((h) => h.inferido === true)).toBe(true);
  });
});
