import { useInspectorViewModel, type InspectorViewModel } from "../app/viewmodels/inspectorViewModel";
import { useOpmStore } from "../store";
import { inspectorStyles as style } from "./inspectorStyles";
import { InspectorEnlace } from "./InspectorEnlace";
import { InspectorEntidad } from "./InspectorEntidad";
import { InspectorEstado } from "./inspector/InspectorEstado";
import { SeccionAnclas } from "./inspector/SeccionAnclas";
import { SeccionDisclosure } from "./inspector/SeccionDisclosure";
import { SeccionNotasMesa } from "./inspector/SeccionNotasMesa";
import { SeccionRegistroRatificar } from "./inspector/SeccionRegistroRatificar";

/**
 * Inspector raiz: ViewContainer XOR (estado | entidad | enlace | vacio).
 * El branch vacio es sólo una indicación editorial de selección; la identidad
 * del modelo y el renombrado viven en el header/palette. aria-live="polite"
 * anuncia transiciones de seleccion como master-detail. Selecciones cruzadas
 * con Panel OPL pasan por
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
  const { modo, entidad, enlace, estado, procedencia } = useInspectorViewModel();

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
              <InspectorVacio procedencia={procedencia} />
            )}
    </aside>
  );
}

/**
 * Rama vacía del Inspector. Codex v1.1 post-audit: sólo placeholder italic;
 * el renombrado vive en command palette → MODELO. W6.6: cuando el modelo porta
 * sello de procedencia (emitido por el compilador de autoría), la rama vacía
 * es el panel modelo-nivel que lo muestra — con advertencia de divergencia si
 * el modelo fue editado en la app (reporta, no degrada).
 */
function InspectorVacio(props: { procedencia: InspectorViewModel["procedencia"] }) {
  return (
    <div style={style.vacioContainer} data-testid="inspector-vacio">
      <p style={style.vacioPlaceholder} data-testid="inspector-vacio-placeholder">
        Selecciona un elemento.
      </p>
      {props.procedencia ? (
        <div data-testid="inspector-procedencia">
          <p style={style.vacioMeta} title={props.procedencia.nota}>
            Procedencia · proto <code>{props.procedencia.sello.protoHash}</code>
            {" · autoría v"}{props.procedencia.sello.autoriaVersion}
            {" · layout v"}{props.procedencia.sello.layoutVersion}
          </p>
          {props.procedencia.advertencia ? (
            <p style={style.vacioMeta} data-testid="inspector-procedencia-divergencia">
              ⚠ {props.procedencia.advertencia}
            </p>
          ) : null}
        </div>
      ) : null}
      {/* W6.5-b: registro [RATIFICAR] (C1) — solo visible si hay pendientes. */}
      <SeccionRegistroRatificar />
      {/* W6.4: anclas modelo-nivel y del OPD activo — solo visibles si existen. */}
      <SeccionAnclas target={{ tipo: "modelo" }} titulo="Anclas del modelo" />
      <SeccionAnclasOpdActivo />
      {/* C′·A (m-6): la rama vacía era «Selecciona un elemento.» + editor de Notas
          incondicional (método sin contexto). La nota de modelo baja a un disclosure
          cerrado: se puede crear, pero no grita. Ratificar y anclas ya se auto-gatean. */}
      <SeccionDisclosure titulo="Nota del modelo" colapsoId="modelo.notas">
        <SeccionNotasMesa target={{ tipo: "modelo" }} />
      </SeccionDisclosure>
    </div>
  );
}

/** W6.4: anclas del OPD activo en la rama vacía (los OPDs no se seleccionan en canvas). */
function SeccionAnclasOpdActivo() {
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  return <SeccionAnclas target={{ tipo: "opd", id: opdActivoId }} titulo="Anclas del OPD" />;
}
