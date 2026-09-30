import { describe, expect, test } from "bun:test";
import { extremoEntidad, extremoEstado } from "../extremos";
import { designarInicial } from "../estadosDesignaciones";
import { aplicarModificador } from "../modificadores";
import {
  cambiarEsencia,
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
  renombrarEstado,
} from "../operaciones";
import type { Modelo, Resultado } from "../tipos";
import { evaluateEnablers } from "./enablers";
import { planificarSimulacion } from "./plan";
import { crearEscenario, type ConocimientoRuntimeEscenario } from "./scenario";
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

function modeloConInstrumento(): {
  modelo: Modelo;
  pedidoId: string;
  listoId: string;
  entregadoId: string;
  vehiculoId: string;
  noDisponibleId: string;
  disponibleId: string;
} {
  let modelo = crearModelo("Entrega con instrumento");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Pedido"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 250 }, "Vehiculo"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 320, y: 180 }, "Entregar"));
  const pedidoId = entidadId(modelo, "Pedido");
  const vehiculoId = entidadId(modelo, "Vehiculo");
  const entregarId = entidadId(modelo, "Entregar");
  modelo = must(cambiarEsencia(modelo, vehiculoId, "fisica"));

  const pedidoEstados = must(crearEstadosIniciales(modelo, pedidoId));
  modelo = pedidoEstados.modelo;
  const [listoId, entregadoId] = pedidoEstados.estadoIds;
  if (!listoId || !entregadoId) throw new Error("El pedido requiere dos estados");
  modelo = must(renombrarEstado(modelo, listoId, "listo"));
  modelo = must(renombrarEstado(modelo, entregadoId, "entregado"));
  modelo = must(designarInicial(modelo, listoId));

  const vehiculoEstados = must(crearEstadosIniciales(modelo, vehiculoId));
  modelo = vehiculoEstados.modelo;
  const [noDisponibleId, disponibleId] = vehiculoEstados.estadoIds;
  if (!noDisponibleId || !disponibleId) throw new Error("El vehículo requiere dos estados");
  modelo = must(renombrarEstado(modelo, noDisponibleId, "no disponible"));
  modelo = must(renombrarEstado(modelo, disponibleId, "disponible"));
  modelo = must(designarInicial(modelo, noDisponibleId));

  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(listoId), extremoEntidad(entregarId), "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(entregarId), extremoEstado(entregadoId), "resultado"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(disponibleId), extremoEntidad(entregarId), "instrumento"));
  return { modelo, pedidoId, listoId, entregadoId, vehiculoId, noDisponibleId, disponibleId };
}

function conocimiento(
  presencia: ConocimientoRuntimeEscenario["presencia"] = {},
  estadosCurrent: ConocimientoRuntimeEscenario["estadosCurrent"] = {},
): ConocimientoRuntimeEscenario {
  return { presencia, estadosCurrent };
}

