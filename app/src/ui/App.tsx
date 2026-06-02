/**
 * Workbench raíz OPM.
 *
 * Citas SSOT L1/L3: [JOYAS §1-3], [V-0c], [Met §metodologia].
 * PanelDiagnostico se monta como
 * ViewComponent derivado por DataFlow puro, no Action ni side-effect.
 */

import { lazy, Suspense } from "preact/compat";
import { useEffect, useState } from "preact/hooks";
import { registrarAtajosAplicacion } from "../app/ports/globalShortcutsPort";
import { crearZustandGlobalShortcutsPort } from "../app/ports/zustandGlobalShortcutsPort";
import { useZustandPersistencePort } from "../app/ports/zustandPersistencePort";
import { useAppShellViewModel } from "../app/viewmodels/appShellViewModel";
import type { PanelOplViewModel } from "../app/viewmodels/panelOplViewModel";
import { usePanelOplViewModel } from "../app/viewmodels/panelOplViewModel";
import { listarAvisosDiagnostico } from "../modelo/diagnostico";
import { obtenerRefinamiento } from "../modelo/refinamientos";
import type { Id, Modelo } from "../modelo/tipos";
import type { JointCanvasAdapter } from "../render/jointjs/jointCanvasAdapter";
import { ANCHO_PANEL_INSPECTOR_DEFAULT, ANCHO_PANEL_INSPECTOR_MAX, ANCHO_PANEL_INSPECTOR_MIN } from "../store/runtime";
import { ArbolOpd } from "./ArbolOpd";
import { BarraHerramientasElemento } from "./BarraHerramientasElemento";
import { BarraPestanas } from "./BarraPestanas";
import { Breadcrumb } from "./Breadcrumb";
import { CapturadorBugs } from "./CapturadorBugs";
import { HaloEstado } from "./HaloEstado";
import { configurarContextoAtajos, escucharGlobal, registrarAtajo } from "./atajosTeclado";
import { CanvasAdapterContext } from "./CanvasAdapterContext";
import { ConfirmacionProvider } from "./ConfirmacionContext";
import { resolverContextoWorkbench } from "./contexto";
import { tituloViewPointWorkbench } from "./contextoWorkbench";
import { CodexCanvasMount } from "./codex/CodexCanvasMount";
import { CodexColHeader } from "./codex/CodexColHeader";
import { CodexFrame } from "./codex/CodexFrame";
import { DivisorPanel } from "./divisorPanel";
import { EstadoVacioOpm } from "./EstadoVacioOpm";
import { Inspector } from "./Inspector";
import { JointCanvasFeedbackBoundary } from "./JointCanvasFeedbackBoundary";
// L2 ronda 21: viewport-aware layout — el grid desktop coexiste con el modo
// revisión mobile (tabs inferiores) y tablet (drawers). Ver `layoutResponsive`.
import { useBreakpoint } from "./layoutResponsive";
import { MensajeFlashBridge } from "./MensajeFlashBridge";
import { ModoRevisionMobile, AvisoEditarEnEscritorio } from "./ModoRevisionMobile";
import { PanelDiagnostico } from "./PanelDiagnostico";
import { PanelOplView } from "./PanelOpl";
import { BarraSimulacion } from "./simulacion/BarraSimulacion";
import { tokens } from "./tokens";
import { Toolbar } from "./Toolbar";

