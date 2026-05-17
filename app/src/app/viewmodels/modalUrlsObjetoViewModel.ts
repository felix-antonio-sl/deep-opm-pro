import { useZustandEntityMetadataModalPort } from "../ports/zustandEntityMetadataModalPort";

export function useModalUrlsObjetoViewModel() {
  const {
    modelo,
    modalUrlsAbierto: abierto,
    cerrarModalUrls: cerrar,
    agregarUrlAEntidad: agregar,
    eliminarUrlDeEntidad: eliminar,
  } = useZustandEntityMetadataModalPort();
  const entidad = abierto ? modelo.entidades[abierto] : undefined;

  return {
    abierto,
    entidad,
    cerrar,
    agregar,
    eliminar,
  };
}

export type ModalUrlsObjetoViewModel = ReturnType<typeof useModalUrlsObjetoViewModel>;
