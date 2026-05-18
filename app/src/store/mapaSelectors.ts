import {
  aplicarMarcadores,
  calcularEstadisticas,
  construirDescriptorMapa,
  filtrarPorProfundidad,
  filtrarPorSubarbol,
  resaltarPorTipo,
  type CriterioResaltado,
  type DescriptorMapa,
  type EstadisticasModelo,
} from "../canvas/mapaSistema";
import type { Id, Modelo } from "../modelo/tipos";

export interface EstadoMapaDerivable {
  modelo: Modelo;
  descriptorMapaCache: DescriptorMapa | null;
  mapaSubarbolRaizId: Id | null;
  mapaProfundidadMaxima: number | null;
  mapaCriterioResaltado: CriterioResaltado;
  opdActivoId: Id;
  mapaUltimoVisitadoOpdId: Id | null;
}

export function descriptorMapaFiltrado(estado: EstadoMapaDerivable): DescriptorMapa {
  let descriptor = estado.descriptorMapaCache ?? construirDescriptorMapa(estado.modelo);
  descriptor = filtrarPorSubarbol(descriptor, estado.mapaSubarbolRaizId);
  descriptor = filtrarPorProfundidad(descriptor, estado.mapaProfundidadMaxima);
  descriptor = resaltarPorTipo(descriptor, estado.mapaCriterioResaltado);
  return aplicarMarcadores(descriptor, estado.opdActivoId, estado.mapaUltimoVisitadoOpdId);
}

export function estadisticasModelo(modelo: Modelo): EstadisticasModelo {
  return calcularEstadisticas(modelo);
}
