// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { refinaA } from "../../modelo/refinamientos";
import { estadoSubmodelo } from "../../modelo/submodelos";
import type { Entidad, Id, Modelo, Opd, TipoRefinamiento } from "../../modelo/tipos";
import type { NodoOpdData } from "../../app/viewmodels/arbolOpdEstructura";
import { tokens } from "../tokens";
import { GLIFO_BORRAR, GLIFO_CARET, GLIFO_MARKER, GLIFO_REF, GLIFO_WARN } from "../codex/glifos";
import { calcularBadges, labelNodoRaiz, labelTipoBadge, tagAnclasOpd, tagVistaOpd, type AvisoOpdLike, type BadgesNodoOpd } from "./badges";

function refinadorDeOpd(modelo: Modelo, opdId: Id): { entidad: Entidad; tipo: TipoRefinamiento } | undefined {
  for (const entidad of Object.values(modelo.entidades)) {
    const ref = refinaA(entidad, opdId);
    if (ref) return { entidad, tipo: ref.tipo };
  }
  return undefined;
}

interface NodoOpdProps {
  nodo: NodoOpdData;
  modelo: Modelo;
  avisos: readonly AvisoOpdLike[];
  activo: boolean;
  /** R-OPD-REF-15: el modelo activo es un apunte → la raíz proyecta «Hoja». */
  esApunte: boolean;
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
 * CodexTreeRow: fila tipográfica pura del árbol OPD (ui-forja 02 §3).
 * Sin íconos de carpeta. El marker ▸/▾ es el disclosure unificado: en nodos
 * con hijos refleja expandido (▾) / colapsado (▸) y togglea; en hojas current
 * actúa como marker de selección (▸). code en JetBrains Mono, label en Inria
 * Serif. ArbolOpd conserva el selector amplio del store; este leaf recibe
 * estado y callbacks por props.
 */
export function NodoOpd(props: NodoOpdProps) {
  const badges = calcularBadges(props.modelo, props.nodo.opd.id, props.avisos, { esApunte: props.esApunte });
  const esRaiz = props.nodo.opd.id === props.modelo.opdRaizId;
  // Proyección «Hoja» de la raíz en apuntes (R-OPD-REF-15): display-only, NO muta
  // `opd.nombre`. Solo el label/código del nodo raíz cambia cuando el modelo es apunte.
  const nombre = esRaiz ? labelNodoRaiz(props.esApunte, nombreNodo(props.modelo, props.nodo.opd)) : nombreNodo(props.modelo, props.nodo.opd);
  const code = esRaiz && props.esApunte ? nombre : codigoOpd(props.nodo.opd.nombre);
  const descriptivo = descripcionNodo(nombre, code);
  const tieneHijos = props.nodo.hijos.length > 0;
  const tituloEliminar = esRaiz
    ? "SD no se puede eliminar"
    : tieneHijos
      ? "Eliminar descendientes primero"
      : "Eliminar OPD";
  const esRenombrando = props.renombrando?.id === props.nodo.opd.id;
  const tipoAccionable = Boolean(badges.refinadorId && badges.tipo !== "raiz");
  const etiquetaTipo = labelTipoBadge(badges.tipo);
  const submodeloRef = props.nodo.opd.vista?.kind === "submodel-view"
    ? props.modelo.submodelos?.[props.nodo.opd.vista.submodeloRefId]
    : undefined;
  // W6.3: chip de vista derivada (generic-view E-1) — espejo del tag SM.
  const tagVista = tagVistaOpd(props.nodo.opd);
  // W6.4: chip de anclas normativas adjuntas al OPD — espejo del chip Vista.
  const tagAnclas = tagAnclasOpd(props.modelo, props.nodo.opd.id);

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
          style={props.activo ? style.markerToggleActive : style.markerToggle}
          onClick={(event) => {
            event.stopPropagation();
            props.onToggleExpandido(props.nodo.opd.id);
          }}
        >
          {props.estaExpandido ? GLIFO_CARET : GLIFO_MARKER}
        </button>
      ) : (
        <span aria-hidden="true" style={style.markerSpacer} />
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
          style={props.activo ? style.contentActive : style.content}
          onDblClick={(event) => {
            event.stopPropagation();
            props.onRenombrandoChange({ id: props.nodo.opd.id, valor: props.nodo.opd.nombre });
          }}
        >
          <span style={style.code}>{code}</span>
          {props.nombresArbolVisibles && descriptivo ? <span style={style.label}>{descriptivo}</span> : null}
          {submodeloRef ? (
            <span style={style.viewTag} title={`Submodelo ${labelEstadoSubmodelo(estadoSubmodelo(submodeloRef))}`}>
              SM {labelEstadoSubmodelo(estadoSubmodelo(submodeloRef))}
            </span>
          ) : null}
          {tagVista ? (
            <span style={style.viewTag} title={tagVista.title} data-testid="arbol-tag-vista">
              {tagVista.label}
            </span>
          ) : null}
          {tagAnclas ? (
            <span style={style.viewTag} title={tagAnclas.title} data-testid="arbol-tag-anclas">
              {tagAnclas.label}
            </span>
          ) : null}
        </span>
      )}

      {!esRenombrando && tipoAccionable ? (
        <button
          type="button"
          class="nodo-opd-actions"
          style={style.refBtn}
          title={`Ir al refinador de ${nombre}`}
          aria-label={`Ir al refinador ${etiquetaTipo} de ${nombre}`}
          onClick={(event) => {
            event.stopPropagation();
            props.onNavegarRefinador(props.nodo.opd.id, badges.refinadorId!);
          }}
        >
          {GLIFO_REF}
        </button>
      ) : null}

      {!esRenombrando && badges.tieneIssues ? (
        <button
          type="button"
          data-testid={`tree-issue-badge-${props.nodo.opd.id}`}
          style={badges.errores > 0 ? style.issueError : style.issueWarning}
          aria-label={ariaLabelIssues(nombre, badges)}
          title={ariaLabelIssues(nombre, badges)}
          onClick={(event) => {
            event.stopPropagation();
            props.onIssueBadgeClick(props.nodo.opd.id, badges.primerAvisoCodigo);
          }}
        >
          {GLIFO_WARN}
        </button>
      ) : null}

      {!esRenombrando ? (
      <button
        type="button"
        class="nodo-opd-actions"
        aria-label={`Eliminar OPD ${nombre}`}
        title={tituloEliminar}
        disabled={esRaiz}
        style={esRaiz ? style.deleteBtnDisabled : style.deleteBtn}
        onClick={(event) => {
          event.stopPropagation();
          props.onEliminar(props.nodo.opd.id);
        }}
      >
        {GLIFO_BORRAR}
      </button>
      ) : null}
    </div>
  );
}

