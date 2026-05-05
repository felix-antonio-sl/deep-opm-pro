import { dia, linkTools, shapes } from "jointjs";
import { useEffect, useRef } from "preact/hooks";
import { CANON } from "../../modelo/constantes";
import type { Modelo } from "../../modelo/tipos";
import { useOpmStore } from "../../store";
import type { OplReferencia } from "../../opl/interaccion";
import type { OpmJointMetadata } from "./proyeccion";
import { proyectarModeloAJointCells } from "./proyeccion";

type ExtraerParteDePlegado = (aparienciaId: string, parteEntidadId: string) => void;
type StoreConExtraccionPlegado = { extraerParteDePlegado?: ExtraerParteDePlegado };

interface JointAdapter {
  graph: dia.Graph;
  paper: dia.Paper;
}

export function JointCanvas() {
  const paperHostRef = useRef<HTMLDivElement>(null);
  const adapterRef = useRef<JointAdapter | null>(null);
  const sincronizandoRef = useRef(false);
  const modoEnlace = useOpmStore((s) => s.modoEnlace);
  const modoEnlaceRef = useRef(modoEnlace);
  const modoCreacion = useOpmStore((s) => s.modoCreacion);
  const modoCreacionRef = useRef(modoCreacion);
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const enlaceSeleccionId = useOpmStore((s) => s.enlaceSeleccionId);
  const enlaceSeleccionIdRef = useRef(enlaceSeleccionId);
  const hoverOplRef = useOpmStore((s) => s.hoverOplRef);
  const seleccionarEntidad = useOpmStore((s) => s.seleccionarEntidad);
  const seleccionarEntidadRef = useRef(seleccionarEntidad);
  const seleccionarPartePlegada = useOpmStore((s) => s.seleccionarPartePlegada);
  const seleccionarPartePlegadaRef = useRef(seleccionarPartePlegada);
  const seleccionarEstadoComoExtremo = useOpmStore((s) => s.seleccionarEstadoComoExtremo);
  const seleccionarEstadoComoExtremoRef = useRef(seleccionarEstadoComoExtremo);
  const seleccionarEnlace = useOpmStore((s) => s.seleccionarEnlace);
  const seleccionarEnlaceRef = useRef(seleccionarEnlace);
  const moverApariencia = useOpmStore((s) => s.moverApariencia);
  const moverAparienciaRef = useRef(moverApariencia);
  const cambiarModoPlegadoApariencia = useOpmStore((s) => s.cambiarModoPlegadoApariencia);
  const cambiarModoPlegadoAparienciaRef = useRef(cambiarModoPlegadoApariencia);
  const extraerParteDePlegado = useOpmStore((s) => s.extraerParteDePlegado);
  const extraerParteDePlegadoRef = useRef(extraerParteDePlegado);
  const actualizarVerticesEnlace = useOpmStore((s) => s.actualizarVerticesEnlace);
  const actualizarVerticesEnlaceRef = useRef(actualizarVerticesEnlace);
  const crearEntidadEnCanvas = useOpmStore((s) => s.crearEntidadEnCanvas);
  const crearEntidadEnCanvasRef = useRef(crearEntidadEnCanvas);
  const fijarHoverOpl = useOpmStore((s) => s.fijarHoverOpl);
  const fijarHoverOplRef = useRef(fijarHoverOpl);

  useEffect(() => {
    modoEnlaceRef.current = modoEnlace;
  }, [modoEnlace]);

  useEffect(() => {
    modoCreacionRef.current = modoCreacion;
  }, [modoCreacion]);

  useEffect(() => {
    enlaceSeleccionIdRef.current = enlaceSeleccionId;
  }, [enlaceSeleccionId]);

  useEffect(() => {
    seleccionarEntidadRef.current = seleccionarEntidad;
    seleccionarPartePlegadaRef.current = seleccionarPartePlegada;
    seleccionarEstadoComoExtremoRef.current = seleccionarEstadoComoExtremo;
    seleccionarEnlaceRef.current = seleccionarEnlace;
    moverAparienciaRef.current = moverApariencia;
    cambiarModoPlegadoAparienciaRef.current = cambiarModoPlegadoApariencia;
    extraerParteDePlegadoRef.current = extraerParteDePlegado;
    actualizarVerticesEnlaceRef.current = actualizarVerticesEnlace;
    crearEntidadEnCanvasRef.current = crearEntidadEnCanvas;
    fijarHoverOplRef.current = fijarHoverOpl;
  }, [actualizarVerticesEnlace, cambiarModoPlegadoApariencia, crearEntidadEnCanvas, extraerParteDePlegado, fijarHoverOpl, moverApariencia, seleccionarEnlace, seleccionarEntidad, seleccionarEstadoComoExtremo, seleccionarPartePlegada]);

  useEffect(() => {
    if (!paperHostRef.current) return;

    const cellNamespace = shapes;
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
        return {
          addLinkFromMagnet: false,
          elementMove: meta?.kind === "entidad" && !modoEnlaceRef.current && !modoCreacionRef.current,
        };
      },
    });

    setPaperDimensions(paper, CANVAS_BASE);

    paper.on("element:pointerclick", (elementView: dia.ElementView, evt: dia.Event) => {
      evt.stopPropagation();
      const tipoCreacion = modoCreacionRef.current;
      if (tipoCreacion) {
        const posicion = posicionCanvasDesdeEvento(paper, evt);
        crearEntidadEnCanvasRef.current(tipoCreacion, {
          x: Math.round(posicion.x),
          y: Math.round(posicion.y),
        });
        return;
      }
      const meta = metadata(cellViewModel(elementView));
      if (meta?.kind === "entidad") {
        const selector = jointSelector(evt.target);
        if (selector === "foldBadge") {
          cambiarModoPlegadoAparienciaRef.current(meta.aparienciaId, "parcial");
          return;
        }
        const parteEntidadId = parteEntidadDesdeSelector(meta, selector);
        if (parteEntidadId) {
          seleccionarPartePlegadaRef.current(meta.aparienciaId, parteEntidadId);
          return;
        }
        const estadoId = estadoDesdeSelector(meta, selector);
        if (estadoId) {
          if (modoEnlaceRef.current) {
            seleccionarEstadoComoExtremoRef.current(estadoId);
            return;
          }
          seleccionarEntidadRef.current(meta.entidadId);
          return;
        }
        seleccionarEntidadRef.current(meta.entidadId);
      }
      if (meta?.kind === "enlace") seleccionarEnlaceRef.current(meta.enlaceId);
    });

    paper.on("element:pointerdblclick", (elementView: dia.ElementView, evt: dia.Event) => {
      evt.stopPropagation();
      const meta = metadata(cellViewModel(elementView));
      if (meta?.kind !== "entidad") return;
      const parteEntidadId = parteEntidadDesdeSelector(meta, jointSelector(evt.target));
      if (!parteEntidadId) return;
      extraerParteDePlegadoRef.current(meta.aparienciaId, parteEntidadId);
    });

    paper.on("link:pointerclick", (linkView: dia.LinkView, evt: dia.Event) => {
      evt.stopPropagation();
      const tipoCreacion = modoCreacionRef.current;
      if (tipoCreacion) {
        const posicion = posicionCanvasDesdeEvento(paper, evt);
        crearEntidadEnCanvasRef.current(tipoCreacion, {
          x: Math.round(posicion.x),
          y: Math.round(posicion.y),
        });
        return;
      }
      const meta = metadata(cellViewModel(linkView));
      if (meta?.kind === "enlace") seleccionarEnlaceRef.current(meta.enlaceId);
    });

    paper.on("blank:pointerclick", (evt: dia.Event) => {
      const tipoCreacion = modoCreacionRef.current;
      if (!tipoCreacion) return;
      const posicion = posicionCanvasDesdeEvento(paper, evt);
      crearEntidadEnCanvasRef.current(tipoCreacion, {
        x: Math.round(posicion.x),
        y: Math.round(posicion.y),
      });
    });

    paper.on("cell:mouseover", (cellView: dia.CellView, evt: dia.Event) => {
      fijarHoverOplRef.current(refDesdeCellView(cellView, evt.target));
    });

    paper.on("cell:mouseout", () => {
      fijarHoverOplRef.current(null);
    });

    paper.on("element:pointerup", (elementView: dia.ElementView) => {
      if (sincronizandoRef.current) return;
      const model = cellViewModel(elementView);
      const meta = metadata(model);
      if (meta?.kind !== "entidad") return;
      const posicion = model.position();
      moverAparienciaRef.current(meta.aparienciaId, Math.round(posicion.x), Math.round(posicion.y));
    });

    graphEvents(graph).on("change:vertices", (cell: dia.Cell) => {
      if (sincronizandoRef.current || !cell.isLink()) return;
      const meta = metadata(cell);
      if (meta?.kind !== "enlace") return;
      actualizarVerticesEnlaceRef.current(
        meta.aparienciaEnlaceId,
        cell.vertices().map((vertice) => ({ x: vertice.x, y: vertice.y })),
      );
    });

    adapterRef.current = { graph, paper };
    return () => {
      adapterRef.current = null;
      paperView(paper).remove();
      graph.clear();
    };
  }, []);

  useEffect(() => {
    const adapter = adapterRef.current;
    if (!adapter) return;
    const cells = proyectarModeloAJointCells(modelo, opdActivoId, seleccionId, enlaceSeleccionId);
    sincronizandoRef.current = true;
    adapter.graph.resetCells(cells as dia.Cell.JSON[]);
    setPaperDimensions(adapter.paper, dimensionesPaper(cells));
    embedirContorno(adapter.graph);
    sincronizandoRef.current = false;
    instalarHerramientasEnlaceSeleccionado(adapter, enlaceSeleccionId);
    aplicarHoverOpl(adapter.graph, modelo, hoverOplRef, enlaceSeleccionId);
  }, [enlaceSeleccionId, modelo, opdActivoId, seleccionId]);

  useEffect(() => {
    const adapter = adapterRef.current;
    if (!adapter) return;
    aplicarHoverOpl(adapter.graph, modelo, hoverOplRef, enlaceSeleccionId);
  }, [enlaceSeleccionId, hoverOplRef, modelo]);

  return (
    <div role="img" aria-label="OPD activo" style={style.viewport}>
      <div ref={paperHostRef} style={style.paperHost} />
    </div>
  );
}

