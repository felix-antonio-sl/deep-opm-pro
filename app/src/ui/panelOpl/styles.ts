// [JOYAS §1-3] Estilos del editor OPL honesto. Tokens-only, sin hex literales
// nuevos. Compartido entre EditorOplHonesto y la barra inferior del PanelOpl
// para que la integración no inflen estilos inline duplicados.
//
// Ronda 28 L3: paleta Bauhaus.
//   - layout: borde 1px ink-15, fondo paper, radii 2px.
//   - textarea: outline focus, caret accent, mono.
//   - itemBase: borde lateral 3px según severidad (aplicable/no/sinCambio).
//   - btnPrimarioActivo: fondo ink + paper (botón aplicar habilitado).
import { tokens } from "../tokens";

const sev = tokens.editorOplHonesto.severidades;
const mono = tokens.editorOplHonesto.textareaMono;
const pill = tokens.editorOplHonesto.contadorPill;

export const editorOplStyles = {
  layout: {
    display: "grid",
    gap: tokens.spacing.md,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    padding: tokens.spacing.md,
  },
  grupo: {
    display: "grid",
    gap: tokens.spacing.xs,
  },
  titulo: {
    margin: 0,
    fontSize: tokens.typography.sizes.xs,
    fontWeight: tokens.typography.weights.medium,
    color: tokens.colors.ink70,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    display: "inline-flex",
    alignItems: "center",
    gap: tokens.spacing.sm,
  },
  textarea: {
    minHeight: 220,
    resize: "vertical" as const,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    padding: tokens.spacing.sm,
    fontFamily: mono.fontFamily,
    fontSize: tokens.typography.sizes.sm,
    lineHeight: 1.55,
    color: tokens.colors.ink,
    background: tokens.colors.paper,
    outlineColor: tokens.colors.focus,
    caretColor: tokens.colors.accent,
    tabSize: 2,
  },
  // Ronda24 L3 #10: ayuda inline arriba del textarea — chrome calmado.
  ayuda: {
    display: "grid",
    gap: tokens.spacing.xs,
    padding: tokens.spacing.sm,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.ink04,
    fontSize: tokens.typography.sizes.sm,
    color: tokens.colors.ink70,
  },
  ayudaTitulo: {
    fontWeight: tokens.typography.weights.semibold,
    color: tokens.colors.ink,
    fontSize: tokens.typography.sizes.sm,
  },
  ayudaTexto: {
    margin: 0,
    lineHeight: 1.5,
    color: tokens.colors.ink70,
  },
  ayudaEjemplo: {
    margin: 0,
    padding: tokens.spacing.xs,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    fontFamily: mono.fontFamily,
    fontSize: tokens.typography.sizes.xs,
    color: tokens.colors.ink,
    whiteSpace: "pre-wrap" as const,
    overflowX: "auto" as const,
  },
  // Aviso contextual de familias no editables (no-aplicables estructurales).
  avisoNoEditables: {
    margin: 0,
    padding: tokens.spacing.sm,
    border: `${tokens.stroke.hairline}px solid ${sev.noAplicable.bordeIzq}`,
    borderLeft: `${tokens.stroke.bold}px solid ${sev.noAplicable.bordeIzq}`,
    borderRadius: tokens.radii.xs,
    background: sev.noAplicable.fondo,
    color: sev.noAplicable.texto,
    fontSize: tokens.typography.sizes.sm,
    lineHeight: 1.5,
  },
  lista: {
    margin: 0,
    padding: 0,
    listStyle: "none" as const,
    display: "grid",
    gap: tokens.spacing.xs,
    fontSize: tokens.typography.sizes.sm,
    fontFamily: mono.fontFamily,
  },
  listaVacia: {
    margin: 0,
    padding: `${tokens.spacing.xs}px 0`,
    fontSize: tokens.typography.sizes.sm,
    color: tokens.colors.ink50,
    fontStyle: "italic" as const,
  },
  itemBase: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: tokens.spacing.sm,
    alignItems: "baseline",
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    borderLeft: `${tokens.stroke.bold}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
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
    color: tokens.colors.ink30,
    fontVariantNumeric: "tabular-nums" as const,
    fontWeight: tokens.typography.weights.medium,
    minWidth: 28,
    textAlign: "right" as const,
  },
  textoLinea: {
    color: tokens.colors.ink,
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
    color: tokens.colors.ink50,
    fontSize: tokens.typography.sizes.xxs,
    marginLeft: tokens.spacing.xs,
  },
  contadorPillNeutro: {
    fontSize: tokens.typography.sizes.xxs,
    fontWeight: tokens.typography.weights.semibold,
    padding: "1px 8px",
    borderRadius: tokens.radii.pill,
    background: pill.fondoNeutro,
    color: pill.textoNeutro,
    fontVariantNumeric: "tabular-nums" as const,
  },
  contadorPillExito: {
    fontSize: tokens.typography.sizes.xxs,
    fontWeight: tokens.typography.weights.semibold,
    padding: "1px 8px",
    borderRadius: tokens.radii.pill,
    background: pill.fondoExito,
    color: pill.textoExito,
    fontVariantNumeric: "tabular-nums" as const,
  },
  contadorPillAlerta: {
    fontSize: tokens.typography.sizes.xxs,
    fontWeight: tokens.typography.weights.semibold,
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
    borderTop: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
  },
  resumenInline: {
    color: tokens.colors.ink70,
    fontSize: tokens.typography.sizes.sm,
    marginRight: "auto",
    fontVariantNumeric: "tabular-nums" as const,
  },
  btnBase: {
    height: 30,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.semibold,
    padding: "4px 12px",
    cursor: "pointer",
    transition: tokens.transitions.fast,
  },
  // Botón primario aplicar: fondo ink + paper. La paleta éxito ahora colapsa
  // a ink/ink04 en monocromo, pero un botón primario sigue gritando con tinta
  // negra plena. Mantenemos el contraste para señalar acción confirmada.
  btnPrimarioActivo: {
    borderColor: tokens.colors.ink,
    background: tokens.colors.ink,
    color: tokens.colors.paper,
  },
  btnDisabled: { opacity: 0.5, cursor: "not-allowed" as const },
  // Rail minimizado del panel OPL.
  rail: {
    width: "100%",
    height: "100%",
    minHeight: 28,
    border: 0,
    borderTop: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.medium,
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
    fontFamily: tokens.typography.familyChrome,
    fontWeight: tokens.typography.weights.medium,
    color: tokens.colors.ink70,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    fontSize: tokens.typography.sizes.xxs,
  },
  railSeparador: {
    color: tokens.colors.ink15,
  },
  railContador: {
    color: tokens.colors.ink50,
    fontFamily: tokens.typography.fontFamilyMono,
    fontVariantNumeric: "tabular-nums" as const,
    fontWeight: tokens.typography.weights.medium,
    fontSize: tokens.typography.sizes.sm,
  },
  railRestaurar: {
    color: tokens.colors.ink50,
    fontWeight: tokens.typography.weights.normal,
    fontSize: tokens.typography.sizes.sm,
    marginLeft: "auto",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
