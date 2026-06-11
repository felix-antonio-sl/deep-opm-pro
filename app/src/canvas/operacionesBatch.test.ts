import { describe, expect, test } from "bun:test";
import { crearEnlace, crearModelo, crearObjeto, crearProceso } from "../modelo/operaciones";
import type { Id, Modelo, Resultado } from "../modelo/tipos";
import { generarOpl } from "../opl/generar";
import {
  alinearPorEje,
  alinearEnlacesIzquierda,
  conectarMultiAlTodo,
  copiarSeleccion,
  distribuirUniformemente,
  eliminarBatch,
  eliminarEnlacesBatch,
  nudgeApariencias,
  ocultarAparienciaBatch,
  pegarSeleccion,
  redimensionarBatch,
  traerConectadosBatch,
  traerEnlacesEntreBatch,
  traerEntidadAlOpd,
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
    expect(generarOpl(conectado, modelo.opdRaizId).filter((linea) => linea.includes("consta de"))).toHaveLength(3);
    const otraVez = must(conectarMultiAlTodo(conectado, modelo.opdRaizId, partes, todo, "agregacion"));
    expect(Object.keys(otraVez.enlaces)).toHaveLength(3);
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

  test("traerConectadosBatch trae vecinos directos por familia sin propagar", () => {
    const { modelo, opdId, proceso, instrumento, resultado, externo } = modeloBringConOpdParcial();
    const origen = aparienciaDeEntidadEnOpd(modelo, opdId, proceso)!;
    const traido = must(traerConectadosBatch(modelo, opdId, origen.id, ["procedural-habilitador", "procedural-transformador", "estructural"]));
    expect(aparienciaDeEntidadEnOpd(traido, opdId, instrumento)).toBeDefined();
    expect(aparienciaDeEntidadEnOpd(traido, opdId, resultado)).toBeDefined();
    expect(aparienciaDeEntidadEnOpd(traido, opdId, externo)).toBeUndefined();
    expect(Object.values(traido.opds[opdId]!.enlaces)).toHaveLength(2);
  });

  test("traerEntidadAlOpd crea la apariencia de una cosa nacida en otro OPD y las apariciones de enlaces visibles", () => {
    // El instrumento existe en el modelo (nació en el OPD raíz) pero no aparece
    // en SD2, donde el proceso sí aparece: traerlo debe crear su apariencia y
    // la aparición del enlace instrumento→proceso (ambos extremos visibles).
    const { modelo, opdId, instrumento, proceso } = modeloBringConOpdParcial();
    expect(aparienciaDeEntidadEnOpd(modelo, opdId, instrumento)).toBeUndefined();
    const traido = must(traerEntidadAlOpd(modelo, opdId, instrumento));
    expect(aparienciaDeEntidadEnOpd(traido, opdId, instrumento)).toBeDefined();
    expect(aparienciaDeEntidadEnOpd(traido, opdId, proceso)).toBeDefined();
    const enlacesOpd = Object.values(traido.opds[opdId]!.enlaces);
    expect(enlacesOpd).toHaveLength(1);
  });

  test("traerEntidadAlOpd es idempotente y rechaza entidad inexistente", () => {
    const { modelo, opdId, proceso } = modeloBringConOpdParcial();
    const sinCambio = must(traerEntidadAlOpd(modelo, opdId, proceso));
    expect(sinCambio).toBe(modelo);
    const invalido = traerEntidadAlOpd(modelo, opdId, "no-existe");
    expect(invalido.ok).toBe(false);
  });

  test("traerConectadosBatch no duplica apariencia visible y solo agrega enlace faltante", () => {
    const { modelo, opdId, proceso, instrumento } = modeloBringConOpdParcial({ incluirInstrumento: true });
    const origen = aparienciaDeEntidadEnOpd(modelo, opdId, proceso)!;
    const antes = Object.values(modelo.opds[opdId]!.apariencias).length;
    const traido = must(traerConectadosBatch(modelo, opdId, origen.id, ["procedural-habilitador"]));
    expect(Object.values(traido.opds[opdId]!.apariencias)).toHaveLength(antes);
    expect(aparienciaDeEntidadEnOpd(traido, opdId, instrumento)).toBeDefined();
    expect(Object.values(traido.opds[opdId]!.enlaces)).toHaveLength(1);
  });

  test("traerConectadosBatch sin familia coincidente es no-op", () => {
    const { modelo, opdId, proceso } = modeloBringConOpdParcial();
    const origen = aparienciaDeEntidadEnOpd(modelo, opdId, proceso)!;
    const traido = must(traerConectadosBatch(modelo, opdId, origen.id, ["direccional"]));
    expect(traido).toBe(modelo);
  });

  test("traerEnlacesEntreBatch materializa solo enlaces internos a la selección", () => {
    const { modelo, opdId, a, b, c } = modeloEnlacesInternosSinApariencias();
    const traido = must(traerEnlacesEntreBatch(modelo, opdId, [a, b, c]));
    const etiquetas = Object.values(traido.opds[opdId]!.enlaces)
      .map((ap) => traido.enlaces[ap.enlaceId]!.etiqueta)
      .sort();
    expect(etiquetas).toEqual(["A-B", "A-C"]);
  });

  test("ocultarAparienciaBatch elimina apariencia y enlaces visuales sin tocar logical", () => {
    const { modelo, opdId, a } = modeloEnlacesInternosSinApariencias({ conEnlaceVisible: true });
    const oculto = must(ocultarAparienciaBatch(modelo, opdId, a));
    expect(aparienciaDeEntidadEnOpd(oculto, opdId, a)).toBeUndefined();
    expect(Object.values(oculto.opds[opdId]!.enlaces)).toHaveLength(0);
    expect(oculto.entidades[a]).toBeDefined();
    expect(Object.keys(oculto.enlaces)).toHaveLength(Object.keys(modelo.enlaces).length);
  });

  test("eliminarBatch borra la entidad lógica de todos los OPDs", () => {
    const { modelo, opdId, a, b } = modeloEnlacesInternosSinApariencias({ conEnlaceVisible: true });
    const eliminado = must(eliminarBatch(modelo, [a], opdId));

    expect(eliminado.entidades[a]).toBeUndefined();
    expect(aparienciaDeEntidad(eliminado, a)).toBeUndefined();
    expect(aparienciaDeEntidadEnOpd(eliminado, opdId, a)).toBeUndefined();
    expect(eliminado.entidades[b]).toBeDefined();
    expect(Object.values(eliminado.enlaces).some((enlace) => enlace.origenId.id === a || enlace.destinoId.id === a)).toBe(false);
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

function aparienciaDeEntidadEnOpd(modelo: Modelo, opdId: Id, entidadId: Id) {
  return Object.values(modelo.opds[opdId]?.apariencias ?? {}).find((ap) => ap.entidadId === entidadId);
}

function modeloBringConOpdParcial(opts: { incluirInstrumento?: boolean } = {}) {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 50, y: 50 }, "Instrumento"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 50 }, "Proceso"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 470, y: 50 }, "Resultado"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 680, y: 50 }, "Externo"));
  const id = (nombre: string) => Object.values(modelo.entidades).find((entidad) => entidad.nombre === nombre)!.id;
  const instrumento = id("Instrumento");
  const proceso = id("Proceso");
  const resultado = id("Resultado");
  const externo = id("Externo");
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, instrumento, proceso, "instrumento"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, proceso, resultado, "resultado"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, resultado, externo, "agregacion"));
  const opdId = "opd-traer";
  const procesoAp = aparienciaDeEntidad(modelo, proceso)!;
  const instrumentoAp = aparienciaDeEntidad(modelo, instrumento)!;
  modelo = {
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        id: opdId,
        nombre: "SD2",
        padreId: modelo.opdRaizId,
        apariencias: {
          "a-traer-proceso": { ...procesoAp, id: "a-traer-proceso", opdId, x: 260, y: 220 },
          ...(opts.incluirInstrumento ? { "a-traer-instrumento": { ...instrumentoAp, id: "a-traer-instrumento", opdId, x: 60, y: 220 } } : {}),
        },
        enlaces: {},
      },
    },
  };
  return { modelo, opdId, proceso, instrumento, resultado, externo };
}

