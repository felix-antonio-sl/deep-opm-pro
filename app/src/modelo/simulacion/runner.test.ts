import { describe, expect, test } from "bun:test";
import { crearAutoInvocacion } from "../autoinvocacion";
import { extremoEntidad, extremoEstado } from "../extremos";
import { designarInicial } from "../estadosDesignaciones";
import { aplicarModificador } from "../modificadores";
import {
  agregarEstado,
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
  definirTiempoExcepcionEnlace,
  renombrarEstado,
} from "../operaciones";
import { fijarDuracion } from "../objetoDuracion";
import { definirRutaEtiqueta } from "../rutas";
import type { Modelo, Resultado } from "../tipos";
import { desplegar, ejecutarCorrida, ejecutarFaseSimulacion, ejecutarPaso, iniciarSimulacion, reiniciarSimulacion } from "./runner";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(`Fixture fail: ${resultado.error}`);
  return resultado.value;
}

function entidadId(modelo: Modelo, nombre: string): string {
  const e = Object.values(modelo.entidades).find((it) => it.nombre === nombre);
  if (!e) throw new Error(`Entidad no encontrada: ${nombre}`);
  return e.id;
}

function enlaceId(modelo: Modelo, tipo: string, origenId: string, destinoId: string): string {
  const enlace = Object.values(modelo.enlaces).find(
    (it) =>
      it.tipo === tipo &&
      it.origenId.id === origenId &&
      it.destinoId.id === destinoId,
  );
  if (!enlace) throw new Error(`Enlace no encontrado: ${tipo} ${origenId}->${destinoId}`);
  return enlace.id;
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
  test("ejecutarFaseSimulacion separa consumo, proceso y resultado sin mutar current antes del término", () => {
    // Sin habilitadores no hay fase preparación, y con resultado el beat final
    // es "resultado" (no se añade un cierre redundante): el efecto del paso se
    // aplica al cerrar la ÚLTIMA fase de la lista.
    const { modelo, pendienteId, aprobadoId, pedidoId } = modeloTransicionAprobar();
    let ctx = iniciarSimulacion(modelo, modelo.opdRaizId);

    expect(ctx.faseActual).toBe("consumo");
    expect(ctx.trace).toHaveLength(0);
    expect(ctx.estadosCurrent[pedidoId]).toBe(pendienteId);

    // El primer avance ACTIVA la fase inicial (preparado → ejecutando) sin saltarla.
    ctx = ejecutarFaseSimulacion(modelo, ctx);
    expect(ctx.estado).toBe("ejecutando");
    expect(ctx.faseActual).toBe("consumo");

    ctx = ejecutarFaseSimulacion(modelo, ctx);
    expect(ctx.faseActual).toBe("proceso");
    expect(ctx.trace).toHaveLength(0);
    expect(ctx.estadosCurrent[pedidoId]).toBe(pendienteId);

    ctx = ejecutarFaseSimulacion(modelo, ctx);
    expect(ctx.faseActual).toBe("resultado");
    expect(ctx.trace).toHaveLength(0);
    expect(ctx.estadosCurrent[pedidoId]).toBe(pendienteId);

    ctx = ejecutarFaseSimulacion(modelo, ctx);
    expect(ctx.estado).toBe("completado");
    expect(ctx.faseActual).toBeUndefined();
    expect(ctx.trace).toHaveLength(1);
    expect(ctx.estadosCurrent[pedidoId]).toBe(aprobadoId);
  });

  test("un proceso desnudo solo detiene en proceso y completado; con habilitador antepone preparación", () => {
    let desnudo = crearModelo("Desnudo");
    desnudo = must(crearProceso(desnudo, desnudo.opdRaizId, { x: 100, y: 100 }, "Operar"));
    let ctx = iniciarSimulacion(desnudo, desnudo.opdRaizId);
    expect(ctx.faseActual).toBe("proceso");
    ctx = ejecutarFaseSimulacion(desnudo, ctx); // activa la fase inicial
    expect(ctx.faseActual).toBe("proceso");
    expect(ctx.estado).toBe("ejecutando");
    ctx = ejecutarFaseSimulacion(desnudo, ctx);
    expect(ctx.faseActual).toBe("cierre");

    let conAgente = crearModelo("ConAgente");
    conAgente = must(crearObjeto(conAgente, conAgente.opdRaizId, { x: 0, y: 0 }, "Operador"));
    conAgente = must(crearProceso(conAgente, conAgente.opdRaizId, { x: 200, y: 100 }, "Operar"));
    const operadorId = Object.values(conAgente.entidades).find((e) => e.nombre === "Operador")!.id;
    const operarId = Object.values(conAgente.entidades).find((e) => e.nombre === "Operar")!.id;
    conAgente = must(crearEnlace(conAgente, conAgente.opdRaizId, extremoEntidad(operadorId), extremoEntidad(operarId), "instrumento"));
    const ctx2 = iniciarSimulacion(conAgente, conAgente.opdRaizId);
    expect(ctx2.faseActual).toBe("preparacion");
  });

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

  test("ejecuta solo la ruta de transición compatible con el estado current inicial del paso", () => {
    const { modelo, aguaId, solidificadaId, liquidaId, gaseosaId } = modeloRutasAgua();
    const ctx0 = iniciarSimulacion(modelo, modelo.opdRaizId);
    expect(ctx0.estadosCurrent[aguaId]).toBe(solidificadaId);

    const ctx1 = ejecutarPaso(modelo, ctx0);

    expect(ctx1.estadosCurrent[aguaId]).toBe(liquidaId);
    expect(ctx1.estadosCurrent[aguaId]).not.toBe(gaseosaId);
    expect(ctx1.trace[0]?.diagnostico).toBeUndefined();
    expect(ctx1.trace[0]?.transicionesAplicadas).toEqual([
      { entidadId: aguaId, estadoAntesId: solidificadaId, estadoDespuesId: liquidaId, rutaEtiqueta: "sol-liq" },
    ]);
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

  test("repite el proceso por cada ruta de una cadena consumo-resultado", () => {
    const { modelo, aguaId, solidificadaId, liquidaId, gaseosaId } = modeloRutasAgua();

    const fin = ejecutarCorrida(modelo, iniciarSimulacion(modelo, modelo.opdRaizId));

    expect(fin.estado).toBe("completado");
    expect(fin.estadosCurrent[aguaId]).toBe(gaseosaId);
    expect(fin.trace.map((t) => t.procesoNombre)).toEqual(["Calentar", "Calentar"]);
    expect(fin.trace.map((t) => t.diagnostico)).toEqual([undefined, undefined]);
    expect(fin.trace.map((t) => t.transicionesAplicadas)).toEqual([
      [{ entidadId: aguaId, estadoAntesId: solidificadaId, estadoDespuesId: liquidaId, rutaEtiqueta: "sol-liq" }],
      [{ entidadId: aguaId, estadoAntesId: liquidaId, estadoDespuesId: gaseosaId, rutaEtiqueta: "liq-gas" }],
    ]);
  });
});

describe("condiciones e invocaciones OPM", () => {
  test("condición incumplida omite el proceso y continúa con el siguiente", () => {
    let modelo = crearModelo("Condicion");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 100 }, "Revisar"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 220 }, "Archivar"));
    const pedidoId = entidadId(modelo, "Pedido");
    const revisarId = entidadId(modelo, "Revisar");
    const estados = must(crearEstadosIniciales(modelo, pedidoId));
    modelo = estados.modelo;
    const [pendienteId, cerradoId] = estados.estadoIds;
    modelo = must(designarInicial(modelo, pendienteId));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(pendienteId), extremoEntidad(revisarId), "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(revisarId), extremoEstado(cerradoId), "resultado"));
    modelo = must(aplicarModificador(modelo, enlaceId(modelo, "consumo", pendienteId, revisarId), "condicion"));

    const ctx0 = iniciarSimulacion(modelo, modelo.opdRaizId);
    const ctx1 = { ...ctx0, estadosCurrent: { ...ctx0.estadosCurrent, [pedidoId]: cerradoId } };
    const fin = ejecutarCorrida(modelo, ctx1);

    expect(fin.estado).toBe("completado");
    expect(fin.trace.map((t) => t.procesoNombre)).toEqual(["Revisar", "Archivar"]);
    expect(fin.trace[0]?.diagnostico).toContain("Omitido");
    expect(fin.trace[0]?.transicionesAplicadas).toEqual([]);
    expect(fin.estadosCurrent[pedidoId]).toBe(cerradoId);
  });

  test("evento incumplido omite el proceso en vez de ejecutar como condición simple", () => {
    let modelo = crearModelo("Evento");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 100 }, "Revisar"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 220 }, "Archivar"));
    const pedidoId = entidadId(modelo, "Pedido");
    const revisarId = entidadId(modelo, "Revisar");
    const estados = must(crearEstadosIniciales(modelo, pedidoId));
    modelo = estados.modelo;
    const [pendienteId, cerradoId] = estados.estadoIds;
    modelo = must(designarInicial(modelo, pendienteId));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(pendienteId), extremoEntidad(revisarId), "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(revisarId), extremoEstado(cerradoId), "resultado"));
    modelo = must(aplicarModificador(modelo, enlaceId(modelo, "consumo", pendienteId, revisarId), "evento"));

    const ctx0 = iniciarSimulacion(modelo, modelo.opdRaizId);
    const ctx1 = { ...ctx0, estadosCurrent: { ...ctx0.estadosCurrent, [pedidoId]: cerradoId } };
    const fin = ejecutarCorrida(modelo, ctx1);

    expect(fin.estado).toBe("completado");
    expect(fin.trace.map((t) => t.procesoNombre)).toEqual(["Revisar", "Archivar"]);
    expect(fin.trace[0]?.diagnostico).toContain("evento no ocurrido");
    expect(fin.trace[0]?.omitido).toBe(true);
    expect(fin.trace[0]?.transicionesAplicadas).toEqual([]);
    expect(fin.estadosCurrent[pedidoId]).toBe(cerradoId);
  });

  test("excepción temporal desvía la ejecución al proceso de manejo", () => {
    let modelo = crearModelo("Excepcion temporal");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 100 }, "Revisar"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 220 }, "Archivar"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 340 }, "Manejar Excepcion"));
    const pedidoId = entidadId(modelo, "Pedido");
    const revisarId = entidadId(modelo, "Revisar");
    const manejarId = entidadId(modelo, "Manejar Excepcion");
    const estados = must(crearEstadosIniciales(modelo, pedidoId));
    modelo = estados.modelo;
    const [pendienteId, revisadoId] = estados.estadoIds;
    modelo = must(designarInicial(modelo, pendienteId));
    modelo = must(fijarDuracion(modelo, revisadoId, { min: 10, nominal: 10, max: 10, unidad: "s" }));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(pendienteId), extremoEntidad(revisarId), "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(revisarId), extremoEstado(revisadoId), "resultado"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(revisarId), extremoEntidad(manejarId), "excepcionSobretiempo"));
    const excepcionId = enlaceId(modelo, "excepcionSobretiempo", revisarId, manejarId);
    modelo = must(definirTiempoExcepcionEnlace(modelo, excepcionId, { tiempoMaximo: "5", unidadTiempoMaximo: "s" }));

    const fin = ejecutarCorrida(modelo, iniciarSimulacion(modelo, modelo.opdRaizId));

    expect(fin.trace.map((t) => t.procesoNombre)).toEqual(["Revisar", "Manejar Excepcion"]);
    expect(fin.trace[0]?.eventosTemporales?.[0]).toMatchObject({ tipo: "sobretiempo", procesoManejoId: manejarId });
  });

  test("invocación explícita proceso→proceso controla el siguiente paso", () => {
    let modelo = crearModelo("Invocacion");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "A"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 100, y: 220 }, "B"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 100, y: 340 }, "C"));
    const aId = entidadId(modelo, "A");
    const cId = entidadId(modelo, "C");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(aId), extremoEntidad(cId), "invocacion"));

    const fin = ejecutarCorrida(modelo, iniciarSimulacion(modelo, modelo.opdRaizId));

    expect(fin.estado).toBe("completado");
    expect(fin.trace.map((t) => t.procesoNombre)).toEqual(["A", "C"]);
  });

  test("invocación no salta cuando el proceso invocador no es ejecutable", () => {
    let modelo = crearModelo("Invocacion no ejecutable");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 100 }, "A"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 220 }, "B"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 340 }, "C"));
    const pedidoId = entidadId(modelo, "Pedido");
    const aId = entidadId(modelo, "A");
    const cId = entidadId(modelo, "C");
    const estados = must(crearEstadosIniciales(modelo, pedidoId));
    modelo = estados.modelo;
    const [pendienteId, cerradoId] = estados.estadoIds;
    modelo = must(designarInicial(modelo, pendienteId));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(pendienteId), extremoEntidad(aId), "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(aId), extremoEntidad(cId), "invocacion"));

    const ctx0 = iniciarSimulacion(modelo, modelo.opdRaizId);
    const ctx1 = { ...ctx0, estadosCurrent: { ...ctx0.estadosCurrent, [pedidoId]: cerradoId } };
    const fin = ejecutarCorrida(modelo, ctx1);

    expect(fin.estado).toBe("completado");
    expect(fin.trace.map((t) => t.procesoNombre)).toEqual(["A", "B", "C"]);
    expect(fin.trace[0]?.diagnostico).toContain("No simulable");
  });

  test("efecto condicional solo salida evalúa existencia del objeto, no el estado destino", () => {
    let modelo = crearModelo("Efecto condicional");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 100 }, "Completar"));
    const pedidoId = entidadId(modelo, "Pedido");
    const completarId = entidadId(modelo, "Completar");
    const estados = must(crearEstadosIniciales(modelo, pedidoId));
    modelo = estados.modelo;
    const [abiertoId, cerradoId] = estados.estadoIds;
    modelo = must(designarInicial(modelo, abiertoId));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(completarId), extremoEstado(cerradoId), "efecto"));
    modelo = must(aplicarModificador(modelo, enlaceId(modelo, "efecto", completarId, cerradoId), "condicion"));

    const fin = ejecutarCorrida(modelo, iniciarSimulacion(modelo, modelo.opdRaizId));

    expect(fin.estado).toBe("completado");
    expect(fin.trace[0]?.diagnostico).toBeUndefined();
    expect(fin.estadosCurrent[pedidoId]).toBe(cerradoId);
  });

  test("autoinvocación con condición de salida repite y luego sale por bypass", () => {
    let modelo = crearModelo("Loop");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 100 }, "Intentar"));
    const pedidoId = entidadId(modelo, "Pedido");
    const intentarId = entidadId(modelo, "Intentar");
    const estados = must(crearEstadosIniciales(modelo, pedidoId));
    modelo = estados.modelo;
    const [pendienteId, listoId] = estados.estadoIds;
    modelo = must(designarInicial(modelo, pendienteId));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(pendienteId), extremoEntidad(intentarId), "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(intentarId), extremoEstado(listoId), "resultado"));
    modelo = must(crearAutoInvocacion(modelo, modelo.opdRaizId, intentarId));
    modelo = must(aplicarModificador(modelo, enlaceId(modelo, "consumo", pendienteId, intentarId), "condicion"));

    const fin = ejecutarCorrida(modelo, iniciarSimulacion(modelo, modelo.opdRaizId));

    expect(fin.estado).toBe("completado");
    expect(fin.trace.map((t) => t.procesoNombre)).toEqual(["Intentar", "Intentar"]);
    expect(fin.trace[0]?.diagnostico).toBeUndefined();
    expect(fin.trace[1]?.diagnostico).toContain("Omitido");
    expect(fin.estadosCurrent[pedidoId]).toBe(listoId);
  });

  test("autoinvocación sin condición terminal queda bloqueada por límite de seguridad", () => {
    let modelo = crearModelo("Loop infinito");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "P"));
    const pId = entidadId(modelo, "P");
    modelo = must(crearAutoInvocacion(modelo, modelo.opdRaizId, pId));

    const fin = desplegar(modelo, iniciarSimulacion(modelo, modelo.opdRaizId), 3);

    expect(fin.estado).toBe("bloqueado");
    expect(fin.trace).toHaveLength(3);
    expect(fin.trace.at(-1)?.diagnostico).toContain("límite");
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

