import { dia, shapes } from "jointjs";
import { useEffect, useRef, useState } from "preact/hooks";
import { normalizarGridConfig } from "../../canvas/grid";
import { focoPasoActualSimulacion } from "../../modelo/simulacion/foco";
import type { Apariencia, Enlace, ExtremoEnlace, Modelo, Opd } from "../../modelo/tipos";
import { useOpmStore } from "../../store";
import { RenombradoInline } from "../../ui/RenombradoInline";
import { recalcularOverlaysAbanicoDesdeLinkViews } from "./abanicoDragSync";
import { opmShapes } from "./customShapes";
import { proyectarModeloAJointCells } from "./proyeccion";
import { configurarGridPaper } from "./composers/grid";
import { cablearDrag, embedirContorno } from "./handlers/drag";
import {
  CANVAS_BASE,
  cellViewModel,
  dimensionesPaper,
  metadata,
  paperView,
  setPaperDimensions,
} from "./handlers/helpers";
import { aplicarHoverOpl, cablearHoverOpl } from "./handlers/hoverOpl";
import { aplicarFeedbackModoEnlace, cablearModoEnlace } from "./handlers/modoEnlace";
import { cablearRubberBand } from "./handlers/rubberBand";
import { cablearResize } from "./handlers/resize";
import { cablearSeleccion } from "./handlers/seleccion";
import { instalarHerramientasEnlaceSeleccionado } from "./handlers/toolsEnlace";
import { cablearZoomFit, cablearZoomWheel, fitCanvasAPantalla } from "./handlers/zoom";
import { aplicarRuteoOpcloudEnlaces } from "./opcloudRouting";
import { ordenarTodosLosEnlacesEstructurales } from "./sortStructuralLinks";

/**
 * Orquestador del canvas JointJS. Monta el paper con su configuración
 * (restrictTranslate, interactive) y compone los handlers por familia
 * desde `handlers/{seleccion,zoom,rubberBand,drag,hoverOpl,toolsEnlace}.ts`.
 *
 * Ronda 9 L2: la lógica de eventos antes inline (697 LOC) vive ahora en
 * sub-archivos por familia; este componente queda como orquestador delgado.
 */

interface JointAdapter {
  graph: dia.Graph;
  paper: dia.Paper;
}

