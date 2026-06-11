// Regresión 2026-06-11 (hallada por el laboratorio de simulación):
// definirProbabilidadesAbanico escribe `probabilidad` en cada rama XOR, pero
// validarMetadatosEnlace solo la admitía con modificador evento → un modelo
// con abanico XOR probabilizado NO se podía reimportar (export→import fallaba
// con "Enlace inválido: <rama>.metadatos"). El roundtrip completo es la ley.

import { describe, expect, test } from "bun:test";
import { definirProbabilidadesAbanico, formarAbanico } from "../modelo/abanicos";
import { extremoEntidad, extremoEstado } from "../modelo/extremos";
import {
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
} from "../modelo/operaciones";
import { compartirAnclaExtremosEnlaces } from "../modelo/operaciones/ports";
import type { Modelo, Resultado } from "../modelo/tipos";
import { exportarModelo, hidratarModelo } from "./json";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

function modeloConXorProbabilizado(): Modelo {
  let m = crearModelo("XOR Pr");
  m = must(crearProceso(m, m.opdRaizId, { x: 0, y: 0 }, "Decidir"));
  m = must(crearObjeto(m, m.opdRaizId, { x: 300, y: 0 }, "Veredicto"));
  const decidir = Object.values(m.entidades).find((e) => e.nombre === "Decidir")!.id;
  const veredicto = Object.values(m.entidades).find((e) => e.nombre === "Veredicto")!.id;
  m = must(crearEstadosIniciales(m, veredicto)).modelo;
  const [s1, s2] = Object.values(m.estados).filter((s) => s.entidadId === veredicto).map((s) => s.id);
  m = must(crearEnlace(m, m.opdRaizId, extremoEntidad(decidir), extremoEstado(s1!), "resultado"));
  m = must(crearEnlace(m, m.opdRaizId, extremoEntidad(decidir), extremoEstado(s2!), "resultado"));
  const ramas = Object.keys(m.enlaces);
  m = must(compartirAnclaExtremosEnlaces(m, m.opdRaizId, ramas, "origen", "E"));
  m = must(formarAbanico(m, m.opdRaizId, ramas, "XOR"));
  const abanicoId = Object.keys(m.abanicos ?? {})[0]!;
  m = must(definirProbabilidadesAbanico(m, abanicoId, { [ramas[0]!]: 0.7, [ramas[1]!]: 0.3 }));
  return m;
}

describe("serialización — abanico XOR probabilizado", () => {
  test("export→import preserva las probabilidades de rama (antes fallaba en metadatos)", () => {
    const modelo = modeloConXorProbabilizado();
    const json = exportarModelo(modelo);
    const hidratado = must(hidratarModelo(json));
    const ramas = Object.values(hidratado.enlaces).filter((e) => e.probabilidad !== undefined);
    expect(ramas).toHaveLength(2);
    expect(ramas.map((e) => e.probabilidad).sort()).toEqual([0.3, 0.7]);
    const abanico = Object.values(hidratado.abanicos ?? {})[0];
    expect(abanico?.operador).toBe("XOR");
    expect(abanico?.decision?.modo).toBe("probabilidades");
  });
});
