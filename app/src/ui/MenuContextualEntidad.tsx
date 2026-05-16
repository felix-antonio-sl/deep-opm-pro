// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import deleteIcon from "../../../assets/svg/delete.svg";
import type { Entidad, Id } from "../modelo/tipos";
import {
  accionesContextualesEntidad,
  accionesParaSuperficie,
  type AccionContextual,
  type AccionContextualId,
} from "../store/acciones-contextuales";
import { tokens } from "./tokens";

/**
 * Menu contextual de apariencia de entidad.
 *
 * SSOT: [Met §multi-OPD] una accion sobre apariencia afecta solo el OPD
 * activo; [Glos 3.6] apariencia separada de la entidad logical; [JOYAS §2]
 * mantiene la semantica visual OPCloud sin redibujar shapes.
 * Asset: assets/svg/delete.svg (ítem destructivo).
 */

interface Props {
  aparienciaId: Id;
  entidad: Entidad | null;
  enlaceEstiloId: Id | null;
  hayEstiloEnPortapapeles: boolean;
  inspectorAbierto: boolean;
  x: number;
  y: number;
  multi: boolean;
  onCerrar: () => void;
  onAccion: (accionId: AccionContextualId) => void;
}

export function MenuContextualEntidad(props: Props) {
  const acciones = ordenarAccionesMenuEntidad(
    accionesParaSuperficie(
      accionesContextualesEntidad({
        entidad: props.entidad,
        enlaceEstiloId: props.enlaceEstiloId,
        hayEstiloEnPortapapeles: props.hayEstiloEnPortapapeles,
        inspectorAbierto: props.inspectorAbierto,
        multi: props.multi,
      }),
      "menu-contextual",
    ),
  );

  return (
    <div
      style={{ ...style.menu, left: props.x, top: props.y }}
      role="menu"
      aria-label={props.entidad ? `Acciones de ${props.entidad.nombre}` : "Acciones de apariencia"}
      data-apariencia-id={props.aparienciaId}
      data-testid="menu-contextual-entidad"
    >
      {acciones.flatMap((accion, index) => {
        const anterior = acciones[index - 1];
        const separador = anterior && grupoAccionMenuEntidad(anterior.id) !== grupoAccionMenuEntidad(accion.id);
        return [
          separador ? <div key={`${accion.id}-separador`} role="separator" style={style.separator} /> : null,
          <button
            key={accion.id}
            type="button"
            role="menuitem"
            aria-keyshortcuts={accion.atajo}
            data-testid={accion.testId}
            disabled={!accion.enabled}
            style={estiloItem(accion)}
            title={accion.label}
            onClick={(event) => {
              event.stopPropagation();
              if (!accion.enabled) return;
              props.onAccion(accion.id);
              props.onCerrar();
            }}
          >
            {accion.destructiva ? <img src={deleteIcon} alt="" aria-hidden="true" style={style.dangerIcon} /> : null}
            <span style={style.itemLabel}>{accion.label}</span>
            {accion.atajo ? <span style={style.shortcut}>{accion.atajo}</span> : null}
          </button>,
        ];
      })}
    </div>
  );
}

const ORDEN_MENU_ENTIDAD: readonly AccionContextualId[] = [
  "inzoom",
  "unfold",
  "agregar-estado",
  "editar-imagen",
  "editar-alias",
  "copiar-estilo",
  "pegar-estilo",
  "traer-conectados",
  "traer-conectados-default",
  "traer-enlaces",
  "quitar-descomposicion",
  "quitar-despliegue",
  "ocultar-apariencia",
];

export function ordenarAccionesMenuEntidad(acciones: readonly AccionContextual[]): AccionContextual[] {
  return [...acciones].sort((a, b) => indiceOrdenMenuEntidad(a.id) - indiceOrdenMenuEntidad(b.id));
}

export function grupoAccionMenuEntidad(id: AccionContextualId): "refinamiento" | "edicion" | "apariencia" | "enlaces" | "peligro" {
  if (id === "inzoom" || id === "unfold") return "refinamiento";
  if (id === "agregar-estado" || id === "editar-alias" || id === "editar-imagen") return "edicion";
  if (id === "copiar-estilo" || id === "pegar-estilo") return "apariencia";
  if (id === "ocultar-apariencia" || id === "quitar-descomposicion" || id === "quitar-despliegue") return "peligro";
  return "enlaces";
}

function indiceOrdenMenuEntidad(id: AccionContextualId): number {
  const indice = ORDEN_MENU_ENTIDAD.indexOf(id);
  return indice === -1 ? Number.MAX_SAFE_INTEGER : indice;
}

function estiloItem(accion: AccionContextual): preact.JSX.CSSProperties {
  if (accion.destructiva) return accion.enabled ? style.danger : style.dangerDisabled;
  return accion.enabled ? style.item : style.itemDisabled;
}

const baseItem = {
  width: "100%",
  height: "30px",
  border: 0,
  background: "transparent",
  color: tokens.colors.textoPrimario,
  textAlign: "left",
  padding: "0 10px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 600,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto",
  alignItems: "center",
  gap: "12px",
} satisfies preact.JSX.CSSProperties;

const style = {
  menu: {
    position: "fixed",
    zIndex: 45,
    width: "236px",
    padding: "6px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.md,
    background: tokens.colors.fondoChrome,
    boxShadow: tokens.shadows.menuContextual,
  },
  item: baseItem,
  itemDisabled: { ...baseItem, color: tokens.colors.textoTerciario, cursor: "not-allowed", opacity: 0.58 },
  danger: { ...baseItem, color: tokens.colors.errorTexto, gridTemplateColumns: "14px minmax(0, 1fr) auto", gap: "8px" },
  dangerDisabled: { ...baseItem, color: tokens.colors.textoTerciario, cursor: "not-allowed", opacity: 0.58, gridTemplateColumns: "14px minmax(0, 1fr) auto", gap: "8px" },
  itemLabel: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  shortcut: { color: tokens.colors.textoTerciario, fontSize: "11px", fontWeight: 600, justifySelf: "end" },
  separator: { height: "1px", margin: "5px 4px", background: tokens.colors.bordeSuave },
  dangerIcon: { width: "14px", height: "14px", display: "block", flex: "0 0 auto" },
} satisfies Record<string, preact.JSX.CSSProperties>;
