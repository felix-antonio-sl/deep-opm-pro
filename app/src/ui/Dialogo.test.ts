import { describe, expect, test } from "bun:test";
import { estereotipoDialogo } from "./Dialogo";

describe("Dialogo IFML stereotype", () => {
  test("declara Modal como default historico", () => {
    expect(estereotipoDialogo()).toBe("Modal");
    expect(estereotipoDialogo(true)).toBe("Modal");
  });

  test("declara Modeless cuando modal=false", () => {
    expect(estereotipoDialogo(false)).toBe("Modeless");
  });
});
