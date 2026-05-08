/**
 * Workbench raíz OPM.
 *
 * Citas SSOT L1/L3: [JOYAS §1-3], [V-0c], [Met §metodologia].
 * PanelMetodologia se monta como
 * ViewComponent derivado por DataFlow puro, no Action ni side-effect.
 */

import { lazy, Suspense } from "preact/compat";
import { useEffect, useState } from "preact/hooks";
import { obtenerRefinamiento } from "../modelo/refinamientos";
import type { Id, Modelo } from "../modelo/tipos";
import { JointCanvas } from "../render/jointjs/JointCanvas";
import { store, useOpmStore } from "../store";
import { ArbolOpd } from "./ArbolOpd";
import { BarraHerramientasElemento } from "./BarraHerramientasElemento";
import { BarraPestanas } from "./BarraPestanas";
import { BibliotecaDock } from "./biblioteca/BibliotecaDock";
import { CapturadorBugs } from "./CapturadorBugs";
import { configurarContextoAtajos, escucharGlobal, registrarAtajo } from "./atajosTeclado";
import { ConfirmacionProvider } from "./ConfirmacionContext";
import { DivisorPanel } from "./divisorPanel";
import { Inspector } from "./Inspector";
import { MenuPrincipal } from "./MenuPrincipal";
import { PanelAvisos } from "./PanelAvisos";
import { PanelMetodologia } from "./PanelMetodologia";
import { PanelOpl } from "./PanelOpl";
import { tokens } from "./tokens";
import { Toolbar } from "./Toolbar";

