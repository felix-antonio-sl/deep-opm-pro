import { useOpmStore } from "../store";
import { inspectorStyles as style } from "./inspectorStyles";
import { InspectorEnlace } from "./InspectorEnlace";
import { InspectorEntidad } from "./InspectorEntidad";
import { PersistenciaJson } from "./PersistenciaJson";

export function Inspector() {
  const modelo = useOpmStore((s) => s.modelo);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const enlaceSeleccionId = useOpmStore((s) => s.enlaceSeleccionId);
  const entidad = seleccionId ? modelo.entidades[seleccionId] : undefined;
  const enlace = enlaceSeleccionId ? modelo.enlaces[enlaceSeleccionId] : undefined;

  return (
    <aside style={style.panel}>
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
      <p style={{ margin: "0 0 8px" }}>Selecciona una entidad o enlace para inspeccionar y editar sus propiedades.</p>
      <p style={{ margin: "0 0 4px", fontWeight: 700 }}>Atajos para empezar</p>
      <ul style={{ margin: 0, paddingLeft: "18px", lineHeight: 1.6 }}>
        <li>Toolbar <kbd>Objeto</kbd> o <kbd>Proceso</kbd> → inserta una cosa.</li>
        <li><kbd>Demo</kbd> → carga un modelo de ejemplo.</li>
        <li><kbd>Cargar</kbd> → abre modelos guardados.</li>
      </ul>
    </div>
  );
}
