import type { Consulta } from "../../modelo/razonamiento";
import type { Id, Modelo } from "../../modelo/tipos";

export interface ContextualActionExecutionSnapshot {
  modelo: Modelo;
  opdActivoId: Id;
  seleccionId: Id | null;
  seleccionados: Id[];
  enlaceSeleccionId: Id | null;
  agregarEstadoSmart: () => void;
  descomponerSeleccionada: () => void;
  desplegarSeleccionada: () => void;
  quitarDescomposicionSeleccionada: () => void;
  quitarDespliegueSeleccionado: () => void;
  abrirModalImagen: (entidadId: Id) => void;
  abrirDialogoRequisito: (modo: "crear" | "marcar" | "satisfacer") => void;
  abrirDialogoSubmodelo: () => void;
  abrirDialogoComposicion: () => void;
  eliminarSeleccion: () => void;
  conectarSeleccionAlTodo: (todoId: Id, tipo: "agregacion") => void;
  alinearSeleccion: (eje: "izq") => void;
  distribuirSeleccion: (orientacion: "horizontal") => void;
  abrirDialogoTraerConectados: () => void;
  traerConectadosSeleccionado: () => void;
  traerEnlacesEntreSeleccionadas: () => void;
  ocultarAparienciaSeleccionada: () => void;
  consultarRazonamiento: (consulta: Consulta) => void;
  verificarCoherenciaDescomposicion: () => void;
}

export interface ContextualActionExecutionPort {
  snapshot: () => ContextualActionExecutionSnapshot;
}
