import { useOpmStore } from "../store";
import { inspectorStyles as style } from "./inspectorStyles";
import { InspectorEnlace } from "./InspectorEnlace";
import { InspectorEntidad } from "./InspectorEntidad";
import { PersistenciaJson } from "./PersistenciaJson";

/**
 * Inspector raiz: ViewContainer XOR (entidad | enlace | vacio).
 * Patron CN-DEF (auditoria IFML §6 H-6/O-7): el branch vacio exhibe call-to-action
 * y atajos. aria-live="polite" anuncia transiciones de seleccion como master-detail.
 * Selecciones cruzadas con Panel OPL pasan por seleccionarDesdeOpl/abrirInspectorEnlaceDesdeOpl.
 */
export function Inspector() {
  const modelo = useOpmStore((s) => s.modelo);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const enlaceSeleccionId = useOpmStore((s) => s.enlaceSeleccionId);
  const entidad = seleccionId ? modelo.entidades[seleccionId] : undefined;
  const enlace = enlaceSeleccionId ? modelo.enlaces[enlaceSeleccionId] : undefined;
  const modo: "entidad" | "enlace" | "vacio" = entidad ? "entidad" : enlace ? "enlace" : "vacio";

  return (
    <aside
      style={style.panel}
      aria-label="Inspector"
      data-testid="inspector"
      data-modo-inspector={modo}
      aria-live="polite"
    >
      {entidad
        ? <InspectorEntidad entidad={entidad} />
        : enlace
          ? <InspectorEnlace enlace={enlace} />
          : <InspectorVacio />}
      <PersistenciaJson />
    </aside>
  );
}

function InspectorVacio() {
  return (
    <div style={style.empty} data-testid="inspector-vacio">
      <p style={{ margin: "0 0 10px", fontWeight: 700 }}>Sin selección</p>
      <p style={{ margin: "0 0 8px" }}>Selecciona una cosa o un enlace en el canvas, el árbol OPD o el panel OPL para inspeccionar y editar.</p>
      <p style={{ margin: "0 0 4px", fontWeight: 700 }}>Atajos para empezar</p>
      <ul style={{ margin: 0, paddingLeft: "18px", lineHeight: 1.6 }}>
        <li>Toolbar <kbd>Objeto</kbd> o <kbd>Proceso</kbd> → inserta una cosa.</li>
        <li><kbd>Demo</kbd> → carga un modelo de ejemplo.</li>
        <li><kbd>Cargar</kbd> → abre modelos guardados.</li>
      </ul>
    </div>
  );
}
