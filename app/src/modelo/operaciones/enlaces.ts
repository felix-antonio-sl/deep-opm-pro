import {
  entidadDeExtremo,
  entidadIdDeExtremo,
  extremoApuntaAEntidad,
  extremoEntidad,
  extremoVisibleEnOpd,
  mismoExtremo,
  normalizarExtremo,
  type ExtremoEntrada,
} from "../extremos";
import type {
  Apariencia,
  AparienciaEnlace,
  Enlace,
  EnlaceEstilo,
  Id,
  Modelo,
  Opd,
  Resultado,
  TipoEnlace,
} from "../tipos";
import { CANON, naturalezaDeEnlace } from "../constantes";
import { fallo, ok, siguienteId, validarFirmaEnlace } from "./helpers";
import {
  procesoDescompuestoEnOpd,
  refrescarEnlacesExternosDerivados,
  subprocesosOrdenadosDeRefinamiento,
} from "./refinamiento";
import { eliminarEnlace } from "./eliminacion";
import { obtenerRefinamiento } from "../refinamientos";

/**
 * Operaciones de enlaces: crear con firma validada, apuntar extremo (mover
 * origen/destino a otra entidad/estado), reanclar enlaces externos derivados
 * en refinamiento, multiplicidad canónica.
 *
 * Refs: SSOT opm-iso-19450-es.md §3.* (Link signature),
 *       opm-extracted/src/app/models/DrawnPart/Links/AggregationLink.ts (separación por familia).
 */

export type LadoMultiplicidadEnlace = "origen" | "destino";

export type LadoExtremoEnlace = "origen" | "destino";

const TIPOS_ESTRUCTURALES = ["agregacion", "exhibicion", "generalizacion", "clasificacion"] as const satisfies readonly TipoEnlace[];

const MULTIPLICIDAD_CANONICA_RE = /^\d+$|^\*$|^\d+\.\.\d+$|^\d+\.\.N$/;

export function validarMultiplicidad(texto: string): boolean {
  return MULTIPLICIDAD_CANONICA_RE.test(texto);
}

export function ajustarMultiplicidad(
  modelo: Modelo,
  enlaceId: Id,
  lado: LadoMultiplicidadEnlace,
  texto: string,
): Resultado<Modelo> {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
  if (texto !== "" && !validarMultiplicidad(texto)) {
    return fallo("Multiplicidad inválida: usa 1, *, 2..N o 1..5");
  }

  const campo = lado === "origen" ? "multiplicidadOrigen" : "multiplicidadDestino";
  if (enlace[campo] === texto || (texto === "" && enlace[campo] === undefined)) return ok(modelo);

  const actualizado: Enlace = { ...enlace };
  if (texto === "") {
    delete actualizado[campo];
  } else {
    actualizado[campo] = texto;
  }

  return ok({
    ...modelo,
    enlaces: {
      ...modelo.enlaces,
      [enlaceId]: actualizado,
    },
  });
}

export function crearEnlace(
  modelo: Modelo,
  opdId: Id,
  origenId: ExtremoEntrada,
  destinoId: ExtremoEntrada,
  tipo: TipoEnlace,
  etiqueta = "",
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const origenExtremo = normalizarExtremo(origenId);
  const destinoExtremo = normalizarExtremo(destinoId);
  const origen = entidadDeExtremo(modelo, origenExtremo);
  const destino = entidadDeExtremo(modelo, destinoExtremo);
  if (!origen) return fallo(`Origen no existe: ${origenExtremo.id}`);
  if (!destino) return fallo(`Destino no existe: ${destinoExtremo.id}`);
  if (mismoExtremo(origenExtremo, destinoExtremo)) return fallo("El enlace requiere dos extremos distintos en Sprint 0");

  const legal = validarFirmaEnlace(tipo, origen, destino, { origen: origenExtremo, destino: destinoExtremo });
  if (!legal.ok) return legal;
  if (!extremoVisibleEnOpd(modelo, opd, origenExtremo) || !extremoVisibleEnOpd(modelo, opd, destinoExtremo)) {
    return fallo("El enlace requiere que origen y destino tengan apariencia en el OPD");
  }

  const enlaceId = siguienteId(modelo, "e");
  const aparienciaId = siguienteId({ ...modelo, nextSeq: modelo.nextSeq + 1 }, "ae");
  const enlace: Enlace = { id: enlaceId, tipo, origenId: origenExtremo, destinoId: destinoExtremo, etiqueta };
  const apariencia: AparienciaEnlace = { id: aparienciaId, enlaceId, opdId, vertices: [] };

  return ok({
    ...modelo,
    nextSeq: modelo.nextSeq + 2,
    enlaces: { ...modelo.enlaces, [enlaceId]: enlace },
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        enlaces: { ...opd.enlaces, [aparienciaId]: apariencia },
      },
    },
  });
}

