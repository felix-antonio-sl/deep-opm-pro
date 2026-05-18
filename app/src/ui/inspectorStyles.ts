// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { tokens } from "./tokens";
// Estilos compartidos del Inspector y sus sub-componentes
// (InspectorEntidad, InspectorEnlace y la rama vacia inline). Vive en
// archivo aparte para evitar duplicar tokens visuales y dejar los
// componentes puros de markup.
export const inspectorStyles = {
  panel: {
    minWidth: 0,
    overflow: "auto",
    padding: "14px",
    background: tokens.colors.fondoChrome,
    // ronda 23 chrome: bordeIntermedio → bordeSuave para una separación
    // editorial menos competitiva con el canvas. El inspector va full-height
    // contra el borde derecho, así que no aplica box-shadow (sería invisible).
    borderLeft: `1px solid ${tokens.colors.bordeSuave}`,
  },
  empty: {
    color: tokens.colors.textoTerciario,
    fontSize: "13px",
  },
  // P1 — Inspector vacío: jerarquía título / body / card "Atajos para empezar".
  vacioContainer: {
    color: tokens.colors.textoTerciario,
    fontSize: tokens.typography.sizes.md,
  },
  vacioTitle: {
    margin: `0 0 ${tokens.spacing.sm}px`,
    color: tokens.colors.textoPrimario,
    fontSize: tokens.typography.sizes.lg,
    fontWeight: tokens.typography.weights.bold,
  },
  vacioBody: {
    margin: `0 0 ${tokens.spacing.md}px`,
    color: tokens.colors.textoSecundario,
    fontSize: tokens.typography.sizes.md,
    lineHeight: 1.5,
  },
  vacioCard: {
    padding: tokens.spacing.md,
    border: `1px solid ${tokens.colors.bordeChrome}`,
    borderRadius: tokens.radii.md,
    background: tokens.colors.fondoCard,
  },
  vacioCaption: {
    margin: `0 0 ${tokens.spacing.sm}px`,
    color: tokens.colors.textoSecundario,
    // ronda 23 chrome: caption "ATAJOS PARA EMPEZAR" en formato editorial
    // más pequeño y espacioso. 11px → 10px (xxs) y letter-spacing 0.04 →
    // 0.08em — los all-caps cortos respiran mejor en tamaño pequeño.
    fontSize: tokens.typography.sizes.xxs,
    fontWeight: tokens.typography.weights.semibold,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  vacioList: {
    margin: 0,
    paddingLeft: tokens.spacing.lg,
    lineHeight: 1.6,
    fontSize: tokens.typography.sizes.md,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    marginBottom: "16px",
  },
  kind: {
    color: tokens.colors.textoPrimario,
    fontSize: "13px",
    fontWeight: 700,
  },
  id: {
    color: tokens.colors.textoTerciario,
    fontSize: "12px",
  },
  field: {
    display: "grid",
    gap: "6px",
    marginBottom: "14px",
  },
  label: {
    color: tokens.colors.textoSecundario,
    fontSize: "12px",
    fontWeight: 700,
  },
  summary: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
    padding: "10px",
    border: `1px solid ${tokens.colors.bordeIntermedio}`,
    borderRadius: tokens.radii.sm,
    color: tokens.colors.textoPrimario,
    fontSize: "13px",
    fontWeight: 600,
  },
  arrow: {
    color: tokens.colors.chromeNeutral,
    fontWeight: 700,
  },
  input: {
    width: "100%",
    height: "34px",
    padding: "0 10px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    color: tokens.colors.textoPrimario,
    background: tokens.colors.fondoChrome,
    outlineColor: tokens.colors.chromeNeutral,
  },
  segmented: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "6px",
  },
  // ronda 23 chrome: radii sm→md (con los nuevos tokens queda 8px) y peso
  // bajado a 500/600. El segmented era pesado para una elección binaria.
  segment: {
    height: "32px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.md,
    background: tokens.colors.fondoCard,
    color: tokens.colors.textoSecundario,
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: tokens.typography.weights.medium,
  },
  segmentActive: {
    height: "32px",
    border: `1px solid ${tokens.colors.chromeNeutral}`,
    borderRadius: tokens.radii.md,
    background: tokens.colors.chromeNeutralSuave,
    color: tokens.colors.textoPrimario,
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: tokens.typography.weights.semibold,
  },
  menu: {
    marginBottom: "10px",
  },
  menuSummary: {
    width: "100%",
    minHeight: "32px",
    padding: "8px 10px",
    border: `1px solid ${tokens.colors.infoBorde}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.infoFondo,
    color: tokens.colors.infoTextoOscuro,
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
    listStylePosition: "inside",
  },
  menuItems: {
    display: "grid",
    gap: "6px",
    paddingTop: "8px",
  },
  menuButton: {
    width: "100%",
    minHeight: "32px",
    padding: "0 10px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoCard,
    color: tokens.colors.textoPrimario,
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
    textAlign: "left",
  },
  primaryButton: {
    width: "100%",
    height: "32px",
    marginBottom: "10px",
    border: `1px solid ${tokens.colors.infoBorde}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.infoFondo,
    color: tokens.colors.infoTextoOscuro,
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
  },
  secondaryButton: {
    width: "100%",
    height: "32px",
    marginBottom: "10px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoCard,
    color: tokens.colors.textoSecundario,
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
  },
  dangerButton: {
    width: "100%",
    height: "32px",
    border: `1px solid ${tokens.colors.errorBase}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.errorFondo,
    color: tokens.colors.errorTexto,
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
  },
  oplEditButton: {
    width: "100%",
    height: "32px",
    marginTop: "8px",
    border: `1px solid ${tokens.colors.chromeNeutral}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.neutralBadge,
    color: tokens.colors.textoSlate,
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
  },
  // L1 ronda 20 — Tabs del Inspector (5 entidad / 3 enlace).
  // Decisión bloqueada §10 brief: solo texto (sin iconos), peso 700 al activo.
  // Divisor: gap mayor entre tabs y borde inferior 1px sutil sobre la fila
  // (recomendado en §10) en vez de línea sólida entre tabs.
  // ronda 23 chrome: tabs estilo editorial — bottom-border en lugar de
  // background fill. Sin fondo activo: el peso visual viene del color del
  // texto + del subrayado en acentoUi. Padding lateral generoso (spacing.md)
  // para que el target sea cómodo. La fila no necesita borderBottom propio
  // porque cada tab pinta su propio 2px (transparente en inactivos).
  tabsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: `${tokens.spacing.sm}px`,
    marginBottom: `${tokens.inspectorTabs.marginBottom}px`,
    borderBottom: `1px solid ${tokens.colors.bordeSuave}`,
  },
  tab: {
    flex: "0 0 auto",
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    border: 0,
    borderBottom: "2px solid transparent",
    background: "transparent",
    color: tokens.inspectorTabs.textInactive,
    cursor: "pointer",
    fontSize: `${tokens.inspectorTabs.fontSize}px`,
    fontWeight: tokens.typography.weights.medium,
    lineHeight: 1.2,
    marginBottom: "-1px",
  },
  tabActive: {
    flex: "0 0 auto",
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    border: 0,
    borderBottom: `2px solid ${tokens.colors.acentoUi}`,
    background: "transparent",
    color: tokens.inspectorTabs.textActive,
    cursor: "pointer",
    fontSize: `${tokens.inspectorTabs.fontSize}px`,
    fontWeight: tokens.typography.weights.semibold,
    lineHeight: 1.2,
    marginBottom: "-1px",
  },
  tabPanel: {
    display: "grid",
    gap: `${tokens.inspectorTabs.panelGap}px`,
  },
  // Hint compacto del banner cobertura cuando aparece en tab Semántica.
  // Sustituye al banner inline original; sigue siendo hint visual idéntico
  // pero más conciso y clickeable hacia el tab Apariciones.
  coberturaHint: {
    margin: `0 0 ${tokens.spacing.sm}px`,
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    border: `1px solid ${tokens.colors.infoBordeSuave}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.infoFondoClaro,
    color: tokens.colors.infoTextoOscuro,
    cursor: "pointer",
    font: "inherit",
    fontSize: `${tokens.typography.sizes.xs}px`,
    fontWeight: tokens.typography.weights.bold,
    textAlign: "left",
    width: "100%",
  },
  // L1 ronda 20 — Tab Apariciones: lista plana de OPDs (decisión §10 brief).
  // Items clickeables que navegan al OPD donde aparece la entidad; el ítem
  // del OPD activo se marca con `aparicionItemActivo` y `disabled`.
  aparicionesList: {
    display: "grid",
    gap: `${tokens.spacing.xs}px`,
  },
  aparicionItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: `${tokens.spacing.xs}px`,
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    border: `1px solid ${tokens.colors.bordeChrome}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoCard,
    color: tokens.colors.textoPrimario,
    cursor: "pointer",
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.semibold,
    textAlign: "left",
  },
  aparicionItemActivo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: `${tokens.spacing.xs}px`,
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    border: `1px solid ${tokens.colors.chromeNeutral}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.chromeNeutralSuave,
    color: tokens.colors.textoPrimario,
    cursor: "default",
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.bold,
    textAlign: "left",
  },
  aparicionOpdNombre: {
    color: tokens.colors.textoPrimario,
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.bold,
  },
  aparicionMeta: {
    color: tokens.colors.textoSecundario,
    fontSize: `${tokens.typography.sizes.xs}px`,
    fontWeight: tokens.typography.weights.semibold,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  aparicionEmpty: {
    margin: 0,
    color: tokens.colors.textoTerciario,
    fontSize: `${tokens.typography.sizes.sm}px`,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
