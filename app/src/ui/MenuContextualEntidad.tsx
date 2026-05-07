import deleteIcon from "../../../assets/svg/delete.svg";
import type { Id } from "../modelo/tipos";

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
  x: number;
  y: number;
  multi: boolean;
  onCerrar: () => void;
  onTraer: (aparienciaId: Id) => void;
  onTraerDefault: (aparienciaId: Id) => void;
  onTraerEnlaces: () => void;
  onOcultar: (aparienciaId: Id) => void;
}

export function MenuContextualEntidad(props: Props) {
  return (
    <div style={{ ...style.menu, left: props.x, top: props.y }} role="menu" data-testid="menu-contextual-entidad">
      <button type="button" role="menuitem" style={style.item} onClick={() => props.onTraer(props.aparienciaId)}>Traer conectados...</button>
      <button type="button" role="menuitem" style={style.item} onClick={() => props.onTraerDefault(props.aparienciaId)}>Traer conectados</button>
      {props.multi ? (
        <button type="button" role="menuitem" style={style.item} onClick={props.onTraerEnlaces}>Traer enlaces entre seleccionadas</button>
      ) : null}
      <button
        type="button"
        role="menuitem"
        style={style.danger}
        title="Ocultar del OPD actual; no borra la entidad del modelo"
        onClick={() => props.onOcultar(props.aparienciaId)}
      >
        <img src={deleteIcon} alt="" aria-hidden="true" style={style.dangerIcon} />
        Ocultar de este OPD
      </button>
    </div>
  );
}

const baseItem = {
  width: "100%",
  height: "30px",
  border: 0,
  background: "transparent",
  color: "#1f2937",
  textAlign: "left",
  padding: "0 10px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 600,
} satisfies preact.JSX.CSSProperties;

const style = {
  menu: {
    position: "fixed",
    zIndex: 45,
    width: "236px",
    padding: "6px",
    border: "1px solid #c8d2df",
    borderRadius: "6px",
    background: "#ffffff",
    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.18)",
  },
  item: baseItem,
  danger: { ...baseItem, color: "#b42318", display: "inline-flex", alignItems: "center", gap: "8px" },
  dangerIcon: { width: "14px", height: "14px", display: "block", flex: "0 0 auto" },
} satisfies Record<string, preact.JSX.CSSProperties>;
