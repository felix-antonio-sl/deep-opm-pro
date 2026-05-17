import { useEffect, useState } from "preact/hooks";
import {
  addFlash as addFlashStore,
  clearHoverTooltip as clearHoverTooltipStore,
  feedbackStore,
  setHoverTooltip as setHoverTooltipStore,
  sincronizarBadgesDesdeAvisos as sincronizarBadgesDesdeAvisosStore,
} from "../../store/feedback";
import type { FeedbackAviso, FeedbackOverlay, FeedbackPort } from "./feedbackPort";

export function addFlash(mensaje: string, ttl?: number): string {
  return addFlashStore(mensaje, ttl);
}

export function setHoverTooltip(cellId: string, contenido: string): void {
  setHoverTooltipStore(cellId, contenido);
}

export function clearHoverTooltip(): void {
  clearHoverTooltipStore();
}

export function sincronizarBadgesDesdeAvisos(avisos: readonly FeedbackAviso[]): void {
  sincronizarBadgesDesdeAvisosStore(avisos);
}

export const zustandFeedbackPort: FeedbackPort = {
  addFlash,
  setHoverTooltip,
  clearHoverTooltip,
  sincronizarBadgesDesdeAvisos,
};

export function useZustandFeedbackOverlays(): FeedbackOverlay[] {
  const [overlays, setOverlays] = useState(() => feedbackStore.getState().overlays);
  useEffect(() => feedbackStore.subscribe((state) => {
    setOverlays((current) => (Object.is(current, state.overlays) ? current : state.overlays));
  }), []);
  return overlays;
}
