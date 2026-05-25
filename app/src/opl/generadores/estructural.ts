import type { Enlace, Entidad, Modelo } from "../../modelo/tipos";
import type { VisibilidadOpl } from "../opciones";
import type { OplLineaPendiente } from "./refsHints";
import {
  agregarLinea,
  enlaceOplEsEmitible,
	  hintsEnlace,
	  nombreOplAtributoValor,
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
 * Cubre SSOT OPL-ES §3.1, §9.2 y [OPL-ES §14] atributos y valores;
 * consumidores: `opl/generar.ts`.
 */

/**
 * Clasificación de una cosa (G2 · canon-opm D1–D4, ui-forja/04-opl-rendering §3.1):
 * cada hecho de clasificación va en oración separada. NO colapsar como
 * «X es un objeto informacional y sistémico» — no es canónico OPL-ES.
 * El caso atributo-con-valor es una sola oración (no es clasificación).
 */
export function oracionEntidad(entidad: Entidad, opciones?: VisibilidadOpl): string[] {
  const atributoValor = oracionValorAtributo(entidad);
  if (atributoValor) return [atributoValor];
  const nombre = nombreOpl(entidad);
  const visibilidad = opciones?.esencia ?? "siempre";
  if (visibilidad === "oculta") return [];
  const lineas: string[] = [];
  const esenciaDifiere = entidad.esencia !== "informacional";
  const afiliacionDifiere = entidad.afiliacion !== "sistemica";
  if (visibilidad === "siempre" || esenciaDifiere) lineas.push(`${nombre} es ${textoEsencia(entidad)}.`);
  if (visibilidad === "siempre" || afiliacionDifiere) lineas.push(`${nombre} es ${textoAfiliacion(entidad)}.`);
  return lineas;
}

export function oracionValorAtributo(entidad: Entidad): string | null {
  if (!entidad.valorSlot) return null;
  const valor = entidad.valorSlot.valor ?? "valor";
  const unidad = entidad.unidad ? ` [${entidad.unidad}]` : "";
  return `${nombreOplAtributoValor(entidad)} es ${valor}${unidad}.`;
}

export function oracionEnlaceEstructural(modelo: Modelo, enlace: Enlace): string | null {
  if (!["agregacion", "exhibicion", "generalizacion", "clasificacion"].includes(enlace.tipo)) return null;
  if (!enlaceOplEsEmitible(modelo, enlace)) return null;
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
  for (const oracion of oracionEntidad(entidad)) {
    agregarLinea(lineas, oracion, refsEntidad(entidad.id), []);
  }
}

export function oracionEnlaceEstructuralInteractivo(modelo: Modelo, enlace: Enlace): OplLineaPendiente | null {
  const texto = oracionEnlaceEstructural(modelo, enlace);
  return texto ? { texto, refs: refsEnlace(modelo, enlace), hints: hintsEnlace(modelo, enlace, texto) } : null;
}