function metadata(cell: dia.Cell): OpmJointMetadata | null {
  const value = cell.prop("opm") as OpmJointMetadata | undefined;
  if (value?.kind === "entidad" || value?.kind === "enlace") return value;
  return null;
}

function parteEntidadDesdeSelector(meta: OpmJointMetadata, selector: string | null): string | null {
  if (meta.kind !== "entidad" || !selector) return null;
  return meta.partesPlegadas?.find((parte) => parte.selector === selector)?.entidadId ?? null;
}

function estadoDesdeSelector(meta: OpmJointMetadata, selector: string | null): string | null {
  if (meta.kind !== "entidad" || !selector) return null;
  return meta.estadosInteractivos?.find((estado) => estado.selector === selector)?.estadoId ?? null;
}

function refDesdeCellView(cellView: dia.CellView, target: EventTarget | null): OplReferencia | null {
  const meta = metadata(cellViewModel(cellView));
  if (meta?.kind === "enlace") return { tipo: "enlace", id: meta.enlaceId };
  if (meta?.kind !== "entidad") return null;
  const estadoId = estadoDesdeSelector(meta, jointSelector(target));
  if (estadoId) return { tipo: "estado", id: estadoId };
  return { tipo: "entidad", id: meta.entidadId };
}

function aplicarHoverOpl(graph: dia.Graph, modelo: Modelo, ref: OplReferencia | null, enlaceSeleccionId: string | null): void {
  for (const cell of graph.getCells()) {
    const meta = metadata(cell);
    if (meta?.kind === "entidad") {
      const entidad = modelo.entidades[meta.entidadId];
      const apariencia = modelo.opds[meta.opdId]?.apariencias[meta.aparienciaId];
      if (!entidad || !apariencia) continue;
      const resaltada = ref?.tipo === "entidad" && ref.id === entidad.id
        || ref?.tipo === "estado" && modelo.estados[ref.id]?.entidadId === entidad.id;
      cell.attr("body/fill", resaltada ? "#E1E6EB" : apariencia.estilo?.fill ?? CANON.colores.relleno);
      continue;
    }
    if (meta?.kind === "enlace") {
      const resaltado = ref?.tipo === "enlace" && ref.id === meta.enlaceId;
      const seleccionado = enlaceSeleccionId === meta.enlaceId;
      const strokeWidth = resaltado || seleccionado ? CANON.dims.enlaceVisible + 2 : CANON.dims.enlaceVisible;
      cell.attr("line/strokeWidth", strokeWidth);
      cell.attr("body/strokeWidth", strokeWidth);
    }
  }
}

