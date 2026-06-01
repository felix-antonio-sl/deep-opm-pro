/**
 * Tokens UI centrales - Ronda Codex L1.
 *
 * Fuente de valores: ui-forja/tokens.css + ui-forja/tokens.json.
 * El canvas OPCloud/JOYAS queda invariante en esta linea; L4 migra los attrs
 * JointJS al canon visual OPM. Esta capa solo fija el contrato de chrome.
 */

// ---------------------------------------------------------------------------
// Codex base: papel, tinta, canon OPM y crimson UI-only.
// ---------------------------------------------------------------------------

const paper = "#fafaf8";
const paperWarm = "#eeece2";
const ink = "#171511";
const inkMid = "#5a564c";
const inkSoft = "#807b6e";
const inkFaint = "#b5b0a4";
const rule = "#d3cec1";
const ruleStrong = "#aea899";

const opmGreen = "#27613f";
const opmBlue = "#1d3f78";
const opmOlive = "#68711f";
const stateFill = "#dedacb";

const crimson = "#8e2a2e";

export const colors = {
  // Canonicos Codex publicos.
  paper,
  paperWarm,
  ink,
  inkMid,
  inkSoft,
  inkFaint,
  rule,
  ruleStrong,
  crimson,
  opm: {
    object: opmGreen,
    process: opmBlue,
    state: opmOlive,
    stateFill,
  },

  // Canvas semantico OPM [JOYAS §1] - invariante para no colisionar con L4.
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

  // Compat-shim: rampa legacy -> rampa editorial Codex.
  ink02: ink,
  ink90: inkMid,
  ink70: inkMid,
  ink50: inkSoft,
  ink30: inkFaint,
  ink15: rule,
  ink08: rule,
  ink04: paperWarm,
  paper02: paperWarm,
  paper04: paperWarm,

  // Acentos legacy: Codex usa crimson como unico canal UI (V-203).
  accent: crimson,
  accentSoft: paperWarm,
  accentDark: crimson,
  focus: crimson,
  focusSoft: paperWarm,
  focusDark: crimson,
  acentoUi: crimson,
  acentoUiSuave: paperWarm,
  acentoSecundario: ink,

  // Aliases historicos cromaticos reexpresados como tinta/crimson/canon OPM.
  warning: crimson,
  warningSoft: paperWarm,
  warningDark: crimson,
  success: opmGreen,
  successSoft: paperWarm,
  successDark: opmGreen,
  destructive: crimson,
  destructiveSoft: paperWarm,
  destructiveDark: crimson,
  ocre: crimson,
  ocreSoft: paperWarm,
  ocreDark: crimson,
  bosque: opmGreen,
  bosqueSoft: paperWarm,
  bosqueDark: opmGreen,
  terracota: crimson,
  terracotaSoft: paperWarm,
  terracotaDark: crimson,

  // Chrome neutro.
  chromeNeutral: inkMid,
  chromeNeutralSuave: paperWarm,

  // Fondos.
  fondoChrome: paper,
  fondoApp: paper,
  fondoInput: paper,
  fondoTabla: paper,
  fondoPanel: paper,
  fondoCard: paperWarm,
  fondoElevado: paperWarm,
  fondoPanelSuave: paperWarm,
  fondoMuted: paperWarm,
  fondoNeutral: paperWarm,
  fondoDeshabilitado: paperWarm,
  fondoWorkbench: paperWarm,
  fondoLineaTiempo: paperWarm,

  // Bordes.
  bordeSuave: rule,
  bordeChrome: rule,
  bordeIntermedio: rule,
  bordeControl: ruleStrong,
  bordeInput: ruleStrong,
  bordeTabla: rule,
  bordeSlate: ruleStrong,
  bordeNeutral: rule,
  bordePanel: rule,
  bordeFila: rule,
  bordeGestion: rule,
  mapaBorde: rule,
  oplBorde: rule,

  // Textos.
  textoPrimario: ink,
  textoSecundario: inkMid,
  textoTerciario: inkSoft,
  textoControl: ink,
  textoSlate: inkMid,
  textoDeshabilitado: inkFaint,
  textoCasiNegro: ink,
  negro: ink,

  // Estados semanticos en chrome: severidad editorial, no color OPM.
  errorBase: crimson,
  errorRojo: crimson,
  errorTexto: crimson,
  errorOscuro: crimson,
  errorFondo: paperWarm,
  errorFondoIntenso: paperWarm,
  errorBorde: crimson,
  errorBordeSuave: rule,
  errorBordeFuerte: crimson,
  alertaAmbar: crimson,
  alertaTexto: crimson,
  advertenciaFondo: paperWarm,
  advertenciaBorde: ruleStrong,
  destructivoBase: crimson,
  destructivoTexto: crimson,
  destructivoFondo: paperWarm,
  destructivoBorde: crimson,
  exitoBase: opmGreen,
  exitoTexto: opmGreen,
  exitoFondo: paperWarm,

  // Info y paletas legacy retiradas.
  infoBorde: ruleStrong,
  infoTextoOscuro: inkMid,
  infoFondo: paperWarm,
  infoFondoClaro: paperWarm,
  infoFondoAlterno: paper,
  infoBordeSuave: rule,
  infoMuySuave: paperWarm,
  azulInfo: inkMid,
  azulAccion: crimson,
  azulProfundo: ink,
  azulMuySuave: paperWarm,
  azulPanelSuave: paperWarm,

  // OPM en chrome solo para pills/contadores de clase.
  verdeObjetoOscuro: opmGreen,
  verdeOpl: opmGreen,
  objetoFondo: paperWarm,

  enlaceTexto: crimson,
  naranja: crimson,
  ambarOscuro: crimson,
  violeta: inkMid,
  violetaFuerte: inkMid,
  rojoOpcloud: crimson,
  resaltadoTemporal: paperWarm,
  neutralBadge: paperWarm,

  // Arbol, timeline y OPL.
  arbolSeleccion: paperWarm,
  arbolSeleccionBorde: crimson,
  carpetaFondo: paperWarm,
  timelineActivo: inkSoft,
  timelineBorde: rule,
  timelineFondo: paper,
  timelineFondoSuave: paperWarm,
  oplTokenBorde: rule,
  oplTokenTexto: inkSoft,
  oplFondo: paper,
  fondoIcono: paperWarm,
} as const;

