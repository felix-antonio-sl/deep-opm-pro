import type { OpmStore } from "../../store";

export interface InteractionModePort {
  modoEnlace: OpmStore["modoEnlace"];
  modoSeleccion: OpmStore["modoSeleccion"];
}
