import { describe, expect, test } from "bun:test";
import { normalizarMensajeFlash, TTL_MENSAJE_FLASH_MS } from "./MensajeFlashBridge";

describe("MensajeFlashBridge", () => {
  test("normaliza mensajes efímeros del store antes de publicarlos como FlashToast", () => {
    expect(normalizarMensajeFlash(null)).toBeNull();
    expect(normalizarMensajeFlash("   ")).toBeNull();
    expect(normalizarMensajeFlash(" Modelo guardado exitosamente ")).toBe("Modelo guardado exitosamente");
  });

  test("conserva la ventana historica de limpieza de la toolbar", () => {
    expect(TTL_MENSAJE_FLASH_MS).toBe(4_500);
  });
});
