export interface SystemMapViewportPort {
  mapaZoom: number;
  mapaPanX: number;
  mapaPanY: number;
  fijarMapaZoom: (zoom: number) => void;
  fijarMapaPan: (x: number, y: number) => void;
}
