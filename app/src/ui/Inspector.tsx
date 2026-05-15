import { useOpmStore } from "../store";
import { inspectorStyles as style } from "./inspectorStyles";
import { InspectorEnlace } from "./InspectorEnlace";
import { InspectorEntidad } from "./InspectorEntidad";

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
  const abrirImportarExportarJson = useOpmStore((s) => s.abrirDialogoImportarExportarJson);
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
          : <InspectorVacio onAbrirImportarExportarJson={abrirImportarExportarJson} />}
    </aside>
  );
}

function InspectorVacio({ onAbrirImportarExportarJson }: { onAbrirImportarExportarJson: () => void }) {
  return (
    <div style={style.vacioContainer} data-testid="inspector-vacio">
      <h3 style={style.vacioTitle}>Sin selección</h3>
      <p style={style.vacioBody}>
        Selecciona una cosa o un enlace en el canvas, el árbol OPD o el panel OPL para inspeccionar y editar.
      </p>
      <div style={style.vacioCard}>
        <p style={style.vacioCaption}>Atajos para empezar</p>
        <ul style={style.vacioList}>
          <li>Toolbar <kbd>Objeto</kbd> o <kbd>Proceso</kbd> → inserta una cosa.</li>
          <li><kbd>Demo</kbd> → carga un modelo de ejemplo.</li>
          <li><kbd>Cargar</kbd> → abre modelos guardados.</li>
        </ul>
      </div>
      <button type="button" style={style.secondaryButton} onClick={onAbrirImportarExportarJson}>
        JSON del modelo
      </button>
    </div>
  );
}
