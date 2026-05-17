import type { OpmStore } from "../../store";

export interface ToolbarChromePort {
  abrirMenuPrincipal: OpmStore["abrirMenuPrincipal"];
  cerrarMenuPrincipal: OpmStore["cerrarMenuPrincipal"];
  menuPrincipalAbierto: OpmStore["menuPrincipalAbierto"];
  abrirDialogoComandos: OpmStore["abrirDialogoComandos"];
}
