import { useEffect, useState } from "preact/hooks";
import { useOpmStore } from "../store";
import type { Id, Modelo, Opd } from "../modelo/tipos";
import { MenuContextualArbol } from "./MenuContextualArbol";

const deleteIconUrl = new URL("../../../assets/svg/delete.svg", import.meta.url).href;

interface NodoOpd {
  opd: Opd;
  nivel: number;
  hijos: NodoOpd[];
}

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

  // Se almacena el set INVERSO: ids explicitamente colapsados por el usuario.
  // Por defecto todos los nodos con hijos arrancan expandidos para evitar
  // ocultar OPDs recien creados. El usuario puede colapsar manualmente.
  const [colapsado, setColapsado] = useState<Set<Id>>(new Set());
  const [renombrando, setRenombrando] = useState<{ id: Id; valor: string } | null>(null);
  const [dragOverId, setDragOverId] = useState<Id | null>(null);
  const [colapsarTodo, setColapsarTodo] = useState(false);
  const [menuContextual, setMenuContextual] = useState<{ opdId: Id; x: number; y: number } | null>(null);
  const [opdCortadoId, setOpdCortadoId] = useState<Id | null>(null);

  const arboles = construirArbol(modelo);

  const estaExpandidoNodo = (id: Id) => !colapsado.has(id);

  const toggleExpandido = (id: Id) => {
    setColapsado((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandirTodo = () => {
    setColapsado(new Set());
    setColapsarTodo(false);
  };

  const colapsarTodoAccion = () => {
    const idsConHijos = new Set<Id>();
    const recopilar = (nodos: NodoOpd[]) => {
      for (const n of nodos) {
        if (n.hijos.length > 0) idsConHijos.add(n.opd.id);
        recopilar(n.hijos);
      }
    };
    recopilar(arboles);
    setColapsado(idsConHijos);
    setColapsarTodo(true);
  };

  const handleDragStart = (e: DragEvent, opdId: Id) => {
    if (modoOrdenArbol !== "manual") return;
    e.dataTransfer?.setData("text/plain", opdId);
    e.dataTransfer!.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent, opdId: Id) => {
    e.preventDefault();
    setDragOverId(opdId);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: DragEvent, targetPadreId: Id | null, targetOpdId: Id) => {
    e.preventDefault();
    setDragOverId(null);
    const draggedId = e.dataTransfer?.getData("text/plain");
    if (!draggedId || draggedId === targetOpdId) return;

    // Calcular posición: insertar antes del target
    const targetOpds = Object.values(modelo.opds).filter(
      (o) => o.padreId === targetPadreId,
    );
    const idx = targetOpds.findIndex((o) => o.id === targetOpdId);
    if (idx >= 0) {
      moverHermano(targetPadreId, draggedId, idx);
    }
  };

  const renombrarSubmit = () => {
    if (renombrando && renombrando.valor.trim()) {
      renombrarOpdDesdeArbol(renombrando.id, renombrando.valor.trim());
    }
    setRenombrando(null);
  };

  const aplanarNodos = (nodos: NodoOpd[], nivelPadre: number, padreExpandido: boolean): Array<{ nodo: NodoOpd; visible: boolean }> => {
    return nodos.flatMap((n) => {
      const hijosVisibles = n.hijos.length > 0 && estaExpandidoNodo(n.opd.id);
      return [
        { nodo: n, visible: true },
        ...(hijosVisibles
          ? aplanarNodos(n.hijos, nivelPadre + 1, true)
          : n.hijos.length > 0
            ? n.hijos.map((h) => ({ nodo: h, visible: false }))
            : []),
      ];
    });
  };

  const nodosVisibles = aplanarNodos(arboles, 0, true).filter((n) => n.visible);

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

  // Contar total de nodos con hijos para el botón expandir
  const totalConHijos = (() => {
    let count = 0;
    const contar = (nodos: NodoOpd[]) => {
      for (const n of nodos) {
        if (n.hijos.length > 0) count++;
        contar(n.hijos);
      }
    };
    contar(arboles);
    return count;
  })();

  return (
    <aside
      style={style.panel}
      aria-label="Árbol OPD"
      data-atajos-contexto="panel-arbol"
      tabIndex={-1}
    >
      <div style={style.header}>
        <span>OPDs</span>
        <div style={style.headerActions}>
          <button
            type="button"
            style={style.modeBtn}
            title={
              modoOrdenArbol === "manual"
                ? "Orden manual: arrastra OPDs para reordenar"
                : "Orden automático (según canvas)"
            }
            onClick={() =>
              fijarModoOrdenArbol(
                modoOrdenArbol === "manual" ? "automatico" : "manual",
              )
            }
          >
            {modoOrdenArbol === "manual" ? "Ord: Manual" : "Ord: Auto"}
          </button>
          <button
            type="button"
            style={style.smallActionBtn}
            title={nombresArbolVisibles ? "Ocultar nombres OPD" : "Mostrar nombres OPD"}
            aria-label="Alternar etiquetas OPD"
            aria-pressed={!nombresArbolVisibles}
            onClick={() => toggleNombresArbolVisibles()}
          >
            {nombresArbolVisibles ? "Nom" : "Cod"}
          </button>
          {totalConHijos > 0 && (
            <button
              type="button"
              style={style.smallActionBtn}
              title={colapsarTodo ? "Expandir todo" : "Colapsar todo"}
              onClick={colapsarTodo ? expandirTodo : colapsarTodoAccion}
            >
              {colapsarTodo ? "▸" : "▾"}
            </button>
          )}
        </div>
      </div>
      <div
        role="tree"
        aria-label="Árbol OPD"
        style={style.tree}
        data-atajos-contexto="panel-arbol"
      >
        {/* Entrada Mapa del sistema (HU-21.002) */}
        <div
          role="treeitem"
          tabIndex={0}
          aria-level={1}
          data-opd-id="__mapa__"
          title="Mapa del sistema"
          style={{
            ...style.node,
            paddingLeft: "12px",
            ...(vistaMapaActiva ? style.nodeActive : {}),
          }}
          onClick={() => abrirVistaMapa()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              abrirVistaMapa();
            }
          }}
        >
          <span style={style.nodeName}>🗺 Mapa del sistema</span>
        </div>

        {nodosVisibles.length === 0 ? (
          <div style={style.empty}>Sin OPD</div>
        ) : (
          nodosVisibles.map(({ nodo }) => {
            const activo = nodo.opd.id === opdActivoId;
            const totalApariencias = Object.keys(nodo.opd.apariencias).length;
            const nombre = nombreNodo(modelo, nodo.opd);
            const etiquetaVisible = nombresArbolVisibles ? nombre : codigoOpd(nodo.opd.nombre);
            const esRaiz = nodo.opd.id === modelo.opdRaizId;
            const tieneHijos = nodo.hijos.length > 0;
            const estaExpandido = estaExpandidoNodo(nodo.opd.id);
            const tituloEliminar = esRaiz
              ? "SD no se puede eliminar"
              : tieneHijos
                ? "Eliminar descendientes primero"
                : "Eliminar OPD";
            const esRenombrando = renombrando?.id === nodo.opd.id;
            const dragOver = dragOverId === nodo.opd.id;

            return (
              <div
                key={nodo.opd.id}
                role="treeitem"
                tabIndex={0}
                aria-level={nodo.nivel + 2}
                aria-selected={activo}
                aria-expanded={tieneHijos ? estaExpandido : undefined}
                aria-current={activo ? "page" : undefined}
                data-opd-id={nodo.opd.id}
                title={nombre}
                draggable={modoOrdenArbol === "manual"}
                style={{
                  ...estiloNodo(nodo.nivel, activo),
                  ...(dragOver ? style.nodeDragOver : {}),
                }}
                onClick={() => cambiarOpdActivo(nodo.opd.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    cambiarOpdActivo(nodo.opd.id);
                  }
                  if (!event.ctrlKey && !event.metaKey) {
                    if (event.key === "ArrowUp") {
                      event.preventDefault();
                      navegarOpdArriba();
                    }
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      navegarOpdAbajo();
                    }
                    if (event.key === "ArrowLeft") {
                      event.preventDefault();
                      navegarOpdIzquierda();
                    }
                    if (event.key === "ArrowRight") {
                      event.preventDefault();
                      navegarOpdDerecha();
                    }
                  }
                }}
                onContextMenu={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setMenuContextual({ opdId: nodo.opd.id, x: event.clientX, y: event.clientY });
                }}
                onDragStart={(e) => handleDragStart(e as unknown as DragEvent, nodo.opd.id)}
                onDragOver={(e) => handleDragOver(e as unknown as DragEvent, nodo.opd.id)}
                onDragLeave={() => handleDragLeave()}
                onDrop={(e) => handleDrop(e as unknown as DragEvent, nodo.opd.padreId, nodo.opd.id)}
              >
                {/* Botón expandir/colapsar para nodos con hijos */}
                {tieneHijos && (
                  <button
                    type="button"
                    aria-label={estaExpandido ? "Colapsar" : "Expandir"}
                    style={style.expandBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpandido(nodo.opd.id);
                    }}
                  >
                    {estaExpandido ? "▾" : "▸"}
                  </button>
                )}
                {!tieneHijos && <span style={style.expandSpacer} />}

                {esRenombrando ? (
                  <input
                    autoFocus
                    style={style.inlineInput}
                    data-modo="inline-rename"
                    value={renombrando!.valor}
                    onInput={(e) =>
                      setRenombrando({ id: nodo.opd.id, valor: (e.currentTarget as HTMLInputElement).value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") renombrarSubmit();
                      if (e.key === "Escape") setRenombrando(null);
                    }}
                    onBlur={() => renombrarSubmit()}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span
                    style={style.nodeName}
                    onDblClick={(e) => {
                      e.stopPropagation();
                      setRenombrando({ id: nodo.opd.id, valor: nodo.opd.nombre });
                    }}
                  >
                    {etiquetaVisible}
                  </span>
                )}
                <span style={activo ? style.countActive : style.count}>{totalApariencias}</span>
                <button
                  type="button"
                  aria-label={`Eliminar OPD ${nombre}`}
                  title={tituloEliminar}
                  disabled={esRaiz}
                  style={esRaiz ? style.deleteButtonDisabled : style.deleteButton}
                  onClick={(event) => {
                    event.stopPropagation();
                    eliminarOpdDesdeArbol(nodo.opd.id);
                  }}
                >
                  <img src={deleteIconUrl} alt="" aria-hidden="true" style={style.deleteIcon} />
                </button>
              </div>
            );
          })
        )}
      </div>
      {menuContextual && (
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
      )}
    </aside>
  );
}

