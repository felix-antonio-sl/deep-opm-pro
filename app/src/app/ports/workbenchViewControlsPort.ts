import type { GridConfig } from "../../canvas/grid";
import type { OpmStore } from "../../store";

export interface WorkbenchViewControlsPort {
  abrirDialogoPlantillas: OpmStore["abrirDialogoPlantillas"];
  uiAliasVisibles: OpmStore["uiAliasVisibles"];
  uiDescripcionesVisibles: OpmStore["uiDescripcionesVisibles"];
  toggleAliasVisibles: OpmStore["toggleAliasVisibles"];
  toggleDescripcionesVisibles: OpmStore["toggleDescripcionesVisibles"];
  uiModoImagenGlobal: OpmStore["uiModoImagenGlobal"];
  fijarModoImagenGlobal: OpmStore["fijarModoImagenGlobal"];
  abrirModalImagen: OpmStore["abrirModalImagen"];
  gridConfig: GridConfig;
  toggleGrid: OpmStore["toggleGrid"];
  abrirDialogoConfiguracion: OpmStore["abrirDialogoConfiguracion"];
  aplicarLayoutSugerido: OpmStore["aplicarLayoutSugerido"];
  bibliotecaDockAbierto: OpmStore["bibliotecaDockAbierto"];
  toggleBibliotecaDock: OpmStore["toggleBibliotecaDock"];
  iniciarModoSimulacion: OpmStore["iniciarModoSimulacion"];
}
