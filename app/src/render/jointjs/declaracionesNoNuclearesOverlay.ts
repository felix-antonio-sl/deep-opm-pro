import type { DeclaracionNoNuclear, Id, Modelo } from "../../modelo/tipos";
import { CODEX } from "./constantes.codex";
import type { JointCellJson } from "./proyeccionTipos";

const ANCHO = 680;
const ALTO = 104;
const SEPARACION = 16;

/**
 * Hace visibles las fronteras, restricciones, roles y exclusiones tipadas que
 * apuntan a un OPD. Son tarjetas explícitamente NO nucleares: no se convierten
 * en cosa, enlace ni primitiva OPM y no alteran el OPL del grafo.
 */
export function proyectarOverlaysDeclaracionesNoNucleares(
  modelo: Modelo,
  opdId: Id,
  yMinima?: number,
): JointCellJson[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  const declaraciones = Object.values(modelo.declaracionesNoNucleares ?? {})
    .filter((declaracion) => declaracion.targets.some((target) => target.tipo === "opd" && target.id === opdId))
    .sort((a, b) => a.id.localeCompare(b.id, "es"));
  if (declaraciones.length === 0) return [];

  const apariencias = Object.values(opd.apariencias);
  const minX = apariencias.length > 0 ? Math.min(...apariencias.map((item) => item.x)) : 24;
  const maxX = apariencias.length > 0
    ? Math.max(...apariencias.map((item) => item.x + item.width))
    : minX + ANCHO;
  const maxY = apariencias.length > 0
    ? Math.max(...apariencias.map((item) => item.y + item.height))
    : 24;
  const centroX = (minX + maxX) / 2;
  const yInicial = Math.max(maxY + 56, yMinima ?? Number.NEGATIVE_INFINITY);

  return declaraciones.map((declaracion, indice) => ({
    id: `overlay-declaracion-no-nuclear-${opdId}-${declaracion.id}`,
    type: "standard.Rectangle",
    position: {
      x: Math.max(12, Math.round(centroX - ANCHO / 2)),
      y: Math.round(yInicial + indice * (ALTO + SEPARACION)),
    },
    size: { width: ANCHO, height: ALTO },
    attrs: {
      body: {
        fill: CODEX.colores.paperWarm,
        fillOpacity: 0.98,
        stroke: declaracion.estadoAsercion === "ratificada" ? CODEX.colores.inkFaint : CODEX.colores.crimson,
        strokeWidth: 1,
        strokeDasharray: "6 4",
        rx: 5,
        ry: 5,
        pointerEvents: "none",
      },
      label: {
        text: textoDeclaracion(declaracion),
        fill: CODEX.colores.inkMid,
        fontFamily: CODEX.fuentes.mono,
        fontSize: 10.5,
        fontWeight: 500,
        lineHeight: "1.35em",
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        textWrap: { width: -22, height: -14, ellipsis: false },
        pointerEvents: "none",
      },
    },
    opm: {
      kind: "overlay-declaracion-no-nuclear",
      opdId,
      declaracionId: declaracion.id,
      clase: declaracion.clase,
      estadoAsercion: declaracion.estadoAsercion,
      ...(declaracion.estadoEvaluacion ? { estadoEvaluacion: declaracion.estadoEvaluacion } : {}),
    },
    z: 23,
  } satisfies JointCellJson));
}

function textoDeclaracion(declaracion: DeclaracionNoNuclear): string {
  const clase = declaracion.clase === "restriccion" ? "restricción" : declaracion.clase;
  const asercion = declaracion.estadoAsercion === "hipotesis" ? "hipótesis" : declaracion.estadoAsercion;
  const evaluacion = declaracion.estadoEvaluacion
    ? ` · ${declaracion.estadoEvaluacion.replace("-", " ")}`
    : "";
  return [
    `CONTRATO NO NUCLEAR · ${declaracion.id} · ${clase} · ${asercion}${evaluacion}`,
    `Propietario: ${declaracion.propietarioSemantico}`,
    declaracion.afirmacion,
  ].join("\n");
}