function modeloEnlacesInternosSinApariencias(opts: { conEnlaceVisible?: boolean } = {}) {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 50, y: 50 }, "A"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 240, y: 50 }, "B"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 430, y: 50 }, "C"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 620, y: 50 }, "D"));
  const id = (nombre: string) => Object.values(modelo.entidades).find((entidad) => entidad.nombre === nombre)!.id;
  const a = id("A");
  const b = id("B");
  const c = id("C");
  const d = id("D");
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, a, b, "agregacion", "A-B"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, a, c, "agregacion", "A-C"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, b, d, "agregacion", "B-D"));
  const opdId = "opd-internos";
  const aps = Object.fromEntries([a, b, c].map((entidadId) => {
    const ap = aparienciaDeEntidad(modelo, entidadId)!;
    return [`ap-${entidadId}`, { ...ap, id: `ap-${entidadId}`, opdId }];
  }));
  const ab = Object.values(modelo.enlaces).find((enlace) => enlace.etiqueta === "A-B")!;
  modelo = {
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        id: opdId,
        nombre: "SD2",
        padreId: modelo.opdRaizId,
        apariencias: aps,
        enlaces: opts.conEnlaceVisible ? { "ae-visible": { id: "ae-visible", enlaceId: ab.id, opdId, vertices: [] } } : {},
      },
    },
  };
  return { modelo, opdId, a, b, c, d };
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
