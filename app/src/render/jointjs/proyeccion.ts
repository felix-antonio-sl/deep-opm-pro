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
  type: "standard.Rectangle" | "standard.Ellipse" | "standard.Link" | "standard.Polygon";
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
    if (!origen || !destino) return [];
    return enlace.tipo === "agregacion"
      ? proyectarAgregacion(opdId, enlace, aparienciaEnlace.id, origen, destino, enlace.id === seleccionEnlaceId)
      : [proyectarEnlace(opdId, enlace, aparienciaEnlace.id, origen.id, destino.id, aparienciaEnlace.vertices, enlace.id === seleccionEnlaceId)];
  });

  return [...enlaces, ...elementos];
}

function proyectarEntidad(opdId: Id, apariencia: Apariencia, entidad: Entidad, seleccionada: boolean): JointCellJson {
  const stroke = entidad.tipo === "objeto" ? CANON.colores.objeto : CANON.colores.proceso;
  const refinada = entidad.tipo === "proceso" && entidad.refinamiento?.tipo === "descomposicion";
  const strokeBase = refinada ? 4 : CANON.dims.enlaceVisible;
  const strokeWidth = seleccionada ? strokeBase + 2 : strokeBase;
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
        textWrap: { width: -12 },
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
    router: routerManhattan(),
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

function proyectarAgregacion(
  opdId: Id,
  enlace: Enlace,
  aparienciaEnlaceId: Id,
  origen: Apariencia,
  destino: Apariencia,
  seleccionada: boolean,
): JointCellJson[] {
  const triangleSize = 30;
  const source = centro(origen);
  const target = centro(destino);
  const center = {
    x: source.x + (target.x - source.x) * 0.38,
    y: source.y + (target.y - source.y) * 0.38,
  };
  const triangleId = `${aparienciaEnlaceId}-triangulo`;
  const meta: OpmJointMetadata = {
    kind: "enlace",
    opdId,
    enlaceId: enlace.id,
    aparienciaEnlaceId,
    tipo: enlace.tipo,
  };
  const lineAttrs = attrsLinea(seleccionada);
  return [
    {
      id: `${aparienciaEnlaceId}-refinable`,
      type: "standard.Link",
      source: extremo(origen.id),
      target: extremo(triangleId),
      router: routerManhattan(),
      connector: { name: "straight" },
      attrs: lineAttrs,
      opm: meta,
      z: 1,
    },
    {
      id: `${aparienciaEnlaceId}-refinador`,
      type: "standard.Link",
      source: extremo(triangleId),
      target: extremo(destino.id),
      router: routerManhattan(),
      connector: { name: "straight" },
      attrs: lineAttrs,
      opm: meta,
      z: 1,
    },
    {
      id: triangleId,
      type: "standard.Polygon",
      position: { x: center.x - triangleSize / 2, y: center.y - triangleSize / 2 },
      size: { width: triangleSize, height: triangleSize },
      angle: anguloTriangulo(source, center),
      attrs: {
        body: {
          refPoints: "0,15 30,0 30,30",
          fill: CANON.colores.relleno,
          stroke: CANON.colores.enlace,
          strokeWidth: seleccionada ? CANON.dims.enlaceVisible + 2 : CANON.dims.enlaceVisible,
          cursor: "pointer",
        },
        label: {
          text: "",
          display: "none",
        },
      },
      opm: meta,
      z: 2,
    },
  ];
}

function marcadorFuente(tipo: TipoEnlace): Record<string, unknown> | null {
  if (tipo === "agente" || tipo === "instrumento") {
    return marcadorCorcheteAbierto();
  }
  if (tipo === "efecto") {
    return marcadorPuntaCerrada();
  }
  return null;
}

function marcadorDestino(tipo: TipoEnlace): Record<string, unknown> | null {
  if (tipo === "agente") {
    return marcadorPiruleta(true);
  }
  if (tipo === "instrumento") {
    return marcadorPiruleta(false);
  }
  if (tipo === "consumo" || tipo === "resultado" || tipo === "efecto") {
    return marcadorPuntaCerrada();
  }
  if (tipo === "invocacion") {
    return marcadorInvocacion();
  }
  return null;
}

function attrsLinea(seleccionada: boolean): Record<string, unknown> {
  return {
    wrapper: {
      stroke: "transparent",
      strokeWidth: CANON.dims.enlaceHitArea,
      cursor: "pointer",
    },
    line: {
      stroke: CANON.colores.enlace,
      strokeWidth: seleccionada ? CANON.dims.enlaceVisible + 2 : CANON.dims.enlaceVisible,
      targetMarker: null,
    },
  };
}

function extremo(id: Id): Record<string, unknown> {
  return {
    id,
    anchor: { name: "midSide", args: { rotate: true } },
    connectionPoint: { name: "boundary", args: { offset: 1 } },
  };
}

function centro(apariencia: Apariencia): Posicion {
  return {
    x: apariencia.x + apariencia.width / 2,
    y: apariencia.y + apariencia.height / 2,
  };
}

function anguloTriangulo(source: Posicion, center: Posicion): number {
  const angleToSource = Math.atan2(source.y - center.y, source.x - center.x) * 180 / Math.PI;
  return angleToSource - 180;
}

function routerManhattan(): Record<string, unknown> {
  return { name: "manhattan", args: { padding: 5, step: 11 } };
}

function marcadorPuntaCerrada(): Record<string, unknown> {
  return {
    type: "path",
    d: "M 10 -5 0 0 10 5 z",
    fill: CANON.colores.enlace,
    stroke: CANON.colores.enlace,
  };
}

function marcadorPiruleta(rellena: boolean): Record<string, unknown> {
  return {
    type: "circle",
    r: 5,
    fill: rellena ? CANON.colores.enlace : CANON.colores.relleno,
    stroke: CANON.colores.enlace,
    strokeWidth: rellena ? 1 : 2,
  };
}

function marcadorCorcheteAbierto(): Record<string, unknown> {
  return {
    type: "path",
    d: "M 8 -8 L 0 -8 L 0 8 L 8 8",
    fill: "none",
    stroke: CANON.colores.enlace,
    strokeWidth: 2,
  };
}

function marcadorInvocacion(): Record<string, unknown> {
  return {
    type: "path",
    d: "M 12 -7 L 4 -1 L 9 1 L 0 8 L 5 1 L 0 -1 z",
    fill: CANON.colores.relleno,
    stroke: CANON.colores.enlace,
    strokeWidth: 2,
  };
}
