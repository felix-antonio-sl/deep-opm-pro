import { useEffect, useState } from "preact/hooks";
import { useOpmStore } from "../store";
import { MenuContextualArbol } from "./MenuContextualArbol";
import { aplanarNodosVisibles, manejarTeclaNodoArbol } from "./arbol/handlersTeclado";
import { NodoOpd } from "./arbol/NodoOpd";
import {
  cantidadHijos,
  construirArbol,
  expandirTodoArbol,
  hijosOrdenados,
  idsColapsables,
  reordenarDesdeMenu,
} from "./arbol/togglesArbol";
import type { Id } from "../modelo/tipos";

/**
 * Barrel publico del arbol OPD. Lee el store y compone NodoOpd con handlers
 * puros, preservando atajos centralizados y menu contextual existente.
 */
export function ArbolOpd() {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);
  const modoOrdenArbol = useOpmStore((s) => s.modoOrdenArbol);
  const fijarModoOrdenArbol = useOpmStore((s) => s.fijarModoOrdenArbol);
  const cambiarOpdActivo = useOpmStore((s) => s.cambiarOpdActivo);
  const eliminarOpdDesdeArbol = useOpmStore((s) => s.eliminarOpdDesdeArbol);
  const moverHermano = useOpmStore((s) => s.moverHermano);
  const moverOpdEnGestion = useOpmStore((s) => s.moverOpdEnGestion);
  const renombrarOpdDesdeArbol = useOpmStore((s) => s.renombrarOpdDesdeArbol);
  const nombresArbolVisibles = useOpmStore((s) => s.nombresArbolVisibles);
  const toggleNombresArbolVisibles = useOpmStore((s) => s.toggleNombresArbolVisibles);
  const navegarOpdArriba = useOpmStore((s) => s.navegarOpdArriba);
  const navegarOpdAbajo = useOpmStore((s) => s.navegarOpdAbajo);
  const navegarOpdIzquierda = useOpmStore((s) => s.navegarOpdIzquierda);
  const navegarOpdDerecha = useOpmStore((s) => s.navegarOpdDerecha);
  const abrirVistaMapa = useOpmStore((s) => s.abrirVistaMapa);
  const [colapsado, setColapsado] = useState<Set<Id>>(new Set());
  const [renombrando, setRenombrando] = useState<{ id: Id; valor: string } | null>(null);
  const [dragOverId, setDragOverId] = useState<Id | null>(null);
  const [colapsarTodo, setColapsarTodo] = useState(false);
  const [menuContextual, setMenuContextual] = useState<{ opdId: Id; x: number; y: number } | null>(null);
  const [opdCortadoId, setOpdCortadoId] = useState<Id | null>(null);
  const arboles = construirArbol(modelo);
  const estaExpandidoNodo = (id: Id) => !colapsado.has(id);
  const nodosVisibles = aplanarNodosVisibles(arboles, estaExpandidoNodo).filter((n) => n.visible);
  const totalConHijos = idsColapsables(arboles).size;

  useEffect(() => {
    if (!menuContextual) return;
    const cerrar = () => setMenuContextual(null);
    const cerrarConEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") cerrar();
    };
    window.addEventListener("click", cerrar);
    window.addEventListener("keydown", cerrarConEscape);
    return () => {
      window.removeEventListener("click", cerrar);
      window.removeEventListener("keydown", cerrarConEscape);
    };
  }, [menuContextual]);

  const expandirTodo = () => {
    setColapsado(expandirTodoArbol());
    setColapsarTodo(false);
  };
  const colapsarTodoAccion = () => {
    setColapsado(idsColapsables(arboles));
    setColapsarTodo(true);
  };
  const renombrarSubmit = () => {
    if (renombrando && renombrando.valor.trim()) renombrarOpdDesdeArbol(renombrando.id, renombrando.valor.trim());
    setRenombrando(null);
  };
  const handleDragStart = (event: DragEvent, opdId: Id) => {
    if (modoOrdenArbol !== "manual") return;
    event.dataTransfer?.setData("text/plain", opdId);
    event.dataTransfer!.effectAllowed = "move";
  };
  const handleDrop = (event: DragEvent, targetPadreId: Id | null, targetOpdId: Id) => {
    event.preventDefault();
    setDragOverId(null);
    const draggedId = event.dataTransfer?.getData("text/plain");
    if (!draggedId || draggedId === targetOpdId) return;
    const targetOpds = Object.values(modelo.opds).filter((opd) => opd.padreId === targetPadreId);
    const idx = targetOpds.findIndex((opd) => opd.id === targetOpdId);
    if (idx >= 0) moverHermano(targetPadreId, draggedId, idx);
  };

  return (
    <aside style={style.panel} aria-label="Árbol OPD" data-atajos-contexto="panel-arbol" tabIndex={-1}>
      <div style={style.header}>
        <span>OPDs</span>
        <div style={style.headerActions}>
          <button type="button" style={style.modeBtn} title={modoOrdenArbol === "manual" ? "Orden manual: arrastra OPDs para reordenar" : "Orden automático (según canvas)"} onClick={() => fijarModoOrdenArbol(modoOrdenArbol === "manual" ? "automatico" : "manual")}>
            {modoOrdenArbol === "manual" ? "Ord: Manual" : "Ord: Auto"}
          </button>
          <button type="button" style={style.smallActionBtn} title={nombresArbolVisibles ? "Ocultar nombres OPD" : "Mostrar nombres OPD"} aria-label="Alternar etiquetas OPD" aria-pressed={!nombresArbolVisibles} onClick={() => toggleNombresArbolVisibles()}>
            {nombresArbolVisibles ? "Nom" : "Cod"}
          </button>
          {totalConHijos > 0 ? (
            <button type="button" style={style.smallActionBtn} title={colapsarTodo ? "Expandir todo" : "Colapsar todo"} onClick={colapsarTodo ? expandirTodo : colapsarTodoAccion}>
              {colapsarTodo ? "▸" : "▾"}
            </button>
          ) : null}
        </div>
      </div>
      <div role="tree" aria-label="Árbol OPD" style={style.tree} data-atajos-contexto="panel-arbol">
        <MapaSistemaItem activo={vistaMapaActiva} onAbrir={abrirVistaMapa} />
        {nodosVisibles.length === 0 ? (
          <div style={style.empty}>Sin OPD</div>
        ) : (
          nodosVisibles.map(({ nodo }) => (
            <NodoOpd
              key={nodo.opd.id}
              nodo={nodo}
              modelo={modelo}
              activo={nodo.opd.id === opdActivoId}
              nombresArbolVisibles={nombresArbolVisibles}
              estaExpandido={estaExpandidoNodo(nodo.opd.id)}
              renombrando={renombrando}
              dragOver={dragOverId === nodo.opd.id}
              modoOrdenManual={modoOrdenArbol === "manual"}
              onCambiarActivo={cambiarOpdActivo}
              onToggleExpandido={(id) => setColapsado((prev) => toggleId(prev, id))}
              onRenombrandoChange={setRenombrando}
              onRenombrarSubmit={renombrarSubmit}
              onEliminar={eliminarOpdDesdeArbol}
              onKeyDown={(event, opdId) => manejarTeclaNodoArbol(event, opdId, { cambiarOpdActivo, navegarOpdArriba, navegarOpdAbajo, navegarOpdIzquierda, navegarOpdDerecha })}
              onContextMenu={(event, opdId) => {
                event.preventDefault();
                event.stopPropagation();
                setMenuContextual({ opdId, x: event.clientX, y: event.clientY });
              }}
              onDragStart={handleDragStart}
              onDragOver={(event, opdId) => {
                event.preventDefault();
                setDragOverId(opdId);
              }}
              onDragLeave={() => setDragOverId(null)}
              onDrop={handleDrop}
            />
          ))
        )}
      </div>
      {menuContextual ? (
        <MenuContextualArbol
          modelo={modelo}
          opdId={menuContextual.opdId}
          posicion={{ x: menuContextual.x, y: menuContextual.y }}
          nombresVisibles={nombresArbolVisibles}
          opdCortadoId={opdCortadoId}
          onCerrar={() => setMenuContextual(null)}
          onRenombrar={(opdId) => {
            const opd = modelo.opds[opdId];
            if (opd) setRenombrando({ id: opdId, valor: opd.nombre });
            setMenuContextual(null);
          }}
          onEliminar={(opdId) => {
            eliminarOpdDesdeArbol(opdId);
            setMenuContextual(null);
          }}
          onCortar={(opdId) => {
            setOpdCortadoId(opdId);
            setMenuContextual(null);
          }}
          onPegar={(targetId) => {
            if (!opdCortadoId) return;
            moverOpdEnGestion(opdCortadoId, targetId, cantidadHijos(modelo, targetId));
            setOpdCortadoId(null);
            setMenuContextual(null);
          }}
          onReordenar={(opdId, direccion) => {
            reordenarDesdeMenu(modelo, opdId, direccion, moverHermano);
            setMenuContextual(null);
          }}
          onOrdenAutomatico={() => {
            fijarModoOrdenArbol("automatico");
            setMenuContextual(null);
          }}
          onToggleNombres={() => {
            toggleNombresArbolVisibles();
            setMenuContextual(null);
          }}
          onExpandirTodo={() => {
            expandirTodo();
            setMenuContextual(null);
          }}
          onColapsarTodo={() => {
            colapsarTodoAccion();
            setMenuContextual(null);
          }}
          onIrPadre={(opdId) => {
            const padreId = modelo.opds[opdId]?.padreId;
            if (padreId) cambiarOpdActivo(padreId);
            setMenuContextual(null);
          }}
          onIrPrimerHijo={(opdId) => {
            const primero = hijosOrdenados(modelo, opdId)[0];
            if (primero) cambiarOpdActivo(primero.id);
            setMenuContextual(null);
          }}
        />
      ) : null}
    </aside>
  );
}

