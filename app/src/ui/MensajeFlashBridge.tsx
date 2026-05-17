import { useEffect, useRef } from "preact/hooks";
import { addFlash } from "../app/ports/zustandFeedbackPort";
import { useMensajeFlashViewModel } from "../app/viewmodels/mensajeFlashViewModel";

export const TTL_MENSAJE_FLASH_MS = 4_500;

export function normalizarMensajeFlash(mensaje: string | null): string | null {
  const texto = mensaje?.trim() ?? "";
  return texto.length > 0 ? texto : null;
}

export function MensajeFlashBridge() {
  const { mensaje, limpiarMensaje } = useMensajeFlashViewModel();
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
