import type { OpmStore } from "../../store";

export interface SelectionPort {
  seleccionId: OpmStore["seleccionId"];
  seleccionados: OpmStore["seleccionados"];
  enlaceSeleccionId: OpmStore["enlaceSeleccionId"];
  idsResaltadosTemporales: OpmStore["idsResaltadosTemporales"];
  seleccionarEntidad: OpmStore["seleccionarEntidad"];
  seleccionarPartePlegada: OpmStore["seleccionarPartePlegada"];
  seleccionarEstadoComoExtremo: OpmStore["seleccionarEstadoComoExtremo"];
  seleccionarEnlace: OpmStore["seleccionarEnlace"];
  seleccionarGrupoEstructural: OpmStore["seleccionarGrupoEstructural"];
  setSeleccion: OpmStore["setSeleccion"];
  agregarASeleccion: OpmStore["agregarASeleccion"];
  toggleSeleccion: OpmStore["toggleSeleccion"];
  vaciarSeleccion: OpmStore["vaciarSeleccion"];
}
