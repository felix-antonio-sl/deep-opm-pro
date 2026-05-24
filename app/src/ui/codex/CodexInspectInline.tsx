// Ronda Codex v1 · L2 — Inspector canonico.
//
// CodexInspectInline (`ui-forja/02-components.md §11`): segmented control
// TIPOGRAFICO. Las opciones son palabras separadas por `·` (inkFaint); la
// activa va en peso 600, color ink y subrayada (border-bottom 1px ink). NO
// hay pills, switches con bola ni radius (Apendice "Patrones prohibidos").
//
// Decision propia (brief §10): cada opcion es un `<button>` real para preservar
// el contrato de accesibilidad/e2e existente (`getByRole("button", {name})`
// sobre "Física"/"Ambiental"/etc.). El segmented es solo piel; la mutacion la
// dispara el consumidor via `onSelect`. Read-only/disabled (HU-SHARED-003) se
// respeta por opcion (`disabled`) o global.
import { tokens } from "../tokens";
import { GLIFO_SEP } from "./glifos";

interface CodexInspectInlineOption {
  label: string;
  /** Deshabilita esta opcion (exclusion mutua / read-only). */
  disabled?: boolean;
  /** title accesible opcional. */
  title?: string;
}

interface CodexInspectInlineProps {
  /** Clave del control (italic serif), opcional. */
  k?: string;
  /** Opciones del segmented (texto o {label, disabled}). */
  options: ReadonlyArray<string | CodexInspectInlineOption>;
  /** Indice de la opcion activa; -1 si ninguna. */
  active: number;
  /** Handler de seleccion por indice. */
  onSelect?: (index: number) => void;
  /** Deshabilita el control completo (read-only). */
  disabled?: boolean;
  /** testId opcional. */
  testId?: string;
}

function normalizar(o: string | CodexInspectInlineOption): CodexInspectInlineOption {
  return typeof o === "string" ? { label: o } : o;
}

/** Segmented inline: palabras separadas por `·`, activa subrayada bold. */
export function CodexInspectInline({ k, options, active, onSelect, disabled, testId }: CodexInspectInlineProps) {
  return (
    <div style={style.row} data-testid={testId}>
      {k ? <span style={style.key}>{k}</span> : null}
      <span style={style.options}>
        {options.map((raw, i) => {
          const opt = normalizar(raw);
          const activo = i === active;
          const off = disabled || opt.disabled;
          return (
            <span key={opt.label} style={style.item}>
              {i > 0 ? <span style={style.sep}>{GLIFO_SEP}</span> : null}
              <button
                type="button"
                title={opt.title}
                disabled={off}
                aria-pressed={activo}
                onClick={() => onSelect?.(i)}
                style={activo ? style.active : off ? style.optionOff : style.option}
              >
                {opt.label}
              </button>
            </span>
          );
        })}
      </span>
    </div>
  );
}

const optionBase: preact.JSX.CSSProperties = {
  border: 0,
  padding: 0,
  background: "transparent",
  cursor: "pointer",
  fontFamily: tokens.typography.serif,
  fontSize: `${tokens.typography.fs.fs13}px`,
};

const style = {
  row: {
    display: "flex",
    alignItems: "baseline",
    flexWrap: "wrap" as const,
    gap: `${tokens.spacing.sm}px`,
  },
  key: {
    color: tokens.colors.inkMid,
    fontFamily: tokens.typography.serif,
    fontStyle: "italic" as const,
    fontSize: `${tokens.typography.fs.fs12}px`,
  },
  options: {
    display: "inline-flex",
    alignItems: "baseline",
    flexWrap: "wrap" as const,
  },
  item: {
    display: "inline-flex",
    alignItems: "baseline",
  },
  sep: {
    color: tokens.colors.inkFaint,
    padding: "0 6px",
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs13}px`,
  },
  option: {
    ...optionBase,
    color: tokens.colors.inkSoft,
    fontWeight: tokens.typography.weights.regular,
  },
  active: {
    ...optionBase,
    color: tokens.colors.ink,
    fontWeight: tokens.typography.weights.semibold,
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.ink}`,
  },
  optionOff: {
    ...optionBase,
    color: tokens.colors.inkFaint,
    cursor: "not-allowed",
    fontWeight: tokens.typography.weights.regular,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
