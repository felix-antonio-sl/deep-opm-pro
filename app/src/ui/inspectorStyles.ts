// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
// Ronda 28 L3: paleta Bauhaus aplicada — header sin uppercase para nombres
// de usuario, labels de sección uppercase tracking +0.08em, inputs ink-15
// con caret cinabrio, tabs subrayadas sin background, toggles ink + paper.
import { tokens } from "./tokens";

// Estilos compartidos del Inspector y sus sub-componentes
// (InspectorEntidad, InspectorEnlace y la rama vacia inline). Vive en
// archivo aparte para evitar duplicar tokens visuales y dejar los
// componentes puros de markup.
//
// Las keys se conservan estables (no rename) para que las secciones que
// los consumen sigan compilando sin tocar markup. Lo que cambia es la
// expresión visual: colores ink/paper, stroke 1px ink-15, radii 2px,
// labels en mayúscula tracking +0.08em.
export const inspectorStyles = {
  panel: {
    minWidth: 0,
    overflow: "auto",
    padding: "14px 14px 18px",
    background: tokens.colors.paper,
    borderLeft: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
  },
  empty: {
    color: tokens.colors.ink50,
    fontSize: `${tokens.typography.sizes.base}px`,
  },
  // Inspector vacío: identidad del modelo. Sin tarjetas decorativas.
  vacioContainer: {
    display: "grid",
    gap: `${tokens.spacing.sm}px`,
    color: tokens.colors.ink50,
    fontSize: tokens.typography.sizes.md,
  },
  vacioTituloBoton: {
    margin: 0,
    padding: `${tokens.spacing.xs}px 0`,
    border: 0,
    background: "transparent",
    color: tokens.colors.ink,
    fontSize: `${tokens.typography.sizes.lg}px`,
    fontWeight: tokens.typography.weights.bold,
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
    letterSpacing: 0,
  },
  // Placeholder editorial de la rama vacía (Codex v2 / L3, reemplaza los
  // contadores N objetos · N procesos · N OPDs). Italic serif calmado.
  vacioPlaceholder: {
    margin: 0,
    color: tokens.colors.ink50,
    fontFamily: tokens.typography.familyChrome,
    fontSize: `${tokens.typography.sizes.base}px`,
    fontStyle: "italic",
    lineHeight: 1.5,
  },
  // Sello de última edición bajo el placeholder. Mono discreto.
  vacioMeta: {
    margin: 0,
    color: tokens.colors.ink30,
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: `${tokens.typography.sizes.xxs}px`,
    letterSpacing: tokens.typography.ls.mono,
    lineHeight: 1.5,
  },
  // Header del Inspector: nombre del kind ("Objeto"/"Proceso"/"Enlace …")
  // como heading editorial — Inter Tight 700/15 NO uppercase (es identidad,
  // no UI label). Borde inferior 1.5px ink. ID interno (jetBrains mono 10
  // ink-30) sigue accesible vía title/data-attr para deeplink/debug.
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: `${tokens.spacing.sm}px`,
    marginBottom: `${tokens.spacing.md}px`,
    paddingBottom: `${tokens.spacing.sm}px`,
    borderBottom: `${tokens.stroke.base}px solid ${tokens.colors.ink}`,
  },
  kind: {
    color: tokens.colors.ink,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "15px",
    fontWeight: tokens.typography.weights.bold,
    letterSpacing: 0,
    textTransform: "none" as const,
    lineHeight: 1.2,
  },
  id: {
    color: tokens.colors.ink30,
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: `${tokens.typography.sizes.xxs}px`,
    fontWeight: tokens.typography.weights.medium,
  },
  field: {
    display: "grid",
    gap: `${tokens.spacing.xs}px`,
    marginBottom: `${tokens.spacing.md}px`,
  },
  // Label de sección Bauhaus: Inter Tight 500/10 uppercase tracking +0.08em
  // ink-70. Las secciones pueden además aplicar la clase
  // `.opm-label-uppercase` (utility global) cuando se renderice como <span>.
  label: {
    color: tokens.colors.ink70,
    fontSize: `${tokens.typography.sizes.xxs}px`,
    fontWeight: tokens.typography.weights.medium,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
  },
  // Summary del enlace (origen → destino). Caja chrome ink-15, fondo paper.
  summary: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: `${tokens.spacing.sm}px`,
    marginBottom: `${tokens.spacing.md}px`,
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    fontSize: `${tokens.typography.sizes.base}px`,
    fontWeight: tokens.typography.weights.semibold,
  },
  arrow: {
    color: tokens.colors.ink50,
    fontWeight: tokens.typography.weights.bold,
  },
  // Input estándar Bauhaus: border 1px ink-15, padding 7px 10px, fondo
  // paper, font 13px ink. El focus lo aplican los componentes via
  // outlineColor focus + caretColor accent.
  input: {
    width: "100%",
    height: "32px",
    padding: "7px 10px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    color: tokens.colors.ink,
    background: tokens.colors.paper,
    outlineColor: tokens.colors.focus,
    caretColor: tokens.colors.accent,
    fontFamily: tokens.typography.familyChrome,
    fontSize: `${tokens.typography.sizes.base}px`,
    boxSizing: "border-box" as const,
  },
  // Toggle binario (Esencia, Afiliación). Grid 2 col, border 1.5px ink.
  segmented: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 0,
    border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`,
    borderRadius: tokens.radii.xs,
    overflow: "hidden",
  },
  segment: {
    height: "30px",
    border: 0,
    borderRadius: 0,
    background: tokens.colors.paper,
    color: tokens.colors.ink70,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.medium,
    letterSpacing: 0,
    transition: tokens.transitions.fast,
  },
  segmentActive: {
    height: "30px",
    border: 0,
    borderRadius: 0,
    background: tokens.colors.ink,
    color: tokens.colors.paper,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.semibold,
    letterSpacing: 0,
    transition: tokens.transitions.fast,
  },
  // Hint inline bajo los toggles. Inter Tight 11px ink-70 line-height 1.5.
  hint: {
    margin: 0,
    color: tokens.colors.ink70,
    fontSize: `${tokens.typography.sizes.xs}px`,
    fontWeight: tokens.typography.weights.normal,
    lineHeight: 1.5,
  },
  menu: {
    marginBottom: `${tokens.spacing.sm}px`,
  },
  // Menú collapsible: estética Bauhaus — fondo paper, borde 1px ink-15.
  menuSummary: {
    width: "100%",
    minHeight: "32px",
    padding: "7px 10px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    cursor: "pointer",
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.semibold,
    listStylePosition: "inside",
  },
  menuItems: {
    display: "grid",
    gap: `${tokens.spacing.xs}px`,
    paddingTop: `${tokens.spacing.sm}px`,
  },
  menuButton: {
    width: "100%",
    minHeight: "32px",
    padding: "7px 10px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    cursor: "pointer",
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.semibold,
    textAlign: "left",
    transition: tokens.transitions.fast,
  },
  // Botón primario Bauhaus: fondo ink + texto paper. Sin glow.
  primaryButton: {
    width: "100%",
    height: "32px",
    marginBottom: `${tokens.spacing.sm}px`,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.ink,
    color: tokens.colors.paper,
    cursor: "pointer",
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.semibold,
    letterSpacing: 0,
    transition: tokens.transitions.fast,
  },
  // Botón secundario Bauhaus: outline ink-15, texto ink, fondo paper.
  secondaryButton: {
    width: "100%",
    height: "32px",
    marginBottom: `${tokens.spacing.sm}px`,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    cursor: "pointer",
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.semibold,
    letterSpacing: 0,
    transition: tokens.transitions.fast,
  },
  // Botón destructivo: outline cinabrio, texto cinabrio-dark sobre paper.
  // El fondo accentSoft sólo se aplicaría en hover; aquí dejamos chrome
  // calmado para no gritar.
  dangerButton: {
    width: "100%",
    height: "32px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.accent}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    color: tokens.colors.accentDark,
    cursor: "pointer",
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.semibold,
    letterSpacing: 0,
    transition: tokens.transitions.fast,
  },
  // Botón "Editar OPL": secundario, sin gritos.
  oplEditButton: {
    width: "100%",
    height: "32px",
    marginTop: `${tokens.spacing.sm}px`,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    color: tokens.colors.ink70,
    cursor: "pointer",
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.semibold,
    letterSpacing: 0,
    transition: tokens.transitions.fast,
  },
  // ── Ficha continua (Codex C9: sin tabs) ─────────────────────────────────
  // Ronda Codex v2 / L3: el Inspector dejó de ser un sistema de tabs y pasó
  // a una ficha tipográfica continua. Las secciones existentes (Seccion*.tsx)
  // se apilan verticalmente, cada una bajo un kicker mono uppercase y
  // separada de la anterior por una hairline superior (ui-forja §9
  // CodexInspectSection: kicker uppercase tracked + border-top hairline).
  // Anti-patrón explícito ui-forja §02:483 — "Tabs con underline-active
  // gruesa" está prohibido.
  ficha: {
    display: "grid",
    gap: `${tokens.spacing.lg}px`,
  },
  // Bloque de sección: kicker + contenido. Border-top hairline salvo el
  // primero (lo neutraliza el consumidor con `fichaSeccionPrimera`).
  fichaSeccion: {
    display: "grid",
    gap: `${tokens.spacing.md}px`,
    paddingTop: `${tokens.spacing.lg}px`,
    borderTop: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
  },
  // Primera sección de la ficha: sin border-top (ya hay separación con el
  // input Nombre / summary).
  fichaSeccionPrimera: {
    display: "grid",
    gap: `${tokens.spacing.md}px`,
    paddingTop: 0,
    borderTop: 0,
  },
  // Kicker mono uppercase tracked (JetBrains Mono 10px, tracking +0.18em,
  // ink-50). Marca cada bloque semántico de la ficha.
  fichaKicker: {
    margin: 0,
    color: tokens.colors.ink50,
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: `${tokens.typography.sizes.xxs}px`,
    fontWeight: tokens.typography.weights.medium,
    textTransform: "uppercase" as const,
    letterSpacing: tokens.typography.ls.kicker,
    lineHeight: 1.2,
  },
  // Contenido apilado de una sección (las Seccion*.tsx ya traen su markup).
  fichaContenido: {
    display: "grid",
    gap: `${tokens.spacing.md}px`,
  },
  // Callout de cobertura ("Aparece en N OPDs"). Codex v2 / L3: ya no es un
  // botón que salta a un tab — la sección Apariciones vive en la misma ficha
  // más abajo. Nota informativa calmada.
  coberturaHint: {
    margin: `0 0 ${tokens.spacing.sm}px`,
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    color: tokens.colors.ink70,
    fontSize: `${tokens.typography.sizes.xs}px`,
    fontWeight: tokens.typography.weights.medium,
    textAlign: "left",
    lineHeight: 1.4,
  },
  // Tab Apariciones: lista plana de OPDs.
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
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    cursor: "pointer",
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.semibold,
    textAlign: "left",
    transition: tokens.transitions.fast,
  },
  // Apariencia activa: borde izquierdo 2px cinabrio (consistente con árbol).
  aparicionItemActivo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: `${tokens.spacing.xs}px`,
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderLeft: `${tokens.stroke.bold}px solid ${tokens.colors.accent}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.ink04,
    color: tokens.colors.ink,
    cursor: "default",
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.bold,
    textAlign: "left",
  },
  aparicionOpdNombre: {
    color: tokens.colors.ink,
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.bold,
  },
  // Meta de apariencia (ordinal, tipo) en mono ink-50.
  aparicionMeta: {
    color: tokens.colors.ink50,
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: `${tokens.typography.sizes.xxs}px`,
    fontWeight: tokens.typography.weights.medium,
    textTransform: "none" as const,
    letterSpacing: 0,
  },
  aparicionEmpty: {
    margin: 0,
    color: tokens.colors.ink50,
    fontSize: `${tokens.typography.sizes.sm}px`,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
