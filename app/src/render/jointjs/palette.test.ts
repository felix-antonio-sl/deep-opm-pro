import { describe, expect, test } from "bun:test";
import { jointCanvasPalette } from "./palette";

describe("jointCanvasPalette Codex", () => {
  test("expone paper/crimson CANON-V3 para canvas y UI-only", () => {
    expect(jointCanvasPalette).toEqual({
      background: "#fafaf8",
      seleccion: "#8e2a2e",
      seleccionSuave: "rgba(142, 42, 46, 0.06)",
    });
  });
});
