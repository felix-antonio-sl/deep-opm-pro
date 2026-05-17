import { useOpmStore } from "../../store";
import type { SelectionBatchActionsPort } from "./selectionBatchActionsPort";

export function useZustandSelectionBatchActionsPort(): SelectionBatchActionsPort {
  const eliminarSeleccion = useOpmStore((s) => s.eliminarSeleccion);
  const conectarSeleccionAlTodo = useOpmStore((s) => s.conectarSeleccionAlTodo);
  const traerEnlacesEntreSeleccionadas = useOpmStore((s) => s.traerEnlacesEntreSeleccionadas);
  const alinearSeleccion = useOpmStore((s) => s.alinearSeleccion);
  const distribuirSeleccion = useOpmStore((s) => s.distribuirSeleccion);
  const alinearSeleccionEnlaces = useOpmStore((s) => s.alinearSeleccionEnlaces);

  return {
    eliminarSeleccion,
    conectarSeleccionAlTodo,
    traerEnlacesEntreSeleccionadas,
    alinearSeleccion,
    distribuirSeleccion,
    alinearSeleccionEnlaces,
  };
}