function MapaSistemaItem(props: { activo: boolean; onAbrir: () => void }) {
  return (
    <div role="treeitem" tabIndex={0} aria-level={1} data-opd-id="__mapa__" title="Mapa del sistema" style={{ ...style.nodeMapa, ...(props.activo ? style.nodeActive : {}) }} onClick={props.onAbrir} onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        props.onAbrir();
      }
    }}>
      <span style={style.nodeName}>🗺 Mapa del sistema</span>
    </div>
  );
}

function toggleId(prev: Set<Id>, id: Id): Set<Id> {
  const next = new Set(prev);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

const style = {
  panel: {
    minWidth: 0,
    overflow: "hidden",
    background: "#ffffff",
    borderRight: "1px solid #d9e0ea",
    display: "grid",
    gridTemplateRows: "42px minmax(0, 1fr)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 8px",
    borderBottom: "1px solid #e4eaf1",
    color: "#1f2937",
    fontSize: "13px",
    fontWeight: 700,
  },
  headerActions: { display: "flex", alignItems: "center", gap: "4px" },
  modeBtn: {
    padding: "2px 6px",
    borderRadius: "4px",
    border: "1px solid #c8d2df",
    background: "#ffffff",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: 600,
    color: "#475467",
  },
  smallActionBtn: {
    width: "22px",
    height: "22px",
    borderRadius: "4px",
    border: "1px solid #c8d2df",
    background: "#ffffff",
    cursor: "pointer",
    fontSize: "10px",
    color: "#475467",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },
  tree: { overflow: "auto", padding: "8px" },
  empty: { padding: "8px 4px", color: "#667085", fontSize: "12px" },
  nodeMapa: {
    width: "100%",
    minHeight: "34px",
    display: "grid",
    gridTemplateColumns: "16px minmax(0, 1fr) auto auto",
    alignItems: "center",
    gap: "4px",
    paddingTop: "4px",
    paddingBottom: "4px",
    paddingLeft: "12px",
    border: "1px solid transparent",
    borderRadius: "4px",
    background: "transparent",
    color: "#475467",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    textAlign: "left",
  },
  nodeActive: { border: "1px solid #b9d2df", background: "#e8f7ff", color: "#1f2937", fontWeight: 700 },
  nodeName: { overflow: "visible", lineHeight: 1.2, overflowWrap: "anywhere", whiteSpace: "normal", fontSize: "13px" },
} satisfies Record<string, preact.JSX.CSSProperties>;
