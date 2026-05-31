import { enlaceAdmiteTasa, enlaceAdmiteTiempoMaximo, enlaceAdmiteTiempoMinimo, esEnlaceEstructuralFundamental } from "../modelo/constantes";
import { validarAbanicoCanonico } from "../modelo/abanicos";
import { entidadDeExtremo, extremoEntidad, normalizarExtremo } from "../modelo/extremos";
import { esColorEstilo } from "../modelo/estilos";
import { esModificador, esSubtipoModificador, validarMetadatosEnlace } from "../modelo/modificadores";
import { validarFirmaEnlace, validarMultiplicidad } from "../modelo/operaciones";
import { rutaEtiquetaNormalizada } from "../modelo/rutas";
import type {
  Abanico,
  DerivacionEnlace,
  DecisionPolicy,
  Enlace,
  Entidad,
  Estado,
  ExtremoEnlace,
  Id,
  Modelo,
  Opd,
  PuertoAbanicoExacto,
  Resultado,
} from "../modelo/tipos";
import {
  fallo,
  ok,
  esExtremoKind,
  esNumeroFinito,
  esOperadorAbanico,
  esRecord,
  esTipoEnlace,
} from "./validarHelpers";
import { modeloParaExtremos } from "./validarIntegridad";

/**
 * Validadores para enlaces, extremos, estilos, multiplicidad y abanicos.
 *
 * Consumidores conocidos: `serializacion/json.ts`. Anclaje: SSOT OPM ISO
 * 19450 §3.36 enlace, §Modelo de enlace y §Multiplicidad de objetos.
 */

