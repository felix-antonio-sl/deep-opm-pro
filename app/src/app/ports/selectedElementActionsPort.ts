import type { OpmStore } from "../../store";

export interface SelectedElementActionsPort {
  agregarEstadoSmart: OpmStore["agregarEstadoSmart"];
  descomponerSeleccionada: OpmStore["descomponerSeleccionada"];
  desplegarSeleccionada: OpmStore["desplegarSeleccionada"];
  abrirModalImagen: OpmStore["abrirModalImagen"];
}
