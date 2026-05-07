import { describe, expect, test } from "bun:test";
import { colors } from "./tokens";

describe("tokens.colors — paleta UI mínima [JOYAS §1]", () => {
  test("paleta canvas semántica permanece invariante", () => {
    expect(colors.canvas.objeto).toBe("#70E483");
    expect(colors.canvas.proceso).toBe("#3BC3FF");
    expect(colors.canvas.enlace).toBe("#586D8C");
    expect(colors.canvas.fill).toBe("#fdffff");
    expect(colors.canvas.texto).toBe("#000002");
  });

  test("acento UI no colisiona con color semántico de proceso", () => {
    expect(colors.acentoUi).toBe("#3DA8FF");
    expect(colors.acentoUi).not.toBe(colors.canvas.proceso);
  });

  test("chromeNeutral coincide con stroke de enlace por convención compartida", () => {
    expect(colors.chromeNeutral).toBe("#586D8C");
    expect(colors.chromeNeutral).toBe(colors.canvas.enlace);
  });
});
