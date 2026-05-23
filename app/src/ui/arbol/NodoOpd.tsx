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
  const tipoAccionable = Boolean(badges.refinadorId && badges.tipo !== "raiz");
  const etiquetaTipo = labelTipoBadge(badges.tipo);

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

      {tipoAccionable ? (
        <button
          type="button"
          style={estiloBadgeTipo(badges.tipo, true)}
          data-tipo={badges.tipo}
          title={`Ir al refinador de ${nombre}`}
          aria-label={`Ir al refinador ${etiquetaTipo} de ${nombre}`}
          onClick={(event) => {
            event.stopPropagation();
            props.onNavegarRefinador(props.nodo.opd.id, badges.refinadorId!);
          }}
        >
          {etiquetaTipo}
        </button>
      ) : (
        <span
          style={estiloBadgeTipo(badges.tipo, false)}
          data-tipo={badges.tipo}
          title={`Tipo ${etiquetaTipo}`}
          aria-label={`Tipo ${etiquetaTipo}`}
        >
          {etiquetaTipo}
        </span>
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

// Ronda 28 L3: paleta Bauhaus aplicada al nodo OPD.
//   - node: padding 6 16, fontSize 12, ink70. Sin borde (la jerarquía es
//     padding + barra lateral cuando activo).
//   - nodeActive: barra lateral 2px cinabrio izq + fondo ink-04 + ink puro.
//   - tags `7o · 1p · 8e`: JetBrains Mono 10 ink-50, sin background.
//   - chevrons (▾/▸): mono 10 ink-30.
//   - badges tipo: pill ink-04 con texto ink-70 (raiz), ink (inzoom),
//     ink70 (unfold) — diferenciación por peso, no por color.
//   - issueBadge: pill ink + paper (error) o accentSoft + accentDark (warn).
// Ronda 28 L3 hotfix: paddingLeft=12+nivel*16 (era 16+nivel*16 tras subir
// spacing.md de 12→16) para devolver 4px al ancho util de la fila. El fix
// nuclear vive en `style.node.gridTemplateColumns` (reorden de cols) — este
// padding es secundario y solo recupera espacio sin alterar el chrome
// Bauhaus heredado.
function estiloNodo(nivel: number, activo: boolean): preact.JSX.CSSProperties {
  return { ...style.node, ...(activo ? style.nodeActive : {}), paddingLeft: `${12 + nivel * 16}px` };
}

const style = {
  node: {
    width: "100%",
    minHeight: "30px",
    display: "grid",
    // Ronda 28 L3 hotfix: el orden de cols se reacomoda para que el badge
    // tipo (col 5, 40px) viva DESPUES del nombre+conteos en vez de antes
    // (era col 3, 48px). Razon: en panelArbol=240 el `minmax(0, 1fr)` del
    // nombre se aplastaba a 0 y el centro horizontal del treeitem caia
    // sobre el badge UNFOLD/INZOOM, interceptando `treeitem.click()` de
    // Playwright y rompiendo la activacion del OPD destino. Con el badge
    // al final el centro cae sobre nombre/count (sin handler) y el click
    // se propaga al div treeitem.
    gridTemplateColumns: "16px 18px minmax(0, 1fr) auto 40px 16px 26px",
    alignItems: "center",
    gap: "4px",
    paddingTop: "6px",
    paddingBottom: "6px",
    border: 0,
    borderLeft: `${tokens.stroke.bold}px solid transparent`,
    borderRadius: 0,
    background: "transparent",
    color: tokens.colors.ink70,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.medium,
    textAlign: "left" as const,
    transition: tokens.transitions.fast,
  },
  // Item activo: barra lateral 2px cinabrio izquierda + fondo ink-04.
  nodeActive: {
    borderLeft: `${tokens.stroke.bold}px solid ${tokens.colors.accent}`,
    background: tokens.colors.ink04,
    color: tokens.colors.ink,
    fontWeight: tokens.typography.weights.semibold,
  },
  nodeDragOver: { borderTop: `${tokens.stroke.bold}px solid ${tokens.colors.accent}` },
  nodeName: {
    minWidth: 0,
    overflow: "hidden",
    lineHeight: 1.3,
    textOverflow: "ellipsis" as const,
    whiteSpace: "nowrap" as const,
    fontSize: tokens.typography.sizes.sm,
  },
  count: contador(tokens.colors.ink50),
  countActive: contador(tokens.colors.ink),
  // Issue badges: paleta Bauhaus — warning terracota suave (accentSoft),
  // error cinabrio dark.
  issueBadgeWarning: {
    width: "16px",
    height: "16px",
    borderRadius: tokens.radii.full,
    background: tokens.colors.accentSoft,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.warning}`,
    color: tokens.colors.warning,
    display: "inline-flex" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    cursor: "pointer",
    fontSize: tokens.typography.sizes.xxs,
    fontWeight: tokens.typography.weights.heavy,
  },
  issueBadgeError: {
    width: "16px",
    height: "16px",
    borderRadius: tokens.radii.full,
    background: tokens.colors.accentSoft,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.accent}`,
    color: tokens.colors.accentDark,
    display: "inline-flex" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    cursor: "pointer",
    fontSize: tokens.typography.sizes.xxs,
    fontWeight: tokens.typography.weights.heavy,
  },
  issueSpacer: { width: "16px", height: "16px" },
  // Chevron expand/collapse: mono ink-30, glifo Bauhaus ▾/▸.
  expandBtn: compactoBoton("16px", "16px", "pointer", 1, {
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: tokens.typography.sizes.xs,
    color: tokens.colors.ink30,
    marginRight: 0,
  }),
  expandSpacer: { width: "16px", height: "16px" },
  logicalIcon: { width: "16px", height: "12px", display: "block" as const },
  logicalIconSpacer: { width: "16px", height: "12px" },
  deleteButton: botonEliminar("pointer", 1),
  deleteButtonDisabled: botonEliminar("not-allowed", 0.35),
  deleteIcon: { width: "18px", height: "18px", display: "block" as const },
  inlineInput: {
    width: "100%",
    minWidth: 0,
    padding: "1px 6px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink}`,
    borderRadius: tokens.radii.xs,
    fontSize: tokens.typography.sizes.sm,
    color: tokens.colors.ink,
    background: tokens.colors.paper,
    caretColor: tokens.colors.accent,
    font: "inherit",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;

// Badges de tipo (Raíz/SD, Inzoom, Unfold) en Bauhaus monocromático:
//   - raiz:   ink-04 / ink-70.
//   - inzoom: paper / ink + outline ink (subrayado fuerte).
//   - unfold: paper / ink70 + outline ink-15 (subrayado suave).
// La diferenciación se logra con peso y contorno, no con color cromático.
function estiloBadgeTipo(tipo: TipoBadgeOpd, accionable: boolean): preact.JSX.CSSProperties {
  const colores: Record<TipoBadgeOpd, { bg: string; color: string; border: string; weight: number }> = {
    raiz: {
      bg: tokens.colors.ink04,
      color: tokens.colors.ink70,
      border: tokens.colors.ink15,
      weight: tokens.typography.weights.semibold,
    },
    inzoom: {
      bg: tokens.colors.paper,
      color: tokens.colors.ink,
      border: tokens.colors.ink,
      weight: tokens.typography.weights.bold,
    },
    unfold: {
      bg: tokens.colors.paper,
      color: tokens.colors.ink70,
      border: tokens.colors.ink15,
      weight: tokens.typography.weights.semibold,
    },
  };
  const meta = colores[tipo];
  return {
    // Ronda 28 L3 hotfix: badge tipo vive en la col 5 (despues del count)
    // para no interceptar el click central del treeitem. Ver comentario
    // en `style.node.gridTemplateColumns`.
    gridColumn: 5,
    gridRow: 1,
    boxSizing: "border-box" as const,
    minWidth: "40px",
    maxWidth: "40px",
    height: "18px",
    borderRadius: tokens.radii.xs,
    border: `${tokens.stroke.hairline}px solid ${meta.border}`,
    background: meta.bg,
    color: meta.color,
    cursor: accionable ? "pointer" : "default",
    display: "inline-flex" as const,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: tokens.typography.familyChrome,
    fontSize: tokens.typography.sizes.xxs,
    fontWeight: meta.weight,
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
    padding: "0 4px",
    whiteSpace: "nowrap" as const,
    transition: tokens.transitions.fast,
  };
}

// Tags `7o · 1p · 8e`: JetBrains Mono 10px ink-50, sin background. La
// jerarquía visual se logra con tipografía y separador `·`.
function contador(color: string): preact.JSX.CSSProperties {
  return {
    // Ronda 28 L3 hotfix: count vive en col 4 (era col 5) tras reordenar las
    // cols del nodo para mover el badge tipo al final.
    gridColumn: 4,
    gridRow: 1,
    minWidth: "52px",
    height: "17px",
    background: "transparent",
    color,
    display: "inline-flex" as const,
    alignItems: "center",
    justifyContent: "flex-end" as const,
    paddingRight: tokens.spacing.xs,
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: tokens.typography.sizes.xxs,
    fontWeight: tokens.typography.weights.medium,
    fontVariantNumeric: "tabular-nums" as const,
    letterSpacing: 0,
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
