import type { Id, Modelo } from "../../modelo/tipos";

export interface ContextualActionExecutionSnapshot {
  modelo: Modelo;
  opdActivoId: Id;
  seleccionId: Id | null;
  seleccionados: Id[];
  enlaceSeleccionId: Id | null;
  copiarEstiloEnlaceAlPortapapeles: (enlaceId: Id) => void;
  pegarEstiloEnlaceDesdePortapapeles: (enlaceId: Id) => void;
  agregarEstadoSmart: () => void;
  descomponerSeleccionada: () => void;
  desplegarSeleccionada: () => void;
  quitarDescomposicionSeleccionada: () => void;
  quitarDespliegueSeleccionado: () => void;
  abrirModalImagen: (entidadId: Id) => void;
  eliminarSeleccion: () => void;
  conectarSeleccionAlTodo: (todoId: Id, tipo: "agregacion") => void;
  alinearSeleccion: (eje: "izq") => void;
  distribuirSeleccion: (orientacion: "horizontal") => void;
  abrirDialogoTraerConectados: () => void;
  traerConectadosSeleccionado: () => void;
  traerEnlacesEntreSeleccionadas: () => void;
  ocultarAparienciaSeleccionada: () => void;
}

export interface ContextualActionExecutionPort {
  snapshot: () => ContextualActionExecutionSnapshot;
}
