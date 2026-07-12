import { createStore } from "zustand/vanilla";

export type FeedbackOverlay =
  | {
      id: string;
      tipo: "flash";
      mensaje: string;
      ttl: number;
      creadoEn: number;
    }
  | {
      id: string;
      tipo: "inline-error";
      anchorCellId: string;
      reglaId: string;
      severidad: "error" | "advertencia" | "info";
      mensaje: string;
      citaSSOT: string;
    };

export interface FeedbackAviso {
  anchorCellId: string;
  reglaId: string;
  severidad: "error" | "advertencia" | "info";
  mensaje: string;
  citaSSOT: string;
}

export const EVENTO_ABRIR_AVISO_DIAGNOSTICO = "opm:diagnostico:abrir-aviso";

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
// Timers de auto-expiración de flashes, indexados por id de overlay. Permite
// cancelarlos cuando el overlay se retira antes del ttl (removeOverlay) o cuando
// se limpia todo (clearAll), evitando timers huérfanos en sesiones largas.
const timersFlash = new Map<string, ReturnType<typeof setTimeout>>();

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
    const timer = timersFlash.get(id);
    if (timer !== undefined) {
      globalThis.clearTimeout?.(timer);
      timersFlash.delete(id);
    }
    set({ overlays: get().overlays.filter((item) => item.id !== id) });
  },
  clearAll() {
    for (const timer of timersFlash.values()) globalThis.clearTimeout?.(timer);
    timersFlash.clear();
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
    const timer = globalThis.setTimeout?.(() => {
      timersFlash.delete(id);
      get().removeOverlay(id);
    }, ttl);
    if (timer !== undefined) timersFlash.set(id, timer);
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
