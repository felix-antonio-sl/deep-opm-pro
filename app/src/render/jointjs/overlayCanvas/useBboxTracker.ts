import type { dia, g } from "jointjs";
import { useEffect, useState } from "preact/hooks";

export interface OverlayBBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function useBboxTracker(paper: dia.Paper | null, cellId: string | null): OverlayBBox | null {
  const [bbox, setBbox] = useState<OverlayBBox | null>(null);

  useEffect(() => {
    if (!paper || !cellId) {
      setBbox(null);
      return undefined;
    }

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setBbox(leerBBoxCell(paper, cellId)));
    };

    update();
    paper.on("render:done scale translate resize", update);
    const graph = graphDePaper(paper);
    if (graph) graphEvents(graph).on("change:position change:size change:vertices change:source change:target reset add remove", update);
    return () => {
      cancelAnimationFrame(frame);
      paperEvents(paper).off("render:done scale translate resize", update);
      if (graph) graphEvents(graph).off("change:position change:size change:vertices change:source change:target reset add remove", update);
    };
  }, [cellId, paper]);

  return bbox;
}

export function leerBBoxCell(paper: dia.Paper, cellId: string): OverlayBBox | null {
  const cell = graphDePaper(paper)?.getCell(cellId);
  if (!cell) return null;
  const view = paper.findViewByModel(cell);
  if (!view) return null;
  paper.requireView(cell);
  const bbox = view.getBBox() as g.Rect | undefined;
  if (!bbox) return null;
  return {
    x: bbox.x,
    y: bbox.y,
    width: bbox.width,
    height: bbox.height,
  };
}

function graphDePaper(paper: dia.Paper): dia.Graph | null {
  const candidate = paper as unknown as { model?: dia.Graph; options?: { model?: dia.Graph } };
  return candidate.model ?? candidate.options?.model ?? null;
}

function paperEvents(paper: dia.Paper): dia.Paper & { off: (events: string, callback: () => void) => void } {
  return paper as dia.Paper & { off: (events: string, callback: () => void) => void };
}

function graphEvents(graph: dia.Graph): dia.Graph & {
  on: (events: string, callback: () => void) => void;
  off: (events: string, callback: () => void) => void;
} {
  return graph as dia.Graph & {
    on: (events: string, callback: () => void) => void;
    off: (events: string, callback: () => void) => void;
  };
}
