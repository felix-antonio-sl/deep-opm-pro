/**
 * Tokens UI centrales — Ronda 28 L1: Paleta Bauhaus monocromática.
 *
 * Esta es la línea fundacional: L2-L6 consumen estos tokens.
 *
 * Paleta nueva (no negociable, brief Ronda 28):
 *   - ink (#0A0A0A) + paper (#FAFAFA) + escala ink90..ink04 monocromática.
 *   - accent #C8392F cinabrio; accentSoft #F5DDDB tinte.
 *   - focus #1F3FA6 ultramar — sólo focus/selection/links activos.
 *   - warning #B4513C terracota apagada.
 *
 * Compat-shim (aditividad):
 *   Los ~95 alias semánticos heredados (acentoUi, chromeNeutral,
 *   verdeObjetoOscuro, fondoCard, errorTexto, etc.) se conservan en
 *   `colors.*` para que el código existente compile sin tocarse. Cada
 *   alias está mapeado a su equivalente Bauhaus semántico:
 *     - acentos cromáticos → `focus` (ultramar) o `accent` (cinabrio).
 *     - neutros / chromes / fondos / bordes → escala `ink04..ink90`.
 *     - éxito/info chrome → colapsa a ink/focus (mono-cromaticidad).
 *     - error/alerta → `accent` (cinabrio) o `warning`.
 *
 * Canvas (JOYAS §1):
 *   `colors.canvas.*` mantiene la paleta semántica canónica del modelo
 *   OPM (objeto verde / proceso azul / enlace gris). L4 migra el canvas
 *   a CANON-V2 detrás de un flag — esta capa no toca constantes.ts.
 *
 * Reescritura: Bauhaus replaces aqua/cyan corporate. Cero hex bonus, todo
 * el chrome UI vive en monocromo + un único acento cinabrio + focus azul.
 */

// ───────────────────────────────────────────────────────────────────────────
// Paleta Bauhaus base
// ───────────────────────────────────────────────────────────────────────────

const ink = "#0A0A0A";
const paper = "#FAFAFA";
const ink90 = "#1A1A1A";
const ink70 = "#404040";
const ink50 = "#6E6E6E";
const ink30 = "#A8A8A8";
const ink15 = "#D2D2D2";
const ink08 = "#E8E8E8";
const ink04 = "#F2F2F2";
const accent = "#C8392F";
const accentSoft = "#F5DDDB";
// Versión oscura del acento cinabrio para texto sobre accentSoft (WCAG AA).
// El acento puro #C8392F sólo da ~4:1 sobre el tinte; #9F2519 da 5.9:1.
const accentDark = "#9F2519";
const focus = "#1F3FA6";
// Warning ronda 28: terracota apagada más oscura que el brief original
// (#B4513C → #8A3D2D) para cumplir WCAG AA 4.5:1 sobre accentSoft. Sigue
// siendo terracota / no naranja brillante — sólo se profundiza.
const warning = "#8A3D2D";
// Subtono cálido cercano a paper, útil para fondos elevados sin saltar a blanco puro.
const paperWarm = "#FCFCFC";
// Tinte focus ultraligero para selección/hover de elementos azules.
const focusSoft = "#E3E7F4";

