import { describe, expect, test } from "bun:test";
import { validarValorSlot } from "./valorSlot";

describe("validadores/valorSlot", () => {
  test("integer acepta enteros y rechaza decimales", () => {
    expect(validarValorSlot("integer", "25")).toEqual({ ok: true, value: 25 });
    expect(validarValorSlot("integer", 25.5).ok).toBe(false);
  });

  test("float acepta enteros y decimales finitos", () => {
    expect(validarValorSlot("float", "25.5")).toEqual({ ok: true, value: 25.5 });
    expect(validarValorSlot("float", "no-numero").ok).toBe(false);
  });

  test("char exige un solo carácter", () => {
    expect(validarValorSlot("char", "A")).toEqual({ ok: true, value: "A" });
    expect(validarValorSlot("char", "AB").ok).toBe(false);
  });

  test("string preserva texto", () => {
    expect(validarValorSlot("string", "activo")).toEqual({ ok: true, value: "activo" });
  });
});