export function apuntarExtremoEnlace(
  modelo: Modelo,
  enlaceId: Id,
  lado: LadoExtremoEnlace,
  extremo: ExtremoEntrada,
): Resultado<Modelo> {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
  const siguienteExtremo = normalizarExtremo(extremo);
  const actual = lado === "origen" ? enlace.origenId : enlace.destinoId;
  if (mismoExtremo(actual, siguienteExtremo)) return ok(modelo);

  const actualizado: Enlace = {
    ...enlace,
    [lado === "origen" ? "origenId" : "destinoId"]: siguienteExtremo,
  };
  const origen = entidadDeExtremo(modelo, actualizado.origenId);
  const destino = entidadDeExtremo(modelo, actualizado.destinoId);
  if (!origen || !destino) return fallo("Extremo de enlace inválido");
  if (mismoExtremo(actualizado.origenId, actualizado.destinoId)) {
    return fallo("El enlace requiere dos extremos distintos en Sprint 0");
  }
  const firma = validarFirmaEnlace(actualizado.tipo, origen, destino, {
    origen: actualizado.origenId,
    destino: actualizado.destinoId,
  });
  if (!firma.ok) return firma;

  for (const opdActual of Object.values(modelo.opds)) {
    const tieneApariencia = Object.values(opdActual.enlaces).some((apariencia) => apariencia.enlaceId === enlaceId);
    if (!tieneApariencia) continue;
    if (!extremoVisibleEnOpd(modelo, opdActual, siguienteExtremo)) {
      return fallo("El estado elegido debe pertenecer a una entidad visible en todos los OPD donde aparece el enlace");
    }
  }

  return ok({
    ...modelo,
    enlaces: {
      ...modelo.enlaces,
      [enlaceId]: actualizado,
    },
  });
}

export function moverPuertoEnlace(
  modelo: Modelo,
  enlaceId: Id,
  lado: LadoExtremoEnlace,
  extremo: ExtremoEntrada,
  opcionRemover = false,
): Resultado<Modelo> {
  if (opcionRemover) return eliminarEnlace(modelo, enlaceId);
  return apuntarExtremoEnlace(modelo, enlaceId, lado, extremo);
}

export function separarGrupoEstructural(modelo: Modelo, enlaceIds: Id[]): Resultado<Modelo> {
  const ids = [...new Set(enlaceIds)];
  if (ids.length === 0) return fallo("Selecciona al menos un enlace estructural");
  for (const enlaceId of ids) {
    const enlace = modelo.enlaces[enlaceId];
    if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
    if (naturalezaDeEnlace(enlace.tipo) !== "estructural") {
      return fallo("Sólo los enlaces estructurales fundamentales pueden separarse en grupos");
    }
  }
  const grupoEstructuralId = siguienteId(modelo, "ge");
  const enlaces = { ...modelo.enlaces };
  let cambio = false;
  for (const enlaceId of ids) {
    const enlace = enlaces[enlaceId]!;
    if (enlace.grupoEstructuralId === grupoEstructuralId) continue;
    enlaces[enlaceId] = { ...enlace, grupoEstructuralId };
    cambio = true;
  }
  return ok(cambio ? { ...modelo, nextSeq: modelo.nextSeq + 1, enlaces } : modelo);
}

export function volverGrupoEstructuralAutomatico(modelo: Modelo, enlaceIds: Id[]): Resultado<Modelo> {
  const ids = [...new Set(enlaceIds)];
  if (ids.length === 0) return fallo("Selecciona al menos un enlace estructural");
  const enlaces = { ...modelo.enlaces };
  let cambio = false;
  for (const enlaceId of ids) {
    const enlace = enlaces[enlaceId];
    if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
    if (naturalezaDeEnlace(enlace.tipo) !== "estructural") {
      return fallo("Sólo los enlaces estructurales fundamentales tienen grupo automático");
    }
    if (!enlace.grupoEstructuralId) continue;
    const actualizado = { ...enlace };
    delete actualizado.grupoEstructuralId;
    enlaces[enlaceId] = actualizado;
    cambio = true;
  }
  return ok(cambio ? { ...modelo, enlaces } : modelo);
}

export function cambiarTipoGrupoEstructural(
  modelo: Modelo,
  enlaceIds: Id[],
  tipo: TipoEnlace,
): Resultado<Modelo> {
  if (!esTipoEstructural(tipo)) return fallo("El grupo estructural requiere un tipo fundamental");
  const ids = [...new Set(enlaceIds)];
  if (ids.length === 0) return fallo("Selecciona al menos un enlace estructural");
  const enlaces = { ...modelo.enlaces };
  let cambio = false;
  for (const enlaceId of ids) {
    const enlace = enlaces[enlaceId];
    if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
    if (naturalezaDeEnlace(enlace.tipo) !== "estructural") {
      return fallo("Sólo los enlaces estructurales fundamentales pueden cambiar tipo en grupo");
    }
    const origen = entidadDeExtremo(modelo, enlace.origenId);
    const destino = entidadDeExtremo(modelo, enlace.destinoId);
    if (!origen || !destino) return fallo("Extremo de enlace inválido");
    const firma = validarFirmaEnlace(tipo, origen, destino, {
      origen: enlace.origenId,
      destino: enlace.destinoId,
    });
    if (!firma.ok) return fallo(firma.error);
    if (enlace.tipo === tipo) continue;
    enlaces[enlaceId] = { ...enlace, tipo };
    cambio = true;
  }
  return ok(cambio ? { ...modelo, enlaces } : modelo);
}

