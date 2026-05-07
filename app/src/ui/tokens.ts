/**
 * Tokens UI centrales — separados de la paleta semántica del canvas.
 *
 * Citas SSOT:
 * - [JOYAS §1] paleta canónica canvas (invariante): #70E483 Object stroke,
 *   #3BC3FF Process stroke, #586D8C link stroke, #fdffff fill, #000002 text.
 * - [JOYAS §2] dimensiones canónicas y patrón wrapper+line se preservan en
 *   render/canvas; estos tokens gobiernan solo chrome UI.
 * - [JOYAS §3] tipografía canónica Arial 14px/600 como base observable.
 *
 * Rationale (auditoría comparativa OPCloud, 2026-05-07):
 *   El acento UI no debe colisionar con el color semántico de proceso del
 *   canvas. `#3BC3FF` es color semántico de proceso (canvas) y NO debería
 *   reusarse como acento UI en chrome (toolbar, diálogos, halos). El acento
 *   UI primario es `#3DA8FF` — más saturado, distinguible por daltónicos.
 *
 * Alcance ronda 13 L2 (steipete §T2.2 + §T2.4):
 *   centralizar colors/spacing/radii/shadows/typography para chrome UI puro.
 *   La sección `colors.canvas` se expone únicamente como referencia documental:
 *   la paleta semántica del canvas sigue siendo contrato JOYAS invariante en
 *   su capa de render.
 */
export const colors = {
  acentoUi: "#3DA8FF",
  acentoUiSuave: "#eaf8ff",
  acentoSecundario: "#1a3763",
  chromeNeutral: "#586D8C",
  chromeNeutralSuave: "#e8eef5",
  fondoChrome: "#ffffff",
  fondoCard: "#f9fbfd",
  fondoElevado: "#f8fafc",
  fondoApp: "#f5f7fb",
  fondoInput: "#fafbfc",
  fondoMuted: "#eef2f6",
  fondoNeutral: "#f3f4f6",
  fondoTabla: "#f9fafb",
  fondoDeshabilitado: "#f2f4f7",
  bordeSuave: "#e1e6ed",
  bordeChrome: "#e4eaf1",
  bordeIntermedio: "#d9e0ea",
  bordeControl: "#c8d2df",
  bordeInput: "#b9c5d4",
  bordeTabla: "#e5e7eb",
  bordeSlate: "#cbd5e1",
  bordeNeutral: "#d1d5db",
  textoPrimario: "#1f2937",
  textoSecundario: "#475467",
  textoTerciario: "#667085",
  textoControl: "#344054",
  textoSlate: "#334155",
  textoDeshabilitado: "#98a2b3",
  textoCasiNegro: "#111827",
  negro: "#000000",
  exitoBase: "#12b76a",
  exitoTexto: "#147a4a",
  exitoFondo: "#ecfdf3",
  alertaAmbar: "#f59e0b",
  alertaTexto: "#dc6803",
  advertenciaFondo: "#fff8eb",
  advertenciaBorde: "#fedf89",
  errorRojo: "#dc2626",
  errorBase: "#d92d20",
  errorTexto: "#b42318",
  errorOscuro: "#b91c1c",
  errorFondo: "#fff5f5",
  errorFondoIntenso: "#fff3f1",
  errorBorde: "#f2b8b5",
  errorBordeSuave: "#fecdca",
  errorBordeFuerte: "#f1b8b8",
  infoBorde: "#147aa5",
  infoTextoOscuro: "#0f5f82",
  infoFondo: "#e8f7ff",
  infoFondoClaro: "#eef8ff",
  infoFondoAlterno: "#eff8ff",
  infoBordeSuave: "#b2ddff",
  azulInfo: "#175cd3",
  azulAccion: "#1d4ed8",
  azulProfundo: "#0b2f3f",
  enlaceTexto: "#166496",
  verdeObjetoOscuro: "#0e7c66",
  verdeOpl: "#1f7a3c",
  objetoFondo: "#ebfff0",
  violeta: "#7c68fc",
  violetaFuerte: "#9333ea",
  naranja: "#e87400",
  ambarOscuro: "#ca8a04",
  rojoOpcloud: "#CC0A0E",
  resaltadoTemporal: "#FFFC7F",
  timelineActivo: "#9fcbe0",
  timelineBorde: "#d0d7e2",
  timelineFondo: "#f4fbff",
  timelineFondoSuave: "#eef2f7",
  arbolSeleccion: "#d1eefb",
  arbolSeleccionBorde: "#b9d2df",
  carpetaFondo: "#f5f7fa",
  azulPanelSuave: "#e4f0fd",
  infoMuySuave: "#e7f6ff",
  fondoLineaTiempo: "#edf2f7",
  fondoIcono: "#eef3f8",
  bordeFila: "#f0f0f0",
  bordeGestion: "#f0f3f7",
  neutralBadge: "#f0f3f9",
  oplTokenBorde: "#E1E6EB",
  oplTokenTexto: "#93a3b8",
  oplFondo: "#fbfdff",
  oplBorde: "#dbe5ee",
  mapaBorde: "#dbe5ef",
  azulMuySuave: "#f3f8ff",
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

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  xs: 3,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 10,
  pill: 999,
  full: 9999,
} as const;

export const shadows = {
  card: "0 1px 3px rgba(15, 23, 42, 0.08)",
  dialogo: "0 12px 30px rgba(15, 23, 42, 0.16)",
  menu: "0 10px 26px rgba(15, 23, 42, 0.14)",
  menuContextual: "0 12px 28px rgba(15, 23, 42, 0.18)",
  popover: "0 6px 16px rgba(15, 23, 42, 0.12)",
  flotante: "0 18px 42px rgba(16, 24, 40, 0.24)",
  modal: "0 18px 44px rgba(15, 23, 42, 0.22)",
  modalAmplio: "0 20px 48px rgba(16, 24, 40, 0.25)",
  tabla: "0 20px 60px rgba(16, 24, 40, 0.25)",
  seleccionadoInset: `0 0 0 2px ${colors.infoFondo} inset`,
  swatchActivo: `0 0 0 2px ${colors.fondoChrome}, 0 0 0 4px ${colors.chromeNeutral}`,
  none: "none",
} as const;

export const typography = {
  familyChrome: "Arial, sans-serif",
  familyCanvas: "Arial",
  sizes: {
    xxs: 10,
    xs: 11,
    sm: 12,
    md: 13,
    lg: 14,
    xl: 16,
    xxl: 18,
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    heavy: 800,
  },
  sizeXxs: 10,
  sizeXs: 11,
  sizeSm: 12,
  sizeMd: 13,
  sizeLg: 14,
  sizeXl: 16,
  sizeXxl: 18,
  weightNormal: 400,
  weightMedium: 500,
  weightSemibold: 600,
  weightBold: 700,
  weightHeavy: 800,
} as const;

export const tokens = { colors, spacing, radii, shadows, typography } as const;
