import { describe, expect, test } from "bun:test";
import { LINK_ASSETS } from "../linkAssets";
import { etiquetaBadgeModificadorCanonico, marcadorDestino, marcadorFuente, markerAttrs, textoSubtipoModificador } from "./markers";

describe("composer markers", () => {
  test("resuelve markers procedimentales desde assets canonicos", () => {
    expect(marcadorDestino("agente")).toEqual(LINK_ASSETS.procedural.agente.marker);
    expect(marcadorDestino("instrumento")).toEqual(LINK_ASSETS.procedural.instrumento.marker);
    expect(marcadorFuente("efecto")).toEqual(LINK_ASSETS.procedural.efecto.marker);
    expect(marcadorDestino("invocacion")).toEqual(LINK_ASSETS.procedural.invocacion.marker);
    expect(marcadorFuente("invocacion")).toBeNull();
  });

  test("clona attrs de marker sin mutar el asset base", () => {
    const marker = markerAttrs(LINK_ASSETS.procedural.consumo.marker);
    expect(marker).toEqual(LINK_ASSETS.procedural.consumo.marker);
    expect(marker).not.toBe(LINK_ASSETS.procedural.consumo.marker);
  });

  test("resuelve badges canonicos c/e/no desde subtipo o modificador base", () => {
    // SSOT §4.1/§4.2: marca canonica `c`/`e` MINUSCULA, `no` -> `¬`.
    expect(textoSubtipoModificador({ id: "e1", tipo: "consumo", origenId: { kind: "entidad", id: "o1" }, destinoId: { kind: "entidad", id: "p1" }, etiqueta: "", modificador: "condicion" })).toBe("c");
    expect(textoSubtipoModificador({ id: "e2", tipo: "consumo", origenId: { kind: "entidad", id: "o1" }, destinoId: { kind: "entidad", id: "p1" }, etiqueta: "", modificador: "evento", subtipoModificador: "E" })).toBe("e");
    expect(textoSubtipoModificador({ id: "e3", tipo: "consumo", origenId: { kind: "entidad", id: "o1" }, destinoId: { kind: "entidad", id: "p1" }, etiqueta: "", modificador: "no" })).toBe("¬");
    const badge = etiquetaBadgeModificadorCanonico("c", 0);
    expect(badge).toMatchObject({ attrs: { label: { text: "c" } }, position: { distance: 0, offset: -20 } });
  });
});
