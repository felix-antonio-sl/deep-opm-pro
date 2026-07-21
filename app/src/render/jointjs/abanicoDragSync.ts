import type { dia } from "jointjs";
import { proyeccionesAbanicoEnOpd, puertoComunDeAbanico } from "../../modelo/abanicos";
import { entidadIdDeExtremo } from "../../modelo/extremos";
import type { Abanico, Id, Modelo, Posicion } from "../../modelo/tipos";
import { calcularGeometriaAbanicoDesdePuntos } from "./abanicoOverlay";

// Distancia (px) sobre cada link a la que tomamos el punto-sample para
// calcular el angulo del arco. OpCloud usa 30 (shared.ts:5004), igualando
// el radio interno del arco para que el punto quede sobre la curva.
const RADIO_PROBE = 30;

// Devuelve los abanicos del OPD activo donde la entidad participa, ya sea
// como puerto compartido o como otro extremo de alguna rama. Necesario para
// limitar el recompute al subset afectado durante el drag visual.
export function abanicosAfectadosPorEntidad(modelo: Modelo, opdId: Id, entidadId: Id): Abanico[] {
  const result: Abanico[] = [];
  for (const { abanico } of proyeccionesAbanicoEnOpd(modelo, opdId).filter((proyeccion) => proyeccion.completa)) {
    const puertoComun = puertoComunDeAbanico(abanico);
    if (puertoComun.entidadId === entidadId) {
      result.push(abanico);
      continue;
    }
    const involucra = abanico.enlaceIds.some((enlaceId) => {
      const enlace = modelo.enlaces[enlaceId];
      if (!enlace) return false;
      const oId = entidadIdDeExtremo(modelo, enlace.origenId);
      const dId = entidadIdDeExtremo(modelo, enlace.destinoId);
      return oId === entidadId || dId === entidadId;
    });
    if (involucra) result.push(abanico);
  }
  return result;
}

// Reposiciona TODOS los overlays del OPD activo leyendo dock y puntos-sample
// desde los LinkView reales del paper. Es la unica fuente de verdad para la
// posicion del arco: el cold path (geometrico) que produce proyectarOverlay
// solo sirve como placeholder antes del primer paint.
export function recalcularOverlaysAbanicoDesdeLinkViews(args: {
  paper: dia.Paper;
  graph: dia.Graph;
  modelo: Modelo;
  opdId: Id;
}): void {
  for (const { abanico } of proyeccionesAbanicoEnOpd(args.modelo, args.opdId).filter((proyeccion) => proyeccion.completa)) {
    recalcularOverlayDesdeLinkView(args.paper, args.graph, args.modelo, abanico, args.opdId);
  }
}

// Sincroniza un overlay puntual leyendo del LinkView. Usar como reaccion a
// `change:position` para cubrir el subset afectado durante el drag.
export function recalcularOverlayDesdeLinkView(
  paper: dia.Paper,
  graph: dia.Graph,
  modelo: Modelo,
  abanico: Abanico,
  opdId: Id = abanico.opdId,
): void {
  const overlayCell = graph.getCell(`overlay-abanico-${abanico.id}`);
  if (!overlayCell) return;
  const opd = modelo.opds[opdId];
  if (!opd) return;

  // Mapa enlaceId -> aparienciaEnlaceId (el cell id en el graph)
  const apEnlaceById = new Map<Id, Id>();
  for (const ae of Object.values(opd.enlaces)) {
    apEnlaceById.set(ae.enlaceId, ae.id);
  }

  const linkViews: dia.LinkView[] = [];
  const puertoComun = puertoComunDeAbanico(abanico);
  const side: "source" | "target" = puertoComun.lado === "origen" ? "source" : "target";
  for (const enlaceId of abanico.enlaceIds) {
    const enlace = modelo.enlaces[enlaceId];
    if (!enlace) continue;
    const extremoComun = puertoComun.lado === "origen" ? enlace.origenId : enlace.destinoId;
    if (
      extremoComun.kind !== "entidad" ||
      extremoComun.id !== puertoComun.entidadId ||
      extremoComun.portId !== puertoComun.portId
    ) continue;
    const aeId = apEnlaceById.get(enlaceId);
    if (!aeId) continue;
    const cell = graph.getCell(aeId);
    if (!cell || !cell.isLink()) continue;
    const view = paper.findViewByModel(cell) as dia.LinkView | null;
    if (!view) continue;
    linkViews.push(view);
  }
  if (linkViews.length < 2) return;

  // dock = endpoint REAL que JointJS computo (shared.ts:5023-5031). Para
  // procesos (elipse) JointJS ya intersecta correctamente con el borde
  // curvo, asi que tomamos el punto sin recalcular geometria. Usamos
  // getPointAtLength(0)/getPointAtLength(len) en vez de sourcePoint/
  // targetPoint porque solo el primero esta en el .d.ts publico.
  const firstView = linkViews[0]!;
  const firstLen = firstView.getConnectionLength();
  if (!Number.isFinite(firstLen) || firstLen <= 0) return;
  const dockRaw = side === "source"
    ? firstView.getPointAtLength(0)
    : firstView.getPointAtLength(firstLen);
  if (!dockRaw) return;
  const dock: Posicion = { x: dockRaw.x, y: dockRaw.y };

  // Cada link contribuye un punto a RADIO_PROBE del dock sobre la linea real.
  const puntosOtros: Posicion[] = [];
  for (const view of linkViews) {
    const len = view.getConnectionLength();
    if (!Number.isFinite(len) || len <= 0) continue;
    const lenProbe = Math.min(RADIO_PROBE, Math.max(1, len * 0.45));
    const dist = side === "source" ? lenProbe : Math.max(0, len - lenProbe);
    const punto = view.getPointAtLength(dist);
    if (!punto) continue;
    puntosOtros.push({ x: punto.x, y: punto.y });
  }
  if (puntosOtros.length < 2) return;

  const geometria = calcularGeometriaAbanicoDesdePuntos({
    dock,
    puntosOtros,
    operador: abanico.operador,
  });
  if (!geometria) return;

  const elem = overlayCell as dia.Element;
  elem.position(geometria.position.x, geometria.position.y);
  elem.resize(geometria.size.width, geometria.size.height);
  overlayCell.attr("body/d", geometria.d);
}
