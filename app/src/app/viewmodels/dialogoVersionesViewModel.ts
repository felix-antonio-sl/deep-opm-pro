import { useMemo } from "preact/hooks";
import { aplicarPoliticaLogScaleVersiones, filtrarVersionesVisibles } from "../../persistencia/versiones";
import { useOpmStore } from "../../store";

export function useDialogoVersionesViewModel() {
  const abierto = useOpmStore((s) => s.dialogoVersionesAbierto);
  const cerrar = useOpmStore((s) => s.cerrarDialogoVersiones);
  const modelos = useOpmStore((s) => s.modelosGuardados);
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const crearVersionAhora = useOpmStore((s) => s.crearVersionAhora);
  const restaurar = useOpmStore((s) => s.restaurarVersionComoCopia);
  const eliminar = useOpmStore((s) => s.eliminarVersionPorId);
  const mostrarVersiones = useOpmStore((s) => s.mostrarVersiones);
  const toggleMostrarVersiones = useOpmStore((s) => s.toggleMostrarVersiones);
  const modelo = useMemo(
    () => modelos.find((item) => item.id === abierto?.modeloId),
    [abierto?.modeloId, modelos],
  );
  const versiones = useMemo(
    () => filtrarVersionesVisibles(aplicarPoliticaLogScaleVersiones(modelo?.versiones ?? []), mostrarVersiones),
    [modelo?.versiones, mostrarVersiones],
  );

  return {
    abierto,
    cerrar,
    modelo,
    modeloPersistidoId,
    crearVersionAhora,
    restaurar,
    eliminar,
    mostrarVersiones,
    toggleMostrarVersiones,
    versiones,
  };
}

export type DialogoVersionesViewModel = ReturnType<typeof useDialogoVersionesViewModel>;
