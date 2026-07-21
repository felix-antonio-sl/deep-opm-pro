import {
  entidadIdDeExtremo,
  extremoApuntaAEntidad,
} from "../../extremos";
import { aparienciaEsInternaDeRefinamiento } from "../../contextoRefinamiento";
import {
  obtenerRefinamiento,
  quitarRefinamiento as quitarRefinamientoSlot,
  refinamientosDe,
  tieneRefinamiento,
} from "../../refinamientos";
import { aparienciaDeEntidadEnOpd, aparicionesVisiblesEnOpd } from "../../politicaApariciones";
import type {
  Apariencia,
  Enlace,
  Entidad,
  Estado,
  Id,
  Modelo,
  Opd,
  Resultado,
  TipoRefinamiento,
} from "../../tipos";
import { fallo, ok } from "../helpers";

/**
 * Helpers internos al subdirectorio refinamiento/.
 *
 * Algunos se re-exportan desde el barrel `refinamiento.ts` para preservar
 * el contrato público pre-ronda 9.5 (consumidores externos):
 *   - `quitarRefinamientoEntidad` (consumida por eliminacion.ts)
 *   - `subprocesosOrdenadosDeRefinamiento` (consumida por enlaces.ts)
 *   - `procesoDescompuestoEnOpd` (consumida por enlaces.ts/proyeccion.ts)
 *
 * El resto son privados al subdirectorio.
 */

export function quitarRefinamientoEntidad(modelo: Modelo, entidadId: Id, tipo?: TipoRefinamiento): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad || !tieneRefinamiento(entidad)) return fallo("La entidad no tiene refinamiento");
  // Si no se especifica tipo y hay solo uno, ese es el blanco; si hay dos, es ambiguo.
  const slots = refinamientosDe(entidad);
  const tipoBlanco = tipo ?? (slots.length === 1 ? slots[0]!.tipo : undefined);
  if (!tipoBlanco) return fallo("Refinamiento ambiguo: especificar tipo");
  const slot = obtenerRefinamiento(entidad, tipoBlanco);
  if (!slot) return fallo("La entidad no tiene refinamiento");
  const removidos = idsSubarbolOpd(modelo, slot.opdId);
  if (!removidos.has(slot.opdId)) {
    return fallo(`OPD de refinamiento no existe: ${slot.opdId}`);
  }

  const opds = Object.fromEntries(
    Object.entries(modelo.opds).filter(([opdId]) => !removidos.has(opdId)),
  );
  const entidadesVisibles = new Set(
    Object.values(opds).flatMap((opd) => Object.values(opd.apariencias).map((apariencia) => apariencia.entidadId)),
  );
  const entidades = Object.fromEntries(
    Object.entries(modelo.entidades)
      .filter(([id]) => entidadesVisibles.has(id))
      .map(([id, item]) => [id, sinRefinamientoRemovido(item, removidos)]),
  ) as Record<Id, Entidad>;
  const estados = Object.fromEntries(
    Object.entries(modelo.estados ?? {}).filter(([, estado]) => entidades[estado.entidadId]),
  ) as Record<Id, Estado>;
  const enlacesVisibles = new Set(
    Object.values(opds).flatMap((opd) => Object.values(opd.enlaces).map((apariencia) => apariencia.enlaceId)),
  );
  const enlaces = Object.fromEntries(
    Object.entries(modelo.enlaces).filter(([enlaceId, enlace]) => (
      enlacesVisibles.has(enlaceId) &&
      entidadIdDeExtremo({ ...modelo, entidades, estados }, enlace.origenId) !== null &&
      entidadIdDeExtremo({ ...modelo, entidades, estados }, enlace.destinoId) !== null
    )),
  ) as Record<Id, Enlace>;
  const opdsSinEnlacesHuerfanos = Object.fromEntries(
    Object.entries(opds).map(([opdId, opd]) => [
      opdId,
      {
        ...opd,
        enlaces: Object.fromEntries(
          Object.entries(opd.enlaces).filter(([, apariencia]) => enlaces[apariencia.enlaceId]),
        ),
      },
    ]),
  );

  return ok({ ...modelo, entidades, estados, enlaces, opds: opdsSinEnlacesHuerfanos });
}

export function subprocesosOrdenadosDeRefinamiento(modelo: Modelo, opd: Opd, procesoRefinadoId: Id): Apariencia[] {
  return entidadesInternasOrdenadasDeRefinamiento(modelo, opd, procesoRefinadoId, "proceso");
}