export function validarEnlaces(
  value: Record<string, unknown>,
  entidades: Record<Id, Entidad>,
  estados: Record<Id, Estado>,
): Resultado<Record<Id, Enlace>> {
  const enlaces: Record<Id, Enlace> = {};
  const modeloParcial = modeloParaExtremos(entidades, estados);
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw)) return fallo(`Enlace inválido: ${id}`);
    if (raw.id !== id) return fallo(`Enlace inválido: ${id}.id`);
    if (!esTipoEnlace(raw.tipo)) return fallo(`Enlace inválido: ${id}.tipo`);
    const origenExtremo = validarExtremoEnlace(id, "origenId", raw.origenId, entidades, estados);
    if (!origenExtremo.ok) return origenExtremo;
    const destinoExtremo = validarExtremoEnlace(id, "destinoId", raw.destinoId, entidades, estados);
    if (!destinoExtremo.ok) return destinoExtremo;
    const origen = entidadDeExtremo(modeloParcial, origenExtremo.value);
    const destino = entidadDeExtremo(modeloParcial, destinoExtremo.value);
    if (!origen) return fallo(`Enlace inválido: ${id}.origenId`);
    if (!destino) return fallo(`Enlace inválido: ${id}.destinoId`);
    if (origenExtremo.value.kind === destinoExtremo.value.kind && origenExtremo.value.id === destinoExtremo.value.id) {
      return fallo(`Enlace inválido: ${id}.self`);
    }
    if (typeof raw.etiqueta !== "string") return fallo(`Enlace inválido: ${id}.etiqueta`);
    const firma = validarFirmaEnlace(raw.tipo, origen, destino, {
      origen: origenExtremo.value,
      destino: destinoExtremo.value,
    });
    if (!firma.ok) return fallo(`Enlace inválido: ${id}.firma`);
    const derivado = validarDerivacionEnlace(id, raw.derivado);
    if (!derivado.ok) return derivado;
    const multiplicidadOrigen = validarMultiplicidadOpcional(id, "multiplicidadOrigen", raw.multiplicidadOrigen);
    if (!multiplicidadOrigen.ok) return multiplicidadOrigen;
    const multiplicidadDestino = validarMultiplicidadOpcional(id, "multiplicidadDestino", raw.multiplicidadDestino);
    if (!multiplicidadDestino.ok) return multiplicidadDestino;
    if (raw.modificador !== undefined && !esModificador(raw.modificador)) {
      return fallo(`Enlace inválido: ${id}.modificador`);
    }
    if (raw.subtipoModificador !== undefined && !esSubtipoModificador(raw.subtipoModificador)) {
      return fallo(`Enlace inválido: ${id}.subtipoModificador`);
    }
    const subtipoModificador = raw.subtipoModificador;
    if (raw.probabilidad !== undefined && !esNumeroFinito(raw.probabilidad)) {
      return fallo(`Enlace inválido: ${id}.probabilidad`);
    }
    if (raw.demora !== undefined && typeof raw.demora !== "string") {
      return fallo(`Enlace inválido: ${id}.demora`);
    }
    const rutaEtiqueta = validarRutaEtiquetaOpcional(id, raw.rutaEtiqueta);
    if (!rutaEtiqueta.ok) return rutaEtiqueta;
    const backwardTag = validarTextoOpcional(id, "backwardTag", raw.backwardTag);
    if (!backwardTag.ok) return backwardTag;
    if (backwardTag.value && raw.tipo !== "etiquetadoBidireccional") {
      return fallo(`Enlace inválido: ${id}.backwardTag`);
    }
    const requisitos = validarTextoOpcional(id, "requisitos", raw.requisitos);
    if (!requisitos.ok) return requisitos;
    if (raw.mostrarRequisitos !== undefined && typeof raw.mostrarRequisitos !== "boolean") {
      return fallo(`Enlace inválido: ${id}.mostrarRequisitos`);
    }
    const tasa = validarTextoOpcional(id, "tasa", raw.tasa);
    if (!tasa.ok) return tasa;
    const unidadesTasa = validarTextoOpcional(id, "unidadesTasa", raw.unidadesTasa);
    if (!unidadesTasa.ok) return unidadesTasa;
    if ((tasa.value || unidadesTasa.value) && !enlaceAdmiteTasa(raw.tipo)) {
      return fallo(`Enlace inválido: ${id}.tasa`);
    }
    if (unidadesTasa.value && !tasa.value) {
      return fallo(`Enlace inválido: ${id}.unidadesTasa`);
    }
    const tiempoMinimo = validarTextoOpcional(id, "tiempoMinimo", raw.tiempoMinimo);
    if (!tiempoMinimo.ok) return tiempoMinimo;
    const unidadTiempoMinimo = validarTextoOpcional(id, "unidadTiempoMinimo", raw.unidadTiempoMinimo);
    if (!unidadTiempoMinimo.ok) return unidadTiempoMinimo;
    if ((tiempoMinimo.value || unidadTiempoMinimo.value) && !enlaceAdmiteTiempoMinimo(raw.tipo)) {
      return fallo(`Enlace inválido: ${id}.tiempoMinimo`);
    }
    if (unidadTiempoMinimo.value && !tiempoMinimo.value) {
      return fallo(`Enlace inválido: ${id}.unidadTiempoMinimo`);
    }
    const tiempoMaximo = validarTextoOpcional(id, "tiempoMaximo", raw.tiempoMaximo);
    if (!tiempoMaximo.ok) return tiempoMaximo;
    const unidadTiempoMaximo = validarTextoOpcional(id, "unidadTiempoMaximo", raw.unidadTiempoMaximo);
    if (!unidadTiempoMaximo.ok) return unidadTiempoMaximo;
    if ((tiempoMaximo.value || unidadTiempoMaximo.value) && !enlaceAdmiteTiempoMaximo(raw.tipo)) {
      return fallo(`Enlace inválido: ${id}.tiempoMaximo`);
    }
    if (unidadTiempoMaximo.value && !tiempoMaximo.value) {
      return fallo(`Enlace inválido: ${id}.unidadTiempoMaximo`);
    }
    const grupoEstructuralId = validarGrupoEstructuralIdOpcional(id, raw.grupoEstructuralId);
    if (!grupoEstructuralId.ok) return grupoEstructuralId;
    if (grupoEstructuralId.value && !esEnlaceEstructuralFundamental(raw.tipo)) {
      return fallo(`Enlace inválido: ${id}.grupoEstructuralId`);
    }
    const estadoEntradaId = validarEstadoEfectoOpcional(id, "estadoEntradaId", raw.estadoEntradaId, raw.tipo, estados);
    if (!estadoEntradaId.ok) return estadoEntradaId;
    const estadoSalidaId = validarEstadoEfectoOpcional(id, "estadoSalidaId", raw.estadoSalidaId, raw.tipo, estados);
    if (!estadoSalidaId.ok) return estadoSalidaId;
    const efectoEscindido = validarEfectoEscindidoOpcional(id, raw.efectoEscindido, raw.tipo);
    if (!efectoEscindido.ok) return efectoEscindido;
    const estilo = validarEstiloEnlaceOpcional(id, raw.estilo);
    if (!estilo.ok) return estilo;
    const enlace: Enlace = {
      id,
      tipo: raw.tipo,
      origenId: origenExtremo.value,
      destinoId: destinoExtremo.value,
      etiqueta: raw.etiqueta,
      ...(multiplicidadOrigen.value ? { multiplicidadOrigen: multiplicidadOrigen.value } : {}),
      ...(multiplicidadDestino.value ? { multiplicidadDestino: multiplicidadDestino.value } : {}),
      ...(estilo.value ? { estilo: estilo.value } : {}),
      ...(raw.modificador ? { modificador: raw.modificador } : {}),
      ...(subtipoModificador ? { subtipoModificador } : {}),
      ...(raw.probabilidad !== undefined ? { probabilidad: raw.probabilidad } : {}),
      ...(raw.demora ? { demora: raw.demora } : {}),
      ...(rutaEtiqueta.value ? { rutaEtiqueta: rutaEtiqueta.value } : {}),
      ...(backwardTag.value ? { backwardTag: backwardTag.value } : {}),
      ...(requisitos.value ? { requisitos: requisitos.value } : {}),
      ...(requisitos.value && raw.mostrarRequisitos === true ? { mostrarRequisitos: true } : {}),
      ...(tasa.value ? { tasa: tasa.value } : {}),
      ...(tasa.value && unidadesTasa.value ? { unidadesTasa: unidadesTasa.value } : {}),
      ...(tiempoMinimo.value ? { tiempoMinimo: tiempoMinimo.value } : {}),
      ...(tiempoMinimo.value && unidadTiempoMinimo.value ? { unidadTiempoMinimo: unidadTiempoMinimo.value } : {}),
      ...(tiempoMaximo.value ? { tiempoMaximo: tiempoMaximo.value } : {}),
      ...(tiempoMaximo.value && unidadTiempoMaximo.value ? { unidadTiempoMaximo: unidadTiempoMaximo.value } : {}),
      ...(grupoEstructuralId.value ? { grupoEstructuralId: grupoEstructuralId.value } : {}),
      ...(estadoEntradaId.value ? { estadoEntradaId: estadoEntradaId.value } : {}),
      ...(estadoSalidaId.value ? { estadoSalidaId: estadoSalidaId.value } : {}),
      ...(efectoEscindido.value ? { efectoEscindido: efectoEscindido.value } : {}),
      ...(derivado.value ? { derivado: derivado.value } : {}),
    };
    const metadatos = validarMetadatosEnlace(enlace);
    if (!metadatos.ok) return fallo(`Enlace inválido: ${id}.metadatos`);
    enlaces[id] = enlace;
  }
  return ok(enlaces);
}

