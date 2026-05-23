import type { Apariencia, Enlace, Entidad, Id, Modelo, Estado } from "../../../modelo/tipos";
import type { OplReferencia } from "../../../opl/interaccion";
import { jointCanvasPalette } from "../palette";
import type { JointCellJson } from "../proyeccionTipos";
import { puntoCapsulaEstado, rectCapsulaEstado } from "./estados";

/**
 * Composer de halos transitorios de seleccion y hover OPL. No serializa
 * estado; emite solo celdas JointJS derivadas. Consumidor: proyeccion.ts.
 */
export function proyectarHaloSeleccion(opdId: Id, apariencia: Apariencia, entidad: Entidad): JointCellJson {
  const pad = 4;
  const type = entidad.tipo === "objeto" ? "standard.Rectangle" : "standard.Ellipse";
  const width = apariencia.width + pad * 2;
  const height = apariencia.height + pad * 2;
  return {
    id: `seleccion-${apariencia.id}`,
    type,
    position: { x: apariencia.x - pad, y: apariencia.y - pad },
    size: { width, height },
    attrs: {
      body: entidad.tipo === "objeto"
        ? {
            fill: "transparent",
            stroke: jointCanvasPalette.seleccion,
            strokeWidth: 2,
            rx: 6,
            ry: 6,
            pointerEvents: "none",
          }
        : {
            fill: "transparent",
            stroke: jointCanvasPalette.seleccion,
            strokeWidth: 2,
            cx: width / 2,
            cy: height / 2,
            rx: width / 2,
            ry: height / 2,
            pointerEvents: "none",
          },
      label: { text: "", display: "none" },
    },
    opm: {
      kind: "selection-halo",
      opdId,
      targetId: entidad.id,
    },
    z: 30,
  };
}

export function proyectarHaloSeleccionEstado(
  modelo: Modelo,
  opdId: Id,
  apariencia: Apariencia,
  estado: Estado,
): JointCellJson | null {
  const rect = rectCapsulaEstado(modelo, apariencia, estado.id);
  if (!rect) return null;

  const pad = 3;
  const width = rect.width + pad * 2;
  const height = rect.height + pad * 2;
  return {
    id: `seleccion-estado-${apariencia.id}-${estado.id}`,
    type: "standard.Rectangle",
    position: { x: rect.x - pad, y: rect.y - pad },
    size: { width, height },
    attrs: {
      body: {
        fill: "transparent",
        stroke: jointCanvasPalette.seleccion,
        strokeWidth: 2,
        rx: 10,
        ry: 10,
        pointerEvents: "none",
      },
      label: { text: "", display: "none" },
    },
    opm: {
      kind: "selection-halo",
      opdId,
      targetId: estado.id,
      targetKind: "estado",
    },
    z: 37,
  };
}

export function refResaltaEntidad(modelo: Modelo, entidad: Entidad, ref: OplReferencia | null): boolean {
  if (!ref) return false;
  if (ref.tipo === "entidad") return ref.id === entidad.id;
  if (ref.tipo === "estado") return modelo.estados[ref.id]?.entidadId === entidad.id;
  return false;
}

export function refResaltaEnlace(enlace: Enlace, ref: OplReferencia | null): boolean {
  return ref?.tipo === "enlace" && ref.id === enlace.id;
}

/**
 * Halo del proceso activo en modo simulación (Ronda 17 L2 — pulido visual).
 * Color verde brillante diferenciado del halo azul de selección y del halo
 * amarillo `idsResaltadosTemporales`. Stroke más grueso para hacerlo
 * inmediatamente legible.
 */
export function proyectarHaloSimulacionProceso(opdId: Id, apariencia: Apariencia, entidad: Entidad): JointCellJson {
  const pad = 6;
  const width = apariencia.width + pad * 2;
  const height = apariencia.height + pad * 2;
  return {
    id: `sim-proceso-${apariencia.id}`,
    type: "standard.Ellipse",
    position: { x: apariencia.x - pad, y: apariencia.y - pad },
    size: { width, height },
    attrs: {
      body: {
        fill: "transparent",
        stroke: "#16a34a",
        strokeWidth: 3,
        strokeDasharray: "6 3",
        cx: width / 2,
        cy: height / 2,
        rx: width / 2,
        ry: height / 2,
        pointerEvents: "none",
      },
      label: { text: "", display: "none" },
    },
    opm: {
      kind: "simulacion-halo",
      opdId,
      targetId: entidad.id,
      tipo: "proceso-activo",
    },
    z: 35,
  };
}