function construirArbol(modelo: Modelo): NodoOpd[] {
  const raiz = modelo.opds[modelo.opdRaizId];
  if (!raiz) return [];

  const hijosPorPadre = new Map<Id, Opd[]>();
  for (const opd of Object.values(modelo.opds)) {
    if (opd.id === raiz.id) continue;
    const padreId = padreValido(modelo, opd, raiz.id);
    const hijos = hijosPorPadre.get(padreId) ?? [];
    hijos.push(opd);
    hijosPorPadre.set(padreId, hijos);
  }

  // Ordenar hijos por ordenLocal o alfabéticamente
  for (const [padreId, hijos] of hijosPorPadre) {
    hijos.sort((a, b) => {
      if (a.ordenLocal !== undefined && b.ordenLocal !== undefined) {
        return a.ordenLocal - b.ordenLocal;
      }
      return a.id.localeCompare(b.id, "es");
    });
  }

  const visitados = new Set<Id>();
  const crearNodo = (opd: Opd, nivel: number): NodoOpd => {
    visitados.add(opd.id);
    const hijos = (hijosPorPadre.get(opd.id) ?? [])
      .filter((hijo) => !visitados.has(hijo.id))
      .map((hijo) => crearNodo(hijo, nivel + 1));
    return { opd, nivel, hijos };
  };

  const nodoRaiz = crearNodo(raiz, 0);
  const huerfanos = Object.values(modelo.opds)
    .filter((opd) => !visitados.has(opd.id))
    .map((opd) => crearNodo(opd, 1));

  return [{ ...nodoRaiz, hijos: [...nodoRaiz.hijos, ...huerfanos] }];
}

