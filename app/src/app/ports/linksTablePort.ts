import type { Id } from "../../modelo/tipos";
import type { OpmStore } from "../../store";

export interface LinksTablePort {
  abierta: OpmStore["tablaEnlacesAbierta"];
  cerrar: OpmStore["cerrarTablaEnlaces"];
  modelo: OpmStore["modelo"];
  opdActivoId: OpmStore["opdActivoId"];
  filtroTipo: OpmStore["tablaEnlacesFiltroTipo"];
  fijarFiltroTipo: OpmStore["fijarFiltroTablaEnlaces"];
  ordenColumna: OpmStore["tablaEnlacesOrdenColumna"];
  ordenDireccion: OpmStore["tablaEnlacesOrdenDireccion"];
  fijarOrden: OpmStore["fijarOrdenTablaEnlaces"];
  navegar: OpmStore["navegarAEnlaceDesdeTabla"];
  irAExtremo: OpmStore["irAExtremoEnlaceTabla"];
  eliminarEnlace: OpmStore["eliminarEnlaceDesdeTabla"];
  cambiarOpdActivo: OpmStore["cambiarOpdActivo"];
  resaltarTemporalmente: OpmStore["resaltarTemporalmente"];
  enlaceSeleccionId: OpmStore["enlaceSeleccionId"];
}

export interface LinksTableEditPort {
  renombrarEtiqueta: (enlaceId: Id, etiqueta: string) => void;
  fijarMultiplicidad: (enlaceId: Id, lado: "origen" | "destino", valor: string) => void;
}
