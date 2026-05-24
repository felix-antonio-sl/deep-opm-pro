import { tokens } from "../tokens";

interface CodexFooterKeyProps {
  label: string;
  value: string;
}

export function CodexFooterKey({ label, value }: CodexFooterKeyProps) {
  return (
    <span style={style.key}>
      <span style={style.label}>{label}</span>
      <span style={style.value}>{value}</span>
    </span>
  );
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
} satisfies Record<string, preact.JSX.CSSProperties>;
