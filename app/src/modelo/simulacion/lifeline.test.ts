import { describe, expect, test } from "bun:test";
import { extremoEntidad, extremoEstado } from "../extremos";
import { designarInicial } from "../estadosDesignaciones";
import { crearEnlace, crearEstadosIniciales, crearModelo, crearObjeto, crearProceso } from "../operaciones";
import type { Modelo, Resultado } from "../tipos";
import { ejecutarCorrida, iniciarSimulacion } from "./runner";
import { lifeline } from "./lifeline";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(`Fixture fail: ${resultado.error}`);
  return resultado.value;
}

function entidadId(modelo: Modelo, nombre: string): string {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

describe("lifeline", () => {
  test("proyecta fotogramas desde un trace real de simulacion", () => {
    let modelo = crearModelo("Lifeline integrada");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 100 }, "Aprobar"));
    const pedidoId = entidadId(modelo, "Pedido");
    const aprobarId = entidadId(modelo, "Aprobar");
    const estados = must(crearEstadosIniciales(modelo, pedidoId));
    modelo = estados.modelo;
    const [pendienteId, aprobadoId] = estados.estadoIds;
    modelo = must(designarInicial(modelo, pendienteId));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(pendienteId), extremoEntidad(aprobarId), "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(aprobarId), extremoEstado(aprobadoId), "resultado"));

    const contexto = ejecutarCorrida(modelo, iniciarSimulacion(modelo, modelo.opdRaizId));
    const fotogramas = lifeline(contexto);

    expect(fotogramas).toHaveLength(1);
    expect(fotogramas[0]).toMatchObject({
      t: 1,
      vivos: [pedidoId],
      estados: { [pedidoId]: aprobadoId },
      procesosActivos: [aprobarId],
    });
  });
});
