import { useMemo } from "preact/hooks";
import type { Id, Modelo, Opd } from "../../modelo/tipos";
import { useZustandOpdTreeManagementPort } from "../ports/zustandOpdTreeManagementPort";

export interface NodoGestionOpd {
  opd: Opd;
  nivel: number;
  hijos: NodoGestionOpd[];
}

export function useGestionArbolOpdViewModel() {
  const {
    abierta,
    cerrar,
    modelo,
    busqueda,
    fijarBusqueda,
    moverOpdEnGestion,
    renombrarOpdDesdeArbol,
  } = useZustandOpdTreeManagementPort();

  const arbol = useMemo(() => construirArbolGestion(modelo), [modelo]);
  const arbolFiltrado = useMemo(() => filtrarArbolGestion(arbol, busqueda), [arbol, busqueda]);

  return {
    abierta,
    cerrar,
    modelo,
    busqueda,
    fijarBusqueda,
    moverOpdEnGestion,
    renombrarOpdDesdeArbol,
    arbolFiltrado,
  };
}

export function construirArbolGestion(modelo: Modelo): NodoGestionOpd {
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
  const crearNodo = (opd: Opd, nivel: number): NodoGestionOpd => {
    visitados.add(opd.id);
    const hijos = (hijosPorPadre.get(opd.id) ?? [])
      .filter((hijo) => !visitados.has(hijo.id))
      .map((hijo) => crearNodo(hijo, nivel + 1));
    return { opd, nivel, hijos };
  };

  return crearNodo(raiz, 0);
}

export function filtrarArbolGestion(arbol: NodoGestionOpd, busqueda: string): NodoGestionOpd | null {
  const q = busqueda.trim().toLowerCase();
  if (!q) return arbol;

  const filtra = (nodo: NodoGestionOpd): NodoGestionOpd | null => {
    const codigo = /^SD(?:\d+(?:\.\d+)*)?/.exec(nodo.opd.nombre.trim())?.[0]?.toLowerCase() ?? "";
    const coincide = nodo.opd.nombre.toLowerCase().includes(q) || codigo.includes(q);
    const hijos = nodo.hijos.map(filtra).filter((hijo): hijo is NodoGestionOpd => hijo !== null);
    if (!coincide && hijos.length === 0) return null;
    return { ...nodo, hijos };
  };

  return filtra(arbol);
}

export type GestionArbolOpdViewModel = ReturnType<typeof useGestionArbolOpdViewModel>;
