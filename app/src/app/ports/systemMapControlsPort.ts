import type { OpmStore } from "../../store";

export interface SystemMapControlsPort {
  refrescarVistaMapa: OpmStore["refrescarVistaMapa"];
  mapaAutoRefresh: OpmStore["mapaAutoRefresh"];
  toggleMapaAutoRefresh: OpmStore["toggleMapaAutoRefresh"];
  toggleMapaPanelEstadisticas: OpmStore["toggleMapaPanelEstadisticas"];
}
