import { useOpmStore } from "../../store";
import type { SystemMapControlsPort } from "./systemMapControlsPort";

export function useZustandSystemMapControlsPort(): SystemMapControlsPort {
  const refrescarVistaMapa = useOpmStore((s) => s.refrescarVistaMapa);
  const mapaAutoRefresh = useOpmStore((s) => s.mapaAutoRefresh);
  const toggleMapaAutoRefresh = useOpmStore((s) => s.toggleMapaAutoRefresh);
  const toggleMapaPanelEstadisticas = useOpmStore((s) => s.toggleMapaPanelEstadisticas);

  return {
    refrescarVistaMapa,
    mapaAutoRefresh,
    toggleMapaAutoRefresh,
    toggleMapaPanelEstadisticas,
  };
}
