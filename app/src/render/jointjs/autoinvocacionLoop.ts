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
  quiebreSalida: Posicion;
  quiebreRetorno: Posicion;
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
    quiebreSalida: quiebreCanonico(salida, pico),
    quiebreRetorno: quiebreCanonico(pico, retorno),
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

// Punto de quiebre del rayo de invocacion (makeInvocationLinkVertices): un
// unico vertice intermedio desplazado perpendicularmente hacia el centro del
// lazo, escalado con la longitud del tramo. Genera el zigzag canonico sin
// flare hacia distal.
function quiebreCanonico(desde: Posicion, hacia: Posicion): Posicion {
  const dx = hacia.x - desde.x;
  const dy = hacia.y - desde.y;
  const len = Math.hypot(dx, dy) || 1;
  const desplazamiento = Math.max(6, Math.min(len * 0.12, 12));
  const px = -dy / len;
  const py = dx / len;
  return {
    x: Math.round((desde.x + hacia.x) / 2 + px * desplazamiento),
    y: Math.round((desde.y + hacia.y) / 2 + py * desplazamiento),
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
