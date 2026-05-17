import type { dia } from "jointjs";
import { useZustandFeedbackOverlays } from "../../../app/ports/zustandFeedbackPort";
import { ErrorBadge } from "./ErrorBadge";
import { FlashToast } from "./FlashToast";
import { HoverTooltip } from "./HoverTooltip";

interface Props {
  paper: dia.Paper | null;
}

export function OverlayLayer({ paper }: Props) {
  const overlays = useZustandFeedbackOverlays();
  const flashes = overlays.filter((overlay) => overlay.tipo === "flash");
  const inlineErrors = overlays.filter((overlay) => overlay.tipo === "inline-error");
  const tooltips = overlays.filter((overlay) => overlay.tipo === "hover-tooltip");
  if (flashes.length === 0 && inlineErrors.length === 0 && tooltips.length === 0) return null;
  return (
    <div data-testid="overlay-canvas-layer" style={style.layer}>
      {inlineErrors.map((overlay) => (
        <ErrorBadge key={overlay.id} overlay={overlay} paper={paper} />
      ))}
      {tooltips.map((overlay) => (
        <HoverTooltip key={overlay.id} overlay={overlay} paper={paper} />
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
