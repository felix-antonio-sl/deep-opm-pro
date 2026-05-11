import { describe, expect, test } from "bun:test";
import { extremoEntidad, extremoEstado } from "../extremos";
import { designarInicial } from "../estadosDesignaciones";
import {
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
} from "../operaciones";
import type { Modelo, Resultado } from "../tipos";
import { ejecutarCorrida, ejecutarPaso, iniciarSimulacion, reiniciarSimulacion } from "./runner";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(`Fixture fail: ${resultado.error}`);
  return resultado.value;
}

function entidadId(modelo: Modelo, nombre: string): string {
  const e = Object.values(modelo.entidades).find((it) => it.nombre === nombre);
  if (!e) throw new Error(`Entidad no encontrada: ${nombre}`);
  return e.id;
}

function modeloTransicionAprobar(): { modelo: Modelo; pendienteId: string; aprobadoId: string; pedidoId: string } {
  let modelo = crearModelo("Aprobar");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Pedido"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 200 }, "Aprobar"));
  const pedidoId = entidadId(modelo, "Pedido");
  const aprobarId = entidadId(modelo, "Aprobar");
  const estadosCreados = must(crearEstadosIniciales(modelo, pedidoId));
  modelo = estadosCreados.modelo;
  const [pendienteId, aprobadoId] = estadosCreados.estadoIds;
  modelo = must(designarInicial(modelo, pendienteId));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(pendienteId), extremoEntidad(aprobarId), "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(aprobarId), extremoEstado(aprobadoId), "resultado"));
  return { modelo, pendienteId, aprobadoId, pedidoId };
}

describe("iniciarSimulacion", () => {
  test("contexto preparado con plan no vacío", () => {
    const { modelo, pendienteId, pedidoId } = modeloTransicionAprobar();
    const ctx = iniciarSimulacion(modelo, modelo.opdRaizId);
    expect(ctx.estado).toBe("preparado");
    expect(ctx.plan).toHaveLength(1);
    expect(ctx.pasoActual).toBe(0);
    expect(ctx.estadosCurrent[pedidoId]).toBe(pendienteId);
    expect(ctx.trace).toEqual([]);
  });

  test("contexto completado cuando no hay procesos", () => {
    const modelo = crearModelo("Vacio");
    const ctx = iniciarSimulacion(modelo, modelo.opdRaizId);
    expect(ctx.estado).toBe("completado");
    expect(ctx.plan).toEqual([]);
  });
});

describe("ejecutarPaso — flujo determinista", () => {
  test("aplica transición A→B y actualiza estadosCurrent", () => {
    const { modelo, pendienteId, aprobadoId, pedidoId } = modeloTransicionAprobar();
    let ctx = iniciarSimulacion(modelo, modelo.opdRaizId);
    expect(ctx.estadosCurrent[pedidoId]).toBe(pendienteId);

    ctx = ejecutarPaso(modelo, ctx);
    expect(ctx.estadosCurrent[pedidoId]).toBe(aprobadoId);
    expect(ctx.pasoActual).toBe(1);
    expect(ctx.estado).toBe("completado");
    expect(ctx.trace).toHaveLength(1);
    expect(ctx.trace[0]?.diagnostico).toBeUndefined();
    expect(ctx.trace[0]?.transicionesAplicadas).toHaveLength(1);
  });

  test("emite diagnóstico no simulable cuando current no coincide con estadoAntes esperado", () => {
    const { modelo, aprobadoId, pedidoId } = modeloTransicionAprobar();
    // Forzar current incorrecto: aprobado en vez de pendiente
    const ctx0 = iniciarSimulacion(modelo, modelo.opdRaizId);
    const ctx1 = { ...ctx0, estadosCurrent: { ...ctx0.estadosCurrent, [pedidoId]: aprobadoId } };

    const ctx2 = ejecutarPaso(modelo, ctx1);
    expect(ctx2.trace[0]?.diagnostico).toContain("No simulable");
    expect(ctx2.trace[0]?.transicionesAplicadas).toEqual([]);
    // No mutó el estado current
    expect(ctx2.estadosCurrent[pedidoId]).toBe(aprobadoId);
  });

  test("no avanza más allá del último paso", () => {
    const { modelo } = modeloTransicionAprobar();
    let ctx = iniciarSimulacion(modelo, modelo.opdRaizId);
    ctx = ejecutarPaso(modelo, ctx);
    expect(ctx.estado).toBe("completado");
    const traceAntes = ctx.trace.length;

    ctx = ejecutarPaso(modelo, ctx);
    expect(ctx.estado).toBe("completado");
    expect(ctx.trace.length).toBe(traceAntes);
  });

  test("no muta el modelo original", () => {
    const { modelo, pedidoId, pendienteId } = modeloTransicionAprobar();
    const snapshot = JSON.stringify(modelo);
    let ctx = iniciarSimulacion(modelo, modelo.opdRaizId);
    ctx = ejecutarPaso(modelo, ctx);
    expect(JSON.stringify(modelo)).toBe(snapshot);
    // El estado original sigue en pendiente (no se persistió la transición)
    const estadoOriginal = modelo.estados[pendienteId];
    expect(estadoOriginal?.entidadId).toBe(pedidoId);
  });
});

describe("ejecutarCorrida", () => {
  test("ejecuta todos los pasos hasta completar", () => {
    let modelo = crearModelo("Pipeline");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Paso1"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 100, y: 200 }, "Paso2"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 100, y: 300 }, "Paso3"));

    const ctx0 = iniciarSimulacion(modelo, modelo.opdRaizId);
    const ctxFinal = ejecutarCorrida(modelo, ctx0);
    expect(ctxFinal.estado).toBe("completado");
    expect(ctxFinal.pasoActual).toBe(3);
    expect(ctxFinal.trace.map((t) => t.procesoNombre)).toEqual(["Paso1", "Paso2", "Paso3"]);
  });
});

describe("reiniciarSimulacion", () => {
  test("vuelve al contexto inicial preservando opdId", () => {
    const { modelo } = modeloTransicionAprobar();
    let ctx = iniciarSimulacion(modelo, modelo.opdRaizId);
    ctx = ejecutarPaso(modelo, ctx);
    expect(ctx.pasoActual).toBe(1);

    const ctxReiniciado = reiniciarSimulacion(modelo, ctx);
    expect(ctxReiniciado.pasoActual).toBe(0);
    expect(ctxReiniciado.estado).toBe("preparado");
    expect(ctxReiniciado.trace).toEqual([]);
    expect(ctxReiniciado.opdId).toBe(ctx.opdId);
  });
});
