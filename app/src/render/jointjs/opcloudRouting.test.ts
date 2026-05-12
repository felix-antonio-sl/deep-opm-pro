import { describe, expect, test } from "bun:test";
import { dia, shapes } from "jointjs";
import { aplicarRuteoOpcloudEnlaces, routerManhattanConObstaculos } from "./opcloudRouting";

describe("ruteo OPCloud de enlaces", () => {
  test("isPointObstacle aplica margen propio porque JointJS ignora padding cuando hay predicado custom", () => {
    const graph = new dia.Graph({}, { cellNamespace: shapes });
    const rect = new shapes.standard.Rectangle({
      id: "ap-obstaculo",
      position: { x: 100, y: 100 },
      size: { width: 50, height: 50 },
    });
    rect.prop("opm", { kind: "entidad" });
    graph.addCell(rect);

    const link = new shapes.standard.Link({ id: "l1", source: { id: "a" }, target: { id: "b" } });
    const router = routerManhattanConObstaculos(graph, link) as { args: { isPointObstacle: (point: { x: number; y: number }) => boolean } };

    expect(router.args.isPointObstacle({ x: 96, y: 120 })).toBe(true);
    expect(router.args.isPointObstacle({ x: 94, y: 120 })).toBe(false);
  });

  test("infere direcciones OPCloud en tramos hacia y desde triangulo estructural", () => {
    const graph = new dia.Graph({}, { cellNamespace: shapes });
    const refinable = linkEstructural("ag-1-refinable", { id: "origen" }, { x: 200, y: 100 });
    const refinador = linkEstructural("ag-1-refinador", { x: 200, y: 130 }, { id: "destino" });
    graph.addCells([refinable, refinador]);

    aplicarRuteoOpcloudEnlaces(graph);

    expect((refinable.prop("router") as { args: { endDirections?: string[] } }).args.endDirections).toEqual(["top"]);
    expect((refinador.prop("router") as { args: { startDirections?: string[] } }).args.startDirections).toEqual(["bottom"]);
  });
});

function linkEstructural(id: string, source: dia.Link.EndJSON, target: dia.Link.EndJSON): dia.Link {
  const link = new shapes.standard.Link({ id, source, target });
  link.prop("opm", {
    kind: "enlace",
    opdId: "opd",
    enlaceId: id,
    aparienciaEnlaceId: id,
    tipo: "agregacion",
  });
  return link;
}
