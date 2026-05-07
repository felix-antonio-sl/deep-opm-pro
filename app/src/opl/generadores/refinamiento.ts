import { entidadIdDeExtremo, extremoApuntaAEntidad } from "../../modelo/extremos";
import { agruparSubprocesosParalelos } from "../../modelo/operaciones/refinamiento";
import { modoPlegadoApariencia, partesDePlegado } from "../../modelo/plegado";
import { obtenerRefinamiento, refinaA, refinamientosDe, tieneRefinamiento } from "../../modelo/refinamientos";
import type { Apariencia, Enlace, Entidad, Id, Modelo, ModoDespliegueObjeto, Opd, TipoEnlace, TipoRefinamiento } from "../../modelo/tipos";
import { crearLineaOplInteractiva, type OplLineaInteractiva, type OplReferencia, type OplTokenHint } from "../interaccion";
import { oracionPlegadoParcial } from "./plegado";
import {
  codigoOpd,
  hintEnlace,
  hintEntidad,
  listarOpl,
  nombreOpl,
  refEnlace,
  refEntidad,
  refsEntidad,
} from "./refsHints";

/**
 * Generador de oraciones OPL para refinamiento: descomposicion y despliegue.
 * Cubre SSOT OPL-ES §10.1-§10.3 e ISO 19450 §668-§685.
 * Consumidores: `opl/generar.ts` y helpers interactivos HU-50.
 */

export function oracionRefinamiento(modelo: Modelo, apariencia: Apariencia, entidad: Entidad, tipo?: TipoRefinamiento): string | null {
  if (!tieneRefinamiento(entidad)) return null;
  const parcial = oracionPlegadoParcial(modelo, apariencia, entidad);
  if (parcial && !tipo) return parcial;
  // Si no se especifica tipo y existe un único refinamiento, ese es el blanco;
  // si hay dos, devolvemos la primera oración no-nula (descomposicion primero
  // por convención SSOT comportamiento → estructura).
  const tiposPrueba: TipoRefinamiento[] = tipo
    ? [tipo]
    : refinamientosDe(entidad).map((slot) => slot.tipo);
  for (const tipoActual of tiposPrueba) {
    const slot = obtenerRefinamiento(entidad, tipoActual);
    if (!slot) continue;
    const opdHijo = modelo.opds[slot.opdId];
    if (!opdHijo) continue;
    const aparienciasInternas = aparienciasInternasDeRefinamiento(modelo, opdHijo, entidad)
      .sort((a, b) => compararOrdenTemporal(a, b));
    const internos = aparienciasInternas
      .flatMap((aparienciaInterna) => {
        const interna = modelo.entidades[aparienciaInterna.entidadId];
        return interna ? [nombreOpl(interna)] : [];
      });
    if (tipoActual === "despliegue") {
      return oracionDespliegue(modelo, entidad, opdHijo, internos);
    }
    return oracionDescomposicion(modelo, entidad, opdHijo, aparienciasInternas, internos);
  }
  return null;
}

/**
 * Emite todas las oraciones de refinamiento que aplican a la entidad. Si la
 * entidad tiene descomposicion + despliegue (ronda 15.2), produce ambas
 * oraciones en orden Comportamiento → Estructura.
 */
export function oracionesRefinamiento(modelo: Modelo, apariencia: Apariencia, entidad: Entidad): string[] {
  const parcial = oracionPlegadoParcial(modelo, apariencia, entidad);
  if (parcial) return [parcial];
  const oraciones: string[] = [];
  for (const tipo of ["descomposicion", "despliegue"] as const) {
    if (!obtenerRefinamiento(entidad, tipo)) continue;
    const oracion = oracionRefinamiento(modelo, apariencia, entidad, tipo);
    if (oracion) oraciones.push(oracion);
  }
  return oraciones;
}

export function oracionDespliegue(modelo: Modelo, entidad: Entidad, opdHijo: Opd, internos: string[]): string {
  const modo = modoDespliegue(modelo, entidad, opdHijo);
  const destino = internos.length > 0 ? listarOpl(internos) : codigoOpd(opdHijo.nombre);

  if (modo === "agregacion") return `${nombreOpl(entidad)} se despliega en ${destino}.`;
  if (modo === "exhibicion") return `${nombreOpl(entidad)} exhibe ${destino}.`;
  if (modo === "generalizacion") return `${destino} ${internos.length === 1 ? "es un" : "son"} ${nombreOpl(entidad)}.`;
  return `${destino} ${internos.length === 1 ? "es una instancia" : "son instancias"} de ${nombreOpl(entidad)}.`;
}

