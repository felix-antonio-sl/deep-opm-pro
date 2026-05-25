import { describe, expect, test } from "bun:test";
import { codexFrameColumns, codexFrameRows, modoMarginaliaCodex } from "./CodexFrame";

describe("CodexFrame contract", () => {
  test("declara las tres filas editoriales Codex", () => {
    expect(codexFrameRows()).toBe("60px minmax(0, 1fr) 44px");
  });

  test("Codex v1.1 espeja columnas: OPL izquierda, canvas centro, edición derecha", () => {
    expect(codexFrameColumns({ leftWidth: 360, rightWidth: 360, isTablet: false })).toBe(
      "360px 6px minmax(0, 1fr) 6px 360px",
    );
  });

  test("acota columnas laterales en tablet para mantener canvas util", () => {
    expect(codexFrameColumns({ leftWidth: 360, rightWidth: 420, isTablet: true })).toBe(
      "300px 6px minmax(0, 1fr) 6px 300px",
    );
  });

  test("mantiene marginalia OPL aunque el inspector este oculto", () => {
    expect(modoMarginaliaCodex(true)).toBe("split");
    expect(modoMarginaliaCodex(false)).toBe("opl");
  });
});
