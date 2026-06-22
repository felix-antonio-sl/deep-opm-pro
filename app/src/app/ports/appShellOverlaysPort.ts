import type { OpmStore } from "../../store";

export interface AppShellOverlaysPort {
  dialogoGuardarComoAbierto: OpmStore["dialogoGuardarComoAbierto"];
  dialogoConfiguracionAbierto: OpmStore["dialogoConfiguracionAbierto"];
  dialogoSimulacionNumericaAbierto: OpmStore["dialogoSimulacionNumericaAbierto"];
  dialogoOntologiaAbierto: OpmStore["dialogoOntologiaAbierto"];
  dialogoRequisitoAbierto: boolean;
  dialogoSubmodeloAbierto: OpmStore["dialogoSubmodeloAbierto"];
  dialogoComposicionAbierto: OpmStore["dialogoComposicionAbierto"];
  vitrinaEstereotiposAbierta: OpmStore["vitrinaEstereotiposAbierta"];
  dialogoImportarExportarJsonAbierto: OpmStore["dialogoImportarExportarJsonAbierto"];
  cerrarDialogoImportarExportarJson: OpmStore["cerrarDialogoImportarExportarJson"];
  dialogoCargarModeloAbierto: OpmStore["dialogoCargarModeloAbierto"];
  dialogoBuscarGlobalAbierto: OpmStore["dialogoBuscarGlobalAbierto"];
  busquedaCosasAbierta: OpmStore["busquedaCosasAbierta"];
  dialogoVersionesAbierto: boolean;
  modalUrlsAbierto: boolean;
  modalImagenAbierto: boolean;
  modalDuracionAbierto: boolean;
  tablaEnlacesAbierta: OpmStore["tablaEnlacesAbierta"];
  gestionArbolAbierta: OpmStore["gestionArbolAbierta"];
  cheatsheetAtajosAbierto: OpmStore["cheatsheetAtajosAbierto"];
  cerrarCheatsheetAtajos: OpmStore["cerrarCheatsheetAtajos"];
  dialogoComandosAbierto: OpmStore["dialogoComandosAbierto"];
  cerrarDialogoComandos: OpmStore["cerrarDialogoComandos"];
}
