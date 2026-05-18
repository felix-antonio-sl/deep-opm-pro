/**
 * Workbench raíz OPM.
 *
 * Citas SSOT L1/L3: [JOYAS §1-3], [V-0c], [Met §metodologia].
 * PanelDiagnostico se monta como
 * ViewComponent derivado por DataFlow puro, no Action ni side-effect.
 */

import { lazy, Suspense } from "preact/compat";
import { useEffect, useState } from "preact/hooks";
import { useAppShellViewModel } from "../app/viewmodels/appShellViewModel";
import { panelOplMinimizadoEfectivo } from "../app/viewmodels/panelOplViewModel";
import { obtenerRefinamiento } from "../modelo/refinamientos";
import type { Id, Modelo } from "../modelo/tipos";
import { JointCanvas } from "../render/jointjs/JointCanvas";
import type { JointCanvasAdapter } from "../render/jointjs/jointCanvasAdapter";
import { store } from "../store";
import { ANCHO_PANEL_INSPECTOR_DEFAULT, ANCHO_PANEL_INSPECTOR_MAX, ANCHO_PANEL_INSPECTOR_MIN } from "../store/runtime";
import { ArbolOpd } from "./ArbolOpd";
import { BarraHerramientasElemento } from "./BarraHerramientasElemento";
import { BarraPestanas } from "./BarraPestanas";
import { BibliotecaDock } from "./biblioteca/BibliotecaDock";
import { CapturadorBugs } from "./CapturadorBugs";
import { configurarContextoAtajos, escucharGlobal, registrarAtajo } from "./atajosTeclado";
import { modeloTieneContenidoVisible } from "./bienvenida";
import { CanvasAdapterContext } from "./CanvasAdapterContext";
import { ConfirmacionProvider } from "./ConfirmacionContext";
import { resolverContextoWorkbench } from "./contexto";
import { tituloViewPointWorkbench } from "./contextoWorkbench";
import { DivisorPanel } from "./divisorPanel";
import { EstadoVacioOpm } from "./EstadoVacioOpm";
import { Inspector } from "./Inspector";
// L2 ronda 21: viewport-aware layout — el grid desktop coexiste con el modo
// revisión mobile (tabs inferiores) y tablet (drawers). Ver `layoutResponsive`.
import { useBreakpoint } from "./layoutResponsive";
import { MenuPrincipal } from "./MenuPrincipal";
import { MensajeFlashBridge } from "./MensajeFlashBridge";
import { ModoRevisionMobile, AvisoEditarEnEscritorio } from "./ModoRevisionMobile";
import { PanelDiagnostico } from "./PanelDiagnostico";
import { PanelOpl } from "./PanelOpl";
import { BarraSimulacion } from "./simulacion/BarraSimulacion";
import { tokens } from "./tokens";
import { Toolbar } from "./Toolbar";

const AsistenteNuevoModelo = lazy(() => import("./asistente/Asistente").then((m) => ({ default: m.AsistenteNuevoModelo })));
const CheatsheetAtajos = lazy(() => import("./CheatsheetAtajos").then((m) => ({ default: m.CheatsheetAtajos })));
const CommandPalette = lazy(() => import("./CommandPalette").then((m) => ({ default: m.CommandPalette })));
const DialogoBuscarCosas = lazy(() => import("./DialogoBuscarCosas").then((m) => ({ default: m.DialogoBuscarCosas })));
const DialogoBuscarGlobal = lazy(() => import("./DialogoBuscarGlobal").then((m) => ({ default: m.DialogoBuscarGlobal })));
const DialogoCargarModelo = lazy(() => import("./DialogoCargarModelo").then((m) => ({ default: m.DialogoCargarModelo })));
const DialogoConfiguracion = lazy(() => import("./DialogoConfiguracion").then((m) => ({ default: m.DialogoConfiguracion })));
const DialogoGuardarComo = lazy(() => import("./DialogoGuardarComo").then((m) => ({ default: m.DialogoGuardarComo })));
const DialogoImportarExportarJson = lazy(() => import("./DialogoImportarExportarJson").then((m) => ({ default: m.DialogoImportarExportarJson })));
const DialogoVersiones = lazy(() => import("./DialogoVersiones").then((m) => ({ default: m.DialogoVersiones })));
// Ronda 13 L1 T2.6: lazy splits para recuperar objetivo historico de chunk principal <=195 kB.
const MapaSistema = lazy(() => import("./MapaSistema").then((m) => ({ default: m.MapaSistema })));
const Timeline = lazy(() => import("./Timeline").then((m) => ({ default: m.Timeline })));
const TablaEnlaces = lazy(() => import("./TablaEnlaces").then((m) => ({ default: m.TablaEnlaces })));
const GestionArbolOpd = lazy(() => import("./GestionArbolOpd").then((m) => ({ default: m.GestionArbolOpd })));
const ModalDuracionEstado = lazy(() => import("./ModalDuracionEstado").then((m) => ({ default: m.ModalDuracionEstado })));
const ModalImagenObjeto = lazy(() => import("./ModalImagenObjeto").then((m) => ({ default: m.ModalImagenObjeto })));
const ModalUrlsObjeto = lazy(() => import("./ModalUrlsObjeto").then((m) => ({ default: m.ModalUrlsObjeto })));

