/**
 * MobileReadonlyApp — Shell de lectura para mobile (< 640px).
 *
 * Mobile Solo-Lectura v1: funtor de olvido controlado. Preserva navegación,
 * consulta y proyección; olvida escritura, creación, edición, mutación.
 *
 * Vistas: diagrama | opds | opl | acerca.
 */

import { useEffect, useRef, useState } from "preact/hooks";
import { useAppShellViewModel } from "../../app/viewmodels/appShellViewModel";
import { usePanelOplViewModel } from "../../app/viewmodels/panelOplViewModel";
import type { JointCanvasAdapter } from "../../render/jointjs/jointCanvasAdapter";
import { useOpmStore } from "../../store";
import { deriveViewIntent, runTutorPolicy, type TutorIntervention } from "../../tutor";
import { ArbolOpd } from "../ArbolOpd";
import { JointCanvasFeedbackBoundary } from "../JointCanvasFeedbackBoundary";
import { PanelOplView } from "../PanelOpl";
import { TutorInterventionDetails } from "../TutorDetails";
import { tokens } from "../tokens";
import { debeAutoAbrirModelos, modeloSinContenido } from "./seleccionModelos";
import { VistaBusquedaLectura } from "./VistaBusquedaLectura";
import { VistaModelosLectura } from "./VistaModelosLectura";

export type MobileVistaLectura = "modelos" | "diagrama" | "opds" | "opl" | "acerca";

interface Props {
  onAdapterChange: (adapter: JointCanvasAdapter | null) => void;
}

const TABS: ReadonlyArray<{ id: MobileVistaLectura; etiqueta: string; testId: string }> = [
  { id: "modelos", etiqueta: "Modelos", testId: "mobile-tab-modelos" },
  { id: "diagrama", etiqueta: "Diagrama", testId: "mobile-tab-diagrama" },
  { id: "opds", etiqueta: "OPDs", testId: "mobile-tab-opds" },
  { id: "opl", etiqueta: "OPL", testId: "mobile-tab-opl" },
  { id: "acerca", etiqueta: "Acerca", testId: "mobile-tab-acerca" },
];

