import { describe, expect, test } from "bun:test";
import {
  fijarMultiplicidadDestino,
  fijarMultiplicidadOrigen,
  MULTIPLICIDADES_CANONICAS,
  quitarMultiplicidad,
  validarMultiplicidad,
} from "./enlaceMultiplicidad";
import { crearModelo, crearEnlace, crearObjeto, crearProceso } from "./operaciones";
import type { Enlace, Modelo, TipoEnlace } from "./tipos";

function est(m: Modelo, id: string): Enlace { return m.enlaces[id]!; }

describe("validarMultiplicidad", () => {
  test("acepta canónicas", () => {
    for (const val of MULTIPLICIDADES_CANONICAS) {
      expect(validarMultiplicidad(val)).toBe(true);
    }
  });

  test("acepta custom numéricas", () => {
    expect(validarMultiplicidad("2")).toBe(true);
    expect(validarMultiplicidad("2..5")).toBe(true);
    expect(validarMultiplicidad("2..N")).toBe(true);
    expect(validarMultiplicidad("2..*")).toBe(true);
    expect(validarMultiplicidad("100")).toBe(true);
    expect(validarMultiplicidad("?")).toBe(true);
  });

  test("rechaza formatos inválidos", () => {
    expect(validarMultiplicidad("")).toBe(false);
    expect(validarMultiplicidad("1..")).toBe(false);
    expect(validarMultiplicidad("..2")).toBe(false);
    expect(validarMultiplicidad("abc")).toBe(false);
    expect(validarMultiplicidad("1.2")).toBe(false);
    expect(validarMultiplicidad("1..+")).toBe(false);
    expect(validarMultiplicidad("m..n")).toBe(false);
  });
});

describe("fijarMultiplicidadOrigen / fijarMultiplicidadDestino", () => {
  function setup(): { modelo: Modelo; enlaceId: string } {
    const modelo = crearModelo("Test");
    const obj = crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 });
    if (!obj.ok) throw new Error("setup failed");
    const origenId = Object.values(obj.value.entidades).find((e) => e.tipo === "objeto")!.id;
    const proc = crearProceso(obj.value, modelo.opdRaizId, { x: 100, y: 0 });
    if (!proc.ok) throw new Error("setup failed");
    const destinoId = Object.values(proc.value.entidades).find((e) => e.tipo === "proceso")!.id;
    const tipo: TipoEnlace = "consumo";
    const e = crearEnlace(proc.value, modelo.opdRaizId, origenId, destinoId, tipo);
    if (!e.ok) throw new Error(`setup: ${e.error}`);
    const enlaceIds = Object.keys(e.value.enlaces);
    const enlaceId = enlaceIds[enlaceIds.length - 1]!;
    return { modelo: e.value, enlaceId };
  }

  test("fija multiplicidad origen", () => {
    const { modelo, enlaceId } = setup();
    const res = fijarMultiplicidadOrigen(modelo, enlaceId, "2");
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(est(res.value, enlaceId).multiplicidadOrigen).toBe("2");
      expect(est(res.value, enlaceId).multiplicidadDestino).toBeUndefined();
    }
  });

  test("fija multiplicidad destino", () => {
    const { modelo, enlaceId } = setup();
    const res = fijarMultiplicidadDestino(modelo, enlaceId, "0..N");
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(est(res.value, enlaceId).multiplicidadDestino).toBe("0..N");
    }
  });

  test("quita multiplicidad con cadena vacía", () => {
    const { modelo, enlaceId } = setup();
    const fijada = fijarMultiplicidadOrigen(modelo, enlaceId, "5");
    expect(fijada.ok).toBe(true);
    if (!fijada.ok) return;
    expect(est(fijada.value, enlaceId).multiplicidadOrigen).toBe("5");

    const quitada = fijarMultiplicidadOrigen(fijada.value, enlaceId, "");
    expect(quitada.ok).toBe(true);
    if (quitada.ok) {
      expect(est(quitada.value, enlaceId).multiplicidadOrigen).toBeUndefined();
    }
  });

  test("rechaza multiplicidad inválida", () => {
    const { modelo, enlaceId } = setup();
    const res = fijarMultiplicidadOrigen(modelo, enlaceId, "abc");
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error).toContain("inválida");
    }
  });

  test("rechaza enlace inexistente", () => {
    const { modelo } = setup();
    const res = fijarMultiplicidadOrigen(modelo, "no-existe", "1");
    expect(res.ok).toBe(false);
  });
});

describe("quitarMultiplicidad", () => {
  function setup(): { modelo: Modelo; enlaceId: string } {
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
    return { modelo: e.value, enlaceId };
  }

  test("quita multiplicidad de origen", () => {
    const { modelo, enlaceId } = setup();
    const fijada = fijarMultiplicidadOrigen(modelo, enlaceId, "3");
    expect(fijada.ok).toBe(true);
    if (!fijada.ok) return;
    const quitada = quitarMultiplicidad(fijada.value, enlaceId, "origen");
    expect(quitada.ok).toBe(true);
    if (quitada.ok) {
      expect(est(quitada.value, enlaceId).multiplicidadOrigen).toBeUndefined();
    }
  });

  test("quitar sin multiplicidad es no-op", () => {
    const { modelo, enlaceId } = setup();
    const res = quitarMultiplicidad(modelo, enlaceId, "destino");
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.value).toBe(modelo);
    }
  });
});
