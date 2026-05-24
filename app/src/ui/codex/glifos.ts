import { tokens } from "../tokens";

// Fuente canonica: ui-forja/07-glyphs.md. Codex usa glifos Unicode, no SVG.
export const GLIFO_REF = "※" as const;
export const GLIFO_WARN = "△" as const;
export const GLIFO_MARKER = "▸" as const;
export const GLIFO_ESTADO = "▢" as const;
export const GLIFO_SEP = "·" as const;
export const GLIFO_CREAR = "+" as const;
export const GLIFO_MENOS = "−" as const;
export const GLIFO_CERRAR = "✕" as const;
export const GLIFO_CHECK = "✓" as const;
export const GLIFO_VACIO = "—" as const;
export const GLIFO_ENTER = "↵" as const;
export const GLIFO_BORRAR = "⌫" as const;
export const GLIFO_CMD = "⌘" as const;
export const GLIFO_CTRL = "⌃" as const;
export const GLIFO_SHIFT = "⇧" as const;
export const GLIFO_ALT = "⌥" as const;
export const GLIFO_FLECHA_DERECHA = "→" as const;
export const GLIFO_NAV_UP = "↑" as const;
export const GLIFO_NAV_DOWN = "↓" as const;
export const GLIFO_CARET = "▾" as const;
export const GLIFO_COMILLA_APERTURA = "«" as const;
export const GLIFO_COMILLA_CIERRE = "»" as const;
export const GLIFO_GRADO = "°" as const;

export const GLIFOS_CODEX = {
  ref: GLIFO_REF,
  warn: GLIFO_WARN,
  marker: GLIFO_MARKER,
  estado: GLIFO_ESTADO,
  sep: GLIFO_SEP,
  crear: GLIFO_CREAR,
  menos: GLIFO_MENOS,
  cerrar: GLIFO_CERRAR,
  check: GLIFO_CHECK,
  vacio: GLIFO_VACIO,
  enter: GLIFO_ENTER,
  borrar: GLIFO_BORRAR,
  cmd: GLIFO_CMD,
  ctrl: GLIFO_CTRL,
  shift: GLIFO_SHIFT,
  alt: GLIFO_ALT,
  flechaDerecha: GLIFO_FLECHA_DERECHA,
  navUp: GLIFO_NAV_UP,
  navDown: GLIFO_NAV_DOWN,
  caret: GLIFO_CARET,
  comillaApertura: GLIFO_COMILLA_APERTURA,
  comillaCierre: GLIFO_COMILLA_CIERRE,
  grado: GLIFO_GRADO,
} as const;

export type GlifoCodex = (typeof GLIFOS_CODEX)[keyof typeof GLIFOS_CODEX];

interface FormatearComboCodexOpciones {
  platform?: string;
}

export function formatearComboCodex(combo: string, opciones: FormatearComboCodexOpciones = {}): string {
  const partes = combo.split("+").map((parte) => normalizarParteCombo(parte));
  if (!esMac(opciones.platform ?? plataformaActual())) return partes.join("+");
  return partes.map(glifoParteComboMac).join("");
}

function normalizarParteCombo(parte: string): string {
  const limpio = parte.trim();
  if (/^(ctrl|control|cmd|meta)$/i.test(limpio)) return "Ctrl";
  if (/^shift$/i.test(limpio)) return "Shift";
  if (/^(alt|option)$/i.test(limpio)) return "Alt";
  if (/^esc$/i.test(limpio)) return "Escape";
  if (limpio.length === 1) return limpio.toUpperCase();
  return limpio;
}

function glifoParteComboMac(parte: string): string {
  if (parte === "Ctrl") return GLIFO_CMD;
  if (parte === "Shift") return GLIFO_SHIFT;
  if (parte === "Alt") return GLIFO_ALT;
  if (parte === "ArrowUp") return GLIFO_NAV_UP;
  if (parte === "ArrowDown") return GLIFO_NAV_DOWN;
  if (parte === "ArrowLeft") return "←";
  if (parte === "ArrowRight") return "→";
  if (parte === "Enter") return GLIFO_ENTER;
  if (parte === "Backspace" || parte === "Delete") return GLIFO_BORRAR;
  return parte;
}

function plataformaActual(): string {
  return (globalThis.navigator as Navigator | undefined)?.platform ?? "";
}

function esMac(platform: string): boolean {
  return /Mac|iPhone|iPad|iPod/.test(platform);
}

export const estiloKbdCodex = {
  fontFamily: tokens.typography.mono,
  fontSize: `${tokens.typography.fs.fs10}px`,
  letterSpacing: tokens.typography.ls.kbd,
  padding: "2px 5px",
  border: `1px solid ${tokens.colors.rule}`,
  color: tokens.colors.inkMid,
  background: tokens.colors.paper,
} satisfies preact.JSX.CSSProperties;
