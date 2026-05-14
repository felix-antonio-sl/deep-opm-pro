import type { dia } from "jointjs";
import { esEnlaceEstructuralFundamental } from "../../modelo/constantes";
import type { TipoEnlace } from "../../modelo/tipos";
import type { OpmJointMetadata } from "./proyeccionTipos";

const OBSTACLE_PADDING = 5;

export function routerManhattanConObstaculos(
  graph: dia.Graph,
  link?: dia.Link,
  direcciones?: { startDirections?: string[]; endDirections?: string[] },
): Record<string, unknown> {
  const sourceId = idEndpoint(link?.source());
  const targetId = idEndpoint(link?.target());
  const sourcePoint = pointEndpoint(link?.source());
  const targetPoint = pointEndpoint(link?.target());
  return {
    name: "manhattan",
    args: {
      padding: 5,
      step: 11,
      ...(direcciones?.startDirections ? { startDirections: direcciones.startDirections } : {}),
      ...(direcciones?.endDirections ? { endDirections: direcciones.endDirections } : {}),
      isPointObstacle(point: { x: number; y: number }) {
        if (cerca(point, sourcePoint) || cerca(point, targetPoint)) return false;
        return graph.getElements().some((cell) => {
          if (cell.id === sourceId || cell.id === targetId) return false;
          const meta = cell.prop("opm") as OpmJointMetadata | undefined;
          if (meta?.kind !== "entidad" && !esTrianguloEstructural(cell)) return false;
          return puntoEnBBox(cell, point, OBSTACLE_PADDING);
        });
      },
    },
  };
}

export function aplicarRuteoOpcloudEnlaces(graph: dia.Graph): void {
  for (const link of graph.getLinks()) {
    const meta = link.prop("opm") as OpmJointMetadata | undefined;
    if (meta?.kind !== "enlace" || !esEstructural(meta.tipo)) continue;
    link.router(routerManhattanConObstaculos(graph, link, direccionesPorLink(link)) as never);
  }
}

function direccionesPorLink(link: dia.Link): { startDirections?: string[]; endDirections?: string[] } {
  const linkId = String(link.id);
  const sourceId = idEndpoint(link.source());
  const targetId = idEndpoint(link.target());
  const sourceTriangulo = esEndpointTriangulo(sourceId);
  const targetTriangulo = esEndpointTriangulo(targetId);
  if (sourceTriangulo) return { startDirections: ["bottom"] };
  if (targetTriangulo) return { endDirections: ["top"] };
  if (linkId.endsWith("-refinador") || linkId.endsWith("-rama")) return { startDirections: ["bottom"] };
  if (linkId.endsWith("-refinable")) return { endDirections: ["top"] };
  return {};
}

function esEstructural(tipo: TipoEnlace): boolean {
  return esEnlaceEstructuralFundamental(tipo);
}

function esTrianguloEstructural(cell: dia.Cell): boolean {
  const type = cell.prop("type");
  const id = String(cell.id);
  return type === "standard.Polygon" && (id.includes("triangulo") || id.includes("ag-bus"));
}

function esEndpointTriangulo(id: string | number | null): boolean {
  return typeof id === "string" && (id.includes("triangulo") || id.includes("ag-bus"));
}

function puntoEnBBox(cell: dia.Element, point: { x: number; y: number }, padding: number): boolean {
  const bbox = cell.getBBox();
  return point.x >= bbox.x - padding
    && point.x <= bbox.x + bbox.width + padding
    && point.y >= bbox.y - padding
    && point.y <= bbox.y + bbox.height + padding;
}

function idEndpoint(endpoint: dia.Link.EndJSON | undefined): string | number | null {
  const id = endpoint?.id;
  return typeof id === "string" || typeof id === "number" ? id : null;
}

function pointEndpoint(endpoint: dia.Link.EndJSON | undefined): { x: number; y: number } | null {
  const x = endpoint?.x;
  const y = endpoint?.y;
  return typeof x === "number" && typeof y === "number" ? { x, y } : null;
}

function cerca(point: { x: number; y: number }, endpoint: { x: number; y: number } | null): boolean {
  return !!endpoint && Math.hypot(point.x - endpoint.x, point.y - endpoint.y) < 12;
}
