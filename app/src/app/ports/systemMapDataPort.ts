import type { DescriptorMapa, EstadisticasModelo } from "../../canvas/mapaSistema";
import type { Id } from "../../modelo/tipos";

export interface SystemMapDataPort {
  descriptorBase: DescriptorMapa | null;
  descriptor: DescriptorMapa;
  estadisticas: EstadisticasModelo;
  saltarAOpdDesdeMapa: (opdId: Id) => void;
}
