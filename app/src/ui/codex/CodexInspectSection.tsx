// Ronda Codex v1 · L2 — Inspector canonico.
//
// CodexInspectSection (`ui-forja/02-components.md §9`): seccion del inspector.
// Estructura: kicker uppercase tracked + slot derecho opcional + contenido.
// Cada seccion se separa de la anterior por una hairline superior (border-top).
//
// Re-piel pura: cero logica. Consume solo `tokens` (lectura). Sin pills, sin
// radius, sin shadow — chrome editorial Codex.
import type { ComponentChildren } from "preact";
import { tokens } from "../tokens";

interface CodexInspectSectionProps {
  /** Kicker uppercase tracked, p.ej. "VALOR", "ESTADOS". */
  label: string;
  /** Slot a la derecha del kicker (accion como palabra, p.ej. "+ nuevo"). */
  right?: ComponentChildren;
  /** Padding reducido en modos densos/split (§9). */
  compact?: boolean;
  /** Marca la seccion como deshabilitada (read-only, HU-SHARED-003). */
  disabled?: boolean;
  /** testId opcional para preservar selectores existentes. */
  testId?: string;
  /** aria-label opcional para el landmark de seccion. */
  ariaLabel?: string;
  children: ComponentChildren;
}

/** Seccion del inspector con kicker tracked + slot derecho + contenido. */
export function CodexInspectSection({
  label,
  right,
  compact,
  disabled,
  testId,
  ariaLabel,
  children,
}: CodexInspectSectionProps) {
  return (
    <section
      style={{ ...style.section, paddingTop: compact ? "8px" : "12px" }}
      aria-label={ariaLabel ?? label}
      data-testid={testId}
      data-disabled={disabled ? "true" : undefined}
    >
      <div style={style.head}>
        <span class="opm-label-uppercase" style={style.kicker}>{label}</span>
        {right ? <span style={style.right}>{right}</span> : null}
      </div>
      {children}
    </section>
  );
}

const style = {
  section: {
    display: "grid",
    gap: `${tokens.spacing.sm}px`,
    marginTop: `${tokens.spacing.sm}px`,
    borderTop: `${tokens.stroke.hairline}px solid ${tokens.colors.rule}`,
  },
  head: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: `${tokens.spacing.sm}px`,
  },
  kicker: {
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.sans,
    fontSize: `${tokens.typography.fs.fs9}px`,
    fontWeight: tokens.typography.weights.regular,
    textTransform: "uppercase" as const,
    letterSpacing: tokens.typography.ls.section,
  },
  right: {
    color: tokens.colors.ink,
    fontFamily: tokens.typography.sans,
    fontSize: `${tokens.typography.fs.fs10}px`,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