export function entidadesInternasOrdenadasDeRefinamiento(modelo: Modelo, opd: Opd, entidadRefinadaId: Id, tipo?: Entidad["tipo"]): Apariencia[] {
  const contorno = aparienciaDeEntidadEnOpd(opd, entidadRefinadaId);
  if (!contorno) return [];
  return aparicionesVisiblesEnOpd(opd)
    .filter((apariencia) => apariencia.entidadId !== entidadRefinadaId)
    .filter((apariencia) => {
      const entidad = modelo.entidades[apariencia.entidadId];
      return entidad && (!tipo || entidad.tipo === tipo);
    })
    .filter((apariencia) => aparienciaEsInternaDeRefinamiento(modelo, opd.id, apariencia, contorno))
    .sort((a, b) => compararOrdenTemporal(a, b));
}

export function cosaDescompuestaEnOpd(modelo: Modelo, opd: Opd): { entidad: Entidad; apariencia: Apariencia } | null {
  for (const apariencia of Object.values(opd.apariencias)) {
    const entidad = modelo.entidades[apariencia.entidadId];
    if (entidad && obtenerRefinamiento(entidad, "descomposicion")?.opdId === opd.id) {
      return { entidad, apariencia };
    }
  }
  return null;
}

/**
 * Agrupa subprocesos cuya altura superior difiere dentro de la tolerancia OPM
 * de in-zooming. La linea temporal fluye de arriba hacia abajo; alturas
 * equivalentes representan invocacion implicita paralela.
 *
 * Refs: opm-iso-19450-es.md:708, opm-opl-es.md:453-454.
 */
export function agruparSubprocesosParalelos(
  subprocesos: Apariencia[],
  toleranciaY = 4,
): Apariencia[][] {
  const ordenados = [...subprocesos].sort((a, b) => compararOrdenTemporal(a, b));
  const grupos: Apariencia[][] = [];

  for (const apariencia of ordenados) {
    const ultimo = grupos[grupos.length - 1];
    const referenciaY = ultimo?.[0]?.y;
    if (ultimo && referenciaY !== undefined && Math.abs(apariencia.y - referenciaY) <= toleranciaY) {
      ultimo.push(apariencia);
      ultimo.sort((a, b) => a.x - b.x || a.id.localeCompare(b.id));
      continue;
    }
    grupos.push([apariencia]);
  }

  return grupos;
}

/**
 * Cara 4 de la bimodalidad de `Opd.ordenInzoom` (canvas→campo): proyecta la
 * GEOMETRIA de los subprocesos internos de un in-zoom de proceso al campo de
 * orden en FORMA NORMAL. Es el cociente del que `autoria/layout.ts` es la
 * seccion (`derivar ∘ layout = id`, ley en `leyes/`); reusa el MISMO agrupador
 * `agruparSubprocesosParalelos` que el forward OPL, lo que garantiza por
 * construccion `OPL(geometria) = OPL(campo) ∘ derivar`.
 *
 * Conjunto de internos: procesos dentro del contorno de descomposicion (mismo
 * criterio geometrico `dentroDe` que `aparienciasInternasDeRefinamiento` del
 * forward), excluido el contorno y excluidos los externos (rol = externo).
 *
 * Forma normal del cociente (canonicidad — un solo representante por orden):
 *   - particion TOTAL de los internos (siempre lo es: cada interno cae en una
 *     banda por su Y);
 *   - `< 2` bandas (todo paralelo o ≤1 subproceso) ⇒ `undefined`, NO `[[todos]]`:
 *     `undefined` es el representante canonico del objeto inicial «sin orden
 *     secuencial» (coincide con `podarOrdenInzoom` de eliminacion.ts).
 * Cada banda viene ordenada intra-banda por X (luego id), igual que el forward.
 *
 * Puro: no muta el modelo. Spec: docs/specs/2026-06-15-orden-inzoom-canvas-sync-design.md
 */
