import { describe, expect, test } from "bun:test";
import { puntoAnchorDesdeBBox } from "./modoEnlace";

describe("handlers/modoEnlace", () => {
  test("puntoAnchorDesdeBBox resuelve puntos cardinales de una apariencia", () => {
    const bbox = { x: 20, y: 30, width: 100, height: 60 };

    expect(puntoAnchorDesdeBBox(bbox, "N")).toEqual({ x: 70, y: 30 });
    expect(puntoAnchorDesdeBBox(bbox, "E")).toEqual({ x: 120, y: 60 });
    expect(puntoAnchorDesdeBBox(bbox, "S")).toEqual({ x: 70, y: 90 });
    expect(puntoAnchorDesdeBBox(bbox, "O")).toEqual({ x: 20, y: 60 });
  });
});
