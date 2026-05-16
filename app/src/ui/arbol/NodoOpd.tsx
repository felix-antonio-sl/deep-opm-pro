// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { refinaA } from "../../modelo/refinamientos";
import type { Entidad, Id, Modelo, Opd, TipoRefinamiento } from "../../modelo/tipos";
import { tokens } from "../tokens";
import { calcularBadges, labelTipoBadge, type AvisoOpdLike, type BadgesNodoOpd, type TipoBadgeOpd } from "./badges";

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
  avisos: readonly AvisoOpdLike[];
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
  onNavegarRefinador: (opdId: Id, refinadorId: Id) => void;
  onIssueBadgeClick: (opdId: Id, codigo: string | null) => void;
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
  const badges = calcularBadges(props.modelo, props.nodo.opd.id, props.avisos);
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
      class="nodo-opd"
      aria-level={props.nodo.nivel + 2}
      aria-selected={props.activo}
      aria-expanded={tieneHijos ? props.estaExpandido : undefined}
      aria-current={props.activo ? "page" : undefined}
      aria-label={ariaLabelNodo(nombre, badges)}
      data-opd-id={props.nodo.opd.id}
      data-testid={`tree-node-${props.nodo.opd.id}`}
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

      <button
        type="button"
        style={estiloBadgeTipo(badges.tipo, Boolean(badges.refinadorId && badges.tipo !== "raiz"))}
        data-tipo={badges.tipo}
        title={badges.refinadorId && badges.tipo !== "raiz" ? `Ir al refinador de ${nombre}` : "OPD raíz del sistema"}
        aria-label={badges.refinadorId && badges.tipo !== "raiz" ? `Ir al refinador ${labelTipoBadge(badges.tipo)} de ${nombre}` : `Tipo ${labelTipoBadge(badges.tipo)}`}
        onClick={(event) => {
          event.stopPropagation();
          if (badges.refinadorId && badges.tipo !== "raiz") props.onNavegarRefinador(props.nodo.opd.id, badges.refinadorId);
        }}
      >
        {labelTipoBadge(badges.tipo)}
      </button>

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
      <span
        style={props.activo ? style.countActive : style.count}
        aria-label={`${badges.cuentaObjetos} objetos, ${badges.cuentaProcesos} procesos, ${badges.cuentaEnlaces} enlaces`}
        title={`${badges.cuentaObjetos} objetos, ${badges.cuentaProcesos} procesos, ${badges.cuentaEnlaces} enlaces`}
      >
        {badges.cuentaObjetos}o · {badges.cuentaProcesos}p · {badges.cuentaEnlaces}e
      </span>
      {badges.tieneIssues ? (
        <button
          type="button"
          data-testid={`tree-issue-badge-${props.nodo.opd.id}`}
          style={badges.errores > 0 ? style.issueBadgeError : style.issueBadgeWarning}
          aria-label={ariaLabelIssues(nombre, badges)}
          title={ariaLabelIssues(nombre, badges)}
          onClick={(event) => {
            event.stopPropagation();
            props.onIssueBadgeClick(props.nodo.opd.id, badges.primerAvisoCodigo);
          }}
        >
          !
        </button>
      ) : <span style={style.issueSpacer} />}
      <button
        type="button"
        class="nodo-opd-actions"
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
      <div class="nodo-opd-actions" style={style.inlineActions}>
        <button
          type="button"
          style={style.openButton}
          title={`Abrir ${nombre}`}
          aria-label={`Abrir OPD ${nombre}`}
          onClick={(event) => {
            event.stopPropagation();
            props.onCambiarActivo(props.nodo.opd.id);
          }}
        >
          Abrir
        </button>
        <button
          type="button"
          aria-label={`Renombrar OPD ${nombre}`}
          title="Renombrar"
          style={style.inlineActionButton}
          onClick={(event) => {
            event.stopPropagation();
            props.onRenombrandoChange({ id: props.nodo.opd.id, valor: props.nodo.opd.nombre });
          }}
        >
          Renombrar
        </button>
        <button
          type="button"
          aria-label={`Crear refinamiento desde ${nombre}`}
          title="Crear refinamiento"
          style={style.inlineActionButton}
          onClick={(event) => {
            event.stopPropagation();
            props.onCambiarActivo(props.nodo.opd.id);
          }}
        >
          Crear refinamiento
        </button>
      </div>
    </div>
  );
}

function ariaLabelNodo(nombre: string, badges: BadgesNodoOpd): string {
  const tipo = labelTipoBadge(badges.tipo);
  const conteos = `${badges.cuentaObjetos} objetos, ${badges.cuentaProcesos} procesos, ${badges.cuentaEnlaces} enlaces`;
  const issues = badges.tieneIssues ? `, ${badges.errores} errores y ${badges.advertencias} advertencias` : "";
  return `${nombre}, ${tipo}, ${conteos}${issues}`;
}

