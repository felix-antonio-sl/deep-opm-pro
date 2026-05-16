// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useState, useMemo } from "preact/hooks";
import { useOpmStore } from "../store";
import type { Id, Modelo, Opd } from "../modelo/tipos";
import { tokens } from "./tokens";

interface NodoGestion {
  opd: Opd;
  nivel: number;
  hijos: NodoGestion[];
}

export function GestionArbolOpd() {
  const abierta = useOpmStore((s) => s.gestionArbolAbierta);
  const cerrar = useOpmStore((s) => s.cerrarGestionArbol);
  const modelo = useOpmStore((s) => s.modelo);
  const busqueda = useOpmStore((s) => s.busquedaOpdGestion);
  const fijarBusqueda = useOpmStore((s) => s.fijarBusquedaOpdGestion);
  const moverOpdEnGestion = useOpmStore((s) => s.moverOpdEnGestion);
  const renombrarOpdDesdeArbol = useOpmStore((s) => s.renombrarOpdDesdeArbol);

  const [cortadoId, setCortadoId] = useState<Id | null>(null);
  const [renombrando, setRenombrando] = useState<{ id: Id; valor: string } | null>(null);

  const arbol = useMemo(() => construirArbolGestion(modelo), [modelo]);

  // Filtrar por búsqueda
  const filtrados = useMemo(() => {
    if (!busqueda.trim()) return [arbol, true] as const;
    const q = busqueda.toLowerCase();
    const filtra = (nodo: NodoGestion): [NodoGestion | null, boolean] => {
      const coincide = nodo.opd.nombre.toLowerCase().includes(q)
        || /^SD(?:\d+(?:\.\d+)*)?/.exec(nodo.opd.nombre.trim())?.[0]?.toLowerCase().includes(q)
        || false;
      const hijos = nodo.hijos.map(filtra);
      const hijosFiltrados = hijos.filter((h): h is [NodoGestion, boolean] => h[0] !== null);
      const algunoCoincide = coincide || hijosFiltrados.some(([, c]) => c);
      if (!algunoCoincide) return [null, false] as const;
      return [{ ...nodo, hijos: hijosFiltrados.map(([n]) => n!) }, algunoCoincide] as const;
    };
    return filtra(arbol);
  }, [arbol, busqueda]);

  if (!abierta) return null;

  const pegarSobre = (targetId: Id) => {
    if (!cortadoId || cortadoId === targetId) return;
    // Mover al target como padre, al final de la lista
    moverOpdEnGestion(cortadoId, targetId, 999999);
    setCortadoId(null);
  };

  const renombrarSubmit = () => {
    if (renombrando && renombrando.valor.trim()) {
      renombrarOpdDesdeArbol(renombrando.id, renombrando.valor.trim());
    }
    setRenombrando(null);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      if (renombrando) {
        setRenombrando(null);
        return;
      }
      cerrar();
    }
  };

  return (
    <div style={style.backdrop} onClick={() => cerrar()} onKeyDown={handleKeyDown}>
      <div
        style={style.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Gestión del árbol OPD"
        data-ifml-stereotype="Modal"
        data-ifml-modal="true"
      >
        <div style={style.header}>
          <span style={style.title}>Gestión del árbol OPD</span>
          <button type="button" style={style.closeBtn} onClick={cerrar} title="Cerrar (Esc)">
            ✕
          </button>
        </div>
        <div style={style.searchBar}>
          <input
            type="search"
            placeholder="Buscar OPD por nombre o código (SDn.m)..."
            value={busqueda}
            onInput={(e) => fijarBusqueda((e.currentTarget as HTMLInputElement).value)}
            style={style.searchInput}
          />
          {cortadoId && (
            <span style={style.clipboardInfo}>
              Cortado: {modelo.opds[cortadoId]?.nombre ?? cortadoId}
              <button type="button" style={style.smallBtn} onClick={() => setCortadoId(null)}>
                Cancelar
              </button>
            </span>
          )}
        </div>
        <div style={style.tree}>
          {renderNodo(filtrados[0] as NodoGestion, {
            esRaiz: true,
            cortadoId,
            setCortadoId,
            pegarSobre,
            renombrando,
            setRenombrando,
            renombrarSubmit,
            modelo,
          })}
        </div>
        <div style={style.footer}>
          <span style={style.footerHint}>Ctrl+D abre/cierra · Doble clic en nombre para renombrar</span>
        </div>
      </div>
    </div>
  );
}

function construirArbolGestion(modelo: Modelo): NodoGestion {
  const raiz = modelo.opds[modelo.opdRaizId];
  if (!raiz) return { opd: { id: "", nombre: "", padreId: null, apariencias: {}, enlaces: {} }, nivel: 0, hijos: [] };

  const hijosPorPadre = new Map<Id, Opd[]>();
  for (const opd of Object.values(modelo.opds)) {
    if (opd.id === raiz.id) continue;
    const padre = opd.padreId && modelo.opds[opd.padreId] ? opd.padreId : modelo.opdRaizId;
    const lista = hijosPorPadre.get(padre) ?? [];
    lista.push(opd);
    hijosPorPadre.set(padre, lista);
  }

  const visitados = new Set<Id>();
  const crearNodo = (opd: Opd, nivel: number): NodoGestion => {
    visitados.add(opd.id);
    const hijos = (hijosPorPadre.get(opd.id) ?? [])
      .filter((h) => !visitados.has(h.id))
      .map((h) => crearNodo(h, nivel + 1));
    return { opd, nivel, hijos };
  };

  return crearNodo(raiz, 0);
}

