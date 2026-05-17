import { useOpmStore } from "../../store";
import { useZustandLinkContextActionsPort } from "../ports/zustandLinkContextActionsPort";
import { useZustandSelectionBatchActionsPort } from "../ports/zustandSelectionBatchActionsPort";

export function useBarraHerramientasElementoViewModel() {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const enlaceSeleccionId = useOpmStore((s) => s.enlaceSeleccionId);
  const seleccionados = useOpmStore((s) => s.seleccionados);
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
