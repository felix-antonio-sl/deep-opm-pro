// [JOYAS §1-3] Estilos del editor OPL honesto. Tokens-only, sin hex literales
// nuevos. Compartido entre EditorOplHonesto y la barra inferior del PanelOpl
// para que la integración no inflen estilos inline duplicados.
import { tokens } from "../tokens";

const sev = tokens.editorOplHonesto.severidades;
const mono = tokens.editorOplHonesto.textareaMono;
const pill = tokens.editorOplHonesto.contadorPill;

export const editorOplStyles = {
  layout: {
    display: "grid",
    gap: tokens.spacing.md,
    border: `1px solid ${tokens.colors.bordeChrome}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoElevado,
    padding: tokens.spacing.md,
  },
  grupo: {
    display: "grid",
    gap: tokens.spacing.xs,
  },
  titulo: {
    margin: 0,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.bold,
    color: tokens.colors.textoPrimario,
    display: "inline-flex",
    alignItems: "center",
    gap: tokens.spacing.xs,
  },
  textarea: {
    minHeight: 220,
    resize: "vertical",
    border: `1px solid ${tokens.colors.bordeNeutral}`,
    borderRadius: tokens.radii.sm,
    padding: tokens.spacing.sm,
    fontFamily: mono.fontFamily,
    fontSize: tokens.typography.sizes.md,
    lineHeight: 1.55,
    color: tokens.colors.textoPrimario,
    background: tokens.colors.fondoChrome,
    tabSize: 2,
  },
  lista: {
    margin: 0,
    padding: 0,
    listStyle: "none",
    display: "grid",
    gap: tokens.spacing.xs,
    fontSize: tokens.typography.sizes.sm,
    fontFamily: mono.fontFamily,
  },
  listaVacia: {
    margin: 0,
    padding: `${tokens.spacing.xs}px 0`,
    fontSize: tokens.typography.sizes.sm,
    color: tokens.colors.textoTerciario,
    fontStyle: "italic" as const,
  },
  itemBase: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: tokens.spacing.sm,
    alignItems: "baseline",
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    borderLeft: `3px solid ${tokens.colors.bordeNeutral}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.fondoChrome,
  },
  itemAplicable: {
    borderLeftColor: sev.aplicable.bordeIzq,
    background: sev.aplicable.fondo,
  },
  itemNoAplicable: {
    borderLeftColor: sev.noAplicable.bordeIzq,
    background: sev.noAplicable.fondo,
  },
  itemSinCambio: {
    borderLeftColor: sev.sinCambio.bordeIzq,
    background: sev.sinCambio.fondo,
  },
  numeroLinea: {
    color: tokens.colors.textoTerciario,
    fontVariantNumeric: "tabular-nums" as const,
    fontWeight: tokens.typography.weights.semibold,
    minWidth: 28,
    textAlign: "right" as const,
  },
  textoLinea: {
    color: tokens.colors.textoPrimario,
    wordBreak: "break-word" as const,
    whiteSpace: "pre-wrap" as const,
  },
  cambioDescripcion: {
    color: sev.aplicable.texto,
    fontWeight: tokens.typography.weights.semibold,
  },
  razonLinea: {
    color: sev.noAplicable.texto,
    fontSize: tokens.typography.sizes.xs,
  },
  citaSsot: {
    color: tokens.colors.textoTerciario,
    fontSize: tokens.typography.sizes.xxs,
    marginLeft: tokens.spacing.xs,
  },
  contadorPillNeutro: {
    fontSize: tokens.typography.sizes.xs,
    fontWeight: tokens.typography.weights.bold,
    padding: "1px 8px",
    borderRadius: tokens.radii.pill,
    background: pill.fondoNeutro,
    color: pill.textoNeutro,
    fontVariantNumeric: "tabular-nums" as const,
  },
  contadorPillExito: {
    fontSize: tokens.typography.sizes.xs,
    fontWeight: tokens.typography.weights.bold,
    padding: "1px 8px",
    borderRadius: tokens.radii.pill,
    background: pill.fondoExito,
    color: pill.textoExito,
    fontVariantNumeric: "tabular-nums" as const,
  },
  contadorPillAlerta: {
    fontSize: tokens.typography.sizes.xs,
    fontWeight: tokens.typography.weights.bold,
    padding: "1px 8px",
    borderRadius: tokens.radii.pill,
    background: pill.fondoAlerta,
    color: pill.textoAlerta,
    fontVariantNumeric: "tabular-nums" as const,
  },
  footer: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacing.sm,
    paddingTop: tokens.spacing.xs,
    borderTop: `1px solid ${tokens.colors.bordeSuave}`,
  },
  resumenInline: {
    color: tokens.colors.textoSecundario,
    fontSize: tokens.typography.sizes.sm,
    marginRight: "auto",
    fontVariantNumeric: "tabular-nums" as const,
  },
  btnBase: {
    height: 30,
    border: `1px solid ${tokens.colors.bordeNeutral}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoTabla,
    color: tokens.colors.textoSlate,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.bold,
    padding: "4px 12px",
    cursor: "pointer",
  },
  btnPrimarioActivo: {
    borderColor: sev.aplicable.bordeIzq,
    background: sev.aplicable.fondo,
    color: sev.aplicable.texto,
  },
  btnDisabled: { opacity: 0.5, cursor: "not-allowed" },
  // Rail minimizado: jerarquía visual estable; el contenido textual se
  // mantiene como `OPL · {N} oraciones · Restaurar` para preservar smokes.
  rail: {
    width: "100%",
    height: "100%",
    minHeight: 28,
    border: 0,
    borderTop: `1px solid ${tokens.colors.bordeIntermedio}`,
    background: tokens.colors.fondoElevado,
    color: tokens.colors.textoSlate,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.bold,
    cursor: "pointer",
    textAlign: "left" as const,
    padding: `4px ${tokens.spacing.md}px`,
    display: "flex",
    alignItems: "center",
    gap: tokens.spacing.sm,
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
  },
  railLabel: {
    fontWeight: tokens.typography.weights.heavy,
    color: tokens.colors.textoPrimario,
    letterSpacing: "0.04em",
  },
  railSeparador: {
    color: tokens.colors.bordeIntermedio,
  },
  railContador: {
    color: tokens.colors.textoSlate,
    fontVariantNumeric: "tabular-nums" as const,
    fontWeight: tokens.typography.weights.semibold,
  },
  railRestaurar: {
    color: tokens.colors.textoTerciario,
    fontWeight: tokens.typography.weights.normal,
    marginLeft: "auto",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
