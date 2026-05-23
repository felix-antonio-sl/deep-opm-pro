// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useState } from "preact/hooks";
import { useTimelineViewModel, type TimelineRow } from "../app/viewmodels/timelineViewModel";
import type { Apariencia, Id } from "../modelo/tipos";
import { tokens } from "./tokens";

type DropMode = "before" | "parallel" | "after";

interface GrupoY {
  y: number;
  rows: TimelineRow[];
}

const ROW_Y_STEP = 90;
const NUDGE_Y = 10;

export function Timeline() {
  const { contexto, seleccionId, seleccionarEntidad, reordenarSubprocesoEnTimeline } = useTimelineViewModel();
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
                {/* Ronda 28 L6 (Bauhaus): handle `::` → punto Bauhaus.
                    ● ink en eventos no paralelos (canon brief: timeline punto).
                    ○ ink-30 en filas paralelas (pendiente colapsado). */}
                <span aria-hidden="true" style={parallel ? style.handlePending : style.handle}>
                  {parallel ? "○" : "●"}
                </span>
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
    background: tokens.colors.fondoChrome,
    borderTop: `1px solid ${tokens.colors.bordeIntermedio}`,
    display: "grid",
    gridTemplateRows: "42px minmax(0, 1fr)",
    fontFamily: tokens.typography.familyChrome,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    padding: "0 12px",
    borderBottom: `1px solid ${tokens.colors.bordeChrome}`,
    color: tokens.colors.textoPrimario,
    fontSize: "13px",
    fontWeight: 700,
  },
  count: {
    minWidth: "22px",
    height: "18px",
    borderRadius: "9px",
    background: tokens.colors.infoFondo,
    color: tokens.colors.infoBorde,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 700,
  },
  list: {
    overflow: "auto",
    // Ronda 28 L6 (Bauhaus): línea vertical 1px ink-15 corriendo por la
    // columna del handle (puntos timeline). 8px padding-left = 4 (handle
    // width/2) + offset; la línea se dibuja vía linear-gradient para no
    // requerir pseudo-elementos en estilos inline.
    padding: "8px",
    display: "grid",
    alignContent: "start",
    gap: "6px",
    backgroundImage: `linear-gradient(${tokens.colors.ink15}, ${tokens.colors.ink15})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "16px 8px",
    backgroundSize: "1px calc(100% - 16px)",
  },
  empty: {
    padding: "8px 4px",
    color: tokens.colors.textoTerciario,
    fontSize: "12px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "18px minmax(0, 1fr) auto auto",
    alignItems: "center",
    gap: "8px",
    minHeight: "44px",
    padding: "6px 8px",
    border: `1px solid ${tokens.colors.mapaBorde}`,
    borderLeft: `3px solid ${tokens.colors.canvas.proceso}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.canvas.fill,
    color: tokens.colors.textoPrimario,
    cursor: "grab",
    userSelect: "none",
    fontSize: "12px",
    fontWeight: 600,
    outline: "none",
  },
  rowActive: {
    borderColor: tokens.colors.timelineActivo,
    boxShadow: `0 0 0 2px ${tokens.colors.infoFondo} inset`,
  },
  rowParallel: {
    borderLeftColor: tokens.colors.chromeNeutral,
    background: tokens.colors.timelineFondo,
  },
  rowDragging: {
    opacity: 0.55,
    cursor: "grabbing",
  },
  hintBefore: {
    borderTopColor: tokens.colors.canvas.proceso,
    borderTopWidth: "3px",
  },
  hintParallel: {
    background: tokens.colors.infoFondo,
    borderColor: tokens.colors.canvas.proceso,
  },
  hintAfter: {
    borderBottomColor: tokens.colors.canvas.proceso,
    borderBottomWidth: "3px",
  },
  // Ronda 28 L6 (Bauhaus): handle como punto Unicode geométrico ink (lleno)
  // o ink-30 (vacío) según parallel. JetBrains Mono fontFamily para anclaje
  // monolítico — los puntos timeline son glifos icónicos del brief L6.
  handle: {
    color: tokens.colors.ink,
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: 1,
    textAlign: "center",
    background: tokens.colors.paper,
  },
  handlePending: {
    color: tokens.colors.ink30,
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: 1,
    textAlign: "center",
    background: tokens.colors.paper,
  },
  main: {
    minWidth: 0,
    display: "grid",
    gap: "2px",
  },
  name: {
    minWidth: 0,
    // Brief L6: Inter Tight 12 ink.
    color: tokens.colors.ink,
    fontFamily: tokens.typography.fontFamily,
    fontSize: "12px",
    overflowWrap: "anywhere",
    lineHeight: 1.2,
  },
  meta: {
    // Brief L6: JetBrains Mono 11 ink-70 para timestamps/coordenadas.
    color: tokens.colors.ink70,
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: "11px",
    fontWeight: 500,
  },
  parallel: {
    minWidth: "56px",
    height: "20px",
    borderRadius: tokens.radii.xl,
    background: tokens.colors.timelineFondoSuave,
    color: tokens.colors.chromeNeutral,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 700,
  },
  breakButton: {
    minHeight: "26px",
    padding: "0 8px",
    border: `1px solid ${tokens.colors.timelineBorde}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoChrome,
    color: tokens.colors.textoSecundario,
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 700,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
