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

  // Canvas infinito: sincronizar SOLO resetea cells. El ajuste del paper al
  // contenido (fitToContent) corre después, en JointCanvas.tsx, tras embeber
  // contornos / rutear enlaces — cuando la geometría ya es estable. Este test
  // sella esa separación: si alguien re-mete el sizing aquí, el bbox se
  // calcularía antes de tiempo y recortaría contornos/labels.
  test("sincroniza cells proyectadas sin dimensionar el paper", () => {
    const cellsRecibidas: dia.Cell.JSON[][] = [];
    let setDimensionsLlamado = false;
    const adapter = {
      graph: {
        resetCells(cells: dia.Cell.JSON[]) { cellsRecibidas.push(cells); },
      },
      paper: {
        setDimensions() { setDimensionsLlamado = true; },
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
    expect(setDimensionsLlamado).toBe(false);
  });
});