const CheatsheetAtajos = lazy(() => import("./CheatsheetAtajos").then((m) => ({ default: m.CheatsheetAtajos })));
const CommandPalette = lazy(() => import("./CommandPalette").then((m) => ({ default: m.CommandPalette })));
const DialogoBuscarCosas = lazy(() => import("./DialogoBuscarCosas").then((m) => ({ default: m.DialogoBuscarCosas })));
const DialogoBuscarGlobal = lazy(() => import("./DialogoBuscarGlobal").then((m) => ({ default: m.DialogoBuscarGlobal })));
const DialogoCargarModelo = lazy(() => import("./DialogoCargarModelo").then((m) => ({ default: m.DialogoCargarModelo })));
const DialogoConfiguracion = lazy(() => import("./DialogoConfiguracion").then((m) => ({ default: m.DialogoConfiguracion })));
const DialogoOntologia = lazy(() => import("./DialogoOntologia").then((m) => ({ default: m.DialogoOntologia })));
const DialogoRequisito = lazy(() => import("./DialogoRequisito").then((m) => ({ default: m.DialogoRequisito })));
const DialogoSubmodelo = lazy(() => import("./DialogoSubmodelo").then((m) => ({ default: m.DialogoSubmodelo })));
const DialogoComposicion = lazy(() => import("./DialogoComposicion").then((m) => ({ default: m.DialogoComposicion })));
const DialogoSimulacionNumerica = lazy(() => import("./DialogoSimulacionNumerica").then((m) => ({ default: m.DialogoSimulacionNumerica })));
const DialogoColisionNombre = lazy(() => import("./DialogoColisionNombre").then((m) => ({ default: m.DialogoColisionNombre })));
const DialogoGuardarComo = lazy(() => import("./DialogoGuardarComo").then((m) => ({ default: m.DialogoGuardarComo })));
const DialogoImportarExportarJson = lazy(() => import("./DialogoImportarExportarJson").then((m) => ({ default: m.DialogoImportarExportarJson })));
const DialogoVersiones = lazy(() => import("./DialogoVersiones").then((m) => ({ default: m.DialogoVersiones })));
const Timeline = lazy(() => import("./Timeline").then((m) => ({ default: m.Timeline })));
const TablaEnlaces = lazy(() => import("./TablaEnlaces").then((m) => ({ default: m.TablaEnlaces })));
const GestionArbolOpd = lazy(() => import("./GestionArbolOpd").then((m) => ({ default: m.GestionArbolOpd })));
const ModalDuracionEstado = lazy(() => import("./ModalDuracionEstado").then((m) => ({ default: m.ModalDuracionEstado })));
const ModalImagenObjeto = lazy(() => import("./ModalImagenObjeto").then((m) => ({ default: m.ModalImagenObjeto })));
const ModalUrlsObjeto = lazy(() => import("./ModalUrlsObjeto").then((m) => ({ default: m.ModalUrlsObjeto })));

