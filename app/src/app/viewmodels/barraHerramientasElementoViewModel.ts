import { useZustandLinkContextActionsPort } from "../ports/zustandLinkContextActionsPort";
import { useZustandOpdNavigationPort } from "../ports/zustandOpdNavigationPort";
import { useZustandSelectedElementActionsPort } from "../ports/zustandSelectedElementActionsPort";
import { useZustandSelectionBatchActionsPort } from "../ports/zustandSelectionBatchActionsPort";
import { useZustandSelectionPort } from "../ports/zustandSelectionPort";

export function useBarraHerramientasElementoViewModel() {
  const { modelo, opdActivoId } = useZustandOpdNavigationPort();
  const { seleccionId, enlaceSeleccionId, seleccionados } = useZustandSelectionPort();
  const {
    agregarEstadoSmart,
    descomponerSeleccionada: descomponer,
    desplegarSeleccionada: desplegar,
    abrirModalImagen,
  } = useZustandSelectedElementActionsPort();
  const {
    enlaceEstiloPortapapeles,
    copiarEstiloEnlaceAlPortapapeles,
    pegarEstiloEnlaceDesdePortapapeles,
  } = useZustandLinkContextActionsPort();
  const {
    eliminarSeleccion,
    conectarSeleccionAlTodo,
    traerEnlacesEntreSeleccionadas,
    alinearSeleccion,
    distribuirSeleccion,
  } = useZustandSelectionBatchActionsPort();

  return {
    modelo,
    opdActivoId,
    seleccionId,
    enlaceSeleccionId,
    seleccionados,
    enlaceEstiloPortapapeles,
    agregarEstadoSmart,
    descomponer,
    desplegar,
    abrirModalImagen,
    copiarEstiloEnlaceAlPortapapeles,
    pegarEstiloEnlaceDesdePortapapeles,
    eliminarSeleccion,
    conectarSeleccionAlTodo,
    traerEnlacesEntreSeleccionadas,
    alinearSeleccion,
    distribuirSeleccion,
  };
}

export type BarraHerramientasElementoViewModel = ReturnType<typeof useBarraHerramientasElementoViewModel>;