export function MobileReadonlyApp({ onAdapterChange }: Props) {
  const {
    modelo,
    opdActivoId,
    cambiarOpdActivo,
  } = useAppShellViewModel();
  const panelOplVm = usePanelOplViewModel();
  const seleccionarEntidad = useOpmStore((s) => s.seleccionarEntidad);
  // Vista y OPD son estado interno efímero, sin routing por URL ni deep-link.
  // Auth v1 cerró la capa de identidad: la selección de qué modelo se ve vive
  // en la vista Modelos (lista del tenant autenticado + carga read-only).
  const [vista, setVista] = useState<MobileVistaLectura>("diagrama");
  const [busquedaActiva, setBusquedaActiva] = useState(false);
  const modelosGuardados = useOpmStore((s) => s.modelosGuardados);
  const listarModelosGuardados = useOpmStore((s) => s.listarModelosGuardados);
  const yaInteractuo = useRef(false);

  // Carga el catálogo del tenant al montar (el shell desktop lo hace al abrir
  // sus diálogos; aquí la lista ES la puerta de entrada al contenido).
  useEffect(() => {
    listarModelosGuardados();
  }, [listarModelosGuardados]);

  // Auto-switch inicial: sobre el SD vacío de sesión y con guardados, la vista
  // útil es la lista — sin quitarle el control al usuario si ya navegó.
  useEffect(() => {
    if (debeAutoAbrirModelos({
      modeloVacio: modeloSinContenido(modelo),
      hayGuardados: modelosGuardados.length > 0,
      yaInteractuo: yaInteractuo.current,
    })) {
      setVista("modelos");
    }
  }, [modelo, modelosGuardados]);

  const navegar = (nueva: MobileVistaLectura) => {
    yaInteractuo.current = true;
    setVista(nueva);
  };

  const opd = modelo.opds[opdActivoId];
  const nombreOpd = opd?.nombre ?? "Sin OPD";
  const nombreModelo = modelo.nombre ?? "Modelo sin nombre";
  const intervencionLectura = runTutorPolicy(deriveViewIntent({
    intentId: `mobile-read:${modelo.id}`,
    focus: "mobile-read",
    editable: false,
  }));

  return (
    <div
      data-testid="mobile-app-lectura"
      data-context-modo="lectura"
      data-tutor-capability="cap.interaction.readonly"
      data-tutor-policy-kind={intervencionLectura.kind}
      style={style.container}
    >
      <header data-testid="mobile-header-lectura" style={style.header}>
        <div style={style.headerInner}>
          <span data-testid="mobile-breadcrumb-opd" style={style.breadcrumb}>{nombreOpd}</span>
          {opd?.preguntaGuia ? (
            <span data-testid="mobile-pregunta-guia" style={style.preguntaGuia}>
              {`Pregunta guía · ${opd.preguntaGuia}`}
            </span>
          ) : null}
        </div>
        <button
          data-testid="mobile-boton-buscar"
          type="button"
          style={style.botonBuscar}
          onClick={() => setBusquedaActiva(true)}
          aria-label="Buscar"
        >
          🔍
        </button>
      </header>

      <main style={style.main}>
        {busquedaActiva ? (
          <div style={style.vistaFull}>
            <VistaBusquedaLectura
              modelo={modelo}
              opdActivoId={opdActivoId}
              onSeleccionarEntidad={(id) => { seleccionarEntidad(id); setBusquedaActiva(false); }}
              onSeleccionarOpd={(id) => { cambiarOpdActivo(id); setBusquedaActiva(false); }}
              onCerrar={() => setBusquedaActiva(false)}
            />
          </div>
        ) : vista === "diagrama" ? (
          <div data-testid="mobile-vista-diagrama" style={style.vistaFull}>
            <JointCanvasFeedbackBoundary readonlyMode={true} onAdapterChange={onAdapterChange} />
          </div>
        ) : null}
        {vista === "modelos" && !busquedaActiva ? (
          <div style={style.vistaFull}>
            <VistaModelosLectura onAbierto={() => navegar("diagrama")} />
          </div>
        ) : null}
        {vista === "opds" ? (
          <div data-testid="mobile-vista-opds" style={style.vistaFull}>
            <ArbolOpd />
          </div>
        ) : null}
        {vista === "opl" ? (
          <div data-testid="mobile-vista-opl" style={style.vistaFull}>
            <PanelOplView vm={panelOplVm} />
          </div>
        ) : null}
        {vista === "acerca" ? (
          <div data-testid="mobile-vista-acerca" style={style.vistaAcerca}>
            <AcercaLectura nombreModelo={nombreModelo} intervention={intervencionLectura} />
          </div>
        ) : null}
      </main>

      <nav role="tablist" aria-label="Navegación lectura mobile" data-testid="mobile-nav-lectura" style={style.nav}>
        {TABS.map((tab) => {
          const activa = vista === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activa}
              data-testid={tab.testId}
              data-activa={activa ? "true" : "false"}
              style={activa ? style.tabActiva : style.tabInactiva}
              onClick={() => navegar(tab.id)}
            >
              <span style={style.etiqueta}>{tab.etiqueta}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function AcercaLectura({ nombreModelo, intervention }: { nombreModelo: string; intervention: TutorIntervention }) {
  return (
    <div style={style.acerca}>
      <h2 style={style.acercaTitulo}>{nombreModelo}</h2>
      <p style={style.acercaTexto}>Modelo OPM en modo lectura.</p>
      <p style={style.acercaTexto}>Para editar, abre en escritorio o tablet.</p>
      <TutorInterventionDetails intervention={intervention} testId="tutor-mobile-readonly" />
    </div>
  );
}

const style: Record<string, preact.JSX.CSSProperties> = {
  container: {
    display: "grid",
    gridTemplateRows: "auto minmax(0, 1fr) 56px",
    width: "100%",
    height: "100%",
    background: tokens.colors.fondoApp,
    color: tokens.colors.textoPrimario,
    fontFamily: tokens.typography.familyChrome,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    padding: `0 ${tokens.spacing.md}px`,
    background: tokens.colors.paper,
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.ruleStrong}`,
    minHeight: "48px",
  },
  headerInner: {
    flex: "1 1 auto",
    minWidth: 0,
    display: "grid",
    gap: "2px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  breadcrumb: {
    fontSize: `${tokens.typography.fs.fs13}px`,
    fontWeight: tokens.typography.weights.bold,
    color: tokens.colors.ink,
  },
  preguntaGuia: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs10}px`,
  },
  botonBuscar: {
    flex: "0 0 auto",
    padding: `${tokens.spacing.sm}px`,
    border: 0,
    background: "transparent",
    color: tokens.colors.inkSoft,
    cursor: "pointer",
    fontSize: `${tokens.typography.fs.fs14}px`,
  },
  main: {
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
    position: "relative",
  },
  vistaFull: {
    width: "100%",
    height: "100%",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
  },
  vistaAcerca: {
    width: "100%",
    height: "100%",
    minWidth: 0,
    minHeight: 0,
    overflow: "auto",
    padding: `${tokens.spacing.md}px`,
  },
  nav: {
    display: "flex",
    alignItems: "stretch",
    width: "100%",
    height: `${tokens.mobileNav.altoBarra}px`,
    minHeight: `${tokens.mobileNav.altoBarra}px`,
    background: tokens.colors.paper,
    borderTop: `${tokens.stroke.hairline}px solid ${tokens.colors.ruleStrong}`,
  },
  tabInactiva: {
    flex: "1 1 0",
    minWidth: 0,
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: `0 ${tokens.spacing.xs}px`,
    border: 0,
    borderTop: `${tokens.stroke.hairline}px solid transparent`,
    borderRadius: 0,
    background: tokens.colors.paper,
    color: tokens.colors.inkSoft,
    cursor: "pointer",
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs11}px`,
    fontWeight: tokens.typography.weights.regular,
    lineHeight: tokens.typography.lh.tight,
  },
  tabActiva: {
    flex: "1 1 0",
    minWidth: 0,
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: `0 ${tokens.spacing.xs}px`,
    border: 0,
    borderTop: `${tokens.stroke.hairline}px solid ${tokens.colors.crimson}`,
    borderRadius: 0,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    cursor: "pointer",
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs11}px`,
    fontWeight: tokens.typography.weights.bold,
    lineHeight: tokens.typography.lh.tight,
  },
  etiqueta: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
  },
  acerca: {
    display: "flex",
    flexDirection: "column",
    gap: `${tokens.spacing.md}px`,
  },
  acercaTitulo: {
    margin: 0,
    fontSize: `${tokens.typography.fs.fs17}px`,
    fontWeight: tokens.typography.weights.bold,
    color: tokens.colors.ink,
  },
  acercaTexto: {
    margin: 0,
    fontSize: `${tokens.typography.fs.fs13}px`,
    color: tokens.colors.inkSoft,
    lineHeight: tokens.typography.lh.body,
  },
};
