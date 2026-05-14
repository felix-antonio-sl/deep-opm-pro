import { describe, expect, test } from "bun:test";
import { crearEnlace, crearModelo, crearObjeto } from "../modelo/operaciones";
import { exportarModelo } from "../serializacion/json";
import { store } from "../store";

describe("slice enlaces", () => {
  test("elegirTipoEnlace abre modo enlace y cancelarEnlace lo limpia", () => {
    store.getState().cargarDemo();
    const id = Object.keys(store.getState().modelo.entidades)[0]!;

    store.getState().seleccionarEntidad(id);
    store.getState().elegirTipoEnlace("instrumento");
    expect(store.getState().modoEnlace).toEqual({ tipo: "instrumento", origenId: id });

    store.getState().cancelarEnlace();
    expect(store.getState().modoEnlace).toBeNull();
  });

  test("mover simbolo estructural conserva anclas manuales", () => {
    let modelo = crearModelo("Anclas estructurales");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Parte"));
    const todoId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Todo")?.id;
    const parteId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Parte")?.id;
    expect(todoId).toBeDefined();
    expect(parteId).toBeDefined();
    if (!todoId || !parteId) return;
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, todoId, parteId, "agregacion"));
    const aparienciaEnlaceId = Object.keys(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})[0]!;
    store.getState().importarJson(exportarModelo(modelo));

    store.getState().actualizarAnclajesSimboloEstructural([aparienciaEnlaceId], {
      refinable: { dx: -10, dy: -15 },
      refinador: { dx: 8, dy: 15 },
    });
    store.getState().actualizarPosicionSimboloEstructural([aparienciaEnlaceId], { x: 210, y: 160 });

    expect(store.getState().modelo.opds[modelo.opdRaizId]?.enlaces[aparienciaEnlaceId]?.symbolAnchors).toEqual({
      refinable: { dx: -10, dy: -15 },
      refinador: { dx: 8, dy: 15 },
    });
  });

  test("mover simbolo estructural sin anclas manuales no persiste defaults", () => {
    let modelo = crearModelo("Anclas automaticas");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Parte"));
    const todoId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Todo")?.id;
    const parteId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Parte")?.id;
    expect(todoId).toBeDefined();
    expect(parteId).toBeDefined();
    if (!todoId || !parteId) return;
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, todoId, parteId, "agregacion"));
    const aparienciaEnlaceId = Object.keys(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})[0]!;
    store.getState().importarJson(exportarModelo(modelo));

    store.getState().actualizarPosicionSimboloEstructural([aparienciaEnlaceId], { x: 210, y: 160 });

    expect(store.getState().modelo.opds[modelo.opdRaizId]?.enlaces[aparienciaEnlaceId]?.symbolPos).toEqual({ x: 210, y: 160 });
    expect(store.getState().modelo.opds[modelo.opdRaizId]?.enlaces[aparienciaEnlaceId]?.symbolAnchors).toBeUndefined();
  });

  test("resetear anclas de simbolo estructural elimina override manual", () => {
    let modelo = crearModelo("Reset anclas estructurales");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Parte"));
    const todoId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Todo")?.id;
    const parteId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Parte")?.id;
    expect(todoId).toBeDefined();
    expect(parteId).toBeDefined();
    if (!todoId || !parteId) return;
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, todoId, parteId, "agregacion"));
    const aparienciaEnlaceId = Object.keys(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})[0]!;
    store.getState().importarJson(exportarModelo(modelo));

    store.getState().actualizarAnclajesSimboloEstructural([aparienciaEnlaceId], {
      refinable: { dx: -10, dy: -15 },
      refinador: { dx: 8, dy: 15 },
    });
    store.getState().resetearAnclajesSimboloEstructural([aparienciaEnlaceId]);

    expect(store.getState().modelo.opds[modelo.opdRaizId]?.enlaces[aparienciaEnlaceId]?.symbolAnchors).toBeUndefined();
  });
});

function must<T>(resultado: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
