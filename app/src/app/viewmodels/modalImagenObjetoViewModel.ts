import { useOpmStore } from "../../store";

export function useModalImagenObjetoViewModel() {
  const abierto = useOpmStore((s) => s.modalImagenAbierto);
  const modelo = useOpmStore((s) => s.modelo);
  const cerrar = useOpmStore((s) => s.cerrarModalImagen);
  const editar = useOpmStore((s) => s.editarImagenEntidad);
  const quitar = useOpmStore((s) => s.quitarImagenEntidad);
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
