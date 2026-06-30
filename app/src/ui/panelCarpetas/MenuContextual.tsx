// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import type { Id } from "../../modelo/tipos";
import type { ResumenModeloPersistido } from "../../persistencia/modelos";
import type { CarpetaIndice } from "../../persistencia/workspace";
import { tokens } from "../tokens";

export interface MenuContextualState {
  abierto: boolean;
  tipo: "carpeta" | "modelo" | "panel" | null;
  itemId: Id | null;
  x: number;
  y: number;
}

interface MenuContextualProps {
  menu: MenuContextualState;
  carpetas: CarpetaIndice[];
  modelos: ResumenModeloPersistido[];
  carpetaActualId: Id | null;
  puedePegar: boolean;
  onCerrar: () => void;
  onIniciarRenombrar: (carpetaId: Id) => void;
  onEliminarCarpeta: (carpetaId: Id) => void;
  onCortarCarpeta?: ((carpetaId: Id) => void) | undefined;
  onCortarModelo?: ((modeloId: Id) => void) | undefined;
  onPegarEn?: ((carpetaId: Id | null) => void) | undefined;
  onAbrirModeloEnPestana?: ((modeloId: Id) => void) | undefined;
  onArchivarModelo?: ((modeloId: Id) => void) | undefined;
  onRestaurarModelo?: ((modeloId: Id) => void) | undefined;
  onToggleBiblioteca?: ((modeloId: Id) => void) | undefined;
  onToggleApunte?: ((modeloId: Id) => void) | undefined;
  onArchivarCarpeta?: ((carpetaId: Id) => void) | undefined;
  onRestaurarCarpeta?: ((carpetaId: Id) => void) | undefined;
  onAbrirVersiones?: ((modeloId: Id) => void) | undefined;
}

/**
 * Menu contextual de tiles y panel. Las acciones son props para mantener
 * PanelCarpetas libre de lecturas globales de store.
 */
export function MenuContextual(props: MenuContextualProps) {
  if (!props.menu.abierto) return null;
  const carpeta = props.carpetas.find((item) => item.id === props.menu.itemId);
  const modelo = props.modelos.find((item) => item.id === props.menu.itemId);
  return (
    <div style={{ ...style.contextMenu, left: props.menu.x, top: props.menu.y }} onMouseLeave={props.onCerrar}>
      {props.menu.tipo === "panel" && props.puedePegar ? (
        <Item onClick={() => { props.onPegarEn?.(props.carpetaActualId); props.onCerrar(); }}>Pegar aqui</Item>
      ) : null}
      {props.menu.tipo === "carpeta" && props.menu.itemId ? (
        <>
          <Item onClick={() => props.onIniciarRenombrar(props.menu.itemId!)}>Renombrar</Item>
          {props.onCortarCarpeta ? <Item onClick={() => { props.onCortarCarpeta?.(props.menu.itemId!); props.onCerrar(); }}>Cortar</Item> : null}
          {props.puedePegar ? <Item onClick={() => { props.onPegarEn?.(props.menu.itemId!); props.onCerrar(); }}>Pegar dentro</Item> : null}
          {carpeta?.archivada ? (
            <Item onClick={() => { props.onRestaurarCarpeta?.(props.menu.itemId!); props.onCerrar(); }}>Restaurar</Item>
          ) : (
            <Item onClick={() => { props.onArchivarCarpeta?.(props.menu.itemId!); props.onCerrar(); }}>Archivar carpeta</Item>
          )}
          <Item onClick={() => { props.onEliminarCarpeta(props.menu.itemId!); props.onCerrar(); }}>Eliminar</Item>
        </>
      ) : null}
      {props.menu.tipo === "modelo" && props.menu.itemId ? (
        <>
          {props.onAbrirModeloEnPestana ? <Item onClick={() => { props.onAbrirModeloEnPestana?.(props.menu.itemId!); props.onCerrar(); }}>Abrir en pestana nueva</Item> : null}
          {props.onCortarModelo ? <Item onClick={() => { props.onCortarModelo?.(props.menu.itemId!); props.onCerrar(); }}>Cortar</Item> : null}
          {props.onAbrirVersiones ? <Item onClick={() => { props.onAbrirVersiones?.(props.menu.itemId!); props.onCerrar(); }}>Versiones</Item> : null}
          {modelo?.archivado ? (
            <Item onClick={() => { props.onRestaurarModelo?.(props.menu.itemId!); props.onCerrar(); }}>Restaurar</Item>
          ) : (
            <Item onClick={() => { props.onArchivarModelo?.(props.menu.itemId!); props.onCerrar(); }}>Archivar modelo</Item>
          )}
          {props.onToggleBiblioteca ? (
            modelo?.esBiblioteca ? (
              <Item onClick={() => { props.onToggleBiblioteca?.(props.menu.itemId!); props.onCerrar(); }}>Quitar de bibliotecas</Item>
            ) : (
              <Item onClick={() => { props.onToggleBiblioteca?.(props.menu.itemId!); props.onCerrar(); }}>Marcar como biblioteca</Item>
            )
          ) : null}
          {props.onToggleApunte ? (
            // El mismo gesto marca y promociona (corrección 8): graduar = desmarcar.
            modelo?.esApunte ? (
              <Item onClick={() => { props.onToggleApunte?.(props.menu.itemId!); props.onCerrar(); }}>Graduar a modelo</Item>
            ) : (
              <Item onClick={() => { props.onToggleApunte?.(props.menu.itemId!); props.onCerrar(); }}>Marcar como apunte</Item>
            )
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function Item(props: { onClick: () => void; children: preact.ComponentChildren }) {
  return <button type="button" style={style.contextItem} onClick={props.onClick}>{props.children}</button>;
}

// Ronda 28 L3: MenuContextual Bauhaus — popover paper outline ink-15 sombra plana.
const style = {
  contextMenu: {
    position: "fixed" as const,
    zIndex: 2000,
    background: tokens.colors.paper,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    boxShadow: tokens.shadows.flat,
    padding: tokens.spacing.xs,
    display: "grid" as const,
    gap: 2,
  },
  contextItem: {
    height: "30px",
    padding: `0 ${tokens.spacing.md}px`,
    border: 0,
    borderRadius: 0,
    background: "transparent",
    color: tokens.colors.ink,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.medium,
    textAlign: "left" as const,
    transition: tokens.transitions.fast,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