// ---------------------------------------------------------------------------
// Spacing - Codex no redefine escala TS de chrome; se preserva compatibilidad.
// ---------------------------------------------------------------------------

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// ---------------------------------------------------------------------------
// Radii - Codex §11: chrome sin bordes redondeados; capsulas legacy sobreviven.
// ---------------------------------------------------------------------------

export const radii = {
  none: 0,
  xs: 0,
  sm: 0,
  control: 0,
  md: 0,
  lg: 0,
  xl: 0,
  pill: 999,
  full: 9999,
} as const;

// ---------------------------------------------------------------------------
// Stroke - hairlines de chrome + valores OPM aditivos para L4.
// ---------------------------------------------------------------------------

export const stroke = {
  hairline: 1,
  base: 1.5,
  bold: 2,
  opm: {
    object: 1.5,
    process: 1.5,
    state: 1.2,
    link: 1,
    triangle: 1.2,
  },
} as const;

// ---------------------------------------------------------------------------
// Shadows - Codex sin elevacion. Los aliases sobreviven; rings no usan blur.
// ---------------------------------------------------------------------------

const noShadow = "none";

export const shadows = {
  none: noShadow,
  flat: noShadow,
  flatLarge: noShadow,
  flatXl: noShadow,
  respiratorio: noShadow,
  float: noShadow,
  xs: noShadow,
  sm: noShadow,
  md: noShadow,
  lg: noShadow,
  card: noShadow,
  popover: noShadow,
  menu: noShadow,
  menuContextual: noShadow,
  menuPrincipal: noShadow,
  menuLigero: noShadow,
  menuArbol: noShadow,
  mapaPopup: noShadow,
  dialogo: noShadow,
  modal: noShadow,
  modalAmplio: noShadow,
  modalGrid: noShadow,
  flotante: noShadow,
  tabla: noShadow,
  inicio: noShadow,
  dropProceso: `0 0 0 2px ${crimson}`,
  appChrome: noShadow,
  panelInset: `inset 1px 0 0 ${rule}`,
  seleccionadoInset: `0 0 0 2px ${crimson} inset`,
  swatchActivo: `0 0 0 2px ${paper}, 0 0 0 4px ${crimson}`,
} as const;

