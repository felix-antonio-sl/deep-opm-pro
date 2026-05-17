import type { OpmStore } from "../../store";

export interface SystemMapViewportPort {
  mapaZoom: OpmStore["mapaZoom"];
  mapaPanX: OpmStore["mapaPanX"];
  mapaPanY: OpmStore["mapaPanY"];
  fijarMapaZoom: OpmStore["fijarMapaZoom"];
  fijarMapaPan: OpmStore["fijarMapaPan"];
}
