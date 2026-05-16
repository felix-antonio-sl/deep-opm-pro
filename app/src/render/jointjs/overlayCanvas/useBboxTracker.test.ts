import { describe, expect, test } from "bun:test";
import type { dia } from "jointjs";
import { leerBBoxCell } from "./useBboxTracker";

describe("leerBBoxCell", () => {
  test("convierte bbox local a coordenadas del paper para overlays HTML", () => {
    const cell = { id: "cell-1" } as unknown as dia.Cell;
    const paper = {
      model: {
        getCell: (id: string) => (id === "cell-1" ? cell : null),
      },
      requireView: () => undefined,
      findViewByModel: (model: dia.Cell) => model === cell
        ? { getBBox: () => ({ x: 10, y: 20, width: 30, height: 40 }) }
        : null,
      localToPaperRect: (rect: { x: number; y: number; width: number; height: number }) => ({
        x: rect.x * 2 + 5,
        y: rect.y * 2 + 7,
        width: rect.width * 2,
        height: rect.height * 2,
      }),
    } as unknown as dia.Paper;

    expect(leerBBoxCell(paper, "cell-1")).toEqual({
      x: 25,
      y: 47,
      width: 60,
      height: 80,
    });
  });
});
