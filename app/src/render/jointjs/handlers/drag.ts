import type { dia } from "jointjs";
import { extremoEntidad } from "../../../modelo/extremos";
import { obtenerRefinamiento } from "../../../modelo/refinamientos";
import type { Modelo } from "../../../modelo/tipos";
import {
  abanicosAfectadosPorEntidad,
  recalcularOverlayDesdeLinkView,
} from "../abanicoDragSync";
import type { OpmJointMetadata } from "../proyeccion";
import { cellViewModel, graphEvents, jointSelector, metadata, paperOff, parteEntidadDesdeSelector } from "./helpers";

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
  moverAparienciaRef: { current: (aparienciaId: string, x: number, y: number) => void };
  actualizarVerticesEnlaceRef: { current: (aparienciaEnlaceId: string, vertices: { x: number; y: number }[]) => void };
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
    moverAparienciaRef,
    actualizarVerticesEnlaceRef,
    extraerParteDePlegadoRef,
    abrirRenombradoInlineRef,
  } = args;

  const onElementPointerup = (elementView: dia.ElementView) => {
    if (sincronizandoRef.current) return;
    const model = cellViewModel(elementView);
    const meta = metadata(model);
    if (meta?.kind !== "entidad") return;
    const posicion = (model as dia.Element).position();
    moverAparienciaRef.current(meta.aparienciaId, Math.round(posicion.x), Math.round(posicion.y));
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

  paper.on("element:pointerup", onElementPointerup);
  paper.on("element:pointerdblclick", onElementPointerdblclick);
  paper.on("element:pointerclick", onElementPointerclickRenombrado);

  graphEvents(graph).on("change:vertices", (cell: dia.Cell) => {
    if (sincronizandoRef.current || !cell.isLink()) return;
    const meta = metadata(cell);
    if (meta?.kind !== "enlace") return;
    actualizarVerticesEnlaceRef.current(
      meta.aparienciaEnlaceId,
      (cell as dia.Link).vertices().map((vertice: { x: number; y: number }) => ({ x: vertice.x, y: vertice.y })),
    );
  });

  graphEvents(graph).on("change:source", (cell: dia.Cell) => {
    persistirReanclajeArrowhead(cell, "origen", modeloRef.current, opdActivoIdRef.current);
  });

  graphEvents(graph).on("change:target", (cell: dia.Cell) => {
    persistirReanclajeArrowhead(cell, "destino", modeloRef.current, opdActivoIdRef.current);
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
    paperOff(paper, "element:pointerup", onElementPointerup as (...args: never[]) => void);
    paperOff(paper, "element:pointerdblclick", onElementPointerdblclick as (...args: never[]) => void);
    paperOff(paper, "element:pointerclick", onElementPointerclickRenombrado as (...args: never[]) => void);
    // graphEvents listeners no se desinstalan explicitamente porque el graph
    // se destruye junto con el paper en el cleanup del componente; los
    // closures quedan recolectables.
  };
}

function persistirReanclajeArrowhead(
  cell: dia.Cell,
  lado: "origen" | "destino",
  modelo: Modelo,
  opdId: string,
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
  if (actual?.kind === "entidad" && actual.id === apariencia.entidadId) return;
  void import("../../../store").then(({ store }) => {
    store.getState().reanclarExtremoAccion(meta.enlaceId, lado, extremoEntidad(apariencia.entidadId));
  });
}

function esSubprocesoInternoTimeline(modelo: Modelo, meta: OpmJointMetadata): meta is Extract<OpmJointMetadata, { kind: "entidad" }> {
  if (meta.kind !== "entidad") return false;
  const entidad = modelo.entidades[meta.entidadId];
  if (entidad?.tipo !== "proceso") return false;
  const opd = modelo.opds[meta.opdId];
  if (!opd) return false;
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
