/**
 * Estilos del chrome superior — Ronda 28 L2 (Bauhaus monocromática).
 *
 * Paleta:
 *   - Fondo: paper (#FAFAFA). Cero gradientes, cero color corporativo.
 *   - Bordes: 1.5px ink (chrome bottom), 1.5px ink (botones), 1px ink-15 (chips).
 *   - Hover: ink-04 como wash neutro.
 *   - Glifos Objeto/Proceso/Estado: geometría 12×12 con stroke canónico
 *     verde/azul/olive, sin fill.
 *   - Focus visible (focus-visible) y selección con cinabrio van por
 *     `toolbar.css` y `focus.css` (cascada).
 *   - Cero border-radius (radii.* ya colapsa a 2px desde L1).
 *
 * Compat-shim: las keys legacy (button/iconButton/activeButton/etc.) se
 * conservan para los consumidores (ToolbarCreacion/ToolbarMapaSistema/
 * ToolbarMas/etc.) que importan de aquí.
 *
 * Identidad: la marca "OPFORJA" se imprime como kbd uppercase en el cluster
 * Modelo (esquina superior izquierda). Si la altura del button-strip ahoga
 * la marca en mobile, ToolbarBase la ahoga vía breakpoint (mostramos sólo
 * la "O" inicial) — la decisión vive en el componente, no en el style.
 */
import type { ModoImagenEntidad, TipoEntidad } from "../../modelo/tipos";
import { colors, radii, spacing, stroke, typography } from "../tokens";

