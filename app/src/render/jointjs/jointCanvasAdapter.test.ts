import { describe, expect, test } from "bun:test";
import type { dia } from "jointjs";
import { opcionesPaperCodex, crearJointCellNamespace, sincronizarCellsJointCanvasAdapter } from "./jointCanvasAdapter";

describe("jointCanvasAdapter", () => {
  test("registra shapes JointJS OSS y shapes OPM custom en el mismo namespace", () => {
    const namespace = crearJointCellNamespace() as { standard?: unknown; opm?: { AbanicoArc?: unknown } };

    expect(namespace.standard).toBeTruthy();
    expect(namespace.opm?.AbanicoArc).toBeTruthy();
  });

  test("mantiene el paper liso Codex sin grid visible", () => {
    expect(opcionesPaperCodex()).toEqual({
      gridSize: 10,
      drawGrid: false,
      background: { color: "#fafaf8" },
    });
  });

  test("sincroniza cells proyectadas y ajusta dimensiones del paper", () => {
    const cellsRecibidas: dia.Cell.JSON[][] = [];
    const dimensiones: Array<{ width: number; height: number }> = [];
    const paperEl = { style: {} } as HTMLElement;
    const adapter = {
      graph: {
        resetCells(cells: dia.Cell.JSON[]) { cellsRecibidas.push(cells); },
      },
      paper: {
        el: paperEl,
        setDimensions(width: number, height: number) { dimensiones.push({ width, height }); },
      },
    } as unknown as { graph: dia.Graph; paper: dia.Paper };
    const cells: dia.Cell.JSON[] = [{
      id: "cerca-borde",
      type: "standard.Rectangle",
      position: { x: 7300, y: 5300 },
      size: { width: 135, height: 60 },
    }];

    sincronizarCellsJointCanvasAdapter(adapter, cells);

    expect(cellsRecibidas[0]).toBe(cells);
    expect(dimensiones[0]).toEqual({ width: 9235, height: 7160 });
    expect(paperEl.style.width).toBe("9235px");
    expect(paperEl.style.height).toBe("7160px");
  });
});
