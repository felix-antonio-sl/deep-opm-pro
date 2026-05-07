/**
 * Verificacion metodologica OPM.
 *
 * Citas SSOT: [Met §metodologia] [Met §inzoom] [Met §unfold]
 * [Glos 3.55 Object] [Glos 3.69 Process] [Glos 3.x reglas].
 *
 * Referencias semanticas OPCloud verificadas:
 * opm-extracted/src/app/dialogs/methodological-checking-dialog/checkers/ing-checker.ts
 * opm-extracted/src/app/dialogs/methodological-checking-dialog/checkers/object-name-as-singular-checker.ts
 * opm-extracted/src/app/dialogs/methodological-checking-dialog/checkers/inzoomed-content-checker.ts
 * opm-extracted/src/app/dialogs/methodological-checking-dialog/checkers/part-unfold-content-checker.ts
 * opm-extracted/src/app/dialogs/methodological-checking-dialog/checkers/transforming-process-checker.ts
 * opm-extracted/src/app/dialogs/methodological-checking-dialog/checkers/systemic-processes-main-function-checker.ts
 *
 * Destilacion semantica, no copia 1:1: se adapta a Modelo/Entidad/Enlace propios.
 */

import { naturalezaDeEnlace } from "./constantes";
import { entidadDeExtremo, entidadIdDeExtremo, extremoApuntaAEntidad } from "./extremos";
import type { AvisoMetodologico, CodigoChecker, Entidad, Id, Modelo, TipoEnlace } from "./tipos";

const TRANSFORMADORES = new Set<TipoEnlace>(["consumo", "resultado", "efecto"]);
const INVARIABLES_SINGULAR = new Set(["analisis", "sintesis", "crisis", "tesis", "hipotesis", "virus", "gas"]);

export function verificarMetodologia(modelo: Modelo): AvisoMetodologico[] {
  return [
    ...checkProcesoNombreFormaVerbal(modelo),
    ...checkObjetoNombreSingular(modelo),
    ...checkInzoomContenido(modelo),
    ...checkUnfoldContenido(modelo),
    ...checkProcesoTransforma(modelo),
    ...checkProcesoSistemicoConectado(modelo),
  ];
}

export function checkProcesoNombreFormaVerbal(modelo: Modelo): AvisoMetodologico[] {
  return procesos(modelo)
    .filter((proceso) => !esFormaVerbalValida(proceso.nombre))
    .map((proceso) => aviso("PROCESO_NOMBRE_FORMA_VERBAL", proceso, {
      severidad: "sugerencia",
      mensaje: `El proceso "${proceso.nombre}" no parece nombrado como accion.`,
      rationale: "[Glos 3.69 Process] El nombre del proceso debe expresar accion o transformacion identificable.",
    }));
}

export function checkObjetoNombreSingular(modelo: Modelo): AvisoMetodologico[] {
  return objetos(modelo)
    .filter((objeto) => !esNombreObjetoSingular(objeto.nombre))
    .map((objeto) => aviso("OBJETO_NOMBRE_SINGULAR", objeto, {
      severidad: "sugerencia",
      mensaje: `El objeto "${objeto.nombre}" parece estar en plural; usa singular, conjunto o grupo si corresponde.`,
      rationale: "[Glos 3.55 Object] Un objeto representa una cosa persistente; el nombre canonico se mantiene singular.",
    }));
}

export function checkInzoomContenido(modelo: Modelo): AvisoMetodologico[] {
  return procesos(modelo)
    .filter((proceso) => proceso.refinamiento?.tipo === "descomposicion")
    .filter((proceso) => cantidadCosasEnOpdHijo(modelo, proceso) < 2)
    .map((proceso) => aviso("INZOOM_CONTENIDO_INSUFICIENTE", proceso, {
      severidad: "advertencia",
      mensaje: `La descomposicion de "${proceso.nombre}" contiene menos de dos cosas.`,
      rationale: "[Met §inzoom] Un proceso descompuesto debe agregar al menos dos subprocesos o cosas internas.",
    }));
}

