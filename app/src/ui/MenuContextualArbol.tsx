// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import deleteIcon from "../../../assets/svg/delete.svg";
import type { Id, Modelo } from "../modelo/tipos";
import { tokens } from "./tokens";

/**
 * Menú contextual del árbol OPD.
 * Asset: assets/svg/delete.svg para ítem destructivo "Eliminar OPD" [JOYAS §2].
 */

export interface MenuContextualArbolProps {
  modelo: Modelo;
  opdId: Id;
  posicion: { x: number; y: number };
  nombresVisibles: boolean;
  opdCortadoId: Id | null;
  onCerrar: () => void;
  onRenombrar: (opdId: Id) => void;
  onEliminar: (opdId: Id) => void;
  onCortar: (opdId: Id) => void;
  onPegar: (targetId: Id) => void;
  onReordenar: (opdId: Id, direccion: "arriba" | "abajo") => void;
  onOrdenAutomatico: () => void;
  onToggleNombres: () => void;
  onExpandirTodo: () => void;
  onColapsarTodo: () => void;
  onBuscar: () => void;
  onIrPadre: (opdId: Id) => void;
  onIrPrimerHijo: (opdId: Id) => void;
  /** Taller (R-OPD-REF-20): el OPD es un suelto adoptable (`esOpdSuelto`). */
  esSuelto?: boolean;
  onAdoptarComoDescomposicion?: (opdId: Id) => void;
  onAdoptarComoDespliegue?: (opdId: Id) => void;
}

export function MenuContextualArbol(props: MenuContextualArbolProps) {
  const opd = props.modelo.opds[props.opdId];
  if (!opd) return null;
  const esRaiz = props.opdId === props.modelo.opdRaizId;
  const tieneHijos = Object.values(props.modelo.opds).some((item) => item.padreId === props.opdId);
  const tienePadre = !!opd.padreId && !!props.modelo.opds[opd.padreId];
  const puedePegarComoReorden = !!props.opdCortadoId
    && props.opdCortadoId !== props.opdId
    && props.modelo.opds[props.opdCortadoId]?.padreId === props.opdId;

  return (
    <div
      role="menu"
      aria-label={`Menú contextual ${opd.nombre}`}
      data-testid="menu-contextual-arbol"
      style={{
        ...style.menu,
        left: props.posicion.x,
        top: props.posicion.y,
      }}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        if (event.key === "Escape") props.onCerrar();
      }}
      tabIndex={-1}
    >
      {props.esSuelto ? (
        <>
          <Item
            label="Adoptar como descomposición"
            testId="menu-adoptar-descomposicion"
            onClick={() => props.onAdoptarComoDescomposicion?.(props.opdId)}
          />
          <Item
            label="Adoptar como despliegue"
            testId="menu-adoptar-despliegue"
            onClick={() => props.onAdoptarComoDespliegue?.(props.opdId)}
          />
          <div aria-hidden="true" style={style.divider} />
        </>
      ) : null}
      <Item label="Renombrar" onClick={() => props.onRenombrar(props.opdId)} />
      <Item label="Eliminar OPD" iconUrl={deleteIcon} disabled={esRaiz || tieneHijos} onClick={() => props.onEliminar(props.opdId)} />
      <div aria-hidden="true" style={style.divider} />
      <Item label="Cortar nodo" disabled={esRaiz} onClick={() => props.onCortar(props.opdId)} />
      <Item label="Pegar al final de sus hijos" disabled={!puedePegarComoReorden} onClick={() => props.onPegar(props.opdId)} />
      <div aria-hidden="true" style={style.divider} />
      <Item label="Reordenar: subir" disabled={esRaiz} onClick={() => props.onReordenar(props.opdId, "arriba")} />
      <Item label="Reordenar: bajar" disabled={esRaiz} onClick={() => props.onReordenar(props.opdId, "abajo")} />
      <Item label="Alinear según canvas" onClick={props.onOrdenAutomatico} />
      <div aria-hidden="true" style={style.divider} />
      <Item label={props.nombresVisibles ? "Ocultar nombres" : "Mostrar nombres"} onClick={props.onToggleNombres} />
      <Item label="Expandir todo" onClick={props.onExpandirTodo} />
      <Item label="Colapsar todo" onClick={props.onColapsarTodo} />
      <Item label="Buscar OPD" onClick={props.onBuscar} />
      <div aria-hidden="true" style={style.divider} />
      <Item label="Ir al OPD padre" disabled={!tienePadre} onClick={() => props.onIrPadre(props.opdId)} />
      <Item label="Ir al primer hijo" disabled={!tieneHijos} onClick={() => props.onIrPrimerHijo(props.opdId)} />
    </div>
  );
}

function Item({ label, disabled, onClick, iconUrl, testId }: { label: string; disabled?: boolean; onClick: () => void; iconUrl?: string; testId?: string }) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      data-testid={testId}
      style={disabled ? style.itemDisabled : iconUrl ? style.itemIcon : style.item}
      onClick={() => {
        if (!disabled) onClick();
      }}
    >
      {iconUrl ? <img src={iconUrl} alt="" aria-hidden="true" style={style.itemIconImg} /> : null}
      {label}
    </button>
  );
}

/**
 * Estilos del MenuContextualArbol — Ronda 28 L2 (Bauhaus monocromática).
 * Misma silueta que MenuPrincipal y MenuContextualEntidad.
 */
const style = {
  menu: {
    position: "fixed",
    zIndex: 1200,
    width: "224px",
    padding: "6px",
    border: `1.5px solid ${tokens.colors.ink}`,
    background: tokens.colors.paper,
    // Codex L6 (S-01): cero sombras en chrome; el menú se delimita solo por
    // su hairline ink. La elevación la da el borde, no el offset shadow.
    boxShadow: tokens.shadows.none,
    display: "grid",
    gap: "0",
  },
  item: {
    width: "100%",
    minHeight: "32px",
    padding: "8px 16px",
    border: "1px solid transparent",
    background: "transparent",
    color: tokens.colors.ink,
    cursor: "pointer",
    fontFamily: tokens.typography.fontFamily,
    fontSize: `${tokens.typography.sizes.base}px`,
    fontWeight: tokens.typography.weights.medium,
    textAlign: "left",
    transition: "background 150ms ease-out",
  },
  itemDisabled: {
    width: "100%",
    minHeight: "32px",
    padding: "8px 16px",
    border: "1px solid transparent",
    background: "transparent",
    color: tokens.colors.ink30,
    cursor: "not-allowed",
    fontFamily: tokens.typography.fontFamily,
    fontSize: `${tokens.typography.sizes.base}px`,
    fontWeight: tokens.typography.weights.medium,
    textAlign: "left",
  },
  itemIcon: {
    width: "100%",
    minHeight: "32px",
    padding: "8px 16px",
    border: "1px solid transparent",
    background: "transparent",
    color: tokens.colors.accentDark,
    cursor: "pointer",
    fontFamily: tokens.typography.fontFamily,
    fontSize: `${tokens.typography.sizes.base}px`,
    fontWeight: tokens.typography.weights.medium,
    textAlign: "left",
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
  },
  itemIconImg: { width: "14px", height: "14px", display: "block", flex: "0 0 auto" },
  divider: {
    height: "1px",
    margin: "6px 0",
    background: tokens.colors.ink15,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
