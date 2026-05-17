import { useZustandAppShellOverlaysPort } from "../ports/zustandAppShellOverlaysPort";
import { useZustandAppShellWorkbenchPort } from "../ports/zustandAppShellWorkbenchPort";

export function useAppShellViewModel() {
  const workbench = useZustandAppShellWorkbenchPort();
  const overlays = useZustandAppShellOverlaysPort();

  return {
    ...workbench,
    ...overlays,
  };
}

export type AppShellViewModel = ReturnType<typeof useAppShellViewModel>;
