import { beforeEach, describe, expect, test } from "bun:test";
import { addFlash, feedbackStore } from "./feedback";

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
    expect(overlays[0]?.mensaje).toBe("Modelo guardado exitosamente");
  });
});