export const toolbarStyle = {
  /**
   * Chrome bar — ronda 28 L2:
   * Codex v1.1: controles inline dentro del header global. El header de
   * CodexFrame dibuja la línea de separación; la toolbar no agrega caja.
   */
  bar: {
    display: "flex",
    alignItems: "center",
    gap: `${spacing.sm}px`,
    width: "100%",
    minWidth: 0,
    height: "100%",
    padding: "0 8px",
    background: "transparent",
    borderBottom: 0,
    boxShadow: "none",
    overflow: "hidden",
    color: colors.ink,
  },
  /** Marca OPFORJA: kbd uppercase con tracking 0.12em, fuente Inter Tight 700/13. */
  marca: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "30px",
    padding: "0 10px",
    marginRight: `${spacing.xs}px`,
    border: `${stroke.hairline}px solid ${colors.ink}`,
    color: colors.ink,
    background: colors.paper,
    fontFamily: typography.fontFamily,
    fontSize: `${typography.sizes.base}px`,
    fontWeight: typography.weights.bold,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    userSelect: "none",
    flex: "0 0 auto",
  },
  /** Compacto para mobile/tablet: sólo glyph "O". */
  marcaCompacta: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "30px",
    height: "30px",
    marginRight: `${spacing.xs}px`,
    border: `${stroke.hairline}px solid ${colors.ink}`,
    color: colors.ink,
    background: colors.paper,
    fontFamily: typography.fontFamily,
    fontSize: `${typography.sizes.base}px`,
    fontWeight: typography.weights.bold,
    letterSpacing: 0,
    textTransform: "uppercase",
    userSelect: "none",
    flex: "0 0 auto",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: `${spacing.xs}px`,
    minWidth: 0,
    flex: "1 1 auto",
    overflowX: "auto",
  },
  cluster: {
    display: "inline-flex",
    alignItems: "center",
    gap: `${spacing.xs + 2}px`,
    padding: `0 ${spacing.xs}px`,
    minWidth: 0,
    flex: "0 0 auto",
  },
  clusterLabel: {
    position: "static",
    width: "auto",
    height: "auto",
    padding: `0 ${spacing.xs}px`,
    margin: 0,
    overflow: "visible",
    clip: "auto",
    whiteSpace: "nowrap",
    color: colors.ink50,
    fontSize: `${typography.sizes.xs}px`,
    fontWeight: typography.weights.medium,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    lineHeight: 1,
  },
  menuWrapper: {
    position: "relative",
    flex: "0 0 auto",
  },
  /**
   * Botón icono (☰): Ronda Codex v2 L2 — glifo en ink, sin caja con borde.
   * El trigger del menú/palette es una palabra-glifo, no una caja cromada.
   */
  iconButton: {
    width: "30px",
    height: "30px",
    border: "1px solid transparent",
    background: "transparent",
    color: colors.ink,
    cursor: "pointer",
    fontSize: `${typography.sizes.lg}px`,
    fontWeight: typography.weights.bold,
    lineHeight: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },
  button: botonBase(),
  /**
   * Botón Objeto — Ronda Codex v2 L2 (botones-caja, auditoría rev2 §05):
   * el top-bar deja de ser cajas con borde 1.5px. Ahora cada acción es una
   * palabra con su glifo de clase (cuadrado/elipse en stroke ink), sin borde
   * ni fondo. El estado activo se marca con un subrayado accent (cinabrio),
   * no con una caja. Ver `palabraTopBar()`.
   */
  objectButton: {
    ...accionCreadorTopBar(),
  },
  objectActiveButton: {
    ...accionCreadorTopBar(),
    boxShadow: `inset 0 -${stroke.bold}px 0 0 ${colors.accent}`,
  },
  processButton: {
    ...accionCreadorTopBar(),
  },
  processActiveButton: {
    ...accionCreadorTopBar(),
    boxShadow: `inset 0 -${stroke.bold}px 0 0 ${colors.accent}`,
  },
  creatorButton: {
    ...accionCreadorTopBar(),
  },
  creatorButtonActive: {
    ...accionCreadorTopBar(),
    boxShadow: `inset 0 -${stroke.bold}px 0 0 ${colors.accent}`,
  },
  creatorButtonDisabled: {
    ...accionCreadorTopBar(),
    color: colors.ink30,
    cursor: "default",
    opacity: 0.72,
  },
  creatorGlyphSlot: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "14px",
    height: "14px",
    flex: "0 0 auto",
  },
  creatorLabel: {
    display: "inline-flex",
    alignItems: "center",
    lineHeight: 1,
  },
  creatorShortcutDivider: {
    width: `${stroke.hairline}px`,
    height: "16px",
    flex: "0 0 auto",
    background: colors.rule,
  },
  creatorKbd: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "12px",
    height: "18px",
    padding: 0,
    border: "none",
    background: "transparent",
    color: colors.ink70,
    fontFamily: typography.fontFamilyMono,
    fontSize: `${typography.sizes.xs}px`,
    fontWeight: typography.weights.medium,
    letterSpacing: 0,
    lineHeight: 1,
  },
  /** Glyph mini para Objeto (cuadrado) / Proceso (elipse) 12×12 ink. */
  glyph: {
    width: "12px",
    height: "12px",
    display: "inline-block",
    flex: "0 0 auto",
  },
  activeButton: {
    ...botonBase(),
    background: colors.ink04,
    fontWeight: typography.weights.semibold,
  },
  iconTextButton: {
    ...accionCreadorTopBar(),
    padding: `0 ${spacing.sm + spacing.xs + 2}px`,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: `${spacing.xs + 2}px`,
  },
  /** Kbd "⌘ K" — borde ink-30, mono JetBrains. */
  kbd: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "20px",
    minWidth: "30px",
    padding: "0 5px",
    border: `${stroke.hairline}px solid ${colors.ink30}`,
    background: colors.paper,
    color: colors.ink70,
    fontFamily: typography.fontFamilyMono,
    fontSize: `${typography.sizes.xs}px`,
    fontWeight: typography.weights.medium,
    letterSpacing: 0,
    lineHeight: 1,
  },
  searchButton: {
    height: "32px",
    padding: "0 8px",
    border: "1px solid transparent",
    background: "transparent",
    color: colors.ink,
    cursor: "pointer",
    fontFamily: typography.fontFamily,
    fontSize: `${typography.sizes.base}px`,
    fontWeight: typography.weights.medium,
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    transition: "background 150ms ease-out, box-shadow 120ms ease",
  },
  searchButtonFocus: {
    boxShadow: `inset 0 -${stroke.bold}px 0 0 ${colors.crimson}`,
  },
  searchIcon: {
    fontFamily: typography.fontFamilyMono,
    fontSize: `${typography.sizes.base}px`,
    lineHeight: 1,
  },
  smallIcon: {
    width: "16px",
    height: "16px",
    display: "block",
  },
  disabledButton: {
    ...botonBase(),
    border: "1px solid transparent",
    background: "transparent",
    color: colors.ink30,
    opacity: 0.6,
    cursor: "default",
  },
  /** Glifo Auto: ● (activo) / ○ (pausado). NO verde. */
  stickyBadge: {
    height: "26px",
    display: "inline-flex",
    alignItems: "center",
    padding: "0 8px",
    border: `${stroke.hairline}px solid ${colors.ink30}`,
    background: colors.paper,
    color: colors.ink,
    fontSize: `${typography.sizes.sm}px`,
    fontWeight: typography.weights.medium,
    whiteSpace: "nowrap",
  },
  anchorNudge: {
    height: "26px",
    display: "inline-flex",
    alignItems: "center",
    padding: "0 8px",
    border: `${stroke.hairline}px solid ${colors.ink30}`,
    background: colors.paper,
    color: colors.ink,
    fontSize: `${typography.sizes.sm}px`,
    fontWeight: typography.weights.medium,
    whiteSpace: "nowrap",
  },
  readOnlyBadge: {
    height: "26px",
    display: "inline-flex",
    alignItems: "center",
    padding: "0 8px",
    border: `${stroke.hairline}px solid ${colors.ink15}`,
    background: colors.ink04,
    color: colors.ink70,
    fontSize: `${typography.sizes.sm}px`,
    fontWeight: typography.weights.medium,
    whiteSpace: "nowrap",
  },
  lockIcon: {
    width: "13px",
    height: "13px",
    marginRight: "6px",
    verticalAlign: "-2px",
  },
  title: {
    flex: "0 0 auto",
    maxWidth: "210px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: colors.ink,
    fontSize: `${typography.sizes.base}px`,
    fontWeight: typography.weights.semibold,
    whiteSpace: "nowrap",
  },
  archiveBadge: {
    display: "inline-flex",
    alignItems: "center",
    height: "20px",
    padding: "0 6px",
    border: `${stroke.hairline}px solid ${colors.ink15}`,
    color: colors.ink70,
    background: colors.paper,
    fontSize: `${typography.sizes.xxs}px`,
    fontWeight: typography.weights.medium,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    lineHeight: 1,
    flex: "0 0 auto",
  },
  versionButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    height: "24px",
    padding: "0 7px",
    border: `${stroke.hairline}px solid ${colors.ink30}`,
    background: colors.paper,
    color: colors.ink,
    cursor: "pointer",
    fontSize: `${typography.sizes.sm}px`,
    fontWeight: typography.weights.medium,
    flex: "0 0 auto",
  },
  versionIcon: {
    width: "14px",
    height: "14px",
  },
  secondaryButton: {
    height: "34px",
    padding: "0 12px",
    border: `${stroke.hairline}px solid ${colors.ink30}`,
    background: colors.paper,
    color: colors.ink70,
    cursor: "pointer",
    fontSize: `${typography.sizes.base}px`,
    whiteSpace: "nowrap",
  },
  divider: {
    width: "1px",
    height: "22px",
    flex: "0 0 auto",
    margin: `0 ${spacing.xs}px`,
    background: colors.ink15,
  },
  inlineStatus: {
    height: "24px",
    padding: "0 2px",
    border: "none",
    background: "transparent",
    color: colors.ink70,
    cursor: "default",
    fontFamily: typography.fontFamily,
    fontSize: `${typography.sizes.sm}px`,
    fontWeight: typography.weights.medium,
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    boxShadow: "none",
  },
  inlineStatusButton: {
    height: "24px",
    padding: "0 2px",
    border: "none",
    background: "transparent",
    color: colors.ink70,
    cursor: "pointer",
    fontFamily: typography.fontFamily,
    fontSize: `${typography.sizes.sm}px`,
    fontWeight: typography.weights.medium,
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    boxShadow: "none",
  },
  statusDot: {
    color: colors.ink70,
    fontFamily: typography.fontFamilyMono,
    fontSize: `${typography.sizes.xs}px`,
    lineHeight: 1,
  },
  statusDotPending: {
    color: colors.crimson,
    fontFamily: typography.fontFamilyMono,
    fontSize: `${typography.sizes.xs}px`,
    lineHeight: 1,
  },
  statusLabel: {
    lineHeight: 1,
  },
  statusKbd: {
    color: colors.ink70,
    fontFamily: typography.fontFamilyMono,
    fontSize: `${typography.sizes.xs}px`,
    fontWeight: typography.weights.medium,
    letterSpacing: 0,
    lineHeight: 1,
  },
  autosaveIdle: {
    color: colors.ink50,
    fontSize: `${typography.sizes.sm}px`,
    fontWeight: typography.weights.medium,
    whiteSpace: "nowrap",
    cursor: "default",
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  },
  autosaveSaving: {
    color: colors.ink,
    fontSize: `${typography.sizes.sm}px`,
    fontWeight: typography.weights.semibold,
    whiteSpace: "nowrap",
    cursor: "default",
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  },
  selectionCount: {
    color: colors.ink70,
    fontSize: `${typography.sizes.sm}px`,
    fontWeight: typography.weights.semibold,
    whiteSpace: "nowrap",
  },
  compactSelect: {
    height: "34px",
    width: "136px",
    border: `${stroke.hairline}px solid ${colors.ink30}`,
    borderRadius: `${radii.xs}px`,
    background: colors.paper,
    color: colors.ink,
    fontSize: `${typography.sizes.base}px`,
    fontWeight: typography.weights.medium,
  },
  nombreModal: {
    position: "fixed",
    zIndex: 42,
    top: "58px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "end",
    gap: "8px",
    padding: "12px",
    border: `${stroke.base}px solid ${colors.ink}`,
    background: colors.paper,
    boxShadow: "none",
  },
  nombreField: {
    display: "grid",
    gap: "4px",
  },
  nombreLabel: {
    color: colors.ink70,
    fontSize: `${typography.sizes.sm}px`,
    fontWeight: typography.weights.medium,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  nombreInput: {
    width: "220px",
    height: "32px",
    border: `${stroke.hairline}px solid ${colors.ink30}`,
    background: colors.paper,
    color: colors.ink,
    padding: "0 8px",
    fontFamily: typography.fontFamily,
    fontSize: `${typography.sizes.base}px`,
  },
  primarySmall: {
    height: "32px",
    border: `${stroke.hairline}px solid ${colors.ink}`,
    background: colors.ink,
    color: colors.paper,
    cursor: "pointer",
    fontSize: `${typography.sizes.base}px`,
    fontWeight: typography.weights.semibold,
    padding: "0 14px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;

export function dragToolbar(tipo: TipoEntidad) {
  return (event: DragEvent) => {
    event.dataTransfer?.setData("application/x-opm-tipo", tipo);
    event.dataTransfer?.setData("text/plain", tipo);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "copy";
  };
}

export function dragAtributoNumerico(event: DragEvent) {
  event.dataTransfer?.setData("application/x-opm-atributo-numerico", "float");
  event.dataTransfer?.setData("text/plain", "atributo-numerico");
  if (event.dataTransfer) event.dataTransfer.effectAllowed = "copy";
}

export function siguienteModoGlobal(modo: ModoImagenEntidad | null): ModoImagenEntidad | null {
  if (modo === null) return "imagen-texto";
  if (modo === "imagen-texto") return "imagen";
  if (modo === "imagen") return "texto";
  return null;
}

export function etiquetaModoGlobal(modo: ModoImagenEntidad | null): string {
  if (modo === "imagen-texto") return "imagen + nombre";
  if (modo === "imagen") return "solo imagen";
  if (modo === "texto") return "solo nombre";
  return "por cosa";
}

/**
 * Botón base ronda 28 L2: stroke 1.5px ink, fondo paper, padding 8px 14px,
 * radius 0. La paleta es ink/paper estrictamente — el color sólo aparece en
 * focus-visible (ultramar, via focus.css) o accent-soft (cinabrio, en
 * selección de input activo).
 */
function botonBase(): preact.JSX.CSSProperties {
  return {
    height: "32px",
    padding: "0 14px",
    border: `${stroke.base}px solid ${colors.ink}`,
    background: colors.paper,
    color: colors.ink,
    cursor: "pointer",
    fontFamily: typography.fontFamily,
    fontSize: `${typography.sizes.base}px`,
    fontWeight: typography.weights.medium,
    whiteSpace: "nowrap",
    transition: "background 150ms ease-out",
  };
}

/**
 * Palabra del top-bar Codex (Ronda v2 L2): acción como texto + glifo, sin
 * caja con borde ni fondo. Hereda la tipografía del chrome; el hover/active se
 * resuelve por `toolbar.css` (wash ink-04) y el subrayado accent en activo. La
 * altura de 32px se mantiene para no descuadrar el button-strip de 60px.
 */
function palabraTopBar(): preact.JSX.CSSProperties {
  return {
    height: "32px",
    padding: "0 10px",
    border: "1px solid transparent",
    background: "transparent",
    color: colors.ink,
    cursor: "pointer",
    fontFamily: typography.fontFamily,
    fontSize: `${typography.sizes.base}px`,
    fontWeight: typography.weights.medium,
    whiteSpace: "nowrap",
    transition: "background 150ms ease-out",
  };
}

function accionCreadorTopBar(): preact.JSX.CSSProperties {
  return {
    ...palabraTopBar(),
    padding: "0 8px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    boxShadow: "none",
  };
}
