import type { OpmStore } from "../../store";

export interface AutosavePort {
  autosalvado: OpmStore["autosalvado"];
  iniciarAutosalvado: OpmStore["iniciarAutosalvado"];
  detenerAutosalvado: OpmStore["detenerAutosalvado"];
}
