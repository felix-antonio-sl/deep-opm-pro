// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useMemo, useState } from "preact/hooks";
import { useArbolOpdViewModel } from "../app/viewmodels/arbolOpdViewModel";
import { EVENTO_ABRIR_AVISO_DIAGNOSTICO } from "../app/ports/feedbackPort";
import { registrarAtajo } from "./atajosTeclado";
import { MenuContextualArbol } from "./MenuContextualArbol";
import { aplanarNodosVisibles, atajoPanelArbolDesdeEvento, manejarTeclaNodoArbol, siguienteFocoArbol } from "./arbol/handlersTeclado";
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
import { tokens } from "./tokens";

/**
 * Barrel publico del arbol OPD. Lee el store y compone NodoOpd con handlers
 * puros, preservando atajos centralizados y menu contextual existente.
 */
export function ArbolOpd() {
  const {
    modelo,
    opdActivoId,
    modoOrdenArbol,
    fijarModoOrdenArbol,
    cambiarOpdActivo,
    seleccionarEntidad,
    eliminarOpdDesdeArbol,
    moverHermano,
    moverOpdEnGestion,
    renombrarOpdDesdeArbol,
    nombresArbolVisibles,
    toggleNombresArbolVisibles,
    navegarOpdArriba,
    navegarOpdAbajo,
    navegarOpdIzquierda,
    navegarOpdDerecha,
    abrirGestionArbol,
    avisosArbol,
  } = useArbolOpdViewModel();
  const [colapsado, setColapsado] = useState<Set<Id>>(new Set());
  const [renombrando, setRenombrando] = useState<{ id: Id; valor: string } | null>(null);
  const [dragOverId, setDragOverId] = useState<Id | null>(null);
  const [menuContextual, setMenuContextual] = useState<{ opdId: Id; x: number; y: number } | null>(null);
  const [opdCortadoId, setOpdCortadoId] = useState<Id | null>(null);
  const arboles = useMemo(() => construirArbol(modelo), [modelo]);
  const estaExpandidoNodo = (id: Id) => !colapsado.has(id);
  const nodosVisibles = aplanarNodosVisibles(arboles, estaExpandidoNodo).filter((n) => n.visible);
  const nodosFoco = nodosVisibles.map(({ nodo }) => nodo);
  const idsNodosFoco = nodosFoco.map((nodo) => nodo.opd.id).join("|");

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
  };
  const colapsarTodoAccion = () => {
    setColapsado(idsColapsables(arboles));
  };

  useEffect(() => {
    const navegarFoco = (direccion: "up" | "down") => {
      const destino = siguienteFocoArbol(nodosFoco, opdActivoId, direccion);
      if (!destino) return;
      cambiarOpdActivo(destino);
      enfocarNodoArbol(destino);
    };
    const manejarAtajo = (event: KeyboardEvent) => {
      const atajo = atajoPanelArbolDesdeEvento(event);
      if (atajo === "foco-anterior") navegarFoco("up");
      if (atajo === "foco-siguiente") navegarFoco("down");
      if (atajo === "renombrar") {
        const opd = modelo.opds[opdActivoId];
        if (opd) setRenombrando({ id: opd.id, valor: opd.nombre });
      }
      if (atajo === "expandir-todo") expandirTodo();
      if (atajo === "colapsar-todo") colapsarTodoAccion();
      if (atajo === "abrir-gestion") abrirGestionArbol();
    };
    const offs = [
      registrarAtajo({ combo: "Ctrl+ArrowUp", ctx: "panel-arbol", categoria: "navegacion", descripcion: "Mover foco al OPD visible anterior", handler: manejarAtajo }),
      registrarAtajo({ combo: "Ctrl+ArrowDown", ctx: "panel-arbol", categoria: "navegacion", descripcion: "Mover foco al OPD visible siguiente", handler: manejarAtajo }),
      registrarAtajo({ combo: "F2", ctx: "panel-arbol", categoria: "edicion", descripcion: "Renombrar OPD seleccionado", handler: manejarAtajo }),
      registrarAtajo({ combo: "Ctrl+E", ctx: "panel-arbol", categoria: "vista", descripcion: "Expandir todo el árbol OPD", descripcionLarga: "Despliega todos los nodos del árbol de OPDs", handler: manejarAtajo }),
      registrarAtajo({ combo: "Ctrl+Shift+E", ctx: "panel-arbol", categoria: "vista", descripcion: "Colapsar todo el árbol OPD", descripcionLarga: "Pliega todos los nodos del árbol de OPDs a su raíz", handler: manejarAtajo }),
      registrarAtajo({ combo: "Ctrl+D", ctx: "panel-arbol", categoria: "navegacion", descripcion: "Abrir gestión del árbol OPD", handler: manejarAtajo }),
    ];
    return () => {
      for (const off of offs) off();
    };
  }, [abrirGestionArbol, arboles, cambiarOpdActivo, idsNodosFoco, modelo.opds, opdActivoId]);

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
  const navegarARefinador = (opdId: Id, refinadorId: Id) => {
    const opdPadreId = modelo.opds[opdId]?.padreId;
    const destino = opdPadreId && tieneAparienciaEntidad(modelo, opdPadreId, refinadorId)
      ? opdPadreId
      : Object.values(modelo.opds).find((opd) => tieneAparienciaEntidad(modelo, opd.id, refinadorId))?.id;
    if (destino) cambiarOpdActivo(destino);
    seleccionarEntidad(refinadorId);
  };
  const abrirAvisoDesdeArbol = (opdId: Id, codigo: string | null) => {
    cambiarOpdActivo(opdId);
    if (!codigo) return;
    queueMicrotask(() => {
      window.dispatchEvent(new CustomEvent(EVENTO_ABRIR_AVISO_DIAGNOSTICO, {
        detail: { reglaId: codigo },
      }));
    });
  };

  return (
    <aside style={style.panel} aria-label="Árbol OPD" data-atajos-contexto="panel-arbol" tabIndex={-1}>
      <div role="tree" aria-label="Árbol OPD" style={style.tree} data-atajos-contexto="panel-arbol">
        {nodosVisibles.length === 0 ? (
          <div style={style.empty}>Sin OPD</div>
        ) : (
          nodosVisibles.map(({ nodo }) => (
            <NodoOpd
              key={nodo.opd.id}
              nodo={nodo}
              modelo={modelo}
              avisos={avisosArbol}
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
              onNavegarRefinador={navegarARefinador}
              onIssueBadgeClick={abrirAvisoDesdeArbol}
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
          onBuscar={() => {
            abrirGestionArbol();
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

function enfocarNodoArbol(opdId: Id): void {
  queueMicrotask(() => {
    const nodo = Array.from(document.querySelectorAll<HTMLElement>("[data-opd-id]"))
      .find((item) => item.getAttribute("data-opd-id") === opdId);
    nodo?.focus({ preventScroll: true });
    nodo?.scrollIntoView({ block: "nearest" });
  });
}

function toggleId(prev: Set<Id>, id: Id): Set<Id> {
  const next = new Set(prev);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

function tieneAparienciaEntidad(modelo: { opds: Record<Id, { apariencias: Record<Id, { entidadId: Id }> }> }, opdId: Id, entidadId: Id): boolean {
  return Object.values(modelo.opds[opdId]?.apariencias ?? {}).some((apariencia) => apariencia.entidadId === entidadId);
}

// Ronda 28 L3: paleta Bauhaus aplicada al árbol OPD.
//   - panel: borde derecho 1px ink-15, fondo paper.
//   - header: borde inferior 1px ink-15, label uppercase tracking +0.08em.
//   - botones: outline 1px ink-15 paper, tracking uppercase mono cuando es
//     mode (Manual/Auto/ID/Aa) y glifo cuando es chevron/⋯.
//   - tree: padding 10 8, fondo paper.
//   - Items (Mapa del sistema): padding 6 16, font 12, hover ink-04, activo
//     barra lateral 2px cinabrio + ink-04.
const style = {
  panel: {
    minWidth: 0,
    overflow: "hidden",
    background: tokens.colors.paper,
    borderRight: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    display: "grid",
    gridTemplateRows: "minmax(0, 1fr)",
  },
  tree: { overflow: "auto" as const, padding: "10px 8px", background: tokens.colors.paper },
  empty: { padding: "8px 4px", color: tokens.colors.inkSoft, fontSize: tokens.typography.sizes.sm, fontStyle: "italic" as const },
} satisfies Record<string, preact.JSX.CSSProperties>;
