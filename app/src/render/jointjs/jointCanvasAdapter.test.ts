import { describe, expect, test } from "bun:test";
import type { dia } from "jointjs";
import { opcionesPaperCodex, crearJointCellNamespace, separarCanalesJointCells, sincronizarCanalesJointCanvasAdapter, sincronizarCellsJointCanvasAdapter } from "./jointCanvasAdapter";
import type { JointCellJson } from "./proyeccionTipos";

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

  test("separa halos de seleccion del canal estructural", () => {
    const entidad = cell("a", "entidad");
    const halo = cell("seleccion-a", "selection-halo");

    expect(separarCanalesJointCells([entidad, halo])).toEqual({
      estructura: [entidad],
      seleccion: [halo],
    });
  });

  test("sincroniza cambios puros de seleccion sin resetCells", () => {
    const llamadas = {
      reset: 0,
      remove: 0,
      add: 0,
    };
    const cellsEnGraph = new Map<string, { id: string }>();
    const adapter = {
      graph: {
        resetCells(cells: JointCellJson[]) {
          llamadas.reset += 1;
          cellsEnGraph.clear();
          for (const item of cells) cellsEnGraph.set(item.id, { id: item.id });
        },
        getCell(id: string) {
          return cellsEnGraph.get(id) ?? null;
        },
        removeCells(cells: Array<{ id: string }>) {
          llamadas.remove += 1;
          for (const item of cells) cellsEnGraph.delete(item.id);
        },
        addCells(cells: JointCellJson[]) {
          llamadas.add += 1;
          for (const item of cells) cellsEnGraph.set(item.id, { id: item.id });
        },
      },
      paper: {},
    } as unknown as { graph: dia.Graph; paper: dia.Paper };

    sincronizarCanalesJointCanvasAdapter(adapter, [
      cell("a", "entidad"),
      cell("seleccion-a", "selection-halo"),
    ]);
    sincronizarCanalesJointCanvasAdapter(adapter, [
      cell("a", "entidad"),
      cell("seleccion-b", "selection-halo"),
    ]);

    expect(llamadas.reset).toBe(1);
    expect(llamadas.remove).toBe(1);
    expect(llamadas.add).toBe(1);
    expect(cellsEnGraph.has("seleccion-a")).toBe(false);
    expect(cellsEnGraph.has("seleccion-b")).toBe(true);
  });
});

function cell(id: string, kind: JointCellJson["opm"]["kind"]): JointCellJson {
  return {
    id,
    type: "standard.Rectangle",
    opm: kind === "selection-halo"
      ? { kind, opdId: "opd-1", targetId: id }
      : { kind: "entidad", opdId: "opd-1", entidadId: id, aparienciaId: id, rol: "externo" },
    z: 1,
  };
}
