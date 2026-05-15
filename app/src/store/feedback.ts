import { useEffect, useState } from "preact/hooks";
import { createStore } from "zustand/vanilla";

export type FeedbackOverlay =
  | {
      id: string;
      tipo: "flash";
      mensaje: string;
      ttl: number;
      creadoEn: number;
    };

interface FeedbackState {
  overlays: FeedbackOverlay[];
  addOverlay: (overlay: FeedbackOverlay) => void;
  removeOverlay: (id: string) => void;
  clearAll: () => void;
  addFlash: (mensaje: string, ttl?: number) => string;
}

let secuenciaOverlay = 0;

export const feedbackStore = createStore<FeedbackState>((set, get) => ({
  overlays: [],
  addOverlay(overlay) {
    set({ overlays: [...get().overlays.filter((item) => item.id !== overlay.id), overlay] });
  },
  removeOverlay(id) {
    set({ overlays: get().overlays.filter((item) => item.id !== id) });
  },
  clearAll() {
    set({ overlays: [] });
  },
  addFlash(mensaje, ttl = 2_000) {
    const id = `flash-${Date.now()}-${secuenciaOverlay += 1}`;
    const overlay: FeedbackOverlay = {
      id,
      tipo: "flash",
      mensaje,
      ttl,
      creadoEn: Date.now(),
    };
    get().addOverlay(overlay);
    globalThis.setTimeout?.(() => get().removeOverlay(id), ttl);
    return id;
  },
}));

export function addFlash(mensaje: string, ttl?: number): string {
  return feedbackStore.getState().addFlash(mensaje, ttl);
}

export function useFeedbackStore<T>(selector: (state: FeedbackState) => T): T {
  const [selected, setSelected] = useState(() => selector(feedbackStore.getState()));
  useEffect(() => feedbackStore.subscribe((state) => {
    const next = selector(state);
    setSelected((current) => (Object.is(current, next) ? current : next));
  }), [selector]);
  return selected;
}