function validarEstadoEfectoOpcional(
  enlaceId: Id,
  campo: "estadoEntradaId" | "estadoSalidaId",
  value: unknown,
  tipo: Enlace["tipo"],
  estados: Record<Id, Estado>,
): Resultado<Id | undefined> {
  if (value === undefined) return ok(undefined);
  if (tipo !== "efecto" || typeof value !== "string" || !estados[value]) {
    return fallo(`Enlace inválido: ${enlaceId}.${campo}`);
  }
  return ok(value);
}

function validarEfectoEscindidoOpcional(
  enlaceId: Id,
  value: unknown,
  tipo: Enlace["tipo"],
): Resultado<Enlace["efectoEscindido"]> {
  if (value === undefined) return ok(undefined);
  if (tipo !== "efecto" || !esRecord(value)) return fallo(`Enlace inválido: ${enlaceId}.efectoEscindido`);
  if (typeof value.grupoId !== "string" || typeof value.enlacePadreId !== "string") {
    return fallo(`Enlace inválido: ${enlaceId}.efectoEscindido`);
  }
  if (value.rol !== "entrada" && value.rol !== "salida") {
    return fallo(`Enlace inválido: ${enlaceId}.efectoEscindido.rol`);
  }
  if (value.modo !== undefined && value.modo !== "par" && value.modo !== "standalone") {
    return fallo(`Enlace inválido: ${enlaceId}.efectoEscindido.modo`);
  }
  return ok({
    grupoId: value.grupoId,
    enlacePadreId: value.enlacePadreId,
    rol: value.rol,
    ...(value.modo ? { modo: value.modo } : {}),
  });
}

