import { describe, expect, test } from "bun:test";
import type { dia } from "jointjs";
import { ajustesPuertosConectadosDesdeLinkViews } from "./beautifyConnectedLinks";
import type { OpmJointMetadata } from "./proyeccionTipos";

describe("beautifyConnectedLinks OPCloud", () => {
  test("expande el tramo comun de un bus estructural a todos sus enlaces semanticos", () => {
    let updates = 0;
    const meta: OpmJointMetadata = {
      kind: "enlace",
      opdId: "opd-1",
      enlaceId: "e-1",
      enlaceIds: ["e-1", "e-2"],
      aparienciaEnlaceId: "ae-1",
      tipo: "agregacion",
      rolEstructural: "refinable",
      ladoRefinable: "destino",
    };
    const link = fakeLink("struct-bus-opd-agregacion-refinable", { id: "movido" }, { id: "triangulo" }, meta);
    const ajustes = ajustesPuertosConectadosDesdeLinkViews(
      fakePaper(link, { targetAnchor: { x: 320, y: 80 }, requestConnectionUpdate: () => updates++ }),
      fakeGraph([link]),
      { id: "movido" } as dia.Element,
    );

    expect(updates).toBe(1);
    expect(ajustes).toEqual([
      { enlaceId: "e-1", lado: "destino", puntoOpuesto: { x: 320, y: 80 } },
      { enlaceId: "e-2", lado: "destino", puntoOpuesto: { x: 320, y: 80 } },
    ]);
  });

  test("usa sourceAnchor en ramas y aplica el lado opuesto del refinable", () => {
    const meta: OpmJointMetadata = {
      kind: "enlace",
      opdId: "opd-1",
      enlaceId: "e-3",
      aparienciaEnlaceId: "ae-3",
      tipo: "agregacion",
      rolEstructural: "rama",
      ladoRefinable: "destino",
    };
    const link = fakeLink("struct-bus-opd-agregacion-ae-3-rama", { id: "triangulo" }, { id: "movido" }, meta);
    const ajustes = ajustesPuertosConectadosDesdeLinkViews(
      fakePaper(link, { sourceAnchor: { x: 45, y: 120 } }),
      fakeGraph([link]),
      { id: "movido" } as dia.Element,
    );

    expect(ajustes).toEqual([
      { enlaceId: "e-3", lado: "origen", puntoOpuesto: { x: 45, y: 120 } },
    ]);
  });
});

function fakeGraph(links: dia.Link[]): dia.Graph {
  return {
    getConnectedLinks: () => links,
  } as unknown as dia.Graph;
}

function fakePaper(
  link: dia.Link,
  view: {
    sourceAnchor?: { x: number; y: number };
    targetAnchor?: { x: number; y: number };
    requestConnectionUpdate?: () => void;
  },
): dia.Paper {
  return {
    findViewByModel: (model: dia.Cell) => model === link ? view : null,
  } as unknown as dia.Paper;
}

function fakeLink(
  id: string,
  source: { id?: string; selector?: string },
  target: { id?: string; selector?: string },
  meta: OpmJointMetadata,
): dia.Link {
  return {
    id,
    source: () => source,
    target: () => target,
    prop: (path: string) => path === "opm" ? meta : undefined,
  } as unknown as dia.Link;
}
