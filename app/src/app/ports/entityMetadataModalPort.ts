import type { OpmStore } from "../../store";

export interface EntityMetadataModalPort {
  modelo: OpmStore["modelo"];
  modalImagenAbierto: OpmStore["modalImagenAbierto"];
  modalUrlsAbierto: OpmStore["modalUrlsAbierto"];
  cerrarModalImagen: OpmStore["cerrarModalImagen"];
  editarImagenEntidad: OpmStore["editarImagenEntidad"];
  quitarImagenEntidad: OpmStore["quitarImagenEntidad"];
  cerrarModalUrls: OpmStore["cerrarModalUrls"];
  agregarUrlAEntidad: OpmStore["agregarUrlAEntidad"];
  eliminarUrlDeEntidad: OpmStore["eliminarUrlDeEntidad"];
}
