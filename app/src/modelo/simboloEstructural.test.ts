import { describe, expect, test } from "bun:test";
import { anclajeRefinableSimbolo, anclajeSimboloHaciaPunto } from "./simboloEstructural";

describe("simboloEstructural", () => {
  test("proyecta anclas automaticas sobre el borde real del triangulo", () => {
    const centro = { x: 100, y: 100 };
    const fallback = anclajeRefinableSimbolo();

    expect(anclajeSimboloHaciaPunto(centro, { x: 200, y: 100 }, fallback)).toEqual({ dx: 7.5, dy: 0 });
    expect(anclajeSimboloHaciaPunto(centro, { x: 0, y: 100 }, fallback)).toEqual({ dx: -7.5, dy: 0 });
    expect(anclajeSimboloHaciaPunto(centro, { x: 100, y: 0 }, fallback)).toEqual({ dx: 0, dy: -15 });
    expect(anclajeSimboloHaciaPunto(centro, { x: 100, y: 200 }, fallback)).toEqual({ dx: 0, dy: 15 });
  });

  test("mantiene fallback cuando no hay direccion util", () => {
    const fallback = { dx: 0, dy: -15 };

    expect(anclajeSimboloHaciaPunto({ x: 100, y: 100 }, { x: 100, y: 100 }, fallback)).toEqual(fallback);
    expect(anclajeSimboloHaciaPunto({ x: 100, y: 100 }, undefined, fallback)).toEqual(fallback);
  });
});
