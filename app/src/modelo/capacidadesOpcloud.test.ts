import { describe, expect, test } from "bun:test";
import { formarAbanico } from "./abanicos";
import { resolverDecisionAbanico, resolverDecisionEnlace } from "./decision";
import { extremoEntidad, extremoEstado } from "./extremos";
import {
  actualizarMaterializacionSubmodelo,
  conectarSubmodelo,
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
  crearRequirementView,
  crearRequisito,
  definirOntologiaOrganizacional,
  descomponerProceso,
  descargarVistaSubmodelo,
  desconectarSubmodelo,
  distribuirEnlaceExternoEnRefinamiento,
  evaluarNombreOntologia,
  marcarEstadoSubmodelo,
  recolectarEnlaceExternoEnRefinamiento,
  renombrarEntidad,
  satisfacerRequisito,
  splitEffectParcial,
} from "./operaciones";
import type { Enlace, Modelo, Resultado } from "./tipos";
import { exportarModelo, hidratarModelo } from "../serializacion/json";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(`Fixture fail: ${resultado.error}`);
  return resultado.value;
}

function entidadId(modelo: Modelo, nombre: string): string {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function enlacesDelOpd(modelo: Modelo, opdId: string): Enlace[] {
  return Object.values(modelo.opds[opdId]?.enlaces ?? {})
    .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
    .filter((enlace): enlace is Enlace => !!enlace);
}

describe("capacidades objetivo OPCloud canonizadas en kernel", () => {
  test("ontología organizacional sugiere o refuerza nombres canónicos", () => {
    let modelo = crearModelo("Ontologia");
    modelo = must(definirOntologiaOrganizacional(modelo, {
      modo: "suggest",
      terminos: [{ canonico: "Paciente", sinonimos: ["Usuario"] }],
    }));

    expect(evaluarNombreOntologia(modelo, "Usuario")).toMatchObject({
      accion: "suggest",
      canonico: "Paciente",
      nombre: "Usuario",
    });

    modelo = must(definirOntologiaOrganizacional(modelo, {
      modo: "enforce",
      terminos: [{ canonico: "Paciente", sinonimos: ["Usuario"] }],
    }));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 20 }, "Usuario"));
    expect(modelo.entidades[entidadId(modelo, "Paciente")]?.nombre).toBe("Paciente");

    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 20 }, "Atender"));
    const atenderId = entidadId(modelo, "Atender");
    modelo = must(renombrarEntidad(modelo, atenderId, "Usuario_Externo"));
    expect(modelo.entidades[atenderId]?.nombre).toBe("Usuario_Externo");
  });

  test("split parcial TS4/TS5 transforma un TS3 con un solo estado en efecto standalone", () => {
    let modelo = crearModelo("Split parcial");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Resolver"));
    const pedidoId = entidadId(modelo, "Pedido");
    const resolverId = entidadId(modelo, "Resolver");
    const estados = must(crearEstadosIniciales(modelo, pedidoId));
    modelo = estados.modelo;
    const [entradaId] = estados.estadoIds;
    if (!entradaId) throw new Error("La prueba esperaba estado de entrada");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, resolverId, pedidoId, "efecto"));
    const efectoId = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "efecto")?.id;
    if (!efectoId) throw new Error("La prueba esperaba efecto TS3");
    modelo = {
      ...modelo,
      enlaces: {
        ...modelo.enlaces,
        [efectoId]: { ...modelo.enlaces[efectoId]!, estadoEntradaId: entradaId },
      },
    };

    modelo = must(splitEffectParcial(modelo, modelo.opdRaizId, efectoId));

    expect(modelo.enlaces[efectoId]).toBeUndefined();
    const parcial = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "efecto");
    expect(parcial).toMatchObject({
      origenId: extremoEstado(entradaId),
      destinoId: extremoEntidad(resolverId),
      efectoEscindido: { enlacePadreId: efectoId, rol: "entrada", modo: "standalone" },
    });
  });

  test("split parcial TS4/TS5 acepta efecto ya conectado visualmente a un estado de salida", () => {
    let modelo = crearModelo("Split parcial visible");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Caja Fuerte"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Abrir"));
    const cajaId = entidadId(modelo, "Caja Fuerte");
    const abrirId = entidadId(modelo, "Abrir");
    const estados = must(crearEstadosIniciales(modelo, cajaId));
    modelo = estados.modelo;
    const [, salidaId] = estados.estadoIds;
    if (!salidaId) throw new Error("La prueba esperaba estado de salida");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(abrirId), extremoEstado(salidaId), "efecto"));
    const efectoId = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "efecto")?.id;
    if (!efectoId) throw new Error("La prueba esperaba efecto parcial visual");

    modelo = must(splitEffectParcial(modelo, modelo.opdRaizId, efectoId));

    expect(modelo.enlaces[efectoId]).toBeUndefined();
    const parcial = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "efecto");
    expect(parcial).toMatchObject({
      origenId: extremoEntidad(abrirId),
      destinoId: extremoEstado(salidaId),
      efectoEscindido: { enlacePadreId: efectoId, rol: "salida", modo: "standalone" },
    });
  });

  test("recolecta y redistribuye un enlace externo del contorno sin perder el enlace padre", () => {
    let modelo = crearModelo("Recolectar contorno");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Procesar"));
    const entradaId = entidadId(modelo, "Entrada");
    const procesarId = entidadId(modelo, "Procesar");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entradaId, procesarId, "consumo"));
    const enlacePadreId = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "consumo")?.id;
    if (!enlacePadreId) throw new Error("La prueba esperaba enlace padre");
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, procesarId));
    modelo = descompuesto.modelo;
    expect(enlacesDelOpd(modelo, descompuesto.opdId).some((enlace) => enlace.derivado?.enlacePadreId === enlacePadreId)).toBe(true);

    modelo = must(recolectarEnlaceExternoEnRefinamiento(modelo, descompuesto.opdId, enlacePadreId));
    expect(modelo.enlaces[enlacePadreId]).toBeDefined();
    expect(enlacesDelOpd(modelo, descompuesto.opdId).map((enlace) => enlace.id)).toContain(enlacePadreId);
    expect(enlacesDelOpd(modelo, descompuesto.opdId).some((enlace) => enlace.derivado?.enlacePadreId === enlacePadreId)).toBe(false);

    modelo = must(distribuirEnlaceExternoEnRefinamiento(modelo, descompuesto.opdId, enlacePadreId));
    expect(enlacesDelOpd(modelo, descompuesto.opdId).map((enlace) => enlace.id)).not.toContain(enlacePadreId);
    expect(enlacesDelOpd(modelo, descompuesto.opdId).some((enlace) => enlace.derivado?.enlacePadreId === enlacePadreId)).toBe(true);
  });

  test("resuelve decisión por estado fijo, uniforme, probabilidades y función registrada", () => {
    let modelo = crearModelo("Decision");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 120, y: 120 }, "Decidir"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 360, y: 80 }, "Pedido"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 360, y: 220 }, "Alternativa"));
    const decidirId = entidadId(modelo, "Decidir");
    const pedidoId = entidadId(modelo, "Pedido");
    const alternativaId = entidadId(modelo, "Alternativa");
    const estados = must(crearEstadosIniciales(modelo, pedidoId));
    modelo = estados.modelo;
    const [pendienteId, aprobadoId] = estados.estadoIds;
    if (!pendienteId || !aprobadoId) throw new Error("La prueba esperaba estados");

    modelo = must(crearEnlace(modelo, modelo.opdRaizId, decidirId, extremoEstado(aprobadoId), "resultado"));
    const fijoId = Object.values(modelo.enlaces).find((enlace) => enlace.destinoId.kind === "estado")?.id;
    if (!fijoId) throw new Error("La prueba esperaba resultado a estado");
    expect(must(resolverDecisionEnlace(modelo, fijoId))).toMatchObject({ modo: "estado-fijo", estadoId: aprobadoId });

    modelo = must(crearEnlace(modelo, modelo.opdRaizId, decidirId, pedidoId, "resultado"));
    const uniformeId = Object.values(modelo.enlaces).find((enlace) => enlace.destinoId.kind === "entidad" && enlace.destinoId.id === pedidoId)?.id;
    if (!uniformeId) throw new Error("La prueba esperaba resultado a objeto");
    expect(must(resolverDecisionEnlace(modelo, uniformeId)).probabilidades).toEqual({
      [pendienteId]: 0.5,
      [aprobadoId]: 0.5,
    });

    modelo = must(crearEnlace(modelo, modelo.opdRaizId, decidirId, alternativaId, "resultado"));
    const ramas = Object.values(modelo.enlaces).filter((enlace) => enlace.tipo === "resultado" && enlace.destinoId.kind === "entidad");
    if (ramas.length < 2) throw new Error("La prueba esperaba ramas de decisión");
    modelo = {
      ...modelo,
      enlaces: {
        ...modelo.enlaces,
        [ramas[0]!.id]: { ...ramas[0]!, origenId: { ...ramas[0]!.origenId, portId: "port-decision" }, modificador: "evento", probabilidad: 0.7 },
        [ramas[1]!.id]: { ...ramas[1]!, origenId: { ...ramas[1]!.origenId, portId: "port-decision" }, modificador: "evento", probabilidad: 0.3 },
      },
    };
    modelo = must(formarAbanico(modelo, modelo.opdRaizId, ramas.map((enlace) => enlace.id), "XOR"));
    const abanicoId = Object.keys(modelo.abanicos ?? {})[0]!;
    expect(must(resolverDecisionAbanico(modelo, abanicoId, { random: () => 0.8 }))).toMatchObject({
      modo: "probabilidades",
      enlaceId: ramas[1]!.id,
    });

    modelo = {
      ...modelo,
      abanicos: {
        ...modelo.abanicos,
        [abanicoId]: { ...modelo.abanicos![abanicoId]!, decision: { modo: "funcion", funcionId: "elige-primera" } },
      },
    };
    expect(must(resolverDecisionAbanico(modelo, abanicoId, {
      funciones: { "elige-primera": () => ramas[0]!.id },
    }))).toMatchObject({ modo: "funcion", enlaceId: ramas[0]!.id });
  });

  test("requisitos estructurados, requirement view y submodelo sobreviven round-trip JSON", () => {
    let modelo = crearModelo("Requisitos y submodelos");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Validar"));
    const validarId = entidadId(modelo, "Validar");
    const creado = must(crearRequisito(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Debe validar", {
      idLogico: "REQ-1",
      descripcion: "El sistema debe validar la solicitud.",
      dureza: "hard",
      actor: "Auditor",
      satisfaction: "pendiente",
    }));
    modelo = creado.modelo;
    modelo = must(satisfacerRequisito(modelo, creado.requisitoEntidadId, { tipo: "entidad", id: validarId }, "satisface"));
    const view = must(crearRequirementView(modelo, creado.requisitoEntidadId));
    modelo = view.modelo;
    const submodelo = must(conectarSubmodelo(modelo, {
      anchorEntidadId: validarId,
      modeloId: "modelo-hijo",
      nombre: "Validar detalle",
    }));
    modelo = must(marcarEstadoSubmodelo(submodelo.modelo, submodelo.refId, "cargado-sincronizado"));
    modelo = must(desconectarSubmodelo(modelo, submodelo.refId));

    const hidratado = hidratarModelo(exportarModelo(modelo));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.entidades[creado.requisitoEntidadId]?.requisito).toMatchObject({ idLogico: "REQ-1", dureza: "hard" });
    expect(Object.values(hidratado.value.satisfaccionesRequisito ?? {})).toHaveLength(1);
    expect(hidratado.value.opds[view.opdId]?.vista).toMatchObject({ kind: "requirement-view", readOnly: true });
    expect(hidratado.value.submodelos?.[submodelo.refId]?.estado).toBe("desconectado");
    expect(hidratado.value.opds[submodelo.opdVistaId]?.vista).toMatchObject({ kind: "submodel-view", syncState: "desconectado" });
  });

  test("submodelo LF-04 materializa snapshot visible del SD raíz seleccionado", () => {
    let padre = crearModelo("Padre");
    padre = must(crearProceso(padre, padre.opdRaizId, { x: 240, y: 80 }, "Validar"));
    const validarId = entidadId(padre, "Validar");

    let hijo = crearModelo("Hijo");
    hijo = must(crearObjeto(hijo, hijo.opdRaizId, { x: 40, y: 80 }, "Entrada hijo"));
    hijo = must(crearProceso(hijo, hijo.opdRaizId, { x: 260, y: 80 }, "Procesar hijo"));
    hijo = must(crearObjeto(hijo, hijo.opdRaizId, { x: 500, y: 40 }, "Salida A"));
    hijo = must(crearObjeto(hijo, hijo.opdRaizId, { x: 500, y: 140 }, "Salida B"));
    const entradaId = entidadId(hijo, "Entrada hijo");
    const procesarId = entidadId(hijo, "Procesar hijo");
    const salidaAId = entidadId(hijo, "Salida A");
    const salidaBId = entidadId(hijo, "Salida B");
    hijo = must(crearEnlace(hijo, hijo.opdRaizId, entradaId, procesarId, "consumo"));
    hijo = must(crearEnlace(hijo, hijo.opdRaizId, procesarId, salidaAId, "resultado"));
    hijo = must(crearEnlace(hijo, hijo.opdRaizId, procesarId, salidaBId, "resultado"));
    const ramas = Object.values(hijo.enlaces).filter((enlace) => enlace.tipo === "resultado");
    if (ramas.length !== 2) throw new Error("La prueba esperaba dos resultados para el abanico");
    hijo = {
      ...hijo,
      enlaces: {
        ...hijo.enlaces,
        [ramas[0]!.id]: { ...ramas[0]!, origenId: { ...ramas[0]!.origenId, portId: "port-xor-submodelo" } },
        [ramas[1]!.id]: { ...ramas[1]!, origenId: { ...ramas[1]!.origenId, portId: "port-xor-submodelo" } },
      },
    };
    hijo = must(formarAbanico(hijo, hijo.opdRaizId, ramas.map((enlace) => enlace.id), "XOR"));
    const abanicoHijoId = Object.keys(hijo.abanicos ?? {})[0]!;
    hijo = {
      ...hijo,
      abanicos: {
        ...hijo.abanicos,
        [abanicoHijoId]: {
          ...hijo.abanicos![abanicoHijoId]!,
          decision: { modo: "probabilidades", pesos: { [ramas[0]!.id]: 0.6, [ramas[1]!.id]: 0.4 } },
        },
      },
    };

    const conectado = must(conectarSubmodelo(padre, {
      anchorEntidadId: validarId,
      modeloId: "modelo-hijo",
      nombre: "Validar detalle",
      snapshot: hijo,
    }));

    const modelo = conectado.modelo;
    const ref = modelo.submodelos?.[conectado.refId];
    const vista = modelo.opds[conectado.opdVistaId];
    expect(ref?.estado).toBe("cargado-sincronizado");
    expect(vista?.vista).toMatchObject({ kind: "submodel-view", readOnly: true, syncState: "cargado-sincronizado" });
    expect(Object.values(vista?.apariencias ?? {}).map((apariencia) => modelo.entidades[apariencia.entidadId]?.nombre).sort()).toEqual([
      "Entrada hijo",
      "Procesar hijo",
      "Salida A",
      "Salida B",
    ]);
    expect(Object.values(vista?.enlaces ?? {}).map((apariencia) => modelo.enlaces[apariencia.enlaceId]?.tipo).sort()).toEqual(["consumo", "resultado", "resultado"]);
    const abanico = Object.values(modelo.abanicos ?? {}).find((item) => item.opdId === conectado.opdVistaId);
    expect(abanico?.decision?.modo).toBe("probabilidades");
    if (abanico?.decision?.modo !== "probabilidades") throw new Error("La prueba esperaba decisión por probabilidades");
    expect(Object.keys(abanico.decision.pesos).sort()).toEqual([...abanico.enlaceIds].sort());
    expect(must(resolverDecisionAbanico(modelo, abanico.id, { random: () => 0.7 })).enlaceId).toBe(abanico.enlaceIds[1]);
    expect(hidratarModelo(exportarModelo(modelo)).ok).toBe(true);
  });

  test("submodelo LF-04 descarga y actualiza la vista materializada sin romper la referencia", () => {
    let padre = crearModelo("Padre");
    padre = must(crearProceso(padre, padre.opdRaizId, { x: 240, y: 80 }, "Validar"));
    const validarId = entidadId(padre, "Validar");

    let hijo = crearModelo("Hijo");
    hijo = must(crearObjeto(hijo, hijo.opdRaizId, { x: 40, y: 80 }, "Entrada"));
    hijo = must(crearProceso(hijo, hijo.opdRaizId, { x: 260, y: 80 }, "Procesar"));

    const conectado = must(conectarSubmodelo(padre, {
      anchorEntidadId: validarId,
      modeloId: "modelo-hijo",
      nombre: "Validar detalle",
      snapshot: hijo,
    }));
    const entidadesMaterializadas = Object.values(conectado.modelo.submodelos![conectado.refId]!.materializacion!.entidadMap);
    let modelo = must(descargarVistaSubmodelo(conectado.modelo, conectado.refId));
    expect(modelo.submodelos?.[conectado.refId]?.estado).toBe("descargado");
    expect(Object.keys(modelo.opds[conectado.opdVistaId]!.apariencias)).toHaveLength(0);
    expect(entidadesMaterializadas.some((id) => modelo.entidades[id])).toBe(false);

    hijo = must(crearObjeto(hijo, hijo.opdRaizId, { x: 500, y: 80 }, "Salida"));
    const actualizado = must(actualizarMaterializacionSubmodelo(modelo, conectado.refId, hijo));
    modelo = actualizado.modelo;
    expect(modelo.submodelos?.[conectado.refId]?.estado).toBe("cargado-sincronizado");
    expect(Object.values(modelo.opds[conectado.opdVistaId]!.apariencias).map((apariencia) => modelo.entidades[apariencia.entidadId]?.nombre).sort()).toEqual([
      "Entrada",
      "Procesar",
      "Salida",
    ]);
  });
});
