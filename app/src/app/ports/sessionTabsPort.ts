import type { OpmStore } from "../../store";

export interface SessionTabsPort {
  pestanas: OpmStore["pestanasAbiertas"];
  activa: OpmStore["pestanaActivaId"];
  abrirPestanaNueva: OpmStore["abrirPestanaNueva"];
  cambiarPestanaActiva: OpmStore["cambiarPestanaActiva"];
  cerrarPestana: OpmStore["cerrarPestana"];
  reordenarPestanas: OpmStore["reordenarPestanas"];
  guardarLocal: OpmStore["guardarLocal"];
}
