import type { dia } from "jointjs";
import type { AjustePuertoEnlace, LadoPuertoEnlace } from "../../modelo/operaciones";
import type { Id } from "../../modelo/tipos";
import type { OpmJointMetadata } from "./proyeccionTipos";

type MetadataEnlace = Extract<OpmJointMetadata, { kind: "enlace" }>;

/**
 * Adaptacion de OPCloud `OpmEntity.beautifyConnectedLinks`.
 *
 * OPCloud recalcula el port del elemento movido desde el anchor real del otro
 * extremo (`sourceAnchor` para links entrantes, `targetAnchor` para salientes).
 * Aqui solo extraemos esos puntos desde LinkView; la persistencia ocurre en el
 * kernel para respetar nuestro modelo JSON/Zustand.
 */
export function ajustesPuertosConectadosDesdeLinkViews(
  paper: dia.Paper,
  graph: dia.Graph,
  element: dia.Element,
): AjustePuertoEnlace[] {
  const ajustes: AjustePuertoEnlace[] = [];
  for (const link of graph.getConnectedLinks(element)) {
    const meta = link.prop("opm") as OpmJointMetadata | undefined;
    if (meta?.kind !== "enlace") continue;
    const side = ladoVisualConectado(link, element.id);
    if (!side) continue;
    const endpoint = side === "source" ? link.source() : link.target();
    if (endpoint.selector) continue;
    const puntoOpuesto = puntoOpuestoDesdeLinkView(paper, link, side);
    if (!puntoOpuesto) continue;
    const lado = ladoLogicoDesdeLink(link, side, meta);
    if (!lado) continue;
    for (const enlaceId of enlaceIdsDesdeMeta(meta)) {
      ajustes.push({
        enlaceId,
        lado,
        puntoOpuesto,
      });
    }
  }
  return ajustes;
}

function ladoVisualConectado(link: dia.Link, elementId: string | number): "source" | "target" | null {
  if (link.source().id === elementId) return "source";
  if (link.target().id === elementId) return "target";
  return null;
}

function puntoOpuestoDesdeLinkView(
  paper: dia.Paper,
  link: dia.Link,
  side: "source" | "target",
): { x: number; y: number } | null {
  const view = paper.findViewByModel(link) as (dia.LinkView & {
    sourceAnchor?: { x: number; y: number };
    targetAnchor?: { x: number; y: number };
    requestConnectionUpdate?: () => void;
  }) | null;
  if (!view) return null;
  view.requestConnectionUpdate?.();
  const point = side === "source" ? view.targetAnchor : view.sourceAnchor;
  if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) return null;
  return { x: point.x, y: point.y };
}

function enlaceIdsDesdeMeta(meta: MetadataEnlace): Id[] {
  return meta.enlaceIds?.length ? meta.enlaceIds : [meta.enlaceId];
}

function ladoLogicoDesdeLink(link: dia.Link, side: "source" | "target", meta: MetadataEnlace): LadoPuertoEnlace | null {
  const desdeMetadata = ladoLogicoDesdeMetadata(meta, side);
  if (desdeMetadata) return desdeMetadata;
  const id = String(link.id);
  if (id.includes("struct-bus-")) return ladoLogicoBus(id, side);
  if (id.endsWith("-refinable")) return side === "source" ? "origen" : null;
  if (id.endsWith("-refinador")) return side === "target" ? "destino" : null;
  return side === "source" ? "origen" : "destino";
}

function ladoLogicoDesdeMetadata(meta: MetadataEnlace, side: "source" | "target"): LadoPuertoEnlace | null {
  if (!meta.rolEstructural || !meta.ladoRefinable) return null;
  if (meta.rolEstructural === "refinable") {
    return side === "source" ? meta.ladoRefinable : null;
  }
  if (meta.rolEstructural === "rama") {
    if (side !== "target") return null;
    return meta.ladoRefinable === "origen" ? "destino" : "origen";
  }
  return null;
}

function ladoLogicoBus(id: string, side: "source" | "target"): LadoPuertoEnlace | null {
  const refinableEsDestino = id.includes("-destino-");
  if (id.endsWith("-refinable")) {
    if (side !== "source") return null;
    return refinableEsDestino ? "destino" : "origen";
  }
  if (id.endsWith("-rama")) {
    if (side !== "target") return null;
    return refinableEsDestino ? "origen" : "destino";
  }
  return null;
}
