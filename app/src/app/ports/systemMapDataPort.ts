import type { OpmStore } from "../../store";

export interface SystemMapDataPort {
  descriptorBase: OpmStore["descriptorMapaCache"];
  descriptor: ReturnType<OpmStore["descriptorMapaFiltrado"]>;
  estadisticas: ReturnType<OpmStore["estadisticasModelo"]>;
  saltarAOpdDesdeMapa: OpmStore["saltarAOpdDesdeMapa"];
}
