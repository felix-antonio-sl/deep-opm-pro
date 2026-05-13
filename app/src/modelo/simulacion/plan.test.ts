import { describe, expect, test } from "bun:test";
import { extremoEntidad, extremoEstado } from "../extremos";
import { designarInicial, designarCurrent } from "../estadosDesignaciones";
import {
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
  descomponerProceso,
} from "../operaciones";
import type { Modelo, Resultado } from "../tipos";
import { estadosCurrentIniciales, planificarSimulacion } from "./plan";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(`Fixture fail: ${resultado.error}`);
  return resultado.value;
}

function entidadId(modelo: Modelo, nombre: string): string {
  const e = Object.values(modelo.entidades).find((it) => it.nombre === nombre);
  if (!e) throw new Error(`Entidad no encontrada: ${nombre}`);
  return e.id;
}

describe("planificarSimulacion — orden por Y", () => {
  test("ordena procesos del OPD por apariencia.y ascendente", () => {
    let modelo = crearModelo("Cafe");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 100, y: 200 }, "Servir"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Moler"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 100, y: 150 }, "Filtrar"));

    const plan = planificarSimulacion(modelo, modelo.opdRaizId);
    expect(plan.map((p) => p.procesoNombre)).toEqual(["Moler", "Filtrar", "Servir"]);
  });

  test("desempata alfabéticamente cuando Y coincide", () => {
    let modelo = crearModelo("Empate");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Beta"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 100 }, "Alfa"));

    const plan = planificarSimulacion(modelo, modelo.opdRaizId);
    expect(plan.map((p) => p.procesoNombre)).toEqual(["Alfa", "Beta"]);
  });

  test("ignora objetos: solo procesos entran al plan", () => {
    let modelo = crearModelo("Mixto");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Datos"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 100, y: 150 }, "Procesar"));

    const plan = planificarSimulacion(modelo, modelo.opdRaizId);
    expect(plan).toHaveLength(1);
    expect(plan[0]?.procesoNombre).toBe("Procesar");
  });
});

describe("planificarSimulacion — descomposicion OPD", () => {
  test("expande in-zoom sincronicamente despues del proceso padre", () => {
    let modelo = crearModelo("Inzoom");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 120, y: 100 }, "Atender"));
    const atenderId = entidadId(modelo, "Atender");
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, atenderId));
    modelo = descompuesto.modelo;

    const plan = planificarSimulacion(modelo, modelo.opdRaizId);

    expect(plan.map((p) => p.procesoNombre)).toEqual(["Atender", "Atender 1", "Atender 2", "Atender 3"]);
    expect(plan[0]?.opdId).toBe(modelo.opdRaizId);
    expect(plan[0]?.opdHijoId).toBe(descompuesto.opdId);
    expect(plan.slice(1).map((p) => p.opdId)).toEqual([descompuesto.opdId, descompuesto.opdId, descompuesto.opdId]);
    expect(plan.slice(1).every((p) => p.procesoPadreId === atenderId && p.profundidad === 1)).toBe(true);
  });
});

describe("planificarSimulacion — sin procesos", () => {
  test("retorna plan vacío en OPD sin procesos", () => {
    const modelo = crearModelo("Vacio");
    const plan = planificarSimulacion(modelo, modelo.opdRaizId);
    expect(plan).toEqual([]);
  });

  test("retorna plan vacío para OPD inexistente", () => {
    const modelo = crearModelo("X");
    const plan = planificarSimulacion(modelo, "opd-fantasma");
    expect(plan).toEqual([]);
  });
});

