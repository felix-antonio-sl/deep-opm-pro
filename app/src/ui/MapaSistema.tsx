import { dia } from "jointjs";
import { useEffect, useRef } from "preact/hooks";
import { proyectarMapaSistemaAJointCells } from "../render/jointjs/mapaSistema";
import { useOpmStore } from "../store";

export function MapaSistema() {
  const paperRef = useRef<dia.Paper | null>(null);
  const graphRef = useRef<dia.Graph | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const descriptor = useOpmStore((s) => s.descriptorMapaCache);
  const saltarAOpdDesdeMapa = useOpmStore((s) => s.saltarAOpdDesdeMapa);
  const cerrarVistaMapa = useOpmStore((s) => s.cerrarVistaMapa);

  // Inicializar JointJS paper una sola vez
  useEffect(() => {
    if (!hostRef.current) return;

    const graph = new dia.Graph({}, { cellNamespace: {} });
    const paper = new dia.Paper({
      el: hostRef.current,
      model: graph,
      width: 1600,
      height: 1200,
      cellViewNamespace: {} as never,
      async: false,
      frozen: false,
      gridSize: 10,
      background: { color: "#f5f7fb" },
      linkPinning: false,
    });

    // Doble clic en thumbnail navega al OPD
    paper.on("element:pointerdblclick", (elementView: dia.ElementView) => {
      const cell = (elementView as unknown as { model: dia.Cell }).model;
      const cellId = cell.id as string;
      if (cellId.startsWith("mapa-nodo-")) {
        const opdId = cellId.slice("mapa-nodo-".length);
        saltarAOpdDesdeMapa(opdId);
      }
    });

    graphRef.current = graph;
    paperRef.current = paper;

    return () => {
      graph.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sincronizar celdas cuando el descriptor cambia
  useEffect(() => {
    const graph = graphRef.current;
    if (!graph || !descriptor) return;

    const celdasRaw = proyectarMapaSistemaAJointCells(descriptor);
    graph.resetCells(celdasRaw as unknown as dia.Cell.JSON[]);

    const paper = paperRef.current;
    if (paper) {
      paper.scaleContentToFit({ padding: 40, maxScale: 1 });
    }
  }, [descriptor]);

  if (!descriptor) {
    return (
      <div style={style.container}>
        <p style={style.empty}>Sin datos para mostrar el mapa.</p>
      </div>
    );
  }

  return (
    <div style={style.container} data-testid="mapa-sistema">
      <div style={style.toolbar}>
        <span style={style.toolbarTitle}>Mapa del sistema</span>
        <div style={style.toolbarActions}>
          <span style={style.stats}>
            {descriptor.nodos.length} OPDs · {descriptor.aristas.length} relaciones
          </span>
          <button
            type="button"
            style={style.btn}
            onClick={cerrarVistaMapa}
            title="Cerrar mapa del sistema"
          >
            Cerrar mapa
          </button>
        </div>
      </div>
      <div ref={hostRef} style={style.paper} />
    </div>
  );
}

const style = {
  container: {
    width: "100%",
    height: "100%",
    display: "grid",
    gridTemplateRows: "40px minmax(0, 1fr)",
    background: "#f5f7fb",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 12px",
    borderBottom: "1px solid #d9e0ea",
    background: "#ffffff",
  },
  toolbarTitle: {
    color: "#1f2937",
    fontSize: "13px",
    fontWeight: 700,
  },
  toolbarActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  stats: {
    color: "#667085",
    fontSize: "12px",
  },
  btn: {
    padding: "4px 10px",
    borderRadius: "4px",
    border: "1px solid #c8d2df",
    background: "#ffffff",
    color: "#1f2937",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
  },
  paper: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  empty: {
    padding: "20px",
    color: "#667085",
    fontSize: "13px",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