const AsistenteNuevoModelo = lazy(() => import("./AsistenteNuevoModelo").then((m) => ({ default: m.AsistenteNuevoModelo })));
const CheatsheetAtajos = lazy(() => import("./CheatsheetAtajos").then((m) => ({ default: m.CheatsheetAtajos })));
const DialogoArchivados = lazy(() => import("./DialogoArchivados").then((m) => ({ default: m.DialogoArchivados })));
const DialogoBuscarCosas = lazy(() => import("./DialogoBuscarCosas").then((m) => ({ default: m.DialogoBuscarCosas })));
const DialogoBuscarGlobal = lazy(() => import("./DialogoBuscarGlobal").then((m) => ({ default: m.DialogoBuscarGlobal })));
const DialogoCargarModelo = lazy(() => import("./DialogoCargarModelo").then((m) => ({ default: m.DialogoCargarModelo })));
const DialogoGuardarComo = lazy(() => import("./DialogoGuardarComo").then((m) => ({ default: m.DialogoGuardarComo })));
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
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);
  const anchoPanelArbol = useOpmStore((s) => s.anchoPanelArbol);
  const preferenciasOpl = useOpmStore((s) => s.indice.preferenciasUi);
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const fijarAnchoPanelArbol = useOpmStore((s) => s.fijarAnchoPanelArbol);
  const asistenteAbierto = useOpmStore((s) => s.asistente !== null);
  const dialogoGuardarComoAbierto = useOpmStore((s) => s.dialogoGuardarComoAbierto);
  const dialogoCargarModeloAbierto = useOpmStore((s) => s.dialogoCargarModeloAbierto);
  const dialogoBuscarGlobalAbierto = useOpmStore((s) => s.dialogoBuscarGlobalAbierto);
  const busquedaCosasAbierta = useOpmStore((s) => s.busquedaCosasAbierta);
  const dialogoVersionesAbierto = useOpmStore((s) => s.dialogoVersionesAbierto !== null);
  const dialogoArchivadosAbierto = useOpmStore((s) => s.dialogoArchivadosAbierto);
  const modalUrlsAbierto = useOpmStore((s) => s.modalUrlsAbierto !== null);
  const modalImagenAbierto = useOpmStore((s) => s.modalImagenAbierto !== null);
  const modalDuracionAbierto = useOpmStore((s) => s.modalDuracionAbierto !== null);
  const tablaEnlacesAbierta = useOpmStore((s) => s.tablaEnlacesAbierta);
  const gestionArbolAbierta = useOpmStore((s) => s.gestionArbolAbierta);
  const cheatsheetAtajosAbierto = useOpmStore((s) => s.cheatsheetAtajosAbierto);
  const cerrarCheatsheetAtajos = useOpmStore((s) => s.cerrarCheatsheetAtajos);
  const [inspectorAbierto, setInspectorAbierto] = useState(true);
  const oplLateral = (preferenciasOpl?.oplPosicion ?? "inferior") === "lateral-derecho";
  const oplMinimizado = preferenciasOpl?.oplMinimizado ?? false;
  const timelineDisponible = tieneTimelineDisponible(modelo, opdActivoId);
  // L3 ronda 20: biblioteca dock acoplable bajo el arbol OPD.
  const bibliotecaDockAbierto = useOpmStore((s) => s.bibliotecaDockAbierto);
  const cerrarBibliotecaDock = useOpmStore((s) => s.cerrarBibliotecaDock);
  const cambiarOpdActivo = useOpmStore((s) => s.cambiarOpdActivo);
  const [esDesktop, setEsDesktop] = useState(typeof window === "undefined" ? true : window.innerWidth >= tokens.bibliotecaDock.desktopMinPx);
  const [altoDock, setAltoDock] = useState<number>(tokens.bibliotecaDock.altoInicial);
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const onResize = () => setEsDesktop(window.innerWidth >= tokens.bibliotecaDock.desktopMinPx);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const dockVisible = bibliotecaDockAbierto && esDesktop;

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

  return (
    <ConfirmacionProvider>
      <main style={layout.page}>
        <Toolbar />
        <MenuPrincipal />
        <BarraPestanas />
        <section style={workbenchStyle(anchoPanelArbol, oplLateral, oplMinimizado, inspectorAbierto)}>
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
            {vistaMapaActiva ? (
              <Suspense fallback={null}>
                <MapaSistema />
              </Suspense>
            ) : (
              <>
                <JointCanvas />
                <BarraHerramientasElemento
                  inspectorAbierto={inspectorAbierto}
                  onAbrirInspector={() => setInspectorAbierto(true)}
                  onToggleInspector={() => setInspectorAbierto((abierto) => !abierto)}
                />
              </>
            )}
          </div>
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
            <PanelAvisos />
            <PanelMetodologia />
          </div>
          {oplLateral ? (
            <div data-testid="opl-pane" style={layout.oplPane}>
              <PanelOpl />
            </div>
          ) : null}
        </section>
        {!oplLateral ? (
          <div data-testid="opl-pane" style={oplInferiorStyle(oplMinimizado)}>
            <PanelOpl />
          </div>
        ) : null}
        {dialogoGuardarComoAbierto ? <Suspense fallback={null}><DialogoGuardarComo /></Suspense> : null}
        {dialogoCargarModeloAbierto ? <Suspense fallback={null}><DialogoCargarModelo /></Suspense> : null}
        {dialogoBuscarGlobalAbierto ? <Suspense fallback={null}><DialogoBuscarGlobal /></Suspense> : null}
        {busquedaCosasAbierta ? <Suspense fallback={null}><DialogoBuscarCosas /></Suspense> : null}
        {dialogoVersionesAbierto ? <Suspense fallback={null}><DialogoVersiones /></Suspense> : null}
        {dialogoArchivadosAbierto ? <Suspense fallback={null}><DialogoArchivados /></Suspense> : null}
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
        <CapturadorBugs />
      </main>
    </ConfirmacionProvider>
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
    if (state.cheatsheetAtajosAbierto) return state.cerrarCheatsheetAtajos();
    if (state.gestionArbolAbierta) return state.cerrarGestionArbol();
    if (state.dialogoGuardarComoAbierto) return state.cerrarGuardarComo();
    if (state.dialogoCargarModeloAbierto) return state.cerrarCargarModelo();
    if (state.dialogoBuscarGlobalAbierto) return state.cerrarDialogoBuscarGlobal();
    if (state.dialogoVersionesAbierto) return state.cerrarDialogoVersiones();
    if (state.dialogoArchivadosAbierto) return state.cerrarDialogoArchivados();
    if (state.modalImagenAbierto) return state.cerrarModalImagen();
    if (state.modalUrlsAbierto) return state.cerrarModalUrls();
    if (state.modalDuracionAbierto) return state.cerrarModalDuracion();
    if (state.busquedaCosasAbierta) return state.cerrarBusquedaCosas();
    if (state.menuPrincipalAbierto) return state.cerrarMenuPrincipal();
    if (state.modoEnlace) return state.cancelarEnlace();
    return state.vaciarSeleccion();
  };
  return [
    registrarAtajo({ combo: "Ctrl+S", ctx: "global", categoria: "archivo", descripcion: "Guardar modelo", handler: () => s().guardarLocal() }),
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
    registrarAtajo({ combo: "Ctrl+Alt+T", ctx: "canvas", categoria: "edicion", descripcion: "Conectar selección al todo", handler: conectarMultiAlTodo }),
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
    registrarAtajo({ combo: "Shift+U", ctx: "canvas", categoria: "edicion", descripcion: "Desplegar selección", handler: () => s().desplegarSeleccionada() }),
    registrarAtajo({ combo: "Ctrl+Shift+C", ctx: "canvas", categoria: "edicion", descripcion: "Copiar formato de enlace seleccionado", handler: copiarEstiloEnlace }),
    registrarAtajo({ combo: "Ctrl+T", ctx: "global", categoria: "navegacion", descripcion: "Abrir pestaña nueva", handler: () => s().abrirPestanaNueva?.() }),
    registrarAtajo({ combo: "Ctrl+W", ctx: "global", categoria: "navegacion", descripcion: "Cerrar pestaña activa", handler: () => {
      const state = s();
      state.cerrarPestana?.(state.pestanaActivaId);
    } }),
    registrarAtajo({ combo: "Ctrl+Tab", ctx: "global", categoria: "navegacion", descripcion: "Siguiente pestaña", handler: () => cambiarPestanaRelativa(1) }),
    registrarAtajo({ combo: "Ctrl+Shift+Tab", ctx: "global", categoria: "navegacion", descripcion: "Pestaña anterior", handler: () => cambiarPestanaRelativa(-1) }),
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
    gridTemplateRows: "48px 37px minmax(0, 1fr) auto",
    width: "100%",
    height: "100%",
    background: "#f5f7fb",
  },
  workbench: {
    display: "grid",
    gridTemplateColumns: "240px 6px minmax(0, 1fr) 300px",
    gridTemplateAreas: `"tree divisor canvas inspector"`,
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
  oplPane: {
    gridArea: "opl",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
    borderLeft: "1px solid #d9e0ea",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;

function workbenchStyle(anchoPanelArbol: number, oplLateral: boolean, oplMinimizado: boolean, inspectorAbierto: boolean): preact.JSX.CSSProperties {
  const anchoInspector = inspectorAbierto ? "300px" : "0px";
  if (!oplLateral) {
    return {
      ...layout.workbench,
      gridTemplateColumns: `${anchoPanelArbol}px 6px minmax(0, 1fr) ${anchoInspector}`,
      gridTemplateAreas: `"tree divisor canvas inspector"`,
    };
  }
  return {
    ...layout.workbench,
    gridTemplateColumns: `${anchoPanelArbol}px 6px minmax(0, 1fr) ${anchoInspector} ${oplMinimizado ? "44px" : "320px"}`,
    gridTemplateAreas: `"tree divisor canvas inspector opl"`,
  };
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