export function proyectarHaloSimulacionEntidadInvolucrada(opdId: Id, apariencia: Apariencia, entidad: Entidad): JointCellJson {
  const pad = 5;
  const type = entidad.tipo === "objeto" ? "standard.Rectangle" : "standard.Ellipse";
  const width = apariencia.width + pad * 2;
  const height = apariencia.height + pad * 2;
  return {
    id: `sim-involucrada-${apariencia.id}`,
    type,
    position: { x: apariencia.x - pad, y: apariencia.y - pad },
    size: { width, height },
    // CANON-V2 (ronda 28 L4): halo entidad-involucrada en simulacion =
    // cinabrio dashed (antes #3BC3FF azul proceso V1, colision con fill
    // proceso lavado). Cinabrio es el unico canal de "estado activo" en V2.
    attrs: {
      body: entidad.tipo === "objeto"
        ? {
            fill: "rgba(200, 57, 47, 0.08)",
            stroke: "#C8392F",
            strokeWidth: 2,
            strokeDasharray: "3 3",
            rx: 7,
            ry: 7,
            pointerEvents: "none",
          }
        : {
            fill: "rgba(200, 57, 47, 0.08)",
            stroke: "#C8392F",
            strokeWidth: 2,
            strokeDasharray: "3 3",
            cx: width / 2,
            cy: height / 2,
            rx: width / 2,
            ry: height / 2,
            pointerEvents: "none",
          },
      label: { text: "", display: "none" },
    },
    opm: {
      kind: "simulacion-halo",
      opdId,
      targetId: entidad.id,
      tipo: "entidad-involucrada",
    },
    z: 33,
  };
}

/**
 * Halo del estado current de un objeto en modo simulación. Color dorado
 * suave; cuando el estado esta visible como capsula interna, usa un pin
 * externo anclado al borde del estado (SSOT V-54/V-133). Si la capsula no
 * puede localizarse, cae al halo de objeto completo como degradacion segura.
 */
export function proyectarHaloSimulacionEstadoCurrent(
  modelo: Modelo,
  opdId: Id,
  apariencia: Apariencia,
  entidad: Entidad,
  estado: Estado,
): JointCellJson {
  const punto = puntoCapsulaEstado(modelo, apariencia, estado.id);
  if (punto) {
    const width = 14;
    const height = 18;
    return {
      id: `sim-current-${apariencia.id}-${estado.id}`,
      type: "standard.Path",
      position: { x: punto.x - width / 2, y: punto.y - height - 12 },
      size: { width, height },
      attrs: {
        body: {
          d: "M7 0 C3 0 0 3 0 7 c0 5 7 11 7 11 s7-6 7-11 C14 3 11 0 7 0 Z",
          fill: "#f59e0b",
          stroke: "#92400e",
          strokeWidth: 1.5,
          pointerEvents: "none",
        },
        label: { text: "", display: "none" },
      },
      opm: {
        kind: "simulacion-halo",
        opdId,
        targetId: entidad.id,
        tipo: "estado-current",
      },
      z: 36,
    };
  }

  const pad = 3;
  const width = apariencia.width + pad * 2;
  const height = apariencia.height + pad * 2;
  return {
    id: `sim-current-${apariencia.id}-${estado.id}`,
    type: "standard.Rectangle",
    position: { x: apariencia.x - pad, y: apariencia.y - pad },
    size: { width, height },
    attrs: {
      body: {
        fill: "transparent",
        stroke: "#f59e0b",
        strokeWidth: 2,
        rx: 8,
        ry: 8,
        pointerEvents: "none",
      },
      label: { text: "", display: "none" },
    },
    opm: {
      kind: "simulacion-halo",
      opdId,
      targetId: entidad.id,
      tipo: "estado-current",
    },
    z: 34,
  };
}
