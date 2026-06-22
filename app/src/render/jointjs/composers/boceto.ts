import { CANON } from "../../../modelo/constantes";
import type { Boceto, Id, Opd } from "../../../modelo/tipos";
import { CODEX } from "../constantes.codex";
import type { JointCellJson } from "../proyeccionTipos";

/**
 * Composer de la capa de pizarra / bosquejo (D7.2). Proyecta cada `Boceto` del
 * OPD activo a una celda JointJS en estilo BOSQUEJO deliberadamente distinto del
 * modelo OPM — paleta tenue (inkSoft), trazo discontinuo, sin sombras, fondo
 * paper translúcido — para que se lea de un vistazo "esto NO es OPM aún".
 *
 * - `forma` ⇒ rect
 * - `texto` ⇒ texto (path-shell sin borde, solo etiqueta)
 * - `nota`  ⇒ rect con texto (lámina de nota)
 * - `flecha`⇒ polilínea por puntos (standard.Link sin cells de extremo)
 *
 * Marca `opm.kind="boceto"` + `bocetoId` en metadatos para que el handler del
 * lienzo lo distinga del trío OPM y enrute a `seleccionarBoceto`.
 *
 * El boceto SELECCIONADO recibe un realce crimson (canal UI de foco/selección,
 * ui-forja/06): es la ÚNICA situación en que crimson toca la celda de boceto.
 */

// Paleta de bosquejo: tinta tenue, fondo paper translúcido. NO usa colores OPM
// (verde/azul/oliva) ni crimson decorativo — crimson queda exclusivo del realce
// de selección abajo.
const BOSQUEJO = {
  stroke: CODEX.colores.inkSoft,
  fill: "rgba(250, 250, 248, 0.55)",
  dash: "5 4",
  strokeWidth: 1.5,
} as const;

const DIM_DEFAULT = { width: CANON.dims.cosaWidth, height: CANON.dims.cosaHeight };

export function proyectarBoceto(opdId: Id, boceto: Boceto, seleccionado: boolean): JointCellJson {
  const stroke = seleccionado ? CODEX.colores.crimson : BOSQUEJO.stroke;
  const strokeWidth = seleccionado ? CODEX.strokes.seleccion + 0.6 : BOSQUEJO.strokeWidth;
  const meta = { kind: "boceto" as const, opdId, bocetoId: boceto.id, tipo: boceto.tipo };

  if (boceto.tipo === "flecha") {
    return proyectarFlecha(boceto, stroke, strokeWidth, meta);
  }
  if (boceto.tipo === "texto") {
    return proyectarTexto(boceto, stroke, meta);
  }
  // `forma` y `nota` ⇒ rectángulo de bosquejo con etiqueta opcional.
  return proyectarRect(boceto, stroke, strokeWidth, seleccionado, meta);
}

/**
 * Proyecta los bocetos de un OPD (si los tiene), realzando el seleccionado.
 * Sin bocetos ⇒ arreglo vacío (la ley de no-contaminación se preserva: estas
 * celdas son puramente de presentación, ningún checker/conteo OPL las ve).
 */
export function proyectarBocetosDelOpd(
  opdId: Id,
  opd: Pick<Opd, "bocetos">,
  bocetoSeleccionadoId: Id | null,
): JointCellJson[] {
  const bocetos = opd.bocetos;
  if (!bocetos) return [];
  return Object.values(bocetos).map((boceto) =>
    proyectarBoceto(opdId, boceto, boceto.id === bocetoSeleccionadoId),
  );
}

function proyectarRect(
  boceto: Boceto,
  stroke: string,
  strokeWidth: number,
  seleccionado: boolean,
  meta: { kind: "boceto"; opdId: Id; bocetoId: Id; tipo: Boceto["tipo"] },
): JointCellJson {
  const width = boceto.w ?? DIM_DEFAULT.width;
  const height = boceto.h ?? DIM_DEFAULT.height;
  return {
    id: boceto.id,
    type: "standard.Rectangle",
    position: { x: boceto.x ?? 0, y: boceto.y ?? 0 },
    size: { width, height },
    attrs: {
      body: {
        fill: BOSQUEJO.fill,
        stroke,
        strokeWidth,
        strokeDasharray: BOSQUEJO.dash,
        rx: boceto.tipo === "nota" ? 0 : 4,
        ry: boceto.tipo === "nota" ? 0 : 4,
        cursor: "pointer",
      },
      label: {
        text: boceto.texto ?? "",
        fill: seleccionado ? CODEX.colores.ink : CODEX.colores.inkMid,
        fontFamily: CODEX.fuentes.serif,
        fontSize: 14,
        fontStyle: "italic",
        textWrap: { width: width - 16, height: height - 12, ellipsis: false },
        textVerticalAnchor: "middle",
        textAnchor: "middle",
        pointerEvents: "none",
      },
    },
    opm: meta,
    z: 5,
  };
}

function proyectarTexto(
  boceto: Boceto,
  stroke: string,
  meta: { kind: "boceto"; opdId: Id; bocetoId: Id; tipo: Boceto["tipo"] },
): JointCellJson {
  const width = boceto.w ?? DIM_DEFAULT.width;
  const height = boceto.h ?? 28;
  return {
    id: boceto.id,
    type: "standard.Path",
    position: { x: boceto.x ?? 0, y: boceto.y ?? 0 },
    size: { width, height },
    attrs: {
      // Carcasa invisible: el texto suelto necesita un body para recibir clicks,
      // pero sin borde (es solo un rótulo de bosquejo).
      body: {
        fill: "transparent",
        stroke: "transparent",
        strokeWidth: 0,
        refD: "M 0 0 L 1 0 L 1 1 L 0 1 Z",
        cursor: "pointer",
      },
      label: {
        text: boceto.texto ?? "",
        fill: stroke,
        fontFamily: CODEX.fuentes.serif,
        fontSize: 15,
        fontStyle: "italic",
        textWrap: { width: width - 8, height, ellipsis: false },
        textVerticalAnchor: "middle",
        textAnchor: "middle",
        pointerEvents: "none",
      },
    },
    opm: meta,
    z: 5,
  };
}

function proyectarFlecha(
  boceto: Boceto,
  stroke: string,
  strokeWidth: number,
  meta: { kind: "boceto"; opdId: Id; bocetoId: Id; tipo: Boceto["tipo"] },
): JointCellJson {
  const puntos = boceto.puntos && boceto.puntos.length >= 2
    ? boceto.puntos
    : [{ x: boceto.x ?? 0, y: boceto.y ?? 0 }, { x: (boceto.x ?? 0) + 80, y: boceto.y ?? 0 }];
  const source = puntos[0]!;
  const target = puntos[puntos.length - 1]!;
  const vertices = puntos.slice(1, -1);
  return {
    id: boceto.id,
    type: "standard.Link",
    source: { x: source.x, y: source.y },
    target: { x: target.x, y: target.y },
    vertices,
    connector: { name: "straight" },
    attrs: {
      line: {
        stroke,
        strokeWidth,
        strokeDasharray: BOSQUEJO.dash,
        targetMarker: { type: "path", d: "M 10 -5 0 0 10 5 z", fill: stroke, stroke },
        cursor: "pointer",
      },
    },
    opm: meta,
    z: 5,
  };
}
