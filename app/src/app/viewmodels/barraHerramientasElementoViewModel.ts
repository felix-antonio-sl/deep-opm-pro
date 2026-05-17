import { useOpmStore } from "../../store";
import { useZustandLinkContextActionsPort } from "../ports/zustandLinkContextActionsPort";
import { useZustandOpdNavigationPort } from "../ports/zustandOpdNavigationPort";
import { useZustandSelectionBatchActionsPort } from "../ports/zustandSelectionBatchActionsPort";
import { useZustandSelectionPort } from "../ports/zustandSelectionPort";

export function useBarraHerramientasElementoViewModel() {
  const { modelo, opdActivoId } = useZustandOpdNavigationPort();
  const { seleccionId, enlaceSeleccionId, seleccionados } = useZustandSelectionPort();
  const agregarEstadoSmart = useOpmStore((s) => s.agregarEstadoSmart);
  const descomponer = useOpmStore((s) => s.descomponerSeleccionada);
  const desplegar = useOpmStore((s) => s.desplegarSeleccionada);
  const abrirModalImagen = useOpmStore((s) => s.abrirModalImagen);
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
