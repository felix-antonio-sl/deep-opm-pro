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
  const hostRef = useRef<HTMLDivElement>(null);
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
    if (!hostRef.current) return;

    const cellNamespace = shapes;
    const graph = new dia.Graph({}, { cellNamespace });
    const paper = new dia.Paper({
      el: hostRef.current,
      model: graph,
      width: "100%",
      height: "100%",
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
          const seleccionada = meta?.kind === "enlace" && meta.enlaceId === enlaceSeleccionIdRef.current;
          return {
            arrowheadMove: false,
            labelMove: false,
            linkMove: false,
            useLinkTools: seleccionada,
            vertexAdd: seleccionada,
            vertexMove: seleccionada,
            vertexRemove: seleccionada,
          };
        }
        const meta = metadata(model);
        return {
          addLinkFromMagnet: false,
          elementMove: meta?.kind === "entidad" && !modoEnlaceRef.current,
        };
      },
    });

    paperElement(paper).style.width = "100%";
    paperElement(paper).style.height = "100%";

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
    sincronizandoRef.current = true;
    adapter.graph.resetCells(proyectarModeloAJointCells(modelo, opdActivoId, seleccionId, enlaceSeleccionId) as dia.Cell.JSON[]);
    sincronizandoRef.current = false;
    instalarHerramientasEnlaceSeleccionado(adapter, enlaceSeleccionId);
  }, [enlaceSeleccionId, modelo, opdActivoId, seleccionId]);

  return <div ref={hostRef} role="img" aria-label="OPD activo" style={style.host} />;
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

function paperElement(paper: dia.Paper): HTMLElement {
  return (paper as unknown as { el: HTMLElement }).el;
}

function paperView(paper: dia.Paper): { remove(): void } {
  return paper as unknown as { remove(): void };
}

const style = {
  host: {
    width: "100%",
    height: "100%",
    minWidth: 0,
    minHeight: 0,
    background: "#eef3f8",
    overflow: "hidden",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
