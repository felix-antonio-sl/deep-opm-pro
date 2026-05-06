import { lazy, Suspense } from "preact/compat";
import { useEffect } from "preact/hooks";
import { JointCanvas } from "../render/jointjs/JointCanvas";
import { store, useOpmStore } from "../store";
import { ArbolOpd } from "./ArbolOpd";
import { BarraPestanas } from "./BarraPestanas";
import { configurarContextoAtajos, escucharGlobal, registrarAtajo } from "./atajosTeclado";
import { ConfirmacionProvider } from "./ConfirmacionContext";
import { DivisorPanel } from "./divisorPanel";
import { GestionArbolOpd } from "./GestionArbolOpd";
import { Inspector } from "./Inspector";
import { PanelAvisos } from "./PanelAvisos";
import { PanelOpl } from "./PanelOpl";
import { Timeline } from "./Timeline";
import { Toolbar } from "./Toolbar";

const AsistenteNuevoModelo = lazy(() => import("./AsistenteNuevoModelo").then((m) => ({ default: m.AsistenteNuevoModelo })));
const CheatsheetAtajos = lazy(() => import("./CheatsheetAtajos").then((m) => ({ default: m.CheatsheetAtajos })));
const DialogoArchivados = lazy(() => import("./DialogoArchivados").then((m) => ({ default: m.DialogoArchivados })));
const DialogoBuscarGlobal = lazy(() => import("./DialogoBuscarGlobal").then((m) => ({ default: m.DialogoBuscarGlobal })));
const DialogoCargarModelo = lazy(() => import("./DialogoCargarModelo").then((m) => ({ default: m.DialogoCargarModelo })));
const DialogoGuardarComo = lazy(() => import("./DialogoGuardarComo").then((m) => ({ default: m.DialogoGuardarComo })));
const DialogoVersiones = lazy(() => import("./DialogoVersiones").then((m) => ({ default: m.DialogoVersiones })));
const MapaSistema = lazy(() => import("./MapaSistema").then((m) => ({ default: m.MapaSistema })));
const ModalDuracionEstado = lazy(() => import("./ModalDuracionEstado").then((m) => ({ default: m.ModalDuracionEstado })));
const ModalImagenObjeto = lazy(() => import("./ModalImagenObjeto").then((m) => ({ default: m.ModalImagenObjeto })));
const ModalUrlsObjeto = lazy(() => import("./ModalUrlsObjeto").then((m) => ({ default: m.ModalUrlsObjeto })));

export function App() {
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);
  const anchoPanelArbol = useOpmStore((s) => s.anchoPanelArbol);
  const preferenciasOpl = useOpmStore((s) => s.indice.preferenciasUi);
  const fijarAnchoPanelArbol = useOpmStore((s) => s.fijarAnchoPanelArbol);
  const asistenteAbierto = useOpmStore((s) => s.asistente !== null);
  const dialogoGuardarComoAbierto = useOpmStore((s) => s.dialogoGuardarComoAbierto);
  const dialogoCargarModeloAbierto = useOpmStore((s) => s.dialogoCargarModeloAbierto);
  const dialogoBuscarGlobalAbierto = useOpmStore((s) => s.dialogoBuscarGlobalAbierto);
  const dialogoVersionesAbierto = useOpmStore((s) => s.dialogoVersionesAbierto !== null);
  const dialogoArchivadosAbierto = useOpmStore((s) => s.dialogoArchivadosAbierto);
  const modalUrlsAbierto = useOpmStore((s) => s.modalUrlsAbierto !== null);
  const modalImagenAbierto = useOpmStore((s) => s.modalImagenAbierto !== null);
  const modalDuracionAbierto = useOpmStore((s) => s.modalDuracionAbierto !== null);
  const cheatsheetAtajosAbierto = useOpmStore((s) => s.cheatsheetAtajosAbierto);
  const cerrarCheatsheetAtajos = useOpmStore((s) => s.cerrarCheatsheetAtajos);
  const oplLateral = (preferenciasOpl?.oplPosicion ?? "inferior") === "lateral-derecho";
  const oplMinimizado = preferenciasOpl?.oplMinimizado ?? false;

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
        <BarraPestanas />
        <section style={workbenchStyle(anchoPanelArbol, oplLateral, oplMinimizado)}>
          <div data-testid="tree-pane" style={layout.treePane}>
            <ArbolOpd />
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
            ) : <JointCanvas />}
          </div>
          <div data-testid="inspector-pane" style={layout.inspectorPane}>
            <div style={layout.inspectorContent}>
              <Inspector />
            </div>
            <Timeline />
            <PanelAvisos />
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
        {dialogoVersionesAbierto ? <Suspense fallback={null}><DialogoVersiones /></Suspense> : null}
        {dialogoArchivadosAbierto ? <Suspense fallback={null}><DialogoArchivados /></Suspense> : null}
        <GestionArbolOpd />
        {asistenteAbierto ? <Suspense fallback={null}><AsistenteNuevoModelo /></Suspense> : null}
        {modalImagenAbierto ? <Suspense fallback={null}><ModalImagenObjeto /></Suspense> : null}
        {modalUrlsAbierto ? <Suspense fallback={null}><ModalUrlsObjeto /></Suspense> : null}
        {modalDuracionAbierto ? <Suspense fallback={null}><ModalDuracionEstado /></Suspense> : null}
        {cheatsheetAtajosAbierto ? (
          <Suspense fallback={null}>
            <CheatsheetAtajos abierto={cheatsheetAtajosAbierto} onCerrar={cerrarCheatsheetAtajos} />
          </Suspense>
        ) : null}
      </main>
    </ConfirmacionProvider>
  );
}

function registrarAtajosAplicacion(): Array<() => void> {
  const s = () => store.getState();
  const cerrarModalSuperiorOVaciarSeleccion = () => {
    const state = s();
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
    registrarAtajo({ combo: "Ctrl+Shift+C", ctx: "canvas", categoria: "edicion", descripcion: "Copiar formato de enlace seleccionado", handler: () => {
      const state = s();
      if (state.enlaceSeleccionId) state.copiarEstiloEnlaceAlPortapapeles(state.enlaceSeleccionId);
    } }),
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
    flex: "1 1 auto",
    overflow: "auto",
  },
  oplPane: {
    gridArea: "opl",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
    borderLeft: "1px solid #d9e0ea",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;

function workbenchStyle(anchoPanelArbol: number, oplLateral: boolean, oplMinimizado: boolean): preact.JSX.CSSProperties {
  if (!oplLateral) {
    return {
      ...layout.workbench,
      gridTemplateColumns: `${anchoPanelArbol}px 6px minmax(0, 1fr) 300px`,
      gridTemplateAreas: `"tree divisor canvas inspector"`,
    };
  }
  return {
    ...layout.workbench,
    gridTemplateColumns: `${anchoPanelArbol}px 6px minmax(0, 1fr) 300px ${oplMinimizado ? "44px" : "320px"}`,
    gridTemplateAreas: `"tree divisor canvas inspector opl"`,
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
