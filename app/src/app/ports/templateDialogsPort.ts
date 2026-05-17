import type { OpmStore } from "../../store";

export interface TemplateDialogsPort {
  catalogoAbierto: OpmStore["dialogoPlantillasAbierto"];
  guardarAbierto: OpmStore["dialogoGuardarPlantillaAbierto"];
  modeloNombre: OpmStore["modelo"]["nombre"];
  plantillas: OpmStore["plantillasGuardadas"];
  cerrar: OpmStore["cerrarDialogoPlantillas"];
  abrirDialogoGuardarPlantilla: OpmStore["abrirDialogoGuardarPlantilla"];
  cerrarGuardar: OpmStore["cerrarDialogoGuardarPlantilla"];
  guardar: OpmStore["guardarComoPlantillaConfirmar"];
  insertar: OpmStore["insertarPlantillaEnOpdActivo"];
}
