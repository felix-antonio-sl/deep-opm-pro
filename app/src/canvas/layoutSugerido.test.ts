import { describe, expect, test } from "bun:test";
import type { Modelo } from "../modelo/tipos";
import { aplicarLayoutSugerido, calcularLayoutSugerido, dimensionesLayoutSugerido } from "./layoutSugerido";

describe("layoutSugerido", () => {
  test("calcula niveles BFS desde fuentes y distribuye horizontal", () => {
    const modelo = modeloPipeline();
    const posiciones = calcularLayoutSugerido(modelo, "opd-1");
    expect(posiciones).toHaveLength(3);
    const porId = new Map(posiciones.map((p) => [p.aparienciaId, p]));
    const fuente = porId.get("a-fuente")!;
    const proceso = porId.get("a-proceso")!;
    const sumidero = porId.get("a-sumidero")!;
    expect(fuente.y).toBe(80);
    expect(proceso.y).toBe(180);
    expect(sumidero.y).toBe(280);
    expect(fuente.x).toBe(80);
    expect(proceso.x).toBe(80);
  });

  test("apariencias huerfanas (sin enlaces visibles) caen al ultimo nivel", () => {
    const modelo = modeloPipelineConHuerfana();
    const posiciones = calcularLayoutSugerido(modelo, "opd-1");
    const porId = new Map(posiciones.map((p) => [p.aparienciaId, p]));
    const huerfana = porId.get("a-huerfana")!;
    expect(huerfana.y).toBeGreaterThanOrEqual(280);
  });

  test("aplicarLayoutSugerido produce modelo undoable (no muta el original)", () => {
    const modelo = modeloPipeline();
    const original = JSON.stringify(modelo);
    const resultado = aplicarLayoutSugerido(modelo, "opd-1");
    if (!resultado.ok) throw new Error("aplicar fallo");
    expect(JSON.stringify(modelo)).toBe(original);
    expect(resultado.value).not.toBe(modelo);
    const apariencia = resultado.value.opds["opd-1"]?.apariencias["a-fuente"];
    expect(apariencia?.y).toBe(80);
  });

  test("OPD vacio devuelve modelo sin cambios", () => {
    const modelo = modeloVacio();
    const resultado = aplicarLayoutSugerido(modelo, "opd-1");
    expect(resultado.ok).toBe(true);
    if (resultado.ok) expect(resultado.value).toBe(modelo);
  });

  test("dimensionesLayoutSugerido reporta bounding box y niveles", () => {
    const modelo = modeloPipeline();
    const dims = dimensionesLayoutSugerido(modelo, "opd-1");
    expect(dims.nivelesUsados).toBe(3);
    expect(dims.width).toBeGreaterThan(135);
    expect(dims.height).toBeGreaterThan(180);
  });

  test("ciclo puro (sin raiz) no rompe BFS y posiciona como huerfanas", () => {
    const modelo = modeloCiclo();
    const posiciones = calcularLayoutSugerido(modelo, "opd-1");
    expect(posiciones).toHaveLength(2);
    expect(posiciones.every((p) => p.y >= 80)).toBe(true);
  });

  test("OPD con contorno aplica patron inzoom OPCloud: embedded apilados centrados, externos en columnas izq/der", () => {
    const modelo = modeloOpdInzoomDescomposicion();
    const posiciones = calcularLayoutSugerido(modelo, "opd-2");
    const porId = new Map(posiciones.map((p) => [p.aparienciaId, p]));

    // Contorno mantiene origen canonico y se redimensiona segun patron OPCloud:
    //   width = cosaWidth (135) * 3 = 405
    //   height = (cosaHeight + 30) * max(3, embedded) + 100 + 65 = 90*3 + 165 = 435
    const contorno = porId.get("a-contorno")!;
    expect(contorno.width).toBe(405);
    expect(contorno.height).toBe(435);

    // Embedded children apilados verticalmente, centrados X dentro del contorno.
    const sub1 = porId.get("a-sub1")!;
    const sub2 = porId.get("a-sub2")!;
    const sub3 = porId.get("a-sub3")!;
    const contornoWidth = contorno.width!;
    const centerX = contorno.x + contornoWidth / 2;
    expect(sub1.x).toBe(Math.round(centerX - 135 / 2));
    expect(sub2.x).toBe(Math.round(centerX - 135 / 2));
    expect(sub3.x).toBe(Math.round(centerX - 135 / 2));
    // gap interno 30 entre subthings, yOffset 100 desde top contorno.
    expect(sub2.y - sub1.y).toBe(60 + 30);
    expect(sub3.y - sub2.y).toBe(60 + 30);
    expect(sub1.y).toBe(contorno.y + 100);

    // Externos: entrada (origen del enlace agente) a la izquierda, salida
    // (destino del resultado) a la derecha del contorno.
    const externoIn = porId.get("a-externo-in")!;
    const externoOut = porId.get("a-externo-out")!;
    expect(externoIn.x).toBeLessThan(contorno.x);
    expect(externoOut.x).toBeGreaterThan(contorno.x + contornoWidth);
  });

  test("layered centra cada banda alrededor del centro X global, no left-aligned", () => {
    const modelo = modeloSdAncho();
    const posiciones = calcularLayoutSugerido(modelo, "opd-1");
    const porId = new Map(posiciones.map((p) => [p.aparienciaId, p]));
    // Tres objetos arriba (nivel 0): a-1, a-2, a-3 (ancho 135 + gap 60).
    // Un proceso solo abajo (nivel 1): a-proc (ancho 135).
    // El proceso debe quedar centrado bajo los tres, no en x=80.
    const a1 = porId.get("a-1")!;
    const a3 = porId.get("a-3")!;
    const proc = porId.get("a-proc")!;
    const centroBandaSuperior = (a1.x + a3.x + 135) / 2;
    const centroProc = proc.x + 135 / 2;
    expect(Math.abs(centroProc - centroBandaSuperior)).toBeLessThanOrEqual(1);
  });

  test("layered ignora enlaces estructurales para el ranking BFS", () => {
    const modelo = modeloSoloEstructural();
    const posiciones = calcularLayoutSugerido(modelo, "opd-1");
    // Sin enlaces procedurales, BFS no encuentra raices. Todos quedan en
    // ultimo nivel (huerfanas) en la misma banda Y.
    const ys = new Set(posiciones.map((p) => p.y));
    expect(ys.size).toBe(1);
  });
});

