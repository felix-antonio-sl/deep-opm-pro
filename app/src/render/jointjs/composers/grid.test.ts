import { describe, expect, test } from "bun:test";
import { GRID_DEFAULT } from "../../../canvas/grid";
import { configurarGridPaper } from "./grid";

describe("composers/grid", () => {
  test("configurarGridPaper activa drawGrid con paso efectivo", () => {
    const calls: unknown[] = [];
    const paper: { options: { gridSize?: number; drawGrid?: unknown }; drawGrid(config: unknown): void; clearGrid(): void } = {
      options: {},
      drawGrid(config: unknown) { calls.push(config); },
      clearGrid() { calls.push("clear"); },
    };

    configurarGridPaper(paper as never, { ...GRID_DEFAULT, paso: 12, escala: 2, color: "#abcdef", strokeWidth: 2 });

    expect(paper.options.gridSize).toBe(24);
    expect(paper.options.drawGrid).toEqual({ name: "mesh", args: { color: "#abcdef", thickness: 2 } });
    expect(calls).toHaveLength(1);
  });

  test("configurarGridPaper desactiva drawGrid", () => {
    const calls: unknown[] = [];
    const paper: { options: { gridSize?: number; drawGrid?: unknown }; drawGrid(config: unknown): void; clearGrid(): void } = {
      options: {},
      drawGrid(config: unknown) { calls.push(config); },
      clearGrid() { calls.push("clear"); },
    };

    configurarGridPaper(paper as never, { ...GRID_DEFAULT, activa: false });

    expect(paper.options.drawGrid).toBe(false);
    expect(calls).toEqual(["clear"]);
  });
});
