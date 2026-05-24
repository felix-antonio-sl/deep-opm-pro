// Ronda Codex v1 · L2 — Inspector canonico.
//
// CodexInspectField (`ui-forja/02-components.md §10`): par clave-valor inline.
// Clave en italic serif (inkMid) a la izquierda; valor a la derecha en serif
// (o mono si `mono`). Valores vacios (`—` / `off` / `sin adjuntar`) se atenuan
// a inkSoft. Slot `link` opcional como palabra-accion (sans, ink).
//
// Re-piel pura: cero logica. Solo lectura de `tokens`.
import type { ComponentChildren } from "preact";
import { tokens } from "../tokens";
import { GLIFO_VACIO } from "./glifos";

interface CodexInspectFieldProps {
  /** Clave del campo (italic serif), p.ej. "tipo", "unidad". */
  k: string;
  /** Valor del campo. Si es `—`/`off`/`sin adjuntar` se atenua. */
  v: ComponentChildren;
  /** Renderiza el valor en monoespaciada. */
  mono?: boolean;
  /** Palabra-accion a la derecha del valor (p.ej. "+ agregar"). */
  link?: ComponentChildren;
  /** Handler de la palabra-accion. */
  onLink?: () => void;
  /** testId opcional. */
  testId?: string;
}

const VALORES_VACIOS = new Set([GLIFO_VACIO, "off", "sin adjuntar", ""]);

function esVacio(v: ComponentChildren): boolean {
  return typeof v === "string" && VALORES_VACIOS.has(v.trim());
}

/** Campo clave-valor inline del inspector (clave italic, valor serif/mono). */
export function CodexInspectField({ k, v, mono, link, onLink, testId }: CodexInspectFieldProps) {
  const valorVacio = esVacio(v);
  return (
    <div style={style.field} data-testid={testId}>
      <span style={style.key}>{k}</span>
      <span
        style={{
          ...style.value,
          ...(mono ? style.valueMono : null),
          ...(valorVacio ? style.valueEmpty : null),
        }}
      >
        {v}
      </span>
      {link
        ? (
          <button type="button" style={style.link} onClick={onLink}>
            {link}
          </button>
        )
        : null}
    </div>
  );
}

const style = {
  field: {
    display: "flex",
    alignItems: "baseline",
    gap: `${tokens.spacing.sm}px`,
    padding: "4px 0",
  },
  key: {
    flex: "0 0 auto",
    color: tokens.colors.inkMid,
    fontFamily: tokens.typography.serif,
    fontStyle: "italic" as const,
    fontSize: `${tokens.typography.fs.fs12}px`,
  },
  value: {
    flex: "1 1 auto",
    minWidth: 0,
    textAlign: "right" as const,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs12}px`,
  },
  valueMono: {
    fontFamily: tokens.typography.mono,
    fontSize: `${tokens.typography.fs.fs11}px`,
    letterSpacing: tokens.typography.ls.mono,
  },
  valueEmpty: {
    color: tokens.colors.inkSoft,
  },
  link: {
    flex: "0 0 auto",
    border: 0,
    padding: 0,
    background: "transparent",
    color: tokens.colors.ink,
    cursor: "pointer",
    fontFamily: tokens.typography.sans,
    fontSize: `${tokens.typography.fs.fs10}px`,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