function padreValido(modelo: Modelo, opd: Opd, raizId: Id): Id {
  if (!opd.padreId || opd.padreId === opd.id || !modelo.opds[opd.padreId]) return raizId;
  return opd.padreId;
}

function nombreNodo(modelo: Modelo, opd: Opd): string {
  const refinador = Object.values(modelo.entidades).find(
    (entidad) => entidad.refinamiento?.opdId === opd.id,
  );
  if (!refinador) return opd.nombre;
  const sufijo = refinador.refinamiento?.tipo === "despliegue" ? "desplegado" : "descompuesto";
  return `${codigoOpd(opd.nombre)}: ${refinador.nombre} ${sufijo}`;
}

function codigoOpd(nombre: string): string {
  return /^SD(?:\d+(?:\.\d+)*)?/.exec(nombre.trim())?.[0] ?? nombre;
}

function cantidadHijos(modelo: Modelo, padreId: Id): number {
  return Object.values(modelo.opds).filter((opd) => opd.padreId === padreId).length;
}

function hijosOrdenados(modelo: Modelo, padreId: Id | null): Opd[] {
  return Object.values(modelo.opds)
    .filter((opd) => opd.padreId === padreId)
    .sort((a, b) => {
      if (a.ordenLocal !== undefined && b.ordenLocal !== undefined) return a.ordenLocal - b.ordenLocal;
      if (a.ordenLocal !== undefined) return -1;
      if (b.ordenLocal !== undefined) return 1;
      return a.nombre.localeCompare(b.nombre, "es-CL") || a.id.localeCompare(b.id, "es-CL");
    });
}

