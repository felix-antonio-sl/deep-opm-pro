import { useZustandMapViewPort } from "../ports/zustandMapViewPort";
import { useZustandOpdNavigationPort } from "../ports/zustandOpdNavigationPort";
import { useZustandSystemMapControlsPort } from "../ports/zustandSystemMapControlsPort";
import { useZustandSystemMapDataPort } from "../ports/zustandSystemMapDataPort";
import { useZustandSystemMapFiltersPort } from "../ports/zustandSystemMapFiltersPort";
import { useZustandSystemMapViewportPort } from "../ports/zustandSystemMapViewportPort";

export function useMapaSistemaViewModel() {
  const { modelo } = useZustandOpdNavigationPort();
  const { cerrarVistaMapa } = useZustandMapViewPort();
  const {
    refrescarVistaMapa,
    mapaAutoRefresh,
    toggleMapaAutoRefresh,
    toggleMapaPanelEstadisticas,
  } = useZustandSystemMapControlsPort();
  const { descriptorBase, descriptor, estadisticas, saltarAOpdDesdeMapa } = useZustandSystemMapDataPort();
  const { mapaZoom, mapaPanX, mapaPanY, fijarMapaZoom, fijarMapaPan } = useZustandSystemMapViewportPort();
  const {
    mapaPanelFiltrosAbierto,
    mapaPanelEstadisticasAbierto,
    toggleMapaPanelFiltros,
    mapaProfundidadMaxima,
    mapaSubarbolRaizId,
    mapaCriterioResaltado,
    fijarMapaProfundidad,
    fijarMapaSubarbol,
    fijarMapaCriterioResaltado,
    limpiarFiltrosMapa,
  } = useZustandSystemMapFiltersPort();

  return {
    descriptorBase,
    descriptor,
    estadisticas,
    modelo,
    saltarAOpdDesdeMapa,
    cerrarVistaMapa,
    refrescarVistaMapa,
    mapaZoom,
    mapaPanX,
    mapaPanY,
    fijarMapaZoom,
    fijarMapaPan,
    mapaAutoRefresh,
    toggleMapaAutoRefresh,
    mapaPanelFiltrosAbierto,
    mapaPanelEstadisticasAbierto,
    toggleMapaPanelFiltros,
    toggleMapaPanelEstadisticas,
    mapaProfundidadMaxima,
    mapaSubarbolRaizId,
    mapaCriterioResaltado,
    fijarMapaProfundidad,
    fijarMapaSubarbol,
    fijarMapaCriterioResaltado,
    limpiarFiltrosMapa,
  };
}

export type MapaSistemaViewModel = ReturnType<typeof useMapaSistemaViewModel>;
