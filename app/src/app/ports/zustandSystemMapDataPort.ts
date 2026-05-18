import { useMemo } from "preact/hooks";
import { useOpmStore } from "../../store";
import { descriptorMapaFiltrado, estadisticasModelo } from "../../store/mapaSelectors";
import type { SystemMapDataPort } from "./systemMapDataPort";

export function useZustandSystemMapDataPort(): SystemMapDataPort {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const descriptorBase = useOpmStore((s) => s.descriptorMapaCache);
  const mapaSubarbolRaizId = useOpmStore((s) => s.mapaSubarbolRaizId);
  const mapaProfundidadMaxima = useOpmStore((s) => s.mapaProfundidadMaxima);
  const mapaCriterioResaltado = useOpmStore((s) => s.mapaCriterioResaltado);
  const mapaUltimoVisitadoOpdId = useOpmStore((s) => s.mapaUltimoVisitadoOpdId);
  const descriptor = useMemo(
    () => descriptorMapaFiltrado({
      modelo,
      descriptorMapaCache: descriptorBase,
      mapaSubarbolRaizId,
      mapaProfundidadMaxima,
      mapaCriterioResaltado,
      opdActivoId,
      mapaUltimoVisitadoOpdId,
    }),
    [modelo, descriptorBase, mapaSubarbolRaizId, mapaProfundidadMaxima, mapaCriterioResaltado, opdActivoId, mapaUltimoVisitadoOpdId],
  );
  const estadisticas = useMemo(() => estadisticasModelo(modelo), [modelo]);
  const saltarAOpdDesdeMapa = useOpmStore((s) => s.saltarAOpdDesdeMapa);

  return {
    descriptorBase,
    descriptor,
    estadisticas,
    saltarAOpdDesdeMapa,
  };
}
