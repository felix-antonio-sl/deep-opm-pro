// Cierres P3 del registro de conformidad R-CONF-7 (2026-06-11):
// V-4 (R-EXC-1A) y V-5 (R-OPD-EST-3) como guards de kernel/editor.
import { describe, expect, test } from "bun:test";
import {
  cambiarAfiliacion,
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
