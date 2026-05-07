// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import folderIcon from "../../../../assets/svg/folder.svg";
import regFileIcon from "../../../../assets/svg/regFile.svg";
import autosaveIcon from "../../../../assets/svg/autosave.svg";
import verFileIcon from "../../../../assets/svg/verFile.svg";
import type { Id } from "../../modelo/tipos";
import type { ResumenModeloPersistido } from "../../persistencia/local";
import type { CarpetaIndice } from "../../persistencia/workspace";
import { tokens } from "../tokens";

export type TileData =
  | { tipo: "carpeta"; carpeta: CarpetaIndice }
  | { tipo: "modelo"; modelo: ResumenModeloPersistido };

interface TileProps {
  item: TileData;
  vista: "tiles" | "lista";
  modoOperacion: "carga" | "selector";
  renombrandoId: Id | null;
  nombreRenombrar: string;
  mostrarVersiones?: boolean | undefined;
  dropActivo?: boolean;
  onNombreRenombrarChange: (nombre: string) => void;
  onConfirmarRenombrar: () => void;
  onCancelarRenombrar: () => void;
  onAbrirCarpeta: (carpetaId: Id) => void;
  onAbrirModelo: (modeloId: Id) => void;
  onDragStart: (event: DragEvent, item: TileData) => void;
  onDragOverCarpeta: (event: DragEvent, carpetaId: Id) => void;
  onDragLeave: () => void;
  onDropCarpeta: (event: DragEvent, carpetaId: Id) => void;
  onContextMenu: (event: MouseEvent, tipo: "carpeta" | "modelo", itemId: Id) => void;
}

/**
 * Render de item de carpeta/modelo en vista tiles o lista.
 */
export function Tile(props: TileProps) {
  return props.vista === "lista" ? <FilaItem {...props} /> : <TileItem {...props} />;
}

function FilaItem(props: TileProps) {
  const id = itemId(props.item);
  const archivado = props.item.tipo === "carpeta" ? props.item.carpeta.archivada : props.item.modelo.archivado;
  return (
    <tr
      style={{ ...style.fila, ...(archivado ? style.filaArchivada : {}), ...(props.dropActivo ? style.dropActivo : {}) }}
      draggable
      onDragStart={(event) => props.onDragStart(event as unknown as DragEvent, props.item)}
      onDragOver={props.item.tipo === "carpeta" ? (event) => props.onDragOverCarpeta(event as unknown as DragEvent, id) : undefined}
      onDragLeave={props.item.tipo === "carpeta" ? props.onDragLeave : undefined}
      onDrop={props.item.tipo === "carpeta" ? (event) => props.onDropCarpeta(event as unknown as DragEvent, id) : undefined}
      onDblClick={() => props.item.tipo === "carpeta" ? props.onAbrirCarpeta(id) : props.onAbrirModelo(id)}
      onClick={() => {
        if (props.item.tipo === "modelo" && props.modoOperacion === "carga") props.onAbrirModelo(id);
      }}
      onContextMenu={(event) => props.onContextMenu(event as unknown as MouseEvent, props.item.tipo, id)}
    >
      <td style={style.td}>
        <img src={props.item.tipo === "carpeta" ? folderIcon : regFileIcon} alt="" style={style.tableIcon} />
        {props.item.tipo === "carpeta" ? renderNombreCarpeta(props) : <span style={style.tdName}>{props.item.modelo.nombre}</span>}
        {props.item.tipo === "modelo" ? <GlifosModelo modelo={props.item.modelo} mostrarVersiones={props.mostrarVersiones} /> : null}
        {archivado ? <span style={style.archiveBadge}>ARCH</span> : null}
      </td>
      <td style={style.td}>{props.item.tipo === "carpeta" ? "Carpeta" : "Modelo"}</td>
      <td style={style.td}>{props.item.tipo === "modelo" ? new Date(props.item.modelo.actualizadoEn).toLocaleString("es-CL") : "—"}</td>
    </tr>
  );
}

function TileItem(props: TileProps) {
  const id = itemId(props.item);
  const archivado = props.item.tipo === "carpeta" ? props.item.carpeta.archivada : props.item.modelo.archivado;
  return (
    <button
      type="button"
      style={{ ...style.tile, ...(archivado ? style.tileArchivado : {}), ...(props.dropActivo ? style.tileDrop : {}) }}
      draggable
      onDragStart={(event) => props.onDragStart(event as unknown as DragEvent, props.item)}
      onDragOver={props.item.tipo === "carpeta" ? (event) => props.onDragOverCarpeta(event as unknown as DragEvent, id) : undefined}
      onDragLeave={props.item.tipo === "carpeta" ? props.onDragLeave : undefined}
      onDrop={props.item.tipo === "carpeta" ? (event) => props.onDropCarpeta(event as unknown as DragEvent, id) : undefined}
      onClick={() => {
        if (props.item.tipo === "modelo" && props.modoOperacion === "carga") props.onAbrirModelo(id);
      }}
      onDblClick={() => props.item.tipo === "carpeta" ? props.onAbrirCarpeta(id) : props.onAbrirModelo(id)}
      onContextMenu={(event) => props.onContextMenu(event as unknown as MouseEvent, props.item.tipo, id)}
      title={props.item.tipo === "carpeta" ? props.item.carpeta.nombre : props.item.modelo.nombre}
    >
      <img src={props.item.tipo === "carpeta" ? folderIcon : regFileIcon} alt="" style={style.tileIcon} />
      {props.item.tipo === "carpeta" ? renderNombreCarpeta(props) : <span style={style.tileName}>{props.item.modelo.nombre}</span>}
      {props.item.tipo === "modelo" && props.item.modelo.descripcion ? <span style={style.tileDesc}>{props.item.modelo.descripcion}</span> : null}
      <span style={props.item.tipo === "carpeta" ? style.tileType : style.tileDate}>
        {props.item.tipo === "carpeta" ? <>Carpeta {archivado ? <span style={style.archiveBadge}>ARCH</span> : null}</> : new Date(props.item.modelo.actualizadoEn).toLocaleString("es-CL")}
      </span>
      {props.item.tipo === "modelo" ? <GlifosModelo modelo={props.item.modelo} mostrarVersiones={props.mostrarVersiones} /> : null}
      {props.item.tipo === "modelo" && archivado ? <span style={style.archiveBadge}>ARCH</span> : null}
    </button>
  );
}

