import { describe, expect, test } from "bun:test";
import { crearModelo, crearProceso } from "../modelo/operaciones";
import { desplegar, desplegarArbol, iniciarSimulacion, pasoEfecto } from "../modelo/simulacion/runner";
import type { ContextoSimulacion, ModoSimulacion } from "../modelo/simulacion/tipos";
import type { Modelo, Resultado } from "../modelo/tipos";

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

function conModo(ini: ContextoSimulacion, modo: ModoSimulacion, semilla?: number): ContextoSimulacion {
  return { ...ini, modo, ...(semilla != null ? { semilla } : {}) };
}

describe("LEY law-simulacion-modos", () => {
  test("law-modo-determinista-paridad: sin abanicos, determinista == default (S1)", () => {
    const m = modeloConProcesos();
    const ini = iniciarSimulacion(m, m.opdRaizId);
    const porDefault = desplegar(m, ini);
    const porModo = desplegar(m, conModo(ini, "determinista"));
    expect(porModo.trace).toEqual(porDefault.trace);
  });

  // La reproducibilidad GENUINA del muestreo (con abanico que ejerce el RNG)
  // vive en leyes/simulacion-ramas.test.ts. Aquí, sin abanicos, sería tautológica.

  test("law-pasoEfecto-efecto-identidad: sin abanicos, cualquier modo rinde 1 sucesor peso 1", () => {
    const m = modeloConProcesos();
    const ini = iniciarSimulacion(m, m.opdRaizId);
    for (const modo of ["determinista", "muestreo", "exhaustivo"] as const) {
      let c = conModo(ini, modo, 1);
      while (c.pasoActual < c.plan.length) {
        const e = pasoEfecto(m, c);
        expect(e.sucesores.length).toBe(1);
        expect(e.sucesores[0]!.peso).toBe(1);
        c = e.sucesores[0]!.estado;
      }
    }
  });

  test("law-desplegarArbol: sin abanicos produce arbol lineal (un solo camino)", () => {
    const m = modeloConProcesos();
    const ini = iniciarSimulacion(m, m.opdRaizId);
    const { raiz, truncado } = desplegarArbol(m, conModo(ini, "exhaustivo"), 10);
    expect(truncado).toBe(false);
    let nodo = raiz;
    let profundidad = 0;
    while (nodo.hijos.length > 0) {
      expect(nodo.hijos.length).toBe(1);
      nodo = nodo.hijos[0]!;
      profundidad += 1;
    }
    expect(profundidad).toBe(ini.plan.length); // árbol lineal: un nodo por paso del plan (F=Identidad, sin abanicos)
  });
});
