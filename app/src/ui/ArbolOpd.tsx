import { useOpmStore } from "../store";
import type { Id, Modelo, Opd } from "../modelo/tipos";

interface NodoOpd {
  opd: Opd;
  nivel: number;
  hijos: NodoOpd[];
}

export function ArbolOpd() {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const cambiarOpdActivo = useOpmStore((s) => s.cambiarOpdActivo);
  const nodos = aLista(construirArbol(modelo));

  return (
    <aside style={style.panel} aria-label="Árbol OPD">
      <div style={style.header}>OPDs</div>
      <div role="tree" aria-label="Árbol OPD" style={style.tree}>
        {nodos.length === 0 ? (
          <div style={style.empty}>Sin OPD</div>
        ) : (
          nodos.map((nodo) => {
            const activo = nodo.opd.id === opdActivoId;
            const totalApariencias = Object.keys(nodo.opd.apariencias).length;
            const nombre = nombreNodo(modelo, nodo.opd);
            return (
              <button
                key={nodo.opd.id}
                type="button"
                role="treeitem"
                aria-level={nodo.nivel + 1}
                aria-selected={activo}
                aria-current={activo ? "page" : undefined}
                data-opd-id={nodo.opd.id}
                style={estiloNodo(nodo.nivel, activo)}
                onClick={() => cambiarOpdActivo(nodo.opd.id)}
              >
                <span style={style.nodeName}>{nombre}</span>
                <span style={activo ? style.countActive : style.count}>{totalApariencias}</span>
              </button>
            );
          })
        )}
      </div>
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

function aLista(nodos: NodoOpd[]): NodoOpd[] {
  return nodos.flatMap((nodo) => [nodo, ...aLista(nodo.hijos)]);
}

function nombreNodo(modelo: Modelo, opd: Opd): string {
  const refinador = Object.values(modelo.entidades).find(
    (entidad) => entidad.refinamiento?.tipo === "descomposicion" && entidad.refinamiento.opdId === opd.id,
  );
  if (!refinador) return opd.nombre;
  return `${codigoOpd(opd.nombre)}: ${refinador.nombre} descompuesto`;
}

function codigoOpd(nombre: string): string {
  return /^SD(?:\d+(?:\.\d+)*)?/.exec(nombre.trim())?.[0] ?? nombre;
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
    padding: "0 12px",
    borderBottom: "1px solid #e4eaf1",
    color: "#1f2937",
    fontSize: "13px",
    fontWeight: 700,
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
    minHeight: "30px",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    alignItems: "center",
    gap: "8px",
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
  nodeName: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
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
} satisfies Record<string, preact.JSX.CSSProperties>;