export function oracionDescomposicion(modelo: Modelo, entidad: Entidad, opdHijo: Opd, aparienciasInternas: Apariencia[], internos: string[]): string {
  const destino = internos.length > 0 ? listarOpl(internos) : codigoOpd(opdHijo.nombre);
  const aparienciasProcesos = aparienciasInternas.filter((aparienciaInterna) => modelo.entidades[aparienciaInterna.entidadId]?.tipo === "proceso");
  const aparienciasObjetos = aparienciasInternas.filter((aparienciaInterna) => modelo.entidades[aparienciaInterna.entidadId]?.tipo === "objeto");
  const objetos = nombresDeApariencias(modelo, aparienciasObjetos);
  const procesos = nombresDeApariencias(modelo, aparienciasProcesos);

  if (entidad.tipo === "objeto") {
    const componentes = objetos.length > 0 ? listarOpl(objetos) : destino;
    const operaciones = procesos.length > 0 ? `, así como ${listarOpl(procesos)}` : "";
    const secuencia = objetos.length > 1 ? " en esa secuencia" : "";
    return `${nombreOpl(entidad)} se descompone en ${componentes}${secuencia}${operaciones}.`;
  }

  const temporal = aparienciasProcesos.length > 1 ? describirProcesosTemporales(modelo, aparienciasProcesos) : null;
  const destinoProcesos = temporal?.texto ?? (procesos.length > 0 ? listarOpl(procesos) : destino);
  const secuencia = aparienciasProcesos.length > 1 && temporal?.tieneSecuencia
    ? temporal.tieneParalelos ? ", en esa secuencia" : " en esa secuencia"
    : "";
  const objetosEnZoom = objetos.length > 0 ? `, así como ${listarOpl(objetos)}` : "";
  return `${nombreOpl(entidad)} se descompone en ${destinoProcesos}${secuencia}${objetosEnZoom}.`;
}

export function oracionParalelo(grupoSubprocesos: Entidad[]): string {
  return `${listarOpl(grupoSubprocesos.map((entidad) => nombreOpl(entidad)))} ocurren en paralelo.`;
}

export function modoDespliegue(modelo: Modelo, entidad: Entidad, opdHijo: Opd): ModoDespliegueObjeto {
  const modoPersistido = obtenerRefinamiento(entidad, "despliegue")?.modo;
  if (modoPersistido) return modoPersistido;
  const tipos = Object.values(opdHijo.enlaces)
    .flatMap((aparienciaEnlace) => {
      const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
      return enlace && extremoApuntaAEntidad(enlace.origenId, entidad.id) ? [enlace.tipo] : [];
    });
  return tipos.map(modoPorTipoEnlace).find((modo): modo is ModoDespliegueObjeto => modo !== null) ?? "agregacion";
}

export function modoPorTipoEnlace(tipo: TipoEnlace): ModoDespliegueObjeto | null {
  if (tipo === "agregacion") return "agregacion";
  if (tipo === "exhibicion") return "exhibicion";
  if (tipo === "generalizacion") return "generalizacion";
  if (tipo === "clasificacion") return "clasificacion";
  return null;
}

