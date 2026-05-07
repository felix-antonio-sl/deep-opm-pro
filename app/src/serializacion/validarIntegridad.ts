import { entidadIdDeExtremo, extremoVisibleEnOpd } from "../modelo/extremos";
import { modoPlegadoApariencia, partesDePlegado } from "../modelo/plegado";
import { refinamientosDe, tieneRefinamiento } from "./../modelo/refinamientos";
import type {
  Entidad,
  Estado,
  ExtremoEnlace,
  Id,
  Modelo,
  Opd,
  Resultado,
} from "../modelo/tipos";
import { fallo, ok } from "./validarHelpers";

/**
 * Validaciones de integridad referencial post-hidratacion.
 *
 * Consumidores conocidos: `serializacion/json.ts` y tests por dominio.
 * Anclaje: OPCloud resuelve referencias mediante mapas en
 * `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/json.model.ts:224`
 * y `ElementsMap` falla ante ids ausentes en
 * `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/components/ElementsMap.ts:9`.
 */

export function validarReferenciasOpd(modelo: Modelo): Resultado<true> {
  const enlacesConApariencia = new Set<Id>();
  for (const entidad of Object.values(modelo.entidades)) {
    for (const ref of refinamientosDe(entidad)) {
      const opdRefinado = modelo.opds[ref.opdId];
      if (!opdRefinado) return fallo(`Refinamiento inválido: ${entidad.id}.opdId`);
      if (!Object.values(opdRefinado.apariencias).some((apariencia) => apariencia.entidadId === entidad.id)) {
        return fallo(`Refinamiento inválido: ${entidad.id}.apariencia`);
      }
    }
  }
  for (const enlace of Object.values(modelo.enlaces)) {
    if (!enlace.derivado) continue;
    const refinador = modelo.entidades[enlace.derivado.refinamientoId];
    if (!refinador || !tieneRefinamiento(refinador)) {
      return fallo(`Enlace inválido: ${enlace.id}.derivado.refinamientoId`);
    }
    if (!modelo.enlaces[enlace.derivado.enlacePadreId]) {
      return fallo(`Enlace inválido: ${enlace.id}.derivado.enlacePadreId`);
    }
  }
  for (const [opdId, opd] of Object.entries(modelo.opds)) {
    const extraidas = validarAparienciasExtraidas(modelo, opd);
    if (!extraidas.ok) return extraidas;
    for (const [aparienciaId, apariencia] of Object.entries(opd.enlaces)) {
      const enlace = modelo.enlaces[apariencia.enlaceId];
      if (!enlace) return fallo(`Apariencia de enlace inválida: ${aparienciaId}.enlaceId`);
      enlacesConApariencia.add(enlace.id);
      if (!endpointVisibleEnOpd(modelo, opd, enlace.origenId) || !endpointVisibleEnOpd(modelo, opd, enlace.destinoId)) {
        return fallo(`Apariencia de enlace inválida: ${aparienciaId}.endpoints`);
      }
      if (apariencia.opdId !== opdId) return fallo(`Apariencia de enlace inválida: ${aparienciaId}.opdId`);
    }
  }
  for (const enlaceId of Object.keys(modelo.enlaces)) {
    if (!enlacesConApariencia.has(enlaceId)) return fallo(`Enlace inválido: ${enlaceId}.apariencia`);
  }
  return ok(true);
}

export function endpointVisibleEnOpd(modelo: Modelo, opd: Opd, extremo: ExtremoEnlace): boolean {
  if (extremoVisibleEnOpd(modelo, opd, extremo)) return true;
  const entidadId = entidadIdDeExtremo(modelo, extremo);
  if (!entidadId) return false;
  return Object.values(opd.apariencias).some((apariencia) => {
    if (modoPlegadoApariencia(apariencia) !== "parcial") return false;
    return partesDePlegado(modelo, apariencia.entidadId).some((parte) => parte.entidadId === entidadId);
  });
}

export function validarAparienciasExtraidas(modelo: Modelo, opd: Opd): Resultado<true> {
  for (const [aparienciaId, apariencia] of Object.entries(opd.apariencias)) {
    const extraida = apariencia.parteExtraidaDe;
    if (!extraida) continue;
    const padre = opd.apariencias[extraida.padreAparienciaId];
    if (!padre) return fallo(`Apariencia inválida: ${aparienciaId}.parteExtraidaDe.padreAparienciaId`);
    if (modoPlegadoApariencia(padre) !== "parcial") return fallo(`Apariencia inválida: ${aparienciaId}.parteExtraidaDe.padreAparienciaId`);
    if (extraida.parteEntidadId !== apariencia.entidadId) return fallo(`Apariencia inválida: ${aparienciaId}.parteExtraidaDe.parteEntidadId`);
    if (!partesDePlegado(modelo, padre.entidadId).some((parte) => parte.entidadId === extraida.parteEntidadId)) {
      return fallo(`Apariencia inválida: ${aparienciaId}.parteExtraidaDe.parteEntidadId`);
    }
  }
  return ok(true);
}

export function modeloParaExtremos(entidades: Record<Id, Entidad>, estados: Record<Id, Estado>): Modelo {
  return {
    id: "modelo-validacion",
    nombre: "modelo-validacion",
    opdRaizId: "opd-validacion",
    opds: {},
    entidades,
    estados,
    enlaces: {},
    nextSeq: 1,
  };
}
