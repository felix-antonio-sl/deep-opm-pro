import { describe, expect, test, beforeEach } from "bun:test";
import { crearOnStarSystem } from "../modelo/fixtures";
import { exportarModelo } from "../serializacion/json";
import { store } from "../store";
import type { KindSeleccion } from "./tipos";

/**
 * Tests del slice de selección.
 *
 * Incluye el test categorial obligatorio del invariante de exclusividad
 * mutua entre `seleccionId`, `enlaceSeleccionId` y `estadoSeleccionId`
 * sellado por el punto único `setSeleccionPorTipo` (paquete "Estados
 * ciudadanos de primera clase", 2026-05-23).
 *
 * Spec: docs/superpowers/specs/2026-05-23-estados-ciudadania-primera-clase-design.md §9.
 */

function ids(): { entidadId: string; otraEntidadId: string; enlaceId: string; estadoIds: [string, string]; estadoOtroId: string } {
  const estado = store.getState();
  const entidades = Object.values(estado.modelo.entidades);
  const enlaces = Object.values(estado.modelo.enlaces);
  const estados = Object.values(estado.modelo.estados);
  const objetoConEstados = entidades.find((entidad) => estados.some((e) => e.entidadId === entidad.id));
  const objetosConEstados = entidades.filter((entidad) => estados.some((e) => e.entidadId === entidad.id));
  if (!objetoConEstados || objetosConEstados.length < 2) throw new Error("Semilla insuficiente: necesito 2 objetos con estados");
  const estadosObjeto1 = estados.filter((e) => e.entidadId === objetoConEstados.id);
  const objetoOtro = objetosConEstados.find((o) => o.id !== objetoConEstados.id)!;
  const estadosObjetoOtro = estados.filter((e) => e.entidadId === objetoOtro.id);
  if (estadosObjeto1.length < 2 || estadosObjetoOtro.length < 1) throw new Error("Semilla insuficiente de estados");
  return {
    entidadId: entidades[0]!.id,
    otraEntidadId: entidades.find((e) => e.id !== entidades[0]!.id)!.id,
    enlaceId: enlaces[0]?.id ?? "",
    estadoIds: [estadosObjeto1[0]!.id, estadosObjeto1[1]!.id],
    estadoOtroId: estadosObjetoOtro[0]!.id,
  };
}

function sembrar(): void {
  cargarModeloReferencia();
  // Asegura que existen al menos 2 objetos con estados y 1 enlace.
  let estado = store.getState();
  let entidades = Object.values(estado.modelo.entidades).filter((e) => e.tipo === "objeto");
  // Crea objetos extra si el modelo de referencia no tiene 2 objetos.
  while (entidades.length < 2) {
    store.getState().crearObjetoDemo();
    estado = store.getState();
    entidades = Object.values(estado.modelo.entidades).filter((e) => e.tipo === "objeto");
  }
  // Asegura que los 2 primeros objetos tienen estados (2 cada uno).
  for (let i = 0; i < 2; i += 1) {
    const objId = entidades[i]!.id;
    estado = store.getState();
    const estadosDeEste = Object.values(estado.modelo.estados).filter((e) => e.entidadId === objId);
    if (estadosDeEste.length < 2) {
      store.getState().setSeleccion([objId]);
      store.getState().agregarEstadosObjeto();
    }
  }
  store.getState().vaciarSeleccion();
}

function cargarModeloReferencia(): void {
  store.getState().importarJson(exportarModelo(crearOnStarSystem().modelo));
}

