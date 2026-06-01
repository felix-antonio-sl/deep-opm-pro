import { CANON } from "../../modelo/constantes";
import type { Apariencia, Enlace, Id, Posicion } from "../../modelo/tipos";
import { CODEX } from "./constantes.codex";
import { LINK_ASSETS } from "./linkAssets";
import type { JointCellJson, OpmJointMetadata } from "./proyeccion";

export function proyectarAutoInvocacion(args: {
  opdId: Id;
  enlace: Enlace;
  aparienciaEnlaceId: Id;
  proceso: Apariencia;
  seleccionada: boolean;
}): JointCellJson[] {
  const metaBase = {
    kind: "enlace",
    opdId: args.opdId,
    enlaceId: args.enlace.id,
    aparienciaEnlaceId: args.aparienciaEnlaceId,
    tipo: args.enlace.tipo,
  } satisfies Omit<Extract<OpmJointMetadata, { kind: "enlace" }>, "rolInvocacion">;
  const metaSalida: OpmJointMetadata = { ...metaBase, rolInvocacion: "auto-salida" };
  const metaRetorno: OpmJointMetadata = { ...metaBase, rolInvocacion: "auto-retorno" };
  const geometria = loopAutoInvocacion(args.proceso);
  const attrsBase = attrsLinea(args.seleccionada);

  return [
    {
      id: `${args.aparienciaEnlaceId}-auto-salida`,
      type: "standard.Link",
      source: geometria.salida,
      target: geometria.pico,
      vertices: verticesInvocacionOpcloud(geometria.salida, geometria.pico),
      connector: { name: "straight" },
      labels: [],
      attrs: attrsBase,
      opm: metaSalida,
      z: 1,
    },
    {
      id: `${args.aparienciaEnlaceId}-auto-retorno`,
      type: "standard.Link",
      source: geometria.pico,
      target: geometria.retorno,
      vertices: verticesInvocacionOpcloud(geometria.pico, geometria.retorno),
      connector: { name: "straight" },
      labels: args.enlace.demora ? [etiquetaDemora(args.enlace.demora)] : [],
      attrs: {
        ...attrsBase,
        line: {
          ...(attrsBase.line as Record<string, unknown>),
          targetMarker: { ...LINK_ASSETS.procedural.invocacion.marker },
        },
      },
      opm: metaRetorno,
      z: 1,
    },
  ];
}

// Geometria canonica OpCloud (SelfInvocationLink.calc, OpmProcess.ts:580
// getSelfInvocationMainVertices). El "pico" (connection point) cuelga del
// borde inferior del proceso a una distancia `dist`. Desde el centro de la
// elipse se traza la linea al pico y se rota +/-`ANGULO_RAMA` grados; las dos
// ramas (salida/retorno) anclan en la INTERSECCION de esas lineas con la
// elipse del proceso, no en puntos horizontales arbitrarios. Esto elimina el
// "quiebre a distal anomalo" (BUG-06f1ed): antes salida/retorno se colocaban
// en y ~= bottom con offset horizontal +/-amplitud*0.45 mientras los quiebres
// se abrian a +/-amplitud (mas anchos que los anclajes), produciendo un lazo
// que se ensanchaba hacia distal en vez de converger limpio al pico.
const ANGULO_RAMA = 35;
const DIST_PICO_MIN = 56;

function loopAutoInvocacion(proceso: Apariencia): {
  salida: Posicion;
  pico: Posicion;
  retorno: Posicion;
} {
  const rx = proceso.width / 2;
  const ry = proceso.height / 2;
  const cx = proceso.x + rx;
  const cy = proceso.y + ry;
  const dist = Math.max(DIST_PICO_MIN, proceso.height * 0.55);
  // Pico colgando recto bajo el centro, sobre la elipse agrandada.
  const pico = { x: Math.round(cx), y: Math.round(cy + ry + dist) };
  // Direccion centro -> pico (puramente hacia abajo) rotada +/-ANGULO_RAMA.
  const salida = interseccionElipse(cx, cy, rx, ry, 90 - ANGULO_RAMA);
  const retorno = interseccionElipse(cx, cy, rx, ry, 90 + ANGULO_RAMA);
  return {
    salida,
    pico,
    retorno,
  };
}

