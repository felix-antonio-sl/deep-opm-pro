import { describe, expect, test } from "bun:test";
import {
  COMMAND_PALETTE_FRECUENCIA_KEY,
  escribirFrecuenciaUsoCommandPalette,
  incrementarFrecuenciaUsoCommandPalette,
  leerFrecuenciaUsoCommandPalette,
} from "./atajos";

class FakeStorage {
  private values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

describe("frecuencia Command Palette", () => {
  test("incrementa item existente sin mutar el mapa original", () => {
    const actual = { "accion-inzoom": 2 };
    const siguiente = incrementarFrecuenciaUsoCommandPalette(actual, "accion-inzoom");

    expect(siguiente).toEqual({ "accion-inzoom": 3 });
    expect(actual).toEqual({ "accion-inzoom": 2 });
  });

  test("ignora ids vacios", () => {
    expect(incrementarFrecuenciaUsoCommandPalette({ a: 1 }, " ")).toEqual({ a: 1 });
  });

  test("lee solo valores positivos finitos desde storage", () => {
    const storage = new FakeStorage();
    storage.setItem(COMMAND_PALETTE_FRECUENCIA_KEY, JSON.stringify({
      "accion-inzoom": 4.8,
      "menu-tabla": 0,
      "bad-nan": Number.NaN,
      "bad-string": "7",
    }));

    expect(leerFrecuenciaUsoCommandPalette(storage)).toEqual({ "accion-inzoom": 4 });
  });

  test("persistencia round-trip por storage", () => {
    const storage = new FakeStorage();

    escribirFrecuenciaUsoCommandPalette({ "menu-tabla-enlaces": 2 }, storage);

    expect(leerFrecuenciaUsoCommandPalette(storage)).toEqual({ "menu-tabla-enlaces": 2 });
  });
});
