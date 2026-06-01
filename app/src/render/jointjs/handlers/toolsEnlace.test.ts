import { describe, expect, test } from "bun:test";
import type { dia } from "jointjs";
import { admiteSegmentsTool, connectorAdmiteSegmentsTool, ladosReanclablesPorMeta, linksParaHerramientasEnlaceSeleccionado, routerAdmiteSegmentsTool } from "./toolsEnlace";

describe("toolsEnlace", () => {
  test("habilita Segments solo con router normal o implicito", () => {
    expect(routerAdmiteSegmentsTool(undefined)).toBe(true);
    expect(routerAdmiteSegmentsTool(null)).toBe(true);
    expect(routerAdmiteSegmentsTool("normal")).toBe(true);
    expect(routerAdmiteSegmentsTool({ name: "normal" })).toBe(true);

    expect(routerAdmiteSegmentsTool("manhattan")).toBe(false);
    expect(routerAdmiteSegmentsTool({ name: "manhattan", args: { padding: 5 } })).toBe(false);
    expect(routerAdmiteSegmentsTool({ name: "orthogonal" })).toBe(false);
    expect(routerAdmiteSegmentsTool({ args: { padding: 5 } })).toBe(false);
  });

  test("deshabilita Segments cuando el connector no es lineal simple", () => {
    expect(connectorAdmiteSegmentsTool(undefined)).toBe(true);
    expect(connectorAdmiteSegmentsTool(null)).toBe(true);
    expect(connectorAdmiteSegmentsTool("straight")).toBe(true);
    expect(connectorAdmiteSegmentsTool({ name: "straight" })).toBe(true);

    expect(connectorAdmiteSegmentsTool("jumpover")).toBe(false);
    expect(connectorAdmiteSegmentsTool({ name: "jumpover", args: { type: "arc", size: 8 } })).toBe(false);
    expect(admiteSegmentsTool(undefined, { name: "jumpover" })).toBe(false);
    expect(admiteSegmentsTool({ name: "manhattan" }, { name: "straight" })).toBe(false);
    expect(admiteSegmentsTool(undefined, { name: "straight" })).toBe(true);
  });

  test("autoinvocacion instala herramientas en ambos tramos y cada tramo reancla solo su extremo real", () => {
    const salida = fakeLink("ae-auto-salida", "e-auto", "auto-salida");
    const retorno = fakeLink("ae-auto-retorno", "e-auto", "auto-retorno");
    const otro = fakeLink("ae-otro", "e-otro");

    expect(linksParaHerramientasEnlaceSeleccionado([salida, retorno, otro], "e-auto")).toEqual([salida, retorno]);
    expect(ladosReanclablesPorMeta(salida.prop("opm") as never)).toEqual(["origen"]);
    expect(ladosReanclablesPorMeta(retorno.prop("opm") as never)).toEqual(["destino"]);
  });

  test("enlace normal conserva una sola celda con origen y destino reanclables", () => {
    const principal = fakeLink("ae-1", "e-1");
    const duplicadoRender = fakeLink("ae-1-refinador", "e-1");

    expect(linksParaHerramientasEnlaceSeleccionado([principal, duplicadoRender], "e-1")).toEqual([principal]);
    expect(ladosReanclablesPorMeta(principal.prop("opm") as never)).toEqual(["origen", "destino"]);
  });
});

function fakeLink(id: string, enlaceId: string, rolInvocacion?: "auto-salida" | "auto-retorno"): dia.Link {
  return {
    id,
    prop: (key: string) => key === "opm" ? {
      kind: "enlace",
      opdId: "opd-1",
      enlaceId,
      aparienciaEnlaceId: id,
      tipo: "invocacion",
      ...(rolInvocacion ? { rolInvocacion } : {}),
    } : undefined,
  } as unknown as dia.Link;
}
