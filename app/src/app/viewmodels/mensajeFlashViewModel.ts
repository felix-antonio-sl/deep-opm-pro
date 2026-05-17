import { useZustandSessionMessagePort } from "../ports/zustandSessionMessagePort";

export function useMensajeFlashViewModel() {
  const { mensaje, limpiarMensaje } = useZustandSessionMessagePort();

  return {
    mensaje,
    limpiarMensaje,
  };
}

export type MensajeFlashViewModel = ReturnType<typeof useMensajeFlashViewModel>;
