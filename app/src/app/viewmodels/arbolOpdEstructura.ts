import { esOpdSuelto } from "../../modelo/opdSueltos";
import type { Id, Modelo, Opd } from "../../modelo/tipos";

export interface NodoOpdData {
  opd: Opd;
  nivel: number;
  hijos: NodoOpdData[];
}

export function construirArbol(modelo: Modelo): NodoOpdData[] {
  const raiz = modelo.opds[modelo.opdRaizId];
  if (!raiz) return [];
  const esSuelto = (id: Id) => esOpdSuelto(modelo, id);
  const hijosPorPadre = new Map<Id, Opd[]>();
  for (const opd of Object.values(modelo.opds)) {
    if (opd.id === raiz.id || esSuelto(opd.id)) continue;
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
  const huerfanos = Object.values(modelo.opds)
    .filter((opd) => !visitados.has(opd.id) && !esSuelto(opd.id) && opd.id !== raiz.id)
    .map((opd) => crearNodo(opd, 1));
  return [{ ...nodoRaiz, hijos: [...nodoRaiz.hijos, ...huerfanos] }];
}

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
      .filter((hijo) => !visitados.has(hijo.id))
      .sort((a, b) => a.id.localeCompare(b.id, "es"))
      .map((hijo) => crearNodo(hijo, nivel + 1));
    return { opd, nivel, hijos };
  };
  return sueltos
    .sort((a, b) => a.id.localeCompare(b.id, "es"))
    .map((opd) => crearNodo(opd, 0));
}

function padreValido(modelo: Modelo, opd: Opd, raizId: Id): Id {
  if (!opd.padreId || opd.padreId === opd.id || !modelo.opds[opd.padreId]) return raizId;
  return opd.padreId;
}
