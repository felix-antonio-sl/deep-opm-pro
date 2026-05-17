import { componerCanvasInteractionPort, type CanvasInteractionPort } from "./canvasInteractionPort";
import { useZustandCanvasSessionPort } from "./zustandCanvasSessionPort";
import { useZustandModelCommandPort } from "./zustandModelCommandPort";
import { useZustandSelectionPort } from "./zustandSelectionPort";

export function useZustandCanvasInteractionPort(): CanvasInteractionPort {
  return componerCanvasInteractionPort(
    useZustandCanvasSessionPort(),
    useZustandSelectionPort(),
    useZustandModelCommandPort(),
  );
}
