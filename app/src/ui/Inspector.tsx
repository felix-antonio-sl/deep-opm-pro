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
          : <div style={style.empty}>Sin selección</div>}
      <PersistenciaJson />
    </aside>
  );
}
