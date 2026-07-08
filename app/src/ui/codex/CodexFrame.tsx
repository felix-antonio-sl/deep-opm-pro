import type { ComponentChildren } from "preact";
import { tokens } from "../tokens";

interface CodexFrameColumnsParams {
  leftWidth: number;
  rightWidth: number;
  isTablet: boolean;
  canvasOnly?: boolean;
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
  canvasOnly?: boolean;
}

/**
 * Altura del header editorial Codex (primera fila del grid del CodexFrame).
 *
 * SSOT: este es el único lugar donde la altura del header vive como dato.
 * El layout `codexFrameRows()` la usa para construir el `gridTemplateRows`.
 *
 * BUG-20260607T220340Z-42c24c: la barra de simulación solía ser un overlay
 * `position: fixed` con `top: 60` hardcoded (match con la altura vieja
 * de 60px). BUG-1f46fe bajó el header a 48px y el overlay se quedó
 * flotando 12px más abajo, dejando una franja visible del body. El fix
 * ancló `top` a esta constante.
 *
 * BUG-20260607T224342Z-a8e599: la barra ya no es un overlay `fixed` —
 * vive DENTRO de `CodexCanvasMount.topbar`, en la región canvas. La
 * constante sigue siendo útil para `codexFrameRows` y como invariante
 * editorial del header.
 */
export const CODEX_HEADER_HEIGHT = 48;

export function codexFrameRows(canvasOnly = false): string {
  // BUG-20260606T041330Z-1f46fe: la barra superior se veía "desproporcionadamente
  // alta" porque la fila era 60px exactos. El contenido real más alto del header
  // son los `palabraTopBar` de 32px (toolbar) y la pestaña (que estira a la
  // fila). 48px deja ~8px de aire arriba/abajo — alineado con la economía
  // mobile (48px en `pageMobile.gridTemplateRows`) y con la altura que el
  // wordmark + tabs + acciones esperan de un header editorial Codex.
  return canvasOnly ? "minmax(0, 1fr)" : `${CODEX_HEADER_HEIGHT}px minmax(0, 1fr)`;
}

export function codexFrameColumns({ leftWidth, rightWidth, isTablet, canvasOnly = false }: CodexFrameColumnsParams): string {
  if (canvasOnly) return "minmax(0, 1fr)";
  const left = isTablet ? Math.min(leftWidth, 300) : leftWidth;
  const right = isTablet ? Math.min(rightWidth, 300) : rightWidth;
  return `${left}px 6px minmax(0, 1fr) 6px ${right}px`;
}

export function codexFrameAreas(canvasOnly = false): string {
  return canvasOnly ? `"canvas"` : `"left divisor canvas divisorInspector right"`;
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
  leftWidth,
  rightWidth,
  isTablet,
  canvasOnly = false,
}: CodexFrameProps) {
  return (
    <div data-testid="codex-frame" data-canvas-only={canvasOnly ? "true" : "false"} style={{ ...style.frame, gridTemplateRows: codexFrameRows(canvasOnly) }}>
      {/*
        Ronda Codex v2 L2 (auditoría rev2 §05): el header pasa del literal
        "Codex" al esquema editorial canónico `wordmark · acciones │ breadcrumb │ meta`.
        El wordmark es un único "Opforja" en Inria Serif italic ~22px (sin el
        chip duplicado que vivía en ToolbarBase). La columna central cablea el
        breadcrumb del manuscrito; la derecha imprime la meta (`N oraciones ·
        ● sin guardar · ⌘K`).
      */}
      {canvasOnly ? null : <header style={style.header}>
        <div data-testid="codex-wordmark" style={style.wordmark}>Opforja</div>
        <div style={style.headerTabsSlot}>{tabs}</div>
        <div style={style.breadcrumbSlot}>{breadcrumb}</div>
        <div style={style.toolbarSlot}>{toolbar}</div>
        <div style={style.headerMeta}>{meta}</div>
        {menu}
      </header>}
      <section
        data-testid="codex-frame-body"
        style={{
          ...style.body,
          gridTemplateColumns: codexFrameColumns({ leftWidth, rightWidth, isTablet, canvasOnly }),
          gridTemplateAreas: codexFrameAreas(canvasOnly),
        }}
      >
        {canvasOnly || leftWidth === 0 ? null : <div style={style.leftSlot}>{leftPanel}</div>}
        {canvasOnly ? null : leftDivider}
        {canvas}
        {canvasOnly ? null : rightDivider}
        {canvasOnly || rightWidth === 0 ? null : <aside style={style.rightSlot}>{rightPanel}</aside>}
      </section>
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
    gridTemplateColumns: "auto minmax(140px, 340px) minmax(130px, 320px) minmax(0, 1fr) auto auto",
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
    gridTemplateAreas: codexFrameAreas(false),
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
} satisfies Record<string, preact.JSX.CSSProperties>;
