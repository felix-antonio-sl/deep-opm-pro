import { describe, expect, test } from "bun:test";
import {
  aplicarEstiloEnlace,
  copiarEstiloEnlace,
  resetEstiloEnlace,
  type EnlaceEstilo,
} from "./enlaceEstilo";
import { crearModelo, crearEnlace, crearObjeto, crearProceso } from "./operaciones";

function setup(): { modelo: Modelo; enlaceId: string; enlace(): Enlace } {
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
  const enlaceIds = Object.keys(e.value.enlaces);
  const enlaceId = enlaceIds[enlaceIds.length - 1]!;
  return { modelo: e.value, enlaceId, enlace: () => e.value.enlaces[enlaceId]! };
}

function est(m: Modelo, id: string): Enlace { return m.enlaces[id]!; }

describe("aplicarEstiloEnlace", () => {
  test("aplica color HEX válido", () => {
    const { modelo, enlaceId } = setup();
    const res = aplicarEstiloEnlace(modelo, enlaceId, { color: "#ff0000" });
    expect(res.ok).toBe(true);
    if (res.ok) expect(est(res.value, enlaceId).estilo?.color).toBe("#ff0000");
  });

  test("aplica color HEX corto", () => {
    const { modelo, enlaceId } = setup();
    const res = aplicarEstiloEnlace(modelo, enlaceId, { color: "#f00" });
    expect(res.ok).toBe(true);
    if (res.ok) expect(est(res.value, enlaceId).estilo?.color).toBe("#f00");
  });

  test("rechaza color inválido", () => {
    const { modelo, enlaceId } = setup();
    const res = aplicarEstiloEnlace(modelo, enlaceId, { color: "rojo" as unknown as string });
    expect(res.ok).toBe(false);
  });

  test("aplica grosor válido", () => {
    const { modelo, enlaceId } = setup();
    const res = aplicarEstiloEnlace(modelo, enlaceId, { strokeWidth: 3 });
    expect(res.ok).toBe(true);
    if (res.ok) expect(est(res.value, enlaceId).estilo?.strokeWidth).toBe(3);
  });

  test("rechaza grosor fuera de rango", () => {
    const { modelo, enlaceId } = setup();
    expect(aplicarEstiloEnlace(modelo, enlaceId, { strokeWidth: 0 }).ok).toBe(false);
    expect(aplicarEstiloEnlace(modelo, enlaceId, { strokeWidth: 7 }).ok).toBe(false);
  });

  test("aplica patron de trazo", () => {
    const { modelo, enlaceId } = setup();
    const res = aplicarEstiloEnlace(modelo, enlaceId, { dashArray: "4 4" });
    expect(res.ok).toBe(true);
    if (res.ok) expect(est(res.value, enlaceId).estilo?.dashArray).toBe("4 4");
  });

  test("rechaza patron inválido", () => {
    const { modelo, enlaceId } = setup();
    expect(aplicarEstiloEnlace(modelo, enlaceId, { dashArray: "1 1" as unknown as string }).ok).toBe(false);
  });

  test("acumula campos existentes", () => {
    const { modelo, enlaceId } = setup();
    const primero = aplicarEstiloEnlace(modelo, enlaceId, { color: "#ff0000" });
    if (!primero.ok) throw new Error("fail");
    const segundo = aplicarEstiloEnlace(primero.value, enlaceId, { strokeWidth: 4 });
    expect(segundo.ok).toBe(true);
    if (segundo.ok) {
      expect(est(segundo.value, enlaceId).estilo?.color).toBe("#ff0000");
      expect(est(segundo.value, enlaceId).estilo?.strokeWidth).toBe(4);
    }
  });
});

describe("resetEstiloEnlace", () => {
  test("quita estilo tras aplicarlo", () => {
    const { modelo, enlaceId } = setup();
    const estilizado = aplicarEstiloEnlace(modelo, enlaceId, { color: "#ff0000" });
    if (!estilizado.ok) throw new Error("fail");
    const reseteado = resetEstiloEnlace(estilizado.value, enlaceId);
    expect(reseteado.ok).toBe(true);
    if (reseteado.ok) expect(est(reseteado.value, enlaceId).estilo).toBeUndefined();
  });

  test("no-op si no hay estilo", () => {
    const { modelo, enlaceId } = setup();
    const res = resetEstiloEnlace(modelo, enlaceId);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.value).toBe(modelo);
  });
});

describe("copy paste estilo enlace", () => {
  test("roundtrip idéntico", () => {
    const { modelo, enlaceId } = setup();
    const estilo: EnlaceEstilo = { color: "#586d8c", strokeWidth: 3, dashArray: "2 4" };
    const aplicado = aplicarEstiloEnlace(modelo, enlaceId, estilo);
    if (!aplicado.ok) throw new Error("fail");
    const copiado = copiarEstiloEnlace(aplicado.value, enlaceId);
    expect(copiado).not.toBeNull();
    expect(copiado).toEqual(estilo);
  });

  test("copia devuelve null cuando no hay estilo", () => {
    const { modelo, enlaceId } = setup();
    expect(copiarEstiloEnlace(modelo, enlaceId)).toBeNull();
  });
});