export const colors = {
  // ─── Base Bauhaus (canónicos públicos) ───
  ink,
  paper,
  ink90,
  ink70,
  ink50,
  ink30,
  ink15,
  ink08,
  ink04,
  accent,
  accentSoft,
  accentDark,
  focus,
  focusSoft,
  warning,

  // ─── Compat-shim: acentos UI ───
  // Acento primario UI: era azul corporativo #007DB8 → ahora ultramar focus.
  acentoUi: focus,
  acentoUiSuave: focusSoft,
  // Acento secundario: era azul muy oscuro #0E2C3F → ahora ink (negro Bauhaus).
  acentoSecundario: ink,

  // ─── Compat-shim: chrome neutros ───
  // chromeNeutral era #586D8C (gris azulado). Colapsa al gris medio ink50.
  chromeNeutral: ink50,
  chromeNeutralSuave: ink04,

  // ─── Compat-shim: fondos ───
  fondoChrome: paper,
  fondoCard: paper,
  fondoElevado: paperWarm,
  fondoApp: paper,
  fondoInput: paper,
  fondoMuted: ink04,
  fondoNeutral: ink04,
  fondoTabla: paper,
  fondoDeshabilitado: ink04,
  fondoWorkbench: ink04,
  fondoPanel: paper,
  fondoPanelSuave: ink04,

  // ─── Compat-shim: bordes (escala gris) ───
  bordeSuave: ink08,
  bordeChrome: ink15,
  bordeIntermedio: ink15,
  bordeControl: ink30,
  bordeInput: ink30,
  bordeTabla: ink08,
  bordeSlate: ink30,
  bordeNeutral: ink15,
  bordePanel: ink15,

  // ─── Compat-shim: textos ───
  textoPrimario: ink,
  textoSecundario: ink70,
  textoTerciario: ink50,
  textoControl: ink90,
  textoSlate: ink70,
  textoDeshabilitado: ink30,
  textoCasiNegro: ink,
  negro: ink,

  // ─── Compat-shim: éxito (colapsa a focus/ink en monocromo) ───
  // En Bauhaus monocromático el "éxito" no es verde — usa contraste tipográfico.
  // exitoTexto debe quedar legible sobre exitoFondo (test WCAG existente).
  exitoBase: ink,
  exitoTexto: ink,
  exitoFondo: ink04,

  // ─── Compat-shim: alertas/warning ───
  alertaAmbar: warning,
  alertaTexto: warning,
  advertenciaFondo: accentSoft,
  advertenciaBorde: warning,

  // ─── Compat-shim: errores (cinabrio) ───
  // Texto error usa accentDark (#9F2519) para cumplir WCAG AA sobre accentSoft.
  // Bordes/iconos pueden usar accent puro (no requieren contraste de texto).
  errorRojo: accent,
  errorBase: accent,
  errorTexto: accentDark,
  errorOscuro: accentDark,
  errorFondo: accentSoft,
  errorFondoIntenso: accentSoft,
  errorBorde: accent,
  errorBordeSuave: accentSoft,
  errorBordeFuerte: accentDark,

  // ─── Compat-shim: info (focus ultramar) ───
  infoBorde: focus,
  infoTextoOscuro: focus,
  infoFondo: focusSoft,
  infoFondoClaro: focusSoft,
  infoFondoAlterno: paper,
  infoBordeSuave: ink15,
  infoMuySuave: focusSoft,

  // ─── Compat-shim: azules de la paleta vieja ───
  // Todos colapsan a focus (acción) o ink (texto).
  azulInfo: focus,
  azulAccion: focus,
  azulProfundo: ink,
  azulMuySuave: focusSoft,
  azulPanelSuave: ink04,

  // ─── Compat-shim: enlaces texto ───
  enlaceTexto: focus,

  // ─── Compat-shim: verdes (colapsan a ink — el verde se reserva para canvas) ───
  verdeObjetoOscuro: ink,
  verdeOpl: ink,
  objetoFondo: ink04,

  // ─── Compat-shim: violetas (colapsan a accent en Bauhaus) ───
  violeta: accent,
  violetaFuerte: accent,

  // ─── Compat-shim: naranjas (warning terracota) ───
  naranja: warning,
  ambarOscuro: warning,

  // ─── Compat-shim: rojo OPCloud (cinabrio) ───
  rojoOpcloud: accentDark,

  // ─── Compat-shim: resaltado temporal ───
  resaltadoTemporal: accentSoft,

  // ─── Compat-shim: timeline ───
  timelineActivo: ink50,
  timelineBorde: ink15,
  timelineFondo: paper,
  timelineFondoSuave: ink04,

  // ─── Compat-shim: árbol OPD ───
  arbolSeleccion: focusSoft,
  arbolSeleccionBorde: focus,
  carpetaFondo: ink04,

  // ─── Compat-shim: fondos icónicos/línea de tiempo ───
  fondoLineaTiempo: ink04,
  fondoIcono: ink04,

  // ─── Compat-shim: bordes de filas/gestión ───
  bordeFila: ink08,
  bordeGestion: ink08,

  // ─── Compat-shim: badge neutro ───
  neutralBadge: ink04,

  // ─── Compat-shim: OPL tokens ───
  oplTokenBorde: ink15,
  oplTokenTexto: ink50,
  oplFondo: paper,
  oplBorde: ink15,

  // ─── Compat-shim: mapa ───
  mapaBorde: ink15,

  // ─── Canvas: paleta semántica OPM canónica [JOYAS §1] ───
  // L4 migrará a CANON-V2 detrás de flag; L1 no toca constantes.ts.
  canvas: {
    objeto: "#70E483",
    objetoSuave: "#70e483",
    proceso: "#3BC3FF",
    procesoSuave: "#3bc3ff",
    enlace: "#586D8C",
    enlaceSuave: "#586d8c",
    fill: "#fdffff",
    texto: "#000002",
  },
} as const;

// ───────────────────────────────────────────────────────────────────────────
// Spacing (preservado del shim — la escala 4/8/16/24/32 sigue siendo canónica)
// ───────────────────────────────────────────────────────────────────────────

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16, // Ronda 28 L1: subido 12→16 para alinear con escala brief.
  lg: 24,
  xl: 32,
  xxl: 48, // Ronda 28 L1: agregado nivel xxl Bauhaus.
} as const;

