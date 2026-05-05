import { CANON } from "../../modelo/constantes";
import type { Apariencia, Id, OperadorAbanico } from "../../modelo/tipos";
import type { JointCellJson } from "./proyeccion";
import { LINK_ASSETS } from "./linkAssets";

export function proyectarOverlayAbanicoCanonico(args: {
  opdId: Id;
  abanicoId: Id;
  operador: OperadorAbanico;
  aparienciaPuerto: Apariencia;
}): JointCellJson[] {
  const assetKey = args.operador === "XOR" ? "xor" : "or";
  const position = posicionOverlay(args.aparienciaPuerto, LINK_ASSETS.logical[assetKey].size);
  const opm = {
    kind: "overlay-abanico" as const,
    opdId: args.opdId,
    abanicoId: args.abanicoId,
    operador: args.operador,
  };

  if (args.operador === "XOR") {
    const asset = LINK_ASSETS.logical.xor;
    return [{
      id: `overlay-abanico-${args.abanicoId}`,
      type: "standard.Polygon",
      position,
      size: asset.size,
      attrs: {
        body: {
          refPoints: asset.points,
          fill: CANON.colores.enlace,
          stroke: CANON.colores.enlace,
          strokeWidth: 1.5,
          cursor: "default",
        },
        label: { text: "", display: "none" },
      },
      opm,
      z: 2,
    }];
  }

  const asset = LINK_ASSETS.logical.or;
  return [{
    id: `overlay-abanico-${args.abanicoId}`,
    type: "standard.Path",
    position,
    size: asset.size,
    attrs: {
      body: {
        refD: asset.path,
        fill: "transparent",
        stroke: CANON.colores.enlace,
        strokeWidth: 1.5,
        strokeLinecap: "round",
        strokeDasharray: asset.strokeDasharray,
        cursor: "default",
      },
      label: { text: "", display: "none" },
    },
    opm,
    z: 2,
  }];
}

function posicionOverlay(aparienciaPuerto: Apariencia, size: { width: number; height: number }): { x: number; y: number } {
  return {
    x: aparienciaPuerto.x + aparienciaPuerto.width + 6,
    y: aparienciaPuerto.y - size.height - 6,
  };
}