export function fijarOrdenGrupoEstructural(
  modelo: Modelo,
  enlaceIds: Id[],
  ordenado: boolean,
): Resultado<Modelo> {
  const ids = [...new Set(enlaceIds)];
  if (ids.length === 0) return fallo("Selecciona al menos un enlace estructural");
  const tipo = tipoEstructuralComun(modelo, ids);
  if (!tipo) return fallo("El grupo debe compartir un tipo estructural");
  const refinableId = refinableComun(modelo, ids);
  if (!refinableId) return fallo("El grupo estructural no tiene refinable común");
  const refinable = modelo.entidades[refinableId];
  if (!refinable) return fallo(`Entidad no existe: ${refinableId}`);
  const actuales = refinable.orderedFundamentalTypes ?? [];
  const yaOrdenado = actuales.includes(tipo);
  if (yaOrdenado === ordenado) return ok(modelo);
  const siguientes = ordenado
    ? [...actuales, tipo]
    : actuales.filter((actual) => actual !== tipo);
  const entidadActualizada = { ...refinable };
  if (siguientes.length > 0) entidadActualizada.orderedFundamentalTypes = siguientes;
  else delete entidadActualizada.orderedFundamentalTypes;
  return ok({
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [refinableId]: entidadActualizada,
    },
  });
}

export interface RelacionesEstructuralesFaltantes {
  refinableId?: Id;
  enlaceIds: Id[];
  faltantes: number;
}

export interface RelacionesSemiplegadasEstructurales {
  refinableId: Id;
  enlaceIds: Id[];
  faltantes: number;
}

export interface AgregacionesInzoomFaltantes {
  refinableId: Id;
  entidadIds: Id[];
  faltantes: number;
}

export function relacionesEstructuralesFaltantes(
  modelo: Modelo,
  opdId: Id,
  enlaceIds: Id[],
): RelacionesEstructuralesFaltantes {
  const contexto = contextoGrupoEstructural(modelo, enlaceIds);
  if (!contexto.ok) return { enlaceIds: [], faltantes: 0 };
  const opd = modelo.opds[opdId];
  if (!opd) return { refinableId: contexto.value.refinableId, enlaceIds: [], faltantes: 0 };
  const visibles = new Set(Object.values(opd.enlaces).map((apariencia) => apariencia.enlaceId));
  const faltantes = candidatosEstructuralesDelGrupo(modelo, contexto.value, true)
    .filter((enlace) => !visibles.has(enlace.id))
    .map((enlace) => enlace.id);
  const derivadasInzoom = contexto.value.tipo === "agregacion"
    ? candidatosAgregacionInzoom(modelo, opdId, contexto.value.refinableId).length
    : 0;
  return {
    refinableId: contexto.value.refinableId,
    enlaceIds: faltantes,
    faltantes: faltantes.length + derivadasInzoom,
  };
}

export function traerRelacionesEstructuralesFaltantes(
  modelo: Modelo,
  opdId: Id,
  enlaceIds: Id[],
): Resultado<{ modelo: Modelo; agregadas: number }> {
  const contexto = contextoGrupoEstructural(modelo, enlaceIds);
  if (!contexto.ok) return contexto;
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const refinable = aparienciaDeEntidad(opd, contexto.value.refinableId);
  if (!refinable) return fallo("El refinable debe estar visible en el OPD activo");

  let modeloBase = modelo;
  if (contexto.value.tipo === "agregacion") {
    modeloBase = crearAgregacionesInzoomFaltantes(modeloBase, opdId, contexto.value.refinableId, contexto.value.grupoEstructuralId).modelo;
  }

  const opdBase = modeloBase.opds[opdId] ?? opd;
  const refinableBase = aparienciaDeEntidad(opdBase, contexto.value.refinableId) ?? refinable;
  const visibles = new Set(Object.values(opdBase.enlaces).map((apariencia) => apariencia.enlaceId));
  const candidatos = ordenarEnlacesPorReferencia(modeloBase, candidatosEstructuralesDelGrupo(modeloBase, contexto.value, true)
    .filter((enlace) => !visibles.has(enlace.id)));
  if (candidatos.length === 0) return ok({ modelo: modeloBase, agregadas: 0 });

  return ok(materializarEnlacesEstructuralesEnOpd(modeloBase, opdId, opdBase, refinableBase, candidatos, {
    ladoRefinable: contexto.value.ladoRefinable,
    existentesRefinadores: refinadoresVisiblesDelGrupo(modeloBase, opdBase, contexto.value),
    ...(contexto.value.grupoEstructuralId ? { grupoEstructuralId: contexto.value.grupoEstructuralId } : {}),
  }));
}

export function agregacionesInzoomFaltantes(
  modelo: Modelo,
  opdId: Id,
  refinableId: Id,
): AgregacionesInzoomFaltantes {
  const entidadIds = candidatosAgregacionInzoom(modelo, opdId, refinableId);
  return { refinableId, entidadIds, faltantes: entidadIds.length };
}