export function aparienciasInternasDeRefinamiento(modelo: Modelo, opdHijo: Opd, entidad: Entidad): Apariencia[] {
  const contorno = Object.values(opdHijo.apariencias).find((apariencia) => apariencia.entidadId === entidad.id);
  if (!contorno) return [];
  const otras = Object.values(opdHijo.apariencias).filter((apariencia) => apariencia.entidadId !== entidad.id);
  // BUG-372334 + ronda 15.2 dual: en despliegue (unfold) las partes viven FUERA
  // del padre y se conectan via enlaces estructurales canonicos. La pertenencia
  // se determina por presencia en el OPD hijo. Descomposicion (inzoom) sigue
  // el criterio espacial dentroDe. Con refinamiento dual, decidimos por tipo
  // del OPD hijo, no por una propiedad global de la entidad.
  if (refinaA(entidad, opdHijo.id)?.tipo === "despliegue") return otras;
  return otras.filter((apariencia) => dentroDe(apariencia, contorno));
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

export function refsRefinamiento(modelo: Modelo, apariencia: Apariencia, entidad: Entidad, tipo?: TipoRefinamiento): OplReferencia[] {
  const refs = refsEntidad(entidad.id);
  if (!tieneRefinamiento(entidad)) return refs;
  const tipos: TipoRefinamiento[] = tipo ? [tipo] : refinamientosDe(entidad).map((slot) => slot.tipo);
  for (const tipoActual of tipos) {
    const opdId = obtenerRefinamiento(entidad, tipoActual)?.opdId;
    const opdHijo = opdId ? modelo.opds[opdId] : undefined;
    if (!opdHijo) continue;
    for (const interna of aparienciasInternasDeRefinamiento(modelo, opdHijo, entidad)) {
      refs.push(refEntidad(interna.entidadId));
    }
  }
  for (const enlace of Object.values(modelo.enlaces)) {
    const origen = entidadIdDeExtremo(modelo, enlace.origenId);
    const destino = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (origen === entidad.id || destino === entidad.id) refs.push(refEnlace(enlace.id));
  }
  if (modoPlegadoApariencia(apariencia) === "parcial") {
    for (const parte of partesDePlegado(modelo, entidad.id)) refs.push(refEntidad(parte.entidadId));
  }
  return refs;
}

export function hintsRefinamiento(modelo: Modelo, apariencia: Apariencia, entidad: Entidad, tipo?: TipoRefinamiento): OplTokenHint[] {
  const hints: OplTokenHint[] = [hintEntidad(entidad)];
  if (modoPlegadoApariencia(apariencia) === "parcial") {
    for (const parte of partesDePlegado(modelo, entidad.id)) {
      const interna = modelo.entidades[parte.entidadId];
      if (interna) hints.push(hintEntidad(interna));
    }
    return hints;
  }
  if (!tieneRefinamiento(entidad)) return hints;
  // Si no se especifica tipo, escoge en orden Comportamiento → Estructura.
  const tipoActual = tipo
    ?? (obtenerRefinamiento(entidad, "descomposicion") ? "descomposicion" : "despliegue");
  const slot = obtenerRefinamiento(entidad, tipoActual);
  if (!slot) return hints;
  const opdHijo = modelo.opds[slot.opdId];
  if (!opdHijo) return hints;

  const enlaceHijoPorEntidadId = new Map<Id, Enlace>();
  for (const enlace of Object.values(modelo.enlaces)) {
    const origen = entidadIdDeExtremo(modelo, enlace.origenId);
    const destino = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (origen === entidad.id && destino && !enlaceHijoPorEntidadId.has(destino)) {
      enlaceHijoPorEntidadId.set(destino, enlace);
    }
    if (destino === entidad.id && origen && !enlaceHijoPorEntidadId.has(origen)) {
      enlaceHijoPorEntidadId.set(origen, enlace);
    }
  }

  if (tipoActual === "despliegue") {
    const modo = modoDespliegue(modelo, entidad, opdHijo);
    const verboRefinamiento = verboDespliegue(modo);
    if (verboRefinamiento) {
      const primerEnlace = enlaceHijoPorEntidadId.values().next().value;
      if (primerEnlace) hints.push(hintEnlace(primerEnlace, verboRefinamiento));
      else hints.push({ texto: verboRefinamiento, ref: refEntidad(entidad.id), rol: "verbo" });
    }
  } else {
    const verboDescomposicion = "se descompone en";
    const primerEnlace = enlaceHijoPorEntidadId.values().next().value;
    if (primerEnlace) hints.push(hintEnlace(primerEnlace, verboDescomposicion));
    else hints.push({ texto: verboDescomposicion, ref: refEntidad(entidad.id), rol: "verbo" });
  }

  for (const interna of aparienciasInternasDeRefinamiento(modelo, opdHijo, entidad)) {
    const entidadInterna = modelo.entidades[interna.entidadId];
    if (!entidadInterna) continue;
    const enlaceHijo = enlaceHijoPorEntidadId.get(interna.entidadId);
    if (enlaceHijo) {
      hints.push({
        texto: nombreOpl(entidadInterna),
        ref: refEnlace(enlaceHijo.id),
        rol: "nombre",
        markdown: entidadInterna.tipo === "objeto" ? "objeto" : "proceso",
      });
    } else {
      hints.push(hintEntidad(entidadInterna));
    }
  }
  return hints;
}

export function verboDespliegue(modo: ModoDespliegueObjeto): string | null {
  switch (modo) {
    case "agregacion": return "se despliega en";
    case "exhibicion": return "exhibe";
    case "generalizacion": return "es un";
    case "clasificacion": return "es una instancia de";
  }
}

function describirProcesosTemporales(modelo: Modelo, apariencias: Apariencia[]): { texto: string; tieneParalelos: boolean; tieneSecuencia: boolean } {
  const grupos = agruparSubprocesosParalelos(apariencias)
    .map((grupo) => grupo
      .flatMap((apariencia) => {
        const entidad = modelo.entidades[apariencia.entidadId];
        return entidad ? [nombreOpl(entidad)] : [];
      }))
    .filter((grupo) => grupo.length > 0);

  return {
    texto: listarSecuenciaTemporal(grupos.map((grupo) => grupo.length > 1 ? `paralelo ${listarOpl(grupo)}` : grupo[0] ?? "")),
    tieneParalelos: grupos.some((grupo) => grupo.length > 1),
    tieneSecuencia: grupos.length > 1,
  };
}

function nombresDeApariencias(modelo: Modelo, apariencias: Apariencia[]): string[] {
  return apariencias.flatMap((apariencia) => {
    const entidad = modelo.entidades[apariencia.entidadId];
    return entidad ? [nombreOpl(entidad)] : [];
  });
}

function listarSecuenciaTemporal(items: string[]): string {
  if (items.length <= 2) return items.join(", ");
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

export function emitirDespliegueOcurren(
  modelo: Modelo,
  entidad: Entidad,
  opdHijo: Opd,
  ordinal: number,
): OplLineaInteractiva | null {
  const aparienciasInternas = aparienciasInternasDeRefinamiento(modelo, opdHijo, entidad)
    .sort((a, b) => compararOrdenTemporal(a, b));
  const internos = aparienciasInternas
    .flatMap((apariencia) => {
      const interna = modelo.entidades[apariencia.entidadId];
      return interna ? [nombreOpl(interna)] : [];
    });
  const destino = internos.length > 0 ? listarOpl(internos) : codigoOpd(opdHijo.nombre);
  const texto = `${nombreOpl(entidad)} se despliega en ${destino}.`;
  const refs: OplReferencia[] = [refEntidad(entidad.id)];
  const hints: OplTokenHint[] = [hintEntidad(entidad)];

  for (const interna of aparienciasInternas) {
    const entidadInterna = modelo.entidades[interna.entidadId];
    if (!entidadInterna) continue;
    const enlaceHijo = Object.values(modelo.enlaces).find((enlace) => {
      const origen = entidadIdDeExtremo(modelo, enlace.origenId);
      const destinoEnlace = entidadIdDeExtremo(modelo, enlace.destinoId);
      return (origen === entidad.id && destinoEnlace === interna.entidadId) ||
        (destinoEnlace === entidad.id && origen === interna.entidadId);
    });
    if (enlaceHijo) {
      refs.push(refEnlace(enlaceHijo.id));
      hints.push({
        texto: nombreOpl(entidadInterna),
        ref: refEnlace(enlaceHijo.id),
        rol: "nombre",
        markdown: entidadInterna.tipo === "objeto" ? "objeto" : "proceso",
      });
    } else {
      refs.push(refEntidad(interna.entidadId));
      hints.push(hintEntidad(entidadInterna));
    }
  }

  const verbo = "se despliega en";
  const primerEnlace = Object.values(modelo.enlaces).find((enlace) => {
    const origen = entidadIdDeExtremo(modelo, enlace.origenId);
    const destino = entidadIdDeExtremo(modelo, enlace.destinoId);
    return origen === entidad.id || destino === entidad.id;
  });
  if (primerEnlace) {
    hints.push(hintEnlace(primerEnlace, verbo));
    refs.push(refEnlace(primerEnlace.id));
  }

  return crearLineaOplInteractiva(`opl-desp-${entidad.id}`, texto, ordinal, refs, hints);
}

export function emitirEspecializacion(
  modelo: Modelo,
  entidadPadre: Entidad,
  hijo: { entidad: Entidad; enlace: Enlace },
  ordinal: number,
): OplLineaInteractiva | null {
  const texto = `${nombreOpl(hijo.entidad)} es un ${nombreOpl(entidadPadre)}.`;
  return crearLineaOplInteractiva(
    `opl-espec-${hijo.enlace.id}`,
    texto,
    ordinal,
    [refEntidad(entidadPadre.id), refEntidad(hijo.entidad.id), refEnlace(hijo.enlace.id)],
    [
      hintEntidad(hijo.entidad),
      { texto: "es un", ref: refEnlace(hijo.enlace.id), rol: "verbo" },
      hintEntidad(entidadPadre),
    ],
  );
}