function ariaLabelNodo(nombre: string, badges: BadgesNodoOpd): string {
  const tipo = labelTipoBadge(badges.tipo);
  const issues = badges.tieneIssues ? `, ${badges.errores} errores y ${badges.advertencias} advertencias` : "";
  return `${nombre}, ${tipo}${issues}`;
}

function ariaLabelIssues(nombre: string, badges: BadgesNodoOpd): string {
  return `${nombre}: ${badges.errores} errores y ${badges.advertencias} advertencias`;
}

function labelEstadoSubmodelo(estado: ReturnType<typeof estadoSubmodelo>): string {
  if (estado === "cargado-sincronizado") return "sync";
  if (estado === "cargado-no-sincronizado") return "out";
  if (estado === "desconectado") return "off";
  return "cold";
}

export function nombreNodo(modelo: Modelo, opd: Opd): string {
  const ref = refinadorDeOpd(modelo, opd.id);
  if (!ref) return opd.nombre;
  const sufijo = ref.tipo === "despliegue" ? "desplegado" : "descompuesto";
  return `${codigoOpd(opd.nombre)}: ${ref.entidad.nombre} ${sufijo}`;
}

export function codigoOpd(nombre: string): string {
  const limpio = nombre.trim();
  const prefijo = /^(?:SD\d*(?:\.\d+)*|P\d+(?:\.\d+)*|LF-\d+(?:\.\d+)*|OPD\d+(?:\.\d+)*)/i.exec(limpio)?.[0];
  if (prefijo) return prefijo;
  const [segmento] = limpio.split(/\s(?:[-–—]|:)\s/);
  return segmento?.trim() || limpio;
}

// Separa el `label` descriptivo (Inria Serif) del `code` mono inicial. Conserva
// el separador ": " del nombre original para que el textContent de la fila sea
// idéntico a `nombre` ("SDx: … descompuesto"). Si el nombre no aporta nada más
// allá del código, el label queda vacío.
function descripcionNodo(nombre: string, code: string): string {
  if (nombre === code) return "";
  if (nombre.startsWith(code)) return nombre.slice(code.length);
  return nombre;
}

// CodexTreeRow (ui-forja 02 §3): padding 4px 0, indent level×18, hairline
// dotted abajo. Sin barra lateral cromática: current = ink full + peso 600 +
// marker, con fondo paper cálido para feedback de selección.
function estiloNodo(nivel: number, activo: boolean): preact.JSX.CSSProperties {
  return { ...style.node, ...(activo ? style.nodeActive : {}), paddingLeft: `${6 + nivel * 18}px` };
}

