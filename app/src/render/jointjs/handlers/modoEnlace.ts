import { shapes, type dia } from "jointjs";
import { anchorConexionDesdeSelector, colorHaloPorTipo, entidadDestinoValida, evaluarDestinos, type AnchorConexion } from "../../../canvas/modoEnlace";
import type { Id, Modelo, TipoEnlace } from "../../../modelo/tipos";
import type { ModoEnlace } from "../../../store/tipos";
import { cellViewModel, jointSelector, metadata, paperOff, posicionCanvasDesdeEvento } from "./helpers";

interface CablearModoEnlaceArgs {
  paper: dia.Paper;
  modeloRef: { current: Modelo };
  opdActivoIdRef: { current: Id };
  modoEnlaceRef: { current: ModoEnlace | null };
  iniciarConexionDesdeAparienciaRef: { current: (aparienciaId: Id, anchor: AnchorConexion) => void };
  crearEnlaceEntreEntidadesRef: { current: (origenId: Id, destinoId: Id, tipo: TipoEnlace) => void };
  cancelarEnlaceRef: { current: () => void };
  abrirMenuTipoEnlaceCanvasRef: { current: (input: MenuTipoEnlaceCanvasInput) => void };
}

export interface MenuTipoEnlaceCanvasInput {
  origenId: Id;
  destinoId: Id;
  anchor: AnchorConexion;
  clientX: number;
  clientY: number;
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
    iniciarConexionDesdeAparienciaRef,
    crearEnlaceEntreEntidadesRef,
    cancelarEnlaceRef,
    abrirMenuTipoEnlaceCanvasRef,
  } = args;
  let dragOrigenId: Id | null = null;
  let dragDesdeAnchor: {
    origenId: Id;
    aparienciaId: Id;
    anchor: AnchorConexion;
    ghost: dia.Link;
    element: dia.Element;
    posicionOriginal: { x: number; y: number };
    clientX: number;
    clientY: number;
  } | null = null;

  const onElementPointerdown = (elementView: dia.ElementView, evt: dia.Event) => {
    const cell = cellViewModel(elementView);
    const meta = metadata(cell);
    const anchor = anchorConexionDesdeSelector(jointSelector(evt.target));
    if (anchor && meta?.kind === "entidad") {
      evt.stopPropagation();
      (evt as unknown as MouseEvent).preventDefault?.();
      dragOrigenId = null;
      removerGhost(dragDesdeAnchor?.ghost);
      marcarDragAnchorActivo(paper, true);
      const element = cell as dia.Element;
      iniciarConexionDesdeAparienciaRef.current(meta.aparienciaId, anchor);
      dragDesdeAnchor = {
        origenId: meta.entidadId,
        aparienciaId: meta.aparienciaId,
        anchor,
        element,
        posicionOriginal: element.position(),
        ...puntoClienteDesdeEvento(evt),
        ghost: crearGhostEnlace(paper, puntoAnchorDesdeBBox(element.getBBox(), anchor), posicionCanvasDesdeEvento(paper, evt)),
      };
      return;
    }
    const modo = modoEnlaceRef.current;
    if (!modo) return;
    if (meta?.kind !== "entidad") return;
    dragOrigenId = meta.entidadId === modo.origenId ? modo.origenId : null;
  };

  const actualizarDragDesdeAnchor = (evt: dia.Event) => {
    if (!dragDesdeAnchor) return;
    Object.assign(dragDesdeAnchor, puntoClienteDesdeEvento(evt));
    restaurarElemento(dragDesdeAnchor.element, dragDesdeAnchor.posicionOriginal);
    fijarTargetGhost(dragDesdeAnchor.ghost, posicionCanvasDesdeEvento(paper, evt));
  };
  const onCellPointermove = (_cellView: dia.CellView, evt: dia.Event) => actualizarDragDesdeAnchor(evt);
  const onBlankPointermove = (evt: dia.Event) => actualizarDragDesdeAnchor(evt);

  const onElementPointerup = (elementView: dia.ElementView, evt: dia.Event) => {
    if (finalizarDragDesdeAnchor(elementView, evt)) return;
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

  const onBlankPointerup = (evt: dia.Event) => {
    finalizarDragDesdeAnchor(null, evt);
  };

  const finalizarDragDesdeAnchor = (elementView: dia.ElementView | null, evt: dia.Event): boolean => {
    const dragAnchor = dragDesdeAnchor;
    if (!dragAnchor) return false;
    dragDesdeAnchor = null;
    marcarDragAnchorActivo(paper, false);
    restaurarElemento(dragAnchor.element, dragAnchor.posicionOriginal);
    removerGhost(dragAnchor.ghost);
    const clientPoint = puntoClienteDesdeEvento(evt, dragAnchor);
    const metaView = metadataDestinoDesdeView(elementView);
    const meta = metaView?.kind === "entidad" && metaView.entidadId !== dragAnchor.origenId
      ? metaView
      : metadataDestinoEnPunto(paper, clientPoint);
    if (meta?.kind === "entidad" && meta.entidadId !== dragAnchor.origenId) {
      evt.stopPropagation();
      abrirMenuTipoEnlaceCanvasRef.current({
        origenId: dragAnchor.origenId,
        destinoId: meta.entidadId,
        anchor: dragAnchor.anchor,
        clientX: clientPoint.clientX,
        clientY: clientPoint.clientY,
      });
      return true;
    }
    cancelarEnlaceRef.current();
    return true;
  };

  paper.on("element:pointerdown", onElementPointerdown);
  paper.on("cell:pointermove", onCellPointermove);
  paper.on("blank:pointermove", onBlankPointermove);
  paper.on("element:pointerup", onElementPointerup);
  paper.on("blank:pointerup", onBlankPointerup);
  return () => {
    removerGhost(dragDesdeAnchor?.ghost);
    marcarDragAnchorActivo(paper, false);
    dragDesdeAnchor = null;
    limpiarFeedbackModoEnlace(paper);
    paperOff(paper, "element:pointerdown", onElementPointerdown as (...args: never[]) => void);
    paperOff(paper, "cell:pointermove", onCellPointermove as (...args: never[]) => void);
    paperOff(paper, "blank:pointermove", onBlankPointermove as (...args: never[]) => void);
    paperOff(paper, "element:pointerup", onElementPointerup as (...args: never[]) => void);
    paperOff(paper, "blank:pointerup", onBlankPointerup as (...args: never[]) => void);
  };
}

