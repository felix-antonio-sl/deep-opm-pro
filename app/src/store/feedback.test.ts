import { beforeEach, describe, expect, test } from "bun:test";
import { addFlash, feedbackStore, sincronizarBadgesDesdeAvisos } from "./feedback";

describe("feedbackStore", () => {
  beforeEach(() => {
    feedbackStore.getState().clearAll();
  });

  test("mantiene un solo FlashToast visible por mensaje", () => {
    const primero = addFlash("Modelo guardado exitosamente", 10_000);
    const segundo = addFlash("Modelo guardado exitosamente", 10_000);
    const overlays = feedbackStore.getState().overlays;

    expect(primero).not.toBe(segundo);
    expect(overlays).toHaveLength(1);
    expect(overlays[0]?.id).toBe(segundo);
    expect(overlays[0]?.tipo).toBe("flash");
    if (overlays[0]?.tipo !== "flash") throw new Error("Overlay esperado: flash");
    expect(overlays[0].mensaje).toBe("Modelo guardado exitosamente");
  });

  test("respeta TTL de FlashToast", () => {
    const original = globalThis.setTimeout;
    const timers: Array<() => void> = [];
    globalThis.setTimeout = ((handler: TimerHandler, timeout?: number) => {
      expect(timeout).toBe(25);
      timers.push(typeof handler === "function" ? handler as () => void : () => undefined);
      return 1 as unknown as ReturnType<typeof setTimeout>;
    }) as unknown as typeof setTimeout;

    try {
      const id = addFlash("Objeto creado", 25);
      expect(feedbackStore.getState().overlays.some((overlay) => overlay.id === id)).toBe(true);
      timers[0]?.();
      expect(feedbackStore.getState().overlays.some((overlay) => overlay.id === id)).toBe(false);
    } finally {
      globalThis.setTimeout = original;
    }
  });

  test("sincronizarBadgesDesdeAvisos reemplaza solo ErrorBadge inline y conserva flashes", () => {
    addFlash("Modelo guardado exitosamente", 10_000);
    sincronizarBadgesDesdeAvisos([
      {
        anchorCellId: "a-proceso",
        reglaId: "proceso-sin-entrada-ni-salida",
        severidad: "advertencia",
        mensaje: "Proceso sin entrada ni salida",
        citaSSOT: "[V-115]",
      },
      {
        anchorCellId: "a-proceso",
        reglaId: "proceso-sin-entrada-ni-salida",
        severidad: "advertencia",
        mensaje: "Duplicado no debe crear segundo badge",
        citaSSOT: "[V-115]",
      },
    ]);

    let overlays = feedbackStore.getState().overlays;
    expect(overlays.filter((overlay) => overlay.tipo === "flash")).toHaveLength(1);
    expect(overlays.filter((overlay) => overlay.tipo === "inline-error")).toHaveLength(1);
    expect(overlays.find((overlay) => overlay.tipo === "inline-error")).toMatchObject({
      anchorCellId: "a-proceso",
      reglaId: "proceso-sin-entrada-ni-salida",
    });

    sincronizarBadgesDesdeAvisos([]);
    overlays = feedbackStore.getState().overlays;
    expect(overlays.filter((overlay) => overlay.tipo === "flash")).toHaveLength(1);
    expect(overlays.filter((overlay) => overlay.tipo === "inline-error")).toHaveLength(0);
  });
});
