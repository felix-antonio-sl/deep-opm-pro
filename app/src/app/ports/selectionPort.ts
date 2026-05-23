import type { OpmStore } from "../../store";

export interface SelectionPort {
  seleccionId: OpmStore["seleccionId"];
  seleccionados: OpmStore["seleccionados"];
  enlaceSeleccionId: OpmStore["enlaceSeleccionId"];
  /**
   * Tercer ciudadano del coproducto de selección. Mismo invariante de
   * exclusividad mutua sellado por `setSeleccionPorTipo`.
   * Spec: docs/superpowers/specs/2026-05-23-estados-ciudadania-primera-clase-design.md §4.
   */
  estadoSeleccionId: OpmStore["estadoSeleccionId"];
  idsResaltadosTemporales: OpmStore["idsResaltadosTemporales"];
  seleccionarEntidad: OpmStore["seleccionarEntidad"];
  seleccionarPartePlegada: OpmStore["seleccionarPartePlegada"];
  seleccionarEstadoComoExtremo: OpmStore["seleccionarEstadoComoExtremo"];
  seleccionarEnlace: OpmStore["seleccionarEnlace"];
  seleccionarGrupoEstructural: OpmStore["seleccionarGrupoEstructural"];
  setSeleccion: OpmStore["setSeleccion"];
  setSeleccionPorTipo: OpmStore["setSeleccionPorTipo"];
  agregarASeleccion: OpmStore["agregarASeleccion"];
  toggleSeleccion: OpmStore["toggleSeleccion"];
  vaciarSeleccion: OpmStore["vaciarSeleccion"];
  seleccionarEstado: OpmStore["seleccionarEstado"];
  agregarEstadoASeleccion: OpmStore["agregarEstadoASeleccion"];
  toggleSeleccionEstado: OpmStore["toggleSeleccionEstado"];
}