export function derivarOrdenInzoomDeGeometria(modelo: Modelo, opdId: Id): Id[][] | undefined {
  const opd = modelo.opds[opdId];
  if (!opd) return undefined;
  const contorno = contornoProcesoDeOpd(modelo, opd);
  if (!contorno) return undefined;
  const subprocesos = Object.values(opd.apariencias).filter((apariencia) => {
    if (apariencia.id === contorno.id) return false;
    if (apariencia.contextoRefinamiento?.rol === "externo") return false;
    if (modelo.entidades[apariencia.entidadId]?.tipo !== "proceso") return false;
    return dentroDe(apariencia, contorno);
  });
  const bandas = agruparSubprocesosParalelos(subprocesos);
  if (bandas.length < 2) return undefined;
  return bandas.map((banda) => banda.map((apariencia) => apariencia.entidadId));
}

/**
 * Guard de idempotencia (ajuste D2): deriva el campo de la geometria (helper
 * anterior) y lo escribe SOLO si difiere del actual (deep-equal de bandas).
 *   - difiere y hay orden    → escribe el campo;
 *   - difiere y es undefined → BORRA el campo (vuelve al fallback geometrico/OPL);
 *   - identico               → devuelve el modelo SIN tocar (misma referencia).
 * El no-op es load-bearing: un nudge cosmetico dentro de la tolerancia de
 * `agruparSubprocesosParalelos` produce el mismo campo → no destruye un paralelo
 * declarado por OPL con un arrastre de 5px ni genera churn en undo/reproducibilidad.
 * Solo CRUZAR una banda reescribe. Puro: devuelve un modelo nuevo o el mismo.
 */
export function aplicarOrdenInzoomDerivado(modelo: Modelo, opdId: Id): Modelo {
  const opd = modelo.opds[opdId];
  if (!opd) return modelo;
  const derivado = derivarOrdenInzoomDeGeometria(modelo, opdId);
  // Compara en FORMA NORMAL: `≤1 banda` ≡ `undefined` (mismo representante del
  // objeto inicial «sin orden secuencial»). Así un campo `[[a,b]]` de 1 banda
  // declarado por OPL (paralelo) + un drag que no cruza banda → no-op, sin
  // pérdida silenciosa ni churn (riesgo §6 / ajuste D2).
  if (mismaSecuenciaBandas(formaNormalBandas(opd.ordenInzoom), derivado)) return modelo;
  const { ordenInzoom: _previo, ...restoOpd } = opd;
  return {
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: { ...restoOpd, ...(derivado ? { ordenInzoom: derivado } : {}) },
    },
  };
}

/**
 * Predicado de disparo (U8.3): ¿la apariencia `aparienciaId` es un subproceso
 * INTERNO del in-zoom de proceso del OPD `opdId`? Mismo criterio que
 * `derivarOrdenInzoomDeGeometria` (proceso, dentro del contorno, no contorno, no
 * externo). El store lo usa para derivar el orden SOLO al arrastrar un subproceso
 * interno (no al mover objetos, externos, ni en OPDs que no son in-zoom).
 */
export function aparienciaEsSubprocesoInternoDeInzoom(modelo: Modelo, opdId: Id, aparienciaId: Id): boolean {
  const opd = modelo.opds[opdId];
  if (!opd) return false;
  const apariencia = opd.apariencias[aparienciaId];
  if (!apariencia) return false;
  const contorno = contornoProcesoDeOpd(modelo, opd);
  if (!contorno || apariencia.id === contorno.id) return false;
  if (apariencia.contextoRefinamiento?.rol === "externo") return false;
  if (modelo.entidades[apariencia.entidadId]?.tipo !== "proceso") return false;
  return dentroDe(apariencia, contorno);
}

/** El contorno (apariencia del proceso refinable) cuya descomposicion es este OPD. */
function contornoProcesoDeOpd(modelo: Modelo, opd: Opd): Apariencia | undefined {
  return Object.values(opd.apariencias).find((apariencia) => {
    const entidad = modelo.entidades[apariencia.entidadId];
    return entidad?.tipo === "proceso" && obtenerRefinamiento(entidad, "descomposicion")?.opdId === opd.id;
  });
}

/** Lleva un campo a la forma normal del cociente: `≤1 banda` ⇒ `undefined`. */
function formaNormalBandas(orden: Id[][] | undefined): Id[][] | undefined {
  return orden && orden.length >= 2 ? orden : undefined;
}

/** Igualdad estructural de dos presentaciones de orden (bandas con cardinalidad). */
function mismaSecuenciaBandas(a: Id[][] | undefined, b: Id[][] | undefined): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  return a.every((banda, i) => {
    const otra = b[i]!;
    return banda.length === otra.length && banda.every((id, j) => id === otra[j]);
  });
}

