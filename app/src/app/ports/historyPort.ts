import type { OpmStore } from "../../store";

export interface HistoryPort {
  deshacer: OpmStore["deshacer"];
  rehacer: OpmStore["rehacer"];
  puedeDeshacer: OpmStore["puedeDeshacer"];
  puedeRehacer: OpmStore["puedeRehacer"];
}
