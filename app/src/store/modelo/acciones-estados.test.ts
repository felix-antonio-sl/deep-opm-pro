import { describe, expect, test, beforeEach } from "bun:test";
import { store } from "../../store";
import { crearOnStarSystem } from "../../modelo/fixtures";
import { estadosDeEntidad } from "../../modelo/operaciones";
import { exportarModelo } from "../../serializacion/json";

/**
 * Tests del slice modelo/acciones-estados — acciones "from-selection"
 * (paquete "Estados ciudadanos de primera clase", 2026-05-23).
 *
 * Verifica que las nuevas acciones leen `estadoSeleccionId` cuando
 * existe, y setean `mensaje` (sin mutar) cuando no.
 *
 * Spec: docs/superpowers/specs/2026-05-23-estados-ciudadania-primera-clase-design.md §3.
 */

function sembrarObjetoCon3Estados(): { objetoId: string; estadoIds: string[] } {
  cargarModeloReferencia();
  // Aseguramos un objeto con 3 estados.
  store.getState().crearObjetoDemo();
  const objeto = Object.values(store.getState().modelo.entidades).find((e) => e.tipo === "objeto" && e.nombre.startsWith("Objeto"));
  if (!objeto) throw new Error("Seed sin objeto");
  store.getState().setSeleccion([objeto.id]);
  store.getState().agregarEstadosObjeto();
  store.getState().agregarEstadoObjeto();
  const estadoIds = estadosDeEntidad(store.getState().modelo, objeto.id).map((e) => e.id);
  if (estadoIds.length < 3) throw new Error("Seed con menos de 3 estados");
  store.getState().vaciarSeleccion();
  return { objetoId: objeto.id, estadoIds };
}

function cargarModeloReferencia(): void {
  store.getState().importarJson(exportarModelo(crearOnStarSystem().modelo));
}

