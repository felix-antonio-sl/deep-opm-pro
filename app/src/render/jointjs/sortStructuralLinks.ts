import type { dia } from "jointjs";
import { esEnlaceEstructuralFundamental } from "../../modelo/constantes";
import type { TipoEnlace } from "../../modelo/tipos";
import type { OpmJointMetadata } from "./proyeccionTipos";

const MAX_LINKS_SORT = 7;
const SAMPLE_STEP = 12;

type TerminalOrdenable =
  | { kind: "anchor"; anchor: dia.Link.EndJSON["anchor"] }
  | { kind: "port"; port: string | number; connectionPoint?: dia.Link.EndJSON["connectionPoint"] };

export function ordenarEnlacesEstructuralesConectados(paper: dia.Paper, graph: dia.Graph, element: dia.Element): void {
  const links = graph.getConnectedLinks(element)
    .filter((link) => {
      const meta = link.prop("opm") as OpmJointMetadata | undefined;
      return meta?.kind === "enlace" && esEnlaceEstructuralFundamental(meta.tipo as TipoEnlace);
    })
    .map((link) => ({ link, side: ladoConectado(link, element.id) }))
    .filter((item): item is { link: dia.Link; side: "source" | "target" } => item.side !== null)
    .filter((item) => terminalOrdenable(endpoint(item.link, item.side)) !== null);

  if (links.length < 2 || links.length > MAX_LINKS_SORT) return;
  const originales = links.flatMap((item) => {
    const terminal = terminalOrdenable(endpoint(item.link, item.side));
    return terminal ? [terminal] : [];
  });
  if (originales.length !== links.length || !terminalesCompatibles(originales)) return;
  if (contarCruces(paper, links.map((item) => item.link)) === 0) return;

  for (const perm of permutaciones(originales)) {
    aplicarTerminales(links, perm);
    if (contarCruces(paper, links.map((item) => item.link)) === 0) return;
  }
  aplicarTerminales(links, originales);
}

export function ordenarTodosLosEnlacesEstructurales(paper: dia.Paper, graph: dia.Graph): void {
  for (const element of graph.getElements()) {
    const meta = element.prop("opm") as OpmJointMetadata | undefined;
    if (meta?.kind !== "entidad") continue;
    ordenarEnlacesEstructuralesConectados(paper, graph, element);
  }
}

function aplicarTerminales(links: Array<{ link: dia.Link; side: "source" | "target" }>, terminales: TerminalOrdenable[]): void {
  links.forEach((item, index) => {
    const actual = endpoint(item.link, item.side);
    const terminal = terminales[index];
    if (!terminal) return;
    if (terminal.kind === "anchor") {
      const siguiente = { ...actual, anchor: terminal.anchor };
      delete siguiente.port;
      item.link.prop(item.side, siguiente);
      return;
    }
    const siguiente = {
      ...actual,
      port: terminal.port,
      connectionPoint: terminal.connectionPoint ?? actual.connectionPoint ?? { name: "anchor" },
    };
    delete siguiente.anchor;
    item.link.prop(item.side, siguiente);
  });
}

function terminalOrdenable(endpointJson: dia.Link.EndJSON): TerminalOrdenable | null {
  if (endpointJson.anchor !== undefined) return { kind: "anchor", anchor: endpointJson.anchor };
  const port = endpointJson.port;
  if (typeof port === "string" || typeof port === "number") {
    return { kind: "port", port, connectionPoint: endpointJson.connectionPoint };
  }
  return null;
}

function terminalesCompatibles(terminales: TerminalOrdenable[]): boolean {
  const primera = terminales[0];
  return !!primera && terminales.every((terminal) => terminal.kind === primera.kind);
}

function contarCruces(paper: dia.Paper, links: dia.Link[]): number {
  let total = 0;
  const polylines = links.map((link) => polylineLink(paper, link));
  for (let i = 0; i < polylines.length; i += 1) {
    for (let j = i + 1; j < polylines.length; j += 1) {
      total += contarIntersecciones(polylines[i] ?? [], polylines[j] ?? []);
    }
  }
  return total;
}

function polylineLink(paper: dia.Paper, link: dia.Link): Array<{ x: number; y: number }> {
  const view = paper.findViewByModel(link) as dia.LinkView | null;
  if (!view) return [];
  const length = view.getConnectionLength();
  if (!Number.isFinite(length) || length <= 0) return [];
  const puntos: Array<{ x: number; y: number }> = [];
  for (let dist = 0; dist <= length; dist += SAMPLE_STEP) {
    const point = view.getPointAtLength(dist);
    if (point) puntos.push({ x: point.x, y: point.y });
  }
  const end = view.getPointAtLength(length);
  if (end) puntos.push({ x: end.x, y: end.y });
  return puntos;
}

function contarIntersecciones(a: Array<{ x: number; y: number }>, b: Array<{ x: number; y: number }>): number {
  let total = 0;
  for (let i = 1; i < a.length; i += 1) {
    const a1 = a[i - 1]!;
    const a2 = a[i]!;
    for (let j = 1; j < b.length; j += 1) {
      const b1 = b[j - 1]!;
      const b2 = b[j]!;
      const inter = interseccionSegmentos(a1, a2, b1, b2);
      if (!inter) continue;
      if (cercaDeExtremo(inter, [a[0]!, a[a.length - 1]!, b[0]!, b[b.length - 1]!])) continue;
      total += 1;
    }
  }
  return total;
}

function interseccionSegmentos(
  a1: { x: number; y: number },
  a2: { x: number; y: number },
  b1: { x: number; y: number },
  b2: { x: number; y: number },
): { x: number; y: number } | null {
  const d = (a2.x - a1.x) * (b2.y - b1.y) - (a2.y - a1.y) * (b2.x - b1.x);
  if (Math.abs(d) < 0.00001) return null;
  const ua = ((b1.x - a1.x) * (b2.y - b1.y) - (b1.y - a1.y) * (b2.x - b1.x)) / d;
  const ub = ((b1.x - a1.x) * (a2.y - a1.y) - (b1.y - a1.y) * (a2.x - a1.x)) / d;
  if (ua <= 0 || ua >= 1 || ub <= 0 || ub >= 1) return null;
  return { x: a1.x + ua * (a2.x - a1.x), y: a1.y + ua * (a2.y - a1.y) };
}

function cercaDeExtremo(point: { x: number; y: number }, extremos: Array<{ x: number; y: number }>): boolean {
  return extremos.some((extremo) => Math.hypot(point.x - extremo.x, point.y - extremo.y) < 8);
}

function ladoConectado(link: dia.Link, elementId: string | number): "source" | "target" | null {
  if (endpoint(link, "source").id === elementId) return "source";
  if (endpoint(link, "target").id === elementId) return "target";
  return null;
}

function endpoint(link: dia.Link, side: "source" | "target"): dia.Link.EndJSON {
  return side === "source" ? link.source() : link.target();
}

function permutaciones<T>(items: T[]): T[][] {
  if (items.length <= 1) return [items];
  const result: T[][] = [];
  items.forEach((item, index) => {
    const rest = [...items.slice(0, index), ...items.slice(index + 1)];
    for (const perm of permutaciones(rest)) {
      result.push([item, ...perm]);
    }
  });
  return result;
}
