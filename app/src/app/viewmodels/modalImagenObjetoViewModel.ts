import { useZustandEntityMetadataModalPort } from "../ports/zustandEntityMetadataModalPort";

export function useModalImagenObjetoViewModel() {
  const {
    modelo,
    modalImagenAbierto: abierto,
    cerrarModalImagen: cerrar,
    editarImagenEntidad: editar,
    quitarImagenEntidad: quitar,
  } = useZustandEntityMetadataModalPort();
  const entidad = abierto ? modelo.entidades[abierto] : undefined;

  return {
    abierto,
    entidad,
    cerrar,
    editar,
    quitar,
  };
}

export type ModalImagenObjetoViewModel = ReturnType<typeof useModalImagenObjetoViewModel>;
