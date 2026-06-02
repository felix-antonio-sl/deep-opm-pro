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
  "marcar-requisito",
  "satisfacer-requisito",
  "editar-imagen",
  "editar-alias",
  "conectar-submodelo",
  "traer-conectados",
  "traer-conectados-default",
  "traer-enlaces",
  "razonar-afectan-a",
  "razonar-requerido-por",
  "razonar-impacto-eliminar",
  "verificar-coherencia-descomposicion",
  "quitar-descomposicion",
  "quitar-despliegue",
  "ocultar-apariencia",
];

export function ordenarAccionesMenuEntidad(acciones: readonly AccionContextual[]): AccionContextual[] {
  return [...acciones].sort((a, b) => indiceOrdenMenuEntidad(a.id) - indiceOrdenMenuEntidad(b.id));
}

export function grupoAccionMenuEntidad(id: AccionContextualId): "refinamiento" | "edicion" | "apariencia" | "enlaces" | "razonamiento" | "peligro" {
  if (id === "inzoom" || id === "unfold" || id === "conectar-submodelo") return "refinamiento";
  if (id === "agregar-estado" || id === "editar-alias" || id === "editar-imagen" || id === "marcar-requisito" || id === "satisfacer-requisito") return "edicion";
  if (id === "razonar-afectan-a" || id === "razonar-requerido-por" || id === "razonar-impacto-eliminar" || id === "verificar-coherencia-descomposicion") return "razonamiento";
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

/**
 * Estilos del MenuContextualEntidad — Ronda 28 L2 (Bauhaus monocromática).
 *
 * Misma estética que MenuPrincipal:
 *   - Borde 1.5px ink + sombra plana 8 8 0 ink-15.
 *   - Items padding 8 16, hover ink-04 (vía menus.css).
 *   - Shortcut en mono JetBrains ink-50.
 *   - Destructivo: texto cinabrio (accentDark cumple WCAG AA sobre paper).
 *   - Separator: 1px ink-15.
 */
const baseItem = {
  width: "100%",
  minHeight: "32px",
  border: 0,
  background: "transparent",
  color: tokens.colors.ink,
  textAlign: "left",
  padding: "8px 16px",
  cursor: "pointer",
  fontFamily: tokens.typography.fontFamily,
  fontSize: `${tokens.typography.sizes.base}px`,
  fontWeight: tokens.typography.weights.medium,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto",
  alignItems: "center",
  gap: "12px",
  transition: "background 150ms ease-out",
} satisfies preact.JSX.CSSProperties;

const style = {
  menu: {
    position: "fixed",
    zIndex: 45,
    width: "240px",
    padding: "6px",
    border: `1.5px solid ${tokens.colors.ink}`,
    background: tokens.colors.paper,
    // Codex L6 (S-01): cero sombras en chrome; el menú se delimita por su
    // hairline ink. La elevación la da el borde, no el offset shadow.
    boxShadow: tokens.shadows.none,
  },
  item: baseItem,
  itemDisabled: { ...baseItem, color: tokens.colors.ink30, cursor: "not-allowed", opacity: 0.6 },
  danger: { ...baseItem, color: tokens.colors.accentDark, gridTemplateColumns: "14px minmax(0, 1fr) auto", gap: "8px" },
  dangerDisabled: { ...baseItem, color: tokens.colors.ink30, cursor: "not-allowed", opacity: 0.6, gridTemplateColumns: "14px minmax(0, 1fr) auto", gap: "8px" },
  itemLabel: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  shortcut: { color: tokens.colors.ink50, fontFamily: tokens.typography.fontFamilyMono, fontSize: `${tokens.typography.sizes.xs}px`, fontWeight: tokens.typography.weights.medium, justifySelf: "end", letterSpacing: 0 },
  separator: { height: "1px", margin: "6px 0", background: tokens.colors.ink15 },
  dangerIcon: { width: "14px", height: "14px", display: "block", flex: "0 0 auto" },
} satisfies Record<string, preact.JSX.CSSProperties>;
