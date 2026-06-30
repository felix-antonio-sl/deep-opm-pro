// Modo apunte — badge de identidad de la especie «Apunte».
//
// Spec gobernante: docs/superpowers/specs/2026-06-30-modo-apunte-design.md §5.
// Vive en el mismo slot `topbar` de `CodexCanvasMount` que `CintaBiblioteca` (su
// gemelo), pero es marcador de identidad PURO: a diferencia de la biblioteca, el
// apunte NO fuerza `readOnly` —es para editar— ni pide confirmación; no hay candado
// que abrir. Una sola palabra visible: «Apunte» (corrección 1). El estado vive en el
// bit persistido `esApunte` del modelo activo, derivado del índice (la única verdad,
// corrección 2 — sin estado paralelo). Hairline, tinta-papel, sin crimson.
import type { JSX } from "preact";
import { useOpmStore } from "../store";
import { tokens } from "./tokens";

export function CintaApunte(): JSX.Element | null {
  // El bit persistido del modelo activo es la única verdad. Un modelo nuevo o
  // importado (id ausente del índice) no es apunte hasta marcarse.
  const esApunte = useOpmStore((s) => s.indice.modelos.some((m) => m.id === s.modelo.id && m.esApunte === true));

  if (!esApunte) return null;

  return (
    <div data-testid="cinta-apunte" role="status" aria-live="polite" style={s.cinta}>
      <span style={s.glifo} aria-hidden="true">◷</span>
      <span style={s.texto} data-testid="cinta-apunte-estado">
        <span style={s.rotulo}>Apunte</span> {"·"} borrador OPM, el rigor de cierre se relaja
      </span>
    </div>
  );
}

const C = tokens.colors;
const T = tokens.typography;

// Hairline tinta-papel (gate `design:governance`): borde superior `rule` suave,
// rótulo en `inkSoft`, subtítulo en `inkFaint`. Sin botones, sin sombras, sin
// crimson — el apunte es identidad serena, no alarma.
const s = {
  cinta: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacing.sm,
    padding: `5px ${tokens.spacing.md}px`,
    minHeight: 34,
    background: C.paperWarm,
    borderTop: `1px solid ${C.rule}`,
    borderBottom: `1px solid ${C.rule}`,
    fontFamily: T.serif,
    fontSize: T.fs.fs13,
    color: C.inkFaint,
  },
  glifo: {
    fontFamily: T.mono,
    fontSize: T.fs.fs14,
    color: C.inkFaint,
    lineHeight: 1,
    flex: "0 0 auto",
  },
  texto: {
    color: C.inkFaint,
    minWidth: 0,
  },
  rotulo: {
    color: C.inkSoft,
    fontWeight: T.weights.bold,
    letterSpacing: tokens.typography.ls.body,
  },
} satisfies Record<string, JSX.CSSProperties>;
