import { useOpmStore } from "../../store";
import type { SystemMapFiltersPort } from "./systemMapFiltersPort";

export function useZustandSystemMapFiltersPort(): SystemMapFiltersPort {
  const mapaPanelFiltrosAbierto = useOpmStore((s) => s.mapaPanelFiltrosAbierto);
  const mapaPanelEstadisticasAbierto = useOpmStore((s) => s.mapaPanelEstadisticasAbierto);
  const mapaProfundidadMaxima = useOpmStore((s) => s.mapaProfundidadMaxima);
  const mapaSubarbolRaizId = useOpmStore((s) => s.mapaSubarbolRaizId);
  const mapaCriterioResaltado = useOpmStore((s) => s.mapaCriterioResaltado);
  const toggleMapaPanelFiltros = useOpmStore((s) => s.toggleMapaPanelFiltros);
  const fijarMapaProfundidad = useOpmStore((s) => s.fijarMapaProfundidad);
  const fijarMapaSubarbol = useOpmStore((s) => s.fijarMapaSubarbol);
  const fijarMapaCriterioResaltado = useOpmStore((s) => s.fijarMapaCriterioResaltado);
  const limpiarFiltrosMapa = useOpmStore((s) => s.limpiarFiltrosMapa);

  return {
    mapaPanelFiltrosAbierto,
    mapaPanelEstadisticasAbierto,
    mapaProfundidadMaxima,
    mapaSubarbolRaizId,
    mapaCriterioResaltado,
    toggleMapaPanelFiltros,
    fijarMapaProfundidad,
    fijarMapaSubarbol,
    fijarMapaCriterioResaltado,
    limpiarFiltrosMapa,
  };
}
