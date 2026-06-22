import type { OpmStore } from "../../store";

/**
 * Puerto del modo pizarra / bosquejo (D7.2). Expone el estado y las acciones de
 * la capa de bosquejo a la UI/render sin acoplarlos al store concreto. La
 * selección de boceto (`bocetoSeleccionadoId`) viaja por aquí — JAMÁS por el
 * trío sellado de selección OPM.
 */
export interface PizarraPort {
  modoPizarra: OpmStore["modoPizarra"];
  herramientaPizarra: OpmStore["herramientaPizarra"];
  bocetoSeleccionadoId: OpmStore["bocetoSeleccionadoId"];
  activar: OpmStore["activarModoPizarra"];
  salir: OpmStore["salirModoPizarra"];
  elegirHerramienta: OpmStore["elegirHerramientaPizarra"];
  agregarBoceto: OpmStore["agregarBocetoEnOpd"];
  moverBoceto: OpmStore["moverBocetoActual"];
  editarBoceto: OpmStore["editarBocetoActual"];
  eliminarBoceto: OpmStore["eliminarBocetoActual"];
  seleccionarBoceto: OpmStore["seleccionarBoceto"];
  promoverBoceto: OpmStore["promoverBocetoActual"];
}
