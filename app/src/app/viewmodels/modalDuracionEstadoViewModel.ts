import { useZustandStateDurationModalPort } from "../ports/zustandStateDurationModalPort";

export function useModalDuracionEstadoViewModel() {
  const {
    modelo,
    modalDuracionAbierto: abierto,
    cerrarModalDuracion: cerrar,
    fijarDuracionEstado: fijar,
    quitarDuracionEstado: quitar,
  } = useZustandStateDurationModalPort();
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