function reordenarDesdeMenu(
  modelo: Modelo,
  opdId: Id,
  direccion: "arriba" | "abajo",
  moverHermano: (padreId: Id | null, opdId: Id, posicion: number) => void,
): void {
  const opd = modelo.opds[opdId];
  if (!opd) return;
  const hermanos = hijosOrdenados(modelo, opd.padreId);
  const indice = hermanos.findIndex((item) => item.id === opdId);
  if (indice < 0) return;
  const siguiente = direccion === "arriba" ? indice - 1 : indice + 1;
  if (siguiente < 0 || siguiente >= hermanos.length) return;
  moverHermano(opd.padreId, opdId, siguiente);
}

function estiloNodo(nivel: number, activo: boolean): preact.JSX.CSSProperties {
  return {
    ...style.node,
    ...(activo ? style.nodeActive : {}),
    paddingLeft: `${12 + nivel * 16}px`,
  };
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
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
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
  tree: {
    overflow: "auto",
    padding: "8px",
  },
  empty: {
    padding: "8px 4px",
    color: "#667085",
    fontSize: "12px",
  },
  node: {
    width: "100%",
    minHeight: "34px",
    display: "grid",
    gridTemplateColumns: "16px minmax(0, 1fr) auto auto",
    alignItems: "center",
    gap: "4px",
    paddingTop: "4px",
    paddingBottom: "4px",
    border: "1px solid transparent",
    borderRadius: "4px",
    background: "transparent",
    color: "#475467",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    textAlign: "left",
  },
  nodeActive: {
    border: "1px solid #b9d2df",
    background: "#e8f7ff",
    color: "#1f2937",
    fontWeight: 700,
  },
  nodeDragOver: {
    borderTop: "2px solid #586D8C",
  },
  nodeName: {
    overflow: "visible",
    lineHeight: 1.2,
    overflowWrap: "anywhere",
    whiteSpace: "normal",
    fontSize: "13px",
  },
  count: {
    minWidth: "22px",
    height: "18px",
    borderRadius: "9px",
    background: "#edf2f7",
    color: "#667085",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 700,
  },
  countActive: {
    minWidth: "22px",
    height: "18px",
    borderRadius: "9px",
    background: "#d1eefb",
    color: "#1f2937",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 700,
  },
  expandBtn: {
    width: "16px",
    height: "16px",
    borderRadius: "3px",
    border: "1px solid transparent",
    background: "transparent",
    cursor: "pointer",
    fontSize: "9px",
    color: "#667085",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    marginRight: "0",
  },
  expandSpacer: {
    width: "16px",
    height: "16px",
  },
  deleteButton: {
    width: "26px",
    height: "26px",
    borderRadius: "4px",
    border: "1px solid transparent",
    background: "transparent",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },
  deleteButtonDisabled: {
    width: "26px",
    height: "26px",
    borderRadius: "4px",
    border: "1px solid transparent",
    background: "transparent",
    cursor: "not-allowed",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    opacity: 0.35,
  },
  deleteIcon: {
    width: "18px",
    height: "18px",
    display: "block",
  },
  inlineInput: {
    width: "100%",
    minWidth: 0,
    padding: "1px 4px",
    border: "1px solid #586D8C",
    borderRadius: "3px",
    fontSize: "13px",
    color: "#1f2937",
    font: "inherit",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
