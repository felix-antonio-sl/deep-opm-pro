import { useEffect, useState } from "preact/hooks";
import {
  addFlash as addFlashStore,
  feedbackStore,
  sincronizarBadgesDesdeAvisos as sincronizarBadgesDesdeAvisosStore,
} from "../../store/feedback";
import type { FeedbackAviso, FeedbackOverlay, FeedbackPort } from "./feedbackPort";

export function addFlash(mensaje: string, ttl?: number): string {
  return addFlashStore(mensaje, ttl);
}

export function sincronizarBadgesDesdeAvisos(avisos: readonly FeedbackAviso[]): void {
  sincronizarBadgesDesdeAvisosStore(avisos);
}

export const zustandFeedbackPort: FeedbackPort = {
  addFlash,
  sincronizarBadgesDesdeAvisos,
};

export function useZustandFeedbackOverlays(): FeedbackOverlay[] {
  const [overlays, setOverlays] = useState(() => feedbackStore.getState().overlays);
  useEffect(() => feedbackStore.subscribe((state) => {
    setOverlays((current) => (Object.is(current, state.overlays) ? current : state.overlays));
  }), []);
  return overlays;
}
