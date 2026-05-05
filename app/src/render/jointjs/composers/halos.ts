import type { Apariencia, Enlace, Entidad, Id, Modelo } from "../../../modelo/tipos";
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

