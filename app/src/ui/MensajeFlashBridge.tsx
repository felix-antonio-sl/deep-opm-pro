import { useEffect, useRef } from "preact/hooks";
import { addFlash } from "../store/feedback";
import { useOpmStore } from "../store";

export const TTL_MENSAJE_FLASH_MS = 4_500;

export function normalizarMensajeFlash(mensaje: string | null): string | null {
  const texto = mensaje?.trim() ?? "";
  return texto.length > 0 ? texto : null;
}

export function MensajeFlashBridge() {
  const mensaje = useOpmStore((s) => s.mensaje);
  const limpiarMensaje = useOpmStore((s) => s.limpiarMensaje);
  const ultimoPublicadoRef = useRef<string | null>(null);

  useEffect(() => {
    const texto = normalizarMensajeFlash(mensaje);
    if (!texto) {
      ultimoPublicadoRef.current = null;
      return undefined;
    }
    if (ultimoPublicadoRef.current !== texto) {
      addFlash(texto, TTL_MENSAJE_FLASH_MS);
      ultimoPublicadoRef.current = texto;
    }
    const timeout = window.setTimeout(limpiarMensaje, TTL_MENSAJE_FLASH_MS);
    return () => window.clearTimeout(timeout);
  }, [limpiarMensaje, mensaje]);

  return null;
}
