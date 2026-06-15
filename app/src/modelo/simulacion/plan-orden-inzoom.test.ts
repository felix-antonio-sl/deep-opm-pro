import { describe, expect, test } from "bun:test";
import { extremoEntidad } from "../extremos";
import {
  crearEnlace,
  crearModelo,
  crearProceso,
  descomponerProceso,
} from "../operaciones";
import type { Apariencia, Id, Modelo, Opd, Resultado } from "../tipos";
import { planificarSimulacion } from "./plan";
import { desplegar, iniciarSimulacion } from "./runner";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(`Fixture fail: ${resultado.error}`);
  return resultado.value;
}

function entidadId(modelo: Modelo, nombre: string): Id {
  const e = Object.values(modelo.entidades).find((it) => it.nombre === nombre);
  if (!e) throw new Error(`Entidad no encontrada: ${nombre}`);
  return e.id;
}

function aparienciaInternaDe(opd: Opd, entidadId: Id): Apariencia {
  const ap = Object.values(opd.apariencias).find(
    (it) => it.entidadId === entidadId && it.contextoRefinamiento?.rol === "interno",
  );
  if (!ap) throw new Error(`Apariencia interna no encontrada para ${entidadId}`);
  return ap;
}

/**
 * Construye un modelo con un proceso padre descompuesto en 3 subprocesos
 * (`Padre 1`, `Padre 2`, `Padre 3`). Devuelve el modelo y los ids del OPD hijo
 * y de cada subproceso para poder fijar `ordenInzoom`, geometría e invocaciones.
 */
function modeloDescompuesto(): {
  modelo: Modelo;
  opdHijoId: Id;
  s1: Id;
  s2: Id;
  s3: Id;
} {
  let modelo = crearModelo("Inzoom");
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 120, y: 100 }, "Padre"));
  const padreId = entidadId(modelo, "Padre");
  const desc = must(descomponerProceso(modelo, modelo.opdRaizId, padreId));
  modelo = desc.modelo;
  return {
    modelo,
    opdHijoId: desc.opdId,
    s1: entidadId(modelo, "Padre 1"),
    s2: entidadId(modelo, "Padre 2"),
    s3: entidadId(modelo, "Padre 3"),
  };
}

/** Fija la coordenada Y de la apariencia interna de un subproceso en el OPD hijo. */
function fijarY(modelo: Modelo, opdHijoId: Id, entidadId: Id, y: number): Modelo {
  const opd = modelo.opds[opdHijoId]!;
  const ap = aparienciaInternaDe(opd, entidadId);
  return {
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdHijoId]: {
        ...opd,
        apariencias: { ...opd.apariencias, [ap.id]: { ...ap, y } },
      },
    },
  };
}

/** Fija el campo `ordenInzoom` del OPD hijo. */
function fijarOrdenInzoom(modelo: Modelo, opdHijoId: Id, orden: Id[][]): Modelo {
  const opd = modelo.opds[opdHijoId]!;
  return {
    ...modelo,
    opds: { ...modelo.opds, [opdHijoId]: { ...opd, ordenInzoom: orden } },
  };
}

/** Subprocesos del plan que viven en el OPD hijo, en su orden de plan. */
function nombresEnOpdHijo(plan: ReturnType<typeof planificarSimulacion>, opdHijoId: Id): string[] {
  return plan.filter((p) => p.opdId === opdHijoId).map((p) => p.procesoNombre);
}

