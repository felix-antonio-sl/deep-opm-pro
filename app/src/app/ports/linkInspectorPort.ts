import type { OpmStore } from "../../store";

export interface LinkInspectorSessionPort {
  modelo: OpmStore["modelo"];
  opdActivoId: OpmStore["opdActivoId"];
  seleccionados: OpmStore["seleccionados"];
  cambiarOpdActivo: OpmStore["cambiarOpdActivo"];
  abrirInspectorEnlaceDesdeOpl: OpmStore["abrirInspectorEnlaceDesdeOpl"];
}

export interface SelectedLinkPropertiesPort {
  ajustarMultiplicidad: OpmStore["ajustarMultiplicidadSeleccionada"];
  alternarOperadorAbanico: OpmStore["alternarOperadorAbanicoSeleccionado"];
  crearAbanicoDesdeEnlace: OpmStore["crearAbanicoDesdeEnlaceSeleccionado"];
  quitarRamaDeAbanico: OpmStore["quitarRamaDeAbanicoSeleccionado"];
  disolverAbanico: OpmStore["disolverAbanicoSeleccionado"];
  aplicarModificador: OpmStore["aplicarModificadorEnlaceSeleccionado"];
  aplicarSubtipoModificador: OpmStore["aplicarSubtipoModificadorEnlaceSeleccionado"];
  quitarModificador: OpmStore["quitarModificadorEnlaceSeleccionado"];
  definirProbabilidadEvento: OpmStore["definirProbabilidadEventoSeleccionada"];
  definirDemoraInvocacion: OpmStore["definirDemoraInvocacionSeleccionada"];
  definirBackwardTag: OpmStore["definirBackwardTagSeleccionado"];
  definirRequisitosEnlace: OpmStore["definirRequisitosEnlaceSeleccionado"];
  definirTasaEnlace: OpmStore["definirTasaEnlaceSeleccionada"];
  definirTiempoExcepcionEnlace: OpmStore["definirTiempoExcepcionEnlaceSeleccionado"];
  renombrarEtiquetaEnlace: OpmStore["renombrarEtiquetaEnlaceSeleccionado"];
  definirRutaEtiqueta: OpmStore["definirRutaEtiquetaSeleccionada"];
}

export interface SelectedLinkEndpointsPort {
  apuntarExtremo: OpmStore["apuntarExtremoEnlaceSeleccionado"];
  moverPuerto: OpmStore["moverPuertoEnlaceSeleccionado"];
  reanclarEnlaceExternoDerivado: OpmStore["reanclarEnlaceExternoDerivado"];
  volverEnlaceExternoDerivadoAAutomatico: OpmStore["volverEnlaceExternoDerivadoAAutomatico"];
  splitEffect: OpmStore["splitEffectSeleccionado"];
}

export interface StructuralLinkGroupPort {
  cambiarTipoGrupoEstructural: OpmStore["cambiarTipoGrupoEstructuralSeleccionado"];
  fijarOrdenGrupoEstructural: OpmStore["fijarOrdenGrupoEstructuralSeleccionado"];
  actualizarAnclajesSimboloEstructural: OpmStore["actualizarAnclajesSimboloEstructural"];
  resetearAnclajesSimboloEstructural: OpmStore["resetearAnclajesSimboloEstructural"];
  separarGrupoEstructural: OpmStore["separarGrupoEstructuralSeleccionado"];
  volverGrupoEstructuralAutomatico: OpmStore["volverGrupoEstructuralAutomaticoSeleccionado"];
  traerRelacionesEstructuralesFaltantes: OpmStore["traerRelacionesEstructuralesFaltantesSeleccionadas"];
  plegarGrupoEstructural: OpmStore["plegarGrupoEstructuralSeleccionado"];
  plegarCompletoGrupoEstructural: OpmStore["plegarCompletoGrupoEstructuralSeleccionado"];
}

export interface LinkDeletionPort {
  eliminar: OpmStore["eliminarSeleccion"];
}

export interface LinkInspectorPort extends
  LinkInspectorSessionPort,
  SelectedLinkPropertiesPort,
  SelectedLinkEndpointsPort,
  StructuralLinkGroupPort,
  LinkDeletionPort {}
