import { useOpmStore } from "../../store";

export function useMensajeFlashViewModel() {
  const mensaje = useOpmStore((s) => s.mensaje);
  const limpiarMensaje = useOpmStore((s) => s.limpiarMensaje);

  return {
    mensaje,
    limpiarMensaje,
  };
}

export type MensajeFlashViewModel = ReturnType<typeof useMensajeFlashViewModel>;