describe("planificarSimulacion — orden por ordenInzoom (U6)", () => {
  test("(a) el campo gobierna sobre la geometría: ordenInzoom=[[s2],[s1]] visita s2 antes que s1", () => {
    let { modelo, opdHijoId, s1, s2 } = modeloDescompuesto();
    // Geometría: s1 ARRIBA (y20), s2 ABAJO (y80) — sin campo, s1 iría primero.
    modelo = fijarY(modelo, opdHijoId, s1, 20);
    modelo = fijarY(modelo, opdHijoId, s2, 80);
    // El campo invierte: banda 0 = s2, banda 1 = s1.
    modelo = fijarOrdenInzoom(modelo, opdHijoId, [[s2], [s1]]);

    const plan = planificarSimulacion(modelo, modelo.opdRaizId);
    const nombres = nombresEnOpdHijo(plan, opdHijoId);
    expect(nombres.indexOf("Padre 2")).toBeLessThan(nombres.indexOf("Padre 1"));
  });

  test("(b) AND-join: ordenInzoom=[[s1,s2],[s3]] pone s1 y s2 ambos antes que s3", () => {
    let { modelo, opdHijoId, s1, s2, s3 } = modeloDescompuesto();
    // Geometría que NO coincide con las bandas: s3 arriba del todo.
    modelo = fijarY(modelo, opdHijoId, s3, 10);
    modelo = fijarY(modelo, opdHijoId, s1, 50);
    modelo = fijarY(modelo, opdHijoId, s2, 90);
    modelo = fijarOrdenInzoom(modelo, opdHijoId, [[s1, s2], [s3]]);

    const plan = planificarSimulacion(modelo, modelo.opdRaizId);
    const nombres = nombresEnOpdHijo(plan, opdHijoId);
    const idxS3 = nombres.indexOf("Padre 3");
    expect(nombres.indexOf("Padre 1")).toBeLessThan(idxS3);
    expect(nombres.indexOf("Padre 2")).toBeLessThan(idxS3);
  });

  test("(c) sin campo, orden por geometría (NO cambia): s1(y20) antes que s2(y80)", () => {
    let { modelo, opdHijoId, s1, s2 } = modeloDescompuesto();
    modelo = fijarY(modelo, opdHijoId, s1, 20);
    modelo = fijarY(modelo, opdHijoId, s2, 80);
    // Sin ordenInzoom: el orden lo dicta la Y ascendente.

    const plan = planificarSimulacion(modelo, modelo.opdRaizId);
    const nombres = nombresEnOpdHijo(plan, opdHijoId);
    expect(nombres.indexOf("Padre 1")).toBeLessThan(nombres.indexOf("Padre 2"));
  });

  test("procesos NO listados en el campo van DESPUÉS de los listados", () => {
    let { modelo, opdHijoId, s1, s2, s3 } = modeloDescompuesto();
    // Geometría: s3 arriba (y10). El campo solo cubre s1,s2 ⇒ s3 va al final.
    modelo = fijarY(modelo, opdHijoId, s3, 10);
    modelo = fijarY(modelo, opdHijoId, s1, 50);
    modelo = fijarY(modelo, opdHijoId, s2, 90);
    modelo = fijarOrdenInzoom(modelo, opdHijoId, [[s1], [s2]]);

    const plan = planificarSimulacion(modelo, modelo.opdRaizId);
    const nombres = nombresEnOpdHijo(plan, opdHijoId);
    expect(nombres).toEqual(["Padre 1", "Padre 2", "Padre 3"]);
  });
});

describe("equivalencia de flujo: campo vs enlaces de invocación (garantía Fase 3)", () => {
  /** Secuencia de nombres de proceso recorridos por la simulación (lee el trace). */
  function recorrido(modelo: Modelo): string[] {
    const ctx = iniciarSimulacion(modelo, modelo.opdRaizId);
    const final = desplegar(modelo, ctx);
    expect(final.estado).toBe("completado");
    return final.trace.map((e) => e.procesoNombre);
  }

  test("(d) modelo con ordenInzoom (sin rayos) recorre IGUAL que modelo con invocaciones (sin campo)", () => {
    // Modelo 1: el CAMPO gobierna A→B→C, SIN rayos. Geometría deliberadamente
    // CONTRADICTORIA con el campo (s3 arriba, s1 medio, s2 abajo): sin mi cambio,
    // el plan ordenaría por Y (s3,s1,s2) y NO produciría A→B→C. Con el campo, sí.
    let m1: Modelo;
    {
      const d = modeloDescompuesto();
      m1 = d.modelo;
      m1 = fijarY(m1, d.opdHijoId, d.s3, 10);
      m1 = fijarY(m1, d.opdHijoId, d.s1, 50);
      m1 = fijarY(m1, d.opdHijoId, d.s2, 90);
      m1 = fijarOrdenInzoom(m1, d.opdHijoId, [[d.s1], [d.s2], [d.s3]]);
    }

    // Modelo 2: la forma legada que retira la Fase 3 — SIN campo, CON rayos de
    // invocación s1→s2→s3 y geometría CONSISTENTE con el orden (s1,s2,s3 por Y),
    // como la que produce el layout actual desde la topología de invocaciones.
    let m2: Modelo;
    {
      const d = modeloDescompuesto();
      m2 = d.modelo;
      m2 = fijarY(m2, d.opdHijoId, d.s1, 10);
      m2 = fijarY(m2, d.opdHijoId, d.s2, 50);
      m2 = fijarY(m2, d.opdHijoId, d.s3, 90);
      m2 = must(crearEnlace(m2, d.opdHijoId, extremoEntidad(d.s1), extremoEntidad(d.s2), "invocacion"));
      m2 = must(crearEnlace(m2, d.opdHijoId, extremoEntidad(d.s2), extremoEntidad(d.s3), "invocacion"));
    }

    const r1 = recorrido(m1);
    const r2 = recorrido(m2);

    // La garantía de la Fase 3: el modelo-campo recorre EXACTAMENTE igual que el
    // modelo-rayos. Retirar los rayos (quedándose con el campo) no regresiona.
    expect(r1).toEqual(r2);
    expect(r1).toEqual(["Padre", "Padre 1", "Padre 2", "Padre 3"]);
  });
});