// ───────────────────────────────────────────────────────────────────────────
// Radii — Ronda 28 L1: downgrade a 2px máximo (Bauhaus = formas rotundas).
// ───────────────────────────────────────────────────────────────────────────

/**
 * Ronda 28 L1: el chrome Bauhaus colapsa todos los radii cromáticos a 2px
 * (excepto `pill`/`full` para badges circulares). Antes: sm=6 md=8 lg=12
 * xl=16. Ahora: todo 2px — la jerarquía visual se logra con tipografía y
 * espaciado, no con bordes redondeados.
 *
 * Compat-shim: xs/sm/control/md/lg/xl conservan sus keys. Pill y full se
 * mantienen para componentes que necesitan forma circular real.
 */
export const radii = {
  none: 0,
  xs: 2,
  sm: 2, // antes 6
  control: 2, // antes 5
  md: 2, // antes 8
  lg: 2, // antes 12
  xl: 2, // antes 16
  pill: 999,
  full: 9999,
} as const;

// ───────────────────────────────────────────────────────────────────────────
// Stroke — Ronda 28 L1: jerarquía de trazos Bauhaus (hairline/base/bold).
// ───────────────────────────────────────────────────────────────────────────

export const stroke = {
  hairline: 1,
  base: 1.5,
  bold: 2,
} as const;

// ───────────────────────────────────────────────────────────────────────────
// Shadows — Ronda 28 L1: sombras planas sin blur (offset duro, ink15).
// ───────────────────────────────────────────────────────────────────────────

/**
 * Ronda 28 L1: el Bauhaus rechaza el blur gaussiano del corporate UI. Toda
 * la elevación se expresa con `offset duro + ink15`. Aliases semánticos
 * (card/popover/menu/modal/etc.) se mapean a `flat` o `flatLarge`.
 *
 * Antes: rgba slate con blur 8-44px. Ahora: offsets discretos 4/8/12 px.
 */
const flat = "4px 4px 0 0 #D2D2D2";
const flatLarge = "8px 8px 0 0 #D2D2D2";
const flatXl = "12px 12px 0 0 #D2D2D2";

export const shadows = {
  none: "none",
  flat,
  flatLarge,
  flatXl,
  // Niveles Bauhaus
  respiratorio: flat,
  float: flatLarge,
  // Escala xs/sm/md/lg shim (antes blur)
  xs: flat,
  sm: flat,
  md: flatLarge,
  lg: flatLarge,
  // Aliases semánticos (compat-shim del shim antiguo)
  card: flat,
  popover: flat,
  menu: flatLarge,
  menuContextual: flatLarge,
  menuPrincipal: flatLarge,
  menuLigero: flat,
  menuArbol: flatLarge,
  mapaPopup: flat,
  dialogo: flatLarge,
  modal: flatXl,
  modalAmplio: flatXl,
  modalGrid: flatXl,
  flotante: flatLarge,
  tabla: flatLarge,
  asistente: flatLarge,
  inicio: flatLarge,
  // Estados especiales
  dropProceso: `0 0 0 2px ${focus}`,
  appChrome: flat,
  panelInset: `inset 1px 0 0 ${ink15}`,
  seleccionadoInset: `0 0 0 2px ${focus} inset`,
  swatchActivo: `0 0 0 2px ${paper}, 0 0 0 4px ${ink50}`,
} as const;

// ───────────────────────────────────────────────────────────────────────────
// Transitions — Ronda 28 L1: timing único 150ms ease-out (Bauhaus, sin curvas exóticas).
// ───────────────────────────────────────────────────────────────────────────

export const transitions = {
  fast: "150ms ease-out",
  base: "150ms ease-out",
  slow: "250ms ease-out",
} as const;

// ───────────────────────────────────────────────────────────────────────────
// Typography — Ronda 28 L1: Inter Tight + JetBrains Mono self-hosted.
// ───────────────────────────────────────────────────────────────────────────

/**
 * Ronda 28 L1: tipografía Bauhaus.
 *   - Chrome: Inter Tight (variable) self-hosted vía @fontsource-variable.
 *   - Mono: JetBrains Mono (variable) para code/kbd/.mono.
 *   - Canvas: Arial se mantiene [JOYAS §3] — contrato invariante del SVG.
 *
 * Compat-shim: familyChrome/familyCanvas/sizes/weights preservados.
 * Sizes ronda 28: xs=11 sm=12 base=13 md=14 lg=16 xl=20 xxl=28 (brief).
 */