function modeloRutasAgua(): {
  modelo: Modelo;
  aguaId: string;
  solidificadaId: string;
  liquidaId: string;
  gaseosaId: string;
} {
  let modelo = crearModelo("Rutas agua");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 80 }, "Agua"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 320, y: 220 }, "Calentar"));
  const aguaId = entidadId(modelo, "Agua");
  const calentarId = entidadId(modelo, "Calentar");
  modelo = must(crearEstadosIniciales(modelo, aguaId)).modelo;
  const estadoIds = Object.values(modelo.estados).filter((estado) => estado.entidadId === aguaId).map((estado) => estado.id);
  const [solidificadaId, liquidaId] = estadoIds;
  if (!solidificadaId || !liquidaId) throw new Error("La prueba esperaba estados iniciales");
  modelo = must(renombrarEstado(modelo, solidificadaId, "solidificada"));
  modelo = must(renombrarEstado(modelo, liquidaId, "líquida"));
  const gaseosa = must(agregarEstado(modelo, aguaId, "gaseosa"));
  modelo = gaseosa.modelo;
  modelo = must(designarInicial(modelo, solidificadaId));

  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(solidificadaId), extremoEntidad(calentarId), "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(calentarId), extremoEstado(liquidaId), "resultado"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(liquidaId), extremoEntidad(calentarId), "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(calentarId), extremoEstado(gaseosa.estadoId), "resultado"));
  const enlaces = Object.values(modelo.enlaces);
  for (const enlace of enlaces.filter((item) => item.origenId.id === solidificadaId || item.destinoId.id === liquidaId)) {
    modelo = must(definirRutaEtiqueta(modelo, enlace.id, "sol-liq"));
  }
  for (const enlace of enlaces.filter((item) => item.origenId.id === liquidaId || item.destinoId.id === gaseosa.estadoId)) {
    modelo = must(definirRutaEtiqueta(modelo, enlace.id, "liq-gas"));
  }
  return { modelo, aguaId, solidificadaId, liquidaId, gaseosaId: gaseosa.estadoId };
}
