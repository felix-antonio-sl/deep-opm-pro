import { describe, expect, test } from "bun:test";
import { nombreApunteDeFecha } from "./nombreApunte";

describe("nombreApunteDeFecha", () => {
  test("formatea ISO local AAAA-MM-DD", () => {
    expect(nombreApunteDeFecha(new Date("2026-07-07T13:00:00"))).toBe("Apunte 2026-07-07");
  });

  test("rellena mes y día con cero a la izquierda (fecha local)", () => {
    expect(nombreApunteDeFecha(new Date(2026, 0, 5, 9, 0, 0))).toBe("Apunte 2026-01-05");
  });
});
