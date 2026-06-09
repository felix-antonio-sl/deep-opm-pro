import type { dia } from "jointjs";
import { extremoEntidad } from "../../../modelo/extremos";
import { obtenerRefinamiento } from "../../../modelo/refinamientos";
import type { ExtremoEnlace, Modelo } from "../../../modelo/tipos";
import type { AjustePuertoEnlace } from "../../../modelo/operaciones";
import {
  abanicosAfectadosPorEntidad,
  recalcularOverlayDesdeLinkView,
} from "../abanicoDragSync";
import { ajustesPuertosConectadosDesdeLinkViews } from "../beautifyConnectedLinks";
import { labelKeyDesdeJoint, posicionLabelDesdeJoint } from "../labelLayout";
import type { OpmJointMetadata } from "../proyeccion";
import { ordenarEnlacesEstructuralesConectados } from "../sortStructuralLinks";
import { cellViewModel, estadoDesdeSelector, graphEvents, jointSelector, metadata, paperOff, parteEntidadDesdeSelector, posicionCanvasDesdeEvento, prevenirInteraccionNativa, selectorEsAnchorConexion } from "./helpers";
import {
  aplicarRectEstadoLive,
  gestoEstadoSuperaUmbral,
  indiceEstadoDesdeSelector,
  limitarRectEstadoAElemento,
  marcarDragEstado,
  marcarGestoEstadoActivo,
  rectSelectorEstado,
  selectorCapsulaDesdeSelector,
  type RectEstado,
} from "./estadoGeometry";

/**
 * Handlers de drag JointCanvas: pointerup para persistir movimiento de
 * apariencia, dblclick para extraer parte plegada (HU-18.* extracción),
 * change:vertices para vértices manuales editables, change:position para
 * recálculo en vivo de overlays de abanico durante drag.
 *
 * También expone `embedirContorno`: agrupa subprocesos internos como hijos
 * embebidos del contorno refinable para que JointJS arrastre subprocesos
 * con el contorno (HU-12.008 contenedor envolvente).
 *
 * Refs: HU-12.008 (contenedor), HU-12.020 (restricción interior),
 *       HU-18.* (plegado parcial + extracción).
 */

export interface CablearDragArgs {
  paper: dia.Paper;
  graph: dia.Graph;
  sincronizandoRef: { current: boolean };
  modeloRef: { current: Modelo };
  opdActivoIdRef: { current: string };
  moverAparienciaConPuertosRef: { current: (aparienciaId: string, x: number, y: number, ajustes: AjustePuertoEnlace[]) => void };
  moverEstadoEnCanvasRef: { current: (estadoId: string, x: number, y: number) => void };
  actualizarPosicionSimboloEstructuralRef: { current: (aparienciaEnlaceIds: string[], posicion: { x: number; y: number }) => void };
  actualizarPosicionLabelEnlaceRef: { current: (aparienciaEnlaceId: string, labelKey: string, posicion: { distance: number; offset?: number | { x: number; y: number }; angle?: number }) => void };
  actualizarVerticesEnlaceRef: { current: (aparienciaEnlaceId: string, vertices: { x: number; y: number }[]) => void };
  reanclarExtremoAccionRef: { current: (enlaceId: string, lado: "origen" | "destino", nuevoExtremo: ExtremoEnlace) => void };
  extraerParteDePlegadoRef: { current: (aparienciaId: string, parteEntidadId: string) => void };
  abrirRenombradoInlineRef: { current: (input: { aparienciaId: string; entidadId: string }) => void };
}

