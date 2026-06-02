import { V, type dia } from "jointjs";
import type { ComponentChildren } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import type { FeedbackOverlay, FeedbackPort } from "../../app/ports/feedbackPort";
import { useJointCanvasViewModel } from "../../app/viewmodels/jointCanvasViewModel";
import { useZustandSimulationPort } from "../../app/ports/zustandSimulationPort";
import { CENTRO_CANVAS_GEOMETRICO } from "../../modelo/layout";
import { estadosInicialesDelModelo, focoPasoActualSimulacion } from "../../modelo/simulacion/foco";
import { debeAnimarTokensSim, tokensViajeDelPaso } from "../../modelo/simulacion/animacionTokens";
import { CODEX } from "./constantes.codex";
import type { Apariencia, Enlace, ExtremoEnlace, Id, Modelo, Opd, TipoEnlace } from "../../modelo/tipos";
import { recalcularOverlaysAbanicoDesdeLinkViews } from "./abanicoDragSync";
import { proyectarModeloAJointCells } from "./proyeccion";
import { cablearDrag, embedirContorno } from "./handlers/drag";
import { CANVAS_BASE, metadata } from "./handlers/helpers";
import { aplicarHoverOpl, cablearHoverOpl } from "./handlers/hoverOpl";
import {
  aplicarA11yConexionTeclado,
  aplicarFeedbackModoEnlace,
  cablearModoEnlace,
  type MenuTipoEnlaceCanvasInput,
} from "./handlers/modoEnlace";
import { cablearRubberBand } from "./handlers/rubberBand";
import { cablearResize } from "./handlers/resize";
import { cablearSeleccion } from "./handlers/seleccion";
import { instalarHerramientasEnlaceSeleccionado } from "./handlers/toolsEnlace";
import { instalarHerramientasSimboloEstructuralSeleccionado } from "./handlers/toolsSimboloEstructural";
import { cablearZoomFit, cablearZoomWheel, fitCanvasAPantalla } from "./handlers/zoom";
import { aplicarRuteoOpcloudEnlaces } from "./opcloudRouting";
import { construirAvisosFeedbackCanvas } from "./overlayCanvas/avisos";
import { OverlayLayer } from "./overlayCanvas/OverlayLayer";
import { jointCanvasPalette } from "./palette";
import { ordenarTodosLosEnlacesEstructurales } from "./sortStructuralLinks";
import {
  actualizarGridJointCanvasAdapter,
  crearJointCanvasAdapter,
  destruirJointCanvasAdapter,
  exponerDebugJointCanvasAdapter,
  sincronizarCellsJointCanvasAdapter,
  type JointCanvasAdapter,
} from "./jointCanvasAdapter";

/**
 * Orquestador del canvas JointJS. Monta el paper con su configuración
 * (restrictTranslate, interactive) y compone los handlers por familia
 * desde `handlers/{seleccion,zoom,rubberBand,drag,hoverOpl,toolsEnlace}.ts`.
 *
 * Ronda 9 L2: la lógica de eventos antes inline (697 LOC) vive ahora en
 * sub-archivos por familia; este componente queda como orquestador delgado.
 */

interface JointCanvasProps {
  onAdapterChange?: (adapter: JointCanvasAdapter | null) => void;
  feedbackPort: Pick<FeedbackPort, "sincronizarBadgesDesdeAvisos">;
  feedbackOverlays: readonly FeedbackOverlay[];
  renderMenuTipoEnlace: (props: CanvasMenuTipoEnlaceSlotProps) => ComponentChildren;
  renderRenombradoInline: (props: CanvasRenombradoInlineSlotProps) => ComponentChildren;
}

export interface CanvasRenombradoInlineSlotProps {
  nombre: string;
  rect: { x: number; y: number; width: number; height: number };
  onConfirmar: (nombre: string) => void;
  onCancelar: () => void;
}

export interface CanvasMenuTipoEnlaceSlotProps {
  modelo: Modelo;
  origenId: Id;
  destinoId: Id;
  direccion: DireccionTipoEnlaceCanvas;
  onDireccion: (direccion: DireccionTipoEnlaceCanvas) => void;
  onElegir: (tipo: TipoEnlace, origenId: Id, destinoId: Id) => void;
  anchor: { left: number; top: number };
  titulo: string;
  autoFocusFirstOption: boolean;
}

export type DireccionTipoEnlaceCanvas = "saliente" | "entrante";

