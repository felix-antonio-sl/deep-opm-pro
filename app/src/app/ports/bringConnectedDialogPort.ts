import type { FamiliaTraerConectados } from "../../canvas/reglasTraer";
import type { OpmStore } from "../../store";

export interface BringConnectedDialogPort {
  abierto: OpmStore["dialogoTraerConectadosAbierto"];
  ultima: readonly FamiliaTraerConectados[] | undefined;
  cerrar: OpmStore["cerrarDialogoTraerConectados"];
  traer: OpmStore["traerConectadosSeleccionado"];
}
