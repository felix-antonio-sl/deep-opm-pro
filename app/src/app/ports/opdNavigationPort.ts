import type { OpmStore } from "../../store";

export interface OpdNavigationPort {
  modelo: OpmStore["modelo"];
  opdActivoId: OpmStore["opdActivoId"];
  cambiarOpdActivo: OpmStore["cambiarOpdActivo"];
}
