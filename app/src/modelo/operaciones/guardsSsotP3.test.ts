// Cierres P3 del registro de conformidad R-CONF-7 (2026-06-11):
// V-4 (R-EXC-1A) y V-5 (R-OPD-EST-3) como guards de kernel/editor.
import { describe, expect, test } from "bun:test";
import { checkParTransformadorDuplicado } from "../checkers";
import {
  cambiarAfiliacion,
  agregarEstado,
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
} from "../operaciones";
import type { Id, Modelo, Resultado } from "../tipos";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

function idDe(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

describe("V-4 — R-EXC-1A: proceso de manejo de excepción debe ser ambiental", () => {
  function base(): Modelo {
    let m = crearModelo("Excepciones");
    m = must(crearProceso(m, m.opdRaizId, { x: 60, y: 60 }, "Procesar"));
    m = must(crearProceso(m, m.opdRaizId, { x: 360, y: 60 }, "Manejar"));
    return m;
  }

  test("rechaza excepción temporal con proceso de manejo sistémico", () => {
    const m = base();
    for (const tipo of ["excepcionSobretiempo", "excepcionSubtiempo", "excepcionSubSobretiempo"] as const) {
      const r = crearEnlace(m, m.opdRaizId, idDe(m, "Procesar"), idDe(m, "Manejar"), tipo);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error).toContain("R-EXC-1A");
    }
  });

  test("acepta excepción temporal con proceso de manejo ambiental", () => {
    let m = base();
    m = must(cambiarAfiliacion(m, idDe(m, "Manejar"), "ambiental"));
    expect(crearEnlace(m, m.opdRaizId, idDe(m, "Procesar"), idDe(m, "Manejar"), "excepcionSobretiempo").ok).toBe(true);
  });
});

describe("V-5 — R-OPD-EST-3: el editor restringe el efecto a objetos con estados", () => {
  function base(): Modelo {
    let m = crearModelo("Efectos");
    m = must(crearProceso(m, m.opdRaizId, { x: 60, y: 60 }, "Procesar"));
    m = must(crearObjeto(m, m.opdRaizId, { x: 360, y: 60 }, "Cosa"));
    return m;
  }

  test("rechaza efecto plano a objeto sin estados", () => {
    const m = base();
    const r = crearEnlace(m, m.opdRaizId, idDe(m, "Procesar"), idDe(m, "Cosa"), "efecto");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("R-OPD-EST-3");
  });

  test("acepta efecto a objeto con al menos un estado", () => {
    let m = base();
    m = must(crearEstadosIniciales(m, idDe(m, "Cosa"))).modelo;
    expect(crearEnlace(m, m.opdRaizId, idDe(m, "Procesar"), idDe(m, "Cosa"), "efecto").ok).toBe(true);
  });

  test("el consumo y el resultado siguen siendo legales sobre objeto sin estados", () => {
    const m = base();
    expect(crearEnlace(m, m.opdRaizId, idDe(m, "Cosa"), idDe(m, "Procesar"), "consumo").ok).toBe(true);
    expect(crearEnlace(m, m.opdRaizId, idDe(m, "Procesar"), idDe(m, "Cosa"), "resultado").ok).toBe(true);
  });
});

