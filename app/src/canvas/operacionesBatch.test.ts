import { describe, expect, test } from "bun:test";
import { crearEnlace, crearModelo, crearObjeto, crearProceso } from "../modelo/operaciones";
import type { Id, Modelo, Resultado } from "../modelo/tipos";
import {
  alinearEnlacesIzquierda,
  aplicarEstiloApariencias,
  conectarMultiAlTodo,
  copiarSeleccion,
  eliminarBatch,
  nudgeApariencias,
  pegarSeleccion,
} from "./operacionesBatch";

describe("operacionesBatch", () => {
  test("eliminarBatch borra enlaces seleccionados sin borrar entidades", () => {
    const { modelo, enlaces } = modeloConTodoPartes();
    const eliminado = must(eliminarBatch(modelo, modelo.opdRaizId ? enlaces : enlaces, modelo.opdRaizId));
    expect(Object.keys(eliminado.enlaces)).toHaveLength(0);
    expect(Object.keys(eliminado.entidades).length).toBeGreaterThan(0);
  });

  test("nudgeApariencias mueve cada apariencia seleccionada", () => {
    const { modelo, partes } = modeloConTodoPartes();
    const movido = must(nudgeApariencias(modelo, modelo.opdRaizId, partes, 10, 0));
    for (const parte of partes) {
      const antes = aparienciaDeEntidad(modelo, parte);
      const despues = aparienciaDeEntidad(movido, parte);
      expect(despues?.x).toBe((antes?.x ?? 0) + 10);
    }
  });

  test("alinearEnlacesIzquierda crea vértices sobre la coordenada extrema", () => {
    const { modelo, enlaces } = modeloConTodoPartes();
    const alineado = must(alinearEnlacesIzquierda(modelo, modelo.opdRaizId, enlaces));
    const vertices = Object.values(alineado.opds[modelo.opdRaizId]?.enlaces ?? {}).map((ap) => ap.vertices[0]?.x);
    expect(new Set(vertices).size).toBe(1);
  });

  test("conectarMultiAlTodo crea agregaciones idempotentes", () => {
    const { modelo, todo, partes } = modeloConTodoPartes(false);
    const conectado = must(conectarMultiAlTodo(modelo, modelo.opdRaizId, partes, todo, "agregacion"));
    expect(Object.keys(conectado.enlaces)).toHaveLength(3);
    const otraVez = must(conectarMultiAlTodo(conectado, modelo.opdRaizId, partes, todo, "agregacion"));
    expect(Object.keys(otraVez.enlaces)).toHaveLength(3);
  });

  test("aplicarEstiloApariencias aplica a subset seleccionado", () => {
    const { modelo, partes } = modeloConTodoPartes();
    const actualizado = must(aplicarEstiloApariencias(modelo, modelo.opdRaizId, partes, { fill: "#ff0000" }));
    for (const parte of partes) {
      expect(aparienciaDeEntidad(actualizado, parte)?.estilo?.fill).toBe("#ff0000");
    }
  });

  test("copiarSeleccion y pegarSeleccion reutilizan entidadId con offset visual", () => {
    const { modelo, partes } = modeloConTodoPartes();
    const buffer = copiarSeleccion(modelo, modelo.opdRaizId, partes);
    expect(buffer.apariencias.map((ap) => ap.entidadId)).toEqual(partes);
    const pegado = must(pegarSeleccion(modelo, modelo.opdRaizId, buffer, { x: 24, y: 24 }));
    expect(Object.keys(pegado.modelo.entidades)).toHaveLength(Object.keys(modelo.entidades).length);
    expect(Object.values(pegado.modelo.opds[modelo.opdRaizId]?.apariencias ?? {})).toHaveLength(Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {}).length + partes.length);
  });
});

function modeloConTodoPartes(conEnlaces = true): { modelo: Modelo; todo: Id; partes: Id[]; enlaces: Id[] } {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 40 }, "Todo"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 60, y: 160 }, "Parte A"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 180 }, "Parte B"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 380, y: 160 }, "Parte C"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 560, y: 180 }, "Proceso"));
  const entidades = Object.values(modelo.entidades);
  const todo = entidades.find((entidad) => entidad.nombre === "Todo")!.id;
  const partes = entidades.filter((entidad) => entidad.nombre.startsWith("Parte")).map((entidad) => entidad.id);
  if (conEnlaces) {
    for (const parte of partes) modelo = must(crearEnlace(modelo, modelo.opdRaizId, todo, parte, "agregacion"));
  }
  return { modelo, todo, partes, enlaces: Object.keys(modelo.enlaces) };
}

function aparienciaDeEntidad(modelo: Modelo, entidadId: Id) {
  return Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {}).find((ap) => ap.entidadId === entidadId);
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
