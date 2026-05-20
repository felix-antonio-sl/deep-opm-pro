import { puertoExactoCompartidoDeAbanico } from "../../modelo/abanicos";
import { entidadDeExtremo, estadoDeExtremo } from "../../modelo/extremos";
import { rutaEtiquetaNormalizada } from "../../modelo/rutas";
import type { Abanico, Enlace, Modelo } from "../../modelo/tipos";
import { hintsAbanico, hintsEnlace, listarOpl, nombreOpl, nombreOplExtremo, refsAbanico, refsEnlace, type OplLineaPendiente } from "./refsHints";
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
  const puertoComun = puertoExactoCompartidoDeAbanico(modelo, abanico);
  const puerto = puertoComun ? modelo.entidades[puertoComun.entidadId] : undefined;
  if (!puertoComun || !puerto || !primer) return null;

  const otrosNombres: string[] = [];
  for (const enlace of enlaces) {
    const otro = extremoOpuestoAbanico(modelo, abanico, enlace);
    if (!otro) continue;
    const otraEnt = entidadDeExtremo(modelo, otro.extremo);
    if (otraEnt) otrosNombres.push(nombreOplExtremo(modelo, otro.extremo, otro.multiplicidad));
  }
  if (otrosNombres.length < 2) return null;

  const cuantificador = abanico.operador === "XOR" ? "exactamente uno de" : "al menos uno de";
  const puertoEsOrigen = puertoComun.lado === "origen";
  const estadosAgrupados = oracionAbanicoEstados(modelo, abanico, enlaces, primer, cuantificador, puertoEsOrigen);
  if (estadosAgrupados) return estadosAgrupados;
  const lista = listarOpl(otrosNombres);
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

function oracionAbanicoEstados(
  modelo: Modelo,
  abanico: Abanico,
  enlaces: readonly Enlace[],
  primer: Enlace,
  cuantificador: string,
  puertoEsOrigen: boolean,
): string | null {
  if (primer.tipo !== "consumo" && primer.tipo !== "resultado") return null;
  if (primer.tipo === "consumo" && puertoEsOrigen) return null;
  if (primer.tipo === "resultado" && !puertoEsOrigen) return null;

  let objetoId: string | null = null;
  const estados: string[] = [];
  for (const enlace of enlaces) {
    if (enlace.tipo !== primer.tipo) return null;
    const otro = extremoOpuestoAbanico(modelo, abanico, enlace);
    if (!otro) return null;
    const estado = estadoDeExtremo(modelo, otro.extremo);
    if (!estado) return null;
    if (objetoId && estado.entidadId !== objetoId) return null;
    objetoId = estado.entidadId;
    estados.push(`\`${estado.nombre}\``);
  }
  if (!objetoId || estados.length < 2) return null;
  const puertoComun = puertoExactoCompartidoDeAbanico(modelo, abanico);
  const puerto = puertoComun ? modelo.entidades[puertoComun.entidadId] : undefined;
  const objeto = modelo.entidades[objetoId];
  if (!puerto || !objeto) return null;

  const puertoOpl = nombreOpl(puerto);
  const objetoOpl = nombreOpl(objeto);
  const lista = listarOpl(estados);
  if (primer.tipo === "resultado") return `${puertoOpl} cambia ${objetoOpl} a ${cuantificador} ${lista}.`;
  return `${puertoOpl} cambia ${objetoOpl} de ${cuantificador} ${lista}.`;
}

function enlacesDeAbanico(modelo: Modelo, abanico: Abanico): Enlace[] {
  return abanico.enlaceIds
    .map((id) => modelo.enlaces[id])
    .filter((enlace): enlace is Enlace => enlace !== undefined);
}

function extremoOpuestoAbanico(
  modelo: Modelo,
  abanico: Abanico,
  enlace: Enlace,
): { extremo: Enlace["origenId"]; multiplicidad?: string } | null {
  const puertoComun = puertoExactoCompartidoDeAbanico(modelo, abanico);
  if (!puertoComun) return null;
  if (puertoComun.lado === "origen" && enlace.origenId.kind === "entidad" && enlace.origenId.id === puertoComun.entidadId && enlace.origenId.portId === puertoComun.portId) {
    return {
      extremo: enlace.destinoId,
      ...(enlace.multiplicidadDestino ? { multiplicidad: enlace.multiplicidadDestino } : {}),
    };
  }
  if (puertoComun.lado === "destino" && enlace.destinoId.kind === "entidad" && enlace.destinoId.id === puertoComun.entidadId && enlace.destinoId.portId === puertoComun.portId) {
    return {
      extremo: enlace.origenId,
      ...(enlace.multiplicidadOrigen ? { multiplicidad: enlace.multiplicidadOrigen } : {}),
    };
  }
  return null;
}