export function validarGrupoEstructuralIdOpcional(enlaceId: Id, value: unknown): Resultado<string | undefined> {
  if (value === undefined) return ok(undefined);
  if (typeof value !== "string") return fallo(`Enlace inválido: ${enlaceId}.grupoEstructuralId`);
  const normalizado = value.trim();
  return ok(normalizado || undefined);
}

export function validarRutaEtiquetaOpcional(enlaceId: Id, value: unknown): Resultado<string | undefined> {
  if (value === undefined) return ok(undefined);
  if (typeof value !== "string") return fallo(`Enlace inválido: ${enlaceId}.rutaEtiqueta`);
  return ok(rutaEtiquetaNormalizada(value));
}

export function validarTextoOpcional(
  enlaceId: Id,
  campo: "backwardTag" | "requisitos" | "tasa" | "unidadesTasa" | "tiempoMinimo" | "unidadTiempoMinimo" | "tiempoMaximo" | "unidadTiempoMaximo",
  value: unknown,
): Resultado<string | undefined> {
  if (value === undefined) return ok(undefined);
  if (typeof value !== "string") return fallo(`Enlace inválido: ${enlaceId}.${campo}`);
  const normalizado = value.trim();
  return ok(normalizado || undefined);
}

export function validarEstiloEnlaceOpcional(enlaceId: Id, value: unknown): Resultado<Enlace["estilo"]> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value)) return fallo(`Enlace inválido: ${enlaceId}.estilo`);
  const estilo: Enlace["estilo"] = {};
  if (value.color !== undefined) {
    if (typeof value.color !== "string" || !esColorEstilo(value.color)) return fallo(`Enlace inválido: ${enlaceId}.estilo.color`);
    estilo.color = value.color.toLowerCase();
  }
  if (value.strokeWidth !== undefined) {
    if (typeof value.strokeWidth !== "number" || value.strokeWidth < 1 || value.strokeWidth > 6) return fallo(`Enlace inválido: ${enlaceId}.estilo.strokeWidth`);
    estilo.strokeWidth = value.strokeWidth;
  }
  if (value.dashArray !== undefined) {
    if (typeof value.dashArray !== "string" || !["", "4 4", "2 4", "6 4 2 4"].includes(value.dashArray)) return fallo(`Enlace inválido: ${enlaceId}.estilo.dashArray`);
    estilo.dashArray = value.dashArray;
  }
  return ok(Object.keys(estilo).length > 0 ? estilo : undefined);
}

export function validarExtremoEnlace(
  enlaceId: Id,
  campo: "origenId" | "destinoId",
  value: unknown,
  entidades: Record<Id, Entidad>,
  estados: Record<Id, Estado>,
): Resultado<ExtremoEnlace> {
  if (typeof value === "string") {
    if (!entidades[value]) return fallo(`Enlace inválido: ${enlaceId}.${campo}`);
    return ok(extremoEntidad(value));
  }
  if (!esRecord(value)) return fallo(`Enlace inválido: ${enlaceId}.${campo}`);
  if (!esExtremoKind(value.kind)) return fallo(`Enlace inválido: ${enlaceId}.${campo}.kind`);
  if (typeof value.id !== "string") return fallo(`Enlace inválido: ${enlaceId}.${campo}.id`);
  if (value.portId !== undefined && typeof value.portId !== "string") {
    return fallo(`Enlace inválido: ${enlaceId}.${campo}.portId`);
  }
  const extremo = normalizarExtremo({ kind: value.kind, id: value.id });
  if (extremo.kind === "entidad" && !entidades[extremo.id]) return fallo(`Enlace inválido: ${enlaceId}.${campo}.id`);
  if (extremo.kind === "estado" && !estados[extremo.id]) return fallo(`Enlace inválido: ${enlaceId}.${campo}.id`);
  if (extremo.kind === "estado" && value.portId !== undefined) return fallo(`Enlace inválido: ${enlaceId}.${campo}.portId`);
  return ok(value.portId ? { ...extremo, portId: value.portId } : extremo);
}

