import { zustandFeedbackPort, useZustandFeedbackOverlays } from "../app/ports/zustandFeedbackPort";
import { JointCanvas } from "../render/jointjs/JointCanvas";
import type { JointCanvasAdapter } from "../render/jointjs/jointCanvasAdapter";
import { MenuTipoEnlace } from "./MenuTipoEnlace";
import { RenombradoInline } from "./RenombradoInline";

interface Props {
  onAdapterChange?: (adapter: JointCanvasAdapter | null) => void;
  readonlyMode?: boolean;
}

export function JointCanvasFeedbackBoundary({ onAdapterChange, readonlyMode }: Props) {
  const feedbackOverlays = useZustandFeedbackOverlays();
  const adapterProps = onAdapterChange ? { onAdapterChange } : {};
  return (
    <JointCanvas
      {...adapterProps}
      readonlyMode={readonlyMode}
      feedbackPort={zustandFeedbackPort}
      feedbackOverlays={feedbackOverlays}
      renderMenuTipoEnlace={(props) => <MenuTipoEnlace {...props} />}
      renderRenombradoInline={(props) => <RenombradoInline {...props} />}
    />
  );
}
