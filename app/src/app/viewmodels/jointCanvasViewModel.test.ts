import { describe, expect, test } from "bun:test";
import { opcionesProyeccionJointCanvas } from "./jointCanvasViewModel";

describe("jointCanvasViewModel", () => {
  test("usa canal de seleccion halo para no resetear la escena estructural", () => {
    expect(opcionesProyeccionJointCanvas({
      uiAliasVisibles: false,
      uiDescripcionesVisibles: true,
      uiModoImagenGlobal: "imagen",
    })).toEqual({
      aliasVisibles: false,
      descripcionesVisibles: true,
      modoImagenGlobal: "imagen",
      canalSeleccion: "halo",
    });
  });
});