export function puntoAnchorDesdeBBox(
  bbox: { x: number; y: number; width: number; height: number },
  anchor: AnchorConexion,
): { x: number; y: number } {
  if (anchor === "N") return { x: bbox.x + bbox.width / 2, y: bbox.y };
  if (anchor === "E") return { x: bbox.x + bbox.width, y: bbox.y + bbox.height / 2 };
  if (anchor === "S") return { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height };
  return { x: bbox.x, y: bbox.y + bbox.height / 2 };
}

function crearGhostEnlace(
  paper: dia.Paper,
  source: { x: number; y: number },
  target: { x: number; y: number },
): dia.Link {
  const graph = (paper as unknown as { model: dia.Graph }).model;
  const ghost = new shapes.standard.Link({
    source,
    target,
    attrs: {
      line: {
        stroke: "#586D8C",
        strokeDasharray: "6 4",
        strokeWidth: 2,
        pointerEvents: "none",
        targetMarker: { type: "path", d: "M 8 -4 0 0 8 4 z", fill: "#586D8C", stroke: "none" },
      },
      wrapper: { stroke: "transparent", strokeWidth: 14, pointerEvents: "none" },
    },
    z: 5,
  }) as dia.Link;
  ghost.addTo(graph);
  return ghost;
}

function removerGhost(ghost: dia.Link | null | undefined): void {
  ghost?.remove();
}

function fijarTargetGhost(ghost: dia.Link, target: { x: number; y: number }): void {
  (ghost as unknown as { target(point: { x: number; y: number }): void }).target(target);
}

function restaurarElemento(element: dia.Element, posicion: { x: number; y: number }): void {
  const actual = element.position();
  if (Math.round(actual.x) === Math.round(posicion.x) && Math.round(actual.y) === Math.round(posicion.y)) return;
  element.position(posicion.x, posicion.y);
}

function marcarDragAnchorActivo(paper: dia.Paper, activo: boolean): void {
  const el = (paper as unknown as { el: HTMLElement }).el;
  if (activo) el.setAttribute("data-opm-anchor-drag", "true");
  else el.removeAttribute("data-opm-anchor-drag");
}

function metadataDestinoDesdeView(elementView: dia.ElementView | null): ReturnType<typeof metadata> {
  return elementView ? metadata(cellViewModel(elementView)) : null;
}

function metadataDestinoEnPunto(
  paper: dia.Paper,
  clientPoint: { clientX: number; clientY: number },
): ReturnType<typeof metadata> {
  const paperConCoords = paper as unknown as {
    clientToLocalPoint?: (x: number, y: number) => { x: number; y: number };
  };
  const punto = paperConCoords.clientToLocalPoint?.(clientPoint.clientX, clientPoint.clientY) ?? { x: 0, y: 0 };
  const paperConBusqueda = paper as unknown as {
    findElementViewsAtPoint?: (point: { x: number; y: number }, opt?: Record<string, unknown>) => dia.ElementView[];
    findViewsFromPoint?: (point: { x: number; y: number }) => dia.ElementView[];
    findView?: (element: Element) => dia.CellView | undefined;
  };
  const views = paperConBusqueda.findElementViewsAtPoint?.(punto, { strict: false })
    ?? paperConBusqueda.findViewsFromPoint?.(punto)
    ?? [];
  for (const view of views) {
    const meta = metadata(cellViewModel(view));
    if (meta?.kind === "entidad") return meta;
  }
  const element = document.elementFromPoint(clientPoint.clientX, clientPoint.clientY);
  const view = element ? paperConBusqueda.findView?.(element) : undefined;
  return view ? metadata(cellViewModel(view)) : null;
}

function puntoClienteDesdeEvento(
  evt: dia.Event,
  fallback?: { clientX: number; clientY: number },
): { clientX: number; clientY: number } {
  const event = evt as unknown as MouseEvent;
  const clientX = Number.isFinite(event.clientX) ? event.clientX : fallback?.clientX;
  const clientY = Number.isFinite(event.clientY) ? event.clientY : fallback?.clientY;
  return { clientX: clientX ?? 0, clientY: clientY ?? 0 };
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
