import { useInspectorViewModel } from "../app/viewmodels/inspectorViewModel";
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
  const { modo, entidad, enlace, estado, modeloNombre, horaEditado, abrirDialogoConfiguracion } =
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
                horaEditado={horaEditado}
                onRenombrar={abrirDialogoConfiguracion}
              />
            )}
    </aside>
  );
}

interface InspectorVacioProps {
  modeloNombre: string;
  horaEditado: string | null;
  onRenombrar: () => void;
}

/**
 * Rama vacía del Inspector. Codex v2 / L3: se retiraron los contadores
 * «N objetos · N procesos · N OPDs» — el inventario del modelo pertenece al
 * footer de diagnóstico, no al Inspector, que es un panel de detalle de la
 * selección. En su lugar, un placeholder editorial italic invita a
 * seleccionar un elemento. Se conserva el título del modelo (renombrable) y
 * el sello de última edición como anclaje de identidad.
 */
function InspectorVacio({ modeloNombre, horaEditado, onRenombrar }: InspectorVacioProps) {
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
      <p style={style.vacioPlaceholder} data-testid="inspector-vacio-placeholder">
        Selecciona un objeto, proceso o enlace para ver y editar sus propiedades aquí.
      </p>
      {horaEditado ? (
        <p style={style.vacioMeta} data-testid="inspector-vacio-meta">
          {`Editado ${horaEditado}`}
        </p>
      ) : null}
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