export function traerAgregacionesInzoomFaltantes(
  modelo: Modelo,
  opdId: Id,
  refinableId: Id,
): Resultado<{ modelo: Modelo; creadas: number; agregadas: number }> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const refinable = aparienciaDeEntidad(opd, refinableId);
  if (!refinable) return fallo("El refinable debe estar visible en el OPD activo");

  const creadas = crearAgregacionesInzoomFaltantes(modelo, opdId, refinableId);
  if (creadas.enlaces.length === 0) return ok({ modelo, creadas: 0, agregadas: 0 });

  const opdBase = creadas.modelo.opds[opdId] ?? opd;
  const refinableBase = aparienciaDeEntidad(opdBase, refinableId) ?? refinable;
  const materializadas = materializarEnlacesEstructuralesEnOpd(creadas.modelo, opdId, opdBase, refinableBase, creadas.enlaces, {
    ladoRefinable: "origen",
    existentesRefinadores: refinadoresVisiblesPorTipo(creadas.modelo, opdBase, refinableId, "agregacion"),
  });
  return ok({ modelo: materializadas.modelo, creadas: creadas.enlaces.length, agregadas: materializadas.agregadas });
}

export function plegarGrupoEstructural(
  modelo: Modelo,
  opdId: Id,
  enlaceIds: Id[],
): Resultado<Modelo> {
  const contexto = contextoGrupoEstructural(modelo, enlaceIds);
  if (!contexto.ok) return contexto;
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const refinable = aparienciaDeEntidad(opd, contexto.value.refinableId);
  if (!refinable) return fallo("El refinable debe estar visible en el OPD activo");

  const idsGrupo = new Set(candidatosEstructuralesDelGrupo(modelo, contexto.value).map((enlace) => enlace.id));
  const aparienciasEnlace = Object.fromEntries(Object.entries(opd.enlaces)
    .filter(([, apariencia]) => !idsGrupo.has(apariencia.enlaceId)));
  const refinadoresGrupo = new Set(Array.from(idsGrupo)
    .flatMap((enlaceId) => {
      const enlace = modelo.enlaces[enlaceId];
      const refinador = enlace ? entidadRefinadorDeEnlace(modelo, enlace, contexto.value) : null;
      return refinador ? [refinador] : [];
    }));
  const endpointsRestantes = entidadesConectadasPorApariencias(modelo, Object.values(aparienciasEnlace));
  const apariencias = Object.fromEntries(Object.entries(opd.apariencias)
    .filter(([, apariencia]) => {
      if (apariencia.id === refinable.id) return true;
      if (!refinadoresGrupo.has(apariencia.entidadId)) return true;
      return endpointsRestantes.has(apariencia.entidadId);
    })
    .map(([id, apariencia]) => [id, id === refinable.id ? { ...apariencia, modoPlegado: "parcial" as const } : apariencia]));

  return ok({
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        apariencias,
        enlaces: aparienciasEnlace,
      },
    },
  });
}

export function relacionesSemiplegadasEstructurales(
  modelo: Modelo,
  opdId: Id,
  refinableId: Id,
): RelacionesSemiplegadasEstructurales {
  const opd = modelo.opds[opdId];
  const refinable = opd ? aparienciaDeEntidad(opd, refinableId) : undefined;
  if (!opd || !refinable || refinable.modoPlegado !== "parcial") {
    return { refinableId, enlaceIds: [], faltantes: 0 };
  }
  const visibles = new Set(Object.values(opd.enlaces).map((apariencia) => apariencia.enlaceId));
  const enlaceIds = candidatosSemiplegadosEstructurales(modelo, refinableId, visibles).map((enlace) => enlace.id);
  return { refinableId, enlaceIds, faltantes: enlaceIds.length };
}

export function quitarSemiplegadoEstructural(
  modelo: Modelo,
  opdId: Id,
  refinableId: Id,
): Resultado<{ modelo: Modelo; agregadas: number }> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const refinable = aparienciaDeEntidad(opd, refinableId);
  if (!refinable) return fallo("El refinable debe estar visible en el OPD activo");
  if (refinable.modoPlegado !== "parcial") return fallo("La entidad no está en semiplegado estructural");

  const visibles = new Set(Object.values(opd.enlaces).map((apariencia) => apariencia.enlaceId));
  const candidatos = candidatosSemiplegadosEstructurales(modelo, refinableId, visibles);
  if (candidatos.length === 0) return ok({ modelo, agregadas: 0 });

  return ok(materializarEnlacesEstructuralesEnOpd(modelo, opdId, opd, refinable, candidatos, {
    ladoRefinable: "origen",
    existentesRefinadores: [],
  }));
}

export function eliminarEnlacesBatch(modelo: Modelo, enlaceIds: Id[]): Resultado<Modelo> {
  let siguiente = modelo;
  for (const enlaceId of enlaceIds) {
    if (!siguiente.enlaces[enlaceId]) continue;
    const resultado = eliminarEnlace(siguiente, enlaceId);
    if (!resultado.ok) return resultado;
    siguiente = resultado.value;
  }
  return ok(siguiente);
}

