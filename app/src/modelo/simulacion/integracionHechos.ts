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
 * INTEGRACIÓN Ss↔Fs — simulación y razonamiento sobre el mismo cimiento de
 * hechos F0.
 *
 * Lectura heurística (`urn:fxsl:kb:icas-efectos`): la simulación despliega una
 * traza y el razonamiento vuelve a consultar hechos estáticos del mismo modelo.
 * Lo verificable aquí es más débil: una corrida no produce estructura nueva;
 * recorre entidades, estados y enlaces ya denotados por `hechosDe`.
 *
 * Este módulo es la frontera entre ambas capas: importa F0/F3 sin mutarlos.
 * No introduce primitiva OPM ni estructura categorial; sólo hace explícito —y
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
function enlacesEjercidos(modelo: Modelo, contexto: ContextoSimulacion): Set<Id> {
  const ids = new Set<Id>();
  for (const entrada of contexto.trace) {
    const paso = contexto.plan.find((item) => item.opdId === entrada.opdId && item.procesoId === entrada.procesoId);
    if (!paso) continue;
    if (entrada.omitido) {
      for (const id of [...paso.enlacesEntradaIds, ...paso.enlacesSalidaIds]) {
        const enlace = modelo.enlaces[id];
        if (enlace?.modificador === "condicion") ids.add(id);
      }
      continue;
    }
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

export interface ExercisedBoundaryComparison {
  sameSignature: boolean;
  scope: "exercised-boundary-signature";
  abstractSignature: string[];
  exercisedSignature: string[];
  differences?: string[];
}

/**
 * Firma dinámica de frontera: qué roles netos sobre la frontera del proceso
 * abstracto fueron realmente ejercidos por la traza del OPD refinado.
 *
 * Es la lectura operacional de F2↔S: no basta con que el hijo contenga enlaces
 * derivados; la simulación debe ejercerlos. La igualdad resultante está acotada
 * a la firma declarada y no demuestra bisimulación de los sistemas.
 */
export function firmaFronteraEjercidaPorTraza(
  modelo: Modelo,
  contexto: ContextoSimulacion,
  refinamientoId: Id,
): Set<string> {
  return firmaFronteraDeEnlaces(
    modelo,
    new Set(fronteraDe(modelo, refinamientoId)),
    enlacesEjercidos(modelo, contexto),
  );
}

export function compareExercisedBoundary(
  modelo: Modelo,
  contexto: ContextoSimulacion,
  refinamientoId: Id,
): ExercisedBoundaryComparison {
  const firmaAbstracta = firmaFronteraAbstracta(modelo, refinamientoId);
  const firmaEjercida = firmaFronteraEjercidaPorTraza(modelo, contexto, refinamientoId);
  const diferencias = diferenciaFirma(firmaAbstracta, firmaEjercida);
  return {
    sameSignature: diferencias.length === 0,
    scope: "exercised-boundary-signature",
    abstractSignature: firmaOrdenada(firmaAbstracta),
    exercisedSignature: firmaOrdenada(firmaEjercida),
    ...(diferencias.length > 0 ? { differences: diferencias } : {}),
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
  const enlaces = enlacesEjercidos(modelo, contexto);
  const seleccion: Hecho[] = [];
  for (const hecho of hechosDe(modelo).values()) {
    if (hecho.tipo === "entidad" && entidades.has(hecho.entidadId)) seleccion.push(hecho);
    else if (hecho.tipo === "estado" && estados.has(hecho.estadoId)) seleccion.push(hecho);
    else if (hecho.tipo === "enlace" && enlaces.has(hecho.enlaceId)) seleccion.push(hecho);
  }
  return conjunto(seleccion);
}

/**
 * Conecta la corrida con el razonamiento F3: por cada objeto que la simulación
 * transicionó, deriva los procesos que lo afectan. Demuestra que ambas capas
 * consultan el mismo sustrato; no afirma por sí sola una dualidad fold/unfold.
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
