import type { Enlace, Entidad, Modelo } from "../../modelo/tipos";
import type { OplLineaPendiente } from "./refsHints";
import {
  agregarLinea,
  hintsEnlace,
  nombreOpl,
  nombreOplExtremo,
  refsEntidad,
  refsEnlace,
  textoAfiliacion,
  textoEsencia,
  verbo,
  multiplicidadPlural,
} from "./refsHints";

/**
 * Generador de oraciones OPL para descripcion de entidades y enlaces estructurales.
 * Cubre SSOT OPL-ES §3.1 y §9.2; consumidores: `opl/generar.ts`.
 */

export function oracionEntidad(entidad: Entidad): string {
  const nombre = nombreOpl(entidad);
  const tipo = entidad.tipo === "objeto" ? "objeto" : "proceso";
  return `${nombre} es un ${tipo} ${textoEsencia(entidad)} y ${textoAfiliacion(entidad)}.`;
}

export function oracionEnlaceEstructural(modelo: Modelo, enlace: Enlace): string | null {
  if (!["agregacion", "exhibicion", "generalizacion", "clasificacion"].includes(enlace.tipo)) return null;
  const origen = nombreOplExtremo(modelo, enlace.origenId, enlace.multiplicidadOrigen);
  const destino = nombreOplExtremo(modelo, enlace.destinoId, enlace.multiplicidadDestino);
  const origenPlural = multiplicidadPlural(enlace.multiplicidadOrigen);
  const destinoPlural = multiplicidadPlural(enlace.multiplicidadDestino);

  switch (enlace.tipo) {
    case "agregacion":
      return `${origen} ${verbo("consta", "constan", origenPlural)} de ${destino}.`;
    case "exhibicion":
      return `${origen} ${verbo("exhibe", "exhiben", origenPlural)} ${destino}.`;
    case "generalizacion":
      return destinoPlural ? `${destino} son ${origen}.` : `${destino} es un ${origen}.`;
    case "clasificacion":
      return destinoPlural ? `${destino} son instancias de ${origen}.` : `${destino} es una instancia de ${origen}.`;
    default:
      return null;
  }
}

export function agregarEntidadInteractiva(lineas: OplLineaPendiente[], entidad: Entidad): void {
  agregarLinea(lineas, oracionEntidad(entidad), refsEntidad(entidad.id), []);
}

export function oracionEnlaceEstructuralInteractivo(modelo: Modelo, enlace: Enlace): OplLineaPendiente | null {
  const texto = oracionEnlaceEstructural(modelo, enlace);
  return texto ? { texto, refs: refsEnlace(modelo, enlace), hints: hintsEnlace(modelo, enlace, texto) } : null;
}
