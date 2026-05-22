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

  // BUG-20260519T200211Z-62ee85: los nombres del abanico deben deduplicarse,
  // porque dos enlaces que apuntan al mismo extremo (misma entidad sin estado
  // diferenciado, o el mismo estado dos veces) generaban "al menos uno de X y X",
  // texto que no representa el modelo. La oracion canonica de abanico requiere
  // al menos dos extremos distintos; si la deduplicacion los reduce a uno solo,
  // se devuelve la oracion individual del primer enlace en lugar del abanico.
  const otrosNombres: string[] = [];
  const otrosKeys = new Set<string>();
  for (const enlace of enlaces) {
    const otro = extremoOpuestoAbanico(modelo, abanico, enlace);
    if (!otro) continue;
    const otraEnt = entidadDeExtremo(modelo, otro.extremo);
    if (!otraEnt) continue;
    const clave = `${otro.extremo.kind}:${otro.extremo.id}`;
    if (otrosKeys.has(clave)) continue;
    otrosKeys.add(clave);
    otrosNombres.push(nombreOplExtremo(modelo, otro.extremo, otro.multiplicidad));
  }
  if (otrosNombres.length === 1) {
    return oracionEnlaceConRuta(modelo, primer);
  }
  if (otrosNombres.length < 2) return null;

  const cuantificador = abanico.operador === "XOR" ? "exactamente uno de" : "al menos uno de";
  const puertoEsOrigen = puertoComun.lado === "origen";
  const estadosAgrupados = oracionAbanicoEstados(modelo, abanico, enlaces, primer, cuantificador, puertoEsOrigen);
  if (estadosAgrupados) return estadosAgrupados;
  const lista = listarOpl(otrosNombres);
  const puertoOpl = nombreOpl(puerto);

  // SSOT OPL-ES §11.4 "Condición + XOR/OR": cuando todos los enlaces del abanico
  // llevan modificador `condicion`, la oración canónica usa el patrón
  // "ocurre si … existe, de lo contrario … se omite" en lugar del verbo directo.
  // Solo se aplica si TODOS los enlaces son condicionales y comparten tipo;
  // un abanico mixto (algunos con `condicion`, otros sin) recae en el comportamiento
  // por defecto, porque la semántica condicional debe valer para todas las ramas.
  const todosCondicionales = enlaces.every((enlace) => enlace.modificador === "condicion");
  const mismoTipo = enlaces.every((enlace) => enlace.tipo === primer.tipo);
  if (todosCondicionales && mismoTipo) {
    const condicional = oracionAbanicoCondicional(primer.tipo, puertoOpl, cuantificador, lista, puertoEsOrigen);
    if (condicional) return condicional;
  }

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

/**
 * Forma canónica de abanico XOR/OR combinado con modificador `condicion`.
 * Derivada de SSOT opm-opl-es §11.4 y del patrón individual de `procedural.ts`
 * (rama `case "condicion"` por tipo de enlace).
 *
 * Tabla por tipo × puertoEsOrigen:
 * - instrumento + destino convergente (caso del bug): proceso ocurre si {cuant} {objetos} existe, ...
 * - instrumento + origen divergente: {cuant} {procesos} ocurre si objeto existe, ...
 * - consumo + destino convergente: proceso ocurre si {cuant} {objetos} existe, en cuyo caso lo consume, ...
 * - consumo + origen divergente: poco común (objeto consumido por múltiples procesos como condición); espejo.
 * - agente + destino convergente: proceso es manejado por {cuant} {agentes}, condicionalmente.
 * - efecto: idéntico patrón al consumo, con "afecta" en vez de "consume".
 *
 * Casos sin canon explícito (resultado, invocacion + condicion + abanico) devuelven null
 * y caen al comportamiento sin modificador. Marcados con TODO para revisión SSOT.
 */
function oracionAbanicoCondicional(
  tipo: Enlace["tipo"],
  puertoOpl: string,
  cuantificador: string,
  lista: string,
  puertoEsOrigen: boolean,
): string | null {
  switch (tipo) {
    case "instrumento":
      return puertoEsOrigen
        ? `${cuantificador} ${lista} ocurre si ${puertoOpl} existe, de lo contrario se omite.`
        : `${puertoOpl} ocurre si ${cuantificador} ${lista} existe, de lo contrario ${puertoOpl} se omite.`;
    case "consumo":
      return puertoEsOrigen
        ? `${cuantificador} ${lista} ocurre si ${puertoOpl} existe, en cuyo caso consume ${puertoOpl}, de lo contrario se omite.`
        : `${puertoOpl} ocurre si ${cuantificador} ${lista} existe, en cuyo caso ${puertoOpl} consume ${lista}, de lo contrario ${puertoOpl} se omite.`;
    case "agente":
      return puertoEsOrigen
        ? `${puertoOpl} maneja ${cuantificador} ${lista} si ${puertoOpl} existe, de lo contrario se omite.`
        : `${puertoOpl} ocurre si ${cuantificador} ${lista} existe, en cuyo caso ${cuantificador} ${lista} maneja ${puertoOpl}, de lo contrario ${puertoOpl} se omite.`;
    case "efecto":
      return puertoEsOrigen
        ? `${puertoOpl} ocurre si ${cuantificador} ${lista} existe, en cuyo caso ${puertoOpl} afecta ${lista}, de lo contrario ${puertoOpl} se omite.`
        : `${cuantificador} ${lista} ocurre si ${puertoOpl} existe, en cuyo caso afecta ${puertoOpl}, de lo contrario se omite.`;
    case "resultado":
      // TODO: SSOT canónico pendiente para "resultado + condicion + abanico".
      // En procedural.ts:304-307 la oración individual es semánticamente débil
      // ("ocurre si X puede generarse"); replicarla a abanico sin canon explícito
      // arriesga generar texto incorrecto. Mantengo comportamiento por defecto.
      return null;
    case "invocacion":
      // TODO: SSOT canónico pendiente para "invocacion + condicion + abanico".
      // procedural.ts:314-315 da forma individual ("X invoca Y si X ocurre") sin
      // semántica "ocurre si ... de lo contrario ... se omite". Mantengo por defecto.
      return null;
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
