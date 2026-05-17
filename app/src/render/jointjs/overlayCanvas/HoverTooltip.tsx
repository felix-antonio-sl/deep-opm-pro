import type { dia } from "jointjs";
import type { FeedbackOverlay } from "../../../app/ports/feedbackPort";
import { tokens } from "../../../ui/tokens";
import { useBboxTracker } from "./useBboxTracker";

interface Props {
  overlay: Extract<FeedbackOverlay, { tipo: "hover-tooltip" }>;
  paper: dia.Paper | null;
}

export function HoverTooltip({ overlay, paper }: Props) {
  const bbox = useBboxTracker(paper, overlay.anchorCellId);
  if (!bbox) return null;

  return (
    <div
      id={overlay.id}
      role="tooltip"
      data-testid="hover-tooltip"
      data-anchor-cell-id={overlay.anchorCellId}
      style={{
        ...style.tooltip,
        left: `${bbox.x + bbox.width / 2}px`,
        top: `${bbox.y + bbox.height + 8}px`,
      }}
    >
      {overlay.contenido}
    </div>
  );
}

const style = {
  tooltip: {
    position: "absolute",
    transform: "translateX(-50%)",
    maxWidth: "320px",
    padding: "6px 8px",
    border: `1px solid ${tokens.colors.bordeSlate}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoElevado,
    color: tokens.colors.textoPrimario,
    boxShadow: tokens.shadows.popover,
    fontFamily: tokens.typography.familyChrome,
    fontSize: tokens.typography.sizes.xs,
    fontWeight: tokens.typography.weights.semibold,
    lineHeight: 1.25,
    pointerEvents: "none",
    zIndex: 3,
    whiteSpace: "normal",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
