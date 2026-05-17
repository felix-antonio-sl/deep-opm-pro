import type { Id } from "../../modelo/tipos";
import type { OpmStore } from "../../store";

export interface EntityInspectorShellPort {
  modelo: OpmStore["modelo"];
  opdActivoId: OpmStore["opdActivoId"];
  tabActivo: OpmStore["tabInspectorEntidadActivo"];
  seleccionados: OpmStore["seleccionados"];
  cambiarTab: OpmStore["cambiarTabInspectorEntidad"];
  cambiarOpdActivo: OpmStore["cambiarOpdActivo"];
  navegarAEnlace: OpmStore["navegarAEnlaceDesdeTabla"];
}

export interface EntityInspectorSemanticsPort {
  renombrar: OpmStore["renombrarSeleccionada"];
  fijarEsencia: OpmStore["fijarEsenciaSeleccionada"];
  fijarAfiliacion: OpmStore["fijarAfiliacionSeleccionada"];
  editarAliasEntidad: OpmStore["editarAliasEntidad"];
  editarUnidadEntidad: OpmStore["editarUnidadEntidad"];
  editarDescripcionEntidad: OpmStore["editarDescripcionEntidad"];
  asignarValorAtributo: OpmStore["asignarValorAtributoSeleccionado"];
  cambiarTipoValorAtributo: OpmStore["cambiarTipoValorAtributoSeleccionado"];
  configurarSimulacionAtributo: OpmStore["configurarSimulacionAtributoSeleccionado"];
}

export interface EntityInspectorMetadataPort {
  abrirModalUrls: OpmStore["abrirModalUrls"];
  abrirModalImagen: OpmStore["abrirModalImagen"];
  quitarImagenEntidad: OpmStore["quitarImagenEntidad"];
}

export interface EntityInspectorStylePort {
  aplicarEstilo: OpmStore["aplicarEstiloSeleccionado"];
  resetearEstilo: OpmStore["resetearEstiloSeleccionado"];
  aplicarEstiloTexto: OpmStore["aplicarEstiloTextoAccion"];
  resetearEstiloTexto: OpmStore["resetEstiloTextoAccion"];
  redimensionarSeleccionada: OpmStore["redimensionarSeleccionada"];
  ajustarSeleccionadaAlTexto: OpmStore["ajustarSeleccionadaAlTexto"];
  volverSeleccionadaAAuto: OpmStore["volverSeleccionadaAAuto"];
  alternarModoTamanoSeleccionado: OpmStore["alternarModoTamanoSeleccionado"];
  aplicarEstiloASeleccion: OpmStore["aplicarEstiloASeleccion"];
}

export interface EntityInspectorRefinementPort {
  reasignarEnlaceExternoManual: OpmStore["reasignarEnlaceExternoManual"];
  crearAutoInvocacion: OpmStore["crearAutoInvocacionSeleccionada"];
  cambiarModoPlegado: OpmStore["cambiarModoPlegadoSeleccionado"];
  cambiarOrdenPartes: OpmStore["cambiarOrdenPartesSeleccionado"];
  extraerParte: OpmStore["extraerParteDePlegado"];
  extraerTodasLasPartes: OpmStore["extraerTodasLasPartesSeleccionadas"];
  reinsertarParte: OpmStore["reinsertarParteExtraidaSeleccionada"];
  quitarSemiplegadoEstructural: OpmStore["quitarSemiplegadoEstructuralSeleccionado"];
  quitarPlegadoCompletoEstructural: OpmStore["quitarPlegadoCompletoEstructuralSeleccionado"];
  traerAgregacionesInzoom: OpmStore["traerAgregacionesInzoomFaltantesSeleccionadas"];
}

export interface ObjectStatesInspectorPort {
  eliminarEstado: OpmStore["eliminarEstado"];
  quitarEstados: OpmStore["quitarEstadosObjetoSeleccionado"];
  renombrarEstado: OpmStore["renombrarEstadoSeleccionado"];
  designarEstadoComo: OpmStore["designarEstadoComo"];
  quitarDesignacion: OpmStore["quitarDesignacionEstado"];
  suprimirEstadoPorId: OpmStore["suprimirEstadoPorId"];
  restaurarEstadoPorId: OpmStore["restaurarEstadoPorId"];
  abrirModalDuracion: OpmStore["abrirModalDuracion"];
  fijarLayoutEstadosEntidad: OpmStore["fijarLayoutEstadosEntidad"];
  crearEstadosConNombres: (nombres: string[]) => void;
}

export type EstadoRenombrable = { id: Id; nombre: string };
