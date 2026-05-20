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
 * Rationale (corte paleta, 2026-05-19):
 *   El acento UI deriva del proceso canónico `#3BC3FF`, pero baja a
 *   `#007DB8` para soportar texto blanco WCAG AA y no confundirse con el
 *   stroke semántico del proceso en el canvas. El verde objeto y el neutro
 *   enlace se proyectan como success/contexto y chrome estructural.
 *
 * Alcance ronda 13 L2 (steipete §T2.2 + §T2.4):
 *   centralizar colors/spacing/radii/shadows/typography para chrome UI puro.
 *   La sección `colors.canvas` se expone únicamente como referencia documental:
 *   la paleta semántica del canvas sigue siendo contrato JOYAS invariante en
 *   su capa de render.
 */
export const colors = {
  acentoUi: "#007DB8",
  acentoUiSuave: "#DDF7FF",
  acentoSecundario: "#0E2C3F",
  chromeNeutral: "#586D8C",
  chromeNeutralSuave: "#EDF4FA",
  fondoChrome: "#ffffff",
  fondoCard: "#F7FBFE",
  fondoElevado: "#FFFFFF",
  fondoApp: "#EAF1F6",
  fondoInput: "#FFFFFF",
  fondoMuted: "#E8F1F7",
  fondoNeutral: "#F0F5F8",
  fondoTabla: "#F8FBFD",
  fondoDeshabilitado: "#EEF4F8",
  fondoWorkbench: "#EDF4F7",
  fondoPanel: "#FFFFFF",
  fondoPanelSuave: "#F6FAFC",
  bordeSuave: "#D8E5EE",
  bordeChrome: "#D2E0EA",
  bordeIntermedio: "#C4D4E1",
  bordeControl: "#AFC2D3",
  bordeInput: "#8EA7BA",
  bordeTabla: "#DDE8F0",
  bordeSlate: "#B9C9D7",
  bordeNeutral: "#C7D5E0",
  bordePanel: "#CADAE6",
  textoPrimario: "#111B29",
  textoSecundario: "#324358",
  textoTerciario: "#647286",
  textoControl: "#223349",
  textoSlate: "#2A3A4F",
  textoDeshabilitado: "#98a2b3",
  textoCasiNegro: "#0F1722",
  negro: "#000000",
  exitoBase: "#0E7C66",
  exitoTexto: "#0B6F3A",
  exitoFondo: "#EAFFF0",
  alertaAmbar: "#FE854F",
  alertaTexto: "#9A3412",
  advertenciaFondo: "#FFF4EA",
  advertenciaBorde: "#FFC99F",
  errorRojo: "#dc2626",
  errorBase: "#d92d20",
  errorTexto: "#b42318",
  errorOscuro: "#b91c1c",
  errorFondo: "#fff5f5",
  errorFondoIntenso: "#fff3f1",
  errorBorde: "#f2b8b5",
  errorBordeSuave: "#fecdca",
  errorBordeFuerte: "#f1b8b8",
  infoBorde: "#007DB8",
  infoTextoOscuro: "#075B82",
  infoFondo: "#E2F7FF",
  infoFondoClaro: "#EDF9FF",
  infoFondoAlterno: "#F2FBFF",
  infoBordeSuave: "#A8E4FF",
  azulInfo: "#006CBB",
  azulAccion: "#0072CE",
  azulProfundo: "#073247",
  enlaceTexto: "#075B82",
  verdeObjetoOscuro: "#0E7C66",
  verdeOpl: "#146C39",
  objetoFondo: "#EAFFF0",
  violeta: "#7C68FC",
  violetaFuerte: "#6D46E8",
  naranja: "#D96A22",
  ambarOscuro: "#ca8a04",
  rojoOpcloud: "#CC0A0E",
  resaltadoTemporal: "#FFFC7F",
  timelineActivo: "#8FC7DA",
  timelineBorde: "#C7D8E4",
  timelineFondo: "#F2FBFF",
  timelineFondoSuave: "#EAF2F7",
  arbolSeleccion: "#D6F2FE",
  arbolSeleccionBorde: "#A8D7EA",
  carpetaFondo: "#F4F8FB",
  azulPanelSuave: "#E6F5FF",
  infoMuySuave: "#E9F9FF",
  fondoLineaTiempo: "#E9F2F7",
  fondoIcono: "#E8F3F7",
  bordeFila: "#EAF1F6",
  bordeGestion: "#E8F0F6",
  neutralBadge: "#EEF4FA",
  oplTokenBorde: "#D9E7EF",
  oplTokenTexto: "#7E90A4",
  oplFondo: "#FCFEFF",
  oplBorde: "#D5E5EF",
  mapaBorde: "#D5E5EF",
  azulMuySuave: "#F0FAFF",
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

/*
 * Radii — ronda 23 chrome estética:
 *   sm 4→6 / md 6→8 / lg 8→12 / xl 10→16. xs/control/pill/full preservados.
 *   El canvas (JOYAS §2) no consume radii de tokens, así que solo afecta
 *   chrome (cards, modales, inputs).
 */
export const radii = {
  xs: 3,
  sm: 6,
  control: 5,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 999,
  full: 9999,
} as const;

/*
 * Shadows — ronda 23 chrome estética: escala respiratoria 4-niveles
 * (xs/sm/md/lg) basada en alfa 4-6-8-10 % sobre slate-900. Los aliases
 * semánticos (`card`, `popover`, `menu`, `dialogo`, `modal`, etc.) se
 * reasignan a esa escala para no romper consumidores. Antes: 12-28 %.
 */
const shadowXs = "0 1px 2px rgba(15, 23, 42, 0.05)";
const shadowSm = "0 3px 8px rgba(15, 23, 42, 0.07)";
const shadowMd = "0 10px 24px rgba(15, 23, 42, 0.10)";
const shadowLg = "0 20px 44px rgba(15, 23, 42, 0.14)";

export const shadows = {
  xs: shadowXs,
  sm: shadowSm,
  md: shadowMd,
  lg: shadowLg,
  card: shadowXs,
  popover: shadowSm,
  menu: shadowMd,
  menuContextual: shadowMd,
  menuPrincipal: shadowMd,
  menuLigero: shadowSm,
  menuArbol: shadowMd,
  mapaPopup: shadowSm,
  dialogo: shadowMd,
  modal: shadowLg,
  modalAmplio: shadowLg,
  modalGrid: shadowLg,
  flotante: shadowMd,
  tabla: shadowLg,
  asistente: shadowLg,
  inicio: shadowLg,
  dropProceso: "0 0 0 2px rgba(59, 195, 255, 0.18)",
  appChrome: "0 1px 0 rgba(255, 255, 255, 0.85) inset, 0 10px 28px rgba(15, 23, 42, 0.08)",
  panelInset: "inset 1px 0 0 rgba(255, 255, 255, 0.85)",
  seleccionadoInset: `0 0 0 2px ${colors.infoFondo} inset`,
  swatchActivo: `0 0 0 2px ${colors.fondoChrome}, 0 0 0 4px ${colors.chromeNeutral}`,
  none: "none",
} as const;

export const typography = {
  /*
   * Fontstack chrome — ronda 23 chrome estética: system-ui stack moderno
   * para superficie chrome (toolbars, modales, inspector). `familyCanvas`
   * permanece en Arial: el canvas SVG es contrato JOYAS §3 invariante y no
   * debe cambiar tipografía. Sin fuente externa: zero bundle delta.
   */
  familyChrome: '"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
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

/* L3 ronda 20 — Biblioteca dock acoplable junto al árbol OPD.
 * Geometria del dock: alto inicial dentro del tree-pane (px) y limites
 * para el redimensionamiento via DivisorPanel horizontal. Citas brief
 * §6 (panel persistente) y SSOT informe UI/UX 2026-05-07 línea 159
 * ("biblioteca no debe tapar el area central del modelo salvo en mobile").
 */
export const bibliotecaDock = {
  altoInicial: 280,
  altoMin: 160,
  altoMax: 600,
  /** Breakpoint mínimo de viewport para mostrar el dock. */
  desktopMinPx: 900,
} as const;

/* L1 ronda 20 — Tabs del Inspector: alias semánticos sobre tokens existentes
 * para que la chrome del tab sea legible sin inventar paleta nueva. Solo
 * referencian colores/espaciados/radios ya canónicos; cero hex literal. */
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

/* L2 ronda 20 — severidades para editor OPL honesto (clasificador de edición). */
/**
 * Mapas semánticos consumidos por `EditorOplHonesto.tsx` para cada uno de los
 * 4 grupos visuales (texto, reconocidas, aplicables, no-aplicables) y por la
 * tipografía monoespaciada del textarea OPL libre. Reusan tokens existentes
 * para no inventar paleta. Tokens-only, sin hex literales nuevos.
 */
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
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
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

/* L1 ronda 21 — empty state OPM
 * `EstadoVacioOpm` reusa tokens existentes para evitar fragmentacion del
 * sistema de chrome y respetar JOYAS §1 (cero hex literales nuevos). El
 * bloque inicio compacto se ancla en:
 *   colors.fondoChrome / colors.bordeIntermedio / shadows.card  → tarjeta base
 *   colors.acentoUi / colors.acentoUiSuave                       → boton primario y nudge
 *   colors.bordeControl / colors.textoControl                    → boton secundario asistente
 *   colors.infoBordeSuave / shadows.popover / radii.pill         → nudge "conectar como resultado"
 *   typography.sizes.lg/md/sm + weights.semibold/medium          → titulo, subtitulo, botones
 *   spacing.xs/sm/md/lg + radii.control/lg/pill                  → ritmo y radios canonicos
 * No se introducen colores nuevos: si en el futuro se necesita una variante
 * propia, agregarla aqui (no inline) y dejar comentada la cita SSOT. */

/* L2 ronda 21: tokens del modo revisión mobile (tabs inferiores). */
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

export const tokens = { colors, spacing, radii, shadows, typography, bibliotecaDock, inspectorTabs, editorOplHonesto, mobileNav } as const;