export function checkUnfoldContenido(modelo: Modelo): AvisoMetodologico[] {
  return Object.values(modelo.entidades)
    .filter((entidad) => entidad.refinamiento?.tipo === "despliegue")
    .filter((entidad) => cantidadRefinadoresEstructurales(modelo, entidad) < 2)
    .map((entidad) => aviso("UNFOLD_CONTENIDO_INSUFICIENTE", entidad, {
      severidad: "advertencia",
      mensaje: `El despliegue de "${entidad.nombre}" contiene menos de dos refinadores estructurales.`,
      rationale: "[Met §unfold] Un despliegue debe revelar al menos dos refinadores para agregar informacion.",
    }));
}

export function checkProcesoTransforma(modelo: Modelo): AvisoMetodologico[] {
  return procesos(modelo)
    .filter((proceso) => !procesoTransforma(modelo, proceso) && !tieneHijoTransformador(modelo, proceso))
    .map((proceso) => aviso("PROCESO_NO_TRANSFORMA", proceso, {
      severidad: "advertencia",
      mensaje: `El proceso "${proceso.nombre}" no consume, produce ni afecta ningun objeto.`,
      rationale: "[Glos 3.x reglas] Un proceso debe transformar al menos un objeto mediante consumo, resultado o efecto.",
    }));
}

export function checkProcesoSistemicoConectado(modelo: Modelo): AvisoMetodologico[] {
  const principal = procesoPrincipalSistemico(modelo);
  if (!principal) return [];
  const conectados = procesosConectadosAlPrincipal(modelo, principal);
  return procesos(modelo)
    .filter((proceso) => proceso.afiliacion === "sistemica" && !conectados.has(proceso.id))
    .map((proceso) => aviso("PROCESO_SISTEMICO_DESCONECTADO", proceso, {
      severidad: "advertencia",
      mensaje: `El proceso sistemico "${proceso.nombre}" no esta conectado a la funcion principal del SD.`,
      rationale: "[Met §metodologia] [Glos 3.x sistemico] Todo proceso sistemico debe integrarse a la funcion principal por refinamiento o enlaces estructurales.",
    }));
}

function procesos(modelo: Modelo): Entidad[] {
  return Object.values(modelo.entidades).filter((entidad) => entidad.tipo === "proceso");
}

function objetos(modelo: Modelo): Entidad[] {
  return Object.values(modelo.entidades).filter((entidad) => entidad.tipo === "objeto");
}

function aviso(
  codigo: CodigoChecker,
  entidad: Entidad,
  base: Pick<AvisoMetodologico, "severidad" | "mensaje" | "rationale">,
): AvisoMetodologico {
  return {
    codigo,
    entidadId: entidad.id,
    ...base,
  };
}

function esFormaVerbalValida(nombre: string): boolean {
  const palabras = palabrasNormalizadas(nombre);
  if (palabras.length === 0) return false;
  return palabras.some((palabra, index) => index === 0 || index === palabras.length - 1
    ? /(?:ar|er|ir|izar|ion|aje|miento|ing)$/.test(palabra)
    : false);
}

function esNombreObjetoSingular(nombre: string): boolean {
  const palabras = palabrasNormalizadas(nombre);
  const ultimaOriginal = nombre.trim().split(/\s+/).at(-1) ?? "";
  const ultima = palabras.at(-1) ?? "";
  if (!ultima || INVARIABLES_SINGULAR.has(ultima)) return true;
  if (/^[A-Z0-9]{2,6}$/.test(ultimaOriginal)) return true;
  if (ultima === "datos") return false;
  if (/(?:es|s)$/.test(ultima) && !/(?:is|us)$/.test(ultima)) return false;
  return true;
}

