import { useState } from "preact/hooks";
import type { Apariencia, Entidad, Id, Modelo, Opd } from "../modelo/tipos";
import { useOpmStore } from "../store";

type DropMode = "before" | "parallel" | "after";

interface TimelineContext {
  opd: Opd;
  contorno: Apariencia;
  rows: TimelineRow[];
}

interface TimelineRow {
  apariencia: Apariencia;
  entidad: Entidad;
  parallelSize: number;
}

interface GrupoY {
  y: number;
  rows: TimelineRow[];
}

const ROW_Y_STEP = 90;
const NUDGE_Y = 10;

export function Timeline() {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const seleccionarEntidad = useOpmStore((s) => s.seleccionarEntidad);
  const reordenarSubprocesoEnTimeline = useOpmStore((s) => s.reordenarSubprocesoEnTimeline);
  const contexto = contextoTimeline(modelo, opdActivoId);
  const [draggedId, setDraggedId] = useState<Id | null>(null);
  const [dropHint, setDropHint] = useState<{ targetId: Id; mode: DropMode } | null>(null);

  if (!contexto) return null;

  const soltarSobre = (targetId: Id, mode: DropMode) => {
    if (!draggedId || draggedId === targetId) return;
    const nuevaY = calcularNuevaY(contexto.rows, draggedId, targetId, mode);
    if (nuevaY === null) return;
    reordenarSubprocesoEnTimeline(contexto.opd.id, draggedId, nuevaY);
  };

  const romperParalelismo = (row: TimelineRow) => {
    const nuevaY = siguienteYLibre(row, contexto.rows, contexto.contorno);
    reordenarSubprocesoEnTimeline(contexto.opd.id, row.apariencia.id, nuevaY);
  };

  return (
    <aside data-testid="timeline-pane" aria-label="Timeline de subprocesos" style={style.panel}>
      <div style={style.header}>
        <span>Timeline</span>
        <span style={style.count}>{contexto.rows.length}</span>
      </div>
      <div role="list" style={style.list}>
        {contexto.rows.length === 0 ? (
          <div style={style.empty}>Sin subprocesos.</div>
        ) : (
          contexto.rows.map((row) => {
            const active = row.entidad.id === seleccionId;
            const hint = dropHint?.targetId === row.apariencia.id ? dropHint.mode : null;
            const parallel = row.parallelSize > 1;
            return (
              <div
                key={row.apariencia.id}
                role="listitem"
                tabIndex={0}
                draggable
                data-timeline-row={row.apariencia.id}
                aria-label={`${row.entidad.nombre}, Y ${row.apariencia.y}`}
                style={estiloFila(active, parallel, draggedId === row.apariencia.id, hint)}
                onClick={() => seleccionarEntidad(row.entidad.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    seleccionarEntidad(row.entidad.id);
                  }
                }}
                onDragStart={(event) => {
                  event.dataTransfer?.setData("text/plain", row.apariencia.id);
                  if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
                  setDraggedId(row.apariencia.id);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  const mode = modoDrop(event.clientY, event.currentTarget.getBoundingClientRect());
                  setDropHint({ targetId: row.apariencia.id, mode });
                  if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  const mode = modoDrop(event.clientY, event.currentTarget.getBoundingClientRect());
                  soltarSobre(row.apariencia.id, mode);
                  setDropHint(null);
                  setDraggedId(null);
                }}
                onDragEnd={() => {
                  setDropHint(null);
                  setDraggedId(null);
                }}
              >
                <span aria-hidden="true" style={style.handle}>::</span>
                <span style={style.main}>
                  <span style={style.name}>{row.entidad.nombre}</span>
                  <span style={style.meta}>Y {row.apariencia.y}</span>
                </span>
                {parallel ? <span style={style.parallel}>Paralelo</span> : null}
                {parallel ? (
                  <button
                    type="button"
                    style={style.breakButton}
                    onClick={(event) => {
                      event.stopPropagation();
                      romperParalelismo(row);
                    }}
                    onDragStart={(event) => event.preventDefault()}
                  >
                    Romper
                  </button>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

function contextoTimeline(modelo: Modelo, opdId: Id): TimelineContext | null {
  const opd = modelo.opds[opdId];
  if (!opd?.padreId) return null;
  const padre = modelo.opds[opd.padreId];
  if (!padre) return null;
  const refinador = Object.values(modelo.entidades).find(
    (entidad) => entidad.tipo === "proceso" && entidad.refinamiento?.tipo === "descomposicion" && entidad.refinamiento.opdId === opd.id,
  );
  if (!refinador) return null;
  if (!Object.values(padre.apariencias).some((apariencia) => apariencia.entidadId === refinador.id)) return null;
  const contorno = Object.values(opd.apariencias).find((apariencia) => apariencia.entidadId === refinador.id);
  if (!contorno) return null;

  const baseRows = Object.values(opd.apariencias)
    .flatMap((apariencia) => {
      if (apariencia.entidadId === refinador.id || !dentroDe(apariencia, contorno)) return [];
      const entidad = modelo.entidades[apariencia.entidadId];
      return entidad?.tipo === "proceso" ? [{ apariencia, entidad }] : [];
    })
    .sort((a, b) => a.apariencia.y - b.apariencia.y || a.apariencia.x - b.apariencia.x || a.apariencia.id.localeCompare(b.apariencia.id));

  const counts = new Map<number, number>();
  for (const row of baseRows) counts.set(row.apariencia.y, (counts.get(row.apariencia.y) ?? 0) + 1);

  return {
    opd,
    contorno,
    rows: baseRows.map((row) => ({
      ...row,
      parallelSize: counts.get(row.apariencia.y) ?? 1,
    })),
  };
}

function calcularNuevaY(rows: TimelineRow[], draggedId: Id, targetId: Id, mode: DropMode): number | null {
  const target = rows.find((row) => row.apariencia.id === targetId);
  if (!target) return null;
  if (mode === "parallel") return target.apariencia.y;
  const grupos = agruparPorY(rows.filter((row) => row.apariencia.id !== draggedId));
  const targetIndex = grupos.findIndex((grupo) => grupo.y === target.apariencia.y);
  if (targetIndex < 0) return target.apariencia.y;
  return mode === "before" ? yAntesDe(grupos, targetIndex) : yDespuesDe(grupos, targetIndex);
}

function agruparPorY(rows: TimelineRow[]): GrupoY[] {
  const grupos: GrupoY[] = [];
  for (const row of rows) {
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.y === row.apariencia.y) {
      ultimo.rows.push(row);
    } else {
      grupos.push({ y: row.apariencia.y, rows: [row] });
    }
  }
  return grupos;
}

function yAntesDe(grupos: GrupoY[], index: number): number {
  const target = grupos[index];
  if (!target) return 0;
  const previo = grupos[index - 1];
  if (!previo) return target.y - ROW_Y_STEP;
  if (target.y - previo.y <= 1) return target.y - NUDGE_Y;
  return Math.floor((previo.y + target.y) / 2);
}

function yDespuesDe(grupos: GrupoY[], index: number): number {
  const target = grupos[index];
  if (!target) return 0;
  const siguiente = grupos[index + 1];
  if (!siguiente) return target.y + ROW_Y_STEP;
  if (siguiente.y - target.y <= 1) return target.y + NUDGE_Y;
  return Math.floor((target.y + siguiente.y) / 2);
}

function siguienteYLibre(row: TimelineRow, rows: TimelineRow[], contorno: Apariencia): number {
  const usadas = new Set(rows.filter((item) => item.apariencia.id !== row.apariencia.id).map((item) => item.apariencia.y));
  const min = contorno.y;
  const max = contorno.y + contorno.height - row.apariencia.height;
  for (let step = 1; step <= 40; step += 1) {
    for (const candidato of [row.apariencia.y + NUDGE_Y * step, row.apariencia.y - NUDGE_Y * step]) {
      if (candidato >= min && candidato <= max && !usadas.has(candidato)) return candidato;
    }
  }
  return limitar(row.apariencia.y + NUDGE_Y, min, max);
}

function modoDrop(clientY: number, rect: DOMRect): DropMode {
  const ratio = rect.height > 0 ? (clientY - rect.top) / rect.height : 0.5;
  if (ratio < 0.34) return "before";
  if (ratio > 0.66) return "after";
  return "parallel";
}

function dentroDe(apariencia: Apariencia, contorno: Apariencia): boolean {
  return (
    apariencia.x >= contorno.x &&
    apariencia.y >= contorno.y &&
    apariencia.x + apariencia.width <= contorno.x + contorno.width &&
    apariencia.y + apariencia.height <= contorno.y + contorno.height
  );
}

function limitar(valor: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, valor));
}

function estiloFila(active: boolean, parallel: boolean, dragging: boolean, hint: DropMode | null): preact.JSX.CSSProperties {
  return {
    ...style.row,
    ...(active ? style.rowActive : {}),
    ...(parallel ? style.rowParallel : {}),
    ...(dragging ? style.rowDragging : {}),
    ...(hint === "before" ? style.hintBefore : {}),
    ...(hint === "parallel" ? style.hintParallel : {}),
    ...(hint === "after" ? style.hintAfter : {}),
  };
}

const style = {
  panel: {
    minHeight: "220px",
    maxHeight: "42%",
    minWidth: 0,
    overflow: "hidden",
    background: "#ffffff",
    borderTop: "1px solid #d9e0ea",
    display: "grid",
    gridTemplateRows: "42px minmax(0, 1fr)",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    padding: "0 12px",
    borderBottom: "1px solid #e4eaf1",
    color: "#1f2937",
    fontSize: "13px",
    fontWeight: 700,
  },
  count: {
    minWidth: "22px",
    height: "18px",
    borderRadius: "9px",
    background: "#e8f7ff",
    color: "#147aa5",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 700,
  },
  list: {
    overflow: "auto",
    padding: "8px",
    display: "grid",
    alignContent: "start",
    gap: "6px",
  },
  empty: {
    padding: "8px 4px",
    color: "#667085",
    fontSize: "12px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "18px minmax(0, 1fr) auto auto",
    alignItems: "center",
    gap: "8px",
    minHeight: "44px",
    padding: "6px 8px",
    border: "1px solid #dbe5ef",
    borderLeft: "3px solid #3BC3FF",
    borderRadius: "4px",
    background: "#fdffff",
    color: "#1f2937",
    cursor: "grab",
    userSelect: "none",
    fontSize: "12px",
    fontWeight: 600,
    outline: "none",
  },
  rowActive: {
    borderColor: "#9fcbe0",
    boxShadow: "0 0 0 2px #e8f7ff inset",
  },
  rowParallel: {
    borderLeftColor: "#586D8C",
    background: "#f4fbff",
  },
  rowDragging: {
    opacity: 0.55,
    cursor: "grabbing",
  },
  hintBefore: {
    borderTopColor: "#3BC3FF",
    borderTopWidth: "3px",
  },
  hintParallel: {
    background: "#e8f7ff",
    borderColor: "#3BC3FF",
  },
  hintAfter: {
    borderBottomColor: "#3BC3FF",
    borderBottomWidth: "3px",
  },
  handle: {
    color: "#586D8C",
    fontWeight: 700,
    letterSpacing: 0,
    textAlign: "center",
  },
  main: {
    minWidth: 0,
    display: "grid",
    gap: "2px",
  },
  name: {
    minWidth: 0,
    color: "#1f2937",
    overflowWrap: "anywhere",
    lineHeight: 1.2,
  },
  meta: {
    color: "#667085",
    fontSize: "11px",
    fontWeight: 600,
  },
  parallel: {
    minWidth: "56px",
    height: "20px",
    borderRadius: "10px",
    background: "#eef2f7",
    color: "#586D8C",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 700,
  },
  breakButton: {
    minHeight: "26px",
    padding: "0 8px",
    border: "1px solid #d0d7e2",
    borderRadius: "4px",
    background: "#ffffff",
    color: "#475467",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 700,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
