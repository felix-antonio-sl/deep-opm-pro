import { describe, expect, test } from "bun:test";
import { entidadIdDeExtremo, extremoEntidad, extremoEstado } from "../extremos";
import { agregacionesInzoomFaltantes, apuntarExtremoEnlace, cambiarTipoGrupoEstructural, crearEnlace, crearEstadosIniciales, crearModelo, crearObjeto, crearProceso, desplegarObjeto, descomponerProceso, eliminarEnlace, fijarOrdenGrupoEstructural, moverPuertoEnlace, plegarCompletoGrupoEstructural, plegarGrupoEstructural, quitarPlegadoCompletoEstructural, quitarSemiplegadoEstructural, relacionesEstructuralesFaltantes, relacionesPlegadasEstructurales, relacionesSemiplegadasEstructurales, splitEffectEnPar, traerAgregacionesInzoomFaltantes, traerRelacionesEstructuralesFaltantes } from "../operaciones";
import { filasPlegadoParcial } from "../plegado";
import type { Modelo, Resultado } from "../tipos";
import { eliminarEnlacesBatch } from "./enlaces";

describe("operaciones/enlaces", () => {
  test("efecto permite objeto->proceso como rama potencial de abanico y conserva variantes con estado", () => {
    let modelo = crearModelo("Efectos canonicos");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Procesar"));
    const pedidoId = entidad(modelo, "Pedido");
    const procesarId = entidad(modelo, "Procesar");
    const estados = must(crearEstadosIniciales(modelo, pedidoId));
    modelo = estados.modelo;
    const [entradaId, salidaId] = estados.estadoIds;
    if (!entradaId || !salidaId) throw new Error("La prueba esperaba estados");

    modelo = must(crearEnlace(modelo, modelo.opdRaizId, pedidoId, procesarId, "efecto"));

    modelo = must(crearEnlace(modelo, modelo.opdRaizId, procesarId, pedidoId, "efecto"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(entradaId), procesarId, "efecto"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, procesarId, extremoEstado(salidaId), "efecto"));

    const efectos = Object.values(modelo.enlaces).filter((enlace) => enlace.tipo === "efecto");
    expect(efectos).toHaveLength(4);
    expect(efectos.some((enlace) => enlace.origenId.kind === "entidad" && enlace.destinoId.kind === "entidad")).toBe(true);
    expect(efectos.some((enlace) => enlace.origenId.kind === "estado" && enlace.destinoId.kind === "entidad")).toBe(true);
    expect(efectos.some((enlace) => enlace.origenId.kind === "entidad" && enlace.destinoId.kind === "estado")).toBe(true);
  });

  test("splitEffectEnPar escinde TS3 en efecto input/output acoplado sin objeto sintetico", () => {
    let modelo = crearModelo("Split TS3");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Procesar"));
    const pedidoId = entidad(modelo, "Pedido");
    const procesarId = entidad(modelo, "Procesar");
    const estados = must(crearEstadosIniciales(modelo, pedidoId));
    modelo = estados.modelo;
    const [entradaId, salidaId] = estados.estadoIds;
    if (!entradaId || !salidaId) throw new Error("La prueba esperaba estados");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, procesarId, pedidoId, "efecto"));
    const efectoId = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "efecto")?.id;
    if (!efectoId) throw new Error("La prueba esperaba efecto");
    modelo = {
      ...modelo,
      enlaces: {
        ...modelo.enlaces,
        [efectoId]: {
          ...modelo.enlaces[efectoId]!,
          estadoEntradaId: entradaId,
          estadoSalidaId: salidaId,
        },
      },
    };
    const entidadesAntes = Object.keys(modelo.entidades);

    modelo = must(splitEffectEnPar(modelo, modelo.opdRaizId, efectoId));

    expect(modelo.enlaces[efectoId]).toBeUndefined();
    expect(Object.keys(modelo.entidades)).toEqual(entidadesAntes);
    const efectos = Object.values(modelo.enlaces).filter((enlace) => enlace.tipo === "efecto");
    expect(efectos).toHaveLength(2);
    const entrada = efectos.find((enlace) => enlace.efectoEscindido?.rol === "entrada");
    const salida = efectos.find((enlace) => enlace.efectoEscindido?.rol === "salida");
    expect(entrada).toMatchObject({
      origenId: extremoEstado(entradaId),
      destinoId: extremoEntidad(procesarId),
      efectoEscindido: { enlacePadreId: efectoId, rol: "entrada" },
    });
    expect(salida).toMatchObject({
      origenId: extremoEntidad(procesarId),
      destinoId: extremoEstado(salidaId),
      efectoEscindido: { enlacePadreId: efectoId, rol: "salida" },
    });
    expect(entrada?.efectoEscindido?.grupoId).toBe(salida?.efectoEscindido?.grupoId);
    expect(entrada ? entidadIdDeExtremo(modelo, entrada.origenId) : null).toBe(pedidoId);
    expect(salida ? entidadIdDeExtremo(modelo, salida.destinoId) : null).toBe(pedidoId);
  });

  test("moverPuertoEnlace cambia extremo y mantiene seleccionable el enlace", () => {
    let modelo = modeloBase();
    const enlaceId = Object.keys(modelo.enlaces)[0];
    const destinoNuevo = entidad(modelo, "Validar");
    if (!enlaceId) throw new Error("La prueba esperaba enlace");

    modelo = must(moverPuertoEnlace(modelo, enlaceId, "destino", extremoEntidad(destinoNuevo)));

    expect(modelo.enlaces[enlaceId]?.destinoId).toEqual(expect.objectContaining(extremoEntidad(destinoNuevo)));
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

  test("excepcion temporal no puede reanclarse hacia objeto ni estado", () => {
    let modelo = crearModelo("Excepcion temporal");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 80 }, "Procesar"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 420, y: 80 }, "Manejar Excepcion"));
    const pedidoId = entidad(modelo, "Pedido");
    const estados = must(crearEstadosIniciales(modelo, pedidoId));
    modelo = estados.modelo;
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Procesar"), entidad(modelo, "Manejar Excepcion"), "excepcionSobretiempo"));
    const enlaceId = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "excepcionSobretiempo")?.id;
    const estadoId = estados.estadoIds[0];
    if (!enlaceId || !estadoId) throw new Error("La prueba esperaba excepcion temporal y estado");
    const original = modelo.enlaces[enlaceId];

    expect(apuntarExtremoEnlace(modelo, enlaceId, "destino", extremoEntidad(pedidoId)).ok).toBe(false);
    expect(moverPuertoEnlace(modelo, enlaceId, "origen", extremoEstado(estadoId)).ok).toBe(false);
    expect(modelo.enlaces[enlaceId]).toEqual(original);
  });

  test("apuntarExtremoEnlace reancla origen/destino de un enlace estructural a otra cosa", () => {
    // BUG-20260530T214922Z-fb6c2c: el inspector ahora expone "Extremos" para
    // estructurales fundamentales; el kernel debe permitir reasignar su cosa
    // origen/destino respetando la firma (misma clase OPM para generalización).
    let modelo = crearModelo("Reanclaje estructural");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Vehiculo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 80 }, "Auto"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 420, y: 80 }, "Camion"));
    const vehiculoId = entidad(modelo, "Vehiculo");
    const autoId = entidad(modelo, "Auto");
    const camionId = entidad(modelo, "Camion");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, vehiculoId, autoId, "generalizacion"));
    const enlaceId = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "generalizacion")?.id;
    if (!enlaceId) throw new Error("La prueba esperaba generalización");

    modelo = must(apuntarExtremoEnlace(modelo, enlaceId, "destino", extremoEntidad(camionId)));
    expect(entidadIdDeExtremo(modelo, modelo.enlaces[enlaceId]!.destinoId)).toBe(camionId);

    // Reanclar a un estado debe rechazarse en estructurales [V-237].
    const estados = must(crearEstadosIniciales(modelo, camionId));
    const estadoId = estados.estadoIds[0];
    if (!estadoId) throw new Error("La prueba esperaba estado");
    expect(apuntarExtremoEnlace(estados.modelo, enlaceId, "destino", extremoEstado(estadoId)).ok).toBe(false);
  });

  test("eliminarEnlacesBatch elimina ids existentes e ignora ids ausentes", () => {
    let modelo = modeloBase();
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Entrada"), entidad(modelo, "Validar"), "consumo"));
    const enlaces = Object.keys(modelo.enlaces);

    modelo = must(eliminarEnlacesBatch(modelo, [enlaces[0]!, "enlace-inexistente"]));

    expect(Object.keys(modelo.enlaces)).toEqual([enlaces[1]!]);
    expect(Object.values(modelo.opds[modelo.opdRaizId]?.enlaces ?? {}).map((apariencia) => apariencia.enlaceId)).toEqual([enlaces[1]!]);
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

  test("eliminarEnlace limpia orderedFundamentalTypes cuando desaparece el ultimo enlace estructural del tipo", () => {
    let modelo = modeloEstructural();
    const ids = Object.keys(modelo.enlaces);
    const todoId = entidad(modelo, "Todo");
    if (ids.length !== 2) throw new Error("La prueba esperaba dos enlaces estructurales");
    modelo = must(fijarOrdenGrupoEstructural(modelo, ids, true));

    modelo = must(eliminarEnlace(modelo, ids[0]!));

    expect(modelo.entidades[todoId]?.orderedFundamentalTypes).toEqual(["agregacion"]);

    modelo = must(eliminarEnlace(modelo, ids[1]!));

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

  test("traerAgregacionesInzoomFaltantes materializa agregaciones inferidas desde in-zoom", () => {
    let modelo = crearModelo("Agregaciones in-zoom");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Todo"));
    const todoId = entidad(modelo, "Todo");
    const descomposicion = must(descomponerProceso(modelo, modelo.opdRaizId, todoId));
    modelo = descomposicion.modelo;

    expect(agregacionesInzoomFaltantes(modelo, modelo.opdRaizId, todoId).faltantes).toBe(3);
    const resultado = must(traerAgregacionesInzoomFaltantes(modelo, modelo.opdRaizId, todoId));
    modelo = resultado.modelo;

    expect(resultado.creadas).toBe(3);
    expect(resultado.agregadas).toBe(3);
    expect(Object.values(modelo.enlaces).filter((enlace) => enlace.tipo === "agregacion")).toHaveLength(3);
    expect(Object.keys(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})).toHaveLength(3);
    expect(agregacionesInzoomFaltantes(modelo, modelo.opdRaizId, todoId).faltantes).toBe(0);
  });

  test("traerRelacionesEstructuralesFaltantes crea agregaciones in-zoom dentro del grupo seleccionado", () => {
    let modelo = crearModelo("Agregaciones in-zoom por grupo");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Todo"));
    const todoId = entidad(modelo, "Todo");
    const descomposicion = must(descomponerProceso(modelo, modelo.opdRaizId, todoId));
    modelo = descomposicion.modelo;
    const internas = entidadesInternasDeInzoom(modelo, descomposicion.opdId, todoId);
    const primera = internas[0];
    if (!primera) throw new Error("La prueba esperaba refinadores internos");
    const opdRaiz = modelo.opds[modelo.opdRaizId];
    const aparienciaReferencia = Object.values(modelo.opds[descomposicion.opdId]?.apariencias ?? {})
      .find((apariencia) => apariencia.entidadId === primera);
    if (!opdRaiz || !aparienciaReferencia) throw new Error("La prueba esperaba apariencias base");
    modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        [modelo.opdRaizId]: {
          ...opdRaiz,
          apariencias: {
            ...opdRaiz.apariencias,
            "a-visible-inzoom-test": {
              ...aparienciaReferencia,
              id: "a-visible-inzoom-test",
              opdId: modelo.opdRaizId,
              x: 320,
              y: 90,
            },
          },
        },
      },
    };
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, todoId, primera, "agregacion"));
    const enlaceBaseId = Object.values(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})[0]?.enlaceId;
    if (!enlaceBaseId) throw new Error("La prueba esperaba enlace base");

    expect(relacionesEstructuralesFaltantes(modelo, modelo.opdRaizId, [enlaceBaseId]).faltantes).toBe(2);
    const resultado = must(traerRelacionesEstructuralesFaltantes(modelo, modelo.opdRaizId, [enlaceBaseId]));
    modelo = resultado.modelo;

    expect(resultado.agregadas).toBe(2);
    expect(Object.values(modelo.enlaces).filter((enlace) => enlace.tipo === "agregacion")).toHaveLength(3);
    expect(Object.keys(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})).toHaveLength(3);
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

  test("plegarCompletoGrupoEstructural oculta el grupo sin filas parciales y permite desplegarlo", () => {
    let modelo = modeloEstructural();
    const todoId = entidad(modelo, "Todo");
    const ids = Object.keys(modelo.enlaces);
    if (ids.length !== 2) throw new Error("La prueba esperaba dos enlaces estructurales");

    modelo = must(plegarCompletoGrupoEstructural(modelo, modelo.opdRaizId, ids));

    expect(Object.keys(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})).toHaveLength(0);
    const padre = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {}).find((apariencia) => apariencia.entidadId === todoId);
    expect(padre?.modoPlegado).toBe("plegado");
    expect(relacionesPlegadasEstructurales(modelo, modelo.opdRaizId, todoId).faltantes).toBe(2);
    expect(filasPlegadoParcial(modelo, modelo.opdRaizId, padre?.id ?? "")).toHaveLength(0);

    const resultado = must(quitarPlegadoCompletoEstructural(modelo, modelo.opdRaizId, todoId));
    modelo = resultado.modelo;

    expect(resultado.agregadas).toBe(2);
    expect(Object.keys(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})).toHaveLength(2);
    const padreExpandido = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {}).find((apariencia) => apariencia.entidadId === todoId);
    expect(padreExpandido?.modoPlegado).toBeUndefined();
    expect(relacionesPlegadasEstructurales(modelo, modelo.opdRaizId, todoId).faltantes).toBe(0);
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

function entidadesInternasDeInzoom(modelo: Modelo, opdId: string, refinableId: string): string[] {
  return Object.values(modelo.opds[opdId]?.apariencias ?? {})
    .filter((apariencia) => {
      const contexto = apariencia.contextoRefinamiento;
      return contexto?.tipo === "descomposicion"
        && contexto.rol === "interno"
        && contexto.refinableEntidadId === refinableId;
    })
    .sort((a, b) => a.y - b.y || a.x - b.x || a.id.localeCompare(b.id))
    .map((apariencia) => apariencia.entidadId);
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