export function App() {
  const {
    vistaMapaActiva,
    anchoPanelArbol,
    anchoPanelInspector,
    preferenciasOpl,
    modelo,
    opdActivoId,
    fijarAnchoPanelArbol,
    fijarAnchoPanelInspector,
    asistenteAbierto,
    dialogoGuardarComoAbierto,
    dialogoConfiguracionAbierto,
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
    modeloPersistidoId,
    pantallaInicioCerrada,
    seleccionIdOpl,
    enlaceSeleccionIdOpl,
    vistaMobileActiva,
    bibliotecaDockAbierto,
    cerrarBibliotecaDock,
    cambiarOpdActivo,
    modoSimulacionActivo,
    modoEnlaceActivo,
    modoCreacionActivo,
  } = useAppShellViewModel();
  const [inspectorAbierto, setInspectorAbierto] = useState(true);
  const [canvasAdapter, setCanvasAdapter] = useState<JointCanvasAdapter | null>(null);
  const oplMinimizado = panelOplMinimizadoEfectivo(preferenciasOpl?.oplMinimizado, seleccionIdOpl, enlaceSeleccionIdOpl);
  const timelineDisponible = tieneTimelineDisponible(modelo, opdActivoId);
  const [esDesktopBiblio, setEsDesktopBiblio] = useState(typeof window === "undefined" ? true : window.innerWidth >= tokens.bibliotecaDock.desktopMinPx);
  const [altoDock, setAltoDock] = useState<number>(tokens.bibliotecaDock.altoInicial);
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const onResize = () => setEsDesktopBiblio(window.innerWidth >= tokens.bibliotecaDock.desktopMinPx);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  // L2 ronda 21: branch por viewport. Desktop preserva el grid canónico de 4
  // columnas; tablet conserva grid pero más estrecho; mobile delega a tabs.
  const breakpoint = useBreakpoint();
  const esMobile = breakpoint === "mobile";
  const esTablet = breakpoint === "tablet";
  // BUG-20260511T225343Z-696858: en tablet acotamos al default para que el
  // canvas conserve espacio útil. Desktop respeta el valor del store.
  const anchoInspectorLayout = anchoPanelInspectorLayout(anchoPanelInspector, esTablet);
  // El dock convive con el árbol OPD solo cuando hay espacio horizontal real
  // y no estamos en mobile/tablet (mobile mantiene overlay legacy si se abre).
  const dockVisible = bibliotecaDockAbierto && esDesktopBiblio && !esMobile && !esTablet;

  useEffect(() => {
    const limpiarContexto = configurarContextoAtajos({
      vistaMapaActiva: () => store.getState().vistaMapaActiva,
    });
    const dejarDeEscuchar = escucharGlobal();
    const desregistrar = registrarAtajosAplicacion();
    return () => {
      for (const off of desregistrar) off();
      dejarDeEscuchar();
      limpiarContexto();
    };
  }, []);

  const bienvenidaActiva = !modeloPersistidoId && !pantallaInicioCerrada && !modeloTieneContenidoVisible(modelo);
  const contextoWorkbench = resolverContextoWorkbench({
    breakpoint,
    vistaMapaActiva,
    modoSimulacionActivo,
    modoEnlaceActivo,
    modoCreacionActivo,
    bienvenidaActiva,
  });
  const esViewPointMapa = contextoWorkbench.modo === "mapa";

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
        <h1 data-testid="viewpoint-heading" style={layout.srOnly}>
          {tituloViewPointWorkbench(contextoWorkbench)}
        </h1>
        {contextoWorkbench.modo === "simulacion" ? <BarraSimulacion /> : <Toolbar />}
        <MenuPrincipal />
        <BarraPestanas />
        {esMobile ? (
          <section
            data-testid="mobile-revision-section"
            style={layout.mobileSection}
          >
            <div data-testid="canvas-pane" style={layout.canvasPaneMobile}>
              {esViewPointMapa ? (
                <Suspense fallback={null}>
                  <MapaSistema />
                </Suspense>
              ) : (
                <>
                  <JointCanvas onAdapterChange={setCanvasAdapter} />
                  <BarraHerramientasElemento
                    inspectorAbierto={false}
                    onAbrirInspector={() => setInspectorAbierto(true)}
                    onToggleInspector={() => setInspectorAbierto((abierto) => !abierto)}
                  />
                </>
              )}
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
                    <PanelOpl />
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
        ) : (
          <>
        <section style={workbenchStyle(anchoPanelArbol, anchoInspectorLayout, inspectorAbierto, esTablet)}>
          <div data-testid="tree-pane" style={treePaneStyle(dockVisible, altoDock)}>
            <div style={layout.treePaneArbol}>
              <ArbolOpd />
            </div>
            {dockVisible ? (
              <>
                <DivisorPanel
                  orientacion="horizontal"
                  anchoInicial={altoDock}
                  anchoMin={tokens.bibliotecaDock.altoMin}
                  anchoMax={tokens.bibliotecaDock.altoMax}
                  onAnchoChange={setAltoDock}
                />
                <div data-testid="biblioteca-dock-pane" style={layout.bibliotecaDockPane}>
                  <BibliotecaDock
                    modelo={modelo}
                    opdActivoId={opdActivoId}
                    onCerrar={cerrarBibliotecaDock}
                    onNavegarOpd={cambiarOpdActivo}
                  />
                </div>
              </>
            ) : null}
          </div>
          <DivisorPanel
            orientacion="vertical"
            anchoInicial={anchoPanelArbol}
            onAnchoChange={fijarAnchoPanelArbol}
          />
          <div data-testid="canvas-pane" style={layout.canvasPane}>
            {esViewPointMapa ? (
              <Suspense fallback={null}>
                <MapaSistema />
              </Suspense>
            ) : (
              <>
                <JointCanvas onAdapterChange={setCanvasAdapter} />
                <BarraHerramientasElemento
                  inspectorAbierto={inspectorAbierto}
                  onAbrirInspector={() => setInspectorAbierto(true)}
                  onToggleInspector={() => setInspectorAbierto((abierto) => !abierto)}
                />
                {/* L1 ronda 21: bloque inicio compacto sobre canvas vacio o
                    nudge "Conectar como resultado" tras 2 entidades. El
                    componente decide internamente si renderiza algo segun
                    apariencias del OPD activo. */}
                <EstadoVacioOpm />
              </>
            )}
          </div>
          {/* BUG-20260511T225343Z-696858: divisor entre canvas e inspector.
              Solo visible cuando el Inspector está abierto. `invertirDelta` =
              true porque el inspector está a la derecha (arrastrar a la
              izquierda agranda). Doble clic resetea a 300 px. En mobile NO
              se monta (rama esMobile). En tablet `anchoInspectorLayout` ya
              recorta el valor visible. */}
          {inspectorAbierto ? (
            <DivisorPanel
              orientacion="vertical"
              anchoInicial={anchoInspectorLayout}
              anchoMin={ANCHO_PANEL_INSPECTOR_MIN}
              anchoMax={esTablet ? ANCHO_PANEL_INSPECTOR_DEFAULT : ANCHO_PANEL_INSPECTOR_MAX}
              invertirDelta
              resetValue={ANCHO_PANEL_INSPECTOR_DEFAULT}
              testId="divisor-panel-inspector"
              title="Ajustar ancho del inspector"
              gridArea="divisorInspector"
              onAnchoChange={fijarAnchoPanelInspector}
            />
          ) : null}
          <div data-testid="inspector-pane" style={inspectorPaneStyle(inspectorAbierto)}>
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
          </div>
        </section>
        <div data-testid="opl-pane" style={oplInferiorStyle(oplMinimizado)}>
          <PanelOpl />
        </div>
        <PanelDiagnostico />
          </>
        )}
        {dialogoGuardarComoAbierto ? <Suspense fallback={null}><DialogoGuardarComo /></Suspense> : null}
        {dialogoConfiguracionAbierto ? <Suspense fallback={null}><DialogoConfiguracion /></Suspense> : null}
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
        {asistenteAbierto ? <Suspense fallback={null}><AsistenteNuevoModelo /></Suspense> : null}
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

function registrarAtajosAplicacion(): Array<() => void> {
  const s = () => store.getState();
  const abrirTraerConectados = () => s().abrirDialogoTraerConectados();
  const ocultarApariencia = () => s().ocultarAparienciaSeleccionada();
  const copiarEstiloEnlace = () => {
    const state = s();
    if (state.enlaceSeleccionId) state.copiarEstiloEnlaceAlPortapapeles(state.enlaceSeleccionId);
  };
  const pegarEstiloEnlace = () => {
    const state = s();
    if (state.enlaceSeleccionId) state.pegarEstiloEnlaceDesdePortapapeles(state.enlaceSeleccionId);
  };
  const conectarMultiAlTodo = () => {
    const state = s();
    const todo = state.seleccionados.length >= 2 ? state.seleccionados[state.seleccionados.length - 1] : null;
    if (todo) state.conectarSeleccionAlTodo(todo, "agregacion");
  };
  const cerrarModalSuperiorOVaciarSeleccion = () => {
    const state = s();
    // IFML H-3 / Ronda 15 L3: el sub-ViewContainer "modal-nombre-cosa" entra
    // primero en el orden LIFO porque es el modal recién montado por la
    // Action `crearEntidadEnCanvas`.
    if (state.nuevaCosaPendiente) return state.descartarNuevaCosaPendiente();
    if (state.dialogoComandosAbierto) return state.cerrarDialogoComandos();
    if (state.cheatsheetAtajosAbierto) return state.cerrarCheatsheetAtajos();
    if (state.gestionArbolAbierta) return state.cerrarGestionArbol();
    if (state.dialogoGuardarComoAbierto) return state.cerrarGuardarComo();
    if (state.dialogoConfiguracionAbierto) return state.cerrarDialogoConfiguracion();
    if (state.dialogoImportarExportarJsonAbierto) return state.cerrarDialogoImportarExportarJson();
    if (state.dialogoCargarModeloAbierto) return state.cerrarCargarModelo();
    if (state.dialogoBuscarGlobalAbierto) return state.cerrarDialogoBuscarGlobal();
    if (state.dialogoVersionesAbierto) return state.cerrarDialogoVersiones();
    if (state.modalImagenAbierto) return state.cerrarModalImagen();
    if (state.modalUrlsAbierto) return state.cerrarModalUrls();
    if (state.modalDuracionAbierto) return state.cerrarModalDuracion();
    if (state.asistente) return state.cancelarAsistente();
    if (state.busquedaCosasAbierta) return state.cerrarBusquedaCosas();
    if (state.menuPrincipalAbierto) return state.cerrarMenuPrincipal();
    if (state.modoEnlace) return state.cancelarEnlace();
    return state.vaciarSeleccion();
  };
  return [
    registrarAtajo({ combo: "Ctrl+S", ctx: "global", categoria: "archivo", descripcion: "Guardar modelo", handler: () => s().guardarLocal() }),
    registrarAtajo({ combo: "Ctrl+K", ctx: "global", categoria: "navegacion", descripcion: "Buscar comandos", handler: () => s().abrirDialogoComandos() }),
    registrarAtajo({ combo: "Ctrl+F", ctx: "canvas", categoria: "navegacion", descripcion: "Buscar cosas en el modelo", handler: () => s().abrirBusquedaCosas() }),
    registrarAtajo({ combo: "Ctrl+Shift+F", ctx: "global", categoria: "navegacion", descripcion: "Buscar en el workspace", handler: () => s().abrirDialogoBuscarGlobal() }),
    registrarAtajo({ combo: "Ctrl+D", ctx: "global", categoria: "navegacion", descripcion: "Abrir gestión del árbol OPD", handler: () => s().abrirGestionArbol() }),
    registrarAtajo({ combo: "Ctrl+Z", ctx: "global", categoria: "edicion", descripcion: "Deshacer", handler: () => s().deshacer() }),
    registrarAtajo({ combo: "Ctrl+Y", ctx: "global", categoria: "edicion", descripcion: "Rehacer", handler: () => s().rehacer() }),
    registrarAtajo({ combo: "Ctrl+Shift+Z", ctx: "global", categoria: "edicion", descripcion: "Rehacer", handler: () => s().rehacer() }),
    registrarAtajo({ combo: "Ctrl+A", ctx: "canvas", categoria: "seleccion", descripcion: "Seleccionar todo en el OPD activo", handler: () => s().seleccionarTodoEnOpd() }),
    registrarAtajo({ combo: "Ctrl+C", ctx: "canvas", categoria: "seleccion", descripcion: "Copiar selección visual", handler: () => s().copiarSeleccionAlBuffer() }),
    registrarAtajo({ combo: "Ctrl+V", ctx: "canvas", categoria: "seleccion", descripcion: "Pegar selección visual", handler: () => s().pegarBufferEnOpdActivo() }),
    registrarAtajo({ combo: "Delete", ctx: "canvas", categoria: "seleccion", descripcion: "Eliminar selección", handler: () => s().eliminarSeleccion() }),
    registrarAtajo({ combo: "Ctrl+Shift+T", ctx: "canvas", categoria: "edicion", descripcion: "Traer conectados de la cosa seleccionada", handler: abrirTraerConectados }),
    registrarAtajo({ combo: "Ctrl+H", ctx: "canvas", categoria: "vista", descripcion: "Ocultar apariencia seleccionada", handler: ocultarApariencia }),
    registrarAtajo({ combo: "Ctrl+Alt+C", ctx: "canvas", categoria: "edicion", descripcion: "Copiar estilo del enlace seleccionado", handler: copiarEstiloEnlace }),
    registrarAtajo({ combo: "Ctrl+Alt+V", ctx: "canvas", categoria: "edicion", descripcion: "Pegar estilo al enlace seleccionado", handler: pegarEstiloEnlace }),
    registrarAtajo({
      combo: "Ctrl+Alt+T",
      ctx: "canvas",
      categoria: "edicion",
      etiqueta: "Agregar selección como partes...",
      descripcion: "Agregar selección como partes...",
      descripcionLarga: "Crea enlaces de agregación desde N-1 cosas hacia la última seleccionada",
      handler: conectarMultiAlTodo,
    }),
    registrarAtajo({ combo: "Escape", ctx: "global", categoria: "seleccion", descripcion: "Cerrar modal superior o vaciar selección", handler: cerrarModalSuperiorOVaciarSeleccion }),
    registrarAtajo({ combo: "ArrowUp", ctx: "canvas", categoria: "edicion", descripcion: "Mover selección 1 px hacia arriba", handler: () => s().nudgeSeleccion(0, -1) }),
    registrarAtajo({ combo: "ArrowDown", ctx: "canvas", categoria: "edicion", descripcion: "Mover selección 1 px hacia abajo", handler: () => s().nudgeSeleccion(0, 1) }),
    registrarAtajo({ combo: "ArrowLeft", ctx: "canvas", categoria: "edicion", descripcion: "Mover selección 1 px a la izquierda", handler: () => s().nudgeSeleccion(-1, 0) }),
    registrarAtajo({ combo: "ArrowRight", ctx: "canvas", categoria: "edicion", descripcion: "Mover selección 1 px a la derecha", handler: () => s().nudgeSeleccion(1, 0) }),
    registrarAtajo({ combo: "Shift+ArrowUp", ctx: "canvas", categoria: "edicion", descripcion: "Mover selección 10 px hacia arriba", handler: () => s().nudgeSeleccion(0, -10) }),
    registrarAtajo({ combo: "Shift+ArrowDown", ctx: "canvas", categoria: "edicion", descripcion: "Mover selección 10 px hacia abajo", handler: () => s().nudgeSeleccion(0, 10) }),
    registrarAtajo({ combo: "Shift+ArrowLeft", ctx: "canvas", categoria: "edicion", descripcion: "Mover selección 10 px a la izquierda", handler: () => s().nudgeSeleccion(-10, 0) }),
    registrarAtajo({ combo: "Shift+ArrowRight", ctx: "canvas", categoria: "edicion", descripcion: "Mover selección 10 px a la derecha", handler: () => s().nudgeSeleccion(10, 0) }),
    registrarAtajo({ combo: "Ctrl+ArrowUp", ctx: "global", categoria: "navegacion", descripcion: "Ir al OPD hermano anterior", handler: () => s().navegarOpdArriba() }),
    registrarAtajo({ combo: "Ctrl+ArrowDown", ctx: "global", categoria: "navegacion", descripcion: "Ir al OPD hermano siguiente", handler: () => s().navegarOpdAbajo() }),
    registrarAtajo({ combo: "Ctrl+ArrowLeft", ctx: "global", categoria: "navegacion", descripcion: "Ir al OPD padre", handler: () => s().navegarOpdIzquierda() }),
    registrarAtajo({ combo: "Ctrl+ArrowRight", ctx: "global", categoria: "navegacion", descripcion: "Ir al primer OPD hijo", handler: () => s().navegarOpdDerecha() }),
    registrarAtajo({ combo: "Shift+I", ctx: "canvas", categoria: "edicion", descripcion: "Crear inzoom de la cosa seleccionada", handler: () => s().descomponerSeleccionada() }),
    registrarAtajo({ combo: "Shift+U", ctx: "canvas", categoria: "edicion", descripcion: "Desplegar selección", handler: () => s().desplegarSeleccionada() }),
    registrarAtajo({ combo: "Ctrl+Shift+C", ctx: "canvas", categoria: "edicion", descripcion: "Copiar formato de enlace seleccionado", handler: copiarEstiloEnlace }),
    registrarAtajo({ combo: "Ctrl+T", ctx: "global", categoria: "navegacion", descripcion: "Abrir pestaña nueva", handler: () => s().abrirPestanaNueva?.() }),
    registrarAtajo({ combo: "Ctrl+W", ctx: "global", categoria: "navegacion", descripcion: "Cerrar pestaña activa", handler: () => {
      const state = s();
      state.cerrarPestana?.(state.pestanaActivaId);
    } }),
    registrarAtajo({ combo: "Ctrl+Tab", ctx: "global", categoria: "navegacion", descripcion: "Siguiente pestaña", handler: () => cambiarPestanaRelativa(1) }),
    registrarAtajo({ combo: "Ctrl+Shift+Tab", ctx: "global", categoria: "navegacion", descripcion: "Pestaña anterior", handler: () => cambiarPestanaRelativa(-1) }),
    // L3 ronda 20: Ctrl+B abre/cierra la biblioteca dock acoplada bajo el árbol OPD.
    // Verificado en atajosTeclado: combo libre. Decisión §10 brief: usamos Ctrl+B.
    registrarAtajo({ combo: "Ctrl+B", ctx: "global", categoria: "vista", descripcion: "Abrir/cerrar biblioteca dock", handler: () => s().toggleBibliotecaDock() }),
  ];
}

function cambiarPestanaRelativa(delta: 1 | -1): void {
  const state = store.getState();
  const pestanas = state.pestanasAbiertas ?? [];
  if (pestanas.length === 0) return;
  const actual = pestanas.findIndex((pestana) => pestana.id === state.pestanaActivaId);
  const siguiente = (actual + delta + pestanas.length) % pestanas.length;
  const siguienteId = pestanas[siguiente]?.id;
  if (siguienteId) state.cambiarPestanaActiva?.(siguienteId);
}

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
    gridTemplateRows: "48px 32px minmax(0, 1fr) auto auto",
    width: "100%",
    height: "100%",
    background: "#f5f7fb",
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
    borderTop: "1px solid #d9e0ea",
    borderBottom: "1px solid #d9e0ea",
  },
  treePane: {
    gridArea: "tree",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
  },
  treePaneArbol: {
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
  },
  bibliotecaDockPane: {
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
  },
  canvasPane: {
    gridArea: "canvas",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
    position: "relative",
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
  },
  inspectorContent: {
    minWidth: 0,
    minHeight: 0,
    flex: "1 1 0",
    overflow: "auto",
  },
  timelineInInspector: {
    height: "220px",
    minHeight: "220px",
    overflow: "hidden",
    borderTop: "1px solid #d9e0ea",
  },
  timelineFallback: {
    height: "220px",
    borderTop: "1px solid #d9e0ea",
  },
  // L2 ronda 21: en mobile la grilla es Toolbar+BarraPestanas+Section donde la
  // section contiene canvas+overlay+tabs como flex columna. Sin OPL inferior.
  pageMobile: {
    display: "grid",
    gridTemplateRows: "48px 32px minmax(0, 1fr)",
    width: "100%",
    height: "100%",
    background: "#f5f7fb",
    overflowX: "hidden",
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
  return esMobile ? layout.pageMobile : layout.page;
}

