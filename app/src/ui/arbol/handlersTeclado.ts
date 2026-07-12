import type { Id } from "../../modelo/tipos";
import type { NodoOpdData } from "../../app/viewmodels/arbolOpdEstructura";

export type DireccionArbol = "up" | "down" | "left" | "right";
export type AtajoPanelArbol =
  | "foco-anterior"
  | "foco-siguiente"
  | "renombrar"
  | "expandir-todo"
  | "colapsar-todo"
  | "abrir-gestion";

export interface AccionesTecladoArbol {
  navegarOpdArriba: () => void;
  navegarOpdAbajo: () => void;
  navegarOpdIzquierda: () => void;
  navegarOpdDerecha: () => void;
  cambiarOpdActivo: (opdId: Id) => void;
}

/**
 * Handlers puros del arbol OPD. ArbolOpd los cablea al contexto panel-arbol.
 */
export function manejarTeclaNodoArbol(
  event: Pick<KeyboardEvent, "key" | "ctrlKey" | "metaKey" | "preventDefault">,
  opdId: Id,
  acciones: AccionesTecladoArbol,
): void {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    acciones.cambiarOpdActivo(opdId);
  }
  if (event.ctrlKey || event.metaKey) return;
  if (event.key === "ArrowUp") {
    event.preventDefault();
    acciones.navegarOpdArriba();
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    acciones.navegarOpdAbajo();
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    acciones.navegarOpdIzquierda();
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    acciones.navegarOpdDerecha();
  }
}

export function atajoPanelArbolDesdeEvento(
  event: Pick<KeyboardEvent, "key" | "ctrlKey" | "metaKey" | "shiftKey">,
): AtajoPanelArbol | null {
  const control = event.ctrlKey || event.metaKey;
  if (event.key === "F2") return "renombrar";
  if (!control) return null;
  if (event.key === "ArrowUp") return "foco-anterior";
  if (event.key === "ArrowDown") return "foco-siguiente";
  if (event.key.toLowerCase() === "e") return event.shiftKey ? "colapsar-todo" : "expandir-todo";
  if (event.key.toLowerCase() === "d") return "abrir-gestion";
  return null;
}

export function aplanarNodosVisibles(
  nodos: NodoOpdData[],
  estaExpandido: (id: Id) => boolean,
): Array<{ nodo: NodoOpdData; visible: boolean }> {
  return nodos.flatMap((nodo) => {
    const hijosVisibles = nodo.hijos.length > 0 && estaExpandido(nodo.opd.id);
    return [
      { nodo, visible: true },
      ...(hijosVisibles
        ? aplanarNodosVisibles(nodo.hijos, estaExpandido)
        : nodo.hijos.length > 0
          ? nodo.hijos.map((hijo) => ({ nodo: hijo, visible: false }))
          : []),
    ];
  });
}

export function siguienteFocoArbol(
  nodosVisibles: NodoOpdData[],
  focoId: Id,
  direccion: Exclude<DireccionArbol, "left" | "right">,
): Id | null {
  const indice = nodosVisibles.findIndex((nodo) => nodo.opd.id === focoId);
  if (indice < 0) return nodosVisibles[0]?.opd.id ?? null;
  const siguiente = direccion === "down" ? indice + 1 : indice - 1;
  return nodosVisibles[siguiente]?.opd.id ?? null;
}
