import type { OpmStore } from "../../store";

export interface AppShellWorkbenchPort {
  vistaMapaActiva: OpmStore["vistaMapaActiva"];
  anchoPanelArbol: OpmStore["anchoPanelArbol"];
  anchoPanelInspector: OpmStore["anchoPanelInspector"];
  anchoPanelOpleft: OpmStore["anchoPanelOpleft"];
  panelOpleftAbierto: OpmStore["panelOpleftAbierto"];
  panelInspectorAbierto: OpmStore["panelInspectorAbierto"];
  uiSoloCanvas: OpmStore["uiSoloCanvas"];
  preferenciasOpl: OpmStore["indice"]["preferenciasUi"];
  modelo: OpmStore["modelo"];
  opdActivoId: OpmStore["opdActivoId"];
  fijarAnchoPanelArbol: OpmStore["fijarAnchoPanelArbol"];
  fijarAnchoPanelInspector: OpmStore["fijarAnchoPanelInspector"];
  fijarAnchoPanelOpleft: OpmStore["fijarAnchoPanelOpleft"];
  togglePanelOpleft: OpmStore["togglePanelOpleft"];
  togglePanelInspector: OpmStore["togglePanelInspector"];
  toggleSoloCanvas: OpmStore["toggleSoloCanvas"];
  modeloPersistidoId: OpmStore["modeloPersistidoId"];
  seleccionIdOpl: OpmStore["seleccionId"];
  enlaceSeleccionIdOpl: OpmStore["enlaceSeleccionId"];
  vistaMobileActiva: OpmStore["vistaMobileActiva"];
  cambiarOpdActivo: OpmStore["cambiarOpdActivo"];
  modoSimulacionActivo: boolean;
  modoEnlaceActivo: boolean;
  modoCreacionActivo: boolean;
}
