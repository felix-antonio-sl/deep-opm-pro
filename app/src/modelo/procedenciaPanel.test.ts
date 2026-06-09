import { describe, expect, test } from "bun:test";
import { crearModelo } from "./operaciones";
import { infoProcedencia } from "./procedenciaPanel";

// W6.6: panel de procedencia/staleness. El kernel proyecta Modelo → datos del
// panel; la verificación REAL de divergencia (recomputar protoHash) solo puede
// correr donde vive el proto (CLI verify:reproducible, H2) — la app reporta
// honesto, no degrada (acta flujo-canónico: "la divergencia se REPORTA").

describe("infoProcedencia — panel W6.6", () => {
  const sello = { protoHash: "f0bb7875", autoriaVersion: "1", layoutVersion: "2" };

  test("modelo con sello expone las 3 componentes y la doctrina read-through", () => {
    const modelo = { ...crearModelo("Emitido"), procedencia: sello };
    const info = infoProcedencia(modelo, {});

    expect(info).not.toBeNull();
    expect(info?.sello).toEqual(sello);
    expect(info?.nota).toContain("proto");
    expect(info?.advertencia).toBeNull();
  });

  test("editadoEnApp produce advertencia de divergencia respecto del bundle emitido", () => {
    const modelo = { ...crearModelo("Emitido"), procedencia: sello };
    const info = infoProcedencia(modelo, { editadoEnApp: true });

    expect(info?.advertencia).toContain("difiere del bundle emitido");
  });

  test("modelo sin sello no produce panel", () => {
    expect(infoProcedencia(crearModelo("Manual"), {})).toBeNull();
  });
});