export function App() {
  const {
    vistaMapaActiva,
    anchoPanelInspector,
    uiSoloCanvas,
    modelo,
    opdActivoId,
    fijarAnchoPanelInspector,
    dialogoGuardarComoAbierto,
    dialogoConfiguracionAbierto,
    dialogoOntologiaAbierto,
    dialogoRequisitoAbierto,
    dialogoSubmodeloAbierto,
    dialogoComposicionAbierto,
    dialogoSimulacionNumericaAbierto,
    dialogoImportarExportarJsonAbierto,
    cerrarDialogoImportarExportarJson,
    dialogoCargarModeloAbierto,
    dialogoBuscarGlobalAbierto,
    busquedaCosasAbierta,
    dialogoVersionesAbierto,
    modalUrlsAbierto,
    modalImagenAbierto,
    modalDuracionAbierto,
    tablaEnlacesAbierta,
    gestionArbolAbierta,
    cheatsheetAtajosAbierto,
    cerrarCheatsheetAtajos,
    dialogoComandosAbierto,
    cerrarDialogoComandos,
    vistaMobileActiva,
    modoSimulacionActivo,
    modoEnlaceActivo,
    modoCreacionActivo,
  } = useAppShellViewModel();
  const [, setInspectorAbierto] = useState(true);
  const [canvasAdapter, setCanvasAdapter] = useState<JointCanvasAdapter | null>(null);
  // L2 ronda 28: altura del panel índice (árbol OPD) sobre el panel inspector.
  const [alturaIndicePx, setAlturaIndicePx] = useState(300);
  const alturaContainerPx = typeof window !== "undefined" ? window.innerHeight - 80 : 900;
  const alturaIndicePct = Math.min(100, Math.max(0, Math.round((alturaIndicePx / alturaContainerPx) * 100)));
  const fijarAlturaIndicePx = (px: number) => setAlturaIndicePx(px);
  const timelineDisponible = tieneTimelineDisponible(modelo, opdActivoId);
  const panelOplVm = usePanelOplViewModel();
  // L2 ronda 21: branch por viewport. Desktop preserva el grid canónico de 4
  // columnas; tablet conserva grid pero más estrecho; mobile delega a tabs.
  const breakpoint = useBreakpoint();
  const esMobile = breakpoint === "mobile";
  const esTablet = breakpoint === "tablet";
  // BUG-20260511T225343Z-696858: en tablet acotamos al default para que el
  // canvas conserve espacio útil. Desktop respeta el valor del store.
  const anchoInspectorLayout = anchoPanelInspectorLayout(anchoPanelInspector, esTablet);

  useEffect(() => {
    const shortcutPort = crearZustandGlobalShortcutsPort();
    const limpiarContexto = configurarContextoAtajos({
      vistaMapaActiva: shortcutPort.vistaMapaActiva,
    });
    const dejarDeEscuchar = escucharGlobal();
    const desregistrar = registrarAtajosAplicacion(shortcutPort, registrarAtajo);
    return () => {
      for (const off of desregistrar) off();
      dejarDeEscuchar();
      limpiarContexto();
    };
  }, []);

  const contextoWorkbench = resolverContextoWorkbench({
    breakpoint,
    vistaMapaActiva,
    modoSimulacionActivo,
    modoEnlaceActivo,
    modoCreacionActivo,
  });
  // Ronda Codex v2 L2: meta editorial del header (N oraciones · ● sin guardar).
  // Derivado puro del modelo + store, leído por puertos read-only (no muta estado).
  const { dirtyModelo } = useZustandPersistencePort();
  const oracionesOpl = panelOplVm.lineas.length;
  const avisosDiagnostico = listarAvisosDiagnostico(modelo, { tipo: "opd", opdId: opdActivoId });
  const [diagnosticoExpandido, setDiagnosticoExpandido] = useState(false);

  useEffect(() => {
    if (avisosDiagnostico.length === 0) setDiagnosticoExpandido(false);
  }, [avisosDiagnostico.length, opdActivoId]);

  return (
    <CanvasAdapterContext.Provider value={canvasAdapter}>
    <ConfirmacionProvider>
      <main
        style={pageStyle(esMobile)}
        data-breakpoint={breakpoint}
        data-context-device={contextoWorkbench.device}
        data-context-modo={contextoWorkbench.modo}
        data-context-submodo={contextoWorkbench.subModo ?? "ninguno"}
        data-viewpoint={contextoWorkbench.viewPoint}
        data-viewpoint-default={contextoWorkbench.viewPointDefault ? "true" : "false"}
      >
        <MensajeFlashBridge />
        {/*
          Paquete "Estados ciudadanos de primera clase" (2026-05-23):
          halo flotante mínimo. Se autorrenderiza si `estadoSeleccionId !== null`.
          Spec: docs/superpowers/specs/2026-05-23-estados-ciudadania-primera-clase-design.md §5.1.
        */}
        <HaloEstado />
        <h1 data-testid="viewpoint-heading" style={layout.srOnly}>
          {tituloViewPointWorkbench(contextoWorkbench)}
        </h1>
        {esMobile ? (
          <>
            {contextoWorkbench.modo === "simulacion" ? <BarraSimulacion /> : <Toolbar />}
            <BarraPestanas />
            <section
              data-testid="mobile-revision-section"
              style={layout.mobileSection}
            >
              <div data-testid="canvas-pane" style={layout.canvasPaneMobile}>
                <JointCanvasFeedbackBoundary onAdapterChange={setCanvasAdapter} />
                <BarraHerramientasElemento
                  inspectorAbierto={false}
                  onAbrirInspector={() => setInspectorAbierto(true)}
                  onToggleInspector={() => setInspectorAbierto((abierto) => !abierto)}
                />
              </div>
              {vistaMobileActiva !== "canvas" ? (
                <div
                  role="tabpanel"
                  id={`mobile-pane-${vistaMobileActiva}`}
                  aria-label={`Vista ${vistaMobileActiva}`}
                  data-testid={`mobile-pane-${vistaMobileActiva}`}
                  style={layout.mobileOverlayPane}
                >
                  {vistaMobileActiva === "opds" ? (
                    <div data-testid="tree-pane" style={layout.mobilePanelContent}>
                      <ArbolOpd />
                    </div>
                  ) : null}
                  {vistaMobileActiva === "opl" ? (
                    <div data-testid="opl-pane" style={layout.mobilePanelContent}>
                      <PanelOplView vm={panelOplVm} />
                    </div>
                  ) : null}
                  {vistaMobileActiva === "issues" ? (
                    <div data-testid="inspector-pane" style={layout.mobileIssuesContent}>
                      <PanelDiagnostico />
                      <AvisoEditarEnEscritorio />
                    </div>
                  ) : null}
                </div>
              ) : null}
              <ModoRevisionMobile />
            </section>
          </>
        ) : (
          /*
            BUG-20260601T164709/164807: el footer Codex y los botones visibles
            para abrir la paleta se retiran del chrome. La paleta sigue viva por
            atajo global `⌘K/Ctrl+K`; el diagnóstico pasa bajo OPL como
            marginalia operativa, sin duplicarse abajo ni en el inspector.
          */
          <CodexFrame
            leftWidth={ANCHO_PANEL_INSPECTOR_DEFAULT}
            rightWidth={anchoInspectorLayout}
            isTablet={esTablet}
            canvasOnly={uiSoloCanvas}
            toolbar={contextoWorkbench.modo === "simulacion" ? <BarraSimulacion /> : <Toolbar />}
            menu={null}
            tabs={<BarraPestanas />}
            breadcrumb={<Breadcrumb />}
            meta={<ChromeMetaCodex oraciones={oracionesOpl} dirty={dirtyModelo} />}
            leftPanel={(
              <section data-testid="opl-pane" style={layout.oplLeftPane}>
                <CodexColHeader kicker="MARGINALIA" title="OPL" meta={<OplHeaderMeta vm={panelOplVm} />} />
                <div style={layout.oplLeftContent}>
                  <PanelOplView vm={panelOplVm} />
                </div>
                {avisosDiagnostico.length > 0 ? (
                  <div
                    style={{
                      ...layout.diagnosticoOplMarginalia,
                      ...(diagnosticoExpandido ? layout.diagnosticoOplMarginaliaExpandida : {}),
                    }}
                  >
                    <PanelDiagnostico expandido={diagnosticoExpandido} onExpandidoChange={setDiagnosticoExpandido} />
                  </div>
                ) : null}
              </section>
            )}
            leftDivider={(
              <div
                role="separator"
                aria-orientation="vertical"
                data-testid="divisor-panel-opl-canvas"
                style={layout.codexLeftDivider}
              />
            )}
            canvas={(
              <CodexCanvasMount chromeVisible={!uiSoloCanvas}>
                <JointCanvasFeedbackBoundary onAdapterChange={setCanvasAdapter} />
                {/*
                  Ronda Codex v2 L2 (prep L4, auditoría rev2 §05 SEL-1/SEL-2): se
                  retira el montaje de `BarraHerramientasElemento` (caja de chips
                  de selección) del overlay del canvas. La única voz de selección
                  pasa a ser `CodexSelectionAnnotation`, que `CodexCanvasMount`
                  ya monta dentro del paper-host (hoy decorativa). L4 la hace
                  funcional, le traslada las acciones del bar preservando testids
                  y retira/repurposa `BarraHerramientasElemento`.
                */}
                <EstadoVacioOpm />
              </CodexCanvasMount>
            )}
            rightDivider={(
              <DivisorPanel
                orientacion="vertical"
                anchoInicial={anchoInspectorLayout}
                anchoMin={ANCHO_PANEL_INSPECTOR_MIN}
                anchoMax={esTablet ? ANCHO_PANEL_INSPECTOR_DEFAULT : ANCHO_PANEL_INSPECTOR_MAX}
                invertirDelta
                resetValue={ANCHO_PANEL_INSPECTOR_DEFAULT}
                testId="divisor-panel-inspector"
                title="Ajustar ancho del margen Codex"
                gridArea="divisorInspector"
                onAnchoChange={fijarAnchoPanelInspector}
              />
            )}
            rightPanel={(
              <div data-testid="inspector-pane" style={layout.rightToolsPane}>
                <section data-testid="tree-pane" style={{ ...layout.rightIndexPane, flex: `0 0 ${alturaIndicePct}%` }}>
                  <CodexColHeader kicker="ÍNDICE" title="OPDs" meta={Object.keys(modelo.opds).length} />
                  <div style={layout.treePaneArbol}>
                    <ArbolOpd />
                  </div>
                </section>
                <DivisorPanel
                  orientacion="horizontal"
                  anchoInicial={alturaIndicePx}
                  anchoMin={80}
                  anchoMax={alturaContainerPx * 0.7}
                  resetValue={300}
                  testId="divisor-panel-indice-inspector"
                  title="Ajustar altura del panel índice"
                  onAnchoChange={fijarAlturaIndicePx}
                />
                <section style={{ ...layout.rightInspectorPane, flex: `1 1 ${100 - alturaIndicePct}%` }}>
                  <CodexColHeader kicker="INSPECTOR" title="Selection" />
                  <div style={layout.inspectorContent}>
                    <Inspector />
                    {timelineDisponible ? (
                      <div style={layout.timelineInInspector}>
                        <Suspense fallback={<div style={layout.timelineFallback} />}>
                          <Timeline />
                        </Suspense>
                      </div>
                    ) : null}
                  </div>
                </section>
              </div>
            )}
          />
        )}
        {dialogoGuardarComoAbierto ? <Suspense fallback={null}><DialogoGuardarComo /></Suspense> : null}
        {dialogoConfiguracionAbierto ? <Suspense fallback={null}><DialogoConfiguracion /></Suspense> : null}
        {dialogoOntologiaAbierto ? <Suspense fallback={null}><DialogoOntologia /></Suspense> : null}
        {dialogoRequisitoAbierto ? <Suspense fallback={null}><DialogoRequisito /></Suspense> : null}
        {dialogoSubmodeloAbierto ? <Suspense fallback={null}><DialogoSubmodelo /></Suspense> : null}
        {dialogoComposicionAbierto ? <Suspense fallback={null}><DialogoComposicion /></Suspense> : null}
        {dialogoSimulacionNumericaAbierto ? <Suspense fallback={null}><DialogoSimulacionNumerica /></Suspense> : null}
        <Suspense fallback={null}><DialogoColisionNombre /></Suspense>
        {dialogoImportarExportarJsonAbierto ? (
          <Suspense fallback={null}>
            <DialogoImportarExportarJson open={dialogoImportarExportarJsonAbierto} onCerrar={cerrarDialogoImportarExportarJson} />
          </Suspense>
        ) : null}
        {dialogoCargarModeloAbierto ? <Suspense fallback={null}><DialogoCargarModelo /></Suspense> : null}
        {dialogoBuscarGlobalAbierto ? <Suspense fallback={null}><DialogoBuscarGlobal /></Suspense> : null}
        {busquedaCosasAbierta ? <Suspense fallback={null}><DialogoBuscarCosas /></Suspense> : null}
        {dialogoVersionesAbierto ? <Suspense fallback={null}><DialogoVersiones /></Suspense> : null}
        {tablaEnlacesAbierta ? <Suspense fallback={null}><TablaEnlaces /></Suspense> : null}
        {gestionArbolAbierta ? <Suspense fallback={null}><GestionArbolOpd /></Suspense> : null}
        {modalImagenAbierto ? <Suspense fallback={null}><ModalImagenObjeto /></Suspense> : null}
        {modalUrlsAbierto ? <Suspense fallback={null}><ModalUrlsObjeto /></Suspense> : null}
        {modalDuracionAbierto ? <Suspense fallback={null}><ModalDuracionEstado /></Suspense> : null}
        {cheatsheetAtajosAbierto ? (
          <Suspense fallback={null}>
            <CheatsheetAtajos abierto={cheatsheetAtajosAbierto} onCerrar={cerrarCheatsheetAtajos} />
          </Suspense>
        ) : null}
        {dialogoComandosAbierto ? (
          <Suspense fallback={null}>
            <CommandPalette abierto={dialogoComandosAbierto} onCerrar={cerrarDialogoComandos} />
          </Suspense>
        ) : null}
        <CapturadorBugs />
      </main>
    </ConfirmacionProvider>
    </CanvasAdapterContext.Provider>
  );
}

