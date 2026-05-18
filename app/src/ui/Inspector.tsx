import { useInspectorViewModel } from "../app/viewmodels/inspectorViewModel";
import type { ConteosModeloInspector } from "../app/viewmodels/inspectorViewModel";
import { inspectorStyles as style } from "./inspectorStyles";
import { InspectorEnlace } from "./InspectorEnlace";
import { InspectorEntidad } from "./InspectorEntidad";

/**
 * Inspector raiz: ViewContainer XOR (entidad | enlace | vacio).
 * Patron CN-DEF (auditoria IFML §6 H-6/O-7): el branch vacio muestra
 * identidad del modelo (titulo + conteos + acción primaria de
 * renombrado). aria-live="polite" anuncia transiciones de seleccion como
 * master-detail. Selecciones cruzadas con Panel OPL pasan por
 * seleccionarDesdeOpl/abrirInspectorEnlaceDesdeOpl.
 */
export function Inspector() {
  const { modo, entidad, enlace, modeloNombre, conteos, horaEditado, abrirDialogoConfiguracion } =
    useInspectorViewModel();

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
          : (
            <InspectorVacio
              modeloNombre={modeloNombre}
              conteos={conteos}
              horaEditado={horaEditado}
              onRenombrar={abrirDialogoConfiguracion}
            />
          )}
    </aside>
  );
}

interface InspectorVacioProps {
  modeloNombre: string;
  conteos: ConteosModeloInspector;
  horaEditado: string | null;
  onRenombrar: () => void;
}

function InspectorVacio({ modeloNombre, conteos, horaEditado, onRenombrar }: InspectorVacioProps) {
  const sufijoHora = horaEditado ? ` · editado ${horaEditado}` : "";
  const lineaConteos = `${conteos.objetos} ${conteos.objetos === 1 ? "objeto" : "objetos"} · ${conteos.procesos} ${conteos.procesos === 1 ? "proceso" : "procesos"} · ${conteos.opds} ${conteos.opds === 1 ? "OPD" : "OPDs"}${sufijoHora}`;
  return (
    <div style={style.vacioContainer} data-testid="inspector-vacio">
      <button
        type="button"
        data-testid="inspector-vacio-titulo"
        style={style.vacioTituloBoton}
        onClick={onRenombrar}
        title="Renombrar modelo"
      >
        {modeloNombre || "Modelo"}
      </button>
      <p style={style.vacioConteos} data-testid="inspector-vacio-conteos">
        {lineaConteos}
      </p>
      <button
        type="button"
        data-testid="inspector-vacio-renombrar"
        style={style.secondaryButton}
        onClick={onRenombrar}
      >
        Renombrar modelo
      </button>
    </div>
  );
}
