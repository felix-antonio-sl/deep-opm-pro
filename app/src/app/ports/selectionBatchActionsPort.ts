import type { OpmStore } from "../../store";

export interface SelectionBatchActionsPort {
  eliminarSeleccion: OpmStore["eliminarSeleccion"];
  conectarSeleccionAlTodo: OpmStore["conectarSeleccionAlTodo"];
  traerEnlacesEntreSeleccionadas: OpmStore["traerEnlacesEntreSeleccionadas"];
  alinearSeleccion: OpmStore["alinearSeleccion"];
  distribuirSeleccion: OpmStore["distribuirSeleccion"];
  alinearSeleccionEnlaces: OpmStore["alinearSeleccionEnlaces"];
}
