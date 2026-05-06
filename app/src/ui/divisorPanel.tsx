import { useRef } from "preact/hooks";

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
}

export function DivisorPanel({
  orientacion,
  anchoInicial,
  anchoMin = ANCHO_PANEL_ARBOL_MIN,
  anchoMax = ANCHO_PANEL_ARBOL_MAX,
  onAnchoChange,
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
    const delta = orientacion === "vertical" ? event.clientX - inicio.x : event.clientY - inicio.y;
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
      data-testid="divisor-panel-arbol"
      title="Ajustar ancho del árbol"
      style={orientacion === "vertical" ? style.vertical : style.horizontal}
      onPointerDown={(event) => iniciarDrag(event as unknown as PointerEvent)}
      onDblClick={() => onAnchoChange(ANCHO_PANEL_ARBOL_RESET)}
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

const style = {
  vertical: {
    gridArea: "divisor",
    width: "6px",
    minWidth: "6px",
    cursor: "col-resize",
    background: "#f8fafc",
    borderRight: "1px solid #d9e0ea",
    borderLeft: "1px solid #edf2f7",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    zIndex: 2,
  },
  horizontal: {
    height: "6px",
    minHeight: "6px",
    cursor: "row-resize",
    background: "#f8fafc",
    borderTop: "1px solid #edf2f7",
    borderBottom: "1px solid #d9e0ea",
    display: "flex",
    alignItems: "center",
    justifyContent: "stretch",
  },
  controlVertical: {
    width: "2px",
    background: "#c8d2df",
    opacity: 0.7,
  },
  controlHorizontal: {
    height: "2px",
    width: "100%",
    background: "#c8d2df",
    opacity: 0.7,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
