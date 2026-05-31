import type { dia } from "jointjs";
import type { FeedbackOverlay } from "../../../app/ports/feedbackPort";
import { ErrorBadge } from "./ErrorBadge";
import { FlashToast } from "./FlashToast";

interface Props {
  paper: dia.Paper | null;
  overlays: readonly FeedbackOverlay[];
}

export function OverlayLayer({ paper, overlays }: Props) {
  const flashes = overlays.filter((overlay) => overlay.tipo === "flash");
  const inlineErrors = overlays.filter((overlay) => overlay.tipo === "inline-error");
  if (flashes.length === 0 && inlineErrors.length === 0) return null;
  return (
    <div data-testid="overlay-canvas-layer" style={style.layer}>
      {inlineErrors.map((overlay) => (
        <ErrorBadge key={overlay.id} overlay={overlay} paper={paper} />
      ))}
      {flashes.map((overlay, index) => (
        <FlashToast key={overlay.id} overlay={overlay} index={index} />
      ))}
    </div>
  );
}

const style = {
  layer: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 6,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