function palabrasNormalizadas(nombre: string): string[] {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function cantidadCosasEnOpdHijo(modelo: Modelo, entidad: Entidad): number {
  const opdId = entidad.refinamiento?.opdId;
  const opd = opdId ? modelo.opds[opdId] : undefined;
  if (!opd) return 0;
  const ids = new Set<Id>();
  for (const apariencia of Object.values(opd.apariencias)) {
    if (apariencia.entidadId !== entidad.id && modelo.entidades[apariencia.entidadId]) {
      ids.add(apariencia.entidadId);
    }
  }
  return ids.size;
}

function cantidadRefinadoresEstructurales(modelo: Modelo, entidad: Entidad): number {
  const opdId = entidad.refinamiento?.opdId;
  const opd = opdId ? modelo.opds[opdId] : undefined;
  if (!opd) return 0;
  const ids = new Set<Id>();
  for (const apariencia of Object.values(opd.enlaces)) {
    const enlace = modelo.enlaces[apariencia.enlaceId];
    if (!enlace || naturalezaDeEnlace(enlace.tipo) !== "estructural") continue;
    if (!extremoApuntaAEntidad(enlace.origenId, entidad.id)) continue;
    const destinoId = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (destinoId && destinoId !== entidad.id) ids.add(destinoId);
  }
  return ids.size;
}

function procesoTransforma(modelo: Modelo, proceso: Entidad): boolean {
  return Object.values(modelo.enlaces).some((enlace) => (
    TRANSFORMADORES.has(enlace.tipo) &&
    (extremoApuntaAEntidad(enlace.origenId, proceso.id) || extremoApuntaAEntidad(enlace.destinoId, proceso.id)) &&
    (entidadDeExtremo(modelo, enlace.origenId)?.tipo === "objeto" || entidadDeExtremo(modelo, enlace.destinoId)?.tipo === "objeto")
  ));
}

function tieneHijoTransformador(modelo: Modelo, proceso: Entidad): boolean {
  const hijoIds = hijosDeRefinamiento(modelo, proceso.id).filter((entidad) => entidad.tipo === "proceso");
  return hijoIds.some((hijo) => procesoTransforma(modelo, hijo));
}

function procesoPrincipalSistemico(modelo: Modelo): Entidad | null {
  const sd = modelo.opds[modelo.opdRaizId];
  if (!sd) return null;
  const candidatos = Object.values(sd.apariencias)
    .map((apariencia) => modelo.entidades[apariencia.entidadId])
    .filter((entidad): entidad is Entidad => entidad?.tipo === "proceso" && entidad.afiliacion === "sistemica");
  if (candidatos.length <= 1) return candidatos[0] ?? null;
  const transformadores = candidatos.filter((proceso) => procesoTransforma(modelo, proceso));
  const base = transformadores.length > 0 ? transformadores : candidatos;
  return [...base].sort((a, b) => a.id.localeCompare(b.id))[0] ?? null;
}

function procesosConectadosAlPrincipal(modelo: Modelo, principal: Entidad): Set<Id> {
  const conectados = new Set<Id>();
  const visitados = new Set<Id>();
  const cola: Id[] = [principal.id];
  while (cola.length > 0) {
    const id = cola.shift();
    if (!id || visitados.has(id)) continue;
    visitados.add(id);
    const entidad = modelo.entidades[id];
    if (entidad?.tipo === "proceso" && entidad.afiliacion === "sistemica") conectados.add(id);
    for (const vecino of vecinosMetodologicos(modelo, id)) {
      if (!visitados.has(vecino)) cola.push(vecino);
    }
  }
  return conectados;
}

function vecinosMetodologicos(modelo: Modelo, entidadId: Id): Id[] {
  const vecinos = new Set<Id>();
  for (const enlace of Object.values(modelo.enlaces)) {
    if (naturalezaDeEnlace(enlace.tipo) !== "estructural") continue;
    const origenId = entidadIdDeExtremo(modelo, enlace.origenId);
    const destinoId = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (origenId === entidadId && destinoId) vecinos.add(destinoId);
    if (destinoId === entidadId && origenId) vecinos.add(origenId);
  }
  for (const hijo of hijosDeRefinamiento(modelo, entidadId)) vecinos.add(hijo.id);
  const padreId = padreRefinamientoDe(modelo, entidadId);
  if (padreId) vecinos.add(padreId);
  return [...vecinos];
}

function hijosDeRefinamiento(modelo: Modelo, entidadId: Id): Entidad[] {
  const entidad = modelo.entidades[entidadId];
  const opdId = entidad?.refinamiento?.opdId;
  const opd = opdId ? modelo.opds[opdId] : undefined;
  if (!opd) return [];
  const ids = new Set(Object.values(opd.apariencias).map((apariencia) => apariencia.entidadId));
  ids.delete(entidadId);
  return [...ids].map((id) => modelo.entidades[id]).filter((item): item is Entidad => Boolean(item));
}

function padreRefinamientoDe(modelo: Modelo, entidadId: Id): Id | null {
  for (const entidad of Object.values(modelo.entidades)) {
    if (entidad.refinamiento && hijosDeRefinamiento(modelo, entidad.id).some((hijo) => hijo.id === entidadId)) {
      return entidad.id;
    }
  }
  return null;
}
