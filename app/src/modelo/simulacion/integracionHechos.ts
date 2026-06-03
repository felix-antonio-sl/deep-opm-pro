import { conjunto, hechosDe, type ConjuntoDeHechos, type Hecho } from "../hechos";
import {
  entidadDeExtremoFrontera,
  firmaFronteraDeEnlaces,
  fronteraDe,
} from "../equivalencia/frontera";
import { derivar, type HechoDerivado } from "../razonamiento";
import type { Id, Modelo } from "../tipos";
import type { ContextoSimulacion } from "./tipos";

/**
 * INTEGRACIÓN Ss↔Fs — la simulación (anamorfismo) leída sobre el cimiento de
 * hechos F0 y reconciliada con el razonamiento F3 (catamorfismo).
 *
 * Tesis (`urn:fxsl:kb:icas-efectos`): el unfold de S y el fold de F3 son DUALES
 * sobre el mismo carrier. El carrier compartido es el haz de hechos de F0
 * (`hechosDe`). Una corrida no produce estructura nueva: RECORRE el modelo y
 * ejerce una SECCIÓN del haz — las entidades, estados y enlaces que tocó.
 *
 * Este módulo es la frontera entre ambas capas: importa F0/F3 sin mutarlos.
 * No introduce primitiva OPM ni functor nuevo; sólo hace explícito —y
 * verificable por las leyes de `src/leyes/integracion-ss-fs.test.ts`— que las
 * dos capas hablan del mismo sustrato.
 */

/** Entidades (procesos ejecutados + objetos transicionados) que la corrida visitó. */
export function entidadesVisitadas(contexto: ContextoSimulacion): Set<Id> {
  const ids = new Set<Id>();
  for (const entrada of contexto.trace) {
    ids.add(entrada.procesoId);
    for (const transicion of entrada.transicionesAplicadas) ids.add(transicion.entidadId);
  }
  return ids;
}

/** Estados que la corrida tocó (antes/después de cada transición aplicada). */
function estadosEjercidos(contexto: ContextoSimulacion): Set<Id> {
  const ids = new Set<Id>();
  for (const entrada of contexto.trace) {
    for (const transicion of entrada.transicionesAplicadas) {
      if (transicion.estadoAntesId) ids.add(transicion.estadoAntesId);
      if (transicion.estadoDespuesId) ids.add(transicion.estadoDespuesId);
    }
  }
  return ids;
}

/** Enlaces que la corrida ejerció: entrada/salida de cada paso efectivamente ejecutado. */
function enlacesEjercidos(contexto: ContextoSimulacion): Set<Id> {
  const ids = new Set<Id>();
  const ejecutados = contexto.plan.slice(0, contexto.trace.length);
  for (const paso of ejecutados) {
    for (const id of paso.enlacesEntradaIds) ids.add(id);
    for (const id of paso.enlacesSalidaIds) ids.add(id);
  }
  return ids;
}

function firmaFronteraAbstracta(modelo: Modelo, refinamientoId: Id): Set<string> {
  const frontera = new Set(fronteraDe(modelo, refinamientoId));
  const enlacesContorno: Id[] = [];
  for (const enlace of Object.values(modelo.enlaces)) {
    const origen = entidadDeExtremoFrontera(enlace.origenId, modelo);
    const destino = entidadDeExtremoFrontera(enlace.destinoId, modelo);
    if (origen === refinamientoId || destino === refinamientoId) enlacesContorno.push(enlace.id);
  }
  return firmaFronteraDeEnlaces(modelo, frontera, enlacesContorno);
}

function diferenciaFirma(esperada: ReadonlySet<string>, observada: ReadonlySet<string>): string[] {
  const diferencias: string[] = [];
  for (const item of esperada) if (!observada.has(item)) diferencias.push(item);
  for (const item of observada) if (!esperada.has(item)) diferencias.push(item);
  return diferencias.sort();
}

function firmaOrdenada(firma: ReadonlySet<string>): string[] {
  return [...firma].sort();
}

