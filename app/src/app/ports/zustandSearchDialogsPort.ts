import { useOpmStore } from "../../store";
import type { SearchDialogsPort } from "./searchDialogsPort";

export function useZustandSearchDialogsPort(): SearchDialogsPort {
  const abrirBusquedaCosas = useOpmStore((s) => s.abrirBusquedaCosas);
  const abrirBusquedaGlobal = useOpmStore((s) => s.abrirDialogoBuscarGlobal);

  return {
    abrirBusquedaCosas,
    abrirBusquedaGlobal,
  };
}
