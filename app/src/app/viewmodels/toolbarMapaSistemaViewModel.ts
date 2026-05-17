import { useOpmStore } from "../../store";

export function useToolbarMapaSistemaViewModel() {
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

export type ToolbarMapaSistemaViewModel = ReturnType<typeof useToolbarMapaSistemaViewModel>;
