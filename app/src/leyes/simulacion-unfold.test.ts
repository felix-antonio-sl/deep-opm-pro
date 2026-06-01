import { describe, expect, test } from "bun:test";
import { crearModelo, crearProceso } from "../modelo/operaciones";
import type { Modelo, Resultado } from "../modelo/tipos";
import type { ContextoSimulacion } from "../modelo/simulacion/tipos";
import {
  desplegar,
  ejecutarPaso,
  iniciarSimulacion,
  pasoEfecto,
} from "../modelo/simulacion/runner";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

function modeloConProcesos(): Modelo {
  let m = crearModelo();
  m = must(crearProceso(m, m.opdRaizId, { x: 120, y: 80 }, "Recibir"));
  m = must(crearProceso(m, m.opdRaizId, { x: 120, y: 240 }, "Procesar"));
  return m;
}

function iterarManual(modelo: Modelo, ini: ContextoSimulacion): ContextoSimulacion {
  let c = ini;
  while (c.pasoActual < c.plan.length) c = ejecutarPaso(modelo, c);
  return c;
}

describe("LEY law-simulacion-unfold", () => {
  test("law-efecto-identidad: pasoEfecto siempre rinde 1 sucesor, peso 1", () => {
    const m = modeloConProcesos();
    let c = iniciarSimulacion(m, m.opdRaizId);
    while (c.pasoActual < c.plan.length) {
      const e = pasoEfecto(m, c);
      expect(e.sucesores.length).toBe(1);
      expect(e.sucesores[0]!.peso).toBe(1);
      c = e.sucesores[0]!.estado;
    }
  });

  test("law-unfold-paridad: desplegar == iterar ejecutarPaso (mismo trace)", () => {
    const m = modeloConProcesos();
    const ini = iniciarSimulacion(m, m.opdRaizId);
    expect(desplegar(m, ini).trace).toEqual(iterarManual(m, ini).trace);
  });

  test("law-unfold-pureza: desplegar no muta el estado inicial", () => {
    const m = modeloConProcesos();
    const ini = iniciarSimulacion(m, m.opdRaizId);
    const antes = JSON.stringify(ini);
    desplegar(m, ini);
    expect(JSON.stringify(ini)).toBe(antes);
  });
});