// Punto sobre la elipse del proceso en el angulo dado (grados, sentido del
// reloj desde el eje +x del SVG; 90 = abajo). Coincide con la interseccion
// que OpCloud calcula via Ellipse.intersectionWithLine desde el centro.
function interseccionElipse(cx: number, cy: number, rx: number, ry: number, anguloGrados: number): Posicion {
  const rad = (anguloGrados * Math.PI) / 180;
  return {
    x: Math.round(cx + rx * Math.cos(rad)),
    y: Math.round(cy + ry * Math.sin(rad)),
  };
}

// OPCloud `makeInvocationLinkVertices`: cuatro vertices por tramo para formar
// el rayo de invocacion sin un unico quiebre distal.
function verticesInvocacionOpcloud(src: Posicion, dst: Posicion): Posicion[] {
  const delta = {
    dx: dst.x - src.x,
    dy: dst.y - src.y,
  };
  const linkLength = Math.hypot(delta.dx, delta.dy) || 1;
  const displacement = Math.max(5, Math.min((linkLength * 15) / 500, 10));
  const extension = Math.max(1, Math.min((linkLength * 8) / 500, 5));
  const zapRatio = 0.5;
  const partSrc = {
    x: delta.dx * zapRatio + (extension * delta.dx) / linkLength,
    y: delta.dy * zapRatio + (extension * delta.dy) / linkLength,
  };
  const partDst = {
    x: delta.dx * (1 - zapRatio) + (extension * delta.dx) / linkLength,
    y: delta.dy * (1 - zapRatio) + (extension * delta.dy) / linkLength,
  };
  const slope = -displacement / linkLength;
  const arc = Math.atan(slope);
  const sin = Math.sin(arc);
  const cos = Math.cos(arc);
  const srcRotado = rotarComoOpcloud(partSrc, sin, cos);
  const dstRotado = rotarComoOpcloud(partDst, sin, cos);
  const partSrcLen = Math.hypot(srcRotado.x, srcRotado.y) || 1;
  const partDstLen = Math.hypot(dstRotado.x, dstRotado.y) || 1;
  const breakLen = Math.max(Math.min(partSrcLen, partDstLen) * 0.1, 20);
  const partSrcRatio = 1 - breakLen / partSrcLen;
  const partDstRatio = 1 - breakLen / partDstLen;
  return [
    redondearPunto({
      x: srcRotado.x * partSrcRatio + src.x,
      y: srcRotado.y * partSrcRatio + src.y,
    }),
    redondearPunto({
      x: srcRotado.x + src.x,
      y: srcRotado.y + src.y,
    }),
    redondearPunto({
      x: dst.x - dstRotado.x,
      y: dst.y - dstRotado.y,
    }),
    redondearPunto({
      x: dst.x - dstRotado.x * partDstRatio,
      y: dst.y - dstRotado.y * partDstRatio,
    }),
  ];
}

function rotarComoOpcloud(vector: Posicion, sin: number, cos: number): Posicion {
  const x = cos * vector.x - sin * vector.y;
  return {
    x,
    y: sin * x + cos * vector.y,
  };
}

function redondearPunto(punto: Posicion): Posicion {
  return {
    x: Math.round(punto.x),
    y: Math.round(punto.y),
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
      stroke: CODEX.colores.ink,
      strokeWidth: seleccionada ? CODEX.strokes.enlace + 0.2 : CODEX.strokes.enlace,
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
        fill: CODEX.colores.inkMid,
        fontFamily: CODEX.fuentes.serif,
        fontSize: 11,
        fontWeight: 400,
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
