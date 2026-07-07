import { useMemo } from "preact/hooks";
import { aplicarPoliticaLogScaleVersiones, filtrarVersionesVisibles } from "../../persistencia/versiones";
import { agruparHistorialPorSesionAgente } from "../../mesa/historialAgente";
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
  // A′-vitrina: colapsa las corridas consecutivas de versiones del agente en un
  // hito, para que el historial no mienta sobre qué es un hito.
  const filas = useMemo(() => agruparHistorialPorSesionAgente(versiones), [versiones]);

  return {
    filas,
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
