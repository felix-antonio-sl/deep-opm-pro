import { describe, expect, test } from "bun:test";
import { CANVAS_BASE, CANVAS_PADDING, dimensionesPaper } from "./helpers";

describe("handlers/helpers canvas", () => {
  test("dimensionesPaper parte de un canvas grande y crece con padding al acercarse a bordes", () => {
    expect(dimensionesPaper([])).toEqual(CANVAS_BASE);
    expect(dimensionesPaper([{
      id: "a-1",
      type: "standard.Rectangle",
      position: { x: CANVAS_BASE.width + 120, y: CANVAS_BASE.height + 80 },
      size: { width: 135, height: 60 },
    }])).toEqual({
      width: CANVAS_BASE.width + 120 + 135 + CANVAS_PADDING,
      height: CANVAS_BASE.height + 80 + 60 + CANVAS_PADDING,
    });
  });
});