export function JointCanvas({
  onAdapterChange,
  feedbackPort,
  feedbackOverlays,
  renderMenuTipoEnlace,
  renderRenombradoInline,
}: JointCanvasProps) {
  const paperHostRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const adapterRef = useRef<JointCanvasAdapter | null>(null);
  const onAdapterChangeRef = useRef(onAdapterChange);
  const feedbackPortRef = useRef(feedbackPort);
  const ultimoConteoAparienciasRef = useRef<{ opdId: Id; count: number } | null>(null);
  const [adapterState, setAdapterState] = useState<JointCanvasAdapter | null>(null);
  const sincronizandoRef = useRef(false);
  const rubberBandRef = useRef(false);
  const suprimirBlankClickRef = useRef(false);

  const {
    modoEnlace,
    modoCreacion,
    modelo,
    opdActivoId,
    seleccionId,
    seleccionados,
    idsResaltadosTemporales,
    enlaceSeleccionId,
    hoverOplRef,
    uiAliasVisibles,
    uiDescripcionesVisibles,
    uiModoImagenGlobal,
    contextoSimulacion,
    seleccionarEntidad,
    seleccionarPartePlegada,
    seleccionarEstadoComoExtremo,
    seleccionarEnlace,
    seleccionarGrupoEstructural,
    seleccionarEstado,
    agregarEstadoASeleccion,
    toggleSeleccionEstado,
    cambiarOpdActivo,
    moverAparienciaConPuertos,
    actualizarPosicionSimboloEstructural,
    actualizarAnclajesSimboloEstructural,
    cambiarModoPlegadoApariencia,
    alternarModoImagenEntidad,
    abrirModalImagen,
    extraerParteDePlegado,
    actualizarVerticesEnlace,
    actualizarPosicionLabelEnlace,
    crearEntidadEnCanvas,
    crearAparienciaEntidadEnCanvas,
    crearEnlaceEntreEntidades,
    elegirTipoEnlace,
    iniciarConexionDesdeApariencia,
    cancelarEnlace,
    fijarHoverOpl,
    setSeleccion,
    agregarASeleccion,
    toggleSeleccion,
    vaciarSeleccion,
    redimensionarAparienciaEnCanvas,
    redimensionarEstadoEnCanvas,
    reanclarExtremoAccion,
    renombrarEntidadDesdeOpl,
    gridConfig,
    solicitudFitToken,
  } = useJointCanvasViewModel();

  const { headless: simHeadless, velocidad: simVelocidad } = useZustandSimulationPort();

  useEffect(() => {
    onAdapterChangeRef.current = onAdapterChange;
  }, [onAdapterChange]);

  useEffect(() => {
    feedbackPortRef.current = feedbackPort;
  }, [feedbackPort]);

  const modoEnlaceRef = useRef(modoEnlace);
  const modoCreacionRef = useRef(modoCreacion);
  const modeloRef = useRef(modelo);
  const opdActivoIdRef = useRef(opdActivoId);
  const seleccionadosRef = useRef(seleccionados);
  const enlaceSeleccionIdRef = useRef(enlaceSeleccionId);
  const seleccionarEntidadRef = useRef(seleccionarEntidad);
  const seleccionarPartePlegadaRef = useRef(seleccionarPartePlegada);
  const seleccionarEstadoComoExtremoRef = useRef(seleccionarEstadoComoExtremo);
  const seleccionarEnlaceRef = useRef(seleccionarEnlace);
  const seleccionarGrupoEstructuralRef = useRef(seleccionarGrupoEstructural);
  // Paquete "Estados ciudadanos de primera clase" (2026-05-23).
  const seleccionarEstadoRef = useRef(seleccionarEstado);
  const agregarEstadoASeleccionRef = useRef(agregarEstadoASeleccion);
  const toggleSeleccionEstadoRef = useRef(toggleSeleccionEstado);
  const cambiarOpdActivoRef = useRef(cambiarOpdActivo);
  const moverAparienciaConPuertosRef = useRef(moverAparienciaConPuertos);
  const actualizarPosicionSimboloEstructuralRef = useRef(actualizarPosicionSimboloEstructural);
  const actualizarAnclajesSimboloEstructuralRef = useRef(actualizarAnclajesSimboloEstructural);
  const cambiarModoPlegadoAparienciaRef = useRef(cambiarModoPlegadoApariencia);
  const alternarModoImagenEntidadRef = useRef(alternarModoImagenEntidad);
  const abrirModalImagenRef = useRef(abrirModalImagen);
  const extraerParteDePlegadoRef = useRef(extraerParteDePlegado);
  const actualizarVerticesEnlaceRef = useRef(actualizarVerticesEnlace);
  const actualizarPosicionLabelEnlaceRef = useRef(actualizarPosicionLabelEnlace);
  const crearEntidadEnCanvasRef = useRef(crearEntidadEnCanvas);
  const crearAparienciaEntidadEnCanvasRef = useRef(crearAparienciaEntidadEnCanvas);
  const crearEnlaceEntreEntidadesRef = useRef(crearEnlaceEntreEntidades);
  const elegirTipoEnlaceRef = useRef(elegirTipoEnlace);
  const iniciarConexionDesdeAparienciaRef = useRef(iniciarConexionDesdeApariencia);
  const cancelarEnlaceRef = useRef(cancelarEnlace);
  const fijarHoverOplRef = useRef(fijarHoverOpl);
  const setSeleccionRef = useRef(setSeleccion);
  const agregarASeleccionRef = useRef(agregarASeleccion);
  const toggleSeleccionRef = useRef(toggleSeleccion);
  const vaciarSeleccionRef = useRef(vaciarSeleccion);
  const redimensionarAparienciaEnCanvasRef = useRef(redimensionarAparienciaEnCanvas);
  const redimensionarEstadoEnCanvasRef = useRef(redimensionarEstadoEnCanvas);
  const reanclarExtremoAccionRef = useRef(reanclarExtremoAccion);
  const renombrarEntidadDesdeOplRef = useRef(renombrarEntidadDesdeOpl);
  const [renombradoInline, setRenombradoInline] = useState<null | { aparienciaId: string; entidadId: string }>(null);
  const abrirRenombradoInlineRef = useRef((input: { aparienciaId: string; entidadId: string }) => setRenombradoInline(input));
  const [menuTipoEnlaceCanvas, setMenuTipoEnlaceCanvas] = useState<null | (MenuTipoEnlaceCanvasInput & { left: number; top: number })>(null);
  const [direccionTipoEnlaceCanvas, setDireccionTipoEnlaceCanvas] = useState<DireccionTipoEnlaceCanvas>("saliente");
  const menuTipoEnlaceCanvasRef = useRef<HTMLDivElement | null>(null);
  const ultimoOpdCentradoRef = useRef<string | null>(null);
  const abrirMenuTipoEnlaceCanvasRef = useRef((input: MenuTipoEnlaceCanvasInput) => {
    setDireccionTipoEnlaceCanvas("saliente");
    setMenuTipoEnlaceCanvas({ ...input, ...posicionMenuTipoEnlace(input.clientX, input.clientY) });
  });
  useEffect(() => {
    modoEnlaceRef.current = modoEnlace;
  }, [modoEnlace]);

  useEffect(() => {
    modoCreacionRef.current = modoCreacion;
  }, [modoCreacion]);

  useEffect(() => {
    enlaceSeleccionIdRef.current = enlaceSeleccionId;
    seleccionadosRef.current = seleccionados;
  }, [enlaceSeleccionId, seleccionados]);

  useEffect(() => {
    modeloRef.current = modelo;
    opdActivoIdRef.current = opdActivoId;
  }, [modelo, opdActivoId]);

  useEffect(() => {
    feedbackPort.sincronizarBadgesDesdeAvisos(construirAvisosFeedbackCanvas(modelo, opdActivoId));
  }, [feedbackPort, modelo, opdActivoId]);

  useEffect(() => () => feedbackPortRef.current.sincronizarBadgesDesdeAvisos([]), []);

  useEffect(() => {
    seleccionarEntidadRef.current = seleccionarEntidad;
    seleccionarPartePlegadaRef.current = seleccionarPartePlegada;
    seleccionarEstadoComoExtremoRef.current = seleccionarEstadoComoExtremo;
    seleccionarEnlaceRef.current = seleccionarEnlace;
    seleccionarGrupoEstructuralRef.current = seleccionarGrupoEstructural;
    seleccionarEstadoRef.current = seleccionarEstado;
    agregarEstadoASeleccionRef.current = agregarEstadoASeleccion;
    toggleSeleccionEstadoRef.current = toggleSeleccionEstado;
    cambiarOpdActivoRef.current = cambiarOpdActivo;
    moverAparienciaConPuertosRef.current = moverAparienciaConPuertos;
    actualizarPosicionSimboloEstructuralRef.current = actualizarPosicionSimboloEstructural;
    actualizarAnclajesSimboloEstructuralRef.current = actualizarAnclajesSimboloEstructural;
    cambiarModoPlegadoAparienciaRef.current = cambiarModoPlegadoApariencia;
    alternarModoImagenEntidadRef.current = alternarModoImagenEntidad;
    abrirModalImagenRef.current = abrirModalImagen;
    extraerParteDePlegadoRef.current = extraerParteDePlegado;
    actualizarVerticesEnlaceRef.current = actualizarVerticesEnlace;
    actualizarPosicionLabelEnlaceRef.current = actualizarPosicionLabelEnlace;
    crearEntidadEnCanvasRef.current = crearEntidadEnCanvas;
    crearAparienciaEntidadEnCanvasRef.current = crearAparienciaEntidadEnCanvas;
    crearEnlaceEntreEntidadesRef.current = crearEnlaceEntreEntidades;
    elegirTipoEnlaceRef.current = elegirTipoEnlace;
    iniciarConexionDesdeAparienciaRef.current = iniciarConexionDesdeApariencia;
    cancelarEnlaceRef.current = cancelarEnlace;
    fijarHoverOplRef.current = fijarHoverOpl;
    setSeleccionRef.current = setSeleccion;
    agregarASeleccionRef.current = agregarASeleccion;
    toggleSeleccionRef.current = toggleSeleccion;
    vaciarSeleccionRef.current = vaciarSeleccion;
    redimensionarAparienciaEnCanvasRef.current = redimensionarAparienciaEnCanvas;
    redimensionarEstadoEnCanvasRef.current = redimensionarEstadoEnCanvas;
    reanclarExtremoAccionRef.current = reanclarExtremoAccion;
    renombrarEntidadDesdeOplRef.current = renombrarEntidadDesdeOpl;
  }, [actualizarAnclajesSimboloEstructural, actualizarPosicionLabelEnlace, actualizarPosicionSimboloEstructural, actualizarVerticesEnlace, agregarASeleccion, agregarEstadoASeleccion, alternarModoImagenEntidad, abrirModalImagen, cancelarEnlace, cambiarModoPlegadoApariencia, cambiarOpdActivo, crearAparienciaEntidadEnCanvas, crearEnlaceEntreEntidades, crearEntidadEnCanvas, elegirTipoEnlace, extraerParteDePlegado, fijarHoverOpl, iniciarConexionDesdeApariencia, moverAparienciaConPuertos, reanclarExtremoAccion, redimensionarAparienciaEnCanvas, redimensionarEstadoEnCanvas, renombrarEntidadDesdeOpl, seleccionarEnlace, seleccionarEntidad, seleccionarEstado, seleccionarEstadoComoExtremo, seleccionarGrupoEstructural, seleccionarPartePlegada, setSeleccion, toggleSeleccion, toggleSeleccionEstado, vaciarSeleccion]);

  useEffect(() => {
    abrirMenuTipoEnlaceCanvasRef.current = (input: MenuTipoEnlaceCanvasInput) => {
      setDireccionTipoEnlaceCanvas("saliente");
      setMenuTipoEnlaceCanvas({ ...input, ...posicionMenuTipoEnlace(input.clientX, input.clientY) });
    };
  }, []);

  useEffect(() => {
    if (!menuTipoEnlaceCanvas) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setMenuTipoEnlaceCanvas(null);
      cancelarEnlaceRef.current();
    }
    function onPointerDown(event: PointerEvent) {
      const target = event.target;
      if (target instanceof Node && menuTipoEnlaceCanvasRef.current?.contains(target)) return;
      setMenuTipoEnlaceCanvas(null);
      cancelarEnlaceRef.current();
    }
    window.addEventListener("keydown", onKeyDown, { capture: true });
    window.addEventListener("pointerdown", onPointerDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      window.removeEventListener("pointerdown", onPointerDown, { capture: true });
    };
  }, [menuTipoEnlaceCanvas]);

  // Setup del paper + cableado de handlers (mount inicial).
  useEffect(() => {
    if (!paperHostRef.current) return;

    const adapter = crearJointCanvasAdapter({
      host: paperHostRef.current,
      gridConfig,
      enlaceSeleccionIdRef,
      modoEnlaceRef,
      modoCreacionRef,
    });
    const { graph, paper } = adapter;

    const cleanups: Array<() => void> = [];

    cleanups.push(cablearSeleccion({
      paper,
      modeloRef,
      modoEnlaceRef,
      modoCreacionRef,
      rubberBandRef,
      suprimirBlankClickRef,
      seleccionarEntidadRef,
      seleccionarPartePlegadaRef,
      seleccionarEstadoComoExtremoRef,
      seleccionarEnlaceRef,
      seleccionarGrupoEstructuralRef,
      cambiarOpdActivoRef,
      cambiarModoPlegadoAparienciaRef,
      alternarModoImagenEntidadRef,
      abrirModalImagenRef,
      agregarASeleccionRef,
      toggleSeleccionRef,
      vaciarSeleccionRef,
      crearEntidadEnCanvasRef,
      crearAparienciaEntidadEnCanvasRef,
      abrirRenombradoInlineRef,
      seleccionarEstadoRef,
      agregarEstadoASeleccionRef,
      toggleSeleccionEstadoRef,
    }));

    cleanups.push(cablearRubberBand({
      paper,
      modeloRef,
      opdActivoIdRef,
      modoCreacionRef,
      seleccionadosRef,
      setSeleccion: (ids) => setSeleccionRef.current(ids),
      onActivoChange: (activo) => { rubberBandRef.current = activo; },
      onSuprimirBlankClick: () => {
        suprimirBlankClickRef.current = true;
        window.setTimeout(() => { suprimirBlankClickRef.current = false; }, 0);
      },
    }));

    cleanups.push(cablearDrag({
      paper,
      graph,
      sincronizandoRef,
      modeloRef,
      opdActivoIdRef,
      moverAparienciaConPuertosRef,
      actualizarPosicionSimboloEstructuralRef,
      actualizarPosicionLabelEnlaceRef,
      actualizarVerticesEnlaceRef,
      reanclarExtremoAccionRef,
      extraerParteDePlegadoRef,
      abrirRenombradoInlineRef,
    }));

    cleanups.push(cablearResize({
      paper,
      redimensionarAparienciaRef: redimensionarAparienciaEnCanvasRef,
      redimensionarEstadoRef: redimensionarEstadoEnCanvasRef,
    }));

    cleanups.push(cablearModoEnlace({
      paper,
      modeloRef,
      opdActivoIdRef,
      modoEnlaceRef,
      iniciarConexionDesdeAparienciaRef,
      elegirTipoEnlaceRef,
      crearEnlaceEntreEntidadesRef,
      cancelarEnlaceRef,
      abrirMenuTipoEnlaceCanvasRef,
    }));

    cleanups.push(cablearHoverOpl({
      paper,
      fijarHoverOplRef,
    }));

    adapterRef.current = adapter;
    setAdapterState(adapter);
    onAdapterChangeRef.current?.(adapter);
    // Hook de debug: permite que la sonda in-vivo (scripts/in-vivo-test.mjs)
    // mida posiciones reales del graph y endpoints reales del paper. Sin
    // efecto en runtime; solo es accesible desde DevTools/Playwright.
    const limpiarDebugAdapter = exponerDebugJointCanvasAdapter(adapter);
    return () => {
      adapterRef.current = null;
      setAdapterState(null);
      onAdapterChangeRef.current?.(null);
      limpiarDebugAdapter();
      cleanups.forEach((fn) => fn());
      destruirJointCanvasAdapter(adapter);
    };
  }, []);

  useEffect(() => {
    const adapter = adapterRef.current;
    if (!adapter) return;
    actualizarGridJointCanvasAdapter(adapter, gridConfig);
  }, [gridConfig]);

  // Proyección modelo → cells.
  useEffect(() => {
    const adapter = adapterRef.current;
    if (!adapter) return;
    const focoSimulacion = focoPasoActualSimulacion(modelo, contextoSimulacion);
    const seleccionadosRender = idsResaltadosTemporales.length > 0
      ? Array.from(new Set([...seleccionados, ...idsResaltadosTemporales]))
      : seleccionados;
    const cells = proyectarModeloAJointCells(
      modelo,
      opdActivoId,
      seleccionId,
      enlaceSeleccionId,
      null,
      seleccionadosRender,
      {
        aliasVisibles: uiAliasVisibles,
        descripcionesVisibles: uiDescripcionesVisibles,
        modoImagenGlobal: uiModoImagenGlobal,
      },
      contextoSimulacion
        ? {
            procesoActivoId: focoSimulacion.paso?.opdId === opdActivoId ? focoSimulacion.procesoActivoId : null,
            estadosCurrent: contextoSimulacion.estadosCurrent,
            entidadesInvolucradasIds: focoSimulacion.paso?.opdId === opdActivoId ? focoSimulacion.entidadesInvolucradasIds : [],
            enlacesInvolucradosIds: focoSimulacion.paso?.opdId === opdActivoId ? focoSimulacion.enlacesInvolucradosIds : [],
            estadosInicialesIds: estadosInicialesDelModelo(modelo),
          }
        : null,
    );
    sincronizandoRef.current = true;
    try {
      sincronizarCellsJointCanvasAdapter(adapter, cells as dia.Cell.JSON[]);
      embedirContorno(adapter.graph);
      aplicarRuteoOpcloudEnlaces(adapter.graph);
      ordenarTodosLosEnlacesEstructurales(adapter.paper, adapter.graph);
      aplicarA11yConexionTeclado(adapter.paper, modelo);
      // Reposiciona overlays-abanico desde los LinkView ya renderizados (paper
      // async:false garantiza que los views existen tras resetCells). El path
      // del cold render era una aproximacion geometrica; aqui lo reemplazamos
      // por el calculo basado en sourcePoint/targetPoint/getPointAtLength
      // reales, que coincide con donde JointJS dibuja los enlaces.
      recalcularOverlaysAbanicoDesdeLinkViews({
        paper: adapter.paper,
        graph: adapter.graph,
        modelo,
        opdId: opdActivoId,
      });
    } finally {
      sincronizandoRef.current = false;
    }
    instalarHerramientasEnlaceSeleccionado(adapter, enlaceSeleccionId);
    instalarHerramientasSimboloEstructuralSeleccionado(
      adapter,
      enlaceSeleccionId,
      (aparienciaEnlaceIds, _posicion, anclajes) => {
        actualizarAnclajesSimboloEstructuralRef.current(aparienciaEnlaceIds, anclajes);
      },
    );
    aplicarHoverOpl(adapter.graph, modelo, hoverOplRef, enlaceSeleccionId);
    aplicarFeedbackModoEnlace(adapter.paper, modelo, opdActivoId, modoEnlace);
    const opdActual = modelo.opds[opdActivoId];
    const aparienciaCount = Object.keys(opdActual?.apariencias ?? {}).length;
    const ultimoConteo = ultimoConteoAparienciasRef.current;
    const primeraAparienciaEnOpdVacio = ultimoConteo?.opdId === opdActivoId && ultimoConteo.count === 0 && aparienciaCount > 0;
    ultimoConteoAparienciasRef.current = { opdId: opdActivoId, count: aparienciaCount };
    if (primeraAparienciaEnOpdVacio) {
      centrarViewportEnPuntoCanvas(viewportRef.current, CENTRO_CANVAS_GEOMETRICO, "auto");
    } else if (ultimoOpdCentradoRef.current !== opdActivoId) {
      ultimoOpdCentradoRef.current = opdActivoId;
      requestAnimationFrame(() => centrarViewportEnPuntoCanvas(viewportRef.current, CENTRO_CANVAS_GEOMETRICO, "auto"));
    }
  }, [enlaceSeleccionId, idsResaltadosTemporales, modelo, opdActivoId, seleccionId, seleccionados, uiAliasVisibles, uiDescripcionesVisibles, uiModoImagenGlobal, contextoSimulacion]);

  // B0.017 — token verde viajero sobre cada enlace en uso del paso activo.
  // Animacion solo-render (no es verdad del modelo). Se dispara en cada
  // transicion de paso; en headless o cuando el paso no vive en el OPD
  // visible, no anima (gate puro `debeAnimarTokensSim`).
  // Los tokens se autolimpian al completar la animacion; el cleanup desmonta
  // los tokens en vuelo al cambiar de OPD / salir de simulacion.
  useEffect(() => {
    const adapter = adapterRef.current;
    if (!adapter) return;
    const foco = focoPasoActualSimulacion(modelo, contextoSimulacion);
    if (!debeAnimarTokensSim(foco, opdActivoId, simHeadless)) return;
    const duracion = Math.round(900 / simVelocidad);
    const tokensVivos: ReturnType<typeof V>[] = [];
    for (const enlaceId of tokensViajeDelPaso(foco)) {
      const cell = adapter.graph.getCell(enlaceId);
      if (!cell) continue;
      const linkView = adapter.paper.findViewByModel(cell);
      if (!linkView || typeof (linkView as { sendToken?: unknown }).sendToken !== "function") continue;
      const token = V("circle", {
        r: 6,
        fill: CODEX.colores.opmObjeto,
        stroke: jointCanvasPalette.background,
        "stroke-width": 1,
      });
      tokensVivos.push(token);
      (linkView as unknown as { sendToken: (t: SVGElement, d: number) => void }).sendToken(token.node, duracion);
    }
    return () => {
      for (const token of tokensVivos) token.remove();
    };
  }, [adapterState, modelo, contextoSimulacion, opdActivoId, simHeadless, simVelocidad]);

  useEffect(() => {
    const adapter = adapterRef.current;
    if (!adapter) return;
    aplicarFeedbackModoEnlace(adapter.paper, modelo, opdActivoId, modoEnlace);
  }, [modelo, modoEnlace, opdActivoId]);

  useEffect(() => {
    const adapter = adapterRef.current;
    if (!adapter) return;
    aplicarHoverOpl(adapter.graph, modelo, hoverOplRef, enlaceSeleccionId);
  }, [enlaceSeleccionId, hoverOplRef, modelo]);

  useEffect(() => {
    return cablearZoomFit(
      { get current() { return adapterRef.current?.paper ?? null; } },
      { get current() { return viewportRef.current; } },
    );
  }, []);

  useEffect(() => {
    const host = paperHostRef.current;
    if (!host) return;
    return cablearZoomWheel({
      host,
      viewport: viewportRef.current,
      paperRef: { get current() { return adapterRef.current?.paper ?? null; } },
    });
  }, []);

  // P0-5: cuando una accion del store solicita fit-to-view (auto-layout,
  // por ejemplo), el contador `solicitudFitToken` se incrementa. Este
  // efecto observa el cambio y hace fit. Se hace en microtask para que
  // primero termine la sincronizacion modelo->paper (effect anterior con
  // [modelo] en deps), y asi el bbox tenga el contenido recien proyectado.
  // El primer paint (token=0) NO dispara fit porque el efecto se monta
  // con el valor inicial; solo los incrementos posteriores provocan fit.
  const tokenInicialRef = useRef(solicitudFitToken);
  useEffect(() => {
    if (solicitudFitToken === tokenInicialRef.current) return;
    const id = requestAnimationFrame(() => {
      const paper = adapterRef.current?.paper;
      fitCanvasAPantalla(paper ?? undefined, viewportRef.current);
    });
    return () => cancelAnimationFrame(id);
  }, [solicitudFitToken]);

  // [Ronda 16 L2] Cuando la selección llega desde fuera del canvas (búsqueda
  // intra-modelo, navegación OPL), si la apariencia o el enlace seleccionado
  // queda fuera del viewport scrolleable, lo centramos. Solo actúa si el
  // elemento NO está ya visible — preserva el scroll natural cuando el usuario
  // selecciona algo dentro del viewport.
  useEffect(() => {
    const viewport = viewportRef.current;
    const adapter = adapterRef.current;
    if (!viewport || !adapter) return;
    const opd = modelo.opds[opdActivoId];
    if (!opd) return;
    let target: { x: number; y: number; width: number; height: number } | null = null;
    if (enlaceSeleccionId) {
      const aparienciaEnlace = Object.values(opd.enlaces).find((ap) => ap.enlaceId === enlaceSeleccionId);
      if (aparienciaEnlace) {
        const enlace = modelo.enlaces[enlaceSeleccionId];
        if (enlace) target = bboxAproximadoEnlace(modelo, opd, enlace);
      }
    } else if (seleccionId) {
      const apariencia = Object.values(opd.apariencias).find((ap) => ap.entidadId === seleccionId);
      if (apariencia) target = apariencia;
    }
    if (!target) return;
    if (seleccionActualVisibleEnViewport(adapter, viewport, { seleccionId, enlaceSeleccionId })) return;
    centrarSiFueraDeViewport(viewport, target);
  }, [seleccionId, enlaceSeleccionId, opdActivoId, modelo]);

  const renombrado = renombradoInline
    ? {
        entidad: modelo.entidades[renombradoInline.entidadId],
        apariencia: modelo.opds[opdActivoId]?.apariencias[renombradoInline.aparienciaId],
      }
    : null;

  return (
    <div ref={viewportRef} role="img" aria-label="OPD activo" data-atajos-contexto="canvas" style={style.viewport}>
      <div ref={paperHostRef} style={style.paperHost}>
        <OverlayLayer paper={adapterState?.paper ?? null} overlays={feedbackOverlays} />
        {renombrado?.entidad && renombrado.apariencia ? (
          renderRenombradoInline({
            nombre: renombrado.entidad.nombre,
            rect: renombrado.apariencia,
            onConfirmar: (nombre) => {
              const entidad = renombrado.entidad;
              if (!entidad) return;
              renombrarEntidadDesdeOplRef.current(entidad.id, nombre);
              setRenombradoInline(null);
            },
            onCancelar: () => setRenombradoInline(null),
          })
        ) : null}
        {menuTipoEnlaceCanvas ? (
          <div ref={menuTipoEnlaceCanvasRef}>
            {renderMenuTipoEnlace({
              modelo,
              origenId: menuTipoEnlaceCanvas.origenId,
              destinoId: menuTipoEnlaceCanvas.destinoId,
              direccion: direccionTipoEnlaceCanvas,
              onDireccion: setDireccionTipoEnlaceCanvas,
              onElegir: (tipo, origenId, destinoId) => {
                crearEnlaceEntreEntidadesRef.current(origenId, destinoId, tipo, { anclaOrigen: menuTipoEnlaceCanvas.anchor });
                setMenuTipoEnlaceCanvas(null);
              },
              anchor: { left: menuTipoEnlaceCanvas.left, top: menuTipoEnlaceCanvas.top },
              titulo: tituloMenuConexion(modelo, menuTipoEnlaceCanvas.origenId, menuTipoEnlaceCanvas.destinoId),
              autoFocusFirstOption: menuTipoEnlaceCanvas.autoFocusFirstOption === true,
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function posicionMenuTipoEnlace(clientX: number, clientY: number): { left: number; top: number } {
  const width = 320;
  const height = 360;
  const margin = 12;
  const maxLeft = Math.max(margin, window.innerWidth - width - margin);
  const maxTop = Math.max(margin, window.innerHeight - height - margin);
  return {
    left: Math.min(maxLeft, Math.max(margin, clientX + 10)),
    top: Math.min(maxTop, Math.max(margin, clientY + 10)),
  };
}

function tituloMenuConexion(modelo: Modelo, origenId: string, destinoId: string): string {
  const origen = modelo.entidades[origenId]?.nombre ?? "Origen";
  const destino = modelo.entidades[destinoId]?.nombre ?? "Destino";
  return `Conectar ${origen} → ${destino}`;
}

/**
 * [Ronda 16 L2] BBox aproximado de un enlace en un OPD. Usa el bbox unión
 * de las apariencias de sus extremos (entidad o estado, vía entidad padre).
 * No consulta JointJS; basta con la geometría del modelo para decidir si
 * el enlace está fuera del viewport y centrarlo.
 */
function bboxAproximadoEnlace(
  modelo: Modelo,
  opd: Opd,
  enlace: Enlace,
): { x: number; y: number; width: number; height: number } | null {
  const aparienciaExtremo = (extremo: ExtremoEnlace): Apariencia | null => {
    const entidadId = extremo.kind === "entidad"
      ? extremo.id
      : modelo.estados[extremo.id]?.entidadId;
    if (!entidadId) return null;
    return Object.values(opd.apariencias).find((ap) => ap.entidadId === entidadId) ?? null;
  };
  const origen = aparienciaExtremo(enlace.origenId);
  const destino = aparienciaExtremo(enlace.destinoId);
  const apariencias = [origen, destino].filter((a): a is Apariencia => a !== null);
  if (apariencias.length === 0) return null;
  const minX = Math.min(...apariencias.map((a) => a.x));
  const minY = Math.min(...apariencias.map((a) => a.y));
  const maxX = Math.max(...apariencias.map((a) => a.x + a.width));
  const maxY = Math.max(...apariencias.map((a) => a.y + a.height));
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function seleccionActualVisibleEnViewport(
  adapter: JointCanvasAdapter,
  viewport: HTMLElement,
  seleccion: { seleccionId: Id | null; enlaceSeleccionId: Id | null },
): boolean {
  const cell = adapter.graph.getCells().find((item) => {
    const meta = metadata(item);
    if (!meta) return false;
    if (seleccion.seleccionId && meta.kind === "entidad") return meta.entidadId === seleccion.seleccionId;
    if (seleccion.enlaceSeleccionId && meta.kind === "enlace") {
      return meta.enlaceId === seleccion.enlaceSeleccionId || meta.enlaceIds?.includes(seleccion.enlaceSeleccionId) === true;
    }
    if (seleccion.enlaceSeleccionId && meta.kind === "grupo-enlaces") {
      return meta.enlaceIds.includes(seleccion.enlaceSeleccionId);
    }
    return false;
  });
  if (!cell) return false;
  const view = adapter.paper.findViewByModel(cell) as (dia.CellView & { el?: Element }) | undefined;
  if (!view?.el) return false;
  return rectDomVisibleEnViewport(view.el.getBoundingClientRect(), viewport.getBoundingClientRect());
}

function rectDomVisibleEnViewport(rect: DOMRect, viewportRect: DOMRect): boolean {
  const margin = 8;
  return (
    rect.right > viewportRect.left + margin &&
    rect.left < viewportRect.right - margin &&
    rect.bottom > viewportRect.top + margin &&
    rect.top < viewportRect.bottom - margin
  );
}

/**
 * [Ronda 16 L2] Centra el viewport sobre `target` si y solo si el target no
 * está completamente visible. Coordenadas de `target` están en el espacio del
 * paper, que coincide 1:1 con `paperHost` (zoom no aplicado en este nivel).
 */
function centrarSiFueraDeViewport(
  viewport: HTMLDivElement,
  target: { x: number; y: number; width: number; height: number },
): void {
  const margin = 40;
  const targetLeft = target.x - margin;
  const targetTop = target.y - margin;
  const targetRight = target.x + target.width + margin;
  const targetBottom = target.y + target.height + margin;
  const visibleLeft = viewport.scrollLeft;
  const visibleTop = viewport.scrollTop;
  const visibleRight = visibleLeft + viewport.clientWidth;
  const visibleBottom = visibleTop + viewport.clientHeight;
  const fueraHorizontal = targetLeft < visibleLeft || targetRight > visibleRight;
  const fueraVertical = targetTop < visibleTop || targetBottom > visibleBottom;
  if (!fueraHorizontal && !fueraVertical) return;
  const centroX = target.x + target.width / 2;
  const centroY = target.y + target.height / 2;
  viewport.scrollTo({
    left: Math.max(0, centroX - viewport.clientWidth / 2),
    top: Math.max(0, centroY - viewport.clientHeight / 2),
    behavior: scrollBehaviorPreferidoCanvas(),
  });
}

function centrarViewportEnPuntoCanvas(
  viewport: HTMLDivElement | null,
  punto: { x: number; y: number },
  behavior: ScrollBehavior = scrollBehaviorPreferidoCanvas(),
): void {
  if (!viewport || viewport.clientWidth <= 0 || viewport.clientHeight <= 0) return;
  viewport.scrollTo({
    left: Math.max(0, punto.x - viewport.clientWidth / 2),
    top: Math.max(0, punto.y - viewport.clientHeight / 2),
    behavior,
  });
}

function scrollBehaviorPreferidoCanvas(): ScrollBehavior {
  if (typeof globalThis.matchMedia !== "function") return "smooth";
  try {
    return globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  } catch {
    return "smooth";
  }
}

const style = {
  viewport: {
    width: "100%",
    height: "100%",
    minWidth: 0,
    minHeight: 0,
    background: jointCanvasPalette.background,
    overflow: "auto",
    overscrollBehavior: "contain",
  },
  paperHost: {
    position: "relative",
    width: `${CANVAS_BASE.width}px`,
    height: `${CANVAS_BASE.height}px`,
    minWidth: `${CANVAS_BASE.width}px`,
    minHeight: `${CANVAS_BASE.height}px`,
    overflow: "hidden",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
