import { describe, expect, test } from "bun:test";
import { crearEnlace, crearModelo, crearObjeto, crearProceso } from "../modelo/operaciones";
import type { Id, Modelo, Resultado } from "../modelo/tipos";
import { generarOpl } from "../opl/generar";
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
  insertarPlantillaBatch,
  nudgeApariencias,
  ocultarAparienciaBatch,
  pegarSeleccion,
  redimensionarBatch,
  traerConectadosBatch,
  traerEnlacesEntreBatch,
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

  test("traerConectadosBatch trae vecinos directos por familia sin propagar", () => {
    const { modelo, opdId, proceso, instrumento, resultado, externo } = modeloBringConOpdParcial();
    const origen = aparienciaDeEntidadEnOpd(modelo, opdId, proceso)!;
    const traido = must(traerConectadosBatch(modelo, opdId, origen.id, ["procedural-habilitador", "procedural-transformador", "estructural"]));
    expect(aparienciaDeEntidadEnOpd(traido, opdId, instrumento)).toBeDefined();
    expect(aparienciaDeEntidadEnOpd(traido, opdId, resultado)).toBeDefined();
    expect(aparienciaDeEntidadEnOpd(traido, opdId, externo)).toBeUndefined();
    expect(Object.values(traido.opds[opdId]!.enlaces)).toHaveLength(2);
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

  test("insertarPlantillaBatch copia entidades, enlaces, apariencias y genera IDs nuevos", () => {
    const destino = must(crearObjeto(crearModelo("Destino"), "opd-1", { x: 20, y: 20 }, "Sensor"));
    const fuente = plantillaConExhibicion();
    const resultado = must(insertarPlantillaBatch(destino, destino.opdRaizId, fuente, fuente.opdRaizId));

    expect(resultado.entidadesInsertadas).toBe(2);
    expect(resultado.enlacesInsertados).toBe(1);
    expect(Object.keys(resultado.modelo.entidades)).toHaveLength(Object.keys(destino.entidades).length + 2);
    expect(resultado.idsNuevos.every((id) => !fuente.entidades[id] && !fuente.enlaces[id])).toBe(true);
    expect(Object.values(resultado.modelo.opds[destino.opdRaizId]?.apariencias ?? {})).toHaveLength(3);
  });

  test("insertarPlantillaBatch aplica sufijo _2/_3 para colisiones nominales en OPD destino", () => {
    let destino = crearModelo("Destino colisiones");
    destino = must(crearObjeto(destino, destino.opdRaizId, { x: 20, y: 20 }, "Sensor"));
    destino = must(crearObjeto(destino, destino.opdRaizId, { x: 180, y: 20 }, "Sensor_2"));
    const fuente = plantillaConExhibicion("Sensor");

    const resultado = must(insertarPlantillaBatch(destino, destino.opdRaizId, fuente, fuente.opdRaizId));
    const nombres = Object.values(resultado.modelo.entidades).map((entidad) => entidad.nombre);
    expect(nombres).toContain("Sensor_3");
  });

  test("insertarPlantillaBatch preserva etiqueta de enlace exhibición", () => {
    const destino = crearModelo("Destino etiquetas");
    const fuente = plantillaConExhibicion("Equipo", "Capacidad", "capacidad nominal");
    const resultado = must(insertarPlantillaBatch(destino, destino.opdRaizId, fuente, fuente.opdRaizId));

    expect(Object.values(resultado.modelo.enlaces).some((enlace) =>
      enlace.tipo === "exhibicion" && enlace.etiqueta === "capacidad nominal"
    )).toBe(true);
  });

  test("insertarPlantillaBatch crea sub-OPDs como descendientes del OPD activo", () => {
    const destino = crearModelo("Destino subopd");
    const fuente = plantillaConSubOpd();
    const resultado = must(insertarPlantillaBatch(destino, destino.opdRaizId, fuente, fuente.opdRaizId));
    const hijos = Object.values(resultado.modelo.opds).filter((opd) => opd.padreId === destino.opdRaizId);

    expect(resultado.opdsInsertados).toBe(1);
    expect(hijos).toHaveLength(1);
    const proceso = Object.values(resultado.modelo.entidades).find((entidad) => entidad.nombre === "Proceso plantilla");
    expect(proceso?.refinamientos?.descomposicion?.opdId).toBe(hijos[0]?.id);
    expect(Object.values(hijos[0]?.apariencias ?? {}).some((ap) =>
      resultado.modelo.entidades[ap.entidadId]?.nombre === "Paso interno"
    )).toBe(true);
  });

  test("HU-33.018: modificar plantilla fuente después de insertar no altera la copia destino", () => {
    const destino = crearModelo("Destino desacople");
    const fuente = plantillaConExhibicion("Sensor");
    const resultado = must(insertarPlantillaBatch(destino, destino.opdRaizId, fuente, fuente.opdRaizId));
    const nombreInsertado = Object.values(resultado.modelo.entidades).find((entidad) => entidad.nombre === "Sensor")?.nombre;
    const fuenteMutada: Modelo = {
      ...fuente,
      entidades: Object.fromEntries(Object.entries(fuente.entidades).map(([id, entidad]) => [
        id,
        entidad.nombre === "Sensor" ? { ...entidad, nombre: "Sensor mutado" } : entidad,
      ])),
    };

    expect(nombreInsertado).toBe("Sensor");
    expect(Object.values(resultado.modelo.entidades).some((entidad) => entidad.nombre === "Sensor mutado")).toBe(false);
    expect(Object.values(fuenteMutada.entidades).some((entidad) => entidad.nombre === "Sensor mutado")).toBe(true);
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

function plantillaConExhibicion(nombreBase = "Sensor", nombreAtributo = "Voltaje", etiqueta = "medición"): Modelo {
  let modelo = crearModelo("Plantilla");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, nombreBase));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 280, y: 80 }, nombreAtributo));
  const base = entidadPorNombre(modelo, nombreBase);
  const atributo = entidadPorNombre(modelo, nombreAtributo);
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, base, atributo, "exhibicion", etiqueta));
  return modelo;
}

function plantillaConSubOpd(): Modelo {
  let modelo = crearModelo("Plantilla subOPD");
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 120, y: 80 }, "Proceso plantilla"));
  const procesoId = entidadPorNombre(modelo, "Proceso plantilla");
  const childId = "opd-plantilla-hijo";
  modelo = {
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [procesoId]: {
        ...modelo.entidades[procesoId]!,
        refinamientos: { descomposicion: { opdId: childId } },
      },
    },
    opds: {
      ...modelo.opds,
      [childId]: {
        id: childId,
        nombre: "Detalle plantilla",
        padreId: modelo.opdRaizId,
        apariencias: {},
        enlaces: {},
      },
    },
  };
  modelo = must(crearObjeto(modelo, childId, { x: 100, y: 120 }, "Paso interno"));
  return modelo;
}

function entidadPorNombre(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
