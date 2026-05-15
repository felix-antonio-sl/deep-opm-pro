/**
 * Estilos compartidos del Toolbar L1. [JOYAS §1-3], [V-0c], [V-63].
 */
import type { ModoImagenEntidad, TipoEntidad } from "../../modelo/tipos";
import { colors, spacing, typography } from "../tokens";

/**
 * Toolbar ronda 13 L1: chrome UI basado en [JOYAS §1-3] y SSOT visual [V-0c]/[V-63].
 * Contrato tecnico: T2.1 opcion B + T2.6, con acciones IFML H-2/H-5/H-10/H-12 nombradas.
 */
export const toolbarStyle = {
  bar: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "7px 12px",
    background: "#ffffff",
    borderBottom: "1px solid #d9e0ea",
    overflow: "hidden",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "0",
    minWidth: 0,
    flex: "1 1 auto",
    overflowX: "auto",
  },
  cluster: {
    display: "inline-flex",
    alignItems: "center",
    gap: `${spacing.xs}px`,
    padding: `0 ${spacing.xs}px`,
    minWidth: 0,
    flex: "0 0 auto",
  },
  clusterLabel: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    whiteSpace: "nowrap",
    border: 0,
  },
  menuWrapper: {
    position: "relative",
    flex: "0 0 auto",
  },
  iconButton: {
    width: "30px",
    height: "30px",
    border: `1px solid ${colors.bordeInput}`,
    borderRadius: "4px",
    background: colors.fondoCard,
    color: colors.textoPrimario,
    cursor: "pointer",
    fontSize: `${typography.sizes.lg}px`,
    fontWeight: typography.weights.bold,
    lineHeight: 1,
  },
  button: botonBase(),
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
    border: "1px solid #d9e0ea",
    background: "#f2f4f7",
    color: "#98a2b3",
    cursor: "default",
  },
  stickyBadge: {
    height: "26px",
    display: "inline-flex",
    alignItems: "center",
    padding: "0 8px",
    border: `1px solid ${colors.acentoUi}`,
    borderRadius: "4px",
    background: colors.acentoUiSuave,
    color: "#1f2937",
    fontSize: "12px",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },
  readOnlyBadge: {
    height: "26px",
    display: "inline-flex",
    alignItems: "center",
    padding: "0 8px",
    border: `1px solid ${colors.chromeNeutral}`,
    borderRadius: "4px",
    background: "#eef2f6",
    color: "#344054",
    fontSize: "12px",
    fontWeight: 800,
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
    color: "#1f2937",
    fontSize: "13px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  archiveBadge: {
    display: "inline-flex",
    alignItems: "center",
    height: "20px",
    padding: "0 6px",
    border: "1px solid #c8d2df",
    borderRadius: "4px",
    color: colors.chromeNeutral,
    background: "#ffffff",
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
    border: "1px solid #c8d2df",
    borderRadius: "4px",
    background: "#f9fbfd",
    color: "#475467",
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
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    background: "#ffffff",
    color: "#475467",
    cursor: "pointer",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },
  linkPicker: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    height: "34px",
    flex: "0 0 auto",
  },
  linkPickerCompat: {
    display: "inline-flex",
    width: "1px",
    height: "30px",
    overflow: "hidden",
    opacity: 0,
    flex: "0 0 1px",
  },
  linkPickerLabel: {
    color: "#475467",
    fontSize: "13px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  select: selectBase("#b9c5d4", "#f9fbfd", "#1f2937", "pointer", 600),
  activeSelect: selectBase(colors.chromeNeutral, colors.chromeNeutralSuave, "#1f2937", "default", 700),
  disabledSelect: selectBase("#d9e0ea", "#f2f4f7", "#98a2b3", "not-allowed", 600),
  selectCompat: {
    ...selectBase("#b9c5d4", "#f9fbfd", "#1f2937", "pointer", 600),
    width: "1px",
    minWidth: "1px",
    padding: 0,
  },
  divider: {
    width: "1px",
    height: "22px",
    flex: "0 0 auto",
    margin: `0 ${spacing.xs}px`,
    background: colors.bordeChrome,
  },
  status: {
    color: "#475467",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },
  autosaveIdle: {
    color: colors.textoTerciario,
    fontSize: "12px",
    fontWeight: 600,
    whiteSpace: "nowrap",
    cursor: "default",
  },
  autosaveSaving: {
    color: colors.chromeNeutral,
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
    cursor: "default",
  },
  selectionCount: {
    color: "#344054",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  compactSelect: {
    height: "34px",
    width: "136px",
    border: "1px solid #b9c5d4",
    borderRadius: "4px",
    background: "#f9fbfd",
    color: "#1f2937",
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
    border: "1px solid #c8d2df",
    borderRadius: "6px",
    background: "#ffffff",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.16)",
  },
  nombreField: {
    display: "grid",
    gap: "4px",
  },
  nombreLabel: {
    color: "#475467",
    fontSize: "12px",
    fontWeight: 700,
  },
  nombreInput: {
    width: "220px",
    height: "32px",
    border: "1px solid #b9c5d4",
    borderRadius: "4px",
    padding: "0 8px",
    outlineColor: colors.chromeNeutral,
    fontSize: "13px",
  },
  primarySmall: {
    height: "32px",
    border: `1px solid ${colors.chromeNeutral}`,
    borderRadius: "4px",
    background: colors.chromeNeutral,
    color: "#ffffff",
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
  if (modo === "imagen-texto") return "Img+Txt";
  if (modo === "imagen") return "Img";
  if (modo === "texto") return "Texto";
  return "Respeta";
}

function botonBase(): preact.JSX.CSSProperties {
  return {
    height: "30px",
    padding: `0 ${spacing.md}px`,
    border: `1px solid ${colors.bordeInput}`,
    borderRadius: "4px",
    background: colors.fondoCard,
    color: colors.textoPrimario,
    cursor: "pointer",
    fontSize: `${typography.sizes.md}px`,
    fontWeight: typography.weights.semibold,
    whiteSpace: "nowrap",
  };
}

function selectBase(
  border: string,
  background: string,
  color: string,
  cursor: preact.JSX.CSSProperties["cursor"],
  fontWeight: number,
): preact.JSX.CSSProperties {
  return {
    height: "34px",
    width: "148px",
    border: `1px solid ${border}`,
    borderRadius: "4px",
    background,
    color,
    cursor,
    fontSize: "13px",
    fontWeight,
  };
}
