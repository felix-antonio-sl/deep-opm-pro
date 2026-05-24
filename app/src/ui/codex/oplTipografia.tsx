// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semantico invariante.
//
// Ronda Codex v1 · L1 — Contrato tipografico OPL canonico.
//
// Tres helpers inline para renderizar nombres de cosas OPM en cuerpo OPL segun
// la SSOT `opm-opl-es §1.7` y su operacionalizacion visual en
// `ui-forja/04-opl-rendering.md §1` + `ui-forja/02-components.md §7`:
//   - Objeto  → serif bold, subrayado solido, tinta.
//   - Proceso → serif bold italic, subrayado punteado, tinta.
//   - Estado  → mono pequeno, oliva canon (tokens.colors.opm.state), fill suave.
//
// Decision blocked (brief §9): el estado va en OLIVA CANON, nunca crimson
// (crimson es canal UI, V-203). Decision propia (brief §10): se exponen como
// COMPONENTES Preact con prop unica `children` — esto minimiza la friccion para
// L2/L3, que solo necesitan envolver texto (`<OplObj>nombre</OplObj>`) sin
// recordar firmas posicionales. La firma es ESTABLE: no cambiar tras mergear.
import type { ComponentChildren } from "preact";
import { tokens } from "../tokens";

interface OplTipografiaProps {
  children: ComponentChildren;
}

/** Nombre de objeto OPM en cuerpo OPL: serif bold + subrayado solido, tinta. */
export function OplObj({ children }: OplTipografiaProps) {
  return (
    <b data-opl-tipo="objeto" style={estilos.objeto}>
      {children}
    </b>
  );
}

/** Nombre de proceso OPM en cuerpo OPL: serif bold italic + subrayado punteado. */
export function OplProc({ children }: OplTipografiaProps) {
  return (
    <span data-opl-tipo="proceso" style={estilos.proceso}>
      {children}
    </span>
  );
}

/** Nombre de estado OPM en cuerpo OPL: mono pequeno, oliva canon, fill suave. */
export function OplState({ children }: OplTipografiaProps) {
  return (
    <span data-opl-tipo="estado" style={estilos.estado}>
      {children}
    </span>
  );
}

// Estilos derivados solo de `tokens` (lectura). Cero hex/fuente hard-coded.
//   - Objeto:  bold + borderBottom solido ink (subrayado tipografico, no shadow).
//   - Proceso: bold italic + borderBottom dashed ink (subrayado punteado).
//   - Estado:  oliva canon sobre fill suave, mono 0.86em, tracking 0.02em.
export const estilos = {
  objeto: {
    color: tokens.colors.ink,
    fontFamily: tokens.typography.serif,
    fontWeight: tokens.typography.weights.bold,
    fontStyle: "normal" as const,
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.ink}`,
    textUnderlineOffset: "3px",
    paddingBottom: "1px",
  },
  proceso: {
    color: tokens.colors.ink,
    fontFamily: tokens.typography.serif,
    fontWeight: tokens.typography.weights.bold,
    fontStyle: "italic" as const,
    borderBottom: `${tokens.stroke.hairline}px dashed ${tokens.colors.ink}`,
    textUnderlineOffset: "3px",
    paddingBottom: "1px",
  },
  estado: {
    color: tokens.colors.opm.state,
    background: tokens.colors.opm.stateFill,
    fontFamily: tokens.typography.mono,
    fontSize: "0.86em",
    letterSpacing: tokens.typography.ls.mono,
    padding: "0 4px",
    borderRadius: tokens.radii.xs,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