export function cablearDrag(args: CablearDragArgs): () => void {
  const {
    paper,
    graph,
    sincronizandoRef,
    modeloRef,
    opdActivoIdRef,
    moverAparienciaConPuertosRef,
    moverEstadoEnCanvasRef,
    actualizarPosicionSimboloEstructuralRef,
    actualizarPosicionLabelEnlaceRef,
    actualizarVerticesEnlaceRef,
    reanclarExtremoAccionRef,
    extraerParteDePlegadoRef,
    abrirRenombradoInlineRef,
  } = args;
  let dragEstado: DragEstadoActivo | null = null;

  const onElementPointerdown = (elementView: dia.ElementView, evt: dia.Event) => {
    if (sincronizandoRef.current) return;
    if (dragAnchorActivo(paper)) return;
    const model = cellViewModel(elementView);
    const meta = metadata(model);
    if (meta?.kind !== "entidad") return;
    const selector = jointSelector(evt.target);
    if (selectorEsAnchorConexion(selector)) return;
    const estadoId = estadoDesdeSelector(meta, selector);
    const selectorCapsula = selectorCapsulaDesdeSelector(selector);
    if (estadoId && selectorCapsula) {
      prevenirInteraccionNativa(elementView, evt);
      evt.preventDefault();
      const element = model as dia.Element;
      dragEstado = {
        element,
        estadoId,
        selectorCapsula,
        index: indiceEstadoDesdeSelector(selectorCapsula),
        startPoint: posicionCanvasDesdeEvento(paper, evt),
        startRect: rectSelectorEstado(element, selectorCapsula),
        moved: false,
      };
      marcarGestoEstadoActivo(paper, true);
      window.addEventListener("mousemove", onMouseMoveEstado);
      window.addEventListener("mouseup", onMouseUpEstado);
      return;
    }
    quitarToolsPaper(paper);
  };

  const onElementPointerup = (elementView: dia.ElementView) => {
    if (sincronizandoRef.current) return;
    if (dragAnchorActivo(paper)) return;
    if (dragEstado) {
      // BUG halo-estado: en un click sobre la cápsula (sin arrastre) JointJS
      // captura el puntero y el `mouseup` nativo no llega a `window`, por lo que
      // `onMouseUpEstado` no se dispara y `data-opm-state-gesture` queda pegado
      // en true — lo que oculta el HaloEstado de forma permanente. El
      // `element:pointerup` de JointJS sí llega de forma fiable: finalizamos el
      // gesto aquí cuando fue un click (sin movimiento). Los arrastres reales
      // los sigue cerrando `onMouseUpEstado` (que persiste la posición).
      if (!dragEstado.moved) {
        marcarDragEstado(dragEstado.element, dragEstado.selectorCapsula, false);
        dragEstado = null;
        marcarGestoEstadoActivo(paper, false);
        window.removeEventListener("mousemove", onMouseMoveEstado);
        window.removeEventListener("mouseup", onMouseUpEstado);
      }
      return;
    }
    const model = cellViewModel(elementView);
    const meta = metadata(model);
    if (meta?.kind === "grupo-enlaces" || (meta?.kind === "enlace" && meta.rolEstructural === "simbolo")) {
      const element = model as dia.Element;
      const posicion = element.position();
      const size = element.size();
      const aparienciaEnlaceIds = meta.kind === "grupo-enlaces"
        ? meta.aparienciaEnlaceIds
        : meta.aparienciaEnlaceIds?.length ? meta.aparienciaEnlaceIds : [meta.aparienciaEnlaceId];
      actualizarPosicionSimboloEstructuralRef.current(aparienciaEnlaceIds, {
        x: Math.round(posicion.x + size.width / 2),
        y: Math.round(posicion.y + size.height / 2),
      });
      return;
    }
    if (meta?.kind !== "entidad") return;
    const posicion = (model as dia.Element).position();
    ordenarEnlacesEstructuralesConectados(paper, graph, model as dia.Element);
    const ajustes = ajustesPuertosConectadosDesdeLinkViews(paper, graph, model as dia.Element);
    moverAparienciaConPuertosRef.current(meta.aparienciaId, Math.round(posicion.x), Math.round(posicion.y), ajustes);
  };

  const onElementPointerdblclick = (elementView: dia.ElementView, evt: dia.Event) => {
    evt.stopPropagation();
    const meta = metadata(cellViewModel(elementView));
    if (meta?.kind !== "entidad") return;
    const parteEntidadId = parteEntidadDesdeSelector(meta, jointSelector(evt.target));
    if (!parteEntidadId) {
      if (esSubprocesoInternoTimeline(modeloRef.current, meta)) {
        abrirRenombradoInlineRef.current({ aparienciaId: meta.aparienciaId, entidadId: meta.entidadId });
      }
      return;
    }
    extraerParteDePlegadoRef.current(meta.aparienciaId, parteEntidadId);
  };

  const onElementPointerclickRenombrado = (elementView: dia.ElementView, evt: dia.Event) => {
    const event = evt as unknown as MouseEvent;
    if (event.detail < 2) return;
    const meta = metadata(cellViewModel(elementView));
    if (meta?.kind !== "entidad") return;
    if (parteEntidadDesdeSelector(meta, jointSelector(evt.target))) return;
    if (esSubprocesoInternoTimeline(modeloRef.current, meta)) {
      evt.stopPropagation();
      abrirRenombradoInlineRef.current({ aparienciaId: meta.aparienciaId, entidadId: meta.entidadId });
    }
  };

  paper.on("element:pointerdown", onElementPointerdown);
  paper.on("element:pointerup", onElementPointerup);
  paper.on("element:pointerdblclick", onElementPointerdblclick);
  paper.on("element:pointerclick", onElementPointerclickRenombrado);

  const onMouseMoveEstado = (event: MouseEvent) => {
    if (!dragEstado) return;
    event.preventDefault();
    const punto = posicionCanvasDesdeEvento(paper, event as unknown as dia.Event);
    if (!dragEstado.moved && !gestoEstadoSuperaUmbral(dragEstado.startPoint, punto)) return;
    dragEstado.moved = true;
    marcarDragEstado(dragEstado.element, dragEstado.selectorCapsula, true);
    const rect = rectEstadoDesdeEvento(paper, dragEstado, event);
    aplicarRectEstadoLive(dragEstado.element, dragEstado.index, rect);
  };

  const onMouseUpEstado = (event: MouseEvent) => {
    if (!dragEstado) return;
    event.preventDefault();
    const activo = dragEstado;
    const rect = activo.moved ? rectEstadoDesdeEvento(paper, activo, event) : activo.startRect;
    if (activo.moved) aplicarRectEstadoLive(activo.element, activo.index, rect);
    marcarDragEstado(activo.element, activo.selectorCapsula, false);
    dragEstado = null;
    marcarGestoEstadoActivo(paper, false);
    window.removeEventListener("mousemove", onMouseMoveEstado);
    window.removeEventListener("mouseup", onMouseUpEstado);
    if (activo.moved) moverEstadoEnCanvasRef.current(activo.estadoId, rect.x, rect.y);
  };

  let dragVerticeActivo = false;
  const verticesPendientes = new Map<string, { x: number; y: number }[]>();
  const flushVerticesPendientes = () => {
    if (sincronizandoRef.current || verticesPendientes.size === 0) return;
    const pendientes = Array.from(verticesPendientes.entries());
    verticesPendientes.clear();
    for (const [aparienciaEnlaceId, vertices] of pendientes) {
      actualizarVerticesEnlaceRef.current(aparienciaEnlaceId, vertices);
    }
  };
  const finalizarDragVertice = () => {
    if (!dragVerticeActivo) return;
    dragVerticeActivo = false;
    flushVerticesPendientes();
  };
  const onPaperPointerdown = (event: PointerEvent) => {
    dragVerticeActivo = targetDentroDeVerticesTool(event.target);
  };
  const paperEl = (paper as unknown as { el: HTMLElement }).el;
  paperEl.addEventListener("pointerdown", onPaperPointerdown, true);
  window.addEventListener("pointerup", finalizarDragVertice, true);
  window.addEventListener("pointercancel", finalizarDragVertice, true);
  window.addEventListener("blur", finalizarDragVertice, true);

  graphEvents(graph).on("change:vertices", (cell: dia.Cell) => {
    if (sincronizandoRef.current || !cell.isLink()) return;
    const meta = metadata(cell);
    if (meta?.kind !== "enlace") return;
    const vertices = (cell as dia.Link).vertices().map((vertice: { x: number; y: number }) => ({ x: vertice.x, y: vertice.y }));
    if (dragVerticeActivo) {
      verticesPendientes.set(meta.aparienciaEnlaceId, vertices);
      return;
    }
    actualizarVerticesEnlaceRef.current(meta.aparienciaEnlaceId, vertices);
  });

  graphEvents(graph).on("change:labels", (cell: dia.Cell) => {
    if (sincronizandoRef.current || !cell.isLink()) return;
    const meta = metadata(cell);
    if (meta?.kind !== "enlace") return;
    const aparienciaEnlaceIds = meta.aparienciaEnlaceIds?.length ? meta.aparienciaEnlaceIds : [meta.aparienciaEnlaceId];
    for (const label of (cell as dia.Link).labels() as unknown[]) {
      const key = labelKeyDesdeJoint(label);
      const posicion = posicionLabelDesdeJoint(label);
      if (!key || !posicion) continue;
      for (const aparienciaEnlaceId of aparienciaEnlaceIds) {
        actualizarPosicionLabelEnlaceRef.current(aparienciaEnlaceId, key, posicion);
      }
    }
  });

  graphEvents(graph).on("change:source", (cell: dia.Cell) => {
    persistirReanclajeArrowhead(cell, "origen", modeloRef.current, opdActivoIdRef.current, reanclarExtremoAccionRef.current);
  });

  graphEvents(graph).on("change:target", (cell: dia.Cell) => {
    persistirReanclajeArrowhead(cell, "destino", modeloRef.current, opdActivoIdRef.current, reanclarExtremoAccionRef.current);
  });

  // Reposiciona los overlays de abanico EN VIVO mientras el usuario arrastra
  // una entidad puerto o cualquier rama del fan. Lee dock y puntos-sample
  // desde los LinkView reales (que JointJS recalcula automaticamente al
  // mover el elemento), igualando el enfoque de OpCloud en
  // shared.ts:5004-5031. Sin esto el arco se queda en la posicion previa
  // hasta el `pointerup` y "salta" disonante con el cursor.
  graphEvents(graph).on("change:position", (cell: dia.Cell) => {
    if (sincronizandoRef.current || cell.isLink()) return;
    const meta = metadata(cell);
    if (meta?.kind !== "entidad") return;
    const modeloActual = modeloRef.current;
    const opdActual = opdActivoIdRef.current;
    const afectados = abanicosAfectadosPorEntidad(modeloActual, opdActual, meta.entidadId);
    for (const abanico of afectados) {
      recalcularOverlayDesdeLinkView(paper, graph, modeloActual, abanico);
    }
  });

  return () => {
    paperOff(paper, "element:pointerdown", onElementPointerdown as (...args: never[]) => void);
    paperOff(paper, "element:pointerup", onElementPointerup as (...args: never[]) => void);
    paperOff(paper, "element:pointerdblclick", onElementPointerdblclick as (...args: never[]) => void);
    paperOff(paper, "element:pointerclick", onElementPointerclickRenombrado as (...args: never[]) => void);
    marcarGestoEstadoActivo(paper, false);
    window.removeEventListener("mousemove", onMouseMoveEstado);
    window.removeEventListener("mouseup", onMouseUpEstado);
    paperEl.removeEventListener("pointerdown", onPaperPointerdown, true);
    window.removeEventListener("pointerup", finalizarDragVertice, true);
    window.removeEventListener("pointercancel", finalizarDragVertice, true);
    window.removeEventListener("blur", finalizarDragVertice, true);
    // graphEvents listeners no se desinstalan explicitamente porque el graph
    // se destruye junto con el paper en el cleanup del componente; los
    // closures quedan recolectables.
  };
}

