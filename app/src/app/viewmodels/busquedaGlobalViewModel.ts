import { useZustandWorkspaceSearchDialogPort } from "../ports/zustandSearchDialogsPort";

export function useBusquedaGlobalViewModel() {
  const { open, cerrar, query, resultados, fijarQuery, ejecutar, abrirResultado } = useZustandWorkspaceSearchDialogPort();

  return {
    open,
    cerrar,
    query,
    resultados,
    fijarQuery,
    ejecutar,
    abrirResultado,
  };
}

export type BusquedaGlobalViewModel = ReturnType<typeof useBusquedaGlobalViewModel>;
