import type { dia } from "jointjs";
import { RESIZE_MIN } from "../../../canvas/grid";
import { cellViewModel, estadoDesdeSelector, jointSelector, metadata, paperOff, posicionCanvasDesdeEvento, prevenirInteraccionNativa } from "./helpers";
import {
  aplicarRectEstadoLive,
  indiceEstadoDesdeSelector,
  limitarRectEstadoAElemento,
  marcarGestoEstadoActivo,
  rectSelectorEstado,
  type RectEstado,
} from "./estadoGeometry";

type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";
type ResizeTarget =
  | { kind: "entidad"; handle: ResizeHandle }
  | { kind: "estado"; handle: ResizeHandle; selector: string; estadoId: string };
type ActiveResize =
  | {
      kind: "entidad";
      element: dia.Element;
      aparienciaId: string;
      handle: ResizeHandle;
      startPoint: { x: number; y: number };
      startPosition: { x: number; y: number };
      startSize: { width: number; height: number };
    }
  | {
      kind: "estado";
      element: dia.Element;
      estadoId: string;
      selector: string;
      index: number;
      handle: ResizeHandle;
      startPoint: { x: number; y: number };
      startRect: RectEstado;
    };

const ESTADO_RESIZE_MIN = { width: 52, height: 24 } as const;

export interface CablearResizeArgs {
  paper: dia.Paper;
  redimensionarAparienciaRef: {
    current: (aparienciaId: string, x: number, y: number, width: number, height: number) => void;
  };
  redimensionarEstadoRef: {
    current: (estadoId: string, width: number, height: number, posicion?: { x: number; y: number }) => void;
  };
}

