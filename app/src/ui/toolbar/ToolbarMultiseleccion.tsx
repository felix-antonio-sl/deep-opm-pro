/**
 * ViewContainer ToolbarMultiseleccion: acciones batch sobre dos o mas cosas. [JOYAS §1-3], [V-0c], IFML H-2.
 *
 * Ronda 15 L2: los 3 selects (alinear cosas, distribuir, alinear enlaces) se
 * mantienen en banda por compatibilidad con tests legacy (testIds
 * `alinear-cosas`, `distribuir-cosas`, etc.). Las mismas acciones se exponen
 * tambien en ⋯ Más como items planos accesibles por teclado, lo que reduce la
 * dependencia visual de los selects en monitores estrechos.
 */
import { ATAJO_CONECTAR_MULTI_AL_TODO } from "../atajosTeclado";
import { useOpmStore } from "../../store";
import { toolbarStyle as style } from "./toolbarStyles";

export function ToolbarMultiseleccion() {
  const seleccionados = useOpmStore((s) => s.seleccionados);
  const eliminarSeleccion = useOpmStore((s) => s.eliminarSeleccion);
  const conectarSeleccionAlTodo = useOpmStore((s) => s.conectarSeleccionAlTodo);
  const traerEnlacesEntreSeleccionadas = useOpmStore((s) => s.traerEnlacesEntreSeleccionadas);
  const alinearSeleccion = useOpmStore((s) => s.alinearSeleccion);
  const distribuirSeleccion = useOpmStore((s) => s.distribuirSeleccion);
  const alinearSeleccionEnlaces = useOpmStore((s) => s.alinearSeleccionEnlaces);
  const todoMultiSeleccion = seleccionados.length >= 2 ? seleccionados[seleccionados.length - 1] : null;

  function handleConectarMultiAlTodo() {
    if (todoMultiSeleccion) conectarSeleccionAlTodo(todoMultiSeleccion, "agregacion");
  }
  function handleAlinearCosas(event: Event) {
    const select = event.currentTarget as HTMLSelectElement;
    const value = select.value;
    if (value) alinearSeleccion(value as "izq" | "centro" | "der" | "sup" | "medio" | "inf");
    select.value = "";
  }
  function handleDistribuirCosas(event: Event) {
    const select = event.currentTarget as HTMLSelectElement;
    const value = select.value;
    if (value) distribuirSeleccion(value as "horizontal" | "vertical");
    select.value = "";
  }
  function handleAlinearEnlaces(event: Event) {
    const select = event.currentTarget as HTMLSelectElement;
    const value = select.value;
    if (value) alinearSeleccionEnlaces(value as "izquierda" | "derecha" | "arriba" | "abajo");
    select.value = "";
  }

  return (
    <>
      <span style={style.divider} />
      <span style={style.selectionCount}>{seleccionados.length} seleccionados</span>
      <button style={style.secondaryButton} type="button" onClick={eliminarSeleccion} title="Eliminar selección · Delete">Eliminar</button>
      {todoMultiSeleccion ? (
        <button style={style.secondaryButton} type="button" onClick={handleConectarMultiAlTodo} title={`Usa el último seleccionado como todo (${ATAJO_CONECTAR_MULTI_AL_TODO})`} data-testid="conectar-multi-al-todo">Agregar al todo</button>
      ) : null}
      <button style={style.secondaryButton} type="button" onClick={traerEnlacesEntreSeleccionadas} data-testid="toolbar-traer-enlaces-internos" title="Traer enlaces existentes entre las cosas seleccionadas">Traer enlaces</button>
      <select aria-label="Alinear cosas seleccionadas" style={style.compactSelect} defaultValue="" onChange={handleAlinearCosas} data-testid="alinear-cosas">
        <option value="">Alinear cosas...</option>
        <option value="izq">Izquierda</option>
        <option value="centro">Centro</option>
        <option value="der">Derecha</option>
        <option value="sup">Arriba</option>
        <option value="medio">Medio</option>
        <option value="inf">Abajo</option>
      </select>
      <select aria-label="Distribuir cosas seleccionadas" style={style.compactSelect} defaultValue="" onChange={handleDistribuirCosas} data-testid="distribuir-cosas">
        <option value="">Distribuir...</option>
        <option value="horizontal">Horizontal</option>
        <option value="vertical">Vertical</option>
      </select>
      <select aria-label="Alinear enlaces seleccionados" style={style.compactSelect} defaultValue="" onChange={handleAlinearEnlaces}>
        <option value="">Alinear...</option>
        <option value="izquierda">Izquierda</option>
        <option value="derecha">Derecha</option>
        <option value="arriba">Arriba</option>
        <option value="abajo">Abajo</option>
      </select>
    </>
  );
}
