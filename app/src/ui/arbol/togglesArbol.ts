import type { NodoOpdData } from "../../app/viewmodels/arbolOpdEstructura";
import type { Id, Modelo, Opd } from "../../modelo/tipos";

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
