import { tokens } from "../tokens";

interface CodexFooterKeyProps {
  label: string;
  value: string;
}

/**
 * Par label/value del footer Codex (ej. `VIEW system diagram`). Se mantiene
 * para el footer-left contextual.
 */
export function CodexFooterKey({ label, value }: CodexFooterKeyProps) {
  return (
    <span style={style.key}>
      <span style={style.label}>{label}</span>
      <span style={style.value}>{valorFooterCodex(value)}</span>
    </span>
  );
}

export function valorFooterCodex(value: string): string {
  if (value === "Edicion") return "Edición";
  if (value === "Simulacion") return "Simulación";
  return value;
}

/**
 * Tecla del legendario del footer: glifo (kbd) + glosa.
 */
interface CodexKeyHint {
  k: string;
  hint?: string;
}

/**
 * Ronda Codex v2 L2 (CRÍT-Footer, auditoría rev2 §05): leyenda de teclas
 * canónica `O objeto · P proceso · S estado · R relación · ⌘K comandos`.
 * Cada glifo va en kbd mono; la glosa en sans. Recupera la affordance que el
 * footer había perdido al reconvertirse a label/value puro.
 */
export function CodexFooterKeys() {
  const hints: CodexKeyHint[] = [
    { k: "O", hint: "objeto" },
    { k: "P", hint: "proceso" },
    { k: "S", hint: "estado" },
    { k: "R", hint: "relación" },
    { k: "⌘K", hint: "comandos" },
  ];
  return (
    <span data-testid="codex-footer-keys" style={style.keys}>
      {hints.map((hint) => (
        <span key={hint.k} style={style.hint}>
          <kbd style={style.kbd}>{hint.k}</kbd>
          {hint.hint ? <span style={style.glosa}>{hint.hint}</span> : null}
        </span>
      ))}
    </span>
  );
}

export type EstadoDiagnosticoFooter =
  | { tipo: "limpio" }
  | { tipo: "avisos"; total: number };

/**
 * Ronda Codex v2 L2: el footer-right pasa de espejar la marginalia a reflejar
 * el estado de diagnóstico del modelo (`✓ ningún diagnóstico` / `△ N`), según
 * la auditoría rev2 §05.
 */
export function CodexFooterDiagnostico({ estado }: { estado: EstadoDiagnosticoFooter }) {
  if (estado.tipo === "limpio") {
    return (
      <span data-testid="codex-footer-diagnostico" data-estado="limpio" style={style.diagOk}>
        <span aria-hidden="true">✓</span>
        <span>ningún diagnóstico</span>
      </span>
    );
  }
  return (
    <span data-testid="codex-footer-diagnostico" data-estado="avisos" style={style.diagCrit}>
      <span aria-hidden="true">△</span>
      <span>{estado.total === 1 ? "1 diagnóstico" : `${estado.total} diagnósticos`}</span>
    </span>
  );
}

/**
 * Deriva el estado de diagnóstico del footer a partir del total de avisos del
 * OPD activo. Pure helper para tests: 0 avisos ⇒ `limpio` (✓); ≥1 ⇒ `avisos`
 * (△ N). El conteo total es la métrica honesta del footer; el desglose por
 * severidad vive en `PanelDiagnostico`.
 */
export function estadoDiagnosticoFooter(total: number): EstadoDiagnosticoFooter {
  return total > 0 ? { tipo: "avisos", total } : { tipo: "limpio" };
}

const style = {
  key: {
    minWidth: 0,
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: tokens.colors.inkMid,
    fontFamily: tokens.typography.mono,
    fontSize: `${tokens.typography.fs.fs10}px`,
    whiteSpace: "nowrap",
  },
  label: {
    color: tokens.colors.inkSoft,
    letterSpacing: tokens.typography.ls.meta,
    textTransform: "uppercase",
  },
  value: {
    color: tokens.colors.ink,
  },
  keys: {
    minWidth: 0,
    display: "inline-flex",
    alignItems: "center",
    gap: "12px",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  hint: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
  },
  kbd: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "16px",
    height: "16px",
    padding: "0 4px",
    border: `1px solid ${tokens.colors.rule}`,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.mono,
    fontSize: `${tokens.typography.fs.fs10}px`,
    lineHeight: 1,
  },
  glosa: {
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.sans,
    fontSize: `${tokens.typography.fs.fs10}px`,
  },
  diagOk: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: tokens.colors.inkMid,
    fontFamily: tokens.typography.sans,
    fontSize: `${tokens.typography.fs.fs11}px`,
    whiteSpace: "nowrap",
  },
  diagCrit: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: tokens.colors.accent,
    fontFamily: tokens.typography.sans,
    fontSize: `${tokens.typography.fs.fs11}px`,
    fontWeight: tokens.typography.weights.semibold,
    whiteSpace: "nowrap",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