function workbenchStyle(
  anchoPanelArbol: number,
  anchoPanelInspector: number,
  inspectorAbierto: boolean,
  esTablet = false,
): preact.JSX.CSSProperties {
  // L2 ronda 21: en tablet (640-1024px) recortamos tree e inspector para
  // que el canvas conserve espacio útil sin reabrir el flujo desktop. Los
  // smokes desktop (≥1024) caen en la rama original.
  const anchoTreeBase = esTablet ? Math.min(anchoPanelArbol, 200) : anchoPanelArbol;
  // BUG-20260511T225343Z-696858: el ancho dinámico viene del store via
  // `anchoInspectorLayout`. Cuando el inspector se colapsa, tanto el divisor
  // como el inspector tienen ancho 0.
  const anchoInspector = inspectorAbierto ? `${anchoPanelInspector}px` : "0px";
  const anchoDivisorInspector = inspectorAbierto ? "6px" : "0px";
  return {
    ...layout.workbench,
    gridTemplateColumns: `${anchoTreeBase}px 6px minmax(0, 1fr) ${anchoDivisorInspector} ${anchoInspector}`,
    gridTemplateAreas: `"tree divisor canvas divisorInspector inspector"`,
  };
}

/**
 * BUG-20260511T225343Z-696858: en tablet recortamos el ancho del inspector
 * al default (300) para no comer canvas; el valor del store se preserva tal
 * cual para cuando vuelva a desktop. Pure helper para hacerlo testeable.
 */
