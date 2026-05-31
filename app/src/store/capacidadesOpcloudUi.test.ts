import { beforeEach, describe, expect, test } from "bun:test";
import { store } from "../store";
import { exportarModelo } from "../serializacion/json";
import {
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
  descomponerProceso,
} from "../modelo/operaciones";
import { extremoEstado } from "../modelo/extremos";
import type { Enlace, Modelo, Resultado } from "../modelo/tipos";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function entidadId(modelo: Modelo, nombre: string): string {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function importar(modelo: Modelo): void {
  store.getState().importarJson(exportarModelo(modelo));
}

beforeEach(() => {
  store.getState().importarJson(exportarModelo(crearModelo()));
});

describe("UX store para capacidades OPCloud aspiracionales", () => {
  test("configura ontología organizacional desde una acción de producto", () => {
    store.getState().abrirDialogoOntologia();

    expect(store.getState().dialogoOntologiaAbierto).toBe(true);

    store.getState().definirOntologiaOrganizacionalActual({
      modo: "enforce",
      terminos: [{ canonico: "Paciente", sinonimos: ["Usuario"] }],
    });

    expect(store.getState().dialogoOntologiaAbierto).toBe(false);
    expect(store.getState().modelo.ontologia).toEqual({
      modo: "enforce",
      terminos: [{ canonico: "Paciente", sinonimos: ["Usuario"] }],
    });
  });

  test("marca un objeto seleccionado como requisito y abre su requirement view read-only", () => {
    store.getState().crearObjetoDemo();
    const requisitoId = Object.keys(store.getState().modelo.entidades)[0]!;
    store.getState().seleccionarEntidad(requisitoId);

    store.getState().marcarSeleccionComoRequisito({
      idLogico: "REQ-UX-1",
      descripcion: "La solución debe conservar trazabilidad.",
      dureza: "hard",
      actor: "Arquitectura",
      satisfaction: "pendiente",
    });
    store.getState().crearRequirementViewSeleccionado();

    let estado = store.getState();
    const viewId = estado.opdActivoId;
    store.getState().crearRequirementViewSeleccionado();
    estado = store.getState();
    expect(estado.modelo.entidades[requisitoId]?.estereotipo).toBe("requirement");
    expect(estado.modelo.entidades[requisitoId]?.requisito).toMatchObject({ idLogico: "REQ-UX-1" });
    expect(estado.opdActivoId).toBe(viewId);
    expect(Object.values(estado.modelo.opds).filter((opd) => opd.vista?.kind === "requirement-view" && opd.vista.requisitoEntidadId === requisitoId)).toHaveLength(1);
    expect(estado.modelo.opds[viewId]?.vista).toMatchObject({
      kind: "requirement-view",
      requisitoEntidadId: requisitoId,
      readOnly: true,
    });
  });

  test("crea un requisito desde una cosa y deja visible el vínculo en la selección original", () => {
    store.getState().crearObjetoDemo();
    const targetId = Object.keys(store.getState().modelo.entidades)[0]!;
    store.getState().seleccionarEntidad(targetId);

    store.getState().crearRequisitoEnOpd({
      nombre: "Trazabilidad verificable",
      metadata: {
        idLogico: "REQ-UX-AUTO",
        descripcion: "La cosa debe conservar trazabilidad operable.",
        dureza: "hard",
        satisfaction: "satisface",
      },
    });

    const estado = store.getState();
    const requisito = Object.values(estado.modelo.entidades).find((entidad) => entidad.requisito?.idLogico === "REQ-UX-AUTO");
    expect(requisito?.estereotipo).toBe("requirement");
    expect(Object.values(estado.modelo.satisfaccionesRequisito ?? {})).toContainEqual(expect.objectContaining({
      requisitoEntidadId: requisito?.id,
      target: { tipo: "entidad", id: targetId },
      estado: "satisface",
    }));
    expect(estado.seleccionId).toBe(targetId);
    expect(estado.enlaceSeleccionId).toBeNull();
    expect(estado.mensaje).toBe("Requisito creado y vinculado a la cosa");
  });

  test("crea un requisito desde un enlace y conserva el enlace como contexto visible", () => {
    let modelo = crearModelo("Requisito de enlace");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Procesar"));
    const entradaId = entidadId(modelo, "Entrada");
    const procesarId = entidadId(modelo, "Procesar");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entradaId, procesarId, "consumo"));
    const enlaceId = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "consumo")!.id;
    importar(modelo);
    store.getState().seleccionarEnlace(enlaceId);

    store.getState().crearRequisitoEnOpd({
      nombre: "Consumo auditado",
      metadata: {
        idLogico: "REQ-LINK-AUTO",
        descripcion: "El enlace debe quedar auditado.",
        dureza: "soft",
      },
    });

    const estado = store.getState();
    const requisito = Object.values(estado.modelo.entidades).find((entidad) => entidad.requisito?.idLogico === "REQ-LINK-AUTO");
    expect(requisito?.estereotipo).toBe("requirement");
    expect(Object.values(estado.modelo.satisfaccionesRequisito ?? {})).toContainEqual(expect.objectContaining({
      requisitoEntidadId: requisito?.id,
      target: { tipo: "enlace", id: enlaceId },
      estado: "pendiente",
    }));
    expect(estado.seleccionId).toBeNull();
    expect(estado.enlaceSeleccionId).toBe(enlaceId);
    expect(estado.modelo.enlaces[enlaceId]?.mostrarRequisitos).toBe(true);
  });

  test("asigna satisfacción de requisito a la selección actual", () => {
    store.getState().crearObjetoDemo();
    const requisitoId = Object.keys(store.getState().modelo.entidades)[0]!;
    store.getState().seleccionarEntidad(requisitoId);
    store.getState().marcarSeleccionComoRequisito({
      idLogico: "REQ-UX-2",
      descripcion: "Debe existir una cosa satisfactora.",
      dureza: "soft",
    });
    store.getState().crearProcesoDemo();
    const targetId = Object.values(store.getState().modelo.entidades).find((entidad) => entidad.tipo === "proceso")!.id;
    store.getState().seleccionarEntidad(targetId);

    store.getState().satisfacerSeleccionConRequisito({
      requisitoEntidadId: requisitoId,
      estado: "satisface",
      descripcion: "Cubierto por el proceso.",
    });

    expect(Object.values(store.getState().modelo.satisfaccionesRequisito ?? {})).toEqual([
      expect.objectContaining({
        requisitoEntidadId: requisitoId,
        target: { tipo: "entidad", id: targetId },
        estado: "satisface",
      }),
    ]);
  });

  test("conecta submodelo LF-04 desde la selección y conserva la edición en el OPD padre", () => {
    store.getState().crearProcesoDemo();
    const anchorId = Object.keys(store.getState().modelo.entidades)[0]!;
    store.getState().seleccionarEntidad(anchorId);

    store.getState().conectarSubmodeloSeleccionado({
      modeloId: "modelo-hijo",
      nombre: "Proceso detalle",
    });

    const estado = store.getState();
    const submodelo = Object.values(estado.modelo.submodelos ?? {})[0]!;
    expect(submodelo).toMatchObject({
      modeloId: "modelo-hijo",
      nombre: "Proceso detalle",
      anchorEntidadId: anchorId,
      estado: "descargado",
    });
    expect(estado.modelo.opds[submodelo.opdVistaId!]?.vista).toMatchObject({
      kind: "submodel-view",
      submodeloRefId: submodelo.id,
      readOnly: true,
    });
    expect(estado.opdActivoId).toBe(estado.modelo.opdRaizId);
  });

  test("ejecuta split parcial TS4/TS5 sobre el enlace seleccionado", () => {
    let modelo = crearModelo("Split UX");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Resolver"));
    const pedidoId = entidadId(modelo, "Pedido");
    const resolverId = entidadId(modelo, "Resolver");
    const estados = must(crearEstadosIniciales(modelo, pedidoId));
    modelo = estados.modelo;
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, resolverId, pedidoId, "efecto"));
    const efectoId = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "efecto")!.id;
    modelo = {
      ...modelo,
      enlaces: {
        ...modelo.enlaces,
        [efectoId]: { ...modelo.enlaces[efectoId]!, estadoSalidaId: estados.estadoIds[0]! },
      },
    };
    importar(modelo);
    store.getState().seleccionarEnlace(efectoId);

    store.getState().splitEffectParcialSeleccionado();

    const enlaces = Object.values(store.getState().modelo.enlaces);
    expect(enlaces.some((enlace) => enlace.id === efectoId)).toBe(false);
    expect(enlaces.find((enlace) => enlace.tipo === "efecto")).toMatchObject({
      origenId: { kind: "entidad", id: resolverId },
      destinoId: extremoEstado(estados.estadoIds[0]!),
      efectoEscindido: { enlacePadreId: efectoId, rol: "salida", modo: "standalone" },
    });
  });

  test("recolecta y redistribuye contorno desde el enlace seleccionado", () => {
    const fixture = modeloConContorno();
    importar(fixture.modelo);
    store.getState().cambiarOpdActivo(fixture.opdHijoId);
    store.getState().seleccionarEnlace(fixture.derivadoId);

    store.getState().recolectarEnlaceContornoSeleccionado();
    expect(enlacesDelOpd(store.getState().modelo, fixture.opdHijoId).map((enlace) => enlace.id)).toContain(fixture.enlacePadreId);

    store.getState().seleccionarEnlace(fixture.enlacePadreId);
    store.getState().distribuirEnlaceContornoSeleccionado();
    expect(enlacesDelOpd(store.getState().modelo, fixture.opdHijoId).map((enlace) => enlace.id)).not.toContain(fixture.enlacePadreId);
    expect(enlacesDelOpd(store.getState().modelo, fixture.opdHijoId).some((enlace) => enlace.derivado?.enlacePadreId === fixture.enlacePadreId)).toBe(true);
  });
});

function modeloConContorno(): { modelo: Modelo; opdHijoId: string; enlacePadreId: string; derivadoId: string } {
  let modelo = crearModelo("Contorno UX");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Entrada"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Procesar"));
  const entradaId = entidadId(modelo, "Entrada");
  const procesarId = entidadId(modelo, "Procesar");
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, entradaId, procesarId, "consumo"));
  const enlacePadreId = Object.values(modelo.enlaces).find((enlace) => enlace.tipo === "consumo")!.id;
  const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, procesarId));
  modelo = descompuesto.modelo;
  const derivadoId = enlacesDelOpd(modelo, descompuesto.opdId).find((enlace) => enlace.derivado?.enlacePadreId === enlacePadreId)!.id;
  return { modelo, opdHijoId: descompuesto.opdId, enlacePadreId, derivadoId };
}

function enlacesDelOpd(modelo: Modelo, opdId: string): Enlace[] {
  return Object.values(modelo.opds[opdId]?.enlaces ?? {})
    .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
    .filter((enlace): enlace is Enlace => !!enlace);
}
