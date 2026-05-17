import type { OpmStore } from "../../store";

export interface SessionMessagePort {
  mensaje: OpmStore["mensaje"];
  limpiarMensaje: OpmStore["limpiarMensaje"];
}