function instalarHerramientasEnlaceSeleccionado(adapter: JointAdapter, enlaceSeleccionId: string | null): void {
  if (!enlaceSeleccionId) return;
  const link = adapter.graph.getLinks().find((cell) => {
    const meta = metadata(cell);
    return meta?.kind === "enlace" && meta.enlaceId === enlaceSeleccionId;
  });
  if (!link) return;
  const meta = metadata(link);
  if (meta?.kind === "enlace" && meta.tipo === "agregacion") return;
  const linkView = adapter.paper.findViewByModel<dia.LinkView>(link);
  linkView.removeTools();
  linkView.addTools(
    new dia.ToolsView({
      tools: [
        new linkTools.Boundary({
          padding: 18,
          useModelGeometry: true,
        }),
        new linkTools.Vertices({
          redundancyRemoval: false,
          snapRadius: 4,
          vertexAdding: true,
        }),
        new linkTools.Segments({
          redundancyRemoval: false,
          snapRadius: 4,
        }),
      ],
    }),
  );
}

function cellViewModel(cellView: dia.CellView): dia.Cell {
  return (cellView as unknown as { model: dia.Cell }).model;
}

function graphEvents(graph: dia.Graph): { on(eventName: string, callback: (cell: dia.Cell) => void): void } {
  return graph as unknown as { on(eventName: string, callback: (cell: dia.Cell) => void): void };
}

