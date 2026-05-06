import {
  entidadDeExtremo,
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
  Id,
  Modelo,
  Resultado,
  TipoEnlace,
} from "../tipos";
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
 *       opm-extracted/src/app/models/Logical/AggregationLink.ts (separación por familia).
 */

export type LadoMultiplicidadEnlace = "origen" | "destino";

export type LadoExtremoEnlace = "origen" | "destino";

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
