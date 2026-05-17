import type { OpmStore } from "../../store";

export interface ModelCommandPort {
  cambiarOpdActivo: OpmStore["cambiarOpdActivo"];
  moverAparienciaConPuertos: OpmStore["moverAparienciaConPuertos"];
  actualizarPosicionSimboloEstructural: OpmStore["actualizarPosicionSimboloEstructural"];
  actualizarAnclajesSimboloEstructural: OpmStore["actualizarAnclajesSimboloEstructural"];
  cambiarModoPlegadoApariencia: OpmStore["cambiarModoPlegadoApariencia"];
  extraerParteDePlegado: OpmStore["extraerParteDePlegado"];
  actualizarVerticesEnlace: OpmStore["actualizarVerticesEnlace"];
  actualizarPosicionLabelEnlace: OpmStore["actualizarPosicionLabelEnlace"];
  crearEntidadEnCanvas: OpmStore["crearEntidadEnCanvas"];
  crearAparienciaEntidadEnCanvas: OpmStore["crearAparienciaEntidadEnCanvas"];
  crearEnlaceEntreEntidades: OpmStore["crearEnlaceEntreEntidades"];
  elegirTipoEnlace: OpmStore["elegirTipoEnlace"];
  iniciarConexionDesdeApariencia: OpmStore["iniciarConexionDesdeApariencia"];
  cancelarEnlace: OpmStore["cancelarEnlace"];
  redimensionarAparienciaEnCanvas: OpmStore["redimensionarAparienciaEnCanvas"];
  reanclarExtremoAccion: OpmStore["reanclarExtremoAccion"];
  renombrarEntidadDesdeOpl: OpmStore["renombrarEntidadDesdeOpl"];
}