/**
 * Meta editorial del header Codex: `N oraciones · ● sin guardar · ⌘K`.
 * El indicador "sin guardar" sólo aparece si el modelo está sucio; `⌘K`
 * queda como recordatorio mínimo de la paleta sin botón visible dedicado.
 */
function OplHeaderMeta({ vm }: { vm: PanelOplViewModel }) {
  if (!vm.filtroActivo) return null;
  return (
    <span data-testid="opl-header-filtro" style={metaCodex.oplFilter}>
      <span>filtrado</span>
      {vm.filtroCodigo ? (
        <>
          <span aria-hidden="true" style={metaCodex.oplFilterSep}>·</span>
          <span>{vm.filtroCodigo}</span>
        </>
      ) : null}
      <span aria-hidden="true" style={metaCodex.oplFilterSep}>·</span>
      <span>{vm.visibles.length}/{vm.lineas.length}</span>
      <button
        type="button"
        data-testid="opl-header-filtro-limpiar"
        aria-label="Quitar filtro OPL"
        title="Quitar filtro OPL"
        style={metaCodex.oplFilterClear}
        onClick={() => vm.fijarFiltroOplPorSeleccion(false)}
      >
        ✕
      </button>
    </span>
  );
}

function ChromeMetaCodex({ oraciones, dirty }: { oraciones: number; dirty: boolean }) {
  return (
      <span data-testid="codex-header-meta" style={metaCodex.wrap}>
      <span data-testid="codex-meta-oraciones">
        {oraciones === 0 ? "editor vacío" : oraciones === 1 ? "1 oración" : `${oraciones} oraciones`}
      </span>
      {dirty ? (
        <>
          <span aria-hidden="true" style={metaCodex.sep}>·</span>
          <span data-testid="codex-meta-dirty" style={metaCodex.dirty}>sin guardar</span>
        </>
      ) : null}
      <span aria-hidden="true" style={metaCodex.sep}>·</span>
      <kbd style={metaCodex.kbd}>⌘K</kbd>
    </span>
  );
}

