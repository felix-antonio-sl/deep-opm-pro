import type { OpmStore } from "../../store";

export interface SystemMapFiltersPort {
  mapaPanelFiltrosAbierto: OpmStore["mapaPanelFiltrosAbierto"];
  mapaPanelEstadisticasAbierto: OpmStore["mapaPanelEstadisticasAbierto"];
  mapaProfundidadMaxima: OpmStore["mapaProfundidadMaxima"];
  mapaSubarbolRaizId: OpmStore["mapaSubarbolRaizId"];
  mapaCriterioResaltado: OpmStore["mapaCriterioResaltado"];
  toggleMapaPanelFiltros: OpmStore["toggleMapaPanelFiltros"];
  fijarMapaProfundidad: OpmStore["fijarMapaProfundidad"];
  fijarMapaSubarbol: OpmStore["fijarMapaSubarbol"];
  fijarMapaCriterioResaltado: OpmStore["fijarMapaCriterioResaltado"];
  limpiarFiltrosMapa: OpmStore["limpiarFiltrosMapa"];
}
