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
    vistaMapaActiva,
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
    abrirVistaMapa,
    abrirGestionArbol,
    avisosArbol,
  } = useArbolOpdViewModel();
  const [colapsado, setColapsado] = useState<Set<Id>>(new Set());
  const [renombrando, setRenombrando] = useState<{ id: Id; valor: string } | null>(null);
  const [dragOverId, setDragOverId] = useState<Id | null>(null);
  const [colapsarTodo, setColapsarTodo] = useState(false);
  const [menuContextual, setMenuContextual] = useState<{ opdId: Id; x: number; y: number } | null>(null);
  const [opdCortadoId, setOpdCortadoId] = useState<Id | null>(null);
  const arboles = useMemo(() => construirArbol(modelo), [modelo]);
  const estaExpandidoNodo = (id: Id) => !colapsado.has(id);
  const nodosVisibles = aplanarNodosVisibles(arboles, estaExpandidoNodo).filter((n) => n.visible);
  const nodosFoco = nodosVisibles.map(({ nodo }) => nodo);
  const idsNodosFoco = nodosFoco.map((nodo) => nodo.opd.id).join("|");
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
      <div style={style.header}>
        <span>OPDs</span>
        <div style={style.headerActions}>
          <button type="button" style={style.modeBtn} title={modoOrdenArbol === "manual" ? "Orden manual: arrastra OPDs para reordenar" : "Orden automático (según canvas)"} onClick={() => fijarModoOrdenArbol(modoOrdenArbol === "manual" ? "automatico" : "manual")}>
            {modoOrdenArbol === "manual" ? "Manual" : "Auto"}
          </button>
          <button type="button" style={style.labelActionBtn} title={nombresArbolVisibles ? "Mostrar códigos" : "Mostrar nombres"} aria-label={nombresArbolVisibles ? "Mostrar códigos" : "Mostrar nombres"} aria-pressed={!nombresArbolVisibles} onClick={() => toggleNombresArbolVisibles()}>
            {nombresArbolVisibles ? "ID" : "Aa"}
          </button>
          {totalConHijos > 0 ? (
            <button type="button" style={style.smallActionBtn} title={colapsarTodo ? "Expandir todo" : "Colapsar todo"} onClick={colapsarTodo ? expandirTodo : colapsarTodoAccion}>
              {colapsarTodo ? "▸" : "▾"}
            </button>
          ) : null}
          <button type="button" style={style.moreActionBtn} title="Más opciones" aria-label="Más opciones" onClick={abrirGestionArbol}>
            ⋯
          </button>
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

