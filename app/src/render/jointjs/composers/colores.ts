import { CODEX } from "../constantes.codex";

/**
 * Helpers puros de contraste de texto para attrs JointJS.
 * Consumidores conocidos: composer de entidad.
 */
export function colorTextoParaFill(fill: string): string {
  const hex = normalizarHex6(fill);
  if (!hex) return CODEX.colores.ink;
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255;
  const luminancia = 0.2126 * canalSrgb(r) + 0.7152 * canalSrgb(g) + 0.0722 * canalSrgb(b);
  return luminancia < 0.36 ? "#ffffff" : CODEX.colores.ink;
}

export function normalizarHex6(value: string): string | null {
  if (/^#[0-9a-f]{6}$/i.test(value)) return value.toLowerCase();
  if (/^#[0-9a-f]{3}$/i.test(value)) {
    const r = value.charAt(1);
    const g = value.charAt(2);
    const b = value.charAt(3);
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return null;
}

export function canalSrgb(value: number): number {
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}
