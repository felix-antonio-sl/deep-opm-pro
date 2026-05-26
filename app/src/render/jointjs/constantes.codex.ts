export const CODEX = {
  colores: {
    paper: "#fafaf8", // espejo de ui-forja/tokens.css --cx-paper
    paperWarm: "#eeece2", // espejo de ui-forja/tokens.css --cx-paper-warm
    ink: "#171511", // espejo de ui-forja/tokens.css --cx-ink
    inkMid: "#5a564c", // espejo de ui-forja/tokens.css --cx-ink-mid
    inkSoft: "#807b6e", // espejo de ui-forja/tokens.css --cx-ink-soft
    opmObjeto: "#3a6b4d", // espejo de ui-forja/tokens.css --cx-opm-green
    opmProceso: "#26467a", // espejo de ui-forja/tokens.css --cx-opm-blue
    opmEstado: "#7e8338", // espejo de ui-forja/tokens.css --cx-opm-olive
    estadoFill: "#ece9e1", // espejo de ui-forja/tokens.css --cx-state-fill
    estadoFinalFill: "#E8E8E8", // marcador visual heredado para designacion final
    crimson: "#8e2a2e", // espejo de ui-forja/tokens.css --cx-crimson
    crimsonSuave: "rgba(142, 42, 46, 0.06)", // espejo de ui-forja/tokens.css --cx-crimson al 6%
  },
  strokes: {
    entidad: 1.5,
    estado: 1.2,
    enlace: 1,
    estructural: 1.2,
    seleccion: 1.2,
  },
  fuentes: {
    serif: "Inria Serif, Georgia, serif",
    mono: "JetBrains Mono Variable, JetBrains Mono, ui-monospace, monospace",
  },
  textWrap: {
    entidad: { width: -16, height: -16, ellipsis: false },
  },
  // ui-forja/08-jointjs-styling.md §1.3: identificador canonico `o.NN/p.NN/s.NN`
  // como sub-label mono bajo la etiqueta. V-202 (visualizacion): es affordance
  // de lectura, no gramatica OPM; no se exporta al canon. Offset 4px bajo el
  // bbox del shape.
  index: {
    fontSize: 9.5,
    fontWeight: 500,
    letterSpacing: "0.08em",
    offsetY: 4,
  },
  refinamiento: {
    fill: "rgba(250, 250, 248, 0.96)",
    strokeDasharray: "8 4",
  },
} as const;

export function colorEntidadCodex(tipo: "objeto" | "proceso"): string {
  return tipo === "objeto" ? CODEX.colores.opmObjeto : CODEX.colores.opmProceso;
}
