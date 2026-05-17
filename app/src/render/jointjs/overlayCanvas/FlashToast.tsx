import type { FeedbackOverlay } from "../../../app/ports/feedbackPort";
import { tokens } from "../../../ui/tokens";

interface Props {
  overlay: Extract<FeedbackOverlay, { tipo: "flash" }>;
  index: number;
}

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
    border: `1px solid ${tokens.colors.exitoBase}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.exitoFondo,
    color: tokens.colors.exitoTexto,
    boxShadow: tokens.shadows.popover,
    fontFamily: tokens.typography.familyChrome,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.semibold,
    pointerEvents: "none",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
