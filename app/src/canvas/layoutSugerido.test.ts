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