export function copiarEstiloEnlace(modelo: Modelo, enlaceId: Id): Resultado<EnlaceEstilo> {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
  if (!enlace.estilo || Object.keys(enlace.estilo).length === 0) return fallo("El enlace no tiene estilo visual");
  return ok({ ...enlace.estilo });
}

export function reanclarEnlaceExternoDerivado(
  modelo: Modelo,
  opdId: Id,
  aparienciaEnlaceId: Id,
  nuevoEndpointEntidadId: Id,
): Resultado<Modelo> {
  const validado = validarReanclajeEnlaceExterno(modelo, opdId, aparienciaEnlaceId, nuevoEndpointEntidadId);
  if (!validado.ok) return validado;
  const { enlace, lado } = validado.value;
  const actualizado: Enlace = {
    ...enlace,
    [lado === "origen" ? "origenId" : "destinoId"]: extremoEntidad(nuevoEndpointEntidadId),
    derivado: {
      ...enlace.derivado!,
      origen: "manual",
    },
  };
  const origen = entidadDeExtremo(modelo, actualizado.origenId);
  const destino = entidadDeExtremo(modelo, actualizado.destinoId);
  if (!origen || !destino) return fallo("Endpoint de reanclaje inválido");
  const firma = validarFirmaEnlace(actualizado.tipo, origen, destino, {
    origen: actualizado.origenId,
    destino: actualizado.destinoId,
  });
  if (!firma.ok) return fallo("El subproceso elegido no admite la firma del enlace derivado");
  if (
    mismoExtremo(enlace.origenId, actualizado.origenId) &&
    mismoExtremo(enlace.destinoId, actualizado.destinoId) &&
    enlace.derivado?.origen === "manual"
  ) {
    return ok(modelo);
  }
  return ok({
    ...modelo,
    enlaces: {
      ...modelo.enlaces,
      [enlace.id]: actualizado,
    },
  });
}

export function volverEnlaceExternoDerivadoAAutomatico(
  modelo: Modelo,
  opdId: Id,
  aparienciaEnlaceId: Id,
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const apariencia = opd.enlaces[aparienciaEnlaceId];
  if (!apariencia) return fallo(`Apariencia de enlace no existe: ${aparienciaEnlaceId}`);
  const enlace = modelo.enlaces[apariencia.enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${apariencia.enlaceId}`);
  if (!enlace.derivado) return fallo("El enlace no es derivado");
  const automatico: Modelo = {
    ...modelo,
    enlaces: {
      ...modelo.enlaces,
      [enlace.id]: {
        ...enlace,
        derivado: {
          ...enlace.derivado,
          origen: "automatico",
        },
      },
    },
  };
  return refrescarEnlacesExternosDerivados(automatico, opdId);
}

type LadoEndpointDerivado = "origen" | "destino";

function validarReanclajeEnlaceExterno(
  modelo: Modelo,
  opdId: Id,
  aparienciaEnlaceId: Id,
  nuevoEndpointEntidadId: Id,
): Resultado<{ enlace: Enlace; lado: LadoEndpointDerivado }> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const aparienciaEnlace = opd.enlaces[aparienciaEnlaceId];
  if (!aparienciaEnlace) return fallo(`Apariencia de enlace no existe: ${aparienciaEnlaceId}`);
  const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${aparienciaEnlace.enlaceId}`);
  if (!enlace.derivado) return fallo("El enlace no es derivado");
  if (enlace.derivado.tipo !== "enlace-externo-refinamiento") return fallo("El enlace derivado no es de refinamiento externo");

  const contorno = procesoDescompuestoEnOpd(modelo, opd);
  if (!contorno || contorno.entidad.id !== enlace.derivado.refinamientoId) {
    return fallo("El enlace derivado no pertenece al OPD activo");
  }
  const endpoint = modelo.entidades[nuevoEndpointEntidadId];
  if (!endpoint) return fallo(`Entidad no existe: ${nuevoEndpointEntidadId}`);
  if (endpoint.tipo !== "proceso") return fallo("El endpoint debe ser un subproceso");
  const subproceso = subprocesosOrdenadosDeRefinamiento(modelo, opd, contorno.entidad.id)
    .find((apariencia) => apariencia.entidadId === nuevoEndpointEntidadId);
  if (!subproceso) return fallo("El endpoint debe ser un subproceso visible del refinamiento activo");

  const enlacePadre = modelo.enlaces[enlace.derivado.enlacePadreId];
  if (!enlacePadre) return fallo(`Enlace padre no existe: ${enlace.derivado.enlacePadreId}`);
  const lado = ladoReanclableDerivado(enlace, enlacePadre, contorno.entidad.id);
  if (!lado) return fallo("No se pudo determinar el endpoint reanclable del enlace derivado");
  return ok({ enlace, lado });
}

