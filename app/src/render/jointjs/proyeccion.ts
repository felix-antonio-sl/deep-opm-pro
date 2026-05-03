import { CANON } from "../../modelo/constantes";
import type { Apariencia, Enlace, Entidad, Id, Modelo, Posicion, TipoEnlace } from "../../modelo/tipos";

export type OpmJointMetadata =
  | {
      kind: "entidad";
      opdId: Id;
      entidadId: Id;
      aparienciaId: Id;
    }
  | {
      kind: "enlace";
      opdId: Id;
      enlaceId: Id;
      aparienciaEnlaceId: Id;
      tipo: TipoEnlace;
    };

export interface JointCellJson {
  id: Id;
  type: "standard.Rectangle" | "standard.Ellipse" | "standard.Link";
  opm: OpmJointMetadata;
  z: number;
  [key: string]: unknown;
}

export function proyectarModeloAJointCells(
  modelo: Modelo,
  opdId: Id,
  seleccionEntidadId: Id | null,
  seleccionEnlaceId: Id | null,
): JointCellJson[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];

  const apariencias = Object.values(opd.apariencias);
  const aparienciaPorEntidad = new Map(apariencias.map((apariencia) => [apariencia.entidadId, apariencia]));
  const elementos = apariencias.flatMap((apariencia) => {
    const entidad = modelo.entidades[apariencia.entidadId];
    return entidad ? [proyectarEntidad(opdId, apariencia, entidad, entidad.id === seleccionEntidadId)] : [];
  });
  const enlaces = Object.values(opd.enlaces).flatMap((aparienciaEnlace) => {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) return [];
    const origen = aparienciaPorEntidad.get(enlace.origenId);
    const destino = aparienciaPorEntidad.get(enlace.destinoId);
    return origen && destino
      ? [proyectarEnlace(opdId, enlace, aparienciaEnlace.id, origen.id, destino.id, aparienciaEnlace.vertices, enlace.id === seleccionEnlaceId)]
      : [];
  });

  return [...enlaces, ...elementos];
}

function proyectarEntidad(opdId: Id, apariencia: Apariencia, entidad: Entidad, seleccionada: boolean): JointCellJson {
  const stroke = entidad.tipo === "objeto" ? CANON.colores.objeto : CANON.colores.proceso;
  const strokeWidth = seleccionada ? CANON.dims.enlaceVisible + 2 : CANON.dims.enlaceVisible;
  const body = {
    fill: CANON.colores.relleno,
    stroke,
    strokeWidth,
    strokeDasharray: entidad.afiliacion === "ambiental" ? "8 4" : undefined,
    filter: entidad.esencia === "fisica" ? "drop-shadow(1px 2px 2px rgb(0 0 0 / 0.25))" : undefined,
    cursor: "pointer",
  };

  return {
    id: apariencia.id,
    type: entidad.tipo === "objeto" ? "standard.Rectangle" : "standard.Ellipse",
    position: { x: apariencia.x, y: apariencia.y },
    size: { width: apariencia.width, height: apariencia.height },
    attrs: {
      body: entidad.tipo === "objeto" ? { ...body, rx: 4, ry: 4 } : body,
      label: {
        text: entidad.nombre,
        fill: CANON.colores.texto,
        fontFamily: CANON.dims.fontFamily,
        fontSize: CANON.dims.fontSize,
        fontWeight: CANON.dims.fontWeight,
        textWrap: { width: -12, height: -10, ellipsis: true },
        textVerticalAnchor: "middle",
        textAnchor: "middle",
        pointerEvents: "none",
      },
    },
    opm: {
      kind: "entidad",
      opdId,
      entidadId: entidad.id,
      aparienciaId: apariencia.id,
    },
    z: 10,
  };
}

function proyectarEnlace(
  opdId: Id,
  enlace: Enlace,
  aparienciaEnlaceId: Id,
  sourceAppearanceId: Id,
  targetAppearanceId: Id,
  vertices: Posicion[],
  seleccionada: boolean,
): JointCellJson {
  return {
    id: aparienciaEnlaceId,
    type: "standard.Link",
    source: {
      id: sourceAppearanceId,
      anchor: { name: "midSide", args: { rotate: true } },
      connectionPoint: { name: "boundary", args: { offset: 1 } },
    },
    target: {
      id: targetAppearanceId,
      anchor: { name: "midSide", args: { rotate: true } },
      connectionPoint: { name: "boundary", args: { offset: 1 } },
    },
    vertices,
    router: { name: "normal" },
    connector: { name: "straight" },
    attrs: {
      wrapper: {
        stroke: "transparent",
        strokeWidth: CANON.dims.enlaceHitArea,
        cursor: "pointer",
      },
      line: {
        stroke: CANON.colores.enlace,
        strokeWidth: seleccionada ? CANON.dims.enlaceVisible + 2 : CANON.dims.enlaceVisible,
        sourceMarker: marcadorFuente(enlace.tipo),
        targetMarker: marcadorDestino(enlace.tipo),
      },
    },
    opm: {
      kind: "enlace",
      opdId,
      enlaceId: enlace.id,
      aparienciaEnlaceId,
      tipo: enlace.tipo,
    },
    z: 1,
  };
}

function marcadorFuente(tipo: TipoEnlace): Record<string, unknown> | null {
  if (tipo === "agregacion") {
    return {
      type: "path",
      d: "M 11 -8 0 0 11 8 z",
      fill: CANON.colores.enlace,
      stroke: CANON.colores.enlace,
    };
  }
  if (tipo === "agente") {
    return {
      type: "circle",
      r: 5,
      fill: CANON.colores.enlace,
      stroke: CANON.colores.enlace,
    };
  }
  if (tipo === "instrumento") {
    return {
      type: "circle",
      r: 5,
      fill: CANON.colores.relleno,
      stroke: CANON.colores.enlace,
      strokeWidth: 2,
    };
  }
  return null;
}

function marcadorDestino(tipo: TipoEnlace): Record<string, unknown> | null {
  if (tipo === "consumo" || tipo === "resultado" || tipo === "efecto" || tipo === "invocacion") {
    return {
      type: "path",
      d: "M 10 -5 0 0 10 5 z",
      fill: CANON.colores.enlace,
      stroke: CANON.colores.enlace,
    };
  }
  return null;
}
