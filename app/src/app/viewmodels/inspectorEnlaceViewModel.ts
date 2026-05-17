import { useZustandLinkInspectorPort } from "../ports/zustandLinkInspectorPort";

export function useInspectorEnlaceViewModel() {
  return useZustandLinkInspectorPort();
}

export type InspectorEnlaceViewModel = ReturnType<typeof useInspectorEnlaceViewModel>;
