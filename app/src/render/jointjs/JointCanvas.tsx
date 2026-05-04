import { dia, linkTools, shapes } from "jointjs";
import { useEffect, useRef } from "preact/hooks";
import { useOpmStore } from "../../store";
import type { OpmJointMetadata } from "./proyeccion";
import { proyectarModeloAJointCells } from "./proyeccion";

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
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const enlaceSeleccionId = useOpmStore((s) => s.enlaceSeleccionId);
  const enlaceSeleccionIdRef = useRef(enlaceSeleccionId);
  const seleccionarEntidad = useOpmStore((s) => s.seleccionarEntidad);
  const seleccionarEntidadRef = useRef(seleccionarEntidad);
  const seleccionarEnlace = useOpmStore((s) => s.seleccionarEnlace);
  const seleccionarEnlaceRef = useRef(seleccionarEnlace);
  const moverApariencia = useOpmStore((s) => s.moverApariencia);
  const moverAparienciaRef = useRef(moverApariencia);
  const actualizarVerticesEnlace = useOpmStore((s) => s.actualizarVerticesEnlace);
  const actualizarVerticesEnlaceRef = useRef(actualizarVerticesEnlace);

  useEffect(() => {
    modoEnlaceRef.current = modoEnlace;
  }, [modoEnlace]);

  useEffect(() => {
    enlaceSeleccionIdRef.current = enlaceSeleccionId;
  }, [enlaceSeleccionId]);

  useEffect(() => {
    seleccionarEntidadRef.current = seleccionarEntidad;
    seleccionarEnlaceRef.current = seleccionarEnlace;
    moverAparienciaRef.current = moverApariencia;
    actualizarVerticesEnlaceRef.current = actualizarVerticesEnlace;
  }, [actualizarVerticesEnlace, moverApariencia, seleccionarEnlace, seleccionarEntidad]);

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
          elementMove: meta?.kind === "entidad" && !modoEnlaceRef.current,
        };
      },
    });

    setPaperDimensions(paper, CANVAS_BASE);

    paper.on("element:pointerclick", (elementView: dia.ElementView, evt: dia.Event) => {
      evt.stopPropagation();
      const meta = metadata(cellViewModel(elementView));
      if (meta?.kind === "entidad") seleccionarEntidadRef.current(meta.entidadId);
      if (meta?.kind === "enlace") seleccionarEnlaceRef.current(meta.enlaceId);
    });

    paper.on("link:pointerclick", (linkView: dia.LinkView, evt: dia.Event) => {
      evt.stopPropagation();
      const meta = metadata(cellViewModel(linkView));
      if (meta?.kind === "enlace") seleccionarEnlaceRef.current(meta.enlaceId);
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
    sincronizandoRef.current = false;
    instalarHerramientasEnlaceSeleccionado(adapter, enlaceSeleccionId);
  }, [enlaceSeleccionId, modelo, opdActivoId, seleccionId]);

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

function paperView(paper: dia.Paper): { remove(): void } {
  return paper as unknown as { remove(): void };
}

function setPaperDimensions(paper: dia.Paper, dimensiones: { width: number; height: number }): void {
  (paper as unknown as { setDimensions(width: number, height: number): void }).setDimensions(dimensiones.width, dimensiones.height);
  const element = (paper as unknown as { el: HTMLElement }).el;
  element.style.width = `${dimensiones.width}px`;
  element.style.height = `${dimensiones.height}px`;
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
