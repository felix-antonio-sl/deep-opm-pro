import { dia, shapes } from "jointjs";
import { useEffect, useRef, useState } from "preact/hooks";
import { descargarMapa, type FormatoExport } from "../render/jointjs/mapaExport";
import { proyectarMapaSistemaAJointCells, type NodoMapa } from "../render/jointjs/mapaSistema";
import { useOpmStore } from "../store";
import { MapaFiltros } from "./MapaFiltros";
import { MapaPanelEstadisticas } from "./MapaPanelEstadisticas";

interface TooltipMapa {
  nodo: NodoMapa;
  x: number;
  y: number;
}

interface PanState {
  clientX: number;
  clientY: number;
  panX: number;
  panY: number;
}

export function MapaSistema() {
  const paperRef = useRef<dia.Paper | null>(null);
  const graphRef = useRef<dia.Graph | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<number | null>(null);
  const panRef = useRef<PanState | null>(null);
  const [tooltip, setTooltip] = useState<TooltipMapa | null>(null);

  const descriptorBase = useOpmStore((s) => s.descriptorMapaCache);
  const descriptor = useOpmStore((s) => s.descriptorMapaFiltrado());
  const estadisticas = useOpmStore((s) => s.estadisticasModelo());
  const modelo = useOpmStore((s) => s.modelo);
  const saltarAOpdDesdeMapa = useOpmStore((s) => s.saltarAOpdDesdeMapa);
  const cerrarVistaMapa = useOpmStore((s) => s.cerrarVistaMapa);
  const refrescarVistaMapa = useOpmStore((s) => s.refrescarVistaMapa);
  const mapaZoom = useOpmStore((s) => s.mapaZoom);
  const mapaPanX = useOpmStore((s) => s.mapaPanX);
  const mapaPanY = useOpmStore((s) => s.mapaPanY);
  const fijarMapaZoom = useOpmStore((s) => s.fijarMapaZoom);
  const fijarMapaPan = useOpmStore((s) => s.fijarMapaPan);
  const mapaAutoRefresh = useOpmStore((s) => s.mapaAutoRefresh);
  const toggleMapaAutoRefresh = useOpmStore((s) => s.toggleMapaAutoRefresh);
  const mapaPanelFiltrosAbierto = useOpmStore((s) => s.mapaPanelFiltrosAbierto);
  const mapaPanelEstadisticasAbierto = useOpmStore((s) => s.mapaPanelEstadisticasAbierto);
  const toggleMapaPanelFiltros = useOpmStore((s) => s.toggleMapaPanelFiltros);
  const toggleMapaPanelEstadisticas = useOpmStore((s) => s.toggleMapaPanelEstadisticas);
  const mapaProfundidadMaxima = useOpmStore((s) => s.mapaProfundidadMaxima);
  const mapaSubarbolRaizId = useOpmStore((s) => s.mapaSubarbolRaizId);
  const mapaCriterioResaltado = useOpmStore((s) => s.mapaCriterioResaltado);
  const fijarMapaProfundidad = useOpmStore((s) => s.fijarMapaProfundidad);
  const fijarMapaSubarbol = useOpmStore((s) => s.fijarMapaSubarbol);
  const fijarMapaCriterioResaltado = useOpmStore((s) => s.fijarMapaCriterioResaltado);
  const limpiarFiltrosMapa = useOpmStore((s) => s.limpiarFiltrosMapa);

  useEffect(() => {
    if (!hostRef.current) return;

    const graph = new dia.Graph({}, { cellNamespace: shapes });
    const paper = new dia.Paper({
      el: hostRef.current,
      model: graph,
      width: 1600,
      height: 1200,
      cellViewNamespace: shapes,
      async: false,
      frozen: false,
      gridSize: 10,
      background: { color: "#f5f7fb" },
      linkPinning: false,
      interactive: false,
    });

    paper.on("element:pointerdblclick", (elementView: dia.ElementView) => {
      const cell = (elementView as unknown as { model: dia.Cell }).model;
      const cellId = cell.id as string;
      if (cellId.startsWith("mapa-nodo-")) {
        saltarAOpdDesdeMapa(cellId.slice("mapa-nodo-".length));
      }
    });

    paper.on("cell:mouseenter", (cellView: dia.CellView, evt: dia.Event) => {
      const cell = (cellView as unknown as { model: dia.Cell }).model;
      const nodo = nodoDesdeCell(descriptor, cell.id as string);
      if (!nodo) return;
      if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current);
      const pos = posicionCliente(evt);
      hoverTimerRef.current = window.setTimeout(() => {
        setTooltip({ nodo, x: pos.x, y: pos.y });
      }, 500);
    });

    paper.on("cell:mouseleave", () => {
      if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
      setTooltip(null);
    });

    paper.on("blank:pointerdown", (evt: dia.Event) => {
      const pos = posicionCliente(evt);
      panRef.current = { clientX: pos.x, clientY: pos.y, panX: mapaPanX, panY: mapaPanY };
    });

    graphRef.current = graph;
    paperRef.current = paper;

    return () => {
      if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current);
      graph.clear();
      hostRef.current?.replaceChildren();
    };
    // Se instala una sola vez; los handlers leen el descriptor vigente en el efecto de celdas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const graph = graphRef.current;
    const paper = paperRef.current;
    if (!graph || !paper || !descriptor) return;

    paper.setDimensions(
      Math.max(1600, descriptor.bboxTotal.w + 160),
      Math.max(1200, descriptor.bboxTotal.h + 160),
    );
    graph.resetCells(proyectarMapaSistemaAJointCells(descriptor) as unknown as dia.Cell.JSON[]);

    queueMicrotask(() => {
      if (mapaZoom === 1 && mapaPanX === 0 && mapaPanY === 0) {
        paper.scaleContentToFit({ padding: 40, minScale: 0.25, maxScale: 2 });
        return;
      }
      paper.scale(mapaZoom, mapaZoom);
      paper.translate(mapaPanX, mapaPanY);
    });
  }, [descriptor, mapaPanX, mapaPanY, mapaZoom]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      fijarMapaZoom(mapaZoom + (event.deltaY < 0 ? 0.05 : -0.05));
    };
    host.addEventListener("wheel", onWheel, { passive: false });
    return () => host.removeEventListener("wheel", onWheel);
  }, [fijarMapaZoom, mapaZoom]);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      const pan = panRef.current;
      if (!pan) return;
      fijarMapaPan(pan.panX + event.clientX - pan.clientX, pan.panY + event.clientY - pan.clientY);
    };
    const onUp = () => {
      panRef.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [fijarMapaPan]);

  useEffect(() => {
    const handler = (event: Event) => {
      const formato = (event as CustomEvent<{ formato: FormatoExport }>).detail?.formato;
      if (formato === "png" || formato === "svg") void exportar(formato);
    };
    window.addEventListener("deep-opm-pro:exportar-mapa", handler);
    return () => window.removeEventListener("deep-opm-pro:exportar-mapa", handler);
  });

  const exportar = async (formato: FormatoExport) => {
    const paper = paperRef.current;
    if (!paper) return;
    await descargarMapa(paper, modelo, { formato, fondo: "blanco" });
  };

  if (!descriptorBase) {
    return (
      <div style={style.container}>
        <p style={style.empty}>Sin datos para mostrar el mapa.</p>
      </div>
    );
  }

  const profundidadMaxima = estadisticas.profundidadMaxima || 1;

  return (
    <div style={style.container} data-testid="mapa-sistema">
      <div style={style.toolbar}>
        <span style={style.toolbarTitle}>Mapa del sistema</span>
        <div style={style.toolbarActions}>
          <span style={style.stats}>
            {descriptor.nodos.length} OPDs · {descriptor.aristas.length} relaciones
          </span>
          <span style={style.zoom} data-testid="mapa-zoom">{Math.round(mapaZoom * 100)}%</span>
          <button type="button" style={style.btn} onClick={toggleMapaPanelFiltros}>Filtros</button>
          <button type="button" style={style.btn} onClick={toggleMapaPanelEstadisticas}>Estadísticas</button>
          <button type="button" style={style.btn} onClick={refrescarVistaMapa}>Refrescar mapa</button>
          <button
            type="button"
            style={mapaAutoRefresh ? style.activeBtn : style.btn}
            onClick={toggleMapaAutoRefresh}
            aria-pressed={mapaAutoRefresh}
          >
            Auto-refresh
          </button>
          <button type="button" style={style.btn} onClick={() => void exportar("png")}>PNG</button>
          <button type="button" style={style.btn} onClick={() => void exportar("svg")}>SVG</button>
          <button type="button" style={style.btn} onClick={cerrarVistaMapa} title="Cerrar mapa del sistema">
            Cerrar mapa
          </button>
        </div>
      </div>
      <div style={style.body}>
        {mapaPanelFiltrosAbierto ? (
          <MapaFiltros
            descriptor={descriptorBase}
            profundidadMaxima={profundidadMaxima}
            profundidad={mapaProfundidadMaxima}
            subarbolRaizId={mapaSubarbolRaizId}
            criterio={mapaCriterioResaltado}
            onProfundidad={fijarMapaProfundidad}
            onSubarbol={fijarMapaSubarbol}
            onCriterio={fijarMapaCriterioResaltado}
            onLimpiar={limpiarFiltrosMapa}
            onCerrar={toggleMapaPanelFiltros}
          />
        ) : null}
        <div style={style.paperWrap}>
          <div ref={hostRef} style={style.paper} />
          {tooltip ? (
            <div style={{ ...style.tooltip, left: tooltip.x + 12, top: tooltip.y + 12 }} role="tooltip">
              <strong>{tooltip.nodo.nombre}</strong>
              <span>{tooltip.nodo.tipoRefinamiento}</span>
              <span>{tooltip.nodo.thumbnailEntidades} entidades · {tooltip.nodo.thumbnailEnlaces} enlaces</span>
              <span>Profundidad {tooltip.nodo.profundidad}</span>
            </div>
          ) : null}
        </div>
        {mapaPanelEstadisticasAbierto ? (
          <MapaPanelEstadisticas
            estadisticas={estadisticas}
            onCerrar={toggleMapaPanelEstadisticas}
          />
        ) : null}
      </div>
    </div>
  );
}

