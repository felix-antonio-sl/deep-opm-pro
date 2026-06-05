import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { selectorCapsulaDesdeSelector } from "./drag";
import { labelA11yConexionEntidad, puntoAnchorDesdeBBox, Z_GHOST_ENLACE } from "./modoEnlace";

describe("handlers/modoEnlace", () => {
  test("puntoAnchorDesdeBBox resuelve puntos cardinales de una apariencia", () => {
    const bbox = { x: 20, y: 30, width: 100, height: 60 };

    expect(puntoAnchorDesdeBBox(bbox, "N")).toEqual({ x: 70, y: 30 });
    expect(puntoAnchorDesdeBBox(bbox, "E")).toEqual({ x: 120, y: 60 });
    expect(puntoAnchorDesdeBBox(bbox, "S")).toEqual({ x: 70, y: 90 });
    expect(puntoAnchorDesdeBBox(bbox, "O")).toEqual({ x: 20, y: 60 });
  });

  test("labelA11yConexionEntidad anuncia tipo canonico y accion", () => {
    expect(labelA11yConexionEntidad("Entrada", "objeto")).toBe("Objeto Entrada. Enter para seleccionar o conectar.");
    expect(labelA11yConexionEntidad("Procesar", "proceso")).toBe("Proceso Procesar. Enter para seleccionar o conectar.");
  });

  test("el ghost de enlace no muestra marker antes de tener target", () => {
    const source = readFileSync(resolve(import.meta.dir, "modoEnlace.ts"), "utf8");

    expect(source).not.toContain("targetMarker: { ...LINK_ASSETS.procedural.resultado.marker }");
    expect(source).toContain("targetMarker: null");
  });

  test("el ghost de enlace queda sobre entidades, enlaces a estados y halos runtime", () => {
    expect(Z_GHOST_ENLACE).toBeGreaterThan(37);
  });

  test("anchors de estado no inician drag de capsula", () => {
    expect(selectorCapsulaDesdeSelector("stateCapsule0")).toBe("stateCapsule0");
    expect(selectorCapsulaDesdeSelector("stateLabel0")).toBe("stateCapsule0");
    expect(selectorCapsulaDesdeSelector("connect-anchor-e-state0")).toBeNull();
  });
});
