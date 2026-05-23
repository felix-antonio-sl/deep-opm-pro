import type { FeedbackOverlay } from "../../../app/ports/feedbackPort";
import { tokens } from "../../../ui/tokens";

interface Props {
  overlay: Extract<FeedbackOverlay, { tipo: "flash" }>;
  index: number;
}

/**
 * Ronda 28 L6 (Bauhaus):
 *   - borde 1.5px ink, fondo paper, texto Inter Tight 13/500 ink.
 *   - banda lateral 3px en borde izquierdo. Como el contrato actual de
 *     FeedbackOverlay flash no expone severidad (siempre "info/exito"),
 *     se renderiza con banda ink por defecto. Si en el futuro se anade
 *     `severidad` al tipo flash, mapear:
 *       exito   → ink (borde izquierdo ink, banda implicita en el borde)
 *       error   → accent (#C8392F cinabrio)
 *       warning → warning (#8A3D2D terracota)
 *   - sin colores de severidad ni iconos decorativos (brief L6).
 */
export function FlashToast({ overlay, index }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="flash-toast"
      style={{
        ...style.toast,
        bottom: `${16 + index * 42}px`,
      }}
    >
      {overlay.mensaje}
    </div>
  );
}

const style = {
  toast: {
    position: "absolute",
    right: 16,
    minHeight: 30,
    maxWidth: 360,
    display: "inline-flex",
    alignItems: "center",
    padding: "0 12px",
    // Borde 1.5px ink en top/right/bottom; borde izquierdo 3px ink para la
    // banda lateral cromática del brief L6 (ink = éxito/info, sin acento).
    borderTop: `${tokens.stroke.base}px solid ${tokens.colors.ink}`,
    borderRight: `${tokens.stroke.base}px solid ${tokens.colors.ink}`,
    borderBottom: `${tokens.stroke.base}px solid ${tokens.colors.ink}`,
    borderLeft: `3px solid ${tokens.colors.ink}`,
    borderRadius: 0,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    boxShadow: "none",
    fontFamily: tokens.typography.fontFamily,
    fontSize: 13,
    fontWeight: 500,
    pointerEvents: "none",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
