import { describe, expect, test } from "bun:test";
import { codexFrameColumns, codexFrameRows, modoMarginaliaCodex } from "./CodexFrame";

describe("CodexFrame contract", () => {
  test("declara las tres filas editoriales Codex", () => {
    expect(codexFrameRows()).toBe("60px minmax(0, 1fr) 44px");
  });

  test("compone columnas desktop preservando divisores legacy de 6px", () => {
    expect(codexFrameColumns({ leftWidth: 280, rightWidth: 320, isTablet: false })).toBe(
      "280px 6px minmax(0, 1fr) 6px 320px",
    );
  });

  test("acota columnas laterales en tablet para mantener canvas util", () => {
    expect(codexFrameColumns({ leftWidth: 320, rightWidth: 420, isTablet: true })).toBe(
      "220px 6px minmax(0, 1fr) 6px 300px",
    );
  });

  test("mantiene marginalia OPL aunque el inspector este oculto", () => {
    expect(modoMarginaliaCodex(true)).toBe("split");
    expect(modoMarginaliaCodex(false)).toBe("opl");
  });
});
