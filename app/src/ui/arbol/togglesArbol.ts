import { esOpdSuelto } from "../../modelo/opdSueltos";
import type { Id, Modelo, Opd } from "../../modelo/tipos";
import type { NodoOpdData } from "./NodoOpd";

/**
 * Toggle helpers del arbol OPD. Mantienen el contrato de colapsados inverso:
 * set vacio = todo expandido.
 */
export function idsColapsables(nodos: NodoOpdData[]): Set<Id> {
  const ids = new Set<Id>();
  const recopilar = (items: NodoOpdData[]) => {
    for (const nodo of items) {
      if (nodo.hijos.length > 0) ids.add(nodo.opd.id);
      recopilar(nodo.hijos);
    }
  };
  recopilar(nodos);
  return ids;
}

export function expandirTodoArbol(): Set<Id> {
  return new Set();
}

export function construirArbol(modelo: Modelo): NodoOpdData[] {
  const raiz = modelo.opds[modelo.opdRaizId];
  if (!raiz) return [];
  const esSuelto = (id: Id) => esOpdSuelto(modelo, id);
  const hijosPorPadre = new Map<Id, Opd[]>();
  for (const opd of Object.values(modelo.opds)) {
    if (opd.id === raiz.id || esSuelto(opd.id)) continue; // sueltos → banda Taller, no árbol
    const padreId = padreValido(modelo, opd, raiz.id);
    const hijos = hijosPorPadre.get(padreId) ?? [];
    hijos.push(opd);
    hijosPorPadre.set(padreId, hijos);
  }
  for (const hijos of hijosPorPadre.values()) {
    hijos.sort((a, b) => {
      if (a.ordenLocal !== undefined && b.ordenLocal !== undefined) return a.ordenLocal - b.ordenLocal;
      return a.id.localeCompare(b.id, "es");
    });
  }
  const visitados = new Set<Id>();
  const crearNodo = (opd: Opd, nivel: number): NodoOpdData => {
    visitados.add(opd.id);
    const hijos = (hijosPorPadre.get(opd.id) ?? [])
      .filter((hijo) => !visitados.has(hijo.id))
      .map((hijo) => crearNodo(hijo, nivel + 1));
    return { opd, nivel, hijos };
  };
  const nodoRaiz = crearNodo(raiz, 0);
  // Huérfanos CORRUPTOS (padre inexistente, no sueltos intencionales) → defensivo bajo raíz.
  const huerfanos = Object.values(modelo.opds)
    .filter((opd) => !visitados.has(opd.id) && !esSuelto(opd.id) && opd.id !== raiz.id)
    .map((opd) => crearNodo(opd, 1));
  return [{ ...nodoRaiz, hijos: [...nodoRaiz.hijos, ...huerfanos] }];
}

/**
 * Subárboles de la banda «Taller» (R-OPD-REF-20): un nodo nivel-0 por cada OPD
 * suelto, con sus descendientes adoptados internamente (un suelto puede tener
 * refinamiento propio). Proyección de navegación derivada, no identidad
 * persistida.
 */
export function nodosSueltosTaller(modelo: Modelo): NodoOpdData[] {
  const sueltos = Object.values(modelo.opds).filter((opd) => esOpdSuelto(modelo, opd.id));
  const hijosPorPadre = new Map<Id, Opd[]>();
  for (const opd of Object.values(modelo.opds)) {
    if (opd.padreId) {
      const arr = hijosPorPadre.get(opd.padreId) ?? [];
      arr.push(opd);
      hijosPorPadre.set(opd.padreId, arr);
    }
  }
  const visitados = new Set<Id>();
  const crearNodo = (opd: Opd, nivel: number): NodoOpdData => {
    visitados.add(opd.id);
    const hijos = (hijosPorPadre.get(opd.id) ?? [])
      .filter((h) => !visitados.has(h.id))
      .sort((a, b) => a.id.localeCompare(b.id, "es"))
      .map((h) => crearNodo(h, nivel + 1));
    return { opd, nivel, hijos };
  };
  return sueltos
    .sort((a, b) => a.id.localeCompare(b.id, "es"))
    .map((opd) => crearNodo(opd, 0));
}

export function cantidadHijos(modelo: Modelo, padreId: Id): number {
  return Object.values(modelo.opds).filter((opd) => opd.padreId === padreId).length;
}

export function hijosOrdenados(modelo: Modelo, padreId: Id | null): Opd[] {
  return Object.values(modelo.opds)
    .filter((opd) => opd.padreId === padreId)
    .sort((a, b) => {
      if (a.ordenLocal !== undefined && b.ordenLocal !== undefined) return a.ordenLocal - b.ordenLocal;
      if (a.ordenLocal !== undefined) return -1;
      if (b.ordenLocal !== undefined) return 1;
      return a.nombre.localeCompare(b.nombre, "es-CL") || a.id.localeCompare(b.id, "es-CL");
    });
}

export function reordenarDesdeMenu(
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

function padreValido(modelo: Modelo, opd: Opd, raizId: Id): Id {
  if (!opd.padreId || opd.padreId === opd.id || !modelo.opds[opd.padreId]) return raizId;
  return opd.padreId;
}
