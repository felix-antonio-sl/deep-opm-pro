import type { OpmStore } from "../../store";

export interface SearchDialogsPort {
  abrirBusquedaCosas: OpmStore["abrirBusquedaCosas"];
  abrirBusquedaGlobal: OpmStore["abrirDialogoBuscarGlobal"];
}

export interface ModelSearchDialogPort {
  abierto: OpmStore["busquedaCosasAbierta"];
  query: OpmStore["busquedaCosasQuery"];
  filtro: OpmStore["busquedaCosasFiltro"];
  modelo: OpmStore["modelo"];
  cerrar: OpmStore["cerrarBusquedaCosas"];
  fijarQuery: OpmStore["fijarBusquedaCosasQuery"];
  fijarFiltro: OpmStore["fijarBusquedaCosasFiltro"];
  saltar: OpmStore["saltarAResultadoBusqueda"];
}

export interface WorkspaceSearchDialogPort {
  open: OpmStore["dialogoBuscarGlobalAbierto"];
  query: OpmStore["busquedaGlobal"]["query"];
  resultados: OpmStore["busquedaGlobal"]["resultados"];
  cerrar: OpmStore["cerrarDialogoBuscarGlobal"];
  fijarQuery: OpmStore["fijarBusquedaGlobalQuery"];
  ejecutar: OpmStore["ejecutarBusquedaGlobal"];
  abrirResultado: OpmStore["abrirResultadoBusquedaGlobal"];
}
