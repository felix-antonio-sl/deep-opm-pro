import type { ComponentChildren } from "preact";
import { tokens } from "../tokens";

interface CodexColHeaderProps {
  kicker: string;
  title: string;
  meta?: ComponentChildren;
}

export function CodexColHeader({ kicker, title, meta }: CodexColHeaderProps) {
  return (
    <header style={style.header}>
      <span style={style.kicker}>{kicker}</span>
      <strong style={style.title}>{title}</strong>
      {meta ? <span style={style.meta}>{meta}</span> : null}
    </header>
  );
}

const style = {
  header: {
    minWidth: 0,
    minHeight: 42,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gridTemplateRows: "auto auto",
    alignContent: "center",
    rowGap: "2px",
    padding: "8px 12px",
    borderBottom: `1px solid ${tokens.colors.rule}`,
    background: tokens.colors.paper,
  },
  kicker: {
    gridColumn: "1 / 2",
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.mono,
    fontSize: `${tokens.typography.fs.fs9}px`,
    fontWeight: tokens.typography.weights.regular,
    letterSpacing: tokens.typography.ls.mark,
    textTransform: "uppercase",
  },
  title: {
    gridColumn: "1 / 2",
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: tokens.colors.ink,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs13}px`,
    fontWeight: tokens.typography.weights.bold,
    lineHeight: tokens.typography.lh.tight,
  },
  meta: {
    gridColumn: "2 / 3",
    gridRow: "1 / 3",
    alignSelf: "center",
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.mono,
    fontSize: `${tokens.typography.fs.fs10}px`,
    letterSpacing: tokens.typography.ls.meta,
    textTransform: "uppercase",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