export function validarMultiplicidadOpcional(
  enlaceId: Id,
  campo: "multiplicidadOrigen" | "multiplicidadDestino",
  value: unknown,
): Resultado<string | undefined> {
  if (value === undefined) return ok(undefined);
  if (typeof value !== "string" || !validarMultiplicidad(value)) return fallo(`Enlace inválido: ${enlaceId}.${campo}`);
  return ok(value);
}

export function validarDerivacionEnlace(enlaceId: Id, value: unknown): Resultado<DerivacionEnlace | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value)) return fallo(`Enlace inválido: ${enlaceId}.derivado`);
  if (value.tipo !== "enlace-externo-refinamiento") return fallo(`Enlace inválido: ${enlaceId}.derivado.tipo`);
  if (typeof value.refinamientoId !== "string") return fallo(`Enlace inválido: ${enlaceId}.derivado.refinamientoId`);
  if (typeof value.enlacePadreId !== "string") return fallo(`Enlace inválido: ${enlaceId}.derivado.enlacePadreId`);
  if (value.origen !== undefined && value.origen !== "automatico" && value.origen !== "manual") {
    return fallo(`Enlace inválido: ${enlaceId}.derivado.origen`);
  }
  return ok({
    tipo: "enlace-externo-refinamiento",
    refinamientoId: value.refinamientoId,
    enlacePadreId: value.enlacePadreId,
    origen: value.origen ?? "automatico",
  });
}

export function validarAbanicos(
  value: unknown,
  opds: Record<Id, Opd>,
  enlaces: Record<Id, Enlace>,
  entidades: Record<Id, Entidad>,
  estados: Record<Id, Estado>,
): Resultado<Record<Id, Abanico>> {
  if (value === undefined) return ok({});
  if (!esRecord(value)) return fallo("Modelo inválido: abanicos");

  const abanicos: Record<Id, Abanico> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw)) return fallo(`Abanico inválido: ${id}`);
    if (raw.id !== id) return fallo(`Abanico inválido: ${id}.id`);
    if (typeof raw.opdId !== "string" || !opds[raw.opdId]) return fallo(`Abanico inválido: ${id}.opdId`);
    const puertoComunDeclarado = validarPuertoComunAbanico(id, raw.puertoComun, raw.puertoEntidadId, entidades);
    if (!puertoComunDeclarado.ok) return puertoComunDeclarado;
    if (!esOperadorAbanico(raw.operador)) return fallo(`Abanico inválido: ${id}.operador`);
    if (!Array.isArray(raw.enlaceIds)) return fallo(`Abanico inválido: ${id}.enlaceIds`);
    const enlaceIds = raw.enlaceIds.filter((enlaceId): enlaceId is Id => typeof enlaceId === "string");
    if (enlaceIds.length !== raw.enlaceIds.length) return fallo(`Abanico inválido: ${id}.enlaceIds`);
    if (new Set(enlaceIds).size !== enlaceIds.length) return fallo(`Abanico inválido: ${id}.enlaceIds`);
    if (enlaceIds.length < 2) return fallo(`Abanico inválido: ${id}.min`);

    const miembros: Enlace[] = [];
    for (const enlaceId of enlaceIds) {
      const enlace = enlaces[enlaceId];
      if (!enlace) return fallo(`Abanico inválido: ${id}.enlaceIds`);
      if (!Object.values(opds[raw.opdId]?.enlaces ?? {}).some((apariencia) => apariencia.enlaceId === enlaceId)) {
        return fallo(`Abanico inválido: ${id}.opdId`);
      }
      miembros.push(enlace);
    }
    const modeloParcial: Modelo = {
      ...modeloParaExtremos(entidades, estados),
      opds,
      enlaces,
      abanicos,
    };
    const canonico = validarAbanicoCanonico(modeloParcial, raw.opdId, enlaceIds, raw.operador, puertoComunDeclarado.value, id);
    if (!canonico.ok) {
      return fallo(`Abanico inválido: ${id}.puertoEntidadId`);
    }
    const decision = validarDecisionPolicy(id, raw.decision);
    if (!decision.ok) return decision;
    abanicos[id] = {
      id,
      opdId: raw.opdId,
      puertoComun: {
        entidadId: canonico.value.entidadId,
        lado: canonico.value.lado,
        portId: canonico.value.portId,
      },
      puertoEntidadId: canonico.value.entidadId,
      operador: raw.operador,
      enlaceIds,
      ...(decision.value ? { decision: decision.value } : {}),
    };
  }

  return ok(abanicos);
}