describe("slice seleccion — sello del coproducto", () => {
  beforeEach(() => sembrar());

  test("setSeleccion mantiene seleccion simple y vaciarSeleccion limpia el estado", () => {
    const { entidadId } = ids();
    store.getState().setSeleccion([entidadId]);
    expect(store.getState().seleccionId).toBe(entidadId);
    expect(store.getState().seleccionados).toEqual([entidadId]);

    store.getState().vaciarSeleccion();
    expect(store.getState().seleccionados).toEqual([]);
    expect(store.getState().seleccionId).toBeNull();
    expect(store.getState().enlaceSeleccionId).toBeNull();
    expect(store.getState().estadoSeleccionId).toBeNull();
  });

  /**
   * TEST CATEGORIAL OBLIGATORIO. Para cada uno de los 4 valores de
   * `KindSeleccion`, `setSeleccionPorTipo(kind, id)` debe dejar el trío
   * `{seleccionId, enlaceSeleccionId, estadoSeleccionId}` con cardinalidad
   * ≤1 de no-null. Sin este sello, A no es coproducto efectivo — es tres
   * campos en triste vecindad.
   */
  test("invariante: cardinalidad <=1 de no-null en {seleccionId, enlaceSeleccionId, estadoSeleccionId}", () => {
    const { entidadId, enlaceId, estadoIds } = ids();
    const casos: Array<{ kind: KindSeleccion; id: string | null }> = [
      { kind: "entidad", id: entidadId },
      { kind: "enlace", id: enlaceId || null },
      { kind: "estado", id: estadoIds[0] },
      { kind: "vacia", id: null },
    ];
    for (const caso of casos) {
      if (caso.kind === "enlace" && !caso.id) continue; // el modelo puede no tener enlaces
      store.getState().setSeleccionPorTipo(caso.kind, caso.id);
      const s = store.getState();
      const noNull = [s.seleccionId, s.enlaceSeleccionId, s.estadoSeleccionId].filter((v) => v !== null);
      expect(noNull.length).toBeLessThanOrEqual(1);
      if (caso.kind === "vacia") {
        expect(noNull.length).toBe(0);
        expect(s.seleccionados).toEqual([]);
      } else {
        expect(noNull[0]).toBe(caso.id!);
      }
    }
  });

  test("setSeleccionPorTipo('entidad') limpia enlaceSeleccionId y estadoSeleccionId previos", () => {
    const { entidadId, estadoIds } = ids();
    store.getState().setSeleccionPorTipo("estado", estadoIds[0]);
    expect(store.getState().estadoSeleccionId).toBe(estadoIds[0]);
    store.getState().setSeleccionPorTipo("entidad", entidadId);
    expect(store.getState().seleccionId).toBe(entidadId);
    expect(store.getState().estadoSeleccionId).toBeNull();
    expect(store.getState().enlaceSeleccionId).toBeNull();
  });

  test("setSeleccionPorTipo rechaza tipo mismatch", () => {
    const { entidadId } = ids();
    store.getState().setSeleccionPorTipo("estado", entidadId);
    // No setea estadoSeleccionId porque el id es de entidad.
    expect(store.getState().estadoSeleccionId).toBeNull();
    expect(store.getState().mensaje).toMatch(/no corresponde al tipo/);
  });

  test("seleccionarEstado setea sólo estadoSeleccionId", () => {
    const { estadoIds } = ids();
    store.getState().seleccionarEstado(estadoIds[0]);
    const s = store.getState();
    expect(s.estadoSeleccionId).toBe(estadoIds[0]);
    expect(s.seleccionId).toBeNull();
    expect(s.enlaceSeleccionId).toBeNull();
  });

  test("agregarEstadoASeleccion permite hermanos del mismo objeto", () => {
    const { estadoIds } = ids();
    store.getState().seleccionarEstado(estadoIds[0]);
    store.getState().agregarEstadoASeleccion(estadoIds[1]);
    expect(store.getState().seleccionados).toContain(estadoIds[0]);
    expect(store.getState().seleccionados).toContain(estadoIds[1]);
  });

  test("agregarEstadoASeleccion rechaza estados de otro objeto", () => {
    const { estadoIds, estadoOtroId } = ids();
    store.getState().seleccionarEstado(estadoIds[0]);
    store.getState().agregarEstadoASeleccion(estadoOtroId);
    // El estado del otro objeto no debe haberse agregado.
    expect(store.getState().seleccionados).not.toContain(estadoOtroId);
    expect(store.getState().mensaje).toMatch(/mismo objeto propietario/);
  });

  test("estadoSeleccionDesdeIds: mezcla heterogénea colapsa a {seleccionados con todos, los tres campos exclusivos null}", () => {
    const { entidadId, estadoIds } = ids();
    // Mezcla un id de entidad y un id de estado → ambos quedan en `seleccionados`,
    // pero ninguno de los tres campos exclusivos puede iluminar un "único".
    store.getState().setSeleccion([entidadId, estadoIds[0]]);
    const s = store.getState();
    expect(s.seleccionId).toBeNull();
    expect(s.enlaceSeleccionId).toBeNull();
    expect(s.estadoSeleccionId).toBeNull();
    expect(s.seleccionados).toContain(entidadId);
    expect(s.seleccionados).toContain(estadoIds[0]);
  });
});
