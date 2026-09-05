import { useZustandAppShellOverlaysPort } from "../ports/zustandAppShellOverlaysPort";
import { useZustandAppShellWorkbenchPort } from "../ports/zustandAppShellWorkbenchPort";

export function useAppShellViewModel() {
  return useZustandAppShellWorkbenchPort();
}

export function useAppShellDialogsViewModel() {
  return useZustandAppShellOverlaysPort();
}

export type AppShellViewModel = ReturnType<typeof useAppShellViewModel>;
