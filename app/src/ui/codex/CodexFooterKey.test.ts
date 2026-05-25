import { describe, expect, test } from "bun:test";
import { CodexFooterKey, estadoDiagnosticoFooter } from "./CodexFooterKey";

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

describe("CodexFooterKey", () => {
  test("muestra ViewPoint en castellano con acentos sin mutar el enum interno", () => {
    const v = CodexFooterKey({ label: "View", value: "Edicion" }) as unknown as { props: Record<string, any> };
    const [, value] = v.props.children as Array<{ props: Record<string, any> }>;

    expect(value!.props.children).toBe("Edición");
  });
});
