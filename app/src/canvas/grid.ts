import { clampValor, RESIZE_MIN } from "../modelo/geometria";
import type { GridConfig } from "../modelo/tipos/ui";

export type { GridConfig };

export const GRID_DEFAULT: GridConfig = {
  activa: false,
  paso: 10,
  color: "#d8e2ee",
  strokeWidth: 1,
  escala: 1,
  snapActivo: true,
};

export { clampValor, RESIZE_MIN };

export function normalizarGridConfig(config: Partial<GridConfig> | undefined): GridConfig {
  return {
    activa: typeof config?.activa === "boolean" ? config.activa : GRID_DEFAULT.activa,
    paso: numeroEnRango(config?.paso, 4, 160, GRID_DEFAULT.paso),
    color: colorHexValido(config?.color) ? config.color : GRID_DEFAULT.color,
    strokeWidth: numeroEnRango(config?.strokeWidth, 0.5, 6, GRID_DEFAULT.strokeWidth),
    escala: numeroEnRango(config?.escala, 0.25, 8, GRID_DEFAULT.escala),
    snapActivo: typeof config?.snapActivo === "boolean" ? config.snapActivo : GRID_DEFAULT.snapActivo,
  };
}

export function pasoGrid(config: GridConfig): number {
  return Math.max(1, Math.round(config.paso * config.escala));
}

export function cuantizarPosicion(x: number, y: number, config: GridConfig): { x: number; y: number } {
  if (!config.activa || !config.snapActivo) return { x, y };
  const step = pasoGrid(config);
  return {
    x: Math.round(x / step) * step,
    y: Math.round(y / step) * step,
  };
}

function numeroEnRango(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return clampValor(min, max, value);
}

function colorHexValido(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);
}
