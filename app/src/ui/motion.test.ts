import { describe, expect, test } from "bun:test";
import { prefiereReducirMovimiento, scrollBehaviorPreferido, transitionPreferida } from "./motion";

function matchMediaReduce(matches: boolean): typeof globalThis.matchMedia {
  return ((query: string) => ({
    matches: query === "(prefers-reduced-motion: reduce)" ? matches : false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  })) as typeof globalThis.matchMedia;
}

describe("motion preferences", () => {
  test("detecta prefers-reduced-motion de forma defensiva", () => {
    expect(prefiereReducirMovimiento(matchMediaReduce(true))).toBe(true);
    expect(prefiereReducirMovimiento(matchMediaReduce(false))).toBe(false);
    expect(prefiereReducirMovimiento(undefined)).toBe(false);
    expect(prefiereReducirMovimiento((() => {
      throw new Error("sin media query");
    }) as typeof globalThis.matchMedia)).toBe(false);
  });

  test("convierte scroll suave y transiciones cuando el usuario reduce movimiento", () => {
    expect(scrollBehaviorPreferido(matchMediaReduce(true))).toBe("auto");
    expect(scrollBehaviorPreferido(matchMediaReduce(false))).toBe("smooth");
    expect(transitionPreferida("opacity 120ms ease", matchMediaReduce(true))).toBe("none");
    expect(transitionPreferida("opacity 120ms ease", matchMediaReduce(false))).toBe("opacity 120ms ease");
  });
});
