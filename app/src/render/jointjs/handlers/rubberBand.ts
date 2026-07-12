import type { dia } from "jointjs";
import { interseccionRectangulo } from "../../../canvas/seleccionMultiple";
import type { Modelo, TipoEntidad } from "../../../modelo/tipos";
import { jointCanvasPalette } from "../palette";
import { ctrlEvento, paperOff, posicionCanvasDesdeEvento, shiftEvento } from "./helpers";

/**
 * Handler de rubber band (Shift+drag sobre blank): dibuja un rectángulo SVG
 * y al soltar selecciona apariencias dentro del rectángulo en el OPD activo.
 * Acumular con Ctrl+Shift+drag.
 *
 * Ref: canvas/seleccionMultiple.ts (interseccionRectangulo).
 */

export interface CablearRubberBandArgs {
  paper: dia.Paper;
  modeloRef: { current: Modelo };
  opdActivoIdRef: { current: string };
  modoCreacionRef: { current: TipoEntidad | null };
  seleccionadosRef: { current: string[] };
  setSeleccion: (ids: string[]) => void;
  onActivoChange: (activo: boolean) => void;
  onSuprimirBlankClick: () => void;
}

export function cablearRubberBand(args: CablearRubberBandArgs): () => void {
  const onBlankPointerdown = (evt: dia.Event) => {
    if (!shiftEvento(evt) || args.modoCreacionRef.current) return;
    args.onActivoChange(true);
    iniciarRubberBand({
      paper: args.paper,
      evt,
      modelo: () => args.modeloRef.current,
      opdId: () => args.opdActivoIdRef.current,
      acumular: () => ctrlEvento(evt),
      setSeleccion: args.setSeleccion,
      agregarSeleccion: (ids) => {
        const actuales = new Set(args.seleccionadosRef.current);
        args.setSeleccion([...actuales, ...ids]);
      },
      onFinish: () => {
        args.onActivoChange(false);
        args.onSuprimirBlankClick();
      },
    });
  };
  args.paper.on("blank:pointerdown", onBlankPointerdown);
  return () => {
    paperOff(args.paper, "blank:pointerdown", onBlankPointerdown as (...args: never[]) => void);
  };
}

function iniciarRubberBand(args: {
  paper: dia.Paper;
  evt: dia.Event;
  modelo: () => Modelo;
  opdId: () => string;
  acumular: () => boolean;
  setSeleccion: (ids: string[]) => void;
  agregarSeleccion: (ids: string[]) => void;
  onFinish: () => void;
}): void {
  const start = posicionCanvasDesdeEvento(args.paper, args.evt);
  const startClient = args.evt as unknown as MouseEvent;
  const paperEl = (args.paper as unknown as { el: HTMLElement }).el;
  const bounds = paperEl.getBoundingClientRect();
  const overlay = document.createElement("div");
  overlay.setAttribute("data-testid", "rubber-band-seleccion");
  overlay.style.position = "absolute";
  overlay.style.pointerEvents = "none";
  overlay.style.border = `1px solid ${jointCanvasPalette.seleccion}`;
  overlay.style.background = jointCanvasPalette.seleccionSuave;
  overlay.style.left = `${startClient.clientX - bounds.left}px`;
  overlay.style.top = `${startClient.clientY - bounds.top}px`;
  overlay.style.width = "0px";
  overlay.style.height = "0px";
  paperEl.style.position = paperEl.style.position || "relative";
  paperEl.appendChild(overlay);

  let ultimo = start;
  const mover = (event: MouseEvent) => {
    ultimo = posicionCanvasDesdeEvento(args.paper, event as unknown as dia.Event);
    const x = Math.min(startClient.clientX, event.clientX) - bounds.left;
    const y = Math.min(startClient.clientY, event.clientY) - bounds.top;
    overlay.style.left = `${x}px`;
    overlay.style.top = `${y}px`;
    overlay.style.width = `${Math.abs(event.clientX - startClient.clientX)}px`;
    overlay.style.height = `${Math.abs(event.clientY - startClient.clientY)}px`;
  };
  const soltar = () => {
    window.removeEventListener("mousemove", mover);
    window.removeEventListener("mouseup", soltar);
    overlay.remove();
    const ids = interseccionRectangulo(args.modelo(), args.opdId(), {
      x: start.x,
      y: start.y,
      width: ultimo.x - start.x,
      height: ultimo.y - start.y,
    });
    if (args.acumular()) args.agregarSeleccion(ids);
    else args.setSeleccion(ids);
    args.onFinish();
  };
  window.addEventListener("mousemove", mover);
  window.addEventListener("mouseup", soltar);
}
