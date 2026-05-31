import { createStore } from "zustand/vanilla";
import type { FeedbackAviso, FeedbackOverlay } from "../app/ports/feedbackPort";

export { EVENTO_ABRIR_AVISO_DIAGNOSTICO } from "../app/ports/feedbackPort";
export type { FeedbackAviso, FeedbackOverlay } from "../app/ports/feedbackPort";

export interface FeedbackState {
  overlays: FeedbackOverlay[];
  addOverlay: (overlay: FeedbackOverlay) => void;
  removeOverlay: (id: string) => void;
  clearAll: () => void;
  addInlineError: (cellId: string, mensaje: string, aviso: Omit<FeedbackAviso, "anchorCellId" | "mensaje">) => string;
  addFlash: (mensaje: string, ttl?: number) => string;
  sincronizarBadgesDesdeAvisos: (avisos: readonly FeedbackAviso[]) => void;
}

let secuenciaOverlay = 0;

export const feedbackStore = createStore<FeedbackState>((set, get) => ({
  overlays: [],
  addOverlay(overlay) {
    set({
      overlays: [
        ...get().overlays.filter((item) => (
          item.id !== overlay.id
          && !(item.tipo === "flash" && overlay.tipo === "flash" && item.mensaje === overlay.mensaje)
        )),
        overlay,
      ],
    });
  },
  removeOverlay(id) {
    set({ overlays: get().overlays.filter((item) => item.id !== id) });
  },
  clearAll() {
    set({ overlays: [] });
  },
  addInlineError(cellId, mensaje, aviso) {
    const id = idInlineError(aviso.reglaId, cellId);
    get().addOverlay({
      id,
      tipo: "inline-error",
      anchorCellId: cellId,
      reglaId: aviso.reglaId,
      severidad: aviso.severidad,
      mensaje,
      citaSSOT: aviso.citaSSOT,
    });
    return id;
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
  sincronizarBadgesDesdeAvisos(avisos) {
    const inlineErrors = avisos.map((aviso) => ({
      id: idInlineError(aviso.reglaId, aviso.anchorCellId),
      tipo: "inline-error" as const,
      anchorCellId: aviso.anchorCellId,
      reglaId: aviso.reglaId,
      severidad: aviso.severidad,
      mensaje: aviso.mensaje,
      citaSSOT: aviso.citaSSOT,
    }));
    set({
      overlays: [
        ...get().overlays.filter((overlay) => overlay.tipo !== "inline-error"),
        ...deduplicarInlineErrors(inlineErrors),
      ],
    });
  },
}));

export function addFlash(mensaje: string, ttl?: number): string {
  return feedbackStore.getState().addFlash(mensaje, ttl);
}

export function sincronizarBadgesDesdeAvisos(avisos: readonly FeedbackAviso[]): void {
  feedbackStore.getState().sincronizarBadgesDesdeAvisos(avisos);
}

function idInlineError(reglaId: string, cellId: string): string {
  return `inline-${reglaId}-${cellId}`;
}

function deduplicarInlineErrors(overlays: Array<Extract<FeedbackOverlay, { tipo: "inline-error" }>>): Array<Extract<FeedbackOverlay, { tipo: "inline-error" }>> {
  return Array.from(new Map(overlays.map((overlay) => [overlay.id, overlay])).values());
}
