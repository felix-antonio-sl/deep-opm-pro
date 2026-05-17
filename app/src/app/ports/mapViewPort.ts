import type { OpmStore } from "../../store";

export interface MapViewPort {
  vistaMapaActiva: OpmStore["vistaMapaActiva"];
  abrirVistaMapa: OpmStore["abrirVistaMapa"];
  cerrarVistaMapa: OpmStore["cerrarVistaMapa"];
}