describe("evaluateEnablers", () => {
  test("conserva la distinción entre habilitador disponible, incompatible y desconocido", () => {
    const { modelo, disponibleId, noDisponibleId, vehiculoId } = modeloConInstrumento();
    const paso = planificarSimulacion(modelo, modelo.opdRaizId)[0]!;

    const disponible = evaluateEnablers(modelo, paso, conocimiento({}, {
      [vehiculoId]: { estado: "conocido", valor: disponibleId },
    }));
    expect(disponible.estado).toBe("satisfechos");
    expect(disponible.precondiciones[0]).toMatchObject({ estado: "satisfecha", estadoRequeridoId: disponibleId });

    const noDisponible = evaluateEnablers(modelo, paso, conocimiento({}, {
      [vehiculoId]: { estado: "conocido", valor: noDisponibleId },
    }));
    expect(noDisponible.estado).toBe("impedidos");
    expect(noDisponible.precondiciones[0]?.estado).toBe("incumplida");

    const sinObservacion = evaluateEnablers(modelo, paso, conocimiento());
    expect(sinObservacion.estado).toBe("no-conocidos");
    expect(sinObservacion.precondiciones[0]?.estado).toBe("desconocida");
  });

  test("usa presencia declarada para habilitadores sin estados y no inventa su disponibilidad", () => {
    let modelo = crearModelo("Presencia de instrumento");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Equipo"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 100 }, "Procesar"));
    const equipoId = entidadId(modelo, "Equipo");
    const procesoId = entidadId(modelo, "Procesar");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(equipoId), extremoEntidad(procesoId), "instrumento"));
    const paso = planificarSimulacion(modelo, modelo.opdRaizId)[0]!;

    expect(evaluateEnablers(modelo, paso, conocimiento({
      [equipoId]: { estado: "conocido", valor: "presente" },
    })).estado).toBe("satisfechos");
    expect(evaluateEnablers(modelo, paso, conocimiento({
      [equipoId]: { estado: "conocido", valor: "ausente" },
    })).estado).toBe("impedidos");
    expect(evaluateEnablers(modelo, paso, conocimiento({
      [equipoId]: { estado: "desconocido", motivo: "sin inventario del escenario" },
    })).estado).toBe("no-conocidos");
  });

  test("un agente humano físico válido también requiere presencia o estado compatible", () => {
    let modelo = crearModelo("Agente habilitador");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Operador"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 100 }, "Inspeccionar"));
    const operadorId = entidadId(modelo, "Operador");
    const procesoId = entidadId(modelo, "Inspeccionar");
    modelo = must(cambiarEsencia(modelo, operadorId, "fisica"));
    const estados = must(crearEstadosIniciales(modelo, operadorId));
    modelo = estados.modelo;
    const [disponibleId, ocupadoId] = estados.estadoIds;
    if (!disponibleId || !ocupadoId) throw new Error("El operador requiere dos estados");
    modelo = must(renombrarEstado(modelo, disponibleId, "disponible"));
    modelo = must(renombrarEstado(modelo, ocupadoId, "ocupado"));
    modelo = must(designarInicial(modelo, disponibleId));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(disponibleId), extremoEntidad(procesoId), "agente"));
    const paso = planificarSimulacion(modelo, modelo.opdRaizId)[0]!;

    const presente = evaluateEnablers(modelo, paso, conocimiento({}, {
      [operadorId]: { estado: "conocido", valor: disponibleId },
    }));
    expect(presente.estado).toBe("satisfechos");
    expect(presente.precondiciones[0]?.tipo).toBe("agente");
    expect(evaluateEnablers(modelo, paso, conocimiento({}, {
      [operadorId]: { estado: "conocido", valor: ocupadoId },
    })).estado).toBe("impedidos");
    expect(evaluateEnablers(modelo, paso, conocimiento()).estado).toBe("no-conocidos");
  });
});