function modeloPipeline(): Modelo {
  return {
    id: "modelo-test",
    nombre: "Pipeline",
    opdRaizId: "opd-1",
    nextSeq: 10,
    entidades: {
      "o-fuente": { id: "o-fuente", tipo: "objeto", nombre: "Fuente", esencia: "informacional", afiliacion: "sistemica" },
      "p-proceso": { id: "p-proceso", tipo: "proceso", nombre: "Proceso", esencia: "informacional", afiliacion: "sistemica" },
      "o-sumidero": { id: "o-sumidero", tipo: "objeto", nombre: "Sumidero", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {},
    enlaces: {
      "e-1": { id: "e-1", tipo: "consumo", origenId: { kind: "entidad", id: "o-fuente" }, destinoId: { kind: "entidad", id: "p-proceso" }, etiqueta: "" },
      "e-2": { id: "e-2", tipo: "resultado", origenId: { kind: "entidad", id: "p-proceso" }, destinoId: { kind: "entidad", id: "o-sumidero" }, etiqueta: "" },
    },
    abanicos: {},
    opds: {
      "opd-1": {
        id: "opd-1",
        nombre: "SD",
        padreId: null,
        apariencias: {
          "a-fuente": { id: "a-fuente", entidadId: "o-fuente", opdId: "opd-1", x: 999, y: 999, width: 135, height: 60 },
          "a-proceso": { id: "a-proceso", entidadId: "p-proceso", opdId: "opd-1", x: 999, y: 999, width: 135, height: 60 },
          "a-sumidero": { id: "a-sumidero", entidadId: "o-sumidero", opdId: "opd-1", x: 999, y: 999, width: 135, height: 60 },
        },
        enlaces: {
          "ae-1": { id: "ae-1", enlaceId: "e-1", opdId: "opd-1", vertices: [] },
          "ae-2": { id: "ae-2", enlaceId: "e-2", opdId: "opd-1", vertices: [] },
        },
      },
    },
  };
}

function modeloPipelineConHuerfana(): Modelo {
  const base = modeloPipeline();
  base.entidades["o-huerfana"] = { id: "o-huerfana", tipo: "objeto", nombre: "Huerfana", esencia: "informacional", afiliacion: "sistemica" };
  base.opds["opd-1"]!.apariencias["a-huerfana"] = { id: "a-huerfana", entidadId: "o-huerfana", opdId: "opd-1", x: 999, y: 999, width: 135, height: 60 };
  return base;
}

function modeloVacio(): Modelo {
  return {
    id: "vacio",
    nombre: "Vacio",
    opdRaizId: "opd-1",
    nextSeq: 1,
    entidades: {},
    estados: {},
    enlaces: {},
    abanicos: {},
    opds: { "opd-1": { id: "opd-1", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} } },
  };
}

function modeloCiclo(): Modelo {
  return {
    id: "ciclo",
    nombre: "Ciclo",
    opdRaizId: "opd-1",
    nextSeq: 5,
    entidades: {
      "p-a": { id: "p-a", tipo: "proceso", nombre: "A", esencia: "informacional", afiliacion: "sistemica" },
      "p-b": { id: "p-b", tipo: "proceso", nombre: "B", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {},
    enlaces: {
      "e-ab": { id: "e-ab", tipo: "invocacion", origenId: { kind: "entidad", id: "p-a" }, destinoId: { kind: "entidad", id: "p-b" }, etiqueta: "" },
      "e-ba": { id: "e-ba", tipo: "invocacion", origenId: { kind: "entidad", id: "p-b" }, destinoId: { kind: "entidad", id: "p-a" }, etiqueta: "" },
    },
    abanicos: {},
    opds: {
      "opd-1": {
        id: "opd-1",
        nombre: "SD",
        padreId: null,
        apariencias: {
          "a-a": { id: "a-a", entidadId: "p-a", opdId: "opd-1", x: 999, y: 999, width: 135, height: 60 },
          "a-b": { id: "a-b", entidadId: "p-b", opdId: "opd-1", x: 999, y: 999, width: 135, height: 60 },
        },
        enlaces: {
          "ae-ab": { id: "ae-ab", enlaceId: "e-ab", opdId: "opd-1", vertices: [] },
          "ae-ba": { id: "ae-ba", enlaceId: "e-ba", opdId: "opd-1", vertices: [] },
        },
      },
    },
  };
}

/**
 * Modelo con OPD activo que refina (in-zoom) un proceso del OPD raiz.
 * - opd-1 (SD): contiene p-padre (con descomposicion → opd-2), o-fuente, o-destino.
 * - opd-2 (SD1): contiene contorno=apariencia(p-padre, 405x435), 3 sub-procesos
 *   embedded, externos a-externo-in (mapeo Bibliotecario→Procesar Prestamo) y
 *   a-externo-out (mapeo Procesar Prestamo→Boleta).
 *
 * Reproduce el caso del bug BUG-20260508T013631Z-a0dc5f sobre SD2 del Prestamo.
 */
function modeloOpdInzoomDescomposicion(): Modelo {
  return {
    id: "modelo-inzoom",
    nombre: "Modelo InZoom Test",
    opdRaizId: "opd-1",
    nextSeq: 30,
    entidades: {
      "p-padre": {
        id: "p-padre", tipo: "proceso", nombre: "Padre", esencia: "fisica", afiliacion: "sistemica",
        refinamientos: { descomposicion: { opdId: "opd-2" } },
      },
      "p-sub1": { id: "p-sub1", tipo: "proceso", nombre: "Sub1", esencia: "fisica", afiliacion: "sistemica" },
      "p-sub2": { id: "p-sub2", tipo: "proceso", nombre: "Sub2", esencia: "fisica", afiliacion: "sistemica" },
      "p-sub3": { id: "p-sub3", tipo: "proceso", nombre: "Sub3", esencia: "fisica", afiliacion: "sistemica" },
      "o-externo-in": { id: "o-externo-in", tipo: "objeto", nombre: "Entrada", esencia: "fisica", afiliacion: "ambiental" },
      "o-externo-out": { id: "o-externo-out", tipo: "objeto", nombre: "Salida", esencia: "fisica", afiliacion: "sistemica" },
    },
    estados: {},
    enlaces: {
      "e-in": { id: "e-in", tipo: "agente", origenId: { kind: "entidad", id: "o-externo-in" }, destinoId: { kind: "entidad", id: "p-padre" }, etiqueta: "" },
      "e-out": { id: "e-out", tipo: "resultado", origenId: { kind: "entidad", id: "p-padre" }, destinoId: { kind: "entidad", id: "o-externo-out" }, etiqueta: "" },
      "e-12": { id: "e-12", tipo: "invocacion", origenId: { kind: "entidad", id: "p-sub1" }, destinoId: { kind: "entidad", id: "p-sub2" }, etiqueta: "" },
      "e-23": { id: "e-23", tipo: "invocacion", origenId: { kind: "entidad", id: "p-sub2" }, destinoId: { kind: "entidad", id: "p-sub3" }, etiqueta: "" },
    },
    abanicos: {},
    opds: {
      "opd-1": {
        id: "opd-1", nombre: "SD", padreId: null,
        apariencias: {
          "a-padre-raiz": { id: "a-padre-raiz", entidadId: "p-padre", opdId: "opd-1", x: 380, y: 230, width: 135, height: 60 },
          "a-in-raiz": { id: "a-in-raiz", entidadId: "o-externo-in", opdId: "opd-1", x: 90, y: 60, width: 135, height: 60 },
          "a-out-raiz": { id: "a-out-raiz", entidadId: "o-externo-out", opdId: "opd-1", x: 380, y: 380, width: 135, height: 60 },
        },
        enlaces: {
          "ae-in": { id: "ae-in", enlaceId: "e-in", opdId: "opd-1", vertices: [] },
          "ae-out": { id: "ae-out", enlaceId: "e-out", opdId: "opd-1", vertices: [] },
        },
      },
      "opd-2": {
        id: "opd-2", nombre: "SD1", padreId: "opd-1",
        apariencias: {
          "a-contorno": { id: "a-contorno", entidadId: "p-padre", opdId: "opd-2", x: 150, y: 90, width: 405, height: 435 },
          "a-sub1": { id: "a-sub1", entidadId: "p-sub1", opdId: "opd-2", x: 285, y: 190, width: 135, height: 60 },
          "a-sub2": { id: "a-sub2", entidadId: "p-sub2", opdId: "opd-2", x: 285, y: 280, width: 135, height: 60 },
          "a-sub3": { id: "a-sub3", entidadId: "p-sub3", opdId: "opd-2", x: 285, y: 370, width: 135, height: 60 },
          "a-externo-in": { id: "a-externo-in", entidadId: "o-externo-in", opdId: "opd-2", x: 24, y: 112, width: 135, height: 60 },
          "a-externo-out": { id: "a-externo-out", entidadId: "o-externo-out", opdId: "opd-2", x: 610, y: 112, width: 135, height: 60 },
        },
        enlaces: {
          "ae-in-2": { id: "ae-in-2", enlaceId: "e-in", opdId: "opd-2", vertices: [] },
          "ae-out-2": { id: "ae-out-2", enlaceId: "e-out", opdId: "opd-2", vertices: [] },
          "ae-12": { id: "ae-12", enlaceId: "e-12", opdId: "opd-2", vertices: [] },
          "ae-23": { id: "ae-23", enlaceId: "e-23", opdId: "opd-2", vertices: [] },
        },
      },
    },
  };
}

/**
 * Modelo SD raiz "ancho": tres objetos en banda 0 + un proceso en banda 1
 * que es destino de los tres. Verifica que el proceso quede CENTRADO bajo
 * los tres objetos, no en x=80.
 */
function modeloSdAncho(): Modelo {
  return {
    id: "modelo-ancho",
    nombre: "SdAncho",
    opdRaizId: "opd-1",
    nextSeq: 10,
    entidades: {
      "o-1": { id: "o-1", tipo: "objeto", nombre: "Uno", esencia: "informacional", afiliacion: "sistemica" },
      "o-2": { id: "o-2", tipo: "objeto", nombre: "Dos", esencia: "informacional", afiliacion: "sistemica" },
      "o-3": { id: "o-3", tipo: "objeto", nombre: "Tres", esencia: "informacional", afiliacion: "sistemica" },
      "p-proc": { id: "p-proc", tipo: "proceso", nombre: "Proc", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {},
    enlaces: {
      "e-1": { id: "e-1", tipo: "consumo", origenId: { kind: "entidad", id: "o-1" }, destinoId: { kind: "entidad", id: "p-proc" }, etiqueta: "" },
      "e-2": { id: "e-2", tipo: "consumo", origenId: { kind: "entidad", id: "o-2" }, destinoId: { kind: "entidad", id: "p-proc" }, etiqueta: "" },
      "e-3": { id: "e-3", tipo: "consumo", origenId: { kind: "entidad", id: "o-3" }, destinoId: { kind: "entidad", id: "p-proc" }, etiqueta: "" },
    },
    abanicos: {},
    opds: {
      "opd-1": {
        id: "opd-1", nombre: "SD", padreId: null,
        apariencias: {
          "a-1": { id: "a-1", entidadId: "o-1", opdId: "opd-1", x: 999, y: 999, width: 135, height: 60 },
          "a-2": { id: "a-2", entidadId: "o-2", opdId: "opd-1", x: 999, y: 999, width: 135, height: 60 },
          "a-3": { id: "a-3", entidadId: "o-3", opdId: "opd-1", x: 999, y: 999, width: 135, height: 60 },
          "a-proc": { id: "a-proc", entidadId: "p-proc", opdId: "opd-1", x: 999, y: 999, width: 135, height: 60 },
        },
        enlaces: {
          "ae-1": { id: "ae-1", enlaceId: "e-1", opdId: "opd-1", vertices: [] },
          "ae-2": { id: "ae-2", enlaceId: "e-2", opdId: "opd-1", vertices: [] },
          "ae-3": { id: "ae-3", enlaceId: "e-3", opdId: "opd-1", vertices: [] },
        },
      },
    },
  };
}

/**
 * Modelo con solo enlaces estructurales (agregacion). El BFS de caso B
 * debe ignorarlos porque su orden top-down no aplica al SD.
 */
function modeloSoloEstructural(): Modelo {
  return {
    id: "modelo-estructural",
    nombre: "Estructural",
    opdRaizId: "opd-1",
    nextSeq: 10,
    entidades: {
      "o-padre": { id: "o-padre", tipo: "objeto", nombre: "Todo", esencia: "informacional", afiliacion: "sistemica" },
      "o-parte1": { id: "o-parte1", tipo: "objeto", nombre: "Parte1", esencia: "informacional", afiliacion: "sistemica" },
      "o-parte2": { id: "o-parte2", tipo: "objeto", nombre: "Parte2", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {},
    enlaces: {
      "e-1": { id: "e-1", tipo: "agregacion", origenId: { kind: "entidad", id: "o-padre" }, destinoId: { kind: "entidad", id: "o-parte1" }, etiqueta: "" },
      "e-2": { id: "e-2", tipo: "agregacion", origenId: { kind: "entidad", id: "o-padre" }, destinoId: { kind: "entidad", id: "o-parte2" }, etiqueta: "" },
    },
    abanicos: {},
    opds: {
      "opd-1": {
        id: "opd-1", nombre: "SD", padreId: null,
        apariencias: {
          "a-padre": { id: "a-padre", entidadId: "o-padre", opdId: "opd-1", x: 999, y: 999, width: 135, height: 60 },
          "a-parte1": { id: "a-parte1", entidadId: "o-parte1", opdId: "opd-1", x: 999, y: 999, width: 135, height: 60 },
          "a-parte2": { id: "a-parte2", entidadId: "o-parte2", opdId: "opd-1", x: 999, y: 999, width: 135, height: 60 },
        },
        enlaces: {
          "ae-1": { id: "ae-1", enlaceId: "e-1", opdId: "opd-1", vertices: [] },
          "ae-2": { id: "ae-2", enlaceId: "e-2", opdId: "opd-1", vertices: [] },
        },
      },
    },
  };
}
