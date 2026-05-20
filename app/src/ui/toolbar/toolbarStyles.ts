/**
 * Estilos compartidos del Toolbar L1. [JOYAS §1-3], [V-0c], [V-63].
 */
import type { ModoImagenEntidad, TipoEntidad } from "../../modelo/tipos";
import { colors, radii, shadows, spacing, typography } from "../tokens";

/**
 * Toolbar ronda 13 L1: chrome UI basado en [JOYAS §1-3] y SSOT visual [V-0c]/[V-63].
 * Contrato tecnico: T2.1 opcion B + T2.6, con acciones IFML H-2/H-5/H-10/H-12 nombradas.
 */
export const toolbarStyle = {
  bar: {
    display: "flex",
    alignItems: "center",
    gap: `${spacing.sm}px`,
    padding: "7px 12px",
    background: colors.acentoSecundario,
    borderBottom: `2px solid ${colors.acentoUi}`,
    boxShadow: "0 12px 30px rgba(14, 44, 63, 0.22)",
    overflow: "hidden",
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
    border: 0,
    color: colors.acentoUiSuave,
    fontSize: `${typography.sizes.xxs}px`,
    fontWeight: typography.weights.heavy,
    textTransform: "uppercase",
    lineHeight: 1,
  },
  menuWrapper: {
    position: "relative",
    flex: "0 0 auto",
  },
  iconButton: {
    width: "30px",
    height: "30px",
    border: `1px solid rgba(221, 247, 255, 0.42)`,
    borderRadius: `${radii.md}px`,
    background: "rgba(255, 255, 255, 0.12)",
    color: colors.fondoChrome,
    cursor: "pointer",
    fontSize: `${typography.sizes.lg}px`,
    fontWeight: typography.weights.bold,
    lineHeight: 1,
  },
  button: botonBase(),
  objectButton: {
    ...botonBase(),
    border: `1px solid ${colors.canvas.objeto}`,
    background: colors.canvas.objeto,
    color: colors.acentoSecundario,
    fontWeight: typography.weights.bold,
  },
  objectActiveButton: {
    ...botonBase(),
    border: `1px solid ${colors.fondoChrome}`,
    background: colors.canvas.objeto,
    color: colors.acentoSecundario,
    fontWeight: typography.weights.bold,
    boxShadow: `0 0 0 2px ${colors.verdeObjetoOscuro} inset`,
  },
  processButton: {
    ...botonBase(),
    border: `1px solid ${colors.canvas.proceso}`,
    background: colors.canvas.proceso,
    color: colors.acentoSecundario,
    fontWeight: typography.weights.bold,
  },
  processActiveButton: {
    ...botonBase(),
    border: `1px solid ${colors.fondoChrome}`,
    background: colors.canvas.proceso,
    color: colors.acentoSecundario,
    fontWeight: typography.weights.bold,
    boxShadow: `0 0 0 2px ${colors.acentoUi} inset`,
  },
  demoSelect: {
    ...botonBase(),
    padding: "0 8px",
  },
  activeButton: {
    ...botonBase(),
    border: `1px solid ${colors.acentoUi}`,
    background: colors.acentoUiSuave,
    fontWeight: 700,
  },
  iconTextButton: {
    ...botonBase(),
    padding: `0 ${spacing.md}px`,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: `${spacing.xs}px`,
  },
  smallIcon: {
    width: "18px",
    height: "18px",
    display: "block",
  },
  disabledButton: {
    ...botonBase(),
    // ronda 23 chrome: la ausencia comunica mejor que la presencia apagada.
    // Antes: borde + fondo + color desaturado (chrome "muerto"). Ahora:
    // transparente con opacity 0.6 — el botón pertenece a la fila pero
    // no compite por la atención visual.
    border: "1px solid transparent",
    background: "transparent",
    color: "rgba(221, 247, 255, 0.48)",
    opacity: 0.6,
    cursor: "default",
  },
  stickyBadge: {
    height: "26px",
    display: "inline-flex",
    alignItems: "center",
    padding: "0 8px",
    border: `1px solid ${colors.acentoUi}`,
    borderRadius: `${radii.pill}px`,
    background: colors.acentoUiSuave,
    color: colors.acentoSecundario,
    fontSize: "12px",
    // ronda 23 chrome: 800→700, era demasiado denso para un status badge.
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  anchorNudge: {
    height: "26px",
    display: "inline-flex",
    alignItems: "center",
    padding: "0 8px",
    border: `1px solid ${colors.infoBordeSuave}`,
    borderRadius: `${radii.pill}px`,
    background: colors.infoFondoClaro,
    color: colors.textoPrimario,
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  readOnlyBadge: {
    height: "26px",
    display: "inline-flex",
    alignItems: "center",
    padding: "0 8px",
    border: `1px solid ${colors.chromeNeutral}`,
    borderRadius: `${radii.pill}px`,
    background: colors.fondoMuted,
    color: colors.textoControl,
    fontSize: "12px",
    // ronda 23 chrome: 800→700, era demasiado denso para un status badge.
    fontWeight: 700,
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
    color: colors.textoPrimario,
    fontSize: "13px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  archiveBadge: {
    display: "inline-flex",
    alignItems: "center",
    height: "20px",
    padding: "0 6px",
    border: `1px solid ${colors.bordeControl}`,
    borderRadius: `${radii.pill}px`,
    color: colors.acentoUiSuave,
    background: "rgba(255, 255, 255, 0.08)",
    fontSize: "10px",
    fontWeight: 800,
    lineHeight: 1,
    flex: "0 0 auto",
  },
  versionButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    height: "24px",
    padding: "0 7px",
    border: `1px solid ${colors.bordeControl}`,
    borderRadius: `${radii.sm}px`,
    background: colors.fondoElevado,
    color: colors.textoPrimario,
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
    flex: "0 0 auto",
  },
  versionIcon: {
    width: "14px",
    height: "14px",
  },
  secondaryButton: {
    height: "34px",
    padding: "0 12px",
    border: `1px solid ${colors.bordeNeutral}`,
    borderRadius: `${radii.md}px`,
    background: colors.fondoChrome,
    color: colors.textoSecundario,
    cursor: "pointer",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },
  divider: {
    width: "1px",
    height: "22px",
    flex: "0 0 auto",
    margin: `0 ${spacing.xs}px`,
    background: "rgba(221, 247, 255, 0.22)",
  },
  autosaveIdle: {
    color: colors.acentoUiSuave,
    fontSize: "12px",
    fontWeight: 600,
    whiteSpace: "nowrap",
    cursor: "default",
  },
  autosaveSaving: {
    color: colors.fondoChrome,
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
    cursor: "default",
  },
  selectionCount: {
    color: colors.acentoUiSuave,
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  compactSelect: {
    height: "34px",
    width: "136px",
    border: `1px solid ${colors.bordeInput}`,
    borderRadius: `${radii.md}px`,
    background: colors.fondoElevado,
    color: colors.textoPrimario,
    fontSize: "13px",
    fontWeight: 600,
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
    padding: "10px",
    border: `1px solid ${colors.bordeControl}`,
    borderRadius: `${radii.lg}px`,
    background: colors.fondoChrome,
    boxShadow: shadows.modal,
  },
  nombreField: {
    display: "grid",
    gap: "4px",
  },
  nombreLabel: {
    color: colors.textoSecundario,
    fontSize: "12px",
    fontWeight: 700,
  },
  nombreInput: {
    width: "220px",
    height: "32px",
    border: `1px solid ${colors.bordeInput}`,
    borderRadius: `${radii.md}px`,
    padding: "0 8px",
    outlineColor: colors.chromeNeutral,
    fontSize: "13px",
  },
  primarySmall: {
    height: "32px",
    border: `1px solid ${colors.chromeNeutral}`,
    borderRadius: `${radii.md}px`,
    background: colors.chromeNeutral,
    color: colors.fondoChrome,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 800,
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

function botonBase(): preact.JSX.CSSProperties {
  return {
    // ronda 23 chrome: 30→32px y padding lateral 14px para respiración.
    height: "32px",
    padding: "0 12px",
    border: `1px solid rgba(221, 247, 255, 0.38)`,
    borderRadius: `${radii.md}px`,
    background: colors.fondoElevado,
    color: colors.textoPrimario,
    cursor: "pointer",
    fontSize: `${typography.sizes.md}px`,
    fontWeight: typography.weights.semibold,
    whiteSpace: "nowrap",
  };
}