function ladoReanclableDerivado(enlace: Enlace, enlacePadre: Enlace, refinamientoId: Id): LadoEndpointDerivado | null {
  if (enlace.tipo !== enlacePadre.tipo) return null;
  if (
    extremoApuntaAEntidad(enlacePadre.destinoId, refinamientoId) &&
    mismoExtremo(enlace.origenId, enlacePadre.origenId)
  ) return "destino";
  if (
    extremoApuntaAEntidad(enlacePadre.origenId, refinamientoId) &&
    mismoExtremo(enlace.destinoId, enlacePadre.destinoId)
  ) return "origen";
  return null;
}

function esTipoEstructural(tipo: TipoEnlace): boolean {
  return (TIPOS_ESTRUCTURALES as readonly TipoEnlace[]).includes(tipo);
}

function tipoEstructuralComun(modelo: Modelo, enlaceIds: Id[]): TipoEnlace | null {
  let tipo: TipoEnlace | null = null;
  for (const enlaceId of enlaceIds) {
    const enlace = modelo.enlaces[enlaceId];
    if (!enlace || naturalezaDeEnlace(enlace.tipo) !== "estructural") return null;
    if (!tipo) tipo = enlace.tipo;
    else if (tipo !== enlace.tipo) return null;
  }
  return tipo;
}

function refinableComun(modelo: Modelo, enlaceIds: Id[]): Id | null {
  const origenes = new Set<Id>();
  const destinos = new Set<Id>();
  for (const enlaceId of enlaceIds) {
    const enlace = modelo.enlaces[enlaceId];
    if (!enlace) return null;
    const origen = entidadIdDeExtremo(modelo, enlace.origenId);
    const destino = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (origen) origenes.add(origen);
    if (destino) destinos.add(destino);
  }
  if (origenes.size === 1) return [...origenes][0] ?? null;
  if (destinos.size === 1) return [...destinos][0] ?? null;
  return null;
}

interface ContextoGrupoEstructural {
  ids: Id[];
  tipo: TipoEnlace;
  refinableId: Id;
  ladoRefinable: "origen" | "destino";
  grupoEstructuralId?: Id;
}

function contextoGrupoEstructural(modelo: Modelo, enlaceIds: Id[]): Resultado<ContextoGrupoEstructural> {
  const ids = [...new Set(enlaceIds)];
  if (ids.length === 0) return fallo("Selecciona al menos un enlace estructural");
  const base = modelo.enlaces[ids[0]!];
  if (!base || naturalezaDeEnlace(base.tipo) !== "estructural") return fallo("Selecciona un enlace estructural fundamental");
  const baseOrigen = entidadIdDeExtremo(modelo, base.origenId);
  const baseDestino = entidadIdDeExtremo(modelo, base.destinoId);
  const porOrigen = !!baseOrigen && ids.every((id) => {
    const enlace = modelo.enlaces[id];
    return !!enlace && entidadIdDeExtremo(modelo, enlace.origenId) === baseOrigen;
  });
  const porDestino = !!baseDestino && ids.every((id) => {
    const enlace = modelo.enlaces[id];
    return !!enlace && entidadIdDeExtremo(modelo, enlace.destinoId) === baseDestino;
  });
  const ladoRefinable = porOrigen ? "origen" : porDestino ? "destino" : null;
  const refinableId = ladoRefinable === "origen" ? baseOrigen : ladoRefinable === "destino" ? baseDestino : null;
  if (!ladoRefinable || !refinableId) return fallo("El grupo estructural no tiene refinable común");
  return ok({
    ids,
    tipo: base.tipo,
    refinableId,
    ladoRefinable,
    ...(base.grupoEstructuralId ? { grupoEstructuralId: base.grupoEstructuralId } : {}),
  });
}

function candidatosEstructuralesDelGrupo(modelo: Modelo, contexto: ContextoGrupoEstructural, incluirAutomaticosSinGrupo = false): Enlace[] {
  return Object.values(modelo.enlaces).filter((enlace) => {
    if (enlace.tipo !== contexto.tipo) return false;
    if (naturalezaDeEnlace(enlace.tipo) !== "estructural") return false;
    if (contexto.grupoEstructuralId && enlace.grupoEstructuralId !== contexto.grupoEstructuralId && !(incluirAutomaticosSinGrupo && !enlace.grupoEstructuralId)) return false;
    if (!contexto.grupoEstructuralId && enlace.grupoEstructuralId) return false;
    const extremo = contexto.ladoRefinable === "origen" ? enlace.origenId : enlace.destinoId;
    return entidadIdDeExtremo(modelo, extremo) === contexto.refinableId;
  });
}

