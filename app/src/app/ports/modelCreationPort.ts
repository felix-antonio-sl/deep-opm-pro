import type { OpmStore } from "../../store";

export interface ModelCreationPort {
  crearObjeto: OpmStore["crearObjetoDemo"];
  crearProceso: OpmStore["crearProcesoDemo"];
  crearAtributoNumerico: OpmStore["crearAtributoEnObjetoSeleccionado"];
  fijarModoCreacion: OpmStore["fijarModoCreacion"];
  modoCreacion: OpmStore["modoCreacion"];
  nuevaCosaPendiente: OpmStore["nuevaCosaPendiente"];
  confirmarNombreNuevaCosa: OpmStore["confirmarNombreNuevaCosa"];
  descartarNuevaCosaPendiente: OpmStore["descartarNuevaCosaPendiente"];
}
