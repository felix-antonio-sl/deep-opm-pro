import { describe, expect, test } from "bun:test";
import {
  insertarVerticeApariencia,
  reposicionarVerticeApariencia,
  reanclarExtremoEnlace,
} from "./enlaceVertices";
import { crearModelo, crearEnlace, crearObjeto, crearProceso } from "./operaciones";
import { extremoEntidad } from "./extremos";
import type { AparienciaEnlace, Modelo, TipoEnlace } from "./tipos";

function ae(modelo: Modelo, id: string): AparienciaEnlace {
  for (const opd of Object.values(modelo.opds)) {
    if (opd.enlaces[id]) return opd.enlaces[id];
  }
  throw new Error(`AparienciaEnlace not found: ${id}`);
}

function setup(): { modelo: Modelo; aparienciaEnlaceId: string; enlaceId: string } {
  const modelo = crearModelo("Test");
  const obj = crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 });
  if (!obj.ok) throw new Error("setup");
  const origenId = Object.values(obj.value.entidades).find((e) => e.tipo === "objeto")!.id;
  const proc = crearProceso(obj.value, modelo.opdRaizId, { x: 100, y: 0 });
  if (!proc.ok) throw new Error("setup");
  const destinoId = Object.values(proc.value.entidades).find((e) => e.tipo === "proceso")!.id;
  const tipo: TipoEnlace = "consumo";
  const e = crearEnlace(proc.value, modelo.opdRaizId, origenId, destinoId, tipo);
  if (!e.ok) throw new Error(`setup: ${e.error}`);
  const enlaceId = Object.keys(e.value.enlaces).find((k) => e.value.enlaces[k]!.origenId.id === origenId)!;
  const aparienciaId = Object.values(e.value.opds[e.value.opdRaizId]!.enlaces).find((ae) => ae.enlaceId === enlaceId)!;
  return { modelo: e.value, aparienciaEnlaceId: aparienciaId.id, enlaceId };
}

function setupAgregacion(): { modelo: Modelo; enlaceId: string } {
  const modelo = crearModelo("Test");
  const obj1 = crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 });
  if (!obj1.ok) throw new Error("setup");
  const origenId = Object.values(obj1.value.entidades).find((e) => e.tipo === "objeto")!.id;
  const obj2 = crearObjeto(obj1.value, modelo.opdRaizId, { x: 100, y: 0 });
  if (!obj2.ok) throw new Error("setup");
  const destinoId = Object.values(obj2.value.entidades).find((e) => e.tipo === "objeto" && e.id !== origenId)!.id;
  const tipo: TipoEnlace = "agregacion";
  const e = crearEnlace(obj2.value, modelo.opdRaizId, origenId, destinoId, tipo);
  if (!e.ok) throw new Error(`setup: ${e.error}`);
  const enlaceIds = Object.keys(e.value.enlaces);
  const enlaceId = enlaceIds[enlaceIds.length - 1]!;
  return { modelo: e.value, enlaceId };
}

describe("insertarVerticeApariencia", () => {
  test("inserta vértice en apariencia vacía", () => {
    const { modelo, aparienciaEnlaceId } = setup();
    const res = insertarVerticeApariencia(modelo, aparienciaEnlaceId, { x: 50, y: 25 });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(ae(res.value, aparienciaEnlaceId).vertices).toHaveLength(1);
      expect(ae(res.value, aparienciaEnlaceId).vertices[0]).toEqual({ x: 50, y: 25 });
    }
  });

  test("inserta vértice adicional", () => {
    const { modelo, aparienciaEnlaceId } = setup();
    const res1 = insertarVerticeApariencia(modelo, aparienciaEnlaceId, { x: 50, y: 25 });
    if (!res1.ok) throw new Error("fail");
    const res2 = insertarVerticeApariencia(res1.value, aparienciaEnlaceId, { x: 80, y: 35 });
    expect(res2.ok).toBe(true);
    if (res2.ok) {
      expect(ae(res2.value, aparienciaEnlaceId).vertices).toHaveLength(2);
    }
  });

  test("rechaza apariencia inexistente", () => {
    const { modelo } = setup();
    const res = insertarVerticeApariencia(modelo, "no-existe", { x: 0, y: 0 });
    expect(res.ok).toBe(false);
  });
});

describe("reposicionarVerticeApariencia", () => {
  test("reposiciona vértice existente", () => {
    const { modelo, aparienciaEnlaceId } = setup();
    const insertado = insertarVerticeApariencia(modelo, aparienciaEnlaceId, { x: 50, y: 25 });
    if (!insertado.ok) throw new Error("fail");
    const reposicionado = reposicionarVerticeApariencia(insertado.value, aparienciaEnlaceId, 0, { x: 60, y: 30 });
    expect(reposicionado.ok).toBe(true);
    if (reposicionado.ok) {
      expect(ae(reposicionado.value, aparienciaEnlaceId).vertices[0]).toEqual({ x: 60, y: 30 });
    }
  });

  test("rechaza índice fuera de rango", () => {
    const { modelo, aparienciaEnlaceId } = setup();
    const res = reposicionarVerticeApariencia(modelo, aparienciaEnlaceId, 0, { x: 0, y: 0 });
    expect(res.ok).toBe(false);
  });
});

describe("reanclarExtremoEnlace", () => {
  test("rechaza enlace inexistente", () => {
    const { modelo } = setup();
    const res = reanclarExtremoEnlace(modelo, "no-existe", "origen", extremoEntidad("e-1"));
    expect(res.ok).toBe(false);
  });

  test("rechaza auto-conexión para no-invocación", () => {
    const { modelo, enlaceId } = setupAgregacion();
    const enlace = modelo.enlaces[enlaceId];
    if (!enlace) throw new Error("enlace missing");
    const res = reanclarExtremoEnlace(modelo, enlaceId, "destino", enlace.origenId);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toContain("auto-conexión");
  });
});
