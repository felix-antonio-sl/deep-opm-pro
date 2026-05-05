import { entidadDeExtremo, entidadIdDeExtremo } from "../../modelo/extremos";
import { rutaEtiquetaNormalizada } from "../../modelo/rutas";
import type { Abanico, Enlace, Modelo } from "../../modelo/tipos";
import { hintsAbanico, hintsEnlace, listarOpl, nombreOpl, refsAbanico, refsEnlace, type OplLineaPendiente } from "./refsHints";
import { oracionEnlaceConRuta } from "./procedural";

/**
 * Generador de oraciones OPL para abanicos OR/XOR.
 * Cubre SSOT OPL-ES §11 e ISO 19450 §619-§640.
 * Consumidores: `opl/generar.ts`.
 */

export function oracionesAbanicoInteractivo(modelo: Modelo, abanico: Abanico): OplLineaPendiente[] {
  const enlaces = enlacesDeAbanico(modelo, abanico);
  if (enlaces.some((enlace) => rutaEtiquetaNormalizada(enlace.rutaEtiqueta))) {
    return enlaces.flatMap((enlace) => {
      const texto = oracionEnlaceConRuta(modelo, enlace);
      return texto ? [{ texto, refs: refsEnlace(modelo, enlace), hints: hintsEnlace(modelo, enlace, texto) }] : [];
    });
  }
  const texto = oracionAbanico(modelo, abanico);
  if (!texto) return [];
  return [{
    texto,
    refs: refsAbanico(modelo, abanico),
    hints: hintsAbanico(modelo, abanico, texto),
  }];
}

export function oracionesAbanico(modelo: Modelo, abanico: Abanico): string[] {
  const enlaces = enlacesDeAbanico(modelo, abanico);
  if (enlaces.some((enlace) => rutaEtiquetaNormalizada(enlace.rutaEtiqueta))) {
    return enlaces.flatMap((enlace) => {
      const linea = oracionEnlaceConRuta(modelo, enlace);
      return linea ? [linea] : [];
    });
  }
  const linea = oracionAbanico(modelo, abanico);
  return linea ? [linea] : [];
}

export function oracionAbanico(modelo: Modelo, abanico: Abanico): string | null {
  const enlaces = enlacesDeAbanico(modelo, abanico);
  if (enlaces.length < 2) return null;
  const primer = enlaces[0];
  const puerto = modelo.entidades[abanico.puertoEntidadId];
  if (!puerto || !primer) return null;

  const otrosNombres: string[] = [];
  for (const enlace of enlaces) {
    const origenEntId = entidadIdDeExtremo(modelo, enlace.origenId);
    const otroExtremo = origenEntId === abanico.puertoEntidadId ? enlace.destinoId : enlace.origenId;
    const otraEnt = entidadDeExtremo(modelo, otroExtremo);
    if (otraEnt) otrosNombres.push(nombreOpl(otraEnt));
  }
  if (otrosNombres.length < 2) return null;

  const cuantificador = abanico.operador === "XOR" ? "exactamente uno de" : "al menos uno de";
  const lista = listarOpl(otrosNombres);
  const puertoEsOrigen = entidadIdDeExtremo(modelo, primer.origenId) === abanico.puertoEntidadId;
  const puertoOpl = nombreOpl(puerto);

  switch (primer.tipo) {
    case "agente":
      return puertoEsOrigen
        ? `${puertoOpl} maneja ${cuantificador} ${lista}.`
        : `${puertoOpl} es manejado por ${cuantificador} ${lista}.`;
    case "instrumento":
      return puertoEsOrigen
        ? `${puertoOpl} es requerido por ${cuantificador} ${lista}.`
        : `${puertoOpl} requiere ${cuantificador} ${lista}.`;
    case "consumo":
      return puertoEsOrigen
        ? `${puertoOpl} es consumido por ${cuantificador} ${lista}.`
        : `${puertoOpl} consume ${cuantificador} ${lista}.`;
    case "resultado":
      return puertoEsOrigen
        ? `${puertoOpl} genera ${cuantificador} ${lista}.`
        : `${puertoOpl} es generado por ${cuantificador} ${lista}.`;
    case "efecto":
      return `${puertoOpl} afecta ${cuantificador} ${lista}.`;
    case "invocacion":
      return puertoEsOrigen
        ? `${puertoOpl} invoca ${cuantificador} ${lista}.`
        : `${puertoOpl} es invocado por ${cuantificador} ${lista}.`;
    default:
      return null;
  }
}

function enlacesDeAbanico(modelo: Modelo, abanico: Abanico): Enlace[] {
  return abanico.enlaceIds
    .map((id) => modelo.enlaces[id])
    .filter((enlace): enlace is Enlace => enlace !== undefined);
}
