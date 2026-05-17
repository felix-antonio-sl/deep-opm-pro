import type { Id } from "../../modelo/tipos";
import {
  clonarDescriptor,
  descriptorConNodos,
  type DescriptorMapa,
} from "./tipos";

/**
 * Filtros del descriptor del mapa: por profundidad máxima y por subárbol
 * (raíz seleccionada). Producen un descriptor nuevo (no mutan).
 *
 * HU-21.* mapa filtros.
 */

export function filtrarPorProfundidad(
  descriptor: DescriptorMapa,
  maxProfundidad: number | null,
): DescriptorMapa {
  if (maxProfundidad === null) return clonarDescriptor(descriptor);
  const max = Math.max(1, Math.floor(maxProfundidad));
  const nodos = descriptor.nodos.filter((nodo) => nodo.profundidad <= max);
  return descriptorConNodos(descriptor, nodos);
}

export function filtrarPorSubarbol(
  descriptor: DescriptorMapa,
  raizOpdId: Id | null,
): DescriptorMapa {
  if (!raizOpdId) return clonarDescriptor(descriptor);
  if (!descriptor.nodos.some((nodo) => nodo.opdId === raizOpdId)) {
    return clonarDescriptor(descriptor);
  }
  const visitados = new Set<Id>([raizOpdId]);
  let cambio = true;
  while (cambio) {
    cambio = false;
    for (const arista of descriptor.aristas) {
      if (visitados.has(arista.desdeOpdId) && !visitados.has(arista.haciaOpdId)) {
        visitados.add(arista.haciaOpdId);
        cambio = true;
      }
    }
  }
  const nodos = descriptor.nodos.filter((nodo) => visitados.has(nodo.opdId));
  return descriptorConNodos(descriptor, nodos);
}
