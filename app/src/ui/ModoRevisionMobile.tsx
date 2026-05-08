/**
 * ModoRevisionMobile — barra inferior de tabs para el modo revisión a < 640px.
 *
 * Ronda 21 L2: la app a < 640px no es desktop comprimido. Se priorizan 4
 * vistas de revisión: Canvas, OPDs, OPL, Issues. La toolbar primaria de
 * modelado pesado se oculta (ToolbarBase decide visibilidad por viewport),
 * y aquí se expone una barra inferior compacta para navegar entre las vistas.
 *
 * Decisiones tomadas (brief §10):
 * - Tabs inferiores (patrón nativo mobile-first; pulgar accede sin estirar).
 * - Texto al intentar acción de modelado pesado: "Editar en escritorio o
 *   tablet" (no se renderiza aquí; lo consume la toolbar al ocultarse).
 * - Etiquetas cortas (Canvas/OPDs/OPL/Issues) caben holgadas a 390px en 4
 *   tabs de ~92px cada una con icono pequeño encima.
 *
 * No bloquea selección, navegación, zoom/fit ni lectura; solo rebalancea qué
 * se ve en cada momento.
 */

import { useOpmStore } from "../store";
import { tokens } from "./tokens";

export type VistaMobile = "canvas" | "opds" | "opl" | "issues";

interface TabSpec {
  id: VistaMobile;
  etiqueta: string;
  icono: string;
  testId: string;
}

const TABS: ReadonlyArray<TabSpec> = [
  { id: "canvas", etiqueta: "Canvas", icono: "▦", testId: "mobile-tab-canvas" },
  { id: "opds", etiqueta: "OPDs", icono: "⌘", testId: "mobile-tab-opds" },
  { id: "opl", etiqueta: "OPL", icono: "¶", testId: "mobile-tab-opl" },
  { id: "issues", etiqueta: "Issues", icono: "!", testId: "mobile-tab-issues" },
];

export function ModoRevisionMobile() {
  const vistaActiva = useOpmStore((s) => s.vistaMobileActiva);
  const cambiarVista = useOpmStore((s) => s.cambiarVistaMobile);

  return (
    <nav
      role="tablist"
      aria-label="Modo revisión mobile"
      data-testid="modo-revision-mobile"
      style={style.barra}
    >
      {TABS.map((tab) => {
        const activa = vistaActiva === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activa}
            aria-controls={`mobile-pane-${tab.id}`}
            data-testid={tab.testId}
            data-activa={activa ? "true" : "false"}
            style={activa ? style.tabActiva : style.tabInactiva}
            onClick={() => cambiarVista(tab.id)}
          >
            <span aria-hidden="true" style={style.icono}>{tab.icono}</span>
            <span style={style.etiqueta}>{tab.etiqueta}</span>
          </button>
        );
      })}
    </nav>
  );
}

/**
 * Aviso compacto cuando la UI mobile esconde una acción de modelado pesado.
 * Se monta dentro de paneles que perderían sentido sin acción de edición.
 */
export function AvisoEditarEnEscritorio() {
  return (
    <p data-testid="mobile-aviso-edicion" style={style.avisoEdicion}>
      Editar en escritorio o tablet
    </p>
  );
}

const baseTab: preact.JSX.CSSProperties = {
  flex: "1 1 0",
  minWidth: 0,
  height: `${tokens.mobileNav.altoTab}px`,
  display: "inline-flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: `${tokens.spacing.xs}px`,
  padding: `0 ${tokens.spacing.xs}px`,
  border: 0,
  borderRadius: 0,
  background: tokens.mobileNav.fondoTabInactivo,
  color: tokens.mobileNav.textoTabInactivo,
  cursor: "pointer",
  fontFamily: tokens.typography.familyChrome,
  fontSize: `${tokens.mobileNav.etiquetaSize}px`,
  fontWeight: tokens.mobileNav.etiquetaPesoInactivo,
  lineHeight: 1,
};

const style = {
  barra: {
    display: "flex",
    alignItems: "stretch",
    width: "100%",
    height: `${tokens.mobileNav.altoBarra}px`,
    minHeight: `${tokens.mobileNav.altoBarra}px`,
    background: tokens.mobileNav.fondoBarra,
    borderTop: `1px solid ${tokens.mobileNav.bordeBarra}`,
  } as preact.JSX.CSSProperties,
  tabInactiva: baseTab,
  tabActiva: {
    ...baseTab,
    background: tokens.mobileNav.fondoTabActivo,
    color: tokens.mobileNav.textoTabActivo,
    fontWeight: tokens.mobileNav.etiquetaPesoActivo,
  } as preact.JSX.CSSProperties,
  icono: {
    fontSize: `${tokens.mobileNav.iconoTamano}px`,
    lineHeight: 1,
    fontWeight: tokens.typography.weights.bold,
  } as preact.JSX.CSSProperties,
  etiqueta: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
  } as preact.JSX.CSSProperties,
  avisoEdicion: {
    margin: 0,
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    background: tokens.mobileNav.fondoAvisoEdicion,
    color: tokens.mobileNav.textoAvisoEdicion,
    fontFamily: tokens.typography.familyChrome,
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.medium,
    textAlign: "center",
    borderTop: `1px solid ${tokens.colors.bordeIntermedio}`,
  } as preact.JSX.CSSProperties,
} satisfies Record<string, preact.JSX.CSSProperties>;

export const TABS_MOBILE = TABS;
