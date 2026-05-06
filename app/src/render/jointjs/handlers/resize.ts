import type { dia } from "jointjs";
import { RESIZE_MIN } from "../../../canvas/grid";
import { cellViewModel, jointSelector, metadata, paperOff, posicionCanvasDesdeEvento } from "./helpers";

type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

export interface CablearResizeArgs {
  paper: dia.Paper;
  redimensionarAparienciaRef: {
    current: (aparienciaId: string, x: number, y: number, width: number, height: number) => void;
  };
}

export function cablearResize(args: CablearResizeArgs): () => void {
  const { paper, redimensionarAparienciaRef } = args;
  let activo: {
    element: dia.Element;
    aparienciaId: string;
    handle: ResizeHandle;
    startPoint: { x: number; y: number };
    startPosition: { x: number; y: number };
    startSize: { width: number; height: number };
  } | null = null;

  const onPointerDown = (elementView: dia.ElementView, evt: dia.Event) => {
    const handle = handleDesdeSelector(jointSelector(evt.target));
    if (!handle) return;
    evt.preventDefault();
    evt.stopPropagation();
    const cell = cellViewModel(elementView) as dia.Element;
    const meta = metadata(cell);
    if (meta?.kind !== "entidad") return;
    activo = {
      element: cell,
      aparienciaId: meta.aparienciaId,
      handle,
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
    const caja = cajaDesdeEvento(paper, activo, event);
    activo.element.position(caja.x, caja.y);
    activo.element.resize(caja.width, caja.height);
  };

  const onMouseUp = (event: MouseEvent) => {
    if (!activo) return;
    event.preventDefault();
    const caja = cajaDesdeEvento(paper, activo, event);
    redimensionarAparienciaRef.current(activo.aparienciaId, caja.x, caja.y, caja.width, caja.height);
    activo = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  paper.on("element:pointerdown", onPointerDown);

  return () => {
    paperOff(paper, "element:pointerdown", onPointerDown as (...args: never[]) => void);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };
}

function handleDesdeSelector(selector: string | null): ResizeHandle | null {
  if (!selector?.startsWith("resize-")) return null;
  const handle = selector.slice("resize-".length);
  return handle === "nw" || handle === "n" || handle === "ne" || handle === "e" ||
    handle === "se" || handle === "s" || handle === "sw" || handle === "w"
    ? handle
    : null;
}

function cajaDesdeEvento(
  paper: dia.Paper,
  activo: NonNullable<ReturnType<typeof estadoActivoTipo>>,
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

function estadoActivoTipo() {
  return {
    element: {} as dia.Element,
    aparienciaId: "",
    handle: "se" as ResizeHandle,
    startPoint: { x: 0, y: 0 },
    startPosition: { x: 0, y: 0 },
    startSize: { width: 1, height: 1 },
  };
}
