import { zustandFeedbackPort, useZustandFeedbackOverlays } from "../app/ports/zustandFeedbackPort";
import { JointCanvas } from "../render/jointjs/JointCanvas";
import type { JointCanvasAdapter } from "../render/jointjs/jointCanvasAdapter";

interface Props {
  onAdapterChange?: (adapter: JointCanvasAdapter | null) => void;
}

export function JointCanvasFeedbackBoundary({ onAdapterChange }: Props) {
  const feedbackOverlays = useZustandFeedbackOverlays();
  const adapterProps = onAdapterChange ? { onAdapterChange } : {};
  return (
    <JointCanvas
      {...adapterProps}
      feedbackPort={zustandFeedbackPort}
      feedbackOverlays={feedbackOverlays}
    />
  );
}