function nodoDesdeCell(descriptor: { nodos: NodoMapa[] } | null, cellId: string): NodoMapa | null {
  if (!cellId.startsWith("mapa-nodo-")) return null;
  const opdId = cellId.slice("mapa-nodo-".length);
  return descriptor?.nodos.find((nodo) => nodo.opdId === opdId) ?? null;
}

function posicionCliente(evt: dia.Event): { x: number; y: number } {
  const source = evt as unknown as MouseEvent;
  return { x: source.clientX ?? 0, y: source.clientY ?? 0 };
}

const style = {
  container: {
    width: "100%",
    height: "100%",
    display: "grid",
    gridTemplateRows: "44px minmax(0, 1fr)",
    background: "#f5f7fb",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 12px",
    borderBottom: "1px solid #d9e0ea",
    background: "#ffffff",
    minWidth: 0,
  },
  toolbarTitle: {
    color: "#1f2937",
    fontSize: "13px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  toolbarActions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    overflowX: "auto",
    minWidth: 0,
  },
  stats: {
    color: "#667085",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },
  zoom: {
    minWidth: "44px",
    color: "#1f2937",
    fontSize: "12px",
    fontWeight: 700,
    textAlign: "right",
  },
  btn: {
    height: "28px",
    padding: "0 10px",
    borderRadius: "4px",
    border: "1px solid #c8d2df",
    background: "#ffffff",
    color: "#1f2937",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  activeBtn: {
    height: "28px",
    padding: "0 10px",
    borderRadius: "4px",
    border: "1px solid #70E483",
    background: "#ebfff0",
    color: "#1f2937",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  body: {
    minHeight: 0,
    minWidth: 0,
    display: "flex",
  },
  paperWrap: {
    position: "relative",
    minWidth: 0,
    minHeight: 0,
    flex: "1 1 auto",
    overflow: "hidden",
  },
  paper: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    cursor: "grab",
  },
  tooltip: {
    position: "fixed",
    zIndex: 1000,
    display: "grid",
    gap: "3px",
    maxWidth: "260px",
    padding: "8px 10px",
    border: "1px solid #c8d2df",
    borderRadius: "4px",
    background: "#ffffff",
    boxShadow: "0 10px 24px rgba(16, 24, 40, 0.16)",
    color: "#1f2937",
    fontSize: "12px",
    pointerEvents: "none",
  },
  empty: {
    padding: "20px",
    color: "#667085",
    fontSize: "13px",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
