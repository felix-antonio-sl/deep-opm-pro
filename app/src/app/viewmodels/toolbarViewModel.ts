import { useOpmStore } from "../../store";

export function useToolbarViewModel() {
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);
  const autosalvado = useOpmStore((s) => s.autosalvado);

  return {
    vistaMapaActiva,
    autosalvado,
  };
}

export type ToolbarViewModel = ReturnType<typeof useToolbarViewModel>;
