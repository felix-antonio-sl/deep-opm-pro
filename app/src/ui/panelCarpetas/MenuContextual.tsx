import type { Id } from "../../modelo/tipos";
import type { ResumenModeloPersistido } from "../../persistencia/local";
import type { CarpetaIndice } from "../../persistencia/workspace";

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
        </>
      ) : null}
    </div>
  );
}

function Item(props: { onClick: () => void; children: preact.ComponentChildren }) {
  return <button type="button" style={style.contextItem} onClick={props.onClick}>{props.children}</button>;
}

const style = {
  contextMenu: {
    position: "fixed",
    zIndex: 2000,
    background: "#ffffff",
    border: "1px solid #c8d2df",
    borderRadius: "6px",
    boxShadow: "0 8px 24px rgba(16, 24, 40, 0.18)",
    padding: "4px",
    display: "grid",
    gap: "2px",
  },
  contextItem: {
    height: "30px",
    padding: "0 12px",
    border: "1px solid transparent",
    borderRadius: "4px",
    background: "transparent",
    color: "#1f2937",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    textAlign: "left",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
