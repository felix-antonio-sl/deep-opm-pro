import type { dia } from "jointjs";
import { colorHaloPorTipo, entidadDestinoValida, evaluarDestinos } from "../../../canvas/modoEnlace";
import type { Id, Modelo, TipoEnlace } from "../../../modelo/tipos";
import type { ModoEnlace } from "../../../store/tipos";
import { cellViewModel, metadata, paperOff } from "./helpers";

interface CablearModoEnlaceArgs {
  paper: dia.Paper;
  modeloRef: { current: Modelo };
  opdActivoIdRef: { current: Id };
  modoEnlaceRef: { current: ModoEnlace | null };
  crearEnlaceEntreEntidadesRef: { current: (origenId: Id, destinoId: Id, tipo: TipoEnlace) => void };
}

export function aplicarFeedbackModoEnlace(
  paper: dia.Paper,
  modelo: Modelo,
  opdId: Id,
  modoEnlace: ModoEnlace | null,
): void {
  limpiarFeedbackModoEnlace(paper);
  if (!modoEnlace) return;

  const color = colorHaloPorTipo(modoEnlace.tipo);
  const evaluados = evaluarDestinos(modelo, opdId, modoEnlace.origenId, modoEnlace.tipo);
  const porApariencia = new Map(evaluados.map((item) => [item.apariencia.id, item]));
  const graph = (paper as unknown as { model: dia.Graph }).model;
  const cells = (graph as unknown as { getCells(): dia.Cell[] }).getCells();
  for (const cell of cells) {
    const meta = metadata(cell);
    if (meta?.kind !== "entidad") continue;
    const evaluado = porApariencia.get(meta.aparienciaId);
    if (!evaluado) continue;
    const view = (paper as unknown as { findViewByModel(cell: dia.Cell): dia.CellView | undefined }).findViewByModel(cell);
    const el = (view as unknown as { el?: SVGElement | HTMLElement } | undefined)?.el;
    if (!el) continue;
    el.setAttribute("data-opm-modo-enlace", evaluado.esOrigen ? "origen" : evaluado.esValido ? "destino-valido" : "destino-invalido");
    if (evaluado.razonInvalidez) el.setAttribute("data-opm-modo-enlace-razon", evaluado.razonInvalidez);
    aplicarEstilo(el, evaluado.esOrigen, evaluado.esValido, color);
  }
}

export function cablearModoEnlace(args: CablearModoEnlaceArgs): () => void {
  const {
    paper,
    modeloRef,
    opdActivoIdRef,
    modoEnlaceRef,
    crearEnlaceEntreEntidadesRef,
  } = args;
  let dragOrigenId: Id | null = null;

  const onElementPointerdown = (elementView: dia.ElementView) => {
    const modo = modoEnlaceRef.current;
    if (!modo) return;
    const meta = metadata(cellViewModel(elementView));
    if (meta?.kind !== "entidad") return;
    dragOrigenId = meta.entidadId === modo.origenId ? modo.origenId : null;
  };

  const onElementPointerup = (elementView: dia.ElementView, evt: dia.Event) => {
    const modo = modoEnlaceRef.current;
    const origenId = dragOrigenId;
    dragOrigenId = null;
    if (!modo || !origenId) return;
    const meta = metadata(cellViewModel(elementView));
    if (meta?.kind !== "entidad" || meta.entidadId === origenId) return;
    if (!entidadDestinoValida(modeloRef.current, opdActivoIdRef.current, origenId, meta.entidadId, modo.tipo)) return;
    evt.stopPropagation();
    crearEnlaceEntreEntidadesRef.current(origenId, meta.entidadId, modo.tipo);
  };

  paper.on("element:pointerdown", onElementPointerdown);
  paper.on("element:pointerup", onElementPointerup);
  return () => {
    limpiarFeedbackModoEnlace(paper);
    paperOff(paper, "element:pointerdown", onElementPointerdown as (...args: never[]) => void);
    paperOff(paper, "element:pointerup", onElementPointerup as (...args: never[]) => void);
  };
}

function limpiarFeedbackModoEnlace(paper: dia.Paper): void {
  const el = (paper as unknown as { el: HTMLElement }).el;
  for (const node of Array.from(el.querySelectorAll<HTMLElement | SVGElement>("[data-opm-modo-enlace]"))) {
    node.removeAttribute("data-opm-modo-enlace");
    node.removeAttribute("data-opm-modo-enlace-razon");
    node.style.filter = "";
    node.style.opacity = "";
    node.style.outline = "";
    node.style.outlineOffset = "";
  }
}

function aplicarEstilo(el: HTMLElement | SVGElement, esOrigen: boolean, esValido: boolean, color: string): void {
  if (esOrigen) {
    el.style.filter = `drop-shadow(0 0 0 ${color}) drop-shadow(0 0 8px ${color})`;
    el.style.outline = `2px solid ${color}`;
    el.style.outlineOffset = "4px";
    el.style.opacity = "1";
    return;
  }
  if (esValido) {
    el.style.filter = `drop-shadow(0 0 6px ${color})`;
    el.style.opacity = "1";
    return;
  }
  el.style.opacity = "0.38";
}
