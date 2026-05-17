import {
  crearBugCaptureContext,
  leerBugCaptureEnvironmentContext,
  type BugCaptureContext,
} from "../ports/bugCaptureContextPort";
import { useZustandBugCaptureContextPort } from "../ports/zustandBugCaptureContextPort";

export type { BugCaptureContext };

export function useBugCaptureContext() {
  const storeContext = useZustandBugCaptureContextPort();
  return crearBugCaptureContext(storeContext, leerBugCaptureEnvironmentContext());
}
