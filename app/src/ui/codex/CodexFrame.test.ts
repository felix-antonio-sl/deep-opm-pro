import { describe, expect, test } from "bun:test";
import { codexFrameAreas, codexFrameColumns, codexFrameRows, modoMarginaliaCodex } from "./CodexFrame";

describe("CodexFrame contract", () => {
  test("declara header y cuerpo sin barra inferior redundante", () => {
    expect(codexFrameRows()).toBe("60px minmax(0, 1fr)");
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

  test("modo solo canvas colapsa el cuerpo a una columna de lienzo", () => {
    expect(codexFrameRows(true)).toBe("minmax(0, 1fr)");
    expect(codexFrameColumns({ leftWidth: 360, rightWidth: 360, isTablet: false, canvasOnly: true })).toBe("minmax(0, 1fr)");
    expect(codexFrameAreas(true)).toBe('"canvas"');
  });

  test("mantiene marginalia OPL aunque el inspector este oculto", () => {
    expect(modoMarginaliaCodex(true)).toBe("split");
    expect(modoMarginaliaCodex(false)).toBe("opl");
  });
});