export function cablearResize(args: CablearResizeArgs): () => void {
  const { paper, redimensionarAparienciaRef, redimensionarEstadoRef } = args;
  let activo: ActiveResize | null = null;

  const onPointerDown = (elementView: dia.ElementView, evt: dia.Event) => {
    const target = targetDesdeSelector(jointSelector(evt.target), cellViewModel(elementView) as dia.Element);
    if (!target) return;
    prevenirInteraccionNativa(elementView, evt);
    evt.preventDefault();
    evt.stopPropagation();
    const cell = cellViewModel(elementView) as dia.Element;
    const meta = metadata(cell);
    if (meta?.kind !== "entidad") return;
    if (target.kind === "estado") {
      activo = {
        kind: "estado",
        element: cell,
        estadoId: target.estadoId,
        selector: target.selector,
        index: indiceEstadoDesdeSelector(target.selector),
        handle: target.handle,
        startPoint: posicionCanvasDesdeEvento(paper, evt),
        startRect: rectSelectorEstado(cell, target.selector),
      };
      marcarGestoEstadoActivo(paper, true);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      return;
    }
    activo = {
      kind: "entidad",
      element: cell,
      aparienciaId: meta.aparienciaId,
      handle: target.handle,
      startPoint: posicionCanvasDesdeEvento(paper, evt),
      startPosition: cell.position(),
      startSize: cell.size(),
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (event: MouseEvent) => {
    if (!activo) return;
    event.preventDefault();
    if (activo.kind === "estado") {
      const rect = rectEstadoDesdeEvento(paper, activo, event);
      aplicarRectEstadoLive(activo.element, activo.index, rect);
      return;
    }
    const caja = cajaDesdeEvento(paper, activo, event);
    activo.element.position(caja.x, caja.y);
    activo.element.resize(caja.width, caja.height);
  };

  const onMouseUp = (event: MouseEvent) => {
    if (!activo) return;
    event.preventDefault();
    if (activo.kind === "estado") {
      const rect = rectEstadoDesdeEvento(paper, activo, event);
      aplicarRectEstadoLive(activo.element, activo.index, rect);
      redimensionarEstadoRef.current(activo.estadoId, rect.width, rect.height, { x: rect.x, y: rect.y });
      activo = null;
      marcarGestoEstadoActivo(paper, false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      return;
    }
    const caja = cajaDesdeEvento(paper, activo, event);
    redimensionarAparienciaRef.current(activo.aparienciaId, caja.x, caja.y, caja.width, caja.height);
    activo = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  paper.on("element:pointerdown", onPointerDown);

  return () => {
    paperOff(paper, "element:pointerdown", onPointerDown as (...args: never[]) => void);
    marcarGestoEstadoActivo(paper, false);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };
}

function targetDesdeSelector(selector: string | null, cell: dia.Element): ResizeTarget | null {
  if (!selector?.startsWith("resize-")) return null;
  const stateMatch = /^resize-state(\d+)-(nw|ne|se|sw)$/.exec(selector);
  if (stateMatch) {
    const [, index, handle] = stateMatch;
    const meta = metadata(cell);
    const selectorCapsula = `stateCapsule${index}`;
    const estadoId = meta ? estadoDesdeSelector(meta, selectorCapsula) : null;
    if (!estadoId) return null;
    return { kind: "estado", handle: handle as ResizeHandle, selector: selectorCapsula, estadoId };
  }
  const handle = selector.slice("resize-".length);
  return handle === "nw" || handle === "n" || handle === "ne" || handle === "e" ||
    handle === "se" || handle === "s" || handle === "sw" || handle === "w"
    ? { kind: "entidad", handle }
    : null;
}

function cajaDesdeEvento(
  paper: dia.Paper,
  activo: Extract<ActiveResize, { kind: "entidad" }>,
  event: MouseEvent,
): { x: number; y: number; width: number; height: number } {
  const punto = posicionCanvasDesdeEvento(paper, event as unknown as dia.Event);
  const dx = punto.x - activo.startPoint.x;
  const dy = punto.y - activo.startPoint.y;
  let x = activo.startPosition.x;
  let y = activo.startPosition.y;
  let width = activo.startSize.width;
  let height = activo.startSize.height;

  if (activo.handle.includes("e")) width += dx;
  if (activo.handle.includes("s")) height += dy;
  if (activo.handle.includes("w")) {
    width -= dx;
    x += dx;
  }
  if (activo.handle.includes("n")) {
    height -= dy;
    y += dy;
  }

  if (event.shiftKey) {
    const ratio = activo.startSize.width / Math.max(1, activo.startSize.height);
    if (Math.abs(width - activo.startSize.width) >= Math.abs(height - activo.startSize.height)) {
      height = width / ratio;
    } else {
      width = height * ratio;
    }
    if (activo.handle.includes("w")) x = activo.startPosition.x + activo.startSize.width - width;
    if (activo.handle.includes("n")) y = activo.startPosition.y + activo.startSize.height - height;
  }

  if (width < RESIZE_MIN.width) {
    if (activo.handle.includes("w")) x -= RESIZE_MIN.width - width;
    width = RESIZE_MIN.width;
  }
  if (height < RESIZE_MIN.height) {
    if (activo.handle.includes("n")) y -= RESIZE_MIN.height - height;
    height = RESIZE_MIN.height;
  }

  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(width),
    height: Math.round(height),
  };
}

function rectEstadoDesdeEvento(
  paper: dia.Paper,
  activo: Extract<ActiveResize, { kind: "estado" }>,
  event: MouseEvent,
): RectEstado {
  const punto = posicionCanvasDesdeEvento(paper, event as unknown as dia.Event);
  const dx = punto.x - activo.startPoint.x;
  const dy = punto.y - activo.startPoint.y;
  let x = activo.startRect.x;
  let y = activo.startRect.y;
  let width = activo.startRect.width;
  let height = activo.startRect.height;
  if (activo.handle.includes("e")) width += dx;
  if (activo.handle.includes("s")) height += dy;
  if (activo.handle.includes("w")) {
    width -= dx;
    x += dx;
  }
  if (activo.handle.includes("n")) {
    height -= dy;
    y += dy;
  }
  if (width < ESTADO_RESIZE_MIN.width) {
    if (activo.handle.includes("w")) x = activo.startRect.x + activo.startRect.width - ESTADO_RESIZE_MIN.width;
    width = ESTADO_RESIZE_MIN.width;
  }
  if (height < ESTADO_RESIZE_MIN.height) {
    if (activo.handle.includes("n")) y = activo.startRect.y + activo.startRect.height - ESTADO_RESIZE_MIN.height;
    height = ESTADO_RESIZE_MIN.height;
  }
  return limitarRectEstadoAElemento(activo.element, {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(width),
    height: Math.round(height),
  });
}