function candidatosAgregacionInzoom(modelo: Modelo, opdId: Id, refinableId: Id): Id[] {
  const opd = modelo.opds[opdId];
  const refinable = modelo.entidades[refinableId];
  if (!opd || !refinable || !aparienciaDeEntidad(opd, refinableId)) return [];
  const slot = obtenerRefinamiento(refinable, "descomposicion");
  const opdInzoom = slot ? modelo.opds[slot.opdId] : undefined;
  if (!opdInzoom) return [];

  const yaAgregadas = new Set(Object.values(modelo.enlaces)
    .filter((enlace) => enlace.tipo === "agregacion" && entidadIdDeExtremo(modelo, enlace.origenId) === refinableId)
    .flatMap((enlace) => {
      const destinoId = entidadIdDeExtremo(modelo, enlace.destinoId);
      return destinoId ? [destinoId] : [];
    }));
  const vistas = new Set<Id>();
  return Object.values(opdInzoom.apariencias)
    .filter((apariencia) => {
      const contexto = apariencia.contextoRefinamiento;
      if (contexto?.tipo !== "descomposicion" || contexto.rol !== "interno") return false;
      if (contexto.refinableEntidadId !== refinableId) return false;
      if (yaAgregadas.has(apariencia.entidadId) || vistas.has(apariencia.entidadId)) return false;
      const entidad = modelo.entidades[apariencia.entidadId];
      if (!entidad || entidad.tipo !== refinable.tipo) return false;
      vistas.add(apariencia.entidadId);
      return true;
    })
    .sort((a, b) => a.y - b.y || a.x - b.x || a.id.localeCompare(b.id))
    .map((apariencia) => apariencia.entidadId);
}

function crearAgregacionesInzoomFaltantes(
  modelo: Modelo,
  opdId: Id,
  refinableId: Id,
  grupoEstructuralId?: Id,
): { modelo: Modelo; enlaces: Enlace[] } {
  const refinable = modelo.entidades[refinableId];
  if (!refinable) return { modelo, enlaces: [] };
  const entidadIds = candidatosAgregacionInzoom(modelo, opdId, refinableId);
  if (entidadIds.length === 0) return { modelo, enlaces: [] };

  let nextSeq = modelo.nextSeq;
  const enlacesActualizados = { ...modelo.enlaces };
  const creadas: Enlace[] = [];
  for (const entidadId of entidadIds) {
    const destino = modelo.entidades[entidadId];
    if (!destino) continue;
    const origenExtremo = extremoEntidad(refinableId);
    const destinoExtremo = extremoEntidad(entidadId);
    const firma = validarFirmaEnlace("agregacion", refinable, destino, {
      origen: origenExtremo,
      destino: destinoExtremo,
    });
    if (!firma.ok) continue;
    const id = siguienteId({ ...modelo, nextSeq }, "e");
    nextSeq += 1;
    const enlace: Enlace = {
      id,
      tipo: "agregacion",
      origenId: origenExtremo,
      destinoId: destinoExtremo,
      etiqueta: "",
      ...(grupoEstructuralId ? { grupoEstructuralId } : {}),
    };
    enlacesActualizados[id] = enlace;
    creadas.push(enlace);
  }
  if (creadas.length === 0) return { modelo, enlaces: [] };
  return { modelo: { ...modelo, nextSeq, enlaces: enlacesActualizados }, enlaces: creadas };
}

function entidadRefinadorDeEnlace(modelo: Modelo, enlace: Enlace, contexto: ContextoGrupoEstructural): Id | null {
  return entidadRefinadorPorLado(modelo, enlace, contexto.ladoRefinable);
}

function entidadRefinadorPorLado(modelo: Modelo, enlace: Enlace, ladoRefinable: "origen" | "destino"): Id | null {
  const extremo = ladoRefinable === "origen" ? enlace.destinoId : enlace.origenId;
  return entidadIdDeExtremo(modelo, extremo);
}

function aparienciaDeEntidad(opd: Pick<Opd, "apariencias">, entidadId: Id): Apariencia | undefined {
  return Object.values(opd.apariencias).find((apariencia) => apariencia.entidadId === entidadId);
}

function aparienciaReferenciaEntidad(modelo: Modelo, entidadId: Id): Apariencia | undefined {
  for (const opd of Object.values(modelo.opds)) {
    const apariencia = aparienciaDeEntidad(opd, entidadId);
    if (apariencia) return apariencia;
  }
  return undefined;
}

function refinadoresVisiblesDelGrupo(modelo: Modelo, opd: Opd, contexto: ContextoGrupoEstructural): Apariencia[] {
  const ids = new Set(candidatosEstructuralesDelGrupo(modelo, contexto)
    .flatMap((enlace) => {
      const refinador = entidadRefinadorDeEnlace(modelo, enlace, contexto);
      return refinador ? [refinador] : [];
    }));
  return Object.values(opd.apariencias).filter((apariencia) => ids.has(apariencia.entidadId));
}

function refinadoresVisiblesPorTipo(modelo: Modelo, opd: Opd, refinableId: Id, tipo: TipoEnlace): Apariencia[] {
  const ids = new Set(Object.values(modelo.enlaces)
    .filter((enlace) => enlace.tipo === tipo && entidadIdDeExtremo(modelo, enlace.origenId) === refinableId)
    .flatMap((enlace) => {
      const destinoId = entidadIdDeExtremo(modelo, enlace.destinoId);
      return destinoId ? [destinoId] : [];
    }));
  return Object.values(opd.apariencias).filter((apariencia) => ids.has(apariencia.entidadId));
}

