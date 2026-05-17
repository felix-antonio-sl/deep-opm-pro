import { useZustandSessionTabsPort } from "../ports/zustandSessionTabsPort";

export function useBarraPestanasViewModel() {
  const {
    pestanas,
    activa,
    abrirPestanaNueva,
    cambiarPestanaActiva,
    cerrarPestana,
    reordenarPestanas,
    guardarLocal,
  } = useZustandSessionTabsPort();

  return {
    pestanas,
    activa,
    abrirPestanaNueva,
    cambiarPestanaActiva,
    cerrarPestana,
    reordenarPestanas,
    guardarLocal,
  };
}

export type BarraPestanasViewModel = ReturnType<typeof useBarraPestanasViewModel>;
