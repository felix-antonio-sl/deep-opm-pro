import { describe, expect, test } from "bun:test";
import { identificadorEnlaceInspector, identificadorInspector } from "./identificador";

/**
 * Codex v2 / L3: el header del Inspector debe rotular la entidad con el
 * identificador canónico de punto (`o.11`), igual que el canvas, no con el id
 * interno de guion (`o-11`).
 */
describe("identificadorInspector — guion → punto canónico", () => {
  test("convierte el id interno de objeto a punto con zero-pad", () => {
    expect(identificadorInspector("o-11")).toBe("o.11");
    expect(identificadorInspector("o-1")).toBe("o.01");
  });

  test("convierte el id interno de proceso a punto con zero-pad", () => {
    expect(identificadorInspector("p-3")).toBe("p.03");
    expect(identificadorInspector("p-24")).toBe("p.24");
  });

  test("el enlace usa la misma transformación de punto", () => {
    expect(identificadorEnlaceInspector("e-5")).toBe("e.05");
    expect(identificadorEnlaceInspector("e-12")).toBe("e.12");
  });

  test("nunca emite el separador de guion", () => {
    for (const id of ["o-11", "p-3", "e-5", "o-100"]) {
      expect(identificadorInspector(id)).not.toContain("-");
      expect(identificadorInspector(id)).toContain(".");
    }
  });

  test("tolera ids sin guion (prefijo+dígitos contiguos) sin romper", () => {
    expect(identificadorInspector("o11")).toBe("o.11");
  });
});
