import type { Id, Modelo, Opd } from "../../modelo/tipos";

const deleteIconUrl = new URL("../../../../assets/svg/delete.svg", import.meta.url).href;

export interface NodoOpdData {
  opd: Opd;
  nivel: number;
  hijos: NodoOpdData[];
}

interface NodoOpdProps {
  nodo: NodoOpdData;
  modelo: Modelo;
  activo: boolean;
  nombresArbolVisibles: boolean;
  estaExpandido: boolean;
  renombrando: { id: Id; valor: string } | null;
  dragOver: boolean;
  modoOrdenManual: boolean;
  onCambiarActivo: (opdId: Id) => void;
  onToggleExpandido: (opdId: Id) => void;
  onRenombrandoChange: (value: { id: Id; valor: string } | null) => void;
  onRenombrarSubmit: () => void;
  onEliminar: (opdId: Id) => void;
  onKeyDown: (event: KeyboardEvent, opdId: Id) => void;
  onContextMenu: (event: MouseEvent, opdId: Id) => void;
  onDragStart: (event: DragEvent, opdId: Id) => void;
  onDragOver: (event: DragEvent, opdId: Id) => void;
  onDragLeave: () => void;
  onDrop: (event: DragEvent, targetPadreId: Id | null, targetOpdId: Id) => void;
}

/**
 * Nodo visual del arbol OPD. ArbolOpd conserva el selector amplio del store;
 * este leaf recibe estado y callbacks por props.
 */
export function NodoOpd(props: NodoOpdProps) {
  const totalApariencias = Object.keys(props.nodo.opd.apariencias).length;
  const nombre = nombreNodo(props.modelo, props.nodo.opd);
  const etiquetaVisible = props.nombresArbolVisibles ? nombre : codigoOpd(props.nodo.opd.nombre);
  const esRaiz = props.nodo.opd.id === props.modelo.opdRaizId;
  const tieneHijos = props.nodo.hijos.length > 0;
  const tituloEliminar = esRaiz
    ? "SD no se puede eliminar"
    : tieneHijos
      ? "Eliminar descendientes primero"
      : "Eliminar OPD";
  const esRenombrando = props.renombrando?.id === props.nodo.opd.id;

  return (
    <div
      role="treeitem"
      tabIndex={0}
      aria-level={props.nodo.nivel + 2}
      aria-selected={props.activo}
      aria-expanded={tieneHijos ? props.estaExpandido : undefined}
      aria-current={props.activo ? "page" : undefined}
      data-opd-id={props.nodo.opd.id}
      title={nombre}
      draggable={props.modoOrdenManual}
      style={{ ...estiloNodo(props.nodo.nivel, props.activo), ...(props.dragOver ? style.nodeDragOver : {}) }}
      onClick={() => props.onCambiarActivo(props.nodo.opd.id)}
      onKeyDown={(event) => props.onKeyDown(event as unknown as KeyboardEvent, props.nodo.opd.id)}
      onContextMenu={(event) => props.onContextMenu(event as unknown as MouseEvent, props.nodo.opd.id)}
      onDragStart={(event) => props.onDragStart(event as unknown as DragEvent, props.nodo.opd.id)}
      onDragOver={(event) => props.onDragOver(event as unknown as DragEvent, props.nodo.opd.id)}
      onDragLeave={props.onDragLeave}
      onDrop={(event) => props.onDrop(event as unknown as DragEvent, props.nodo.opd.padreId, props.nodo.opd.id)}
    >
      {tieneHijos ? (
        <button
          type="button"
          aria-label={props.estaExpandido ? "Colapsar" : "Expandir"}
          style={style.expandBtn}
          onClick={(event) => {
            event.stopPropagation();
            props.onToggleExpandido(props.nodo.opd.id);
          }}
        >
          {props.estaExpandido ? "▾" : "▸"}
        </button>
      ) : (
        <span style={style.expandSpacer} />
      )}

      {esRenombrando ? (
        <input
          autoFocus
          style={style.inlineInput}
          data-modo="inline-rename"
          data-testid="arbol-opd-renombrado-inline"
          value={props.renombrando!.valor}
          onFocus={(event) => (event.currentTarget as HTMLInputElement).select()}
          onInput={(event) => props.onRenombrandoChange({ id: props.nodo.opd.id, valor: (event.currentTarget as HTMLInputElement).value })}
          onKeyDown={(event) => {
            if (event.key === "Enter") props.onRenombrarSubmit();
            if (event.key === "Escape") props.onRenombrandoChange(null);
          }}
          onBlur={props.onRenombrarSubmit}
          onClick={(event) => event.stopPropagation()}
        />
      ) : (
        <span
          style={style.nodeName}
          onDblClick={(event) => {
            event.stopPropagation();
            props.onRenombrandoChange({ id: props.nodo.opd.id, valor: props.nodo.opd.nombre });
          }}
        >
          {etiquetaVisible}
        </span>
      )}
      <span style={props.activo ? style.countActive : style.count}>{totalApariencias}</span>
      <button
        type="button"
        aria-label={`Eliminar OPD ${nombre}`}
        title={tituloEliminar}
        disabled={esRaiz}
        style={esRaiz ? style.deleteButtonDisabled : style.deleteButton}
        onClick={(event) => {
          event.stopPropagation();
          props.onEliminar(props.nodo.opd.id);
        }}
      >
        <img src={deleteIconUrl} alt="" aria-hidden="true" style={style.deleteIcon} />
      </button>
    </div>
  );
}

