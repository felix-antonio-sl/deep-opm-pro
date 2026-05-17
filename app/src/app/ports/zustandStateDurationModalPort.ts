import { useOpmStore } from "../../store";
import type { StateDurationModalPort } from "./stateDurationModalPort";

export function useZustandStateDurationModalPort(): StateDurationModalPort {
  const modelo = useOpmStore((s) => s.modelo);
  const modalDuracionAbierto = useOpmStore((s) => s.modalDuracionAbierto);
  const cerrarModalDuracion = useOpmStore((s) => s.cerrarModalDuracion);
  const fijarDuracionEstado = useOpmStore((s) => s.fijarDuracionEstado);
  const quitarDuracionEstado = useOpmStore((s) => s.quitarDuracionEstado);

  return {
    modelo,
    modalDuracionAbierto,
    cerrarModalDuracion,
    fijarDuracionEstado,
    quitarDuracionEstado,
  };
}
