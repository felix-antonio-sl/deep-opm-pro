import type { dia } from "jointjs";
import { pasoGrid, type GridConfig } from "../../../canvas/grid";

interface PaperGridConfigurable {
  options: { gridSize?: number; drawGrid?: boolean | Record<string, unknown> };
  drawGrid?: (options?: Record<string, unknown> | boolean) => void;
  clearGrid?: () => void;
}

export function configurarGridPaper(paper: dia.Paper, config: GridConfig): void {
  const configurable = paper as unknown as PaperGridConfigurable;
  const step = pasoGrid(config);
  configurable.options.gridSize = step;
  configurable.options.drawGrid = config.activa
    ? {
        name: "mesh",
        args: { color: config.color, thickness: config.strokeWidth },
      }
    : false;
  if (config.activa) configurable.drawGrid?.(configurable.options.drawGrid as Record<string, unknown>);
  else configurable.clearGrid?.();
}