export function nombreNodo(modelo: Modelo, opd: Opd): string {
  const refinador = Object.values(modelo.entidades).find((entidad) => entidad.refinamiento?.opdId === opd.id);
  if (!refinador) return opd.nombre;
  const sufijo = refinador.refinamiento?.tipo === "despliegue" ? "desplegado" : "descompuesto";
  return `${codigoOpd(opd.nombre)}: ${refinador.nombre} ${sufijo}`;
}

export function codigoOpd(nombre: string): string {
  return /^SD(?:\d+(?:\.\d+)*)?/.exec(nombre.trim())?.[0] ?? nombre;
}

function estiloNodo(nivel: number, activo: boolean): preact.JSX.CSSProperties {
  return { ...style.node, ...(activo ? style.nodeActive : {}), paddingLeft: `${12 + nivel * 16}px` };
}

const style = {
  node: {
    width: "100%",
    minHeight: "34px",
    display: "grid",
    gridTemplateColumns: "16px minmax(0, 1fr) auto auto",
    alignItems: "center", gap: "4px", paddingTop: "4px", paddingBottom: "4px",
    border: "1px solid transparent", borderRadius: "4px", background: "transparent",
    color: "#475467", cursor: "pointer", fontSize: "13px", fontWeight: 600, textAlign: "left",
  },
  nodeActive: { border: "1px solid #b9d2df", background: "#e8f7ff", color: "#1f2937", fontWeight: 700 },
  nodeDragOver: { borderTop: "2px solid #586D8C" },
  nodeName: { overflow: "visible", lineHeight: 1.2, overflowWrap: "anywhere", whiteSpace: "normal", fontSize: "13px" },
  count: contador("#edf2f7", "#667085"),
  countActive: contador("#d1eefb", "#1f2937"),
  expandBtn: compactoBoton("16px", "16px", "pointer", 1, { fontSize: "9px", color: "#667085", marginRight: "0" }),
  expandSpacer: { width: "16px", height: "16px" },
  deleteButton: botonEliminar("pointer", 1),
  deleteButtonDisabled: botonEliminar("not-allowed", 0.35),
  deleteIcon: { width: "18px", height: "18px", display: "block" },
  inlineInput: { width: "100%", minWidth: 0, padding: "1px 4px", border: "1px solid #586D8C", borderRadius: "3px", fontSize: "13px", color: "#1f2937", font: "inherit" },
} satisfies Record<string, preact.JSX.CSSProperties>;

function contador(background: string, color: string): preact.JSX.CSSProperties {
  return {
    minWidth: "22px",
    height: "18px",
    borderRadius: "9px",
    background,
    color,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 700,
  };
}

function botonEliminar(cursor: string, opacity?: number): preact.JSX.CSSProperties {
  return compactoBoton("26px", "26px", cursor, opacity);
}

function compactoBoton(
  width: string, height: string, cursor: string, opacity?: number, extra: preact.JSX.CSSProperties = {},
): preact.JSX.CSSProperties {
  return {
    width, height, borderRadius: "4px", border: "1px solid transparent",
    background: "transparent", cursor, display: "inline-flex",
    alignItems: "center", justifyContent: "center", padding: 0, opacity,
    ...extra,
  };
}