interface DragEstadoActivo {
  element: dia.Element;
  estadoId: string;
  selectorCapsula: string;
  index: number;
  startPoint: { x: number; y: number };
  startRect: RectEstado;
  moved: boolean;
}

function rectEstadoDesdeEvento(
  paper: dia.Paper,
  activo: DragEstadoActivo,
  event: MouseEvent,
): RectEstado {
  const punto = posicionCanvasDesdeEvento(paper, event as unknown as dia.Event);
  return limitarRectEstadoAElemento(activo.element, {
    x: Math.round(activo.startRect.x + punto.x - activo.startPoint.x),
    y: Math.round(activo.startRect.y + punto.y - activo.startPoint.y),
    width: activo.startRect.width,
    height: activo.startRect.height,
  });
}

export { selectorCapsulaDesdeSelector } from "./estadoGeometry";

function targetDentroDeVerticesTool(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return target.closest('[data-tool-name="vertices"], .joint-marker-vertex') !== null;
}

function dragAnchorActivo(paper: dia.Paper): boolean {
  return (paper as unknown as { el: HTMLElement }).el.getAttribute("data-opm-anchor-drag") === "true";
}

function quitarToolsPaper(paper: dia.Paper): void {
  (paper as unknown as { removeTools?: () => void }).removeTools?.();
}

