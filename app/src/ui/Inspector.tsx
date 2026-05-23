import { useInspectorViewModel } from "../app/viewmodels/inspectorViewModel";
import type { ConteosModeloInspector } from "../app/viewmodels/inspectorViewModel";
import { inspectorStyles as style } from "./inspectorStyles";
import { InspectorEnlace } from "./InspectorEnlace";
import { InspectorEntidad } from "./InspectorEntidad";
import { InspectorEstado } from "./inspector/InspectorEstado";

/**
 * Inspector raiz: ViewContainer XOR (estado | entidad | enlace | vacio).
 * Patron CN-DEF (auditoria IFML §6 H-6/O-7): el branch vacio muestra
 * identidad del modelo (titulo + conteos + acción primaria de
 * renombrado). aria-live="polite" anuncia transiciones de seleccion como
 * master-detail. Selecciones cruzadas con Panel OPL pasan por
 * seleccionarDesdeOpl/abrirInspectorEnlaceDesdeOpl.
 *
 * Pattern-match natural sobre los tres campos exclusivos del coproducto
 * (paquete "Estados ciudadanos de primera clase", 2026-05-23). El sello
 * del invariante garantiza que al menos dos de `{seleccionId, enlaceSeleccionId,
 * estadoSeleccionId}` son null simultáneamente; el orden estado→entidad→enlace
 * es seguro porque sólo uno puede ser no-null.
 *
 * Spec: docs/superpowers/specs/2026-05-23-estados-ciudadania-primera-clase-design.md §4.4.
 */
export function Inspector() {
  const { modo, entidad, enlace, estado, modeloNombre, conteos, horaEditado, abrirDialogoConfiguracion } =
    useInspectorViewModel();

  return (
    <aside
      style={style.panel}
      aria-label="Inspector"
      data-testid="inspector"
      data-modo-inspector={modo}
      aria-live="polite"
    >
      {estado
        ? <InspectorEstado estado={estado} />
        : entidad
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
