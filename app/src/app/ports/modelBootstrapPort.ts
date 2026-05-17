import type { OpmStore } from "../../store";

export interface ModelBootstrapPort {
  nuevoModelo: OpmStore["nuevoModelo"];
  iniciarAsistente: OpmStore["iniciarAsistente"];
}