export const typography = {
  fontFamily: '"Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontFamilyMono: '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  // Compat-shim: familyChrome/familyCanvas son los nombres legacy.
  familyChrome: '"Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  familyCanvas: "Arial",
  weights: {
    normal: 400,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    heavy: 800,
  },
  sizes: {
    xxs: 10,
    xs: 11,
    sm: 12,
    base: 13,
    md: 13, // compat-shim: antes 13.
    lg: 16, // antes 14 — brief ronda 28.
    xl: 20, // antes 16.
    xxl: 28, // antes 18.
  },
  // Flat-shim (algunos consumidores leen tokens.typography.sizeMd, etc.)
  sizeXxs: 10,
  sizeXs: 11,
  sizeSm: 12,
  sizeMd: 13,
  sizeLg: 16,
  sizeXl: 20,
  sizeXxl: 28,
  weightNormal: 400,
  weightMedium: 500,
  weightSemibold: 600,
  weightBold: 700,
  weightHeavy: 800,
} as const;

// ───────────────────────────────────────────────────────────────────────────
// Biblioteca dock — preservado (geometría, no paleta)
// ───────────────────────────────────────────────────────────────────────────

export const bibliotecaDock = {
  altoInicial: 280,
  altoMin: 160,
  altoMax: 600,
  /** Breakpoint mínimo de viewport para mostrar el dock. */
  desktopMinPx: 900,
} as const;

// ───────────────────────────────────────────────────────────────────────────
// Inspector tabs — preservado (los colores ya pasan vía colors.* shim)
// ───────────────────────────────────────────────────────────────────────────

export const inspectorTabs = {
  gap: spacing.xs,
  paddingY: spacing.xs,
  paddingX: spacing.sm,
  marginBottom: spacing.md,
  fontSize: typography.sizes.xs,
  weightInactive: typography.weights.semibold,
  weightActive: typography.weights.bold,
  textInactive: colors.textoSecundario,
  textActive: colors.textoPrimario,
  textHover: colors.textoPrimario,
  borderActive: colors.chromeNeutral,
  borderInactive: "transparent",
  fondoActive: colors.chromeNeutralSuave,
  fondoInactive: "transparent",
  separadorBorde: colors.bordeSuave,
  panelGap: spacing.sm,
} as const;

// ───────────────────────────────────────────────────────────────────────────
// Editor OPL honesto — severidades (preservado, consume shim)
// ───────────────────────────────────────────────────────────────────────────

export const editorOplHonesto = {
  severidades: {
    aplicable: {
      bordeIzq: colors.exitoBase,
      fondo: colors.exitoFondo,
      texto: colors.exitoTexto,
    },
    noAplicable: {
      bordeIzq: colors.alertaAmbar,
      fondo: colors.advertenciaFondo,
      texto: colors.alertaTexto,
    },
    sinCambio: {
      bordeIzq: colors.bordeNeutral,
      fondo: colors.fondoMuted,
      texto: colors.textoTerciario,
    },
    ignorada: {
      bordeIzq: colors.bordeSuave,
      fondo: colors.fondoChrome,
      texto: colors.textoDeshabilitado,
    },
  },
  textareaMono: {
    fontFamily: typography.fontFamilyMono,
  },
  contadorPill: {
    fondoNeutro: colors.neutralBadge,
    fondoExito: colors.exitoFondo,
    fondoAlerta: colors.advertenciaFondo,
    textoNeutro: colors.textoSecundario,
    textoExito: colors.exitoTexto,
    textoAlerta: colors.alertaTexto,
  },
} as const;

// ───────────────────────────────────────────────────────────────────────────
// Mobile nav — preservado (consume shim)
// ───────────────────────────────────────────────────────────────────────────

export const mobileNav = {
  altoBarra: 56,
  altoTab: 56,
  iconoTamano: 20,
  etiquetaSize: typography.sizes.xs,
  etiquetaPesoActivo: typography.weights.semibold,
  etiquetaPesoInactivo: typography.weights.medium,
  fondoBarra: colors.fondoChrome,
  bordeBarra: colors.bordeIntermedio,
  textoTabActivo: colors.acentoUi,
  textoTabInactivo: colors.textoSecundario,
  fondoTabActivo: colors.acentoUiSuave,
  fondoTabInactivo: "transparent",
  fondoAvisoEdicion: colors.fondoMuted,
  textoAvisoEdicion: colors.textoSecundario,
} as const;

// ───────────────────────────────────────────────────────────────────────────
// Agregado tokens
// ───────────────────────────────────────────────────────────────────────────

export const tokens = {
  colors,
  spacing,
  radii,
  stroke,
  shadows,
  transitions,
  typography,
  bibliotecaDock,
  inspectorTabs,
  editorOplHonesto,
  mobileNav,
} as const;