describe("runner con habilitadores base", () => {
  test("no aplica resultado cuando el instrumento está en estado incompatible", () => {
    const { modelo, pedidoId, listoId, entregadoId, vehiculoId, noDisponibleId } = modeloConInstrumento();
    const inicial = iniciarSimulacion(modelo, modelo.opdRaizId);
    const resultado = ejecutarPaso(modelo, {
      ...inicial,
      estadosCurrent: { ...inicial.estadosCurrent, [pedidoId]: listoId, [vehiculoId]: noDisponibleId },
    });

    expect(resultado.estado).toBe("bloqueado");
    expect(resultado.pasoActual).toBe(0);
    expect(resultado.estadosCurrent[pedidoId]).toBe(listoId);
    expect(resultado.estadosCurrent[pedidoId]).not.toBe(entregadoId);
    expect(resultado.trace[0]).toMatchObject({ resultadoEscenario: "espera", transicionesAplicadas: [], cambiosValor: [] });
    expect(resultado.trace[0]?.diagnostico).toContain("no disponible");
    expect(resultado.reloj ?? 0).toBe(0);
  });

  test("permite el avance cuando el instrumento está en el estado requerido", () => {
    const { modelo, pedidoId, listoId, entregadoId, vehiculoId, disponibleId } = modeloConInstrumento();
    const inicial = iniciarSimulacion(modelo, modelo.opdRaizId);
    const resultado = ejecutarPaso(modelo, {
      ...inicial,
      estadosCurrent: { ...inicial.estadosCurrent, [pedidoId]: listoId, [vehiculoId]: disponibleId },
    });

    expect(resultado.estado).toBe("completado");
    expect(resultado.estadosCurrent[pedidoId]).toBe(entregadoId);
    expect(resultado.trace[0]?.resultadoEscenario).toBe("avance");
  });

  test("ejecuta desde los hechos iniciales explícitos del escenario", () => {
    const { modelo, pedidoId, listoId, entregadoId, vehiculoId, disponibleId } = modeloConInstrumento();
    const escenario = crearEscenario({
      id: "entrega-vehiculo-disponible",
      modeloId: modelo.id,
      revisionBase: "rev-2",
      proposito: "Comprobar una entrega con vehículo disponible",
      alcanceIds: [pedidoId, vehiculoId],
      conocimientoInicial: {
        presencia: { [vehiculoId]: { estado: "conocido", valor: "presente" } },
        estadosCurrent: {
          [pedidoId]: { estado: "conocido", valor: listoId },
          [vehiculoId]: { estado: "conocido", valor: disponibleId },
        },
      },
      supuestos: [],
      parametros: {},
      capacidadesSoportadas: ["state-transition", "instrument-enabler"],
    });

    const resultado = ejecutarPaso(modelo, iniciarSimulacion(modelo, modelo.opdRaizId, { escenario }));
    expect(resultado.estadosCurrent[pedidoId]).toBe(entregadoId);
    expect(resultado.trace[0]?.resultadoEscenario).toBe("avance");
  });

  test("no convierte un estado runtime ausente en habilitador fallido o satisfecho", () => {
    const { modelo, pedidoId, listoId, vehiculoId } = modeloConInstrumento();
    const inicial = iniciarSimulacion(modelo, modelo.opdRaizId);
    const estadosCurrent = { ...inicial.estadosCurrent, [pedidoId]: listoId };
    delete estadosCurrent[vehiculoId];
    const resultado = ejecutarPaso(modelo, { ...inicial, estadosCurrent });

    expect(resultado.estado).toBe("bloqueado");
    expect(resultado.pasoActual).toBe(0);
    expect(resultado.trace[0]?.resultadoEscenario).toBe("indeterminado");
    expect(resultado.estadosCurrent[pedidoId]).toBe(listoId);
  });

  test("distingue un evento que ocurrió y se perdió al faltar el habilitador base", () => {
    const { modelo: base, pedidoId, listoId, entregadoId, vehiculoId, noDisponibleId } = modeloConInstrumento();
    const procesoId = entidadId(base, "Entregar");
    const consumoId = Object.values(base.enlaces).find((enlace) =>
      enlace.tipo === "consumo" && enlace.origenId.kind === "estado" && enlace.origenId.id === listoId,
    )?.id;
    if (!consumoId) throw new Error("No se encontró el evento de entrada");
    const modelo = must(aplicarModificador(base, consumoId, "evento"));
    const inicial = iniciarSimulacion(modelo, modelo.opdRaizId);
    const resultado = ejecutarPaso(modelo, {
      ...inicial,
      estadosCurrent: { ...inicial.estadosCurrent, [pedidoId]: listoId, [vehiculoId]: noDisponibleId },
    });

    expect(resultado.estado).toBe("bloqueado");
    expect(resultado.trace[0]).toMatchObject({ resultadoEscenario: "evento-perdido", transicionesAplicadas: [] });
    expect(resultado.trace[0]?.diagnostico).toContain("Evento perdido");
    expect(resultado.trace[0]?.evidenciaEscenario).toContainEqual({ tipo: "regla", id: "V-13" });
    expect(resultado.estadosCurrent[pedidoId]).toBeUndefined();
    expect(resultado.estadosCurrent[pedidoId]).not.toBe(entregadoId);
    expect(resultado.trace[0]?.procesoId).toBe(procesoId);
  });

  test("un evento conocido permite ejecutar aunque otro evento alternativo no haya ocurrido", () => {
    const { modelo: base, pedidoId, listoId, entregadoId, vehiculoId, disponibleId } = modeloConInstrumento();
    let modelo = must(crearObjeto(base, base.opdRaizId, { x: 100, y: 380 }, "Señal"));
    const senalId = entidadId(modelo, "Señal");
    const procesoId = entidadId(modelo, "Entregar");
    const estados = must(crearEstadosIniciales(modelo, senalId));
    modelo = estados.modelo;
    const [sinSenalId, disparadaId] = estados.estadoIds;
    if (!sinSenalId || !disparadaId) throw new Error("La señal requiere dos estados");
    modelo = must(renombrarEstado(modelo, sinSenalId, "sin señal"));
    modelo = must(renombrarEstado(modelo, disparadaId, "disparada"));
    modelo = must(designarInicial(modelo, sinSenalId));
    const eventoPedidoId = Object.values(modelo.enlaces).find((enlace) =>
      enlace.tipo === "consumo" && enlace.origenId.kind === "estado" && enlace.origenId.id === listoId,
    )?.id;
    if (!eventoPedidoId) throw new Error("No se encontró el primer evento");
    modelo = must(aplicarModificador(modelo, eventoPedidoId, "evento"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(disparadaId), extremoEntidad(procesoId), "consumo"));
    const eventoSenalId = Object.values(modelo.enlaces).find((enlace) =>
      enlace.tipo === "consumo" && enlace.origenId.kind === "estado" && enlace.origenId.id === disparadaId,
    )?.id;
    if (!eventoSenalId) throw new Error("No se encontró el evento alternativo");
    modelo = must(aplicarModificador(modelo, eventoSenalId, "evento"));
    const inicial = iniciarSimulacion(modelo, modelo.opdRaizId);
    const resultado = ejecutarPaso(modelo, {
      ...inicial,
      estadosCurrent: {
        ...inicial.estadosCurrent,
        [pedidoId]: listoId,
        [vehiculoId]: disponibleId,
        [senalId]: sinSenalId,
      },
    });

    expect(resultado.estado).toBe("completado");
    expect(resultado.trace[0]?.resultadoEscenario).toBe("avance");
    expect(resultado.estadosCurrent[pedidoId]).toBe(entregadoId);
    expect(resultado.estadosCurrent[senalId]).toBe(sinSenalId);
  });

  test("una transición decisiva sin estado inicial declarado queda indeterminada", () => {
    let modelo = crearModelo("Estado inicial desconocido");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 100 }, "Entregar"));
    const pedidoId = entidadId(modelo, "Pedido");
    const entregarId = entidadId(modelo, "Entregar");
    const estados = must(crearEstadosIniciales(modelo, pedidoId));
    modelo = estados.modelo;
    const [listoId, entregadoId] = estados.estadoIds;
    if (!listoId || !entregadoId) throw new Error("El pedido requiere dos estados");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(listoId), extremoEntidad(entregarId), "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(entregarId), extremoEstado(entregadoId), "resultado"));

    const escenario = crearEscenario({
      id: "pedido-estado-inicial-desconocido",
      modeloId: modelo.id,
      revisionBase: "rev-1",
      proposito: "Evitar inferir el estado del pedido",
      alcanceIds: [pedidoId],
      conocimientoInicial: {
        presencia: { [pedidoId]: { estado: "conocido", valor: "presente" } },
        estadosCurrent: { [pedidoId]: { estado: "desconocido", motivo: "el estado inicial no se declaró" } },
      },
      supuestos: [],
      parametros: {},
      capacidadesSoportadas: ["state-transition"],
    });
    const inicial = iniciarSimulacion(modelo, modelo.opdRaizId, { escenario });
    const resultado = ejecutarPaso(modelo, inicial);

    expect(inicial.estadosCurrent[pedidoId]).toBeUndefined();
    expect(resultado.estado).toBe("bloqueado");
    expect(resultado.trace[0]?.resultadoEscenario).toBe("indeterminado");
    expect(resultado.estadosCurrent[pedidoId]).toBeUndefined();
    expect(resultado.estadosCurrent[pedidoId]).not.toBe(entregadoId);
  });
});
