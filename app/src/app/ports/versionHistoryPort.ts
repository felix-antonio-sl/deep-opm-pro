import type { OpmStore } from "../../store";

export interface VersionHistoryPort {
  abierto: OpmStore["dialogoVersionesAbierto"];
  cerrar: OpmStore["cerrarDialogoVersiones"];
  modelos: OpmStore["modelosGuardados"];
  modeloPersistidoId: OpmStore["modeloPersistidoId"];
  crearVersionAhora: OpmStore["crearVersionAhora"];
  restaurar: OpmStore["restaurarVersionComoCopia"];
  eliminar: OpmStore["eliminarVersionPorId"];
  mostrarVersiones: OpmStore["mostrarVersiones"];
  toggleMostrarVersiones: OpmStore["toggleMostrarVersiones"];
}
