export const RESIZE_MIN = { width: 70, height: 40 } as const;

export function clampValor(min: number, max: number, valor: number): number {
  return Math.max(min, Math.min(max, valor));
}
