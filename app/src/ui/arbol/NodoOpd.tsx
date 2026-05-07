// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { refinaA } from "../../modelo/refinamientos";
import type { Entidad, Id, Modelo, Opd, TipoRefinamiento } from "../../modelo/tipos";
import { tokens } from "../tokens";

const deleteIconUrl = new URL("../../../../assets/svg/delete.svg", import.meta.url).href;
const objectListLogicalUrl = new URL("../../../../assets/svg/list-logical/object.svg", import.meta.url).href;
const objectDashedListLogicalUrl = new URL("../../../../assets/svg/list-logical/objectDashed.svg", import.meta.url).href;
const processListLogicalUrl = new URL("../../../../assets/svg/list-logical/process.svg", import.meta.url).href;
const processDashedListLogicalUrl = new URL("../../../../assets/svg/list-logical/processDashed.svg", import.meta.url).href;

/**
 * Iconografía list-logical canónica del nodo OPD.
 * SSOT: [V-209] variantes visuales por esencia, [Glos 3.55] Object, [Glos 3.69] Process.
 * Assets: assets/svg/list-logical/{object,objectDashed,process,processDashed}.svg [JOYAS §2].
 */
function refinadorDeOpd(modelo: Modelo, opdId: Id): { entidad: Entidad; tipo: TipoRefinamiento } | undefined {
  for (const entidad of Object.values(modelo.entidades)) {
    const ref = refinaA(entidad, opdId);
    if (ref) return { entidad, tipo: ref.tipo };
  }
  return undefined;
}

function iconoListLogicalOpd(modelo: Modelo, opdId: Id): { src: string; etiqueta: string } | null {
  const ref = refinadorDeOpd(modelo, opdId);
  if (!ref) return null;
  const refinador = ref.entidad;
  const dashed = refinador.esencia === "informacional";
  if (refinador.tipo === "objeto") {
    return { src: dashed ? objectDashedListLogicalUrl : objectListLogicalUrl, etiqueta: dashed ? "Objeto informacional" : "Objeto físico" };
  }
  return { src: dashed ? processDashedListLogicalUrl : processListLogicalUrl, etiqueta: dashed ? "Proceso informacional" : "Proceso físico" };
}

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
  const iconoLogico = iconoListLogicalOpd(props.modelo, props.nodo.opd.id);

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

      {iconoLogico ? (
        <img src={iconoLogico.src} alt="" aria-hidden="true" title={iconoLogico.etiqueta} style={style.logicalIcon} />
      ) : (
        <span style={style.logicalIconSpacer} />
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
  const ref = refinadorDeOpd(modelo, opd.id);
  if (!ref) return opd.nombre;
  const sufijo = ref.tipo === "despliegue" ? "desplegado" : "descompuesto";
  return `${codigoOpd(opd.nombre)}: ${ref.entidad.nombre} ${sufijo}`;
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
    gridTemplateColumns: "16px 18px minmax(0, 1fr) auto auto",
    alignItems: "center", gap: "4px", paddingTop: "4px", paddingBottom: "4px",
    border: "1px solid transparent", borderRadius: tokens.radii.sm, background: "transparent",
    color: tokens.colors.textoSecundario, cursor: "pointer", fontSize: "13px", fontWeight: 600, textAlign: "left",
  },
  nodeActive: { border: `1px solid ${tokens.colors.arbolSeleccionBorde}`, background: tokens.colors.infoFondo, color: tokens.colors.textoPrimario, fontWeight: 700 },
  nodeDragOver: { borderTop: `2px solid ${tokens.colors.chromeNeutral}` },
  nodeName: { overflow: "visible", lineHeight: 1.2, overflowWrap: "anywhere", whiteSpace: "normal", fontSize: "13px" },
  count: contador(tokens.colors.fondoLineaTiempo, tokens.colors.textoTerciario),
  countActive: contador(tokens.colors.arbolSeleccion, tokens.colors.textoPrimario),
  expandBtn: compactoBoton("16px", "16px", "pointer", 1, { fontSize: "9px", color: tokens.colors.textoTerciario, marginRight: "0" }),
  expandSpacer: { width: "16px", height: "16px" },
  logicalIcon: { width: "16px", height: "12px", display: "block" },
  logicalIconSpacer: { width: "16px", height: "12px" },
  deleteButton: botonEliminar("pointer", 1),
  deleteButtonDisabled: botonEliminar("not-allowed", 0.35),
  deleteIcon: { width: "18px", height: "18px", display: "block" },
  inlineInput: { width: "100%", minWidth: 0, padding: "1px 4px", border: `1px solid ${tokens.colors.chromeNeutral}`, borderRadius: tokens.radii.xs, fontSize: "13px", color: tokens.colors.textoPrimario, font: "inherit" },
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
    width, height, borderRadius: tokens.radii.sm, border: "1px solid transparent",
    background: "transparent", cursor, display: "inline-flex",
    alignItems: "center", justifyContent: "center", padding: 0, opacity,
    ...extra,
  };
}
