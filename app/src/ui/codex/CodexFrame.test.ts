import { describe, expect, test } from "bun:test";
import { codexFrameAreas, codexFrameColumns, codexFrameRows, modoMarginaliaCodex } from "./CodexFrame";

describe("CodexFrame contract", () => {
  test("declara header editorial de 48px y cuerpo sin barra inferior redundante", () => {
    // BUG-20260606T041330Z-1f46fe: la barra era 60px y se veía
    // desproporcionadamente alta; el contenido real más alto (toolbar
    // `palabraTopBar` 32px + pestaña) cabe holgadamente en 48px con
    // ~8px de aire arriba/abajo, alineado con la altura mobile.
    expect(codexFrameRows()).toBe("48px minmax(0, 1fr)");
  });

  test("Codex v1.1 espeja columnas: OPL izquierda, canvas centro, edición derecha", () => {
    expect(codexFrameColumns({ leftWidth: 360, rightWidth: 360, isTablet: false })).toBe(
      "360px 6px minmax(0, 1fr) 6px 360px",
    );
  });

  test("acota columnas laterales en tablet para mantener canvas util", () => {
    expect(codexFrameColumns({ leftWidth: 360, rightWidth: 420, isTablet: true })).toBe(
      "200px 6px minmax(0, 1fr) 6px 220px",
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
