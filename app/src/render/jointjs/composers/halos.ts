import type { Apariencia, Enlace, Entidad, Id, Modelo, Estado } from "../../../modelo/tipos";
import type { OplReferencia } from "../../../opl/interaccion";
import { CODEX } from "../constantes.codex";
import { jointCanvasPalette } from "../palette";
import type { JointCellJson, OpcionesProyeccion } from "../proyeccionTipos";
import { dimensionesEntidadRenderizada } from "./entidad";
import { puntoCapsulaEstado, rectCapsulaEstado } from "./estados";

/**
 * Oliva de simulacion (B0.019). Borde distintivo del estado INICIAL designado
 * de un objeto durante la simulacion. Oliva (verde-amarillento apagado) para
 * distinguirse del foco crimson del proceso activo y de los estados alcanzados.
 * Unica fuente del oliva-sim en la capa render.
 */
export const SIM_OLIVA = "#6B7B2A";
export const SIM_OLIVA_OSCURO = "#3F4A16";

/**
 * Variantes del underline crimson canonico (ui-forja/08 §5). `seleccion`:
 * persistente, 1.2px, opacity 1 (§5.1). `hover`: sutil, 1px, opacity 0.5
 * (§5.2). El composer emite la celda; quien decide cuando aplicar cada
 * variante es proyeccion.ts (dispatch fuera de la frontera L5).
 */
export type VarianteHalo = "seleccion" | "hover";

function attrsUnderlineCrimson(d: string, variante: VarianteHalo): Record<string, unknown> {
  const hover = variante === "hover";
  return {
    d,
    fill: "none",
    stroke: jointCanvasPalette.seleccion,
    // §5.1 seleccion: 1.2px / §5.2 hover: 1px. Hairline crimson, sin fill.
    strokeWidth: hover ? CODEX.strokes.enlace : CODEX.strokes.seleccion,
    // §5.2: hover al 50% de opacidad; seleccion persistente opaca.
    ...(hover ? { opacity: 0.5 } : {}),
    pointerEvents: "none",
  };
}

/**
 * Composer de halos transitorios de seleccion y hover OPL. No serializa
 * estado; emite solo celdas JointJS derivadas. Consumidor: proyeccion.ts.
 *
 * El highlighter Codex (ui-forja/08 §5) es un underline crimson hairline bajo
 * la etiqueta — NO redibuja el borde del shape (mantiene el canon V-63 visible).
 */