function ariaLabelIssues(nombre: string, badges: BadgesNodoOpd): string {
  return `${nombre}: ${badges.errores} errores y ${badges.advertencias} advertencias`;
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
    gridTemplateColumns: "16px 18px 48px minmax(0, 1fr) 16px 26px",
    alignItems: "center", gap: "4px", paddingTop: "4px", paddingBottom: "4px",
    border: "1px solid transparent", borderRadius: tokens.radii.sm, background: "transparent",
    color: tokens.colors.textoSecundario, cursor: "pointer", fontSize: "13px", fontWeight: 600, textAlign: "left",
  },
  nodeActive: { border: `1px solid ${tokens.colors.arbolSeleccionBorde}`, background: tokens.colors.infoFondo, color: tokens.colors.textoPrimario, fontWeight: 700 },
  nodeDragOver: { borderTop: `2px solid ${tokens.colors.chromeNeutral}` },
  nodeName: {
    minWidth: 0,
    overflow: "hidden",
    lineHeight: 1.2,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "13px",
  },
  count: contador(tokens.colors.fondoLineaTiempo, tokens.colors.textoTerciario),
  countActive: contador(tokens.colors.arbolSeleccion, tokens.colors.textoPrimario),
  inlineActions: {
    gridColumn: "4 / -1",
    gridRow: 2,
    display: "flex",
    alignItems: "center",
    gap: "4px",
    minWidth: 0,
  },
  openButton: {
    border: `1px solid ${tokens.colors.bordeControl}`,
    background: tokens.colors.fondoChrome,
    borderRadius: tokens.radii.sm,
    color: tokens.colors.textoSecundario,
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 700,
    height: "20px",
    padding: "0 5px",
    whiteSpace: "nowrap",
  },
  inlineActionButton: {
    border: `1px solid ${tokens.colors.bordeControl}`,
    background: "transparent",
    borderRadius: tokens.radii.sm,
    color: tokens.colors.textoTerciario,
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 600,
    height: "20px",
    padding: "0 5px",
    whiteSpace: "nowrap",
  },
  issueBadgeWarning: {
    width: "16px",
    height: "16px",
    borderRadius: tokens.radii.full,
    background: tokens.colors.advertenciaFondo,
    border: `1px solid ${tokens.colors.advertenciaBorde}`,
    color: tokens.colors.alertaTexto,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: 900,
  },
  issueBadgeError: {
    width: "16px",
    height: "16px",
    borderRadius: tokens.radii.full,
    background: tokens.colors.errorFondoIntenso,
    border: `1px solid ${tokens.colors.errorBordeSuave}`,
    color: tokens.colors.errorTexto,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: 900,
  },
  issueSpacer: { width: "16px", height: "16px" },
  expandBtn: compactoBoton("16px", "16px", "pointer", 1, { fontSize: "9px", color: tokens.colors.textoTerciario, marginRight: "0" }),
  expandSpacer: { width: "16px", height: "16px" },
  logicalIcon: { width: "16px", height: "12px", display: "block" },
  logicalIconSpacer: { width: "16px", height: "12px" },
  deleteButton: botonEliminar("pointer", 1),
  deleteButtonDisabled: botonEliminar("not-allowed", 0.35),
  deleteIcon: { width: "18px", height: "18px", display: "block" },
  inlineInput: { width: "100%", minWidth: 0, padding: "1px 4px", border: `1px solid ${tokens.colors.chromeNeutral}`, borderRadius: tokens.radii.xs, fontSize: "13px", color: tokens.colors.textoPrimario, font: "inherit" },
} satisfies Record<string, preact.JSX.CSSProperties>;

function estiloBadgeTipo(tipo: TipoBadgeOpd, accionable: boolean): preact.JSX.CSSProperties {
  const colores: Record<TipoBadgeOpd, { bg: string; color: string; border: string }> = {
    raiz: { bg: tokens.colors.neutralBadge, color: tokens.colors.textoSlate, border: tokens.colors.bordeSlate },
    inzoom: { bg: tokens.colors.infoFondo, color: tokens.colors.infoTextoOscuro, border: tokens.colors.infoBordeSuave },
    unfold: { bg: tokens.colors.exitoFondo, color: tokens.colors.exitoTexto, border: tokens.colors.bordeSuave },
  };
  const meta = colores[tipo];
  return {
    minWidth: "48px",
    height: "20px",
    borderRadius: tokens.radii.pill,
    border: `1px solid ${meta.border}`,
    background: meta.bg,
    color: meta.color,
    cursor: accionable ? "pointer" : "default",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: 800,
    padding: "0 6px",
    whiteSpace: "nowrap",
  };
}

function contador(background: string, color: string): preact.JSX.CSSProperties {
  return {
    gridColumn: 3,
    gridRow: 2,
    minWidth: "58px",
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
