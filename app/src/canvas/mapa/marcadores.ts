import type { Id } from "../../modelo/tipos";
import {
  clonarDescriptor,
  type CriterioResaltado,
  type DescriptorMapa,
  type EstiloResaltadoMapa,
  type NodoMapa,
} from "./tipos";

/**
 * Aplicación de marcadores y resaltado sobre nodos del mapa:
 * - `resaltarPorTipo`: aplica `estiloResaltado` según criterio
 *   (predominanciaProceso/Objeto, tieneEstados, raiz, ninguno).
 * - `aplicarMarcadores`: marca nodo activo (verde) y último visitado (rojo).
 *
 * HU-21.* mapa marcadores y resaltado.
 */

export function resaltarPorTipo(
  descriptor: DescriptorMapa,
  criterio: CriterioResaltado,
): DescriptorMapa {
  if (criterio === "ninguno") {
    return {
      ...clonarDescriptor(descriptor),
      nodos: descriptor.nodos.map((nodo) => {
        const { estiloResaltado: _omitido, ...resto } = nodo;
        void _omitido;
        return { ...resto, bbox: { ...nodo.bbox } };
      }),
    };
  }

  return {
    ...clonarDescriptor(descriptor),
    nodos: descriptor.nodos.map((nodo) => ({
      ...nodo,
      estiloResaltado: estiloParaCriterio(nodo, criterio),
    })),
  };
}

export function aplicarMarcadores(
  descriptor: DescriptorMapa,
  opdActivoId: Id | null,
  opdUltimoVisitadoId: Id | null,
): DescriptorMapa {
  return {
    ...clonarDescriptor(descriptor),
    nodos: descriptor.nodos.map((nodo) => ({
      ...nodo,
      marcadorActivo: Boolean(opdActivoId && nodo.opdId === opdActivoId),
      marcadorVisitado: Boolean(opdUltimoVisitadoId && nodo.opdId === opdUltimoVisitadoId && nodo.opdId !== opdActivoId),
    })),
  };
}

function estiloParaCriterio(nodo: NodoMapa, criterio: CriterioResaltado): EstiloResaltadoMapa {
  if (criterio === "predominanciaProceso") {
    return nodo.thumbnailProcesos > nodo.thumbnailObjetos ? "cyan" : "gris";
  }
  if (criterio === "predominanciaObjeto") {
    return nodo.thumbnailObjetos >= nodo.thumbnailProcesos && nodo.thumbnailObjetos > 0 ? "verde-lima" : "gris";
  }
  if (criterio === "tieneEstados") {
    return nodo.thumbnailEstados > 0 ? "azul" : "gris";
  }
  if (criterio === "raiz") {
    return nodo.tipoRefinamiento === "raiz" || nodo.profundidad === 1 ? "naranja" : "gris";
  }
  return "gris";
}