// ---------------------------------------------------------------------------
// Transitions - Codex §9: 100-150ms ease en cambios visuales.
// ---------------------------------------------------------------------------

export const transitions = {
  fast: "120ms ease",
  base: "120ms ease",
  slow: "150ms ease",
} as const;

// ---------------------------------------------------------------------------
// Typography - Inria self-hosted + JetBrains Mono.
// ---------------------------------------------------------------------------

export const typography = {
  serif: '"Inria Serif", Georgia, serif',
  sans: '"Inria Sans", system-ui, -apple-system, sans-serif',
  mono: '"JetBrains Mono Variable", "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
  fs: {
    fs9: 9,
    fs10: 10,
    fs11: 11,
    fs12: 12,
    fs13: 13.5,
    fs14: 14,
    fs17: 17,
    fs20: 20,
    fs22: 22,
  },
  ls: {
    tight: "-0.01em",
    body: "-0.005em",
    mono: "0.04em",
    kbd: "0.06em",
    meta: "0.08em",
    mark: "0.12em",
    kicker: "0.18em",
    section: "0.22em",
  },
  lh: {
    tight: 1.1,
    body: 1.45,
    opl: 1.55,
    quote: 1.5,
  },
  weights: {
    // Codex L6: escala descolapsada (tokens.css §pesos). Inria no tiene
    // masters 500/600 (solo 300/400/700) → en serif/sans el navegador los
    // sintetiza; JetBrains Mono variable sí los cubre nativos.
    light: 300, //   light italic disponible
    regular: 400, // default body
    normal: 400, //  alias body
    medium: 500, //  tree-row current numbers, mono semibold
    semibold: 600, // segmented active option
    bold: 700, //    títulos serif, objetos OPL
    heavy: 700,
    display: 700,
  },

  // Compat-shim.
  fontFamily: '"Inria Serif", Georgia, serif',
  fontFamilyMono: '"JetBrains Mono Variable", "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
  familyChrome: '"Inria Serif", Georgia, serif',
  familyCanvas: "Arial",
  sizes: {
    xxs: 10,
    xs: 11,
    sm: 12,
    base: 13.5,
    md: 13.5,
    lg: 14,
    xl: 20,
    xxl: 22,
  },
  sizeXxs: 10,
  sizeXs: 11,
  sizeSm: 12,
  sizeMd: 13.5,
  sizeLg: 14,
  sizeXl: 20,
  sizeXxl: 22,
  weightLight: 300,
  weightNormal: 400,
  weightMedium: 500,
  weightSemibold: 600,
  weightBold: 700,
  weightHeavy: 700,
  weightDisplay: 700,
} as const;

// ---------------------------------------------------------------------------
// Modulos derivados preservados: forma publica estable para consumidores vivos.
// ---------------------------------------------------------------------------

export const bibliotecaDock = {
  altoInicial: 280,
  altoMin: 160,
  altoMax: 600,
  /** Breakpoint minimo de viewport para mostrar el dock. */
  desktopMinPx: 900,
} as const;

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
