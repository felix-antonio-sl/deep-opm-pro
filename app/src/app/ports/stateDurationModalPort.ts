import type { OpmStore } from "../../store";

export interface StateDurationModalPort {
  modelo: OpmStore["modelo"];
  modalDuracionAbierto: OpmStore["modalDuracionAbierto"];
  cerrarModalDuracion: OpmStore["cerrarModalDuracion"];
  fijarDuracionEstado: OpmStore["fijarDuracionEstado"];
  quitarDuracionEstado: OpmStore["quitarDuracionEstado"];
}
