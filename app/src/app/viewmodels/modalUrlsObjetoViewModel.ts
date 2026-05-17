import { useOpmStore } from "../../store";

export function useModalUrlsObjetoViewModel() {
  const abierto = useOpmStore((s) => s.modalUrlsAbierto);
  const modelo = useOpmStore((s) => s.modelo);
  const cerrar = useOpmStore((s) => s.cerrarModalUrls);
  const agregar = useOpmStore((s) => s.agregarUrlAEntidad);
  const eliminar = useOpmStore((s) => s.eliminarUrlDeEntidad);
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
