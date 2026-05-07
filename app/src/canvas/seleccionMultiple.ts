import { entidadIdDeExtremo } from "../modelo/extremos";
import type { Apariencia, Id, Modelo } from "../modelo/tipos";

export type ModoSeleccion = "simple" | "multi" | "rectangulo";

export interface BBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EstadoSeleccion {
  seleccionados: Id[];
  modo: ModoSeleccion;
}

export function vacia(): EstadoSeleccion {
  return { seleccionados: [], modo: "simple" };
}

export function setSeleccion(s: EstadoSeleccion, ids: Id[]): EstadoSeleccion {
  const seleccionados = unicos(ids);
  return {
    seleccionados,
    modo: seleccionados.length > 1 ? "multi" : "simple",
  };
}

export function agregar(s: EstadoSeleccion, id: Id): EstadoSeleccion {
  if (s.seleccionados.includes(id)) return s;
  return setSeleccion(s, [...s.seleccionados, id]);
}

export function quitar(s: EstadoSeleccion, id: Id): EstadoSeleccion {
  if (!s.seleccionados.includes(id)) return s;
  return setSeleccion(s, s.seleccionados.filter((actual) => actual !== id));
}

export function toggle(s: EstadoSeleccion, id: Id): EstadoSeleccion {
  return s.seleccionados.includes(id) ? quitar(s, id) : agregar(s, id);
}

export function todasDelOpd(modelo: Modelo, opdId: Id): Id[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  return [
    ...Object.values(opd.apariencias).map((apariencia) => apariencia.entidadId),
    ...Object.values(opd.enlaces).map((apariencia) => apariencia.enlaceId),
  ];
}

/**
 * Retorna enlaces logical cuyos extremos estan contenidos en la seleccion
 * visible del OPD activo.
 *
 * SSOT: [Met §multi-OPD] la seleccion opera sobre apariencias de una vista;
 * [Glos 3.6] las apariencias no duplican hechos de modelo.
 */
export function enlacesInternosSeleccion(modelo: Modelo, opdId: Id, aparienciasIds: readonly Id[]): Id[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  const seleccion = new Set(aparienciasIds);
  const entidadesSeleccionadas = new Set<Id>();

  for (const apariencia of Object.values(opd.apariencias)) {
    if (seleccion.has(apariencia.id) || seleccion.has(apariencia.entidadId)) {
      entidadesSeleccionadas.add(apariencia.entidadId);
    }
  }
  if (entidadesSeleccionadas.size < 2) return [];

  return Object.values(modelo.enlaces)
    .filter((enlace) => {
      const origen = entidadIdDeExtremo(modelo, enlace.origenId);
      const destino = entidadIdDeExtremo(modelo, enlace.destinoId);
      return !!origen && !!destino && entidadesSeleccionadas.has(origen) && entidadesSeleccionadas.has(destino);
    })
    .map((enlace) => enlace.id);
}

export function interseccionRectangulo(modelo: Modelo, opdId: Id, rect: BBox): Id[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  const normalizado = normalizarRect(rect);
  const ids: Id[] = [];

  for (const apariencia of Object.values(opd.apariencias)) {
    if (intersectan(normalizado, bboxApariencia(apariencia))) ids.push(apariencia.entidadId);
  }

  for (const aparienciaEnlace of Object.values(opd.enlaces)) {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) continue;
    const origenId = enlace.origenId.kind === "entidad" ? enlace.origenId.id : modelo.estados[enlace.origenId.id]?.entidadId;
    const destinoId = enlace.destinoId.kind === "entidad" ? enlace.destinoId.id : modelo.estados[enlace.destinoId.id]?.entidadId;
    const origen = origenId ? Object.values(opd.apariencias).find((ap) => ap.entidadId === origenId) : undefined;
    const destino = destinoId ? Object.values(opd.apariencias).find((ap) => ap.entidadId === destinoId) : undefined;
    const puntos = [
      ...(origen ? [centro(origen)] : []),
      ...aparienciaEnlace.vertices,
      ...(destino ? [centro(destino)] : []),
    ];
    if (puntos.length === 0) continue;
    if (intersectan(normalizado, bboxPuntos(puntos, 4))) ids.push(enlace.id);
  }

  return unicos(ids);
}

function unicos(ids: Id[]): Id[] {
  return [...new Set(ids.filter(Boolean))];
}

function normalizarRect(rect: BBox): BBox {
  const x1 = Math.min(rect.x, rect.x + rect.width);
  const y1 = Math.min(rect.y, rect.y + rect.height);
  const x2 = Math.max(rect.x, rect.x + rect.width);
  const y2 = Math.max(rect.y, rect.y + rect.height);
  return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
}

function bboxApariencia(apariencia: Apariencia): BBox {
  return {
    x: apariencia.x,
    y: apariencia.y,
    width: apariencia.width,
    height: apariencia.height,
  };
}

function centro(apariencia: Apariencia): { x: number; y: number } {
  return {
    x: apariencia.x + apariencia.width / 2,
    y: apariencia.y + apariencia.height / 2,
  };
}

function bboxPuntos(puntos: Array<{ x: number; y: number }>, padding: number): BBox {
  const xs = puntos.map((p) => p.x);
  const ys = puntos.map((p) => p.y);
  const minX = Math.min(...xs) - padding;
  const minY = Math.min(...ys) - padding;
  const maxX = Math.max(...xs) + padding;
  const maxY = Math.max(...ys) + padding;
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function intersectan(a: BBox, b: BBox): boolean {
  return a.x <= b.x + b.width &&
    a.x + a.width >= b.x &&
    a.y <= b.y + b.height &&
    a.y + a.height >= b.y;
}
