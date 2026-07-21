/**
 * ModoRevisionMobile — barra inferior de tabs para el modo revisión a < 640px.
 *
 * Ronda 21 L2: la app a < 640px no es desktop comprimido. Se priorizan 4
 * vistas de revisión: Canvas, OPDs, OPL, Diagnóstico. La toolbar primaria de
 * modelado pesado se oculta (ToolbarBase decide visibilidad por viewport),
 * y aquí se expone una barra inferior compacta para navegar entre las vistas.
 *
 * Decisiones tomadas (brief §10):
 * - Tabs inferiores (patrón nativo mobile-first; pulgar accede sin estirar).
 * - Texto al intentar acción de modelado pesado: "Editar en escritorio o
 *   tablet" (no se renderiza aquí; lo consume la toolbar al ocultarse).
 * - Etiquetas cortas (Canvas/OPDs/OPL/Diagnóstico) caben holgadas a 390px en 4
 *   tabs de ~92px cada una con icono pequeño encima.
 *
 * La etiqueta visible es "Diagnóstico": la vista puede contener bloqueos,
 * mejoras u observaciones, por lo que llamarla "Sugerencias" degradaría la
 * severidad. El testId mobile-tab-issues se conserva por
 * estabilidad del contrato E2E (smoke `22-responsive-review.spec.ts`).
 *
 * No bloquea selección, navegación, zoom/fit ni lectura; solo rebalancea qué
 * se ve en cada momento.
 */

import { useModoRevisionMobileViewModel } from "../app/viewmodels/modoRevisionMobileViewModel";
import { tokens } from "./tokens";

export type VistaMobile = "canvas" | "opds" | "opl" | "issues";

interface TabSpec {
  id: VistaMobile;
  etiqueta: string;
  icono: string;
  testId: string;
}

// Ronda23 L1 #13: el glifo Command de Mac (⌘) no significa "OPDs". Se cambia
// por una llave de jerarquía (⎘) que sugiere árbol/multi-OPD. Decisión: usar
// glifo Unicode (no SVG) por consistencia con el resto del bottom nav, que es
// puramente tipográfico y se renderiza con la familia chrome.
const TABS: ReadonlyArray<TabSpec> = [
  { id: "canvas", etiqueta: "Canvas", icono: "▦", testId: "mobile-tab-canvas" },
  { id: "opds", etiqueta: "OPDs", icono: "⎘", testId: "mobile-tab-opds" },
  { id: "opl", etiqueta: "OPL", icono: "¶", testId: "mobile-tab-opl" },
  { id: "issues", etiqueta: "Diagnóstico", icono: "!", testId: "mobile-tab-issues" },
];

export function ModoRevisionMobile() {
  const { vistaActiva, cambiarVista } = useModoRevisionMobileViewModel();

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

// Ronda Codex v1 L4: re-piel ligera. La barra es paper con hairline superior
// (tokens.stroke.hairline). El glifo va en JetBrains Mono; la etiqueta en Inria
// Serif. La tab activa usa el único canal de acento UI de Codex (crimson V-203)
// como subrayado superior hairline + tinta ink full, sin fondo cromático
// (ui-forja prohíbe underline-active gruesa: aquí es hairline editorial).
const baseTab: preact.JSX.CSSProperties = {
  flex: "1 1 0",
  minWidth: 0,
  height: `${tokens.mobileNav.altoTab}px`,
  display: "inline-flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
  padding: `0 ${tokens.spacing.xs}px`,
  borderTop: `${tokens.stroke.hairline}px solid transparent`,
  borderLeft: 0,
  borderRight: 0,
  borderBottom: 0,
  borderRadius: 0,
  background: tokens.colors.paper,
  color: tokens.colors.inkSoft,
  cursor: "pointer",
  fontFamily: tokens.typography.serif,
  fontSize: `${tokens.typography.fs.fs11}px`,
  fontWeight: tokens.typography.weights.regular,
  lineHeight: tokens.typography.lh.tight,
  transition: `color ${tokens.transitions.fast}, border-color ${tokens.transitions.fast}`,
};

const style = {
  barra: {
    display: "flex",
    alignItems: "stretch",
    width: "100%",
    height: `${tokens.mobileNav.altoBarra}px`,
    minHeight: `${tokens.mobileNav.altoBarra}px`,
    background: tokens.colors.paper,
    borderTop: `${tokens.stroke.hairline}px solid ${tokens.colors.ruleStrong}`,
  } as preact.JSX.CSSProperties,
  tabInactiva: baseTab,
  tabActiva: {
    ...baseTab,
    borderTopColor: tokens.colors.crimson,
    color: tokens.colors.ink,
    fontWeight: tokens.typography.weights.bold,
  } as preact.JSX.CSSProperties,
  icono: {
    fontFamily: tokens.typography.mono,
    fontSize: 18,
    lineHeight: 1,
    fontWeight: tokens.typography.weights.regular,
    color: "inherit",
  } as preact.JSX.CSSProperties,
  etiqueta: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
    color: "inherit",
  } as preact.JSX.CSSProperties,
  avisoEdicion: {
    margin: 0,
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    background: tokens.colors.paper,
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs12}px`,
    fontStyle: "italic",
    fontWeight: tokens.typography.weights.regular,
    textAlign: "center",
    borderTop: `${tokens.stroke.hairline}px solid ${tokens.colors.rule}`,
  } as preact.JSX.CSSProperties,
} satisfies Record<string, preact.JSX.CSSProperties>;

export const TABS_MOBILE = TABS;
