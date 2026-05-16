import { describe, expect, test } from "bun:test";
import {
  debeMostrarNudgeConexionAnchor,
  LIMITE_CONEXIONES_MANUALES_NUDGE_ANCHOR,
} from "./ToolbarCreacion";

describe("ToolbarCreacion nudge de anchor", () => {
  test("muestra el tip solo en el camino manual por boton", () => {
    expect(debeMostrarNudgeConexionAnchor({
      modoEnlace: { fase: "boton" },
      cerrado: false,
      conexionesManuales: 0,
    })).toBe(true);
    expect(debeMostrarNudgeConexionAnchor({
      modoEnlace: {},
      cerrado: false,
      conexionesManuales: 0,
    })).toBe(true);
  });

  test("oculta el tip si se uso el gesto, se cerro o ya hubo cinco conexiones manuales", () => {
    expect(debeMostrarNudgeConexionAnchor({
      modoEnlace: { fase: "drag-from-anchor" },
      cerrado: false,
      conexionesManuales: 0,
    })).toBe(false);
    expect(debeMostrarNudgeConexionAnchor({
      modoEnlace: { fase: "boton" },
      cerrado: true,
      conexionesManuales: 0,
    })).toBe(false);
    expect(debeMostrarNudgeConexionAnchor({
      modoEnlace: { fase: "boton" },
      cerrado: false,
      conexionesManuales: LIMITE_CONEXIONES_MANUALES_NUDGE_ANCHOR,
    })).toBe(false);
    expect(debeMostrarNudgeConexionAnchor({
      modoEnlace: null,
      cerrado: false,
      conexionesManuales: 0,
    })).toBe(false);
  });
});
