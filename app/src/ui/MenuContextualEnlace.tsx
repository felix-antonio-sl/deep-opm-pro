// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import type { Id, TipoEnlace } from "../modelo/tipos";
import { tokens } from "./tokens";

interface Props {
  enlaceId: Id;
  x: number;
  y: number;
  onCerrar: () => void;
  onPropiedades: (enlaceId: Id) => void;
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
      <button type="button" role="menuitem" style={style.item} onClick={() => props.onPropiedades(props.enlaceId)}>Propiedades</button>
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

/**
 * Estilos del MenuContextualEnlace — Ronda 28 L2 (Bauhaus monocromática).
 * Misma silueta plana que el resto de los menús contextuales.
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
  transition: "background 150ms ease-out",
} satisfies preact.JSX.CSSProperties;

const style = {
  menu: {
    position: "fixed",
    zIndex: 45,
    width: "180px",
    padding: "6px",
    border: `1.5px solid ${tokens.colors.ink}`,
    background: tokens.colors.paper,
    // Codex L6 (S-01): cero sombras en chrome; el menú se delimita por su
    // hairline ink. La elevación la da el borde, no el offset shadow.
    boxShadow: tokens.shadows.none,
  },
  item: baseItem,
  disabled: { ...baseItem, color: tokens.colors.ink30, cursor: "default", opacity: 0.6 },
  danger: { ...baseItem, color: tokens.colors.accentDark },
} satisfies Record<string, preact.JSX.CSSProperties>;
