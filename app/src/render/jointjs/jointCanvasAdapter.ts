import { dia, shapes } from "jointjs";
import type { GridConfig } from "../../canvas/grid";
import type { ModoEnlace } from "../../canvas/modoEnlace";
import type { TipoEntidad } from "../../modelo/tipos";
import { configurarGridPaper } from "./composers/grid";
import { opmShapes } from "./customShapes";
import { CANVAS_BASE, cellViewModel, dimensionesPaper, metadata, paperView, setPaperDimensions } from "./handlers/helpers";
import { jointCanvasPalette } from "./palette";

export interface JointCanvasAdapter {
  graph: dia.Graph;
  paper: dia.Paper;
}

interface RefActual<T> {
  current: T;
}

export interface CrearJointCanvasAdapterArgs {
  host: HTMLElement;
  gridConfig: GridConfig;
  enlaceSeleccionIdRef: RefActual<string | null>;
  modoEnlaceRef: RefActual<ModoEnlace | null>;
  modoCreacionRef: RefActual<TipoEntidad | null>;
}

export function crearJointCellNamespace(): Record<string, unknown> {
  return { ...shapes, opm: opmShapes };
}

export function opcionesPaperCodex(): { gridSize: number; drawGrid: boolean; background: { color: string } } {
  return {
    gridSize: 10,
    drawGrid: false,
    background: { color: jointCanvasPalette.background },
  };
}

export function crearJointCanvasAdapter(args: CrearJointCanvasAdapterArgs): JointCanvasAdapter {
  const { host, gridConfig, enlaceSeleccionIdRef, modoEnlaceRef, modoCreacionRef } = args;
  const cellNamespace = crearJointCellNamespace();
  const graph = new dia.Graph({}, { cellNamespace });
  const paper = new dia.Paper({
    el: host,
    model: graph,
    width: CANVAS_BASE.width,
    height: CANVAS_BASE.height,
    cellViewNamespace: cellNamespace,
    async: false,
    frozen: false,
    ...opcionesPaperCodex(),
    snapLabels: true,
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
        const enlaceSeleccionado = enlaceSeleccionIdRef.current;
        const seleccionado = meta?.kind === "enlace" && !!enlaceSeleccionado
          ? meta.enlaceId === enlaceSeleccionado || meta.enlaceIds?.includes(enlaceSeleccionado) === true
          : false;
        const editable = meta?.kind === "enlace" ? seleccionado && meta.tipo !== "agregacion" : false;
        return {
          arrowheadMove: false,
          labelMove: seleccionado,
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
  return { graph, paper };
}

export function actualizarGridJointCanvasAdapter(adapter: JointCanvasAdapter, gridConfig: GridConfig): void {
  configurarGridPaper(adapter.paper, gridConfig);
}

export function sincronizarCellsJointCanvasAdapter(adapter: JointCanvasAdapter, cells: dia.Cell.JSON[]): void {
  adapter.graph.resetCells(cells);
  setPaperDimensions(adapter.paper, dimensionesPaper(cells));
}

export function destruirJointCanvasAdapter(adapter: JointCanvasAdapter): void {
  paperView(adapter.paper).remove();
  adapter.graph.clear();
}

export function exponerDebugJointCanvasAdapter(adapter: JointCanvasAdapter): () => void {
  (globalThis as { __opmJointAdapter?: JointCanvasAdapter }).__opmJointAdapter = adapter;
  return () => {
    delete (globalThis as { __opmJointAdapter?: JointCanvasAdapter }).__opmJointAdapter;
  };
}
