import type { dia } from "jointjs";
import { useFeedbackStore } from "../../../store/feedback";
import { FlashToast } from "./FlashToast";

interface Props {
  paper: dia.Paper | null;
}

export function OverlayLayer({ paper: _paper }: Props) {
  const overlays = useFeedbackStore((s) => s.overlays);
  const flashes = overlays.filter((overlay) => overlay.tipo === "flash");
  if (flashes.length === 0) return null;
  return (
    <div data-testid="overlay-canvas-layer" style={style.layer}>
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
