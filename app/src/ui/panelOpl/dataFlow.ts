export type EstadoIfmlPanelOpl = "activo" | "minimizado" | "no-disponible-mapa";

export const PANEL_OPL_IFML = {
  viewComponent: "PanelOpl",
  pattern: "CN-MMD",
  master: "Canvas",
  detailRole: "OPL",
  detailSiblings: "Inspector,OPL,ArbolOpd",
  dataFlow: "Canvas->OPL",
} as const;

export function atributosIfmlPanelOpl(estado: EstadoIfmlPanelOpl): Record<`data-${string}`, string> {
  return {
    "data-ifml-view-component": PANEL_OPL_IFML.viewComponent,
    "data-ifml-pattern": PANEL_OPL_IFML.pattern,
    "data-ifml-master": PANEL_OPL_IFML.master,
    "data-ifml-detail-role": PANEL_OPL_IFML.detailRole,
    "data-ifml-detail-siblings": PANEL_OPL_IFML.detailSiblings,
    "data-ifml-dataflow": PANEL_OPL_IFML.dataFlow,
    "data-ifml-state": estado,
  };
}
