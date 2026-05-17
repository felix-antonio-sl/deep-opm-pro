import { useOpmStore } from "../../store";
import type { SystemMapDataPort } from "./systemMapDataPort";

export function useZustandSystemMapDataPort(): SystemMapDataPort {
  const descriptorBase = useOpmStore((s) => s.descriptorMapaCache);
  const descriptor = useOpmStore((s) => s.descriptorMapaFiltrado());
  const estadisticas = useOpmStore((s) => s.estadisticasModelo());
  const saltarAOpdDesdeMapa = useOpmStore((s) => s.saltarAOpdDesdeMapa);

  return {
    descriptorBase,
    descriptor,
    estadisticas,
    saltarAOpdDesdeMapa,
  };
}
