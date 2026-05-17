import { useOpmStore } from "../../store";
import type { SystemMapViewportPort } from "./systemMapViewportPort";

export function useZustandSystemMapViewportPort(): SystemMapViewportPort {
  const mapaZoom = useOpmStore((s) => s.mapaZoom);
  const mapaPanX = useOpmStore((s) => s.mapaPanX);
  const mapaPanY = useOpmStore((s) => s.mapaPanY);
  const fijarMapaZoom = useOpmStore((s) => s.fijarMapaZoom);
  const fijarMapaPan = useOpmStore((s) => s.fijarMapaPan);

  return {
    mapaZoom,
    mapaPanX,
    mapaPanY,
    fijarMapaZoom,
    fijarMapaPan,
  };
}
