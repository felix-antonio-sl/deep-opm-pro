import { useOpmStore } from "../../store";
import type { SessionMessagePort } from "./sessionMessagePort";

export function useZustandSessionMessagePort(): SessionMessagePort {
  const mensaje = useOpmStore((s) => s.mensaje);
  const limpiarMensaje = useOpmStore((s) => s.limpiarMensaje);

  return {
    mensaje,
    limpiarMensaje,
  };
}
