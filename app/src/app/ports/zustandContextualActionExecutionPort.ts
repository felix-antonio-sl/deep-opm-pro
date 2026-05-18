import { store } from "../../store";
import type { OpmStore } from "../../store";
import type { ContextualActionExecutionPort, ContextualActionExecutionSnapshot } from "./contextualActionExecutionPort";

export function crearZustandContextualActionExecutionPort(): ContextualActionExecutionPort {
  return {
    snapshot: () => snapshotContextualActionExecution(store.getState()),
  };
}

function snapshotContextualActionExecution(state: OpmStore): ContextualActionExecutionSnapshot {
  return {
    modelo: state.modelo,
    opdActivoId: state.opdActivoId,
    seleccionId: state.seleccionId,
    seleccionados: state.seleccionados,
    enlaceSeleccionId: state.enlaceSeleccionId,
    copiarEstiloEnlaceAlPortapapeles: state.copiarEstiloEnlaceAlPortapapeles,
    pegarEstiloEnlaceDesdePortapapeles: state.pegarEstiloEnlaceDesdePortapapeles,
    agregarEstadoSmart: state.agregarEstadoSmart,
    descomponerSeleccionada: state.descomponerSeleccionada,
    desplegarSeleccionada: state.desplegarSeleccionada,
    quitarDescomposicionSeleccionada: state.quitarDescomposicionSeleccionada,
    quitarDespliegueSeleccionado: state.quitarDespliegueSeleccionado,
    abrirModalImagen: state.abrirModalImagen,
    eliminarSeleccion: state.eliminarSeleccion,
    conectarSeleccionAlTodo: state.conectarSeleccionAlTodo,
    alinearSeleccion: state.alinearSeleccion,
    distribuirSeleccion: state.distribuirSeleccion,
    abrirDialogoTraerConectados: state.abrirDialogoTraerConectados,
    traerConectadosSeleccionado: state.traerConectadosSeleccionado,
    traerEnlacesEntreSeleccionadas: state.traerEnlacesEntreSeleccionadas,
    ocultarAparienciaSeleccionada: state.ocultarAparienciaSeleccionada,
  };
}