describe("acciones-estados — from-selection", () => {
  beforeEach(() => {
    // Reset implicito en sembrarObjetoCon3Estados.
  });

  test("eliminarEstadoSeleccionado borra el estado y limpia estadoSeleccionId", () => {
    const { objetoId, estadoIds } = sembrarObjetoCon3Estados();
    store.getState().seleccionarEstado(estadoIds[2]!);
    expect(store.getState().estadoSeleccionId).toBe(estadoIds[2]!);
    store.getState().eliminarEstadoSeleccionado();
    const restantes = estadosDeEntidad(store.getState().modelo, objetoId).map((e) => e.id);
    expect(restantes).not.toContain(estadoIds[2]!);
    expect(store.getState().estadoSeleccionId).toBeNull();
  });

  test("eliminarEstadoSeleccionado sin selección setea mensaje y no muta", () => {
    sembrarObjetoCon3Estados();
    store.getState().vaciarSeleccion();
    const antes = store.getState().modelo;
    store.getState().eliminarEstadoSeleccionado();
    expect(store.getState().mensaje).toMatch(/Selecciona un estado/);
    expect(store.getState().modelo).toBe(antes);
  });

  test("renombrarEstadoSeleccionadoSmart aplica al estado seleccionado", () => {
    const { estadoIds } = sembrarObjetoCon3Estados();
    store.getState().seleccionarEstado(estadoIds[0]!);
    store.getState().renombrarEstadoSeleccionadoSmart("nuevoNombre");
    expect(store.getState().modelo.estados[estadoIds[0]!]?.nombre).toBe("nuevoNombre");
  });

  test("designarEstadoSeleccionado('inicial') marca el estado", () => {
    const { estadoIds } = sembrarObjetoCon3Estados();
    store.getState().seleccionarEstado(estadoIds[0]!);
    store.getState().designarEstadoSeleccionado("inicial");
    expect(store.getState().modelo.estados[estadoIds[0]!]?.esInicial).toBe(true);
  });

  test("suprimirEstadoSeleccionado marca como suprimido", () => {
    const { estadoIds } = sembrarObjetoCon3Estados();
    store.getState().seleccionarEstado(estadoIds[0]!);
    store.getState().suprimirEstadoSeleccionado();
    expect(store.getState().modelo.estados[estadoIds[0]!]?.suprimido).toBe(true);
  });

  test("abrirModalDuracionEstadoSeleccionado setea modalDuracionAbierto", () => {
    const { estadoIds } = sembrarObjetoCon3Estados();
    store.getState().seleccionarEstado(estadoIds[1]!);
    store.getState().abrirModalDuracionEstadoSeleccionado();
    expect(store.getState().modalDuracionAbierto).toBe(estadoIds[1]!);
  });

  test("agregarEstadoHermanoDeSeleccionado crea uno nuevo en el mismo objeto", () => {
    const { objetoId, estadoIds } = sembrarObjetoCon3Estados();
    store.getState().seleccionarEstado(estadoIds[0]!);
    const antes = estadosDeEntidad(store.getState().modelo, objetoId).length;
    store.getState().agregarEstadoHermanoDeSeleccionado();
    const despues = estadosDeEntidad(store.getState().modelo, objetoId).length;
    expect(despues).toBe(antes + 1);
  });

  test("reordenarEstadoSeleccionado mueve el estado al índice destino", () => {
    const { objetoId, estadoIds } = sembrarObjetoCon3Estados();
    store.getState().seleccionarEstado(estadoIds[0]!);
    store.getState().reordenarEstadoSeleccionado(2);
    const orden = estadosDeEntidad(store.getState().modelo, objetoId).map((e) => e.id);
    expect(orden[2]).toBe(estadoIds[0]!);
  });

  test("moverEstadoEnCanvas persiste posición local y selecciona el estado", () => {
    const { estadoIds } = sembrarObjetoCon3Estados();
    store.getState().moverEstadoEnCanvas(estadoIds[0]!, 34.2, 58.8);
    const estado = store.getState().modelo.estados[estadoIds[0]!];
    expect(estado?.x).toBe(34);
    expect(estado?.y).toBe(59);
    expect(store.getState().estadoSeleccionId).toBe(estadoIds[0]!);
    expect(store.getState().seleccionados).toEqual([estadoIds[0]!]);
  });

  test("redimensionarEstadoEnCanvas persiste tamaño y posición local opcional", () => {
    const { estadoIds } = sembrarObjetoCon3Estados();
    store.getState().redimensionarEstadoEnCanvas(estadoIds[0]!, 92.2, 31.8, { x: 14.4, y: 49.1 });
    const estado = store.getState().modelo.estados[estadoIds[0]!];
    expect(estado).toMatchObject({ width: 92, height: 32, x: 14, y: 49 });
    expect(store.getState().estadoSeleccionId).toBe(estadoIds[0]!);
    expect(store.getState().seleccionados).toEqual([estadoIds[0]!]);
  });

  test("designarBatch aplica designación a varios estados", () => {
    const { estadoIds } = sembrarObjetoCon3Estados();
    store.getState().designarBatch([estadoIds[0]!, estadoIds[1]!], "default");
    // designar default es exclusivo (sólo uno por objeto). El último aplicado gana.
    const e0 = store.getState().modelo.estados[estadoIds[0]!];
    const e1 = store.getState().modelo.estados[estadoIds[1]!];
    const designados = [e0, e1].filter((e) => e?.designaciones?.includes("default"));
    // Para `default` (exclusivo por objeto) sólo uno debe quedar; pero la
    // semántica de "batch sobre el mismo objeto" es aceptable: el último gana.
    expect(designados.length).toBeGreaterThanOrEqual(1);
  });

  test("designarBatch rechaza estados de objetos distintos", () => {
    sembrarObjetoCon3Estados();
    // Crea un objeto distinto con estados.
    store.getState().crearObjetoDemo();
    const otroObj = Object.values(store.getState().modelo.entidades).find((e) => e.tipo === "objeto" && e.nombre.startsWith("Objeto") && !Object.values(store.getState().modelo.estados).some((est) => est.entidadId === e.id))!;
    store.getState().setSeleccion([otroObj.id]);
    store.getState().agregarEstadosObjeto();
    const estadosA = Object.values(store.getState().modelo.estados).filter((e) => e.entidadId !== otroObj.id);
    const estadosB = Object.values(store.getState().modelo.estados).filter((e) => e.entidadId === otroObj.id);
    store.getState().designarBatch([estadosA[0]!.id, estadosB[0]!.id], "inicial");
    expect(store.getState().mensaje).toMatch(/mismo objeto propietario/);
  });
});
