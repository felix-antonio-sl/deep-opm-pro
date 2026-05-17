import { useOpmStore } from "../../store";
import type { MapViewPort } from "./mapViewPort";

export function useZustandMapViewPort(): MapViewPort {
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);
  const abrirVistaMapa = useOpmStore((s) => s.abrirVistaMapa);
  const cerrarVistaMapa = useOpmStore((s) => s.cerrarVistaMapa);

  return {
    vistaMapaActiva,
    abrirVistaMapa,
    cerrarVistaMapa,
  };
}
