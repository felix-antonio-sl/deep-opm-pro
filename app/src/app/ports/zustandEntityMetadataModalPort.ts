import { useOpmStore } from "../../store";
import type { EntityMetadataModalPort, EntityMetadataOpenersPort } from "./entityMetadataModalPort";

export function useZustandEntityMetadataModalPort(): EntityMetadataModalPort {
  const modelo = useOpmStore((s) => s.modelo);
  const modalImagenAbierto = useOpmStore((s) => s.modalImagenAbierto);
  const modalUrlsAbierto = useOpmStore((s) => s.modalUrlsAbierto);
  const cerrarModalImagen = useOpmStore((s) => s.cerrarModalImagen);
  const editarImagenEntidad = useOpmStore((s) => s.editarImagenEntidad);
  const quitarImagenEntidad = useOpmStore((s) => s.quitarImagenEntidad);
  const cerrarModalUrls = useOpmStore((s) => s.cerrarModalUrls);
  const agregarUrlAEntidad = useOpmStore((s) => s.agregarUrlAEntidad);
  const eliminarUrlDeEntidad = useOpmStore((s) => s.eliminarUrlDeEntidad);

  return {
    modelo,
    modalImagenAbierto,
    modalUrlsAbierto,
    cerrarModalImagen,
    editarImagenEntidad,
    quitarImagenEntidad,
    cerrarModalUrls,
    agregarUrlAEntidad,
    eliminarUrlDeEntidad,
  };
}

export function useZustandEntityMetadataOpenersPort(): EntityMetadataOpenersPort {
  const abrirModalUrls = useOpmStore((s) => s.abrirModalUrls);

  return {
    abrirModalUrls,
  };
}
