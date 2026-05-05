import { describe, expect, test } from "bun:test";
import { LINK_ASSETS } from "../linkAssets";
import { marcadorDestino, marcadorFuente, markerAttrs } from "./markers";

describe("composer markers", () => {
  test("resuelve markers procedimentales desde assets canonicos", () => {
    expect(marcadorDestino("agente")).toEqual(LINK_ASSETS.procedural.agente.marker);
    expect(marcadorDestino("instrumento")).toEqual(LINK_ASSETS.procedural.instrumento.marker);
    expect(marcadorFuente("efecto")).toEqual(LINK_ASSETS.procedural.efecto.marker);
    expect(marcadorFuente("invocacion")).toEqual(LINK_ASSETS.procedural.invocacion.marker);
  });

  test("clona attrs de marker sin mutar el asset base", () => {
    const marker = markerAttrs(LINK_ASSETS.procedural.consumo.marker);
    expect(marker).toEqual(LINK_ASSETS.procedural.consumo.marker);
    expect(marker).not.toBe(LINK_ASSETS.procedural.consumo.marker);
  });
});
