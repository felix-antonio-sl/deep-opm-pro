import type { OpmStore } from "../../store";

export interface OplPort {
  modelo: OpmStore["modelo"];
  opdActivoId: OpmStore["opdActivoId"];
  vistaMapaActiva: OpmStore["vistaMapaActiva"];
  seleccionId: OpmStore["seleccionId"];
  enlaceSeleccionId: OpmStore["enlaceSeleccionId"];
  filtroActivo: OpmStore["filtroOplPorSeleccion"];
  hoverOplRef: OpmStore["hoverOplRef"];
  busquedaOpl: OpmStore["busquedaOpl"];
  preferenciasOpl: OpmStore["indice"]["preferenciasUi"];
  seleccionarDesdeOpl: OpmStore["seleccionarDesdeOpl"];
  renombrarEntidadDesdeOpl: OpmStore["renombrarEntidadDesdeOpl"];
  renombrarEstadoDesdeOpl: OpmStore["renombrarEstadoDesdeOpl"];
  abrirInspectorEnlaceDesdeOpl: OpmStore["abrirInspectorEnlaceDesdeOpl"];
  aplicarEdicionOplLibre: OpmStore["aplicarEdicionOplLibre"];
  fijarFiltroOplPorSeleccion: OpmStore["fijarFiltroOplPorSeleccion"];
  fijarHoverOpl: OpmStore["fijarHoverOpl"];
  buscarEnPanelOpl: OpmStore["buscarEnPanelOpl"];
  alternarNumeracionOpl: OpmStore["alternarNumeracionOpl"];
  minimizarOpl: OpmStore["minimizarOpl"];
  restaurarOpl: OpmStore["restaurarOpl"];
  alternarBloqueOplContraido: OpmStore["alternarBloqueOplContraido"];
  mostrarPlaceholderAiOpl: OpmStore["mostrarPlaceholderAiOpl"];
  copiarOplActualAlPortapapeles: OpmStore["copiarOplActualAlPortapapeles"];
  exportarOplActualHtml: OpmStore["exportarOplActualHtml"];
}