export function persistirReanclajeArrowhead(
  cell: dia.Cell,
  lado: "origen" | "destino",
  modelo: Modelo,
  opdId: string,
  reanclarExtremoAccion: (enlaceId: string, lado: "origen" | "destino", nuevoExtremo: ExtremoEnlace) => void,
): void {
  if (!cell.isLink()) return;
  const meta = metadata(cell);
  if (meta?.kind !== "enlace") return;
  const link = cell as dia.Link;
  const extremo = lado === "origen" ? link.source() : link.target();
  const aparienciaId = typeof extremo.id === "string" ? extremo.id : null;
  if (!aparienciaId) return;
  const apariencia = modelo.opds[opdId]?.apariencias[aparienciaId];
  if (!apariencia) return;
  const enlace = modelo.enlaces[meta.enlaceId];
  const actual = lado === "origen" ? enlace?.origenId : enlace?.destinoId;
  const portId = typeof extremo.port === "string" ? extremo.port : undefined;
  if (actual?.kind === "entidad" && actual.id === apariencia.entidadId && actual.portId === portId) return;
  reanclarExtremoAccion(meta.enlaceId, lado, portId
    ? { ...extremoEntidad(apariencia.entidadId), portId }
    : extremoEntidad(apariencia.entidadId));
}

function esSubprocesoInternoTimeline(modelo: Modelo, meta: OpmJointMetadata): meta is Extract<OpmJointMetadata, { kind: "entidad" }> {
  if (meta.kind !== "entidad") return false;
  const entidad = modelo.entidades[meta.entidadId];
  if (entidad?.tipo !== "proceso") return false;
  const opd = modelo.opds[meta.opdId];
  if (!opd) return false;
  if (meta.rol === "interno") return true;
  const contorno = Object.values(opd.apariencias).find((apariencia) => {
    const refinable = modelo.entidades[apariencia.entidadId];
    return refinable?.tipo === "proceso" && obtenerRefinamiento(refinable, "descomposicion")?.opdId === opd.id;
  });
  if (!contorno || contorno.entidadId === meta.entidadId) return false;
  const apariencia = opd.apariencias[meta.aparienciaId];
  return !!apariencia &&
    apariencia.x >= contorno.x &&
    apariencia.y >= contorno.y &&
    apariencia.x + apariencia.width <= contorno.x + contorno.width &&
    apariencia.y + apariencia.height <= contorno.y + contorno.height;
}