export function procesoDescompuestoEnOpd(modelo: Modelo, opd: Opd): { entidad: Entidad; apariencia: Apariencia } | null {
  for (const apariencia of Object.values(opd.apariencias)) {
    const entidad = modelo.entidades[apariencia.entidadId];
    if (entidad?.tipo === "proceso" && obtenerRefinamiento(entidad, "descomposicion")?.opdId === opd.id) {
      return { entidad, apariencia };
    }
  }
  return null;
}

export function enlacesExternosDeEntidad(
  modelo: Modelo,
  opdPadre: Opd,
  entidadId: Id,
): Array<{ enlace: Enlace; externoId: Id; aparienciaPadre: Apariencia }> {
  const aparienciasPadre = new Map(Object.values(opdPadre.apariencias).map((apariencia) => [apariencia.entidadId, apariencia]));
  const externos: Array<{ enlace: Enlace; externoId: Id; aparienciaPadre: Apariencia }> = [];
  for (const aparienciaEnlace of Object.values(opdPadre.enlaces)) {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) continue;
    const externoExtremo = extremoApuntaAEntidad(enlace.origenId, entidadId)
      ? enlace.destinoId
      : extremoApuntaAEntidad(enlace.destinoId, entidadId)
        ? enlace.origenId
        : null;
    const externoId = externoExtremo ? entidadIdDeExtremo(modelo, externoExtremo) : null;
    if (!externoId) continue;
    const aparienciaPadre = aparienciasPadre.get(externoId);
    if (!aparienciaPadre) continue;
    externos.push({ enlace, externoId, aparienciaPadre });
  }
  return externos;
}

export function enlacesExternosDelProceso(
  modelo: Modelo,
  opdPadre: Opd,
  procesoId: Id,
): Array<{ enlace: Enlace; externoId: Id; aparienciaPadre: Apariencia }> {
  return enlacesExternosDeEntidad(modelo, opdPadre, procesoId);
}

export function siguienteNombreOpdHijo(modelo: Modelo, opdPadreId: Id): string {
  const opdPadre = modelo.opds[opdPadreId];
  const codigoPadre = codigoOpd(opdPadre?.nombre ?? "SD");
  const usados = new Set(
    Object.values(modelo.opds)
      .filter((opd) => opd.padreId === opdPadreId)
      .map((opd) => codigoOpd(opd.nombre)),
  );

  for (let index = 1; index < Number.MAX_SAFE_INTEGER; index += 1) {
    const candidato = codigoPadre === "SD" ? `SD${index}` : `${codigoPadre}.${index}`;
    if (!usados.has(candidato)) return candidato;
  }
  return codigoPadre === "SD" ? "SD1" : `${codigoPadre}.1`;
}

export function dentroDe(apariencia: Apariencia, contorno: Apariencia): boolean {
  return (
    apariencia.x >= contorno.x &&
    apariencia.y >= contorno.y &&
    apariencia.x + apariencia.width <= contorno.x + contorno.width &&
    apariencia.y + apariencia.height <= contorno.y + contorno.height
  );
}

export function compararOrdenTemporal(a: Apariencia, b: Apariencia): number {
  return a.y - b.y || a.x - b.x || a.id.localeCompare(b.id);
}

function codigoOpd(nombre: string): string {
  return /^SD(?:\d+(?:\.\d+)*)?/.exec(nombre.trim())?.[0] ?? nombre;
}

export function idsSubarbolOpd(modelo: Modelo, raizId: Id): Set<Id> {
  const removidos = new Set<Id>();
  const pendientes = [raizId];
  while (pendientes.length > 0) {
    const actual = pendientes.pop();
    if (!actual || removidos.has(actual) || !modelo.opds[actual]) continue;
    removidos.add(actual);
    for (const opd of Object.values(modelo.opds)) {
      if (opd.padreId === actual) pendientes.push(opd.id);
    }
  }
  return removidos;
}

function sinRefinamientoRemovido(entidad: Entidad, removidos: Set<Id>): Entidad {
  if (!entidad.refinamientos) return entidad;
  let resultado = entidad;
  for (const tipo of ["descomposicion", "despliegue"] as const) {
    const slot = resultado.refinamientos?.[tipo];
    if (slot && removidos.has(slot.opdId)) {
      resultado = quitarRefinamientoSlot(resultado, tipo);
    }
  }
  return resultado;
}