export function proyectarHaloSeleccion(
  opdId: Id,
  apariencia: Apariencia,
  entidad: Entidad,
  variante: VarianteHalo = "seleccion",
): JointCellJson {
  const width = Math.max(24, apariencia.width - 16);
  return {
    id: `seleccion-${apariencia.id}`,
    type: "standard.Path",
    position: { x: apariencia.x + 8, y: apariencia.y + apariencia.height / 2 + 5 },
    size: { width, height: 2 },
    attrs: {
      body: attrsUnderlineCrimson(`M 0 1 L ${width} 1`, variante),
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

export function proyectarHaloSeleccionEstado(
  modelo: Modelo,
  opdId: Id,
  apariencia: Apariencia,
  estado: Estado,
  variante: VarianteHalo = "seleccion",
): JointCellJson | null {
  const rect = rectCapsulaEstado(modelo, apariencia, estado.id);
  if (!rect) return null;

  const width = Math.max(18, rect.width - 12);
  return {
    id: `seleccion-estado-${apariencia.id}-${estado.id}`,
    type: "standard.Path",
    position: { x: rect.x + 6, y: rect.y + rect.height / 2 + 5 },
    size: { width, height: 2 },
    attrs: {
      body: attrsUnderlineCrimson(`M 0 1 L ${width} 1`, variante),
      label: { text: "", display: "none" },
    },
    opm: {
      kind: "selection-halo",
      opdId,
      targetId: estado.id,
      targetKind: "estado",
    },
    z: 37,
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

/**
 * Halo del proceso activo en modo simulacion.
 * Crimson dashed canonico (Codex V-132): crimson = registro de foco/current;
 * dashed = textura temporal. Resuelve V-132 sin color nuevo.
 */
export function proyectarHaloSimulacionProceso(
  modelo: Modelo,
  opdId: Id,
  apariencia: Apariencia,
  entidad: Entidad,
  opciones: OpcionesProyeccion,
): JointCellJson {
  const pad = 6;
  const sizeRender = dimensionesEntidadRenderizada(modelo, opdId, apariencia, entidad, opciones);
  const width = sizeRender.width + pad * 2;
  const height = sizeRender.height + pad * 2;
  return {
    id: `sim-proceso-${apariencia.id}`,
    type: "standard.Ellipse",
    position: { x: apariencia.x - pad, y: apariencia.y - pad },
    size: { width, height },
    attrs: {
      body: {
        fill: CODEX.colores.opmProcesoSuave,
        stroke: CODEX.colores.crimson,
        strokeWidth: 3,
        strokeDasharray: "6 3",
        "data-opm-sim": "process-active",
        cx: width / 2,
        cy: height / 2,
        rx: width / 2,
        ry: height / 2,
        pointerEvents: "none",
      },
      label: { text: "", display: "none" },
    },
    opm: {
      kind: "simulacion-halo",
      opdId,
      targetId: entidad.id,
      tipo: "proceso-activo",
    },
    z: 35,
  };
}

export function proyectarHaloSimulacionEntidadInvolucrada(
  modelo: Modelo,
  opdId: Id,
  apariencia: Apariencia,
  entidad: Entidad,
  opciones: OpcionesProyeccion,
): JointCellJson {
  const pad = 5;
  const type = entidad.tipo === "objeto" ? "standard.Rectangle" : "standard.Ellipse";
  const sizeRender = dimensionesEntidadRenderizada(modelo, opdId, apariencia, entidad, opciones);
  const width = sizeRender.width + pad * 2;
  const height = sizeRender.height + pad * 2;
  const stroke = entidad.tipo === "objeto" ? CODEX.colores.opmObjeto : CODEX.colores.opmProceso;
  const fill = entidad.tipo === "objeto" ? CODEX.colores.opmObjetoSuave : CODEX.colores.opmProcesoSuave;
  return {
    id: `sim-involucrada-${apariencia.id}`,
    type,
    position: { x: apariencia.x - pad, y: apariencia.y - pad },
    size: { width, height },
    attrs: {
      body: entidad.tipo === "objeto"
        ? {
            fill,
            stroke,
            strokeWidth: 2,
            strokeDasharray: "4 3",
            "data-opm-sim": "entity-involved",
            rx: 7,
            ry: 7,
            pointerEvents: "none",
          }
        : {
            fill,
            stroke,
            strokeWidth: 2,
            strokeDasharray: "4 3",
            "data-opm-sim": "entity-involved",
            cx: width / 2,
            cy: height / 2,
            rx: width / 2,
            ry: height / 2,
            pointerEvents: "none",
          },
      label: { text: "", display: "none" },
    },
    opm: {
      kind: "simulacion-halo",
      opdId,
      targetId: entidad.id,
      tipo: "entidad-involucrada",
    },
    z: 33,
  };
}

/**
 * Halo del estado current de un objeto en modo simulacion.
 * Anillo crimson sobre la capsula del estado; si la capsula no puede
 * localizarse, cae al halo de objeto completo como degradacion segura.
 * Retira el pin ambar (#f59e0b) fuera de canon; crimson = registro de
 * foco/current de Codex.
 */
export function proyectarHaloSimulacionEstadoCurrent(
  modelo: Modelo,
  opdId: Id,
  apariencia: Apariencia,
  entidad: Entidad,
  estado: Estado,
): JointCellJson {
  const rect = rectCapsulaEstado(modelo, apariencia, estado.id);
  if (rect) {
    const pad = 3;
    return {
      id: `sim-current-${apariencia.id}-${estado.id}`,
      type: "standard.Rectangle",
      position: { x: rect.x - pad, y: rect.y - pad },
      size: { width: rect.width + pad * 2, height: rect.height + pad * 2 },
      attrs: {
        body: {
          fill: CODEX.colores.opmEstadoSuave,
          stroke: CODEX.colores.crimson,
          strokeWidth: 2,
          strokeDasharray: "4 2",
          "data-opm-sim": "state-current",
          rx: 11,
          ry: 11,
          pointerEvents: "none",
        },
        label: { text: "", display: "none" },
      },
      opm: {
        kind: "simulacion-halo",
        opdId,
        targetId: estado.id,
        tipo: "estado-current",
      },
      z: 36,
    };
  }

  const pad = 3;
  const width = apariencia.width + pad * 2;
  const height = apariencia.height + pad * 2;
  return {
    id: `sim-current-${apariencia.id}-${estado.id}`,
    type: "standard.Rectangle",
    position: { x: apariencia.x - pad, y: apariencia.y - pad },
    size: { width, height },
    attrs: {
      body: {
        fill: "transparent",
        stroke: CODEX.colores.crimson,
        strokeWidth: 2,
        strokeDasharray: "4 2",
        "data-opm-sim": "state-current",
        rx: 8,
        ry: 8,
        pointerEvents: "none",
      },
      label: { text: "", display: "none" },
    },
    opm: {
      kind: "simulacion-halo",
      opdId,
      targetId: entidad.id,
      tipo: "estado-current",
    },
    z: 34,
  };
}

export function proyectarHaloSimulacionEstadoResultado(
  modelo: Modelo,
  opdId: Id,
  apariencia: Apariencia,
  entidad: Entidad,
  estado: Estado,
): JointCellJson {
  const rect = rectCapsulaEstado(modelo, apariencia, estado.id);
  if (rect) {
    const pad = 4;
    return {
      id: `sim-resultado-${apariencia.id}-${estado.id}`,
      type: "standard.Rectangle",
      position: { x: rect.x - pad, y: rect.y - pad },
      size: { width: rect.width + pad * 2, height: rect.height + pad * 2 },
      attrs: {
        body: {
          fill: CODEX.colores.opmObjetoSuave,
          stroke: CODEX.colores.opmObjeto,
          strokeWidth: 2,
          strokeDasharray: "7 3",
          "data-opm-sim": "state-result",
          rx: 12,
          ry: 12,
          pointerEvents: "none",
        },
        label: { text: "", display: "none" },
      },
      opm: {
        kind: "simulacion-halo",
        opdId,
        targetId: estado.id,
        tipo: "estado-resultado",
      },
      z: 37,
    };
  }

  const pad = 4;
  const width = apariencia.width + pad * 2;
  const height = apariencia.height + pad * 2;
  return {
    id: `sim-resultado-${apariencia.id}-${estado.id}`,
    type: "standard.Rectangle",
    position: { x: apariencia.x - pad, y: apariencia.y - pad },
    size: { width, height },
    attrs: {
      body: {
        fill: CODEX.colores.opmObjetoSuave,
        stroke: CODEX.colores.opmObjeto,
        strokeWidth: 2,
        strokeDasharray: "7 3",
        "data-opm-sim": "state-result",
        rx: 8,
        ry: 8,
        pointerEvents: "none",
      },
      label: { text: "", display: "none" },
    },
    opm: {
      kind: "simulacion-halo",
      opdId,
      targetId: entidad.id,
      tipo: "estado-resultado",
    },
    z: 34,
  };
}

/**
 * Halo del estado INICIAL designado de un objeto en modo simulación (B0.019).
 * Espejo de `proyectarHaloSimulacionEstadoCurrent`: misma geometria de pin
 * externo anclado al borde del estado (SSOT V-54/V-133) con degradacion segura
 * al halo de objeto completo. Color oliva (SIM_OLIVA) en vez del dorado del
 * estado current, para mantener el estado inicial visible y distinguible
 * durante toda la corrida.
 */
export function proyectarHaloSimulacionEstadoInicial(
  modelo: Modelo,
  opdId: Id,
  apariencia: Apariencia,
  entidad: Entidad,
  estado: Estado,
): JointCellJson {
  // Desplazamiento horizontal del pin inicial para no solaparse con el pin
  // del estado current (dorado): en el paso 0 ambos coinciden y z-fightean.
  const OFFSET_X_INICIAL = 18;
  const punto = puntoCapsulaEstado(modelo, apariencia, estado.id);
  if (punto) {
    const width = 14;
    const height = 18;
    return {
      id: `sim-inicial-${apariencia.id}-${estado.id}`,
      type: "standard.Path",
      position: { x: punto.x - width / 2 - OFFSET_X_INICIAL, y: punto.y - height - 12 },
      size: { width, height },
      attrs: {
        body: {
          d: "M7 0 C3 0 0 3 0 7 c0 5 7 11 7 11 s7-6 7-11 C14 3 11 0 7 0 Z",
          fill: SIM_OLIVA,
          stroke: SIM_OLIVA_OSCURO,
          strokeWidth: 1.5,
          "data-opm-sim": "state-initial",
          pointerEvents: "none",
        },
        label: { text: "", display: "none" },
      },
      opm: {
        kind: "simulacion-halo",
        opdId,
        targetId: entidad.id,
        tipo: "estado-inicial",
      },
      z: 36,
    };
  }

  const pad = 3;
  const width = apariencia.width + pad * 2;
  const height = apariencia.height + pad * 2;
  return {
    id: `sim-inicial-${apariencia.id}-${estado.id}`,
    type: "standard.Rectangle",
    position: { x: apariencia.x - pad - OFFSET_X_INICIAL, y: apariencia.y - pad },
    size: { width, height },
    attrs: {
      body: {
        fill: "transparent",
        stroke: SIM_OLIVA,
        strokeWidth: 2,
        "data-opm-sim": "state-initial",
        rx: 8,
        ry: 8,
        pointerEvents: "none",
      },
      label: { text: "", display: "none" },
    },
    opm: {
      kind: "simulacion-halo",
      opdId,
      targetId: entidad.id,
      tipo: "estado-inicial",
    },
    z: 34,
  };
}