function validarDecisionPolicy(abanicoId: Id, value: unknown): Resultado<DecisionPolicy | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value)) return fallo(`Abanico inválido: ${abanicoId}.decision`);
  if (value.modo === "estado-fijo") {
    if (typeof value.estadoId !== "string") return fallo(`Abanico inválido: ${abanicoId}.decision.estadoId`);
    return ok({ modo: "estado-fijo", estadoId: value.estadoId });
  }
  if (value.modo === "uniforme") {
    if (typeof value.objetoId !== "string") return fallo(`Abanico inválido: ${abanicoId}.decision.objetoId`);
    return ok({ modo: "uniforme", objetoId: value.objetoId });
  }
  if (value.modo === "probabilidades") {
    if (!esRecord(value.pesos)) return fallo(`Abanico inválido: ${abanicoId}.decision.pesos`);
    const pesos: Record<Id, number> = {};
    for (const [id, peso] of Object.entries(value.pesos)) {
      if (typeof peso !== "number" || !Number.isFinite(peso) || peso < 0 || peso > 1) {
        return fallo(`Abanico inválido: ${abanicoId}.decision.pesos`);
      }
      pesos[id] = peso;
    }
    return ok({ modo: "probabilidades", pesos });
  }
  if (value.modo === "funcion") {
    if (typeof value.funcionId !== "string") return fallo(`Abanico inválido: ${abanicoId}.decision.funcionId`);
    if (value.fallback !== undefined && value.fallback !== "uniforme" && value.fallback !== "probabilidades") {
      return fallo(`Abanico inválido: ${abanicoId}.decision.fallback`);
    }
    return ok({ modo: "funcion", funcionId: value.funcionId, ...(value.fallback ? { fallback: value.fallback } : {}) });
  }
  return fallo(`Abanico inválido: ${abanicoId}.decision.modo`);
}

function validarPuertoComunAbanico(
  abanicoId: Id,
  value: unknown,
  puertoEntidadId: unknown,
  entidades: Record<Id, Entidad>,
): Resultado<PuertoAbanicoExacto | Id> {
  if (value === undefined) {
    if (typeof puertoEntidadId !== "string" || !entidades[puertoEntidadId]) {
      return fallo(`Abanico inválido: ${abanicoId}.puertoEntidadId`);
    }
    return ok(puertoEntidadId);
  }
  if (!esRecord(value)) return fallo(`Abanico inválido: ${abanicoId}.puertoComun`);
  if (typeof value.entidadId !== "string" || !entidades[value.entidadId]) {
    return fallo(`Abanico inválido: ${abanicoId}.puertoComun.entidadId`);
  }
  if (value.lado !== "origen" && value.lado !== "destino") {
    return fallo(`Abanico inválido: ${abanicoId}.puertoComun.lado`);
  }
  if (typeof value.portId !== "string" || value.portId.trim() === "") {
    return fallo(`Abanico inválido: ${abanicoId}.puertoComun.portId`);
  }
  if (puertoEntidadId !== undefined && puertoEntidadId !== value.entidadId) {
    return fallo(`Abanico inválido: ${abanicoId}.puertoEntidadId`);
  }
  return ok({ entidadId: value.entidadId, lado: value.lado, portId: value.portId });
}
