// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useRef } from "preact/hooks";
import { tokens } from "./tokens";

export const ANCHO_PANEL_ARBOL_DEFAULT = 240;
export const ANCHO_PANEL_ARBOL_RESET = 280;
export const ANCHO_PANEL_ARBOL_MIN = 160;
export const ANCHO_PANEL_ARBOL_MAX = 600;

export interface DivisorPanelProps {
  orientacion: "vertical" | "horizontal";
  anchoInicial: number;
  anchoMin?: number;
  anchoMax?: number;
  onAnchoChange: (px: number) => void;
  /**
   * BUG-20260511T225343Z-696858: cuando el divisor está a la izquierda del
   * pane que dimensiona (caso árbol/canvas), arrastrar a la derecha agranda
   * → delta natural. Cuando el divisor está a la derecha del pane (caso
   * canvas/inspector), arrastrar a la izquierda agranda el inspector → hay
   * que invertir el signo del delta.
   */
  invertirDelta?: boolean;
  /** Ancho al que vuelve el panel cuando se hace doble clic. */
  resetValue?: number;
  /** Permite reusar el divisor con testids distintos sin duplicar el componente. */
  testId?: string;
  /** Tooltip accesible del separator. */
  title?: string;
  /** `gridArea` específico (override del default "divisor" para colocar en otro slot). */
  gridArea?: string;
}

export function DivisorPanel({
  orientacion,
  anchoInicial,
  anchoMin = ANCHO_PANEL_ARBOL_MIN,
  anchoMax = ANCHO_PANEL_ARBOL_MAX,
  onAnchoChange,
  invertirDelta = false,
  resetValue = ANCHO_PANEL_ARBOL_RESET,
  testId = "divisor-panel-arbol",
  title = orientacion === "vertical" ? "Ajustar ancho del árbol" : "Ajustar alto del panel",
  gridArea,
}: DivisorPanelProps) {
  const inicioRef = useRef<{ x: number; y: number; ancho: number } | null>(null);

  const iniciarDrag = (event: PointerEvent) => {
    event.preventDefault();
    inicioRef.current = { x: event.clientX, y: event.clientY, ancho: anchoInicial };
    window.addEventListener("pointermove", mover);
    window.addEventListener("pointerup", terminar, { once: true });
  };

  const mover = (event: PointerEvent) => {
    const inicio = inicioRef.current;
    if (!inicio) return;
    const deltaBase = orientacion === "vertical" ? event.clientX - inicio.x : event.clientY - inicio.y;
    const delta = invertirDelta ? -deltaBase : deltaBase;
    onAnchoChange(limitarAnchoPanel(inicio.ancho + delta, anchoMin, anchoMax));
  };

  const terminar = () => {
    inicioRef.current = null;
    window.removeEventListener("pointermove", mover);
  };

  return (
    <div
      role="separator"
      aria-orientation={orientacion === "vertical" ? "vertical" : "horizontal"}
      aria-valuemin={anchoMin}
      aria-valuemax={anchoMax}
      aria-valuenow={anchoInicial}
      data-testid={testId}
      title={title}
      style={orientacion === "vertical" ? styleVertical(gridArea) : style.horizontal}
      onPointerDown={(event) => iniciarDrag(event as unknown as PointerEvent)}
      onDblClick={() => onAnchoChange(resetValue)}
    >
      <span aria-hidden="true" style={orientacion === "vertical" ? style.controlVertical : style.controlHorizontal} />
    </div>
  );
}

export function limitarAnchoPanel(
  valor: number,
  min = ANCHO_PANEL_ARBOL_MIN,
  max = ANCHO_PANEL_ARBOL_MAX,
): number {
  if (!Number.isFinite(valor)) return ANCHO_PANEL_ARBOL_DEFAULT;
  return Math.max(min, Math.min(max, Math.round(valor)));
}

function styleVertical(gridArea: string | undefined): preact.JSX.CSSProperties {
  return {
    gridArea: gridArea ?? "divisor",
    width: "6px",
    minWidth: "6px",
    cursor: "col-resize",
    background: tokens.colors.fondoElevado,
    borderRight: `1px solid ${tokens.colors.bordeIntermedio}`,
    borderLeft: `1px solid ${tokens.colors.fondoLineaTiempo}`,
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    zIndex: 2,
  };
}

const style = {
  horizontal: {
    height: "6px",
    minHeight: "6px",
    cursor: "row-resize",
    background: tokens.colors.fondoElevado,
    borderTop: `1px solid ${tokens.colors.fondoLineaTiempo}`,
    borderBottom: `1px solid ${tokens.colors.bordeIntermedio}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "stretch",
  },
  controlVertical: {
    width: "2px",
    background: tokens.colors.bordeControl,
    opacity: 0.7,
  },
  controlHorizontal: {
    height: "2px",
    width: "100%",
    background: tokens.colors.bordeControl,
    opacity: 0.7,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
