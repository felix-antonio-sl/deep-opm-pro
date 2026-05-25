import type { GridConfig } from "../../canvas/grid";
import type { EsenciaVisibilidad } from "../../opl/opciones";
import type { OpmStore } from "../../store";

export interface ConfigurationDialogPort {
  abierto: OpmStore["dialogoConfiguracionAbierto"];
  cerrar: OpmStore["cerrarDialogoConfiguracion"];
  modeloNombre: OpmStore["modelo"]["nombre"];
  modeloPersistidoId: OpmStore["modeloPersistidoId"];
  renombrarModeloActual: OpmStore["renombrarModeloActual"];
  gridConfig: GridConfig;
  fijarGridConfig: OpmStore["fijarGridConfig"];
  oplEsenciaVisibilidad: EsenciaVisibilidad;
  fijarOplEsenciaVisibilidad: OpmStore["fijarOplEsenciaVisibilidad"];
}
