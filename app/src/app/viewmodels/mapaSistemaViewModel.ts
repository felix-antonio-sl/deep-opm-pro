import { useOpmStore } from "../../store";
import { useZustandSystemMapControlsPort } from "../ports/zustandSystemMapControlsPort";

export function useMapaSistemaViewModel() {
  const {
    refrescarVistaMapa,
    mapaAutoRefresh,
    toggleMapaAutoRefresh,
    toggleMapaPanelEstadisticas,
  } = useZustandSystemMapControlsPort();
  const descriptorBase = useOpmStore((s) => s.descriptorMapaCache);
  const descriptor = useOpmStore((s) => s.descriptorMapaFiltrado());
  const estadisticas = useOpmStore((s) => s.estadisticasModelo());
  const modelo = useOpmStore((s) => s.modelo);
  const saltarAOpdDesdeMapa = useOpmStore((s) => s.saltarAOpdDesdeMapa);
  const cerrarVistaMapa = useOpmStore((s) => s.cerrarVistaMapa);
  const mapaZoom = useOpmStore((s) => s.mapaZoom);
  const mapaPanX = useOpmStore((s) => s.mapaPanX);
  const mapaPanY = useOpmStore((s) => s.mapaPanY);
  const fijarMapaZoom = useOpmStore((s) => s.fijarMapaZoom);
  const fijarMapaPan = useOpmStore((s) => s.fijarMapaPan);
  const mapaPanelFiltrosAbierto = useOpmStore((s) => s.mapaPanelFiltrosAbierto);
  const mapaPanelEstadisticasAbierto = useOpmStore((s) => s.mapaPanelEstadisticasAbierto);
  const toggleMapaPanelFiltros = useOpmStore((s) => s.toggleMapaPanelFiltros);
  const mapaProfundidadMaxima = useOpmStore((s) => s.mapaProfundidadMaxima);
  const mapaSubarbolRaizId = useOpmStore((s) => s.mapaSubarbolRaizId);
  const mapaCriterioResaltado = useOpmStore((s) => s.mapaCriterioResaltado);
  const fijarMapaProfundidad = useOpmStore((s) => s.fijarMapaProfundidad);
  const fijarMapaSubarbol = useOpmStore((s) => s.fijarMapaSubarbol);
  const fijarMapaCriterioResaltado = useOpmStore((s) => s.fijarMapaCriterioResaltado);
  const limpiarFiltrosMapa = useOpmStore((s) => s.limpiarFiltrosMapa);

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
