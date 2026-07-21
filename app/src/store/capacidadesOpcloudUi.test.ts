import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { store } from "../store";
import { ESTEREOTIPO_REQUIREMENT_ID } from "../modelo/estereotipos";
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
import type { ModeloPersistido } from "../persistencia/modelos";

let originalFetch: typeof fetch;

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
  instalarBackendMock();
  store.getState().importarJson(exportarModelo(crearModelo()));
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  Reflect.deleteProperty(globalThis, "window");
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
    expect(estado.modelo.entidades[requisitoId]?.estereotipoId).toBe(ESTEREOTIPO_REQUIREMENT_ID);
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
    expect(requisito?.estereotipoId).toBe(ESTEREOTIPO_REQUIREMENT_ID);
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
    expect(requisito?.estereotipoId).toBe(ESTEREOTIPO_REQUIREMENT_ID);
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

  test("conecta submodelo LF-04 desde la selección y conserva la edición en el OPD padre", async () => {
    store.getState().crearProcesoDemo();
    const anchorId = Object.keys(store.getState().modelo.entidades)[0]!;
    store.getState().seleccionarEntidad(anchorId);

    store.getState().conectarSubmodeloSeleccionado({
      modeloId: "modelo-hijo",
      nombre: "Proceso detalle",
    });
    await esperar(() => store.getState().mensaje === "Submodelo conectado y cargado");

    const estado = store.getState();
    const submodelo = Object.values(estado.modelo.submodelos ?? {})[0]!;
    expect(submodelo).toMatchObject({
      modeloId: "modelo-hijo",
      nombre: "Proceso detalle",
      anchorEntidadId: anchorId,
      estado: "cargado-sincronizado",
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

  // ── D6.4 — Vitrina de estereotipos ──────────────────────────────────────
  test("abre y cierra la vitrina de estereotipos (flag de UI)", () => {
    expect(store.getState().vitrinaEstereotiposAbierta).toBe(false);
    store.getState().abrirVitrinaEstereotipos();
    expect(store.getState().vitrinaEstereotiposAbierta).toBe(true);
    store.getState().cerrarVitrinaEstereotipos();
    expect(store.getState().vitrinaEstereotiposAbierta).toBe(false);
  });

  test("crea un estereotipo desde la selección actual y lo agrega al catálogo con plantilla", () => {
    importar(modeloDosCosasConEnlace());
    const entradaId = entidadId(store.getState().modelo, "Entrada");
    const procesarId = entidadId(store.getState().modelo, "Procesar");
    store.getState().setSeleccion([entradaId, procesarId]);

    store.getState().crearEstereotipoDesdeSeleccionActual("Flujo de admisión");

    const estado = store.getState();
    const catalogo = Object.values(estado.modelo.estereotipos ?? {});
    expect(catalogo).toHaveLength(1);
    const estereotipo = catalogo[0]!;
    expect(estereotipo.nombre).toBe("Flujo de admisión");
    expect(estereotipo.plantilla).toBeDefined();
    expect(Object.keys(estereotipo.plantilla!.entidades)).toHaveLength(2);
    expect(Object.keys(estereotipo.plantilla!.enlaces)).toHaveLength(1);
    expect(estado.mensaje).toBe("Estereotipo creado: Flujo de admisión");
    // No cambia la selección.
    expect(estado.seleccionados.sort()).toEqual([entradaId, procesarId].sort());
  });

  test("crear estereotipo con selección vacía avisa y no muta el catálogo", () => {
    importar(modeloDosCosasConEnlace());
    store.getState().vaciarSeleccion();
    const antes = JSON.stringify(store.getState().modelo.estereotipos ?? {});

    store.getState().crearEstereotipoDesdeSeleccionActual("Inservible");

    expect(store.getState().mensaje).toBe("Selecciona cosas para guardar como estereotipo");
    expect(JSON.stringify(store.getState().modelo.estereotipos ?? {})).toBe(antes);
  });

  test("injerta un estereotipo en el OPD activo: crea cosas frescas y selecciona el ancla", () => {
    importar(modeloDosCosasConEnlace());
    const entradaId = entidadId(store.getState().modelo, "Entrada");
    const procesarId = entidadId(store.getState().modelo, "Procesar");
    store.getState().setSeleccion([entradaId, procesarId]);
    store.getState().crearEstereotipoDesdeSeleccionActual("Flujo");
    const estereotipoId = Object.keys(store.getState().modelo.estereotipos ?? {})[0]!;

    const entidadesAntes = Object.keys(store.getState().modelo.entidades).length;
    store.getState().injertarEstereotipoEnOpd(estereotipoId);

    const estado = store.getState();
    // Dos cosas nuevas (clones frescos), independientes de las originales.
    expect(Object.keys(estado.modelo.entidades).length).toBe(entidadesAntes + 2);
    expect(estado.seleccionId).not.toBeNull();
    expect(estado.seleccionId).not.toBe(entradaId);
    expect(estado.seleccionId).not.toBe(procesarId);
    // El ancla seleccionada porta el estereotipo aplicado.
    expect(estado.modelo.entidades[estado.seleccionId!]?.estereotipoId).toBe(estereotipoId);
    expect(estado.seleccionados).toHaveLength(2);
    expect(estado.mensaje).toBe("Estereotipo injertado");
  });

  test("abrir capacidades y resolver sin selección son efectos transitorios, no commits", () => {
    const modeloAntes = exportarModelo(store.getState().modelo);
    const undoAntes = store.getState().puedeDeshacer;

    store.getState().abrirDialogoRequisito("crear");
    expect(store.getState().dialogoRequisitoAbierto).toBe("crear");
    expect(exportarModelo(store.getState().modelo)).toBe(modeloAntes);
    expect(store.getState().puedeDeshacer).toBe(undoAntes);
    store.getState().cerrarDialogoRequisito();

    store.getState().abrirDialogoSubmodelo();
    expect(store.getState().dialogoSubmodeloAbierto).toBeTrue();
    expect(exportarModelo(store.getState().modelo)).toBe(modeloAntes);
    expect(store.getState().puedeDeshacer).toBe(undoAntes);
    store.getState().cerrarDialogoSubmodelo();

    store.getState().abrirDialogoSimulacionNumerica();
    expect(store.getState().dialogoSimulacionNumericaAbierto).toBeTrue();
    expect(exportarModelo(store.getState().modelo)).toBe(modeloAntes);
    expect(store.getState().puedeDeshacer).toBe(undoAntes);
    store.getState().cerrarDialogoSimulacionNumerica();

    store.getState().resolverDecisionSeleccionada();
    expect(store.getState().mensaje).toBe("Selecciona una rama o enlace de decisión");
    expect(exportarModelo(store.getState().modelo)).toBe(modeloAntes);
    expect(store.getState().puedeDeshacer).toBe(undoAntes);
  });
});

function instalarBackendMock(): void {
  Object.defineProperty(globalThis, "window", { configurable: true, value: {} });
  originalFetch = globalThis.fetch;
  const modeloHijo = crearModelo("Proceso detalle");
  const persistido: ModeloPersistido = {
    id: "modelo-hijo",
    nombre: "Proceso detalle",
    descripcion: "",
    creadoEn: "2026-06-06T00:00:00.000Z",
    actualizadoEn: "2026-06-06T00:00:00.000Z",
    json: exportarModelo(modeloHijo),
    revision: 1,
  };
  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? "GET";
    if (url === "/__deep-opm/modelos/modelo-hijo" && method === "GET") {
      return Promise.resolve(jsonResponse({ modelo: persistido }));
    }
    return Promise.resolve(jsonResponse({ error: "unexpected" }, 404));
  }) as unknown as typeof fetch;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function esperar(condicion: () => boolean): Promise<void> {
  for (let intento = 0; intento < 30; intento += 1) {
    if (condicion()) return;
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

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

function modeloDosCosasConEnlace(): Modelo {
  let modelo = crearModelo("Estereotipo UX");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Entrada"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Procesar"));
  const entradaId = entidadId(modelo, "Entrada");
  const procesarId = entidadId(modelo, "Procesar");
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, entradaId, procesarId, "consumo"));
  return modelo;
}
