import type { GridConfig } from "../../canvas/grid";
import type { OpmStore } from "../../store";

export interface ConfigurationDialogPort {
  abierto: OpmStore["dialogoConfiguracionAbierto"];
  cerrar: OpmStore["cerrarDialogoConfiguracion"];
  modeloNombre: OpmStore["modelo"]["nombre"];
  modeloPersistidoId: OpmStore["modeloPersistidoId"];
  renombrarModeloActual: OpmStore["renombrarModeloActual"];
  gridConfig: GridConfig;
  fijarGridConfig: OpmStore["fijarGridConfig"];
}
