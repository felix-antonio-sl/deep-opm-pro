import { nombreCanonicoEstado } from "../../modelo/nombresCanonicos";
import type { Entidad, Estado } from "../../modelo/tipos";
import type { OplLineaPendiente } from "./refsHints";
import {
  agregarLinea,
  hintEntidad,
  hintEstado,
  nombreOpl,
  refEntidad,
  refEstado,
} from "./refsHints";
import {
  oracionEstados,
  textoDesignacionEstado,
} from "./duracionMetadata";

/**
 * Generador de oraciones OPL para estados y designaciones.
 * Cubre SSOT OPL-ES §3.2-§3.3 e ISO 19450 §3.71a.
 * Consumidores: `opl/generar.ts` y tests de capa OPL.
 */

export { oracionEstados, textoDesignacionEstado };

export function oracionDesignacionEstado(estado: Estado, entidad: Entidad, designacion: string): string {
  return `${nombreOpl(entidad)} en \`${nombreCanonicoEstado(estado)}\` es ${textoDesignacionEstado(designacion)}.`;
}

export function agregarOracionEstadosInteractiva(
  lineas: OplLineaPendiente[],
  entidad: Entidad,
  estados: Estado[],
): void {
  agregarLinea(
    lineas,
    oracionEstados(entidad, estados),
    [refEntidad(entidad.id), ...estados.map((estado) => refEstado(estado.id))],
    [hintEntidad(entidad), ...estados.map(hintEstado)],
  );
}
