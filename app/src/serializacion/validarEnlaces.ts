import { naturalezaDeEnlace } from "../modelo/constantes";
import { entidadDeExtremo, entidadIdDeExtremo, extremoEntidad, normalizarExtremo } from "../modelo/extremos";
import { esColorEstilo } from "../modelo/estilos";
import { esModificador, esSubtipoModificador, validarMetadatosEnlace } from "../modelo/modificadores";
import { validarFirmaEnlace, validarMultiplicidad } from "../modelo/operaciones";
import { rutaEtiquetaNormalizada } from "../modelo/rutas";
import type {
  Abanico,
  DerivacionEnlace,
  Enlace,
  Entidad,
  Estado,
  ExtremoEnlace,
  Id,
  Opd,
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
    const grupoEstructuralId = validarGrupoEstructuralIdOpcional(id, raw.grupoEstructuralId);
    if (!grupoEstructuralId.ok) return grupoEstructuralId;
    if (grupoEstructuralId.value && naturalezaDeEnlace(raw.tipo) !== "estructural") {
      return fallo(`Enlace inválido: ${id}.grupoEstructuralId`);
    }
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
      ...(grupoEstructuralId.value ? { grupoEstructuralId: grupoEstructuralId.value } : {}),
      ...(derivado.value ? { derivado: derivado.value } : {}),
    };
    const metadatos = validarMetadatosEnlace(enlace);
    if (!metadatos.ok) return fallo(`Enlace inválido: ${id}.metadatos`);
    enlaces[id] = enlace;
  }
  return ok(enlaces);
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
  const extremo = normalizarExtremo({ kind: value.kind, id: value.id });
  if (extremo.kind === "entidad" && !entidades[extremo.id]) return fallo(`Enlace inválido: ${enlaceId}.${campo}.id`);
  if (extremo.kind === "estado" && !estados[extremo.id]) return fallo(`Enlace inválido: ${enlaceId}.${campo}.id`);
  return ok(extremo);
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
    if (typeof raw.puertoEntidadId !== "string" || !entidades[raw.puertoEntidadId]) {
      return fallo(`Abanico inválido: ${id}.puertoEntidadId`);
    }
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
    const tipo = miembros[0]?.tipo;
    if (!tipo || miembros.some((enlace) => enlace.tipo !== tipo)) return fallo(`Abanico inválido: ${id}.tipo`);
    const modeloParcial = modeloParaExtremos(entidades, estados);
    if (!miembros.every((enlace) => (
      entidadIdDeExtremo(modeloParcial, enlace.origenId) === raw.puertoEntidadId ||
      entidadIdDeExtremo(modeloParcial, enlace.destinoId) === raw.puertoEntidadId
    ))) {
      return fallo(`Abanico inválido: ${id}.puertoEntidadId`);
    }
    abanicos[id] = {
      id,
      opdId: raw.opdId,
      puertoEntidadId: raw.puertoEntidadId,
      operador: raw.operador,
      enlaceIds,
    };
  }

  return ok(abanicos);
}
