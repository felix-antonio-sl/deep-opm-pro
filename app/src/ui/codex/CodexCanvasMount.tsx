import type { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";
import { useZustandOpdNavigationPort } from "../../app/ports/zustandOpdNavigationPort";
import { codigoOpd } from "../arbol/NodoOpd";
import { useCanvasPaper } from "../CanvasAdapterContext";
import { tokens } from "../tokens";
import { CodexSelectionAnnotation } from "./CodexSelectionAnnotation";
import { GLIFO_SEP } from "./glifos";

interface CodexCanvasMountProps {
  children: ComponentChildren;
  floating?: ComponentChildren;
  /**
   * Slot para una franja chrome del canvas que se monta ARRIBA del header
   * (kicker + zoom) y ARRIBA del `paperHost` (JointJS).
   *
   * BUG-20260607T224342Z-a8e599: la barra de simulación solía ser un
   * overlay `position: fixed` con `left: 0; right: 0` que cubría los
   * botones de ocultar panel (◀/▶) que viven en la parte superior de
   * los paneles laterales OPL/Inspector. Como `topbar` la barra vive
   * DENTRO de la región canvas, jamás toca los paneles laterales.
   */
  topbar?: ComponentChildren;
  chromeVisible?: boolean;
}

export function CodexCanvasMount({ children, floating, topbar, chromeVisible = true }: CodexCanvasMountProps) {
  const { modelo, opdActivoId } = useZustandOpdNavigationPort();
  const opdActivo = modelo.opds[opdActivoId];
  const code = opdActivo ? codigoOpd(opdActivo.nombre) : "SD";
  const esRaiz = opdActivoId === modelo.opdRaizId;
  // §4: kicker "SD · OPD raíz" (del OPD activo, lectura). Para OPDs hijos se
  // refleja el código + "OPD refinado" para no mentir sobre la jerarquía.
  const kicker = `${code} ${GLIFO_SEP} ${esRaiz ? "OPD raíz" : "OPD refinado"}`;
  const zoom = useZoomDisplay();

  return (
    <div data-testid="canvas-pane" style={style.canvas}>
      {topbar ? <div data-testid="canvas-topbar" style={style.topbar}>{topbar}</div> : null}
      {chromeVisible ? <div data-testid="canvas-header" style={style.header}>
        <span style={style.kicker}>{kicker}</span>
        <span data-testid="canvas-zoom" style={style.zoom}>{`zoom ${GLIFO_SEP} ${zoom}`}</span>
      </div> : null}
      <div style={style.paperHost}>
        {children}
        {floating ? <div style={style.floating}>{floating}</div> : null}
        <CodexSelectionAnnotation />
      </div>
    </div>
  );
}

// Refleja paper.scale() como porcentaje (§4: display de zoom). 100% sin paper.
function useZoomDisplay(): string {
  const paper = useCanvasPaper();
  const [zoom, setZoom] = useState("100%");

  useEffect(() => {
    if (!paper) {
      setZoom("100%");
      return undefined;
    }
    const leer = () => setZoom(formatearZoom(escalaDePaper(paper)));
    leer();
    const eventos = paper as unknown as { on(e: string, cb: () => void): void; off(e: string, cb: () => void): void };
    eventos.on("scale transform resize", leer);
    return () => eventos.off("scale transform resize", leer);
  }, [paper]);

  return zoom;
}

function escalaDePaper(paper: unknown): number {
  const conScale = paper as { scale?: () => { sx: number } };
  const sx = conScale.scale?.().sx;
  return typeof sx === "number" && Number.isFinite(sx) && sx > 0 ? sx : 1;
}

export function formatearZoom(escala: number): string {
  return `${Math.round(escala * 100)}%`;
}

const style = {
  canvas: {
    gridArea: "canvas",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    background: tokens.colors.paperWarm,
  },
  topbar: {
    flex: "0 0 auto",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  header: {
    flex: "0 0 auto",
    minWidth: 0,
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: "12px",
    padding: "10px 18px 8px",
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.rule}`,
  },
  kicker: {
    flex: "1 1 auto",
    minWidth: 0,
    display: "block",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.mono,
    fontSize: `${tokens.typography.fs.fs9}px`,
    letterSpacing: tokens.typography.ls.kicker,
    textTransform: "uppercase",
  },
  zoom: {
    flex: "0 0 auto",
    whiteSpace: "nowrap",
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.mono,
    fontSize: `${tokens.typography.fs.fs10}px`,
    letterSpacing: tokens.typography.ls.mono,
  },
  paperHost: {
    position: "relative",
    flex: "1 1 auto",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
  },
  floating: {
    position: "absolute",
    left: "16px",
    top: "16px",
    zIndex: 12,
    pointerEvents: "none",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
