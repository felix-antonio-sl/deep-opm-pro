import type { dia } from "jointjs";
import { idHoverTooltip } from "../../../app/ports/feedbackPort";
import { clearHoverTooltip, setHoverTooltip } from "../../../app/ports/zustandFeedbackPort";
import type { Modelo } from "../../../modelo/tipos";
import { contenidoHoverTooltip } from "../overlayCanvas/hoverTooltipContent";
import { cellViewModel, metadata, paperOff } from "./helpers";

export function cablearHoverTooltipCanvas(paper: dia.Paper, modeloRef: { current: Modelo }): () => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let focoTooltip: { cellId: string; contenido: string; el: Element } | null = null;
  const cancelarTimer = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };
  const limpiarFoco = () => {
    focoTooltip?.el.removeAttribute("aria-describedby");
    focoTooltip = null;
  };
  const cancelar = () => {
    cancelarTimer();
    if (focoTooltip) {
      setHoverTooltip(focoTooltip.cellId, focoTooltip.contenido);
      return;
    }
    clearHoverTooltip();
  };
  const mostrar = (cellView: dia.CellView) => {
    cancelarTimer();
    const dato = datoHoverTooltip(cellView, modeloRef.current);
    if (!dato) {
      if (!focoTooltip) clearHoverTooltip();
      return;
    }
    timer = setTimeout(() => {
      setHoverTooltip(dato.cellId, dato.contenido);
      timer = null;
    }, 250);
  };
  const mostrarFoco = (event: FocusEvent) => {
    const view = cellViewDesdeTarget(paper, event.target);
    if (!view) return;
    const dato = datoHoverTooltip(view, modeloRef.current);
    const el = elementViewEl(view);
    limpiarFoco();
    cancelarTimer();
    if (!dato || !el) {
      clearHoverTooltip();
      return;
    }
    el.setAttribute("aria-describedby", idHoverTooltip(dato.cellId));
    focoTooltip = { ...dato, el };
    setHoverTooltip(dato.cellId, dato.contenido);
  };
  const ocultarFoco = () => {
    limpiarFoco();
    cancelarTimer();
    clearHoverTooltip();
  };

  paper.on("cell:mouseover", mostrar);
  paper.on("cell:mouseout blank:mouseover", cancelar);
  (paper as unknown as { el: HTMLElement }).el.addEventListener("focusin", mostrarFoco);
  (paper as unknown as { el: HTMLElement }).el.addEventListener("focusout", ocultarFoco);
  return () => {
    cancelarTimer();
    limpiarFoco();
    paperOff(paper, "cell:mouseover", mostrar as (...args: never[]) => void);
    paperOff(paper, "cell:mouseout blank:mouseover", cancelar as (...args: never[]) => void);
    (paper as unknown as { el: HTMLElement }).el.removeEventListener("focusin", mostrarFoco);
    (paper as unknown as { el: HTMLElement }).el.removeEventListener("focusout", ocultarFoco);
    clearHoverTooltip();
  };
}

function datoHoverTooltip(cellView: dia.CellView, modelo: Modelo): { cellId: string; contenido: string } | null {
  const cell = cellViewModel(cellView);
  const contenido = contenidoHoverTooltip(modelo, metadata(cell));
  if (!contenido) {
    return null;
  }
  return { cellId: String(cell.id), contenido };
}

function cellViewDesdeTarget(paper: dia.Paper, target: EventTarget | null): dia.CellView | null {
  const cellElement = target instanceof Element ? target.closest(".joint-cell") : null;
  if (!cellElement) return null;
  const paperConBusqueda = paper as unknown as { findView?: (element: Element) => dia.CellView | undefined };
  return paperConBusqueda.findView?.(cellElement) ?? null;
}

function elementViewEl(cellView: dia.CellView): Element | null {
  return (cellView as unknown as { el?: Element }).el ?? null;
}