function anchoPanelInspectorLayout(anchoPanelInspector: number, esTablet: boolean): number {
  return esTablet ? Math.min(anchoPanelInspector, ANCHO_PANEL_INSPECTOR_DEFAULT) : anchoPanelInspector;
}

/**
 * L3 ronda 20: cuando el dock está visible, el tree-pane se vuelve un grid
 * vertical `arbol | divisor 6px | dock` con la biblioteca dock acoplada
 * al borde inferior. Cuando está cerrado o el viewport es mobile, el
 * tree-pane mantiene la altura completa del workbench.
 */
function treePaneStyle(dockVisible: boolean, altoDock: number): preact.JSX.CSSProperties {
  if (!dockVisible) return layout.treePane;
  return {
    ...layout.treePane,
    display: "grid",
    gridTemplateRows: `minmax(0, 1fr) 6px ${altoDock}px`,
  };
}

function inspectorPaneStyle(abierto: boolean): preact.JSX.CSSProperties {
  return abierto
    ? layout.inspectorPane
    : {
        ...layout.inspectorPane,
        display: "none",
      };
}

function oplInferiorStyle(minimizado: boolean): preact.JSX.CSSProperties {
  return {
    minWidth: 0,
    minHeight: 0,
    height: minimizado ? "32px" : "180px",
    overflow: "hidden",
  };
}