interface RenderOps {
  esRaiz: boolean;
  cortadoId: Id | null;
  setCortadoId: (id: Id | null) => void;
  pegarSobre: (targetId: Id) => void;
  renombrando: { id: Id; valor: string } | null;
  setRenombrando: (v: { id: Id; valor: string } | null) => void;
  renombrarSubmit: () => void;
  modelo: Modelo;
}

function renderNodo(nodo: NodoGestion, ops: RenderOps): preact.VNode | null {
  if (!nodo) return null;
  const { opd, nivel, hijos } = nodo;
  const esRaiz = opd.id === ops.modelo.opdRaizId;
  const nombreMostrar = opd.nombre;
  const esRenombrando = ops.renombrando?.id === opd.id;

  return (
    <div key={opd.id}>
      <div
        style={{
          ...style.node,
          paddingLeft: `${12 + nivel * 20}px`,
        }}
      >
        {esRenombrando ? (
          <input
            autoFocus
            style={style.inlineInput}
            value={ops.renombrando!.valor}
            onInput={(e) =>
              ops.setRenombrando({
                id: opd.id,
                valor: (e.currentTarget as HTMLInputElement).value,
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") ops.renombrarSubmit();
              if (e.key === "Escape") ops.setRenombrando(null);
            }}
            onBlur={() => ops.renombrarSubmit()}
          />
        ) : (
          <span
            style={style.nodeName}
            title="Doble clic para renombrar"
            onDblClick={() =>
              ops.setRenombrando({ id: opd.id, valor: opd.nombre })
            }
          >
            {nombreMostrar}
          </span>
        )}
        <span style={style.nodeCount}>
          {Object.keys(opd.apariencias).length} cosas
        </span>
        <div style={style.nodeActions}>
          {!esRaiz && (
            <button
              type="button"
              style={style.actionBtn}
              title="Cortar OPD"
              onClick={() => ops.setCortadoId(opd.id)}
            >
              Cortar
            </button>
          )}
          {ops.cortadoId && ops.cortadoId !== opd.id && (
            <button
              type="button"
              style={{ ...style.actionBtn, ...style.pasteBtn }}
              title={`Pegar como hijo de ${nombreMostrar}`}
              onClick={() => ops.pegarSobre(opd.id)}
            >
              Pegar aquí
            </button>
          )}
        </div>
      </div>
      {hijos.map((hijo) => renderNodo(hijo, ops))}
    </div>
  );
}

const style = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    background: "rgba(16, 24, 40, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    width: "560px",
    maxHeight: "80vh",
    background: tokens.colors.fondoChrome,
    borderRadius: tokens.radii.xl,
    boxShadow: tokens.shadows.modalAmplio,
    display: "grid",
    gridTemplateRows: "auto auto minmax(0, 1fr) auto",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 18px",
    borderBottom: `1px solid ${tokens.colors.bordeChrome}`,
  },
  title: {
    color: tokens.colors.textoPrimario,
    fontSize: "15px",
    fontWeight: 700,
  },
  closeBtn: {
    width: "28px",
    height: "28px",
    borderRadius: tokens.radii.sm,
    border: "1px solid transparent",
    background: "transparent",
    cursor: "pointer",
    color: tokens.colors.textoTerciario,
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBar: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    padding: "10px 18px",
    borderBottom: `1px solid ${tokens.colors.bordeChrome}`,
  },
  searchInput: {
    width: "100%",
    padding: "6px 10px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.md,
    fontSize: "13px",
    color: tokens.colors.textoPrimario,
    outline: "none",
  },
  clipboardInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: tokens.colors.chromeNeutral,
    fontSize: "12px",
    fontWeight: 600,
  },
  smallBtn: {
    padding: "2px 8px",
    borderRadius: tokens.radii.sm,
    border: `1px solid ${tokens.colors.bordeControl}`,
    background: tokens.colors.fondoChrome,
    cursor: "pointer",
    fontSize: "11px",
    color: tokens.colors.textoTerciario,
  },
  tree: {
    overflow: "auto",
    padding: "8px 0",
    flex: 1,
  },
  node: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    minHeight: "34px",
    padding: "4px 8px 4px",
    borderBottom: `1px solid ${tokens.colors.bordeGestion}`,
  },
  nodeName: {
    flex: "1 1 auto",
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: tokens.colors.textoPrimario,
    fontSize: "13px",
    fontWeight: 600,
    cursor: "default",
  },
  nodeCount: {
    color: tokens.colors.textoTerciario,
    fontSize: "11px",
    whiteSpace: "nowrap",
  },
  nodeActions: {
    display: "flex",
    gap: "4px",
  },
  actionBtn: {
    padding: "2px 8px",
    borderRadius: tokens.radii.sm,
    border: `1px solid ${tokens.colors.bordeControl}`,
    background: tokens.colors.fondoChrome,
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 600,
    color: tokens.colors.textoPrimario,
  },
  pasteBtn: {
    border: `1px solid ${tokens.colors.chromeNeutral}`,
    color: tokens.colors.chromeNeutral,
  },
  inlineInput: {
    flex: "1 1 auto",
    minWidth: 0,
    padding: "2px 6px",
    border: `1px solid ${tokens.colors.chromeNeutral}`,
    borderRadius: tokens.radii.sm,
    fontSize: "13px",
    color: tokens.colors.textoPrimario,
  },
  footer: {
    padding: "10px 18px",
    borderTop: `1px solid ${tokens.colors.bordeChrome}`,
  },
  footerHint: {
    color: tokens.colors.textoTerciario,
    fontSize: "11px",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