function renderNombreCarpeta(props: TileProps) {
  if (props.item.tipo !== "carpeta") return null;
  if (props.renombrandoId !== props.item.carpeta.id) {
    return <span style={props.vista === "lista" ? style.tdName : style.tileName}>{props.item.carpeta.nombre}</span>;
  }
  return (
    <input
      type="text"
      style={style.inlineInput}
      value={props.nombreRenombrar}
      onInput={(event) => props.onNombreRenombrarChange(event.currentTarget.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") props.onConfirmarRenombrar();
        if (event.key === "Escape") props.onCancelarRenombrar();
      }}
      onBlur={props.onConfirmarRenombrar}
      autoFocus
      onClick={(event) => event.stopPropagation()}
    />
  );
}

function GlifosModelo(props: { modelo: ResumenModeloPersistido; mostrarVersiones?: boolean | undefined }) {
  const versiones = props.modelo.versiones?.length ?? 0;
  return (
    <>
      {props.modelo.autosalvado ? <img src={autosaveIcon} alt="autosalvado" style={style.glyphIcon} title="Autosalvado" /> : null}
      {props.mostrarVersiones && versiones > 0 ? <img src={verFileIcon} alt={`${versiones} versiones`} style={style.glyphIcon} title={`${versiones} versiones`} /> : null}
    </>
  );
}

function itemId(item: TileData): Id {
  return item.tipo === "carpeta" ? item.carpeta.id : item.modelo.id;
}

const style = {
  tile: {
    minHeight: "110px",
    display: "grid",
    gridTemplateRows: "28px auto auto",
    gap: "4px",
    padding: "10px",
    border: `1px solid ${tokens.colors.bordeIntermedio}`,
    borderRadius: tokens.radii.md,
    background: tokens.colors.fondoChrome,
    color: tokens.colors.textoPrimario,
    cursor: "pointer",
    textAlign: "left",
  },
  tileArchivado: { borderColor: tokens.colors.bordeControl, background: tokens.colors.carpetaFondo, color: tokens.colors.textoTerciario },
  tileDrop: { borderColor: tokens.colors.canvas.proceso, boxShadow: tokens.shadows.dropProceso },
  tileIcon: { width: "24px", height: "24px" },
  tileName: { minWidth: 0, color: tokens.colors.textoPrimario, fontSize: "13px", fontWeight: 700, lineHeight: 1.2, overflowWrap: "anywhere" },
  tileDesc: { minWidth: 0, color: tokens.colors.textoTerciario, fontSize: "11px", lineHeight: 1.25, overflowWrap: "anywhere" },
  tileDate: { color: tokens.colors.textoTerciario, fontSize: "11px", fontWeight: 700 },
  tileType: { color: tokens.colors.textoDeshabilitado, fontSize: "11px", fontWeight: 600 },
  glyphIcon: { width: "14px", height: "14px", justifySelf: "end" },
  fila: { borderBottom: `1px solid ${tokens.colors.fondoDeshabilitado}`, cursor: "pointer" },
  filaArchivada: { background: tokens.colors.carpetaFondo, color: tokens.colors.textoTerciario },
  dropActivo: { outline: `2px solid ${tokens.colors.canvas.proceso}`, outlineOffset: "-2px" },
  td: { padding: "8px", display: "flex", alignItems: "center", gap: "6px" },
  tableIcon: { width: "18px", height: "18px", flexShrink: 0 },
  tdName: { fontWeight: 600, color: tokens.colors.textoPrimario },
  archiveBadge: {
    display: "inline-flex",
    alignItems: "center",
    height: "16px",
    padding: "0 5px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    color: tokens.colors.chromeNeutral,
    background: tokens.colors.fondoChrome,
    fontSize: "10px",
    fontWeight: 800,
    lineHeight: 1,
  },
  inlineInput: {
    width: "100%",
    height: "28px",
    border: `1px solid ${tokens.colors.chromeNeutral}`,
    borderRadius: tokens.radii.sm,
    padding: "0 6px",
    fontSize: "13px",
    boxSizing: "border-box",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
