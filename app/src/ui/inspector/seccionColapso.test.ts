import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { abrirSeccionesDe, claveColapso, EVENTO_ABRIR_COLAPSO, escribirAbierta, leerAbierta } from "./seccionColapso";

function mockStorage(): Storage {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => (m.has(k) ? (m.get(k) as string) : null),
    setItem: (k: string, v: string) => { m.set(k, v); },
    removeItem: (k: string) => { m.delete(k); },
    clear: () => m.clear(),
    key: () => null,
    get length() { return m.size; },
  } as unknown as Storage;
}

let despachados: Array<{ type: string; detail: { key: string } }>;

beforeEach(() => {
  (globalThis as unknown as { sessionStorage: Storage }).sessionStorage = mockStorage();
  despachados = [];
  (globalThis as unknown as { window: { dispatchEvent: (e: unknown) => boolean } }).window = {
    dispatchEvent: (e: unknown) => { despachados.push(e as { type: string; detail: { key: string } }); return true; },
  };
});

afterEach(() => {
  delete (globalThis as Record<string, unknown>).sessionStorage;
  delete (globalThis as Record<string, unknown>).window;
});

function fakeEl(key: string | null, parent: unknown): HTMLElement {
  return { getAttribute: (n: string) => (n === "data-colapso-key" ? key : null), parentElement: parent } as unknown as HTMLElement;
}

describe("seccionColapso", () => {
  test("claveColapso espacia bajo el prefijo del Inspector", () => {
    expect(claveColapso("Semántica")).toBe("opm.inspector.colapso.Semántica");
  });

  test("leerAbierta devuelve el default cuando no hay entrada de sesión", () => {
    expect(leerAbierta("Semántica", true)).toBe(true);
    expect(leerAbierta("Tamaño", false)).toBe(false);
  });

  test("escribirAbierta ↔ leerAbierta hace round-trip", () => {
    escribirAbierta("Enlaces", false);
    expect(leerAbierta("Enlaces", true)).toBe(false);
    escribirAbierta("Enlaces", true);
    expect(leerAbierta("Enlaces", false)).toBe(true);
  });

  test("abrirSeccionesDe sube por ancestros con data-colapso-key: marca y despacha cada uno", () => {
    const raiz = fakeEl("Semántica", null);
    const abuelo = fakeEl("Avanzado", raiz);
    const padreSinKey = fakeEl(null, abuelo);
    const hija = fakeEl(null, padreSinKey);
    abrirSeccionesDe(hija);
    expect(leerAbierta("Avanzado", false)).toBe(true);
    expect(leerAbierta("Semántica", false)).toBe(true);
    const keys = despachados.map((e) => e.detail.key).sort();
    expect(keys).toEqual(["Avanzado", "Semántica"]);
    expect(despachados.every((e) => e.type === EVENTO_ABRIR_COLAPSO)).toBe(true);
  });

  test("es robusto a sessionStorage ausente (no lanza, cae al default)", () => {
    delete (globalThis as Record<string, unknown>).sessionStorage;
    expect(() => escribirAbierta("X", true)).not.toThrow();
    expect(leerAbierta("X", true)).toBe(true);
    expect(leerAbierta("X", false)).toBe(false);
  });
});
