import { useOpmStore } from "../../store";

export function useModalDuracionEstadoViewModel() {
  const abierto = useOpmStore((s) => s.modalDuracionAbierto);
  const modelo = useOpmStore((s) => s.modelo);
  const cerrar = useOpmStore((s) => s.cerrarModalDuracion);
  const fijar = useOpmStore((s) => s.fijarDuracionEstado);
  const quitar = useOpmStore((s) => s.quitarDuracionEstado);
  const estado = abierto ? modelo.estados[abierto] : undefined;

  return {
    abierto,
    estado,
    cerrar,
    fijar,
    quitar,
  };
}

export type ModalDuracionEstadoViewModel = ReturnType<typeof useModalDuracionEstadoViewModel>;
