import { describe, expect, test } from "bun:test";
import { extremoEntidad, extremoEstado } from "../extremos";
import { designarInicial } from "../estadosDesignaciones";
import { aplicarModificador } from "../modificadores";
import {
  crearAtributoEnObjeto,
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
  renombrarEstado,
} from "../operaciones";
import { fijarDuracion } from "../objetoDuracion";
import type { Modelo, Resultado } from "../tipos";
import { ejecutarPaso, iniciarSimulacion } from "./runner";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(`Fixture fail: ${resultado.error}`);
  return resultado.value;
}

function entidadId(modelo: Modelo, nombre: string): string {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function modeloCondicionFalsaYRecursoAusente(): {
  modelo: Modelo;
  pedidoId: string;
  listoId: string;
  entregadoId: string;
  vehiculoId: string;
  noDisponibleId: string;
  guardiaId: string;
  bloqueadoId: string;
  lecturaId: string;
  mostradoId: string;
  invocadoId: string;
} {
  let modelo = crearModelo("Precedencia de omisión");
  for (const [nombre, x, y] of [
    ["Pedido", 80, 80],
    ["Vehiculo", 80, 220],
    ["Guardia", 80, 360],
    ["Sensor", 80, 500],
    ["Pantalla", 80, 640],
  ] as const) {
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x, y }, nombre));
  }
  for (const [nombre, y] of [["Entregar", 100], ["Siguiente", 240], ["Invocado", 380]] as const) {
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 360, y }, nombre));
  }

  const pedidoId = entidadId(modelo, "Pedido");
  const vehiculoId = entidadId(modelo, "Vehiculo");
  const guardiaId = entidadId(modelo, "Guardia");
  const entregarId = entidadId(modelo, "Entregar");
  const invocadoId = entidadId(modelo, "Invocado");

  const pedidoEstados = must(crearEstadosIniciales(modelo, pedidoId));
  modelo = pedidoEstados.modelo;
  const [listoId, entregadoId] = pedidoEstados.estadoIds;
  if (!listoId || !entregadoId) throw new Error("El pedido requiere dos estados");
  modelo = must(renombrarEstado(modelo, listoId, "listo"));
  modelo = must(renombrarEstado(modelo, entregadoId, "entregado"));
  modelo = must(designarInicial(modelo, listoId));
  modelo = must(fijarDuracion(modelo, entregadoId, { min: 5, nominal: 5, max: 5, unidad: "s" }));

  const vehiculoEstados = must(crearEstadosIniciales(modelo, vehiculoId));
  modelo = vehiculoEstados.modelo;
  const [noDisponibleId, disponibleId] = vehiculoEstados.estadoIds;
  if (!noDisponibleId || !disponibleId) throw new Error("El vehículo requiere dos estados");
  modelo = must(renombrarEstado(modelo, noDisponibleId, "no disponible"));
  modelo = must(renombrarEstado(modelo, disponibleId, "disponible"));
  modelo = must(designarInicial(modelo, noDisponibleId));

  const guardiaEstados = must(crearEstadosIniciales(modelo, guardiaId));
  modelo = guardiaEstados.modelo;
  const [bloqueadoId, habilitadoId] = guardiaEstados.estadoIds;
  if (!bloqueadoId || !habilitadoId) throw new Error("La guardia requiere dos estados");
  modelo = must(renombrarEstado(modelo, bloqueadoId, "bloqueado"));
  modelo = must(renombrarEstado(modelo, habilitadoId, "habilitado"));
  modelo = must(designarInicial(modelo, bloqueadoId));

  const lectura = must(crearAtributoEnObjeto(modelo, modelo.opdRaizId, entidadId(modelo, "Sensor"), "Lectura", {
    tipoSlot: "float",
    valor: 21,
  }));
  modelo = lectura.modelo;
  const lecturaId = entidadId(modelo, "Lectura");
  const mostrado = must(crearAtributoEnObjeto(modelo, modelo.opdRaizId, entidadId(modelo, "Pantalla"), "Mostrado", {
    tipoSlot: "float",
  }));
  modelo = mostrado.modelo;
  const mostradoId = entidadId(modelo, "Mostrado");

  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(listoId), extremoEntidad(entregarId), "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(entregarId), extremoEstado(entregadoId), "resultado"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(disponibleId), extremoEntidad(entregarId), "instrumento"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(habilitadoId), extremoEntidad(entregarId), "consumo"));
  const enlaceCondicionId = Object.values(modelo.enlaces).find((enlace) =>
    enlace.tipo === "consumo" && enlace.origenId.kind === "estado" && enlace.origenId.id === habilitadoId,
  )?.id;
  if (!enlaceCondicionId) throw new Error("No se encontró el enlace de condición");
  modelo = must(aplicarModificador(modelo, enlaceCondicionId, "condicion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(lecturaId), extremoEntidad(entregarId), "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(entregarId), extremoEntidad(mostradoId), "resultado"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(entregarId), extremoEntidad(invocadoId), "invocacion"));

  return {
    modelo,
    pedidoId,
    listoId,
    entregadoId,
    vehiculoId,
    noDisponibleId,
    guardiaId,
    bloqueadoId,
    lecturaId,
    mostradoId,
    invocadoId,
  };
}

describe("precedencia de condición sobre habilitadores base", () => {
  test("omitir por condición falsa no espera ni consume ningún efecto del proceso", () => {
    const {
      modelo,
      pedidoId,
      listoId,
      entregadoId,
      vehiculoId,
      noDisponibleId,
      guardiaId,
      bloqueadoId,
      lecturaId,
      mostradoId,
      invocadoId,
    } = modeloCondicionFalsaYRecursoAusente();
    const inicial = iniciarSimulacion(modelo, modelo.opdRaizId);
    const contexto = {
      ...inicial,
      estadosCurrent: {
        ...inicial.estadosCurrent,
        [pedidoId]: listoId,
        [vehiculoId]: noDisponibleId,
        [guardiaId]: bloqueadoId,
      },
    };

    const resultado = ejecutarPaso(modelo, contexto);

    expect(resultado.trace[0]).toMatchObject({
      omitido: true,
      resultadoEscenario: "omision",
      transicionesAplicadas: [],
      cambiosValor: [],
    });
    expect(resultado.trace[0]?.ventanaDuracion).toBeUndefined();
    expect(resultado.trace[0]?.duracion).toBeUndefined();
    expect(resultado.trace[0]?.eventosTemporales).toBeUndefined();
    expect(resultado.reloj ?? 0).toBe(0);
    expect(resultado.estadosCurrent[pedidoId]).toBe(listoId);
    expect(resultado.estadosCurrent[pedidoId]).not.toBe(entregadoId);
    expect(resultado.valoresRuntime[lecturaId]).toBe(21);
    expect(resultado.valoresRuntime[mostradoId]).toBeUndefined();
    expect(resultado.plan[resultado.pasoActual]?.procesoId).not.toBe(invocadoId);
    expect(resultado.trace[0]?.diagnostico).toContain("condición no satisfecha");
  });
});
