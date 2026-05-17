import type { OpmStore } from "../../store";

export interface LinkContextActionsPort {
  copiarEstiloEnlaceAlPortapapeles: OpmStore["copiarEstiloEnlaceAlPortapapeles"];
  pegarEstiloEnlaceDesdePortapapeles: OpmStore["pegarEstiloEnlaceDesdePortapapeles"];
  enlaceEstiloPortapapeles: OpmStore["enlaceEstiloPortapapeles"];
  borrarEnlacesEnLote: OpmStore["borrarEnlacesEnLote"];
}
