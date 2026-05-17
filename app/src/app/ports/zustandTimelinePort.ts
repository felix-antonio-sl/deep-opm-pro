import { useOpmStore } from "../../store";
import type { TimelinePort } from "./timelinePort";

export function useZustandTimelinePort(): TimelinePort {
  const reordenarSubprocesoEnTimeline = useOpmStore((s) => s.reordenarSubprocesoEnTimeline);

  return {
    reordenarSubprocesoEnTimeline,
  };
}
