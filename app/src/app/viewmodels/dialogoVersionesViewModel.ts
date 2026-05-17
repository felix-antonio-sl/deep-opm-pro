import { useMemo } from "preact/hooks";
import { aplicarPoliticaLogScaleVersiones, filtrarVersionesVisibles } from "../../persistencia/versiones";
import { useZustandVersionHistoryPort } from "../ports/zustandVersionHistoryPort";

export function useDialogoVersionesViewModel() {
  const {
    abierto,
    cerrar,
    modelos,
    modeloPersistidoId,
    crearVersionAhora,
    restaurar,
    eliminar,
    mostrarVersiones,
    toggleMostrarVersiones,
  } = useZustandVersionHistoryPort();
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
