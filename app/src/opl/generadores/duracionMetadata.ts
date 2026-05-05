import { designacionesEstado } from "../../modelo/estadosDesignaciones";
import type { Entidad, Estado } from "../../modelo/tipos";
import {
  listarDesignaciones,
  listarEstadosOpl,
  nombreOpl,
} from "./refsHints";

/**
 * Generador de texto OPL para metadata textual: alias, unidad, descripcion y duracion.
 * Cubre SSOT ISO 19450 §3.4 atributo, §3.7 clase/alias operacional y JOYAS §9.
 * OPCloud separa alias/unidad en modulos atomicos:
 * `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/LogicalPart/components/aliasing-module.ts:5-32`.
 */

export function oracionesUnidadDescripcionEstados(entidad: Entidad, estados: Estado[]): string[] {
  const lineas: string[] = [];
  const unidad = formatearUnidadInline(entidad);
  if (unidad) {
    lineas.push(`${nombreOpl(entidad)} tiene unidad \`${entidad.unidad}\`.`);
  }
  const descripcion = formatearDescripcionInline(entidad);
  if (descripcion) {
    lineas.push(`${nombreOpl(entidad)} se describe como "${entidad.descripcion}".`);
  }
  for (const estado of estados.filter((item) => !item.suprimido)) {
    for (const designacion of designacionesEstado(estado)) {
      lineas.push(`${nombreOpl(entidad)} en \`${estado.nombre}\` es ${textoDesignacionEstado(designacion)}.`);
    }
    const duracion = formatearDuracion(estado);
    if (duracion) lineas.push(duracion);
  }
  return lineas;
}

export function nombreEstadoOpl(estado: Estado): string {
  const designaciones = designacionesEstado(estado);
  return `\`${estado.nombre}\`${designaciones.length > 0 ? ` (${listarDesignaciones(designaciones)})` : ""}`;
}

export function formatearDuracion(estado: Estado): string | null {
  if (!estado.duracion) return null;
  return `${estado.duracion.min}, ${estado.duracion.nominal}, y ${estado.duracion.max} ${estado.duracion.unidad} Duracion Minima, Esperada y Maxima de \`${estado.nombre}\`, respectivamente.`;
}

export function formatearAliasInline(entidad: Entidad): string {
  return entidad.alias ? ` {${entidad.alias}}` : "";
}

export function formatearUnidadInline(entidad: Entidad): string {
  return entidad.unidad ? `[${entidad.unidad}]` : "";
}

export function formatearDescripcionInline(entidad: Entidad): string {
  return entidad.descripcion ?? "";
}

export function textoDesignacionEstado(designacion: string): string {
  if (designacion === "default") return "Default";
  if (designacion === "current") return "Current";
  return designacion;
}

export function oracionEstados(entidad: Entidad, estados: Estado[]): string {
  return `${nombreOpl(entidad)} puede ser ${listarEstadosOpl(estados.filter((estado) => !estado.suprimido).map(nombreEstadoOpl))}.`;
}