describe("planificarSimulacion — transiciones de estado inferidas", () => {
  test("infiere transición A → B cuando proceso consume A y produce B del mismo objeto", () => {
    let modelo = crearModelo("Transicion");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 200 }, "Aprobar"));
    const pedidoId = entidadId(modelo, "Pedido");
    const aprobarId = entidadId(modelo, "Aprobar");
    const estadosCreados = must(crearEstadosIniciales(modelo, pedidoId));
    modelo = estadosCreados.modelo;
    const [pendienteId, aprobadoId] = estadosCreados.estadoIds;

    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(pendienteId), extremoEntidad(aprobarId), "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(aprobarId), extremoEstado(aprobadoId), "resultado"));

    const plan = planificarSimulacion(modelo, modelo.opdRaizId);
    expect(plan).toHaveLength(1);
    expect(plan[0]?.transicionesPlanificadas).toEqual([
      { entidadId: pedidoId, estadoAntesId: pendienteId, estadoDespuesId: aprobadoId },
    ]);
  });

  test("transición sin contraparte resultado deja estadoDespues=null (consumo)", () => {
    let modelo = crearModelo("Consumo");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Material"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 200 }, "Consumir"));
    const materialId = entidadId(modelo, "Material");
    const consumirId = entidadId(modelo, "Consumir");
    const estadosCreados = must(crearEstadosIniciales(modelo, materialId));
    modelo = estadosCreados.modelo;
    const [inicialId] = estadosCreados.estadoIds;

    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(inicialId), extremoEntidad(consumirId), "consumo"));

    const plan = planificarSimulacion(modelo, modelo.opdRaizId);
    expect(plan[0]?.transicionesPlanificadas).toEqual([
      { entidadId: materialId, estadoAntesId: inicialId, estadoDespuesId: null },
    ]);
  });

  test("resultado sin consumo previo deja estadoAntes=null (creación)", () => {
    let modelo = crearModelo("Creacion");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Output"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 200 }, "Producir"));
    const outputId = entidadId(modelo, "Output");
    const producirId = entidadId(modelo, "Producir");
    const estadosCreados = must(crearEstadosIniciales(modelo, outputId));
    modelo = estadosCreados.modelo;
    const [_, listoId] = estadosCreados.estadoIds;

    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(producirId), extremoEstado(listoId), "resultado"));

    const plan = planificarSimulacion(modelo, modelo.opdRaizId);
    expect(plan[0]?.transicionesPlanificadas).toEqual([
      { entidadId: outputId, estadoAntesId: null, estadoDespuesId: listoId },
    ]);
  });

  test("enlaces entre entidades (no estados) no generan transiciones", () => {
    let modelo = crearModelo("Consumo entidad");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Datos"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 200 }, "Procesar"));
    const datosId = entidadId(modelo, "Datos");
    const procesarId = entidadId(modelo, "Procesar");

    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(datosId), extremoEntidad(procesarId), "consumo"));

    const plan = planificarSimulacion(modelo, modelo.opdRaizId);
    expect(plan[0]?.transicionesPlanificadas).toEqual([]);
  });
});

describe("estadosCurrentIniciales", () => {
  test("toma estados con designación current de cada objeto", () => {
    let modelo = crearModelo("Designado");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Pedido"));
    const pedidoId = entidadId(modelo, "Pedido");
    const estadosCreados = must(crearEstadosIniciales(modelo, pedidoId));
    modelo = estadosCreados.modelo;
    const [pendienteId, aprobadoId] = estadosCreados.estadoIds;

    modelo = must(designarCurrent(modelo, aprobadoId));

    const current = estadosCurrentIniciales(modelo);
    expect(current[pedidoId]).toBe(aprobadoId);
  });

  test("fallback a inicial cuando no hay current", () => {
    let modelo = crearModelo("Inicial");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Pedido"));
    const pedidoId = entidadId(modelo, "Pedido");
    const estadosCreados = must(crearEstadosIniciales(modelo, pedidoId));
    modelo = estadosCreados.modelo;
    const [pendienteId] = estadosCreados.estadoIds;

    modelo = must(designarInicial(modelo, pendienteId));

    const current = estadosCurrentIniciales(modelo);
    expect(current[pedidoId]).toBe(pendienteId);
  });

  test("sin designaciones, el current cae al primer estado por orden estable", () => {
    let modelo = crearModelo("SinDesig");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Libre"));
    const libreId = entidadId(modelo, "Libre");
    const estadosCreados = must(crearEstadosIniciales(modelo, libreId));
    modelo = estadosCreados.modelo;
    const [primeroId] = estadosCreados.estadoIds;

    const current = estadosCurrentIniciales(modelo);
    expect(current[libreId]).toBe(primeroId);
  });

  test("objeto sin estados no aparece en current", () => {
    let modelo = crearModelo("SinEstados");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Plano"));
    const planoId = entidadId(modelo, "Plano");

    const current = estadosCurrentIniciales(modelo);
    expect(current[planoId]).toBeUndefined();
  });
});
