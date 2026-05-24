import type { ComponentChildren } from "preact";
import { tokens } from "../tokens";

interface CodexFrameColumnsParams {
  leftWidth: number;
  rightWidth: number;
  isTablet: boolean;
}

interface CodexFrameProps extends CodexFrameColumnsParams {
  toolbar: ComponentChildren;
  menu: ComponentChildren;
  tabs: ComponentChildren;
  leftPanel: ComponentChildren;
  leftDivider: ComponentChildren;
  canvas: ComponentChildren;
  rightDivider: ComponentChildren;
  rightPanel: ComponentChildren;
  footerLeft?: ComponentChildren;
  footerRight?: ComponentChildren;
}

export function codexFrameRows(): string {
  return "60px minmax(0, 1fr) 44px";
}

export function codexFrameColumns({ leftWidth, rightWidth, isTablet }: CodexFrameColumnsParams): string {
  const left = isTablet ? Math.min(leftWidth, 220) : leftWidth;
  const right = isTablet ? Math.min(rightWidth, 300) : rightWidth;
  return `${left}px 6px minmax(0, 1fr) 6px ${right}px`;
}

export function modoMarginaliaCodex(inspectorOpen: boolean): "split" | "opl" {
  return inspectorOpen ? "split" : "opl";
}

export function CodexFrame({
  toolbar,
  menu,
  tabs,
  leftPanel,
  leftDivider,
  canvas,
  rightDivider,
  rightPanel,
  footerLeft,
  footerRight,
  leftWidth,
  rightWidth,
  isTablet,
}: CodexFrameProps) {
  return (
    <div data-testid="codex-frame" style={style.frame}>
      <header style={style.header}>
        <div aria-hidden="true" style={style.wordmark}>OPFORJA</div>
        <div style={style.toolbarSlot}>{toolbar}</div>
        <div aria-hidden="true" style={style.headerMeta}>Codex</div>
        {menu}
      </header>
      <section style={{ ...style.body, gridTemplateColumns: codexFrameColumns({ leftWidth, rightWidth, isTablet }) }}>
        <div style={style.leftSlot}>{leftPanel}</div>
        {leftDivider}
        {canvas}
        {rightDivider}
        <aside style={style.rightSlot}>{rightPanel}</aside>
      </section>
      <footer style={style.footer}>
        <div style={style.footerLeft}>{footerLeft}</div>
        <div style={style.tabsSlot}>{tabs}</div>
        <div style={style.footerRight}>{footerRight}</div>
      </footer>
    </div>
  );
}

const style = {
  frame: {
    display: "grid",
    gridTemplateRows: codexFrameRows(),
    width: "100%",
    height: "100%",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
    background: tokens.colors.paperWarm,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.serif,
  },
  header: {
    minWidth: 0,
    minHeight: 0,
    display: "grid",
    gridTemplateColumns: "148px minmax(0, 1fr) 92px",
    alignItems: "stretch",
    borderBottom: `1px solid ${tokens.colors.ruleStrong}`,
    background: tokens.colors.paper,
    position: "relative",
    zIndex: 20,
  },
  wordmark: {
    display: "flex",
    alignItems: "center",
    padding: "0 18px",
    borderRight: `1px solid ${tokens.colors.rule}`,
    fontFamily: tokens.typography.sans,
    fontSize: `${tokens.typography.fs.fs11}px`,
    fontWeight: tokens.typography.weights.bold,
    letterSpacing: tokens.typography.ls.section,
    textTransform: "uppercase",
    color: tokens.colors.ink,
  },
  toolbarSlot: {
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
  },
  headerMeta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 16px",
    borderLeft: `1px solid ${tokens.colors.rule}`,
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.mono,
    fontSize: `${tokens.typography.fs.fs10}px`,
    letterSpacing: tokens.typography.ls.meta,
    textTransform: "uppercase",
  },
  body: {
    minWidth: 0,
    minHeight: 0,
    display: "grid",
    gridTemplateAreas: `"left divisor canvas divisorInspector right"`,
    overflow: "hidden",
    background: tokens.colors.paperWarm,
  },
  leftSlot: {
    gridArea: "left",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
  },
  rightSlot: {
    gridArea: "right",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
    background: tokens.colors.paper,
  },
  footer: {
    minWidth: 0,
    minHeight: 0,
    display: "grid",
    gridTemplateColumns: "minmax(148px, 20%) minmax(0, 1fr) minmax(180px, 20%)",
    alignItems: "stretch",
    borderTop: `1px solid ${tokens.colors.ruleStrong}`,
    background: tokens.colors.paper,
  },
  footerLeft: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    borderRight: `1px solid ${tokens.colors.rule}`,
    overflow: "hidden",
  },
  tabsSlot: {
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
  },
  footerRight: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "10px",
    padding: "0 12px",
    borderLeft: `1px solid ${tokens.colors.rule}`,
    overflow: "hidden",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