function jointSelector(target: EventTarget | null): string | null {
  if (!(target instanceof Element)) return null;
  return target.closest("[joint-selector]")?.getAttribute("joint-selector") ?? null;
}

function paperView(paper: dia.Paper): { remove(): void } {
  return paper as unknown as { remove(): void };
}

function posicionCanvasDesdeEvento(paper: dia.Paper, evt: dia.Event): { x: number; y: number } {
  const event = evt as unknown as MouseEvent;
  const paperConApi = paper as unknown as {
    pageToLocalPoint?: (x: number, y: number) => { x: number; y: number };
    clientToLocalPoint?: (x: number, y: number) => { x: number; y: number };
  };
  if (typeof paperConApi.pageToLocalPoint === "function" && Number.isFinite(event.pageX) && Number.isFinite(event.pageY)) {
    return paperConApi.pageToLocalPoint(event.pageX, event.pageY);
  }
  if (typeof paperConApi.clientToLocalPoint === "function" && Number.isFinite(event.clientX) && Number.isFinite(event.clientY)) {
    return paperConApi.clientToLocalPoint(event.clientX, event.clientY);
  }
  return { x: 0, y: 0 };
}

function setPaperDimensions(paper: dia.Paper, dimensiones: { width: number; height: number }): void {
  (paper as unknown as { setDimensions(width: number, height: number): void }).setDimensions(dimensiones.width, dimensiones.height);
  const element = (paper as unknown as { el: HTMLElement }).el;
  element.style.width = `${dimensiones.width}px`;
  element.style.height = `${dimensiones.height}px`;
}

// Identifica el contorno refinable (cell de mayor tamano marcado como entidad
// cuya apariencia define el limite del OPD activo) y le embeba todos los
// cells "entidad" cuyo centro caiga dentro de su bbox. JointJS arrastra
// automaticamente los cells embedded cuando el padre se mueve, sincronizando
// el render durante el drag visual con el delta que la kernel persiste al
// soltar (HU-12.008 contenedor envolvente; ver moverAparienciaPorId).
function embedirContorno(graph: dia.Graph): void {
  const elementos = graph.getElements();
  if (elementos.length === 0) return;
  let contorno: dia.Element | null = null;
  for (const cell of elementos) {
    const meta = cell.prop("opm") as OpmJointMetadata | undefined;
    if (meta?.kind === "entidad" && meta.rol === "contorno") {
      contorno = cell;
      break;
    }
  }
  if (!contorno) return;

  // Embeba SOLO apariencias internas. Las externas (proxy de entidades del
  // padre) deben quedar libres: no siguen al contorno durante el drag, y al
  // arrastrarse individualmente no se confinan al bbox del contorno.
  for (const cell of elementos) {
    if (cell.id === contorno.id) continue;
    const meta = cell.prop("opm") as OpmJointMetadata | undefined;
    if (meta?.kind !== "entidad") continue;
    if (meta.rol !== "interno") continue;
    contorno.embed(cell);
  }
}

function dimensionesPaper(cells: dia.Cell.JSON[]): { width: number; height: number } {
  let maxX: number = CANVAS_BASE.width;
  let maxY: number = CANVAS_BASE.height;
  for (const cell of cells) {
    const position = cell.position as { x?: number; y?: number } | undefined;
    const size = cell.size as { width?: number; height?: number } | undefined;
    if (!position) continue;
    maxX = Math.max(maxX, (position.x ?? 0) + (size?.width ?? 0) + CANVAS_PADDING);
    maxY = Math.max(maxY, (position.y ?? 0) + (size?.height ?? 0) + CANVAS_PADDING);
  }
  return { width: Math.ceil(maxX), height: Math.ceil(maxY) };
}

const CANVAS_BASE = { width: 1800, height: 1200 } as const;
const CANVAS_PADDING = 240;

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
    width: `${CANVAS_BASE.width}px`,
    height: `${CANVAS_BASE.height}px`,
    minWidth: `${CANVAS_BASE.width}px`,
    minHeight: `${CANVAS_BASE.height}px`,
    overflow: "hidden",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
