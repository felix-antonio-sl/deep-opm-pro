import type { Apariencia, Enlace, Entidad, Id, Modelo, Estado } from "../../../modelo/tipos";
import type { OplReferencia } from "../../../opl/interaccion";
import type { JointCellJson } from "../proyeccionTipos";

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
            stroke: "#3DA8FF",
            strokeWidth: 2,
            rx: 6,
            ry: 6,
            pointerEvents: "none",
          }
        : {
            fill: "transparent",
            stroke: "#3DA8FF",
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

/**
 * Halo del estado current de un objeto en modo simulación. Color dorado
 * suave; pad menor que el del proceso. Se dibuja sobre la apariencia del
 * objeto (no del estado, que vive embebido dentro).
 */
export function proyectarHaloSimulacionEstadoCurrent(
  opdId: Id,
  apariencia: Apariencia,
  entidad: Entidad,
  estado: Estado,
): JointCellJson {
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

