import { describe, expect, test } from "bun:test";
import { estadoDiagnosticoFooter } from "./CodexFooterKey";

describe("estadoDiagnosticoFooter", () => {
  test("0 avisos ⇒ limpio (✓ ningún diagnóstico)", () => {
    expect(estadoDiagnosticoFooter(0)).toEqual({ tipo: "limpio" });
  });

  test("≥1 aviso ⇒ avisos con el total exacto", () => {
    expect(estadoDiagnosticoFooter(1)).toEqual({ tipo: "avisos", total: 1 });
    expect(estadoDiagnosticoFooter(7)).toEqual({ tipo: "avisos", total: 7 });
  });

  test("conteos negativos defensivos caen a limpio", () => {
    expect(estadoDiagnosticoFooter(-3)).toEqual({ tipo: "limpio" });
  });
});
