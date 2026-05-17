import { useZustandSystemMapControlsPort } from "../ports/zustandSystemMapControlsPort";

export function useToolbarMapaSistemaViewModel() {
  const {
    refrescarVistaMapa,
    mapaAutoRefresh,
    toggleMapaAutoRefresh,
    toggleMapaPanelEstadisticas,
  } = useZustandSystemMapControlsPort();

  return {
    refrescarVistaMapa,
    mapaAutoRefresh,
    toggleMapaAutoRefresh,
    toggleMapaPanelEstadisticas,
  };
}

export type ToolbarMapaSistemaViewModel = ReturnType<typeof useToolbarMapaSistemaViewModel>;
