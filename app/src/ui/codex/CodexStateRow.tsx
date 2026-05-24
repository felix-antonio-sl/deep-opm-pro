// Ronda Codex v1 · L2 — Inspector canonico.
//
// CodexStateRow (`ui-forja/02-components.md §12`): fila de estado del inspector.
// Header: badge 8×8 (border oliva canon + fill stateFill) + nombre del estado
// en italic serif + flechas de reorden opcionales. Debajo, los flags como
// PALABRAS tipograficas (no pills): activo => bold + underline ink; inactivo =>
// inkSoft; `suprimir` SIEMPRE crimson (canal UI, V-203). El badge va en oliva
// canon, nunca crimson (decision blocked §9).
//
// Re-piel pura: cero logica de modelo. Cada flag dispara `onToggle` provisto
// por el consumidor; read-only/disabled (HU-SHARED-003) se respeta por flag.
import type { ComponentChildren } from "preact";
import { tokens } from "../tokens";
import { GLIFO_NAV_UP, GLIFO_NAV_DOWN } from "./glifos";

export interface CodexStateFlag {
  label: string;
  active: boolean;
  /** Flag destructivo/UI: se pinta en crimson (p.ej. "suprimir"). */
  danger?: boolean;
  disabled?: boolean;
  title?: string;
  onToggle?: () => void;
  testId?: string;
}

interface CodexStateRowProps {
  /** Nombre del estado (italic serif). Si se pasa `nameSlot`, este se ignora. */
  name?: string;
  /** Slot de nombre editable (p.ej. <input/>); reemplaza al texto `name`. */
  nameSlot?: ComponentChildren;
  /** Flags tipograficos del estado. */
  flags: ReadonlyArray<CodexStateFlag>;
  /** Reorden hacia atras (↑). */
  onSubir?: () => void;
  onBajar?: () => void;
  puedeSubir?: boolean;
  puedeBajar?: boolean;
  /** Slot extra a la derecha del header (acciones). */
  headerRight?: ComponentChildren;
  testId?: string;
  estadoId?: string;
}

/** Fila de estado: badge oliva + nombre serif + flags como palabras. */
export function CodexStateRow({
  name,
  nameSlot,
  flags,
  onSubir,
  onBajar,
  puedeSubir,
  puedeBajar,
  headerRight,
  testId,
  estadoId,
}: CodexStateRowProps) {
  const conReorden = onSubir != null || onBajar != null;
  return (
    <div style={style.row} data-testid={testId} data-estado-id={estadoId}>
      <div style={style.header}>
        <span style={style.badge} aria-hidden="true" />
        {nameSlot ? <span style={style.nameSlot}>{nameSlot}</span> : <span style={style.name}>{name}</span>}
        {conReorden
          ? (
            <span style={style.reorden}>
              <button
                type="button"
                style={style.arrow}
                disabled={!puedeSubir}
                onClick={onSubir}
                title="Mover hacia atrás"
                data-testid="inspector-estado-subir"
              >
                {GLIFO_NAV_UP}
              </button>
              <button
                type="button"
                style={style.arrow}
                disabled={!puedeBajar}
                onClick={onBajar}
                title="Mover hacia adelante"
                data-testid="inspector-estado-bajar"
              >
                {GLIFO_NAV_DOWN}
              </button>
            </span>
          )
          : null}
        {headerRight ? <span style={style.headerRight}>{headerRight}</span> : null}
      </div>
      <div style={style.flags}>
        {flags.map((flag) => (
          <button
            key={flag.label}
            type="button"
            disabled={flag.disabled}
            aria-pressed={flag.active}
            title={flag.title}
            onClick={flag.onToggle}
            data-testid={flag.testId}
            style={estiloFlag(flag)}
          >
            {flag.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function estiloFlag(flag: CodexStateFlag): preact.JSX.CSSProperties {
  const base = { ...style.flag };
  if (flag.danger) {
    return {
      ...base,
      color: tokens.colors.crimson,
      fontWeight: flag.active ? tokens.typography.weights.semibold : tokens.typography.weights.regular,
      borderBottom: flag.active ? `${tokens.stroke.hairline}px solid ${tokens.colors.crimson}` : "none",
      cursor: flag.disabled ? "not-allowed" : "pointer",
    };
  }
  if (flag.active) {
    return {
      ...base,
      color: tokens.colors.ink,
      fontWeight: tokens.typography.weights.semibold,
      borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.ink}`,
      cursor: flag.disabled ? "not-allowed" : "pointer",
    };
  }
  return {
    ...base,
    color: flag.disabled ? tokens.colors.inkFaint : tokens.colors.inkSoft,
    cursor: flag.disabled ? "not-allowed" : "pointer",
  };
}

const style = {
  row: {
    display: "grid",
    gap: `${tokens.spacing.sm}px`,
    padding: "8px 0",
    borderBottom: `${tokens.stroke.hairline}px dotted ${tokens.colors.rule}`,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: `${tokens.spacing.sm}px`,
  },
  badge: {
    flex: "0 0 auto",
    width: "8px",
    height: "8px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.opm.state}`,
    background: tokens.colors.opm.stateFill,
  },
  name: {
    flex: "1 1 auto",
    minWidth: 0,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.serif,
    fontStyle: "italic" as const,
    fontSize: `${tokens.typography.fs.fs14}px`,
  },
  nameSlot: {
    flex: "1 1 auto",
    minWidth: 0,
  },
  reorden: {
    flex: "0 0 auto",
    display: "inline-flex",
    gap: "2px",
  },
  arrow: {
    border: 0,
    padding: "0 4px",
    background: "transparent",
    color: tokens.colors.inkSoft,
    cursor: "pointer",
    fontFamily: tokens.typography.mono,
    fontSize: `${tokens.typography.fs.fs12}px`,
  },
  headerRight: {
    flex: "0 0 auto",
  },
  flags: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: `${tokens.spacing.sm}px`,
  },
  flag: {
    border: 0,
    padding: 0,
    background: "transparent",
    fontFamily: tokens.typography.sans,
    fontSize: `${tokens.typography.fs.fs11}px`,
    fontWeight: tokens.typography.weights.regular,
    color: tokens.colors.inkSoft,
    cursor: "pointer",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
