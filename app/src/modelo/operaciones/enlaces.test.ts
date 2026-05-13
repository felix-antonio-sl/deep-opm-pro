import { describe, expect, test } from "bun:test";
import { extremoEntidad } from "../extremos";
import { cambiarTipoGrupoEstructural, crearEnlace, crearModelo, crearObjeto, crearProceso, desplegarObjeto, fijarOrdenGrupoEstructural, moverPuertoEnlace, plegarGrupoEstructural, quitarSemiplegadoEstructural, relacionesEstructuralesFaltantes, relacionesSemiplegadasEstructurales, traerRelacionesEstructuralesFaltantes } from "../operaciones";
import { filasPlegadoParcial } from "../plegado";
import type { Modelo, Resultado } from "../tipos";
import { copiarEstiloEnlace, eliminarEnlacesBatch } from "./enlaces";

describe("operaciones/enlaces", () => {
  test("moverPuertoEnlace cambia extremo y mantiene seleccionable el enlace", () => {
    let modelo = modeloBase();
    const enlaceId = Object.keys(modelo.enlaces)[0];
    const destinoNuevo = entidad(modelo, "Validar");
    if (!enlaceId) throw new Error("La prueba esperaba enlace");

    modelo = must(moverPuertoEnlace(modelo, enlaceId, "destino", extremoEntidad(destinoNuevo)));

    expect(modelo.enlaces[enlaceId]?.destinoId).toEqual(extremoEntidad(destinoNuevo));
    expect(modelo.enlaces[enlaceId]).toBeDefined();
  });

  test("moverPuertoEnlace remueve relacion cuando se solicita", () => {
    let modelo = modeloBase();
    const enlaceId = Object.keys(modelo.enlaces)[0];
    if (!enlaceId) throw new Error("La prueba esperaba enlace");

    modelo = must(moverPuertoEnlace(modelo, enlaceId, "destino", extremoEntidad(entidad(modelo, "Validar")), true));

    expect(modelo.enlaces[enlaceId]).toBeUndefined();
    expect(Object.values(modelo.opds[modelo.opdRaizId]?.enlaces ?? {}).some((apariencia) => apariencia.enlaceId === enlaceId)).toBe(false);
  });

  test("eliminarEnlacesBatch elimina ids existentes e ignora ids ausentes", () => {
    let modelo = modeloBase();
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Entrada"), entidad(modelo, "Validar"), "consumo"));
    const enlaces = Object.keys(modelo.enlaces);

    modelo = must(eliminarEnlacesBatch(modelo, [enlaces[0]!, "enlace-inexistente"]));

    expect(Object.keys(modelo.enlaces)).toEqual([enlaces[1]!]);
    expect(Object.values(modelo.opds[modelo.opdRaizId]?.enlaces ?? {}).map((apariencia) => apariencia.enlaceId)).toEqual([enlaces[1]!]);
  });

  test("copiarEstiloEnlace retorna una copia defensiva del estilo", () => {
    const modelo = modeloBase();
    const enlaceId = Object.keys(modelo.enlaces)[0];
    if (!enlaceId) throw new Error("La prueba esperaba enlace");
    modelo.enlaces[enlaceId] = {
      ...modelo.enlaces[enlaceId]!,
      estilo: { color: "#1d4ed8", strokeWidth: 2, dashArray: "4 4" },
    };

    const estilo = must(copiarEstiloEnlace(modelo, enlaceId));

    expect(estilo).toEqual({ color: "#1d4ed8", strokeWidth: 2, dashArray: "4 4" });
    expect(estilo).not.toBe(modelo.enlaces[enlaceId]?.estilo);
  });

  test("cambiarTipoGrupoEstructural actualiza un grupo estructural compatible", () => {
    let modelo = modeloEstructural();
    const ids = Object.keys(modelo.enlaces);

    modelo = must(cambiarTipoGrupoEstructural(modelo, ids, "generalizacion"));

    expect(ids.map((id) => modelo.enlaces[id]?.tipo)).toEqual(["generalizacion", "generalizacion"]);
  });

  test("fijarOrdenGrupoEstructural persiste orderedFundamentalTypes en el refinable", () => {
    let modelo = modeloEstructural();
    const ids = Object.keys(modelo.enlaces);
    const todoId = entidad(modelo, "Todo");

    modelo = must(fijarOrdenGrupoEstructural(modelo, ids, true));
    expect(modelo.entidades[todoId]?.orderedFundamentalTypes).toEqual(["agregacion"]);

    modelo = must(fijarOrdenGrupoEstructural(modelo, ids, false));
    expect(modelo.entidades[todoId]?.orderedFundamentalTypes).toBeUndefined();
  });

  test("traerRelacionesEstructuralesFaltantes materializa refinadores del despliegue en el OPD activo", () => {
    let modelo = crearModelo("Traer faltantes");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Todo"));
    const todoId = entidad(modelo, "Todo");
    const despliegue = must(desplegarObjeto(modelo, modelo.opdRaizId, todoId));
    modelo = despliegue.modelo;
    const enlaceBaseId = Object.values(modelo.opds[despliegue.opdId]?.enlaces ?? {})[0]?.enlaceId;
    if (!enlaceBaseId) throw new Error("La prueba esperaba enlace estructural en despliegue");

    expect(relacionesEstructuralesFaltantes(modelo, modelo.opdRaizId, [enlaceBaseId]).faltantes).toBe(3);
    const resultado = must(traerRelacionesEstructuralesFaltantes(modelo, modelo.opdRaizId, [enlaceBaseId]));
    modelo = resultado.modelo;

    expect(resultado.agregadas).toBe(3);
    expect(Object.keys(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})).toHaveLength(3);
    expect(Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})
      .filter((apariencia) => apariencia.entidadId !== todoId)).toHaveLength(3);
  });

  test("plegarGrupoEstructural semipliega refinadores visibles bajo el refinable", () => {
    let modelo = crearModelo("Semifolding");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Todo"));
    const todoId = entidad(modelo, "Todo");
    const despliegue = must(desplegarObjeto(modelo, modelo.opdRaizId, todoId));
    modelo = despliegue.modelo;
    const enlaceBaseId = Object.values(modelo.opds[despliegue.opdId]?.enlaces ?? {})[0]?.enlaceId;
    if (!enlaceBaseId) throw new Error("La prueba esperaba enlace estructural en despliegue");
    modelo = must(traerRelacionesEstructuralesFaltantes(modelo, modelo.opdRaizId, [enlaceBaseId])).modelo;
    const padre = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {}).find((apariencia) => apariencia.entidadId === todoId);
    if (!padre) throw new Error("La prueba esperaba apariencia padre");

    modelo = must(plegarGrupoEstructural(modelo, modelo.opdRaizId, [enlaceBaseId]));

    expect(Object.keys(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})).toHaveLength(0);
    expect(Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {}).map((apariencia) => apariencia.entidadId)).toEqual([todoId]);
    expect(modelo.opds[modelo.opdRaizId]?.apariencias[padre.id]?.modoPlegado).toBe("parcial");
    expect(filasPlegadoParcial(modelo, modelo.opdRaizId, padre.id)).toHaveLength(3);
  });

  test("quitarSemiplegadoEstructural revierte el semiplegado y rematerializa enlaces", () => {
    let modelo = crearModelo("Quitar semifolding");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Todo"));
    const todoId = entidad(modelo, "Todo");
    const despliegue = must(desplegarObjeto(modelo, modelo.opdRaizId, todoId));
    modelo = despliegue.modelo;
    const enlaceBaseId = Object.values(modelo.opds[despliegue.opdId]?.enlaces ?? {})[0]?.enlaceId;
    if (!enlaceBaseId) throw new Error("La prueba esperaba enlace estructural en despliegue");
    modelo = must(traerRelacionesEstructuralesFaltantes(modelo, modelo.opdRaizId, [enlaceBaseId])).modelo;
    modelo = must(plegarGrupoEstructural(modelo, modelo.opdRaizId, [enlaceBaseId]));

    expect(relacionesSemiplegadasEstructurales(modelo, modelo.opdRaizId, todoId).faltantes).toBe(3);
    const resultado = must(quitarSemiplegadoEstructural(modelo, modelo.opdRaizId, todoId));
    modelo = resultado.modelo;

    expect(resultado.agregadas).toBe(3);
    expect(Object.keys(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})).toHaveLength(3);
    expect(Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})
      .filter((apariencia) => apariencia.entidadId !== todoId)).toHaveLength(3);
    const padre = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {}).find((apariencia) => apariencia.entidadId === todoId);
    expect(padre?.modoPlegado).toBeUndefined();
    expect(relacionesSemiplegadasEstructurales(modelo, modelo.opdRaizId, todoId).faltantes).toBe(0);
  });
});

function modeloBase(): Modelo {
  let modelo = crearModelo("Mover puerto");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Entrada"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 80 }, "Procesar"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 420, y: 80 }, "Validar"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Entrada"), entidad(modelo, "Procesar"), "consumo"));
  return modelo;
}

function modeloEstructural(): Modelo {
  let modelo = crearModelo("Grupo estructural");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 90 }, "Todo"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 240, y: 20 }, "Parte A"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 240, y: 160 }, "Parte B"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Todo"), entidad(modelo, "Parte A"), "agregacion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Todo"), entidad(modelo, "Parte B"), "agregacion"));
  return modelo;
}

function entidad(modelo: Modelo, nombre: string): string {
  const item = Object.values(modelo.entidades).find((entidadActual) => entidadActual.nombre === nombre);
  if (!item) throw new Error(`Entidad no encontrada: ${nombre}`);
  return item.id;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
