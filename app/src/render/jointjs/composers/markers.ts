import { CANON } from "../../../modelo/constantes";
import type { Enlace, Id, Posicion, SubtipoModificador, TipoEnlace } from "../../../modelo/tipos";
import { LINK_ASSETS } from "../linkAssets";
import type { JointCellJson, OpmJointMetadata } from "../proyeccionTipos";

/**
 * Composer de markers OPM desde assets canonicos. Mantiene separada la
 * traduccion de marker primitive respecto de la composicion de enlaces.
 * Consumidor: composer de enlace.
 */
export function marcadoresEstructurales(
  tipo: TipoEnlace,
  triangleId: Id,
  center: Posicion,
  size: number,
  seleccionada: boolean,
  meta: OpmJointMetadata,
): JointCellJson[] {
  const angle = 0;
  const position = { x: center.x - size / 2, y: center.y - size / 2 };
  const strokeWidth = seleccionada ? CANON.dims.enlaceVisible + 2 : CANON.dims.enlaceVisible;
  const stroke = CANON.colores.enlace;

  if (tipo === "exhibicion") {
    // Canon OpCloud (shared.ts ExhibitionLink.getTriangleSVG): outer triangulo
    // SOLO contorno (fill blanco + stroke color) + inner pequeno relleno con color.
    const innerStrokeWidth = Math.max(1, strokeWidth - 1);
    return [
      polyShapeCell(triangleId, "standard.Polygon", position, size, angle, {
        refPoints: LINK_ASSETS.structural.agregacion.markerPoints,
        fill: "white",
        stroke,
        strokeWidth,
        cursor: "pointer",
      }, meta),
      {
        id: `${triangleId}-pequeno`,
        type: "standard.Polygon",
        position: { x: position.x + 9, y: position.y + 12 },
        size: { width: 12, height: 12 },
        angle,
        attrs: {
          body: {
            refPoints: LINK_ASSETS.structural.agregacion.markerPoints,
            fill: stroke,
            stroke,
            strokeWidth: innerStrokeWidth,
            cursor: "pointer",
          },
          label: { text: "", display: "none" },
        },
        opm: meta,
        z: 3,
      },
    ];
  }

  if (tipo === "generalizacion") {
    return [
      polyShapeCell(triangleId, "standard.Polygon", position, size, angle, {
        refPoints: LINK_ASSETS.structural.generalizacion.markerPoints,
        fill: LINK_ASSETS.structural.generalizacion.markerFill,
        stroke,
        strokeWidth,
        cursor: "pointer",
      }, meta),
    ];
  }

  if (tipo === "clasificacion") {
    const dot = LINK_ASSETS.structural.clasificacion.markerDot;
    return [
      polyShapeCell(triangleId, "standard.Polygon", position, size, angle, {
        refPoints: LINK_ASSETS.structural.clasificacion.markerPoints,
        fill: LINK_ASSETS.structural.clasificacion.markerFill,
        stroke,
        strokeWidth,
        cursor: "pointer",
      }, meta),
      {
        id: `${triangleId}-dot`,
        type: "standard.Circle",
        position: { x: position.x + dot.cx - dot.r, y: position.y + dot.cy - dot.r },
        size: { width: dot.r * 2, height: dot.r * 2 },
        attrs: {
          body: { fill: stroke, stroke, cursor: "pointer" },
          label: { text: "", display: "none" },
        },
        opm: meta,
        z: 3,
      },
    ];
  }

  // agregacion (default): triangulo solido con fill = color de enlace.
  return [
    polyShapeCell(triangleId, "standard.Polygon", position, size, angle, {
      refPoints: LINK_ASSETS.structural.agregacion.markerPoints,
      fill: stroke,
      stroke,
      strokeWidth,
      cursor: "pointer",
    }, meta),
  ];
}

export function polyShapeCell(
  id: Id,
  type: "standard.Polygon" | "standard.Path",
  position: Posicion,
  size: number,
  angle: number,
  bodyAttrs: Record<string, unknown>,
  meta: OpmJointMetadata,
): JointCellJson {
  return {
    id,
    type,
    position,
    size: { width: size, height: size },
    angle,
    attrs: {
      body: bodyAttrs,
      label: { text: "", display: "none" },
    },
    opm: meta,
    z: 2,
  };
}

export function marcadorFuente(tipo: TipoEnlace): Record<string, unknown> | null {
  if (tipo === "efecto") {
    return markerAttrs(LINK_ASSETS.procedural.efecto.marker);
  }
  return null;
}

export function marcadorDestino(tipo: TipoEnlace): Record<string, unknown> | null {
  if (tipo === "agente") {
    return markerAttrs(LINK_ASSETS.procedural.agente.marker);
  }
  if (tipo === "instrumento") {
    return markerAttrs(LINK_ASSETS.procedural.instrumento.marker);
  }
  if (tipo === "consumo") {
    return markerAttrs(LINK_ASSETS.procedural.consumo.marker);
  }
  if (tipo === "resultado") {
    return markerAttrs(LINK_ASSETS.procedural.resultado.marker);
  }
  if (tipo === "efecto") {
    return markerAttrs(LINK_ASSETS.procedural.efecto.marker);
  }
  if (tipo === "invocacion") {
    return markerAttrs(LINK_ASSETS.procedural.invocacion.marker);
  }
  return null;
}

export function markerAttrs(marker: Record<string, unknown>): Record<string, unknown> {
  return { ...marker };
}

export function textoSubtipoModificador(enlace: Enlace): string | null {
  const subtipo = enlace.subtipoModificador ?? subtipoDesdeModificador(enlace);
  if (!subtipo) return null;
  return subtipo === "no" ? "¬" : subtipo;
}

export function etiquetaBadgeModificadorCanonico(text: string, distance: number): Record<string, unknown> {
  const color = text === "¬" ? "#b42318" : CANON.colores.enlace;
  const fill = text === "C" ? "#fff7cc" : text === "E" ? "#e7f6ff" : "#fff1f0";
  return {
    markup: [
      { tagName: "rect", selector: "badge" },
      { tagName: "text", selector: "label" },
    ],
    attrs: {
      badge: {
        width: 18,
        height: 18,
        x: -9,
        y: -9,
        rx: 9,
        ry: 9,
        fill,
        stroke: color,
        strokeWidth: 1.5,
        pointerEvents: "none",
      },
      label: {
        text,
        fill: color,
        fontFamily: CANON.dims.fontFamily,
        fontSize: 12,
        fontWeight: 700,
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        pointerEvents: "none",
      },
    },
    position: {
      distance,
      offset: -20,
      angle: 0,
      args: {
        keepGradient: false,
        ensureLegibility: true,
      },
    },
  };
}

function subtipoDesdeModificador(enlace: Enlace): SubtipoModificador | null {
  if (enlace.modificador === "condicion") return "C";
  if (enlace.modificador === "evento") return "E";
  if (enlace.modificador === "no") return "no";
  return null;
}
