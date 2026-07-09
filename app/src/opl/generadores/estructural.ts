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
 * Clasificación de una cosa (D1 · OPCloud / HU-SHARED-007-eco-opl):
 * esencia y afiliación se componen en UNA oración con el sustantivo de tipo,
 * coordinadas con «y» — `**Objeto** es un objeto {esencia} y {afiliacion}.`
 * (forma OPCloud: `*Rescatar* es un proceso informacional y sistémico.`).
 * Las designaciones atómicas D1–D4 de la SSOT son los bloques; el eco las
 * coordina, como D5 (estados) y D10 (`es inicial y final`).
 * Bajo `solo-difiere` se coordinan solo las propiedades que difieren del default.
 * El caso atributo-con-valor es una sola oración (no es clasificación).
 */
export function oracionEntidad(entidad: Entidad, opciones?: VisibilidadOpl): string[] {
  const atributoValor = oracionValorAtributo(entidad);
  if (atributoValor) return [atributoValor];
  const nombre = nombreOpl(entidad);
  const visibilidad = opciones?.esencia ?? "siempre";
  if (visibilidad === "oculta") return [];
  const sustantivoTipo = entidad.tipo === "proceso" ? "proceso" : "objeto";
  const esenciaDifiere = entidad.esencia !== "informacional";
  const afiliacionDifiere = entidad.afiliacion !== "sistemica";
  const propiedades: string[] = [];
  if (visibilidad === "siempre" || esenciaDifiere) propiedades.push(textoEsencia(entidad));
  if (visibilidad === "siempre" || afiliacionDifiere) propiedades.push(textoAfiliacion(entidad));
  if (propiedades.length === 0) return [];
  return [`${nombre} es un ${sustantivoTipo} ${propiedades.join(" y ")}.`];
}

export function oracionValorAtributo(entidad: Entidad): string | null {
  if (!entidad.valorSlot) return null;
  const valor = entidad.valorSlot.valor ?? "valor";
  const unidad = entidad.unidad ? ` [${entidad.unidad}]` : "";
  return `${nombreOplAtributoValor(entidad)} es ${valor}${unidad}.`;
}

export function oracionEnlaceEstructural(modelo: Modelo, enlace: Enlace, esApunte = false): string | null {
  if (!["agregacion", "exhibicion", "generalizacion", "clasificacion"].includes(enlace.tipo)) return null;
  if (!enlaceOplEsEmitible(modelo, enlace, esApunte)) return null;
  const origen = nombreOplExtremo(modelo, enlace.origenId, enlace.multiplicidadOrigen);
  const destino = nombreOplExtremo(modelo, enlace.destinoId, enlace.multiplicidadDestino);
  const destinoSinMultiplicidad = nombreOplExtremo(modelo, enlace.destinoId, undefined);
  const origenPlural = multiplicidadPlural(enlace.multiplicidadOrigen);
  const destinoPlural = multiplicidadPlural(enlace.multiplicidadDestino);

  switch (enlace.tipo) {
    case "agregacion":
      return `${origen} ${verbo("consta", "constan", origenPlural)} de ${destino}.`;
    case "exhibicion":
      if (esMultiplicidadOpcional(enlace.multiplicidadDestino)) {
        return `${origen} tiene un ${destinoSinMultiplicidad} opcional.`;
      }
      return `${origen} ${verbo("exhibe", "exhiben", origenPlural)} ${destino}.`;
    case "generalizacion":
      return destinoPlural ? `${destino} son ${origen}.` : `${destino} es un ${origen}.`;
    case "clasificacion":
      return destinoPlural ? `${destino} son instancias de ${origen}.` : `${destino} es una instancia de ${origen}.`;
    default:
      return null;
  }
}

function esMultiplicidadOpcional(multiplicidad: string | undefined): boolean {
  return multiplicidad === "0..1" || multiplicidad === "?";
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