export function JointCanvas() {
  const paperHostRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const adapterRef = useRef<JointAdapter | null>(null);
  const sincronizandoRef = useRef(false);
  const rubberBandRef = useRef(false);
  const suprimirBlankClickRef = useRef(false);

  const modoEnlace = useOpmStore((s) => s.modoEnlace);
  const modoEnlaceRef = useRef(modoEnlace);
  const modoCreacion = useOpmStore((s) => s.modoCreacion);
  const modoCreacionRef = useRef(modoCreacion);
  const modelo = useOpmStore((s) => s.modelo);
  const modeloRef = useRef(modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const opdActivoIdRef = useRef(opdActivoId);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const seleccionados = useOpmStore((s) => s.seleccionados);
  const seleccionadosRef = useRef(seleccionados);
  const enlaceSeleccionId = useOpmStore((s) => s.enlaceSeleccionId);
  const enlaceSeleccionIdRef = useRef(enlaceSeleccionId);
  const hoverOplRef = useOpmStore((s) => s.hoverOplRef);
  const uiAliasVisibles = useOpmStore((s) => s.uiAliasVisibles);
  const uiDescripcionesVisibles = useOpmStore((s) => s.uiDescripcionesVisibles);
  const uiModoImagenGlobal = useOpmStore((s) => s.uiModoImagenGlobal);
  // L2 r17: marca visual de proceso activo + estados current en modo simulación.
  const contextoSimulacion = useOpmStore((s) => s.contextoSimulacion);
  const seleccionarEntidad = useOpmStore((s) => s.seleccionarEntidad);
  const seleccionarEntidadRef = useRef(seleccionarEntidad);
  const seleccionarPartePlegada = useOpmStore((s) => s.seleccionarPartePlegada);
  const seleccionarPartePlegadaRef = useRef(seleccionarPartePlegada);
  const seleccionarEstadoComoExtremo = useOpmStore((s) => s.seleccionarEstadoComoExtremo);
  const seleccionarEstadoComoExtremoRef = useRef(seleccionarEstadoComoExtremo);
  const seleccionarEnlace = useOpmStore((s) => s.seleccionarEnlace);
  const seleccionarEnlaceRef = useRef(seleccionarEnlace);
  const seleccionarGrupoEstructural = useOpmStore((s) => s.seleccionarGrupoEstructural);
  const seleccionarGrupoEstructuralRef = useRef(seleccionarGrupoEstructural);
  const cambiarOpdActivo = useOpmStore((s) => s.cambiarOpdActivo);
  const cambiarOpdActivoRef = useRef(cambiarOpdActivo);
  const moverAparienciaConPuertos = useOpmStore((s) => s.moverAparienciaConPuertos);
  const moverAparienciaConPuertosRef = useRef(moverAparienciaConPuertos);
  const actualizarPosicionSimboloEstructural = useOpmStore((s) => s.actualizarPosicionSimboloEstructural);
  const actualizarPosicionSimboloEstructuralRef = useRef(actualizarPosicionSimboloEstructural);
  const cambiarModoPlegadoApariencia = useOpmStore((s) => s.cambiarModoPlegadoApariencia);
  const cambiarModoPlegadoAparienciaRef = useRef(cambiarModoPlegadoApariencia);
  const alternarModoImagenEntidad = useOpmStore((s) => s.alternarModoImagenEntidad);
  const alternarModoImagenEntidadRef = useRef(alternarModoImagenEntidad);
  const abrirModalImagen = useOpmStore((s) => s.abrirModalImagen);
  const abrirModalImagenRef = useRef(abrirModalImagen);
  const extraerParteDePlegado = useOpmStore((s) => s.extraerParteDePlegado);
  const extraerParteDePlegadoRef = useRef(extraerParteDePlegado);
  const actualizarVerticesEnlace = useOpmStore((s) => s.actualizarVerticesEnlace);
  const actualizarVerticesEnlaceRef = useRef(actualizarVerticesEnlace);
  const crearEntidadEnCanvas = useOpmStore((s) => s.crearEntidadEnCanvas);
  const crearEntidadEnCanvasRef = useRef(crearEntidadEnCanvas);
  const crearEnlaceEntreEntidades = useOpmStore((s) => s.crearEnlaceEntreEntidades);
  const crearEnlaceEntreEntidadesRef = useRef(crearEnlaceEntreEntidades);
  const fijarHoverOpl = useOpmStore((s) => s.fijarHoverOpl);
  const fijarHoverOplRef = useRef(fijarHoverOpl);
  const setSeleccion = useOpmStore((s) => s.setSeleccion);
  const setSeleccionRef = useRef(setSeleccion);
  const agregarASeleccion = useOpmStore((s) => s.agregarASeleccion);
  const agregarASeleccionRef = useRef(agregarASeleccion);
  const toggleSeleccion = useOpmStore((s) => s.toggleSeleccion);
  const toggleSeleccionRef = useRef(toggleSeleccion);
  const vaciarSeleccion = useOpmStore((s) => s.vaciarSeleccion);
  const vaciarSeleccionRef = useRef(vaciarSeleccion);
  const redimensionarAparienciaEnCanvas = useOpmStore((s) => s.redimensionarAparienciaEnCanvas);
  const redimensionarAparienciaEnCanvasRef = useRef(redimensionarAparienciaEnCanvas);
  const renombrarEntidadDesdeOpl = useOpmStore((s) => s.renombrarEntidadDesdeOpl);
  const renombrarEntidadDesdeOplRef = useRef(renombrarEntidadDesdeOpl);
  const [renombradoInline, setRenombradoInline] = useState<null | { aparienciaId: string; entidadId: string }>(null);
  const abrirRenombradoInlineRef = useRef((input: { aparienciaId: string; entidadId: string }) => setRenombradoInline(input));
  const gridConfig = useOpmStore((s) => normalizarGridConfig(s.gridConfig ?? s.indice.preferenciasUi?.gridConfig));

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
    seleccionarEntidadRef.current = seleccionarEntidad;
    seleccionarPartePlegadaRef.current = seleccionarPartePlegada;
    seleccionarEstadoComoExtremoRef.current = seleccionarEstadoComoExtremo;
    seleccionarEnlaceRef.current = seleccionarEnlace;
    seleccionarGrupoEstructuralRef.current = seleccionarGrupoEstructural;
    cambiarOpdActivoRef.current = cambiarOpdActivo;
    moverAparienciaConPuertosRef.current = moverAparienciaConPuertos;
    actualizarPosicionSimboloEstructuralRef.current = actualizarPosicionSimboloEstructural;
    cambiarModoPlegadoAparienciaRef.current = cambiarModoPlegadoApariencia;
    alternarModoImagenEntidadRef.current = alternarModoImagenEntidad;
    abrirModalImagenRef.current = abrirModalImagen;
    extraerParteDePlegadoRef.current = extraerParteDePlegado;
    actualizarVerticesEnlaceRef.current = actualizarVerticesEnlace;
    crearEntidadEnCanvasRef.current = crearEntidadEnCanvas;
    crearEnlaceEntreEntidadesRef.current = crearEnlaceEntreEntidades;
    fijarHoverOplRef.current = fijarHoverOpl;
    setSeleccionRef.current = setSeleccion;
    agregarASeleccionRef.current = agregarASeleccion;
    toggleSeleccionRef.current = toggleSeleccion;
    vaciarSeleccionRef.current = vaciarSeleccion;
    redimensionarAparienciaEnCanvasRef.current = redimensionarAparienciaEnCanvas;
    renombrarEntidadDesdeOplRef.current = renombrarEntidadDesdeOpl;
  }, [actualizarPosicionSimboloEstructural, actualizarVerticesEnlace, agregarASeleccion, alternarModoImagenEntidad, abrirModalImagen, cambiarModoPlegadoApariencia, cambiarOpdActivo, crearEnlaceEntreEntidades, crearEntidadEnCanvas, extraerParteDePlegado, fijarHoverOpl, moverAparienciaConPuertos, redimensionarAparienciaEnCanvas, renombrarEntidadDesdeOpl, seleccionarEnlace, seleccionarEntidad, seleccionarEstadoComoExtremo, seleccionarGrupoEstructural, seleccionarPartePlegada, setSeleccion, toggleSeleccion, vaciarSeleccion]);

  // Setup del paper + cableado de handlers (mount inicial).
  useEffect(() => {
    if (!paperHostRef.current) return;

    const cellNamespace = { ...shapes, opm: opmShapes };
    const graph = new dia.Graph({}, { cellNamespace });
    const paper = new dia.Paper({
      el: paperHostRef.current,
      model: graph,
      width: CANVAS_BASE.width,
      height: CANVAS_BASE.height,
      cellViewNamespace: cellNamespace,
      async: false,
      frozen: false,
      gridSize: 10,
      drawGrid: true,
      background: { color: "#eef3f8" },
      linkPinning: false,
      // Confina children embedded al bbox del padre durante el drag visual
      // (HU-12.020). Sin esto, los subprocesos internos pueden salir del
      // contorno y la kernel los snap-back al soltar, generando UX confuso.
      restrictTranslate(elementView) {
        const cell = cellViewModel(elementView as unknown as dia.CellView) as dia.Element;
        const parentId = (cell as unknown as { get(prop: string): string | undefined }).get("parent");
        if (!parentId) return false;
        const parent = graph.getCell(parentId) as dia.Element | undefined;
        if (!parent || parent.isLink()) return false;
        const parentBBox = parent.getBBox();
        // JointJS resta internamente el cellBBox al aplicar el rect
        // (Element.mjs:130-131); aqui devolvemos el bbox interior del padre
        // sin descontar cellBBox para evitar doble descuento que bloqueaba
        // el drag horizontal/vertical de subprocesos embebidos.
        const padX = 4;
        const padTop = 28;
        const padBottom = 8;
        return {
          x: parentBBox.x + padX,
          y: parentBBox.y + padTop,
          width: Math.max(0, parentBBox.width - 2 * padX),
          height: Math.max(0, parentBBox.height - padTop - padBottom),
        };
      },
      interactive(cellView) {
        const model = cellViewModel(cellView);
        if (model.isLink()) {
          const meta = metadata(model);
          const editable = meta?.kind === "enlace" && meta.enlaceId === enlaceSeleccionIdRef.current && meta.tipo !== "agregacion";
          return {
            arrowheadMove: false,
            labelMove: false,
            linkMove: false,
            useLinkTools: editable,
            vertexAdd: editable,
            vertexMove: editable,
            vertexRemove: editable,
          };
        }
        const meta = metadata(model);
        const esSimboloEstructural = meta?.kind === "enlace" && meta.rolEstructural === "simbolo";
        return {
          addLinkFromMagnet: false,
          elementMove: (meta?.kind === "entidad" || esSimboloEstructural) && !modoEnlaceRef.current && !modoCreacionRef.current,
        };
      },
    });

    setPaperDimensions(paper, CANVAS_BASE);
    configurarGridPaper(paper, gridConfig);

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
      abrirRenombradoInlineRef,
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
      actualizarVerticesEnlaceRef,
      extraerParteDePlegadoRef,
      abrirRenombradoInlineRef,
    }));

    cleanups.push(cablearResize({
      paper,
      redimensionarAparienciaRef: redimensionarAparienciaEnCanvasRef,
    }));

    cleanups.push(cablearModoEnlace({
      paper,
      modeloRef,
      opdActivoIdRef,
      modoEnlaceRef,
      crearEnlaceEntreEntidadesRef,
    }));

    cleanups.push(cablearHoverOpl({
      paper,
      fijarHoverOplRef,
    }));

    adapterRef.current = { graph, paper };
    // Hook de debug: permite que la sonda in-vivo (scripts/in-vivo-test.mjs)
    // mida posiciones reales del graph y endpoints reales del paper. Sin
    // efecto en runtime; solo es accesible desde DevTools/Playwright.
    (globalThis as { __opmJointAdapter?: JointAdapter }).__opmJointAdapter = { graph, paper };
    return () => {
      adapterRef.current = null;
      delete (globalThis as { __opmJointAdapter?: JointAdapter }).__opmJointAdapter;
      cleanups.forEach((fn) => fn());
      paperView(paper).remove();
      graph.clear();
    };
  }, []);

  useEffect(() => {
    const adapter = adapterRef.current;
    if (!adapter) return;
    configurarGridPaper(adapter.paper, gridConfig);
  }, [gridConfig]);

  // Proyección modelo → cells.
  useEffect(() => {
    const adapter = adapterRef.current;
    if (!adapter) return;
    const focoSimulacion = focoPasoActualSimulacion(modelo, contextoSimulacion);
    const cells = proyectarModeloAJointCells(
      modelo,
      opdActivoId,
      seleccionId,
      enlaceSeleccionId,
      null,
      seleccionados,
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
          }
        : null,
    );
    sincronizandoRef.current = true;
    adapter.graph.resetCells(cells as dia.Cell.JSON[]);
    setPaperDimensions(adapter.paper, dimensionesPaper(cells));
    embedirContorno(adapter.graph);
    aplicarRuteoOpcloudEnlaces(adapter.graph);
    ordenarTodosLosEnlacesEstructurales(adapter.paper, adapter.graph);
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
    sincronizandoRef.current = false;
    instalarHerramientasEnlaceSeleccionado(adapter, enlaceSeleccionId);
    aplicarHoverOpl(adapter.graph, modelo, hoverOplRef, enlaceSeleccionId);
    aplicarFeedbackModoEnlace(adapter.paper, modelo, opdActivoId, modoEnlace);
  }, [enlaceSeleccionId, modelo, modoEnlace, opdActivoId, seleccionId, seleccionados, uiAliasVisibles, uiDescripcionesVisibles, uiModoImagenGlobal, contextoSimulacion]);

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
  const solicitudFitToken = useOpmStore((s) => s.solicitudFitToken);
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
        {renombrado?.entidad && renombrado.apariencia ? (
          <RenombradoInline
            nombre={renombrado.entidad.nombre}
            rect={renombrado.apariencia}
            onConfirmar={(nombre) => {
              const entidad = renombrado.entidad;
              if (!entidad) return;
              renombrarEntidadDesdeOplRef.current(entidad.id, nombre);
              setRenombradoInline(null);
            }}
            onCancelar={() => setRenombradoInline(null)}
          />
        ) : null}
      </div>
    </div>
  );
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
    behavior: "smooth",
  });
}

const style = {
  viewport: {
    width: "100%",
    height: "100%",
    minWidth: 0,
    minHeight: 0,
    background: "#eef3f8",
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