const metaCodex = {
  wrap: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    whiteSpace: "nowrap",
  },
  sep: {
    color: tokens.colors.inkSoft,
  },
  dirty: {
    color: tokens.colors.inkMid,
    fontStyle: "normal",
  },
  kbd: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "20px",
    height: "16px",
    padding: "0 4px",
    border: `1px solid ${tokens.colors.rule}`,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.mono,
    fontStyle: "normal",
    fontSize: `${tokens.typography.fs.fs10}px`,
    lineHeight: 1,
  },
  oplFilter: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    color: tokens.colors.crimson,
    fontFamily: tokens.typography.mono,
    fontSize: "9.5px",
    fontStyle: "italic",
    letterSpacing: 0,
    textTransform: "none",
    whiteSpace: "nowrap",
  },
  oplFilterSep: {
    color: tokens.colors.crimson,
    opacity: 0.65,
    fontStyle: "normal",
  },
  oplFilterClear: {
    border: 0,
    background: "transparent",
    color: tokens.colors.crimson,
    cursor: "pointer",
    padding: "0 0 0 2px",
    fontFamily: tokens.typography.mono,
    fontSize: "9.5px",
    fontStyle: "normal",
    lineHeight: 1,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;

function tieneTimelineDisponible(modelo: Modelo, opdId: Id): boolean {
  const opd = modelo.opds[opdId];
  if (!opd?.padreId) return false;
  const padre = modelo.opds[opd.padreId];
  if (!padre) return false;
  const refinador = Object.values(modelo.entidades).find(
    (entidad) => entidad.tipo === "proceso" && obtenerRefinamiento(entidad, "descomposicion")?.opdId === opd.id,
  );
  if (!refinador) return false;
  return Object.values(opd.apariencias).some((apariencia) => modelo.entidades[apariencia.entidadId]?.tipo === "proceso");
}

const layout = {
  page: {
    display: "grid",
    gridTemplateRows: "minmax(0, 1fr)",
    width: "100%",
    height: "100%",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
    background: tokens.colors.fondoApp,
    color: tokens.colors.textoPrimario,
    fontFamily: tokens.typography.familyChrome,
  },
  workbench: {
    display: "grid",
    // BUG-20260511T225343Z-696858: nueva columna `divisorInspector` 6px entre
    // canvas e inspector. `workbenchStyle` reemplaza `gridTemplateColumns` y
    // `gridTemplateAreas` por las versiones reactivas; este default sólo se
    // aplica si `workbenchStyle` se omite (no debería ocurrir, defensa).
    gridTemplateColumns: "240px 6px minmax(0, 1fr) 6px 300px",
    gridTemplateAreas: `"tree divisor canvas divisorInspector inspector"`,
    minHeight: 0,
    minWidth: 0,
    overflow: "hidden",
    background: tokens.colors.fondoWorkbench,
    borderTop: `1px solid ${tokens.colors.bordePanel}`,
    borderBottom: `1px solid ${tokens.colors.bordePanel}`,
  },
  oplLeftPane: {
    minWidth: 0,
    minHeight: 0,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    background: tokens.colors.fondoPanel,
    borderRight: `1px solid ${tokens.colors.rule}`,
    boxShadow: tokens.shadows.panelInset,
  },
  oplLeftContent: {
    minWidth: 0,
    minHeight: 0,
    flex: "1 1 0",
    overflow: "hidden",
  },
  diagnosticoOplMarginalia: {
    flex: "0 0 auto",
    minWidth: 0,
    maxHeight: "44%",
    overflow: "hidden",
    borderTop: `1px solid ${tokens.colors.rule}`,
    background: tokens.colors.fondoPanel,
  },
  diagnosticoOplMarginaliaExpandida: {
    flexBasis: "44%",
    minHeight: "200px",
  },
  codexLeftDivider: {
    gridArea: "divisor",
    width: "6px",
    minWidth: "6px",
    background: tokens.colors.paperWarm,
    borderLeft: `1px solid ${tokens.colors.rule}`,
    borderRight: `1px solid ${tokens.colors.ruleStrong}`,
  },
  rightToolsPane: {
    minWidth: 0,
    minHeight: 0,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    background: tokens.colors.paper,
    borderLeft: `1px solid ${tokens.colors.rule}`,
    boxShadow: tokens.shadows.panelInset,
  },
  rightIndexPane: {
    minWidth: 0,
    minHeight: 0,
    flex: "0 0 30%",
    display: "grid",
    gridTemplateRows: "42px minmax(0, 1fr)",
    overflow: "hidden",
    background: tokens.colors.paper,
  },
  rightInspectorPane: {
    minWidth: 0,
    minHeight: 0,
    flex: "1 1 70%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    background: tokens.colors.fondoPanel,
  },
  treePane: {
    gridArea: "tree",
    minWidth: 0,
    minHeight: 0,
    height: "100%",
    display: "grid",
    gridTemplateRows: "42px minmax(0, 1fr)",
    overflow: "hidden",
    background: tokens.colors.fondoPanel,
    borderRight: `1px solid ${tokens.colors.bordePanel}`,
    boxShadow: tokens.shadows.panelInset,
  },
  treePaneArbol: {
    minWidth: 0,
    minHeight: 0,
    overflow: "auto",
  },
  canvasPane: {
    gridArea: "canvas",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
    position: "relative",
    background: tokens.colors.fondoWorkbench,
  },
  inspectorPane: {
    gridArea: "inspector",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    background: tokens.colors.fondoPanel,
    borderLeft: `1px solid ${tokens.colors.bordePanel}`,
    boxShadow: tokens.shadows.panelInset,
  },
  // BUG-20260526T015955Z-fbb0f1: propiedades (Inspector) y advertencias
  // (PanelDiagnostico) compartían este contenedor con `overflow:auto` como
  // bloque plano. El Inspector tiene su PROPIO `overflow:auto`, así que había
  // doble scroll anidado y la marginalia de diagnóstico quedaba empujada fuera
  // de vista — los dos paneles "competían" por el espacio. Ahora es una columna
  // flex: el Inspector flexa y posee el scroll (su `overflow:auto`), mientras
  // timeline y diagnóstico se fijan abajo (`flex:0 0 auto`) con su propia caja
  // acotada, sin robarse el espacio mutuamente.
  inspectorContent: {
    minWidth: 0,
    minHeight: 0,
    flex: "1 1 0",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    background: tokens.colors.fondoPanel,
  },
  timelineInInspector: {
    flex: "0 0 auto",
    height: "220px",
    minHeight: "220px",
    overflow: "hidden",
    borderTop: `1px solid ${tokens.colors.bordePanel}`,
    background: tokens.colors.fondoPanelSuave,
  },
  timelineFallback: {
    height: "220px",
    borderTop: `1px solid ${tokens.colors.bordePanel}`,
  },
  marginaliaInspector: {
    minWidth: 0,
    minHeight: 0,
    flex: "1 1 46%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    borderBottom: `1px solid ${tokens.colors.rule}`,
    background: tokens.colors.paper,
  },
  marginaliaRule: {
    flex: "0 0 1px",
    minHeight: "1px",
    background: tokens.colors.ruleStrong,
  },
  oplMarginaliaContent: {
    minWidth: 0,
    minHeight: 0,
    flex: "1 1 auto",
    overflow: "hidden",
  },
  // BUG-20260526T015955Z-fbb0f1: la marginalia de diagnóstico se ancla al pie
  // del Inspector sin disputarle el espacio. Colapsada es sólo su header (~32px);
  // el cuerpo expandido vive en la otra rama (reemplaza al Inspector). El
  // `maxHeight` + `overflow:hidden` blinda contra que, si crece, empuje al
  // Inspector fuera de vista.
  diagnosticoMarginalia: {
    flex: "0 0 auto",
    minWidth: 0,
    maxHeight: "40%",
    overflow: "hidden",
    borderTop: `1px solid ${tokens.colors.rule}`,
  },
  // L2 ronda 21: en mobile la grilla es Toolbar+BarraPestanas+Section donde la
  // section contiene canvas+overlay+tabs como flex columna. Sin OPL inferior.
  pageMobile: {
    display: "grid",
    gridTemplateRows: "48px 32px minmax(0, 1fr)",
    width: "100%",
    height: "100%",
    background: tokens.colors.fondoApp,
    overflowX: "hidden",
    color: tokens.colors.textoPrimario,
    fontFamily: tokens.typography.familyChrome,
  },
  mobileSection: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
    position: "relative",
  },
  canvasPaneMobile: {
    flex: "1 1 0",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
    position: "relative",
  },
  // El overlay flota sobre el canvas: el canvas sigue montado pero queda
  // tapado por el panel activo (OPDs/OPL/Issues). Esto evita perder estado
  // de JointJS al cambiar de tab y permite volver al canvas instantáneamente.
  mobileOverlayPane: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    // 56px = altura de la barra de tabs (tokens.mobileNav.altoBarra).
    bottom: `${tokens.mobileNav.altoBarra}px`,
    background: tokens.colors.fondoChrome,
    overflow: "auto",
    zIndex: 10,
  },
  mobilePanelContent: {
    minWidth: 0,
    minHeight: "100%",
    height: "100%",
    overflow: "auto",
  },
  mobileIssuesContent: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    minHeight: "100%",
    overflow: "auto",
  },
  srOnly: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    whiteSpace: "nowrap",
    border: 0,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;

function pageStyle(esMobile: boolean): preact.JSX.CSSProperties {
  if (esMobile) return layout.pageMobile;
  return layout.page;
}

/**
 * BUG-20260511T225343Z-696858: en tablet recortamos el ancho del inspector
 * al default (300) para no comer canvas; el valor del store se preserva tal
 * cual para cuando vuelva a desktop. Pure helper para hacerlo testeable.
 */
function anchoPanelInspectorLayout(anchoPanelInspector: number, esTablet: boolean): number {
  return esTablet ? Math.min(anchoPanelInspector, ANCHO_PANEL_INSPECTOR_DEFAULT) : anchoPanelInspector;
}
