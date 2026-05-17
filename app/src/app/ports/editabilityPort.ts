import type { OpmStore } from "../../store";

export interface EditabilityPort {
  readOnly: OpmStore["readOnly"];
}
