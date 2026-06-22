import { contornoDeOpd, subprocesosInternosDeOpd } from "../modelo/checkers";
import { esRequisito, estereotipoDe } from "../modelo/estereotipos";
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
  // Contrato de import DURO (D6): un `estereotipoId` aplicado que no resuelve contra la
  // fábrica ni el catálogo `Modelo.estereotipos` es una referencia colgante. Simétrico
  // EXACTO a `ordenInzoom` (subprocesos internos reales) y a las anclas/notasMesa
  // (target resoluble en json.ts): el import dura rechaza con diagnóstico, no la deja
  // sobrevivir en silencio.
  for (const entidad of Object.values(modelo.entidades)) {
    if (entidad.estereotipoId !== undefined && !estereotipoDe(modelo, entidad.estereotipoId)) {
      return fallo(`Entidad inválida: ${entidad.id}.estereotipoId referencia un estereotipo inexistente (ni de fábrica ni en el catálogo)`);
    }
  }
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
    if (opd.vista?.kind === "requirement-view") {
      const requisito = modelo.entidades[opd.vista.requisitoEntidadId];
      if (!esRequisito(requisito)) return fallo(`OPD inválido: ${opdId}.vista.requisitoEntidadId`);
    }
    if (opd.vista?.kind === "submodel-view") {
      const ref = modelo.submodelos?.[opd.vista.submodeloRefId];
      if (!ref) return fallo(`OPD inválido: ${opdId}.vista.submodeloRefId`);
      if (ref.opdVistaId && ref.opdVistaId !== opdId) return fallo(`OPD inválido: ${opdId}.vista.submodeloRefId`);
    }
    const extraidas = validarAparienciasExtraidas(modelo, opd);
    if (!extraidas.ok) return extraidas;
    const ordenInzoom = validarOrdenInzoomReferencial(modelo, opd);
    if (!ordenInzoom.ok) return ordenInzoom;
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

/**
 * Integridad referencial de `Opd.ordenInzoom` en la hidratación dura (import-01 +
 * anclas-01). `validarOpds` (forma + anticadena) NO conoce el modelo completo;
 * aquí, con entidades + refinamiento + apariencias disponibles, se exige que el
 * orden declarado refiera SOLO subprocesos internos reales de la descomposición
 * del OPD. Un id fantasma, de contorno, externo, de objeto o de otro OPD es una
 * referencia colgante: igual que anclas/notasMesa rechazan target irresoluble
 * (json.ts), el import dura debe rechazarla y no dejarla sobrevivir.
 *
 * El checker de diagnóstico `checkOrdenInzoomReferenciaInvalida` (avisos blandos)
 * cubre el mismo invariante en runtime; esta es la barrera DURA del import.
 */
function validarOrdenInzoomReferencial(modelo: Modelo, opd: Opd): Resultado<true> {
  if (!opd.ordenInzoom || opd.ordenInzoom.length === 0) return ok(true);
  // (a) El OPD debe ser un in-zoom real: la descomposición de algún proceso.
  const contorno = contornoDeOpd(modelo, opd.id);
  if (!contorno) {
    return fallo(`OPD inválido: ${opd.id}.ordenInzoom declara orden de subprocesos pero el OPD no es la descomposición de ningún proceso`);
  }
  // (b) Cada id del orden debe ser un subproceso INTERNO del contorno de este OPD.
  const internos = subprocesosInternosDeOpd(modelo, opd);
  for (const banda of opd.ordenInzoom) {
    for (const id of banda) {
      if (!internos.has(id)) {
        return fallo(`OPD inválido: ${opd.id}.ordenInzoom referencia "${id}", que no es un subproceso interno de su descomposición`);
      }
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