function MapaSistemaItem(props: { activo: boolean; onAbrir: () => void }) {
  // Ronda 28 L6: SVG inline (papel doblado) → glifo Unicode ◆ (rombo Bauhaus).
  // Tabla canon L6: Mapa OPDs → ◆ lleno. Tipografía JetBrains Mono para
  // mantener anclaje monolítico de los glifos icónicos en chrome.
  return (
    <div role="treeitem" tabIndex={0} aria-level={1} data-opd-id="__mapa__" aria-label="Mapa del sistema" title="Mapa del sistema" style={{ ...style.nodeMapa, ...(props.activo ? style.nodeActive : {}) }} onClick={props.onAbrir} onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        props.onAbrir();
      }
    }}>
      <span aria-hidden="true" style={style.nodeMapaGlyph}>◆</span>
      <span style={style.nodeName}>Mapa del sistema</span>
    </div>
  );
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
//   - Items: ver `nodeMapa` aquí + `node`/`nodeActive` en arbol/NodoOpd.tsx.
const style = {
  panel: {
    minWidth: 0,
    overflow: "hidden",
    background: tokens.colors.paper,
    borderRight: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    display: "grid",
    gridTemplateRows: "46px minmax(0, 1fr)",
  },
  header: {
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr)",
    alignItems: "center",
    gap: tokens.spacing.sm,
    padding: `0 ${tokens.spacing.md}px`,
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    background: tokens.colors.paper,
    color: tokens.colors.ink70,
    fontFamily: tokens.typography.familyChrome,
    fontSize: tokens.typography.sizes.xs,
    fontWeight: tokens.typography.weights.medium,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
  },
  headerActions: { display: "flex" as const, alignItems: "center", justifyContent: "flex-end" as const, gap: 6, minWidth: 0, overflowX: "auto" as const },
  modeBtn: {
    minHeight: "24px",
    minWidth: "48px",
    padding: "2px 10px",
    borderRadius: tokens.radii.xs,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    background: tokens.colors.paper,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: tokens.typography.sizes.xxs,
    fontWeight: tokens.typography.weights.medium,
    color: tokens.colors.ink70,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    whiteSpace: "nowrap" as const,
    transition: tokens.transitions.fast,
  },
  labelActionBtn: {
    minHeight: "24px",
    minWidth: "32px",
    borderRadius: tokens.radii.xs,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    background: tokens.colors.paper,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: tokens.typography.sizes.xxs,
    fontWeight: tokens.typography.weights.medium,
    color: tokens.colors.ink70,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    display: "inline-flex" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "2px 8px",
    whiteSpace: "nowrap" as const,
    transition: tokens.transitions.fast,
  },
  moreActionBtn: {
    minHeight: "24px",
    minWidth: "30px",
    borderRadius: tokens.radii.xs,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    background: tokens.colors.paper,
    cursor: "pointer",
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: tokens.typography.sizes.xs,
    fontWeight: tokens.typography.weights.medium,
    color: tokens.colors.ink70,
    display: "inline-flex" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "2px 8px",
    whiteSpace: "nowrap" as const,
    transition: tokens.transitions.fast,
  },
  smallActionBtn: {
    width: "24px",
    height: "24px",
    borderRadius: tokens.radii.xs,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    background: tokens.colors.paper,
    cursor: "pointer",
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: tokens.typography.sizes.xs,
    color: tokens.colors.ink70,
    display: "inline-flex" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    transition: tokens.transitions.fast,
  },
  tree: { overflow: "auto" as const, padding: "10px 8px", background: tokens.colors.paper },
  empty: { padding: "8px 4px", color: tokens.colors.ink50, fontSize: tokens.typography.sizes.sm, fontStyle: "italic" as const },
  // Item "Mapa del sistema" — patrón consistente con árbol OPD: padding 6 16,
  // font 12, hover ink-04, activo barra lateral 2px cinabrio + ink-04.
  nodeMapa: {
    width: "100%",
    minHeight: "30px",
    display: "flex" as const,
    alignItems: "center",
    gap: tokens.spacing.sm,
    padding: `6px ${tokens.spacing.md}px`,
    border: 0,
    borderLeft: `${tokens.stroke.bold}px solid transparent`,
    borderRadius: 0,
    background: "transparent",
    color: tokens.colors.ink70,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.medium,
    textAlign: "left" as const,
    transition: tokens.transitions.fast,
  },
  // Activo: borde izquierdo 2px cinabrio + fondo ink-04. Sin shadow.
  nodeActive: {
    borderLeft: `${tokens.stroke.bold}px solid ${tokens.colors.accent}`,
    background: tokens.colors.ink04,
    color: tokens.colors.ink,
    fontWeight: tokens.typography.weights.semibold,
    boxShadow: "none",
  },
  nodeName: { overflow: "visible" as const, lineHeight: 1.2, overflowWrap: "anywhere" as const, whiteSpace: "normal" as const, fontSize: tokens.typography.sizes.sm },
  // Ronda 28 L6: glifo Bauhaus en JetBrains Mono para anclaje icónico
  // monolítico; tamaño 14px alineado al fontSize del label de nodo.
  nodeMapaGlyph: {
    flex: "0 0 auto",
    width: "14px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: "14px",
    lineHeight: 1,
    color: "currentColor",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
