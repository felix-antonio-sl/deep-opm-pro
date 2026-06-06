import { describe, expect, test } from "bun:test";
import { extremoEntidad, extremoEstado } from "../extremos";
import { designarInicial } from "../estadosDesignaciones";
import { agregarEstado, crearEnlace, crearEstadosIniciales, crearModelo, crearObjeto, crearProceso, renombrarEstado } from "../operaciones";
import { definirRutaEtiqueta } from "../rutas";
import type { Id, Modelo, Resultado } from "../tipos";
import { focoPasoActualSimulacion, estadosInicialesDelModelo } from "./foco";
import { ejecutarPaso, iniciarSimulacion } from "./runner";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function entidadPorNombre(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`No existe entidad ${nombre}`);
  return entidad.id;
}

describe("estadosInicialesDelModelo", () => {
  test("sin designaciones devuelve lista vacia", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    modelo = must(crearEstadosIniciales(modelo, entidadPorNombre(modelo, "Pedido"))).modelo;
    expect(estadosInicialesDelModelo(modelo)).toEqual([]);
  });

  test("deriva solo los estados designados inicial", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    const estados = must(crearEstadosIniciales(modelo, entidadPorNombre(modelo, "Pedido")));
    modelo = estados.modelo;
    const [pendienteId] = estados.estadoIds;
    modelo = must(designarInicial(modelo, pendienteId));

    expect(estadosInicialesDelModelo(modelo)).toEqual([pendienteId]);
  });
});

describe("focoPasoActualSimulacion — rutas de transición", () => {
  test("representa frame visual de inicio y final en una simulacion objeto-proceso-objeto", () => {
    let modelo = crearModelo("Inicio final");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 60, y: 80 }, "O"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 140 }, "P"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 480, y: 80 }, "B"));
    const origenId = entidadPorNombre(modelo, "O");
    const procesoId = entidadPorNombre(modelo, "P");
    const resultadoId = entidadPorNombre(modelo, "B");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(origenId), extremoEntidad(procesoId), "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(procesoId), extremoEntidad(resultadoId), "resultado"));

    const inicio = iniciarSimulacion(modelo, modelo.opdRaizId);
    const focoInicio = focoPasoActualSimulacion(modelo, inicio);
    const completado = ejecutarPaso(modelo, inicio);
    const focoFinal = focoPasoActualSimulacion(modelo, completado);

    expect(focoInicio.fase).toBe("inicio");
    expect(focoInicio.procesoActivoId).toBeNull();
    expect(focoInicio.entidadesInvolucradasIds).toEqual([origenId]);
    expect(focoInicio.enlacesInvolucradosIds).toEqual([]);
    expect(focoFinal.fase).toBe("final");
    expect(focoFinal.procesoActivoId).toBeNull();
    expect(focoFinal.entidadesInvolucradasIds).toEqual([resultadoId]);
    expect(focoFinal.enlacesInvolucradosIds).toEqual([]);
  });

  test("en simulación resalta solo los enlaces de la ruta compatible con el current", () => {
    const { modelo, aguaId, solidificadaId, liquidaId, gaseosaId, solLiqIds, liqGasIds } = modeloRutasAgua();
    const contexto = iniciarSimulacion(modelo, modelo.opdRaizId);
    expect(contexto.plan).toHaveLength(2);
    expect(contexto.estadosCurrent[aguaId]).toBe(solidificadaId);

    const focoConsumoSolida = focoPasoActualSimulacion(modelo, { ...contexto, estado: "ejecutando", faseActual: "consumo" });
    const focoResultadoSolida = focoPasoActualSimulacion(modelo, { ...contexto, estado: "ejecutando", faseActual: "resultado" });
    const contextoLiquida = ejecutarPaso(modelo, contexto);
    const focoConsumoLiquida = focoPasoActualSimulacion(modelo, { ...contextoLiquida, estado: "ejecutando", faseActual: "consumo" });
    const focoResultadoLiquida = focoPasoActualSimulacion(modelo, { ...contextoLiquida, estado: "ejecutando", faseActual: "resultado" });

    expect(focoConsumoSolida.enlacesInvolucradosIds).toEqual(enlacesPorTipo(modelo, solLiqIds, "consumo"));
    expect(focoConsumoSolida.estadosOrigenIds).toEqual([solidificadaId]);
    expect(focoConsumoSolida.estadosResultadoIds).toEqual([]);
    expect(focoResultadoSolida.enlacesInvolucradosIds).toEqual(enlacesPorTipo(modelo, solLiqIds, "resultado"));
    expect(focoResultadoSolida.estadosResultadoIds).toEqual([liquidaId]);
    expect(focoResultadoSolida.estadosCurrentVisual[aguaId]).toBe(liquidaId);
    expect(contexto.estadosCurrent[aguaId]).toBe(solidificadaId);

    expect(focoConsumoLiquida.enlacesInvolucradosIds).toEqual(enlacesPorTipo(modelo, liqGasIds, "consumo"));
    expect(focoConsumoLiquida.estadosOrigenIds).toEqual([liquidaId]);
    expect(focoResultadoLiquida.enlacesInvolucradosIds).toEqual(enlacesPorTipo(modelo, liqGasIds, "resultado"));
    expect(focoResultadoLiquida.estadosResultadoIds).toEqual([gaseosaId]);
  });
});

function enlacesPorTipo(modelo: Modelo, ids: readonly string[], tipo: "consumo" | "resultado"): string[] {
  return ids.filter((id) => modelo.enlaces[id]?.tipo === tipo);
}

function modeloRutasAgua(): {
  modelo: Modelo;
  aguaId: string;
  solidificadaId: string;
  liquidaId: string;
  gaseosaId: string;
  solLiqIds: string[];
  liqGasIds: string[];
} {
  let modelo = crearModelo("Rutas foco");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 80 }, "Agua"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 320, y: 220 }, "Calentar"));
  const aguaId = entidadPorNombre(modelo, "Agua");
  const calentarId = entidadPorNombre(modelo, "Calentar");
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

  const solLiqIds = Object.values(modelo.enlaces)
    .filter((item) => item.origenId.id === solidificadaId || item.destinoId.id === liquidaId)
    .map((item) => item.id);
  const liqGasIds = Object.values(modelo.enlaces)
    .filter((item) => item.origenId.id === liquidaId || item.destinoId.id === gaseosa.estadoId)
    .map((item) => item.id);
  for (const enlaceId of solLiqIds) modelo = must(definirRutaEtiqueta(modelo, enlaceId, "sol-liq"));
  for (const enlaceId of liqGasIds) modelo = must(definirRutaEtiqueta(modelo, enlaceId, "liq-gas"));
  return { modelo, aguaId, solidificadaId, liquidaId, gaseosaId: gaseosa.estadoId, solLiqIds, liqGasIds };
}
