import type { OpmStore } from "../../store";

export interface AppShellWorkbenchPort {
  vistaMapaActiva: OpmStore["vistaMapaActiva"];
  anchoPanelArbol: OpmStore["anchoPanelArbol"];
  anchoPanelInspector: OpmStore["anchoPanelInspector"];
  preferenciasOpl: OpmStore["indice"]["preferenciasUi"];
  modelo: OpmStore["modelo"];
  opdActivoId: OpmStore["opdActivoId"];
  fijarAnchoPanelArbol: OpmStore["fijarAnchoPanelArbol"];
  fijarAnchoPanelInspector: OpmStore["fijarAnchoPanelInspector"];
  modeloPersistidoId: OpmStore["modeloPersistidoId"];
  pantallaInicioCerrada: OpmStore["pantallaInicioCerrada"];
  seleccionIdOpl: OpmStore["seleccionId"];
  enlaceSeleccionIdOpl: OpmStore["enlaceSeleccionId"];
  vistaMobileActiva: OpmStore["vistaMobileActiva"];
  cambiarOpdActivo: OpmStore["cambiarOpdActivo"];
  modoSimulacionActivo: boolean;
  modoEnlaceActivo: boolean;
  modoCreacionActivo: boolean;
}