export interface BisimulacionFrontera {
  equivalente: boolean;
  firmaAbstracta: string[];
  firmaEjercida: string[];
  diferencias?: string[];
}

/**
 * Firma dinámica de frontera: qué roles netos sobre la frontera del proceso
 * abstracto fueron realmente ejercidos por la traza del OPD refinado.
 *
 * Es la lectura operacional de F2↔S: no basta con que el hijo contenga enlaces
 * derivados; la simulación debe ejercerlos. Fundamento formal: bisimulación
 * observacional (`urn:fxsl:kb:icas-efectos`) sobre la frontera que el eje
 * vertical preserva (`urn:fxsl:kb:icas-adjunciones`, como hipótesis de
 * round-trip in-zoom/out-zoom).
 */
export function firmaFronteraEjercidaPorTraza(
  modelo: Modelo,
  contexto: ContextoSimulacion,
  refinamientoId: Id,
): Set<string> {
  return firmaFronteraDeEnlaces(
    modelo,
    new Set(fronteraDe(modelo, refinamientoId)),
    enlacesEjercidos(contexto),
  );
}

export function verificarBisimulacionFrontera(
  modelo: Modelo,
  contexto: ContextoSimulacion,
  refinamientoId: Id,
): BisimulacionFrontera {
  const firmaAbstracta = firmaFronteraAbstracta(modelo, refinamientoId);
  const firmaEjercida = firmaFronteraEjercidaPorTraza(modelo, contexto, refinamientoId);
  const diferencias = diferenciaFirma(firmaAbstracta, firmaEjercida);
  return {
    equivalente: diferencias.length === 0,
    firmaAbstracta: firmaOrdenada(firmaAbstracta),
    firmaEjercida: firmaOrdenada(firmaEjercida),
    ...(diferencias.length > 0 ? { diferencias } : {}),
  };
}

/**
 * La SECCIÓN del haz de hechos F0 que la simulación ejerció — subconjunto de
 * `hechosDe(modelo)`. Reifica el recorrido dinámico del unfold como hechos
 * estáticos de F0. Ley S⊑F0: el resultado es siempre ⊆ `hechosDe(modelo)`
 * (la simulación no inventa estructura fuera de la denotación).
 */
export function hechosEjercidosPorTraza(modelo: Modelo, contexto: ContextoSimulacion): ConjuntoDeHechos {
  const entidades = entidadesVisitadas(contexto);
  const estados = estadosEjercidos(contexto);
  const enlaces = enlacesEjercidos(contexto);
  const seleccion: Hecho[] = [];
  for (const hecho of hechosDe(modelo).values()) {
    if (hecho.tipo === "entidad" && entidades.has(hecho.entidadId)) seleccion.push(hecho);
    else if (hecho.tipo === "estado" && estados.has(hecho.estadoId)) seleccion.push(hecho);
    else if (hecho.tipo === "enlace" && enlaces.has(hecho.enlaceId)) seleccion.push(hecho);
  }
  return conjunto(seleccion);
}

/**
 * El CICLO unfold→fold hecho ejecutable: el razonamiento F3 (catamorfismo) opera
 * sobre lo que la simulación S (anamorfismo) ejerció. Por cada objeto que la
 * corrida transicionó, deriva los procesos que lo afectan — la estática (F3)
 * debe reconocer la dinámica (S). Es el dual del despliegue: donde S abrió la
 * traza, F3 la colapsa de vuelta a hechos derivados.
 */
export function razonarSobreCorrida(modelo: Modelo, contexto: ContextoSimulacion): HechoDerivado[] {
  const objetos = new Set<Id>();
  for (const entrada of contexto.trace) {
    for (const transicion of entrada.transicionesAplicadas) objetos.add(transicion.entidadId);
  }
  const out: HechoDerivado[] = [];
  for (const entidadId of objetos) out.push(...derivar(modelo, { tipo: "afectan-a", entidadId }));
  return out;
}
