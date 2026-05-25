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
  /** Ruta OPD del manuscrito (Breadcrumb), centrada en el header. Sustituye al literal "Codex". */
  breadcrumb?: ComponentChildren;
  /** Meta editorial del header: `N oraciones · ● sin guardar · ⌘K`. */
  meta?: ComponentChildren;
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
  const left = isTablet ? Math.min(leftWidth, 300) : leftWidth;
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
  breadcrumb,
  meta,
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
      {/*
        Ronda Codex v2 L2 (auditoría rev2 §05): el header pasa del literal
        "Codex" al esquema editorial canónico `wordmark · acciones │ breadcrumb │ meta`.
        El wordmark es un único "Opforja" en Inria Serif italic ~22px (sin el
        chip duplicado que vivía en ToolbarBase). La columna central cablea el
        breadcrumb del manuscrito; la derecha imprime la meta (`N oraciones ·
        ● sin guardar · ⌘K`).
      */}
      <header style={style.header}>
        <div data-testid="codex-wordmark" style={style.wordmark}>Opforja</div>
        <div style={style.headerTabsSlot}>{tabs}</div>
        <div style={style.breadcrumbSlot}>{breadcrumb}</div>
        <div style={style.toolbarSlot}>{toolbar}</div>
        <div style={style.headerMeta}>{meta}</div>
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
        <div style={style.footerCenter} />
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
    // Codex v1.1: wordmark · tabs de modelos │ breadcrumb │ acciones │ meta.
    // La toolbar es la región que flexa; breadcrumb mantiene un ancho táctil
    // mínimo para que no quede debajo de las acciones.
    gridTemplateColumns: "auto minmax(140px, 340px) minmax(130px, 220px) minmax(0, 1fr) auto auto",
    alignItems: "stretch",
    borderBottom: `1px solid ${tokens.colors.ruleStrong}`,
    background: tokens.colors.paper,
    position: "relative",
    zIndex: 20,
  },
  // Wordmark único "Opforja" en Inria Serif italic ~22px, sin chip.
  wordmark: {
    display: "flex",
    alignItems: "center",
    padding: "0 18px",
    borderRight: `1px solid ${tokens.colors.rule}`,
    fontFamily: tokens.typography.serif,
    fontStyle: "italic",
    fontSize: `${tokens.typography.fs.fs22}px`,
    fontWeight: tokens.typography.weights.regular,
    letterSpacing: tokens.typography.ls.tight,
    color: tokens.colors.ink,
    whiteSpace: "nowrap",
  },
  toolbarSlot: {
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
    display: "flex",
    alignItems: "stretch",
  },
  headerTabsSlot: {
    minWidth: 0,
    minHeight: 0,
    display: "flex",
    alignItems: "stretch",
    overflow: "hidden",
    borderRight: `1px solid ${tokens.colors.rule}`,
  },
  breadcrumbSlot: {
    minWidth: 0,
    minHeight: 0,
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    borderLeft: `1px solid ${tokens.colors.rule}`,
  },
  headerMeta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "8px",
    padding: "0 16px",
    borderLeft: `1px solid ${tokens.colors.rule}`,
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.sans,
    fontSize: `${tokens.typography.fs.fs11}px`,
    fontStyle: "italic",
    whiteSpace: "nowrap",
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
    // Ronda Codex v2 L2: left (contexto + leyenda de teclas) y right
    // (diagnóstico) se dimensionan a su contenido; las pestañas flexan al
    // centro. Antes el left era un 20% que ahogaba la leyenda `O P S R ⌘K`.
    gridTemplateColumns: "auto minmax(0, 1fr) auto",
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
  footerCenter: {
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
