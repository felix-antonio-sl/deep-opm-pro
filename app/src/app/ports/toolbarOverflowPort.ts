import type { OpmStore } from "../../store";

export interface ToolbarOverflowPort {
  abierto: OpmStore["toolbarMasAbierto"];
  fijarAbierto: OpmStore["fijarToolbarMasAbierto"];
}