// Identifica el contorno refinable (cell de mayor tamano marcado como entidad
// cuya apariencia define el limite del OPD activo) y le embeba todos los
// cells "entidad" cuyo centro caiga dentro de su bbox. JointJS arrastra
// automaticamente los cells embedded cuando el padre se mueve, sincronizando
// el render durante el drag visual con el delta que la kernel persiste al
// soltar (HU-12.008 contenedor envolvente; ver moverAparienciaPorId).
export function embedirContorno(graph: dia.Graph): void {
  const elementos = graph.getElements();
  if (elementos.length === 0) return;
  let contorno: dia.Element | null = null;
  for (const cell of elementos) {
    const meta = cell.prop("opm") as OpmJointMetadata | undefined;
    if (meta?.kind === "entidad" && meta.rol === "contorno") {
      contorno = cell;
      break;
    }
  }
  if (!contorno) return;

  // Embeba SOLO apariencias internas. Las externas (proxy de entidades del
  // padre) deben quedar libres: no siguen al contorno durante el drag, y al
  // arrastrarse individualmente no se confinan al bbox del contorno.
  for (const cell of elementos) {
    if (cell.id === contorno.id) continue;
    const meta = cell.prop("opm") as OpmJointMetadata | undefined;
    if (meta?.kind !== "entidad") continue;
    if (meta.rol !== "interno") continue;
    contorno.embed(cell);
  }
}
