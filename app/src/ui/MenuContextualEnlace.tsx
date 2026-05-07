// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import type { Id, TipoEnlace } from "../modelo/tipos";
import { tokens } from "./tokens";

interface Props {
  enlaceId: Id;
  x: number;
  y: number;
  onCerrar: () => void;
  onEstilo: (enlaceId: Id) => void;
  onCopiarEstilo: (enlaceId: Id) => void;
  onPegarEstilo: (enlaceId: Id) => void;
  onEliminar: (enlaceId: Id) => void;
  onConectarMultiAlTodo?: ((tipo: TipoEnlace) => void) | undefined;
}

/**
 * Menú contextual de enlace. HU-11.007 agrega el gesto multi-al-todo sobre
 * una acción existente del store; OPL-ES conserva RF1 como N oraciones.
 */
export function MenuContextualEnlace(props: Props) {
  return (
    <div style={{ ...style.menu, left: props.x, top: props.y }} role="menu" data-testid="menu-contextual-enlace">
      <button type="button" role="menuitem" style={style.item} onClick={() => props.onEstilo(props.enlaceId)}>Estilo</button>
      <button type="button" role="menuitem" style={style.item} onClick={() => props.onCopiarEstilo(props.enlaceId)}>Copiar estilo</button>
      <button type="button" role="menuitem" style={style.item} onClick={() => props.onPegarEstilo(props.enlaceId)}>Pegar estilo</button>
      <button
        type="button"
        role="menuitem"
        style={props.onConectarMultiAlTodo ? style.item : style.disabled}
        disabled={!props.onConectarMultiAlTodo}
        onClick={() => props.onConectarMultiAlTodo?.("agregacion")}
      >
        Conectar multi al todo
      </button>
      <button type="button" role="menuitem" style={style.item} onClick={props.onCerrar}>Multiplicidad</button>
      <button type="button" role="menuitem" style={style.item} onClick={props.onCerrar}>Modificador</button>
      <button type="button" role="menuitem" style={style.item} onClick={props.onCerrar}>Reanclar</button>
      <button type="button" role="menuitem" style={style.danger} onClick={() => props.onEliminar(props.enlaceId)}>Eliminar</button>
    </div>
  );
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
} satisfies preact.JSX.CSSProperties;

const style = {
  menu: {
    position: "fixed",
    zIndex: 45,
    width: "170px",
    padding: "6px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.md,
    background: tokens.colors.fondoChrome,
    boxShadow: tokens.shadows.menuContextual,
  },
  item: baseItem,
  disabled: { ...baseItem, color: tokens.colors.textoDeshabilitado, cursor: "default" },
  danger: { ...baseItem, color: tokens.colors.errorTexto },
} satisfies Record<string, preact.JSX.CSSProperties>;
