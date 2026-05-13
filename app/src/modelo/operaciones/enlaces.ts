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
  AparienciaEnlace,
  Enlace,
  EnlaceEstilo,
  Id,
  Modelo,
  Resultado,
  TipoEnlace,
} from "../tipos";
import { naturalezaDeEnlace } from "../constantes";
import { fallo, ok, siguienteId, validarFirmaEnlace } from "./helpers";
import {
  procesoDescompuestoEnOpd,
  refrescarEnlacesExternosDerivados,
  subprocesosOrdenadosDeRefinamiento,
} from "./refinamiento";
import { eliminarEnlace } from "./eliminacion";

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
