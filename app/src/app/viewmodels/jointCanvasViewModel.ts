import { useZustandCanvasInteractionPort } from "../ports/zustandCanvasInteractionPort";

export function useJointCanvasViewModel() {
  return useZustandCanvasInteractionPort();
}

export type JointCanvasViewModel = ReturnType<typeof useJointCanvasViewModel>;
