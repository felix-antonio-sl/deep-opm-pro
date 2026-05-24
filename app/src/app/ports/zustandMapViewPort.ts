import { useOpmStore } from "../../store";
import { APP_FEATURES } from "../features";
import type { MapViewPort } from "./mapViewPort";

export function useZustandMapViewPort(): MapViewPort {
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);
  const abrirVistaMapa = useOpmStore((s) => s.abrirVistaMapa);
  const cerrarVistaMapa = useOpmStore((s) => s.cerrarVistaMapa);

  return {
    vistaMapaActiva: APP_FEATURES.mapaSistema ? vistaMapaActiva : false,
    abrirVistaMapa: APP_FEATURES.mapaSistema ? abrirVistaMapa : () => {},
    cerrarVistaMapa,
  };
}