const markerBase: preact.JSX.CSSProperties = {
  width: "14px",
  minWidth: "14px",
  height: "18px",
  border: 0,
  background: "transparent",
  padding: 0,
  display: "inline-flex" as const,
  alignItems: "center",
  justifyContent: "center",
  fontFamily: tokens.typography.mono,
  fontSize: tokens.typography.fs.fs10,
  lineHeight: tokens.typography.lh.tight,
};

const actionBase: preact.JSX.CSSProperties = {
  border: 0,
  background: "transparent",
  padding: 0,
  width: "18px",
  minWidth: "18px",
  height: "18px",
  display: "inline-flex" as const,
  alignItems: "center",
  justifyContent: "center",
  fontFamily: tokens.typography.serif,
  fontSize: tokens.typography.fs.fs12,
  lineHeight: tokens.typography.lh.tight,
};

const style = {
  node: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "14px minmax(0, 1fr) auto auto auto",
    alignItems: "center",
    gap: "6px",
    paddingTop: "4px",
    paddingBottom: "4px",
    paddingRight: "8px",
    border: 0,
    borderBottom: `${tokens.stroke.hairline}px dotted ${tokens.colors.rule}`,
    borderRadius: 0,
    background: "transparent",
    color: tokens.colors.inkMid,
    cursor: "pointer",
    fontFamily: tokens.typography.serif,
    fontWeight: tokens.typography.weights.regular,
    textAlign: "left" as const,
    transition: tokens.transitions.fast,
  },
  nodeActive: {
    background: tokens.colors.paperWarm,
    color: tokens.colors.ink,
    fontWeight: tokens.typography.weights.semibold,
  },
  nodeDragOver: { borderTop: `${tokens.stroke.bold}px solid ${tokens.colors.crimson}` },
  markerToggle: { ...markerBase, color: tokens.colors.inkSoft, cursor: "pointer" },
  markerToggleActive: { ...markerBase, color: tokens.colors.ink, cursor: "pointer" },
  markerCurrent: { ...markerBase, color: tokens.colors.ink },
  markerSpacer: { ...markerBase },
  content: {
    minWidth: 0,
    display: "block" as const,
    overflow: "hidden",
    whiteSpace: "nowrap" as const,
    textOverflow: "ellipsis" as const,
    lineHeight: tokens.typography.lh.tight,
  },
  contentActive: {
    minWidth: 0,
    display: "block" as const,
    overflow: "hidden",
    whiteSpace: "nowrap" as const,
    textOverflow: "ellipsis" as const,
    lineHeight: tokens.typography.lh.tight,
  },
  code: {
    fontFamily: tokens.typography.mono,
    fontSize: tokens.typography.fs.fs10,
    letterSpacing: tokens.typography.ls.mono,
    color: "inherit",
  },
  label: {
    fontFamily: tokens.typography.serif,
    fontSize: tokens.typography.fs.fs14,
  },
  viewTag: {
    marginLeft: "6px",
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.mono,
    fontSize: tokens.typography.fs.fs10,
  },
  refBtn: { ...actionBase, color: tokens.colors.crimson, cursor: "pointer" },
  // Marca de diagnóstico: △ crimson tipográfica (no pill). Error en peso bold.
  issueWarning: {
    ...actionBase,
    color: tokens.colors.crimson,
    cursor: "pointer",
    fontFamily: tokens.typography.mono,
    fontWeight: tokens.typography.weights.regular,
  },
  issueError: {
    ...actionBase,
    color: tokens.colors.crimson,
    cursor: "pointer",
    fontFamily: tokens.typography.mono,
    fontWeight: tokens.typography.weights.bold,
  },
  deleteBtn: { ...actionBase, color: tokens.colors.inkSoft, cursor: "pointer", fontFamily: tokens.typography.mono },
  deleteBtnDisabled: { ...actionBase, color: tokens.colors.inkFaint, cursor: "not-allowed", opacity: 0.35, fontFamily: tokens.typography.mono },
  inlineInput: {
    gridColumn: "2 / -1",
    width: "100%",
    minWidth: 0,
    padding: "1px 6px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink}`,
    borderRadius: 0,
    fontFamily: tokens.typography.serif,
    fontSize: tokens.typography.fs.fs14,
    color: tokens.colors.ink,
    background: tokens.colors.paper,
    caretColor: tokens.colors.crimson,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