function ordenarEnlacesPorReferencia(modelo: Modelo, enlaces: Enlace[]): Enlace[] {
  return [...enlaces].sort((a, b) => {
    const refA = aparienciaReferenciaEntidad(modelo, entidadIdDeExtremo(modelo, a.destinoId) ?? entidadIdDeExtremo(modelo, a.origenId) ?? "");
    const refB = aparienciaReferenciaEntidad(modelo, entidadIdDeExtremo(modelo, b.destinoId) ?? entidadIdDeExtremo(modelo, b.origenId) ?? "");
    return (refA?.y ?? 0) - (refB?.y ?? 0)
      || (refA?.x ?? 0) - (refB?.x ?? 0)
      || a.id.localeCompare(b.id);
  });
}

function candidatosSemiplegadosEstructurales(modelo: Modelo, refinableId: Id, visibles: Set<Id>): Enlace[] {
  return ordenarEnlacesPorReferencia(modelo, Object.values(modelo.enlaces).filter((enlace) => {
    if (naturalezaDeEnlace(enlace.tipo) !== "estructural") return false;
    if (entidadIdDeExtremo(modelo, enlace.origenId) !== refinableId) return false;
    if (visibles.has(enlace.id)) return false;
    return entidadIdDeExtremo(modelo, enlace.destinoId) !== null;
  }));
}

function materializarEnlacesEstructuralesEnOpd(
  modelo: Modelo,
  opdId: Id,
  opd: Opd,
  refinable: Apariencia,
  enlaces: Enlace[],
  opciones: {
    ladoRefinable: "origen" | "destino";
    grupoEstructuralId?: Id;
    existentesRefinadores: Apariencia[];
  },
): { modelo: Modelo; agregadas: number } {
  let nextSeq = modelo.nextSeq;
  let agregadas = 0;
  const enlacesActualizados = { ...modelo.enlaces };
  const aparienciasActualizadas = { ...opd.apariencias };
  const aparienciasEnlaceActualizadas = { ...opd.enlaces };

  enlaces.forEach((enlace, index) => {
    const refinadorId = entidadRefinadorPorLado(modelo, enlace, opciones.ladoRefinable);
    if (!refinadorId) return;
    if (opciones.grupoEstructuralId && enlace.grupoEstructuralId !== opciones.grupoEstructuralId) {
      enlacesActualizados[enlace.id] = { ...enlace, grupoEstructuralId: opciones.grupoEstructuralId };
    }
    if (!aparienciaDeEntidad({ ...opd, apariencias: aparienciasActualizadas }, refinadorId)) {
      const referencia = aparienciaReferenciaEntidad(modelo, refinadorId);
      const aparienciaId = siguienteId({ ...modelo, nextSeq }, "a");
      nextSeq += 1;
      aparienciasActualizadas[aparienciaId] = {
        id: aparienciaId,
        entidadId: refinadorId,
        opdId,
        ...posicionRefinadorTraido(refinable, referencia, opciones.existentesRefinadores.length + index, opciones.ladoRefinable),
      };
    }
    const aparienciaEnlaceId = siguienteId({ ...modelo, nextSeq }, "ae");
    nextSeq += 1;
    aparienciasEnlaceActualizadas[aparienciaEnlaceId] = { id: aparienciaEnlaceId, enlaceId: enlace.id, opdId, vertices: [] };
    agregadas += 1;
  });

  aparienciasActualizadas[refinable.id] = modoCompleto(refinable);

  return {
    modelo: {
      ...modelo,
      nextSeq,
      enlaces: enlacesActualizados,
      opds: {
        ...modelo.opds,
        [opdId]: {
          ...opd,
          apariencias: aparienciasActualizadas,
          enlaces: aparienciasEnlaceActualizadas,
        },
      },
    },
    agregadas,
  };
}

function posicionRefinadorTraido(
  refinable: Apariencia,
  referencia: Apariencia | undefined,
  index: number,
  ladoRefinable: "origen" | "destino",
): Omit<Apariencia, "id" | "entidadId" | "opdId"> {
  const width = referencia?.width ?? CANON.dims.cosaWidth;
  const height = referencia?.height ?? CANON.dims.cosaHeight;
  const separacion = 28;
  const x = ladoRefinable === "origen"
    ? refinable.x + refinable.width + 120
    : refinable.x - width - 120;
  return {
    x,
    y: refinable.y + index * (height + separacion),
    width,
    height,
  };
}

function modoCompleto(apariencia: Apariencia): Apariencia {
  if (apariencia.modoPlegado !== "parcial") return apariencia;
  const actualizada = { ...apariencia };
  delete actualizada.modoPlegado;
  return actualizada;
}

function entidadesConectadasPorApariencias(modelo: Modelo, apariencias: AparienciaEnlace[]): Set<Id> {
  const ids = new Set<Id>();
  for (const apariencia of apariencias) {
    const enlace = modelo.enlaces[apariencia.enlaceId];
    const origen = enlace ? entidadIdDeExtremo(modelo, enlace.origenId) : null;
    const destino = enlace ? entidadIdDeExtremo(modelo, enlace.destinoId) : null;
    if (origen) ids.add(origen);
    if (destino) ids.add(destino);
  }
  return ids;
}
