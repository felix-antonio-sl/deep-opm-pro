import type { OpmStore } from "../../store";

export interface SearchDialogsPort {
  abrirBusquedaCosas: OpmStore["abrirBusquedaCosas"];
  abrirBusquedaGlobal: OpmStore["abrirDialogoBuscarGlobal"];
}
