import { describe, expect, test } from "bun:test";
import { crearEnlace, crearModelo, crearObjeto, crearProceso } from "../modelo/operaciones";
import type { Id, Modelo, Resultado } from "../modelo/tipos";
import {
  alinearPorEje,
  alinearEnlacesIzquierda,
  aplicarEstiloApariencias,
  aplicarEstiloEnlacesBatch,
  conectarMultiAlTodo,
  copiarSeleccion,
  distribuirUniformemente,
  eliminarBatch,
  eliminarEnlacesBatch,
  nudgeApariencias,
  pegarSeleccion,
  redimensionarBatch,
} from "./operacionesBatch";

describe("operacionesBatch", () => {
  test("eliminarBatch borra enlaces seleccionados sin borrar entidades", () => {
    const { modelo, enlaces } = modeloConTodoPartes();
    const eliminado = must(eliminarBatch(modelo, modelo.opdRaizId ? enlaces : enlaces, modelo.opdRaizId));
    expect(Object.keys(eliminado.enlaces)).toHaveLength(0);
    expect(Object.keys(eliminado.entidades).length).toBeGreaterThan(0);
  });

  test("eliminarEnlacesBatch borra lote de enlaces sin tocar cosas", () => {
    const { modelo, enlaces } = modeloConTodoPartes();
    const eliminado = must(eliminarEnlacesBatch(modelo, enlaces.slice(0, 2)));
    expect(Object.keys(eliminado.enlaces)).toHaveLength(enlaces.length - 2);
    expect(Object.keys(eliminado.entidades)).toHaveLength(Object.keys(modelo.entidades).length);
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

  test("aplicarEstiloEnlacesBatch aplica estilo solo a enlaces seleccionados", () => {
    const { modelo, enlaces } = modeloConTodoPartes();
    const actualizado = must(aplicarEstiloEnlacesBatch(modelo, modelo.opdRaizId, enlaces.slice(0, 2), { color: "#d92d20", strokeWidth: 3 }));
    expect(actualizado.enlaces[enlaces[0]!]?.estilo).toEqual({ color: "#d92d20", strokeWidth: 3 });
    expect(actualizado.enlaces[enlaces[1]!]?.estilo).toEqual({ color: "#d92d20", strokeWidth: 3 });
    expect(actualizado.enlaces[enlaces[2]!]?.estilo).toBeUndefined();
  });

  test("copiarSeleccion y pegarSeleccion reutilizan entidadId con offset visual", () => {
    const { modelo, partes } = modeloConTodoPartes();
    const buffer = copiarSeleccion(modelo, modelo.opdRaizId, partes);
    expect(buffer.apariencias.map((ap) => ap.entidadId)).toEqual(partes);
    const pegado = must(pegarSeleccion(modelo, modelo.opdRaizId, buffer, { x: 24, y: 24 }));
    expect(Object.keys(pegado.modelo.entidades)).toHaveLength(Object.keys(modelo.entidades).length);
    expect(Object.values(pegado.modelo.opds[modelo.opdRaizId]?.apariencias ?? {})).toHaveLength(Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {}).length + partes.length);
  });

  test("alinearPorEje alinea cosas por borde y centro", () => {
    const { modelo, partes } = modeloConTodoPartes();
    const izquierda = must(alinearPorEje(modelo, modelo.opdRaizId, partes, "izq"));
    expect(new Set(partes.map((id) => aparienciaDeEntidad(izquierda, id)?.x)).size).toBe(1);

    const centro = must(alinearPorEje(modelo, modelo.opdRaizId, partes, "centro"));
    const centros = partes.map((id) => {
      const ap = aparienciaDeEntidad(centro, id)!;
      return ap.x + ap.width / 2;
    });
    expect(new Set(centros).size).toBe(1);
  });

  test("distribuirUniformemente reparte centros horizontal y vertical", () => {
    const { modelo, partes } = modeloConTodoPartes();
    const horizontal = must(distribuirUniformemente(modelo, modelo.opdRaizId, partes, "horizontal"));
    const xs = partes.map((id) => {
      const ap = aparienciaDeEntidad(horizontal, id)!;
      return ap.x + ap.width / 2;
    }).sort((a, b) => a - b);
    expect(xs[1]! - xs[0]!).toBe(xs[2]! - xs[1]!);

    const vertical = must(distribuirUniformemente(modelo, modelo.opdRaizId, partes, "vertical"));
    const ys = partes.map((id) => {
      const ap = aparienciaDeEntidad(vertical, id)!;
      return ap.y + ap.height / 2;
    }).sort((a, b) => a - b);
    expect(ys[1]! - ys[0]!).toBe(ys[2]! - ys[1]!);
  });

  test("redimensionarBatch aplica delta y preserva modoTamano existente", () => {
    const { modelo, partes } = modeloConTodoPartes();
    const primera = aparienciaDeEntidad(modelo, partes[0]!)!;
    const opd = modelo.opds[modelo.opdRaizId]!;
    const manual: Modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        [modelo.opdRaizId]: {
          ...opd,
          apariencias: {
            ...opd.apariencias,
            [primera.id]: { ...primera, modoTamano: "manual" },
          },
        },
      },
    };
    const actualizado = must(redimensionarBatch(manual, modelo.opdRaizId, partes, { dw: 20, dh: -10 }));
    expect(aparienciaDeEntidad(actualizado, partes[0]!)?.width).toBe(155);
    expect(aparienciaDeEntidad(actualizado, partes[0]!)?.height).toBe(50);
    expect(aparienciaDeEntidad(actualizado, partes[0]!)?.modoTamano).toBe("manual");
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
