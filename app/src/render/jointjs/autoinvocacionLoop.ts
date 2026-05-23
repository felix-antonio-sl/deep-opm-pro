import { CANON } from "../../modelo/constantes";
import type { Apariencia, Enlace, Id, Posicion } from "../../modelo/tipos";
import { LINK_ASSETS } from "./linkAssets";
import type { JointCellJson, OpmJointMetadata } from "./proyeccion";

export function proyectarAutoInvocacion(args: {
  opdId: Id;
  enlace: Enlace;
  aparienciaEnlaceId: Id;
  proceso: Apariencia;
  seleccionada: boolean;
}): JointCellJson[] {
  const meta: OpmJointMetadata = {
    kind: "enlace",
    opdId: args.opdId,
    enlaceId: args.enlace.id,
    aparienciaEnlaceId: args.aparienciaEnlaceId,
    tipo: args.enlace.tipo,
  };
  const geometria = loopAutoInvocacion(args.proceso);
  const attrsBase = attrsLinea(args.seleccionada);

  return [
    {
      id: `${args.aparienciaEnlaceId}-auto-salida`,
      type: "standard.Link",
      source: geometria.salida,
      target: geometria.pico,
      vertices: [geometria.quiebreSalida],
      connector: { name: "straight" },
      labels: [],
      attrs: attrsBase,
      opm: meta,
      z: 1,
    },
    {
      id: `${args.aparienciaEnlaceId}-auto-retorno`,
      type: "standard.Link",
      source: geometria.pico,
      target: geometria.retorno,
      vertices: [geometria.quiebreRetorno],
      connector: { name: "straight" },
      labels: args.enlace.demora ? [etiquetaDemora(args.enlace.demora)] : [],
      attrs: {
        ...attrsBase,
        line: {
          ...(attrsBase.line as Record<string, unknown>),
          targetMarker: { ...LINK_ASSETS.procedural.invocacion.marker },
        },
      },
      opm: meta,
      z: 1,
    },
  ];
}

function loopAutoInvocacion(proceso: Apariencia): {
  salida: Posicion;
  pico: Posicion;
  retorno: Posicion;
  quiebreSalida: Posicion;
  quiebreRetorno: Posicion;
} {
  const bottom = proceso.y + proceso.height;
  const centroX = proceso.x + proceso.width / 2;
  const amplitud = Math.max(42, proceso.width * 0.32);
  const altoLoop = Math.max(62, proceso.height * 1.15);
  const salida = { x: Math.round(centroX - amplitud * 0.45), y: Math.round(bottom - proceso.height * 0.12) };
  const retorno = { x: Math.round(centroX + amplitud * 0.45), y: Math.round(bottom - proceso.height * 0.12) };
  const pico = { x: Math.round(centroX), y: Math.round(bottom + altoLoop) };
  return {
    salida,
    pico,
    retorno,
    quiebreSalida: { x: Math.round(centroX - amplitud), y: Math.round(bottom + altoLoop * 0.48) },
    quiebreRetorno: { x: Math.round(centroX + amplitud), y: Math.round(bottom + altoLoop * 0.48) },
  };
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
      strokeLinejoin: "round",
      sourceMarker: null,
      targetMarker: null,
    },
  };
}

function etiquetaDemora(text: string): Record<string, unknown> {
  return {
    markup: [{ tagName: "text", selector: "label" }],
    attrs: {
      label: {
        text,
        fill: "#404040", // CANON-V2 ink70
        fontFamily: CANON.dims.fontFamily,
        fontSize: 11,
        fontWeight: 700,
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        pointerEvents: "none",
      },
    },
    position: {
      distance: 0.5,
      offset: -18,
      angle: 0,
      args: {
        keepGradient: false,
        ensureLegibility: true,
      },
    },
  };
}