describe("R-OPD-HAB-4 — unicidad de rol por par objeto-proceso", () => {
  function base(): Modelo {
    let m = crearModelo("Unicidad");
    m = must(crearProceso(m, m.opdRaizId, { x: 360, y: 60 }, "Procesar"));
    m = must(crearObjeto(m, m.opdRaizId, { x: 60, y: 60 }, "Cosa"));
    m = must(crearEstadosIniciales(m, idDe(m, "Cosa"))).modelo;
    return m;
  }

  test("rechaza habilitador cuando el par ya tiene un transformador (y viceversa)", () => {
    let m = base();
    m = must(crearEnlace(m, m.opdRaizId, idDe(m, "Cosa"), idDe(m, "Procesar"), "consumo"));
    const r = crearEnlace(m, m.opdRaizId, idDe(m, "Cosa"), idDe(m, "Procesar"), "instrumento");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("R-OPD-HAB-4");

    let m2 = base();
    m2 = must(crearEnlace(m2, m2.opdRaizId, idDe(m2, "Cosa"), idDe(m2, "Procesar"), "instrumento"));
    expect(crearEnlace(m2, m2.opdRaizId, idDe(m2, "Cosa"), idDe(m2, "Procesar"), "consumo").ok).toBe(false);
  });

  test("rechaza el duplicado exacto del mismo enlace", () => {
    let m = base();
    m = must(crearEnlace(m, m.opdRaizId, idDe(m, "Cosa"), idDe(m, "Procesar"), "consumo"));
    const dup = crearEnlace(m, m.opdRaizId, idDe(m, "Cosa"), idDe(m, "Procesar"), "consumo");
    expect(dup.ok).toBe(false);
    if (!dup.ok) expect(dup.error).toContain("R-OPD-HAB-4");
  });

  test("permite efectos TS3 compactos distintos y rechaza repetir la misma transición", () => {
    let m = base();
    const cosaId = idDe(m, "Cosa");
    const [entrada, salidaA] = Object.values(m.estados).filter((estado) => estado.entidadId === cosaId);
    if (!entrada || !salidaA) throw new Error("Fixture requiere estados iniciales");
    const agregado = must(agregarEstado(m, cosaId, "salida-b"));
    m = agregado.modelo;
    const transicionA = { estadoEntradaId: entrada.id, estadoSalidaId: salidaA.id };
    const transicionB = { estadoEntradaId: entrada.id, estadoSalidaId: agregado.estadoId };

    m = must(crearEnlace(m, m.opdRaizId, idDe(m, "Procesar"), cosaId, "efecto", "", transicionA));
    expect(crearEnlace(m, m.opdRaizId, idDe(m, "Procesar"), cosaId, "efecto", "", transicionB).ok).toBe(true);
    const duplicada = crearEnlace(m, m.opdRaizId, idDe(m, "Procesar"), cosaId, "efecto", "", transicionA);
    expect(duplicada.ok).toBe(false);
    if (!duplicada.ok) expect(duplicada.error).toContain("R-OPD-HAB-4");
  });

  test("checker PAR_TRANSFORMADOR_DUPLICADO acusa consumo+resultado planos sin abanico (R-PREC-1/3)", () => {
    // La creación permite el segundo transformador (ramas pre-abanico se crean
    // antes de agruparse); el residual no abanicado lo acusa el checker.
    let m = base();
    m = must(crearEnlace(m, m.opdRaizId, idDe(m, "Cosa"), idDe(m, "Procesar"), "consumo"));
    m = must(crearEnlace(m, m.opdRaizId, idDe(m, "Procesar"), idDe(m, "Cosa"), "resultado"));
    const avisos = checkParTransformadorDuplicado(m);
    expect(avisos).toHaveLength(1);
    expect(avisos[0]?.codigo).toBe("PAR_TRANSFORMADOR_DUPLICADO");
  });

  test("PERMITE la escisión TS consumo↔resultado anclada a estados (patrón canónico)", () => {
    let m = base();
    const estados = Object.values(m.estados).filter((e) => e.entidadId === idDe(m, "Cosa"));
    const [eA, eB] = estados;
    if (!eA || !eB) throw new Error("Fixture requiere 2 estados");
    m = must(crearEnlace(m, m.opdRaizId, { kind: "estado", id: eA.id }, idDe(m, "Procesar"), "consumo"));
    expect(crearEnlace(m, m.opdRaizId, idDe(m, "Procesar"), { kind: "estado", id: eB.id }, "resultado").ok).toBe(true);
  });

  test("roles sobre procesos distintos no colisionan", () => {
    let m = base();
    m = must(crearProceso(m, m.opdRaizId, { x: 660, y: 60 }, "Otro"));
    m = must(crearEnlace(m, m.opdRaizId, idDe(m, "Cosa"), idDe(m, "Procesar"), "consumo"));
    expect(crearEnlace(m, m.opdRaizId, idDe(m, "Cosa"), idDe(m, "Otro"), "instrumento").ok).toBe(true);
  });
});
