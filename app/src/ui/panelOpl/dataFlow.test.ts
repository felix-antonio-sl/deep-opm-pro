import { describe, expect, test } from "bun:test";
import { atributosIfmlPanelOpl, PANEL_OPL_IFML, type EstadoIfmlPanelOpl } from "./dataFlow";

describe("PanelOpl IFML DataFlow", () => {
  test("declara Canvas como master y OPL como detail multidetail", () => {
    expect(PANEL_OPL_IFML).toEqual({
      viewComponent: "PanelOpl",
      pattern: "CN-MMD",
      master: "Canvas",
      detailRole: "OPL",
      detailSiblings: "Inspector,OPL,ArbolOpd",
      dataFlow: "Canvas->OPL",
    });
  });

  test("expone atributos data-ifml estables por estado del panel", () => {
    const estados: EstadoIfmlPanelOpl[] = ["activo", "minimizado", "no-disponible-mapa"];
    for (const estado of estados) {
      expect(atributosIfmlPanelOpl(estado)).toEqual({
        "data-ifml-view-component": "PanelOpl",
        "data-ifml-pattern": "CN-MMD",
        "data-ifml-master": "Canvas",
        "data-ifml-detail-role": "OPL",
        "data-ifml-detail-siblings": "Inspector,OPL,ArbolOpd",
        "data-ifml-dataflow": "Canvas->OPL",
        "data-ifml-state": estado,
      });
    }
  });
});
