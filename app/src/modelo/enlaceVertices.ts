import { entidadDeExtremo, mismoExtremo } from "./extremos";
import { apuntarExtremoEnlace } from "./operaciones";
import type { AparienciaEnlace, ExtremoEnlace, Id, Modelo, Opd, Posicion, Resultado } from "./tipos";

/**
 * Inserta un vértice en una apariencia de enlace en la posición dada.
 * La posición debe estar entre dos vértices existentes (o entre extremos).
 * Los vértices se ordenan automáticamente.
 */
export function insertarVerticeApariencia(
  modelo: Modelo,
  aparienciaEnlaceId: Id,
  posicion: Posicion,
): Resultado<Modelo> {
  const localizado = localizarAparienciaEnlace(modelo, aparienciaEnlaceId);
  if (!localizado) return fallo(`Apariencia de enlace no existe: ${aparienciaEnlaceId}`);

  const { opd, apariencia } = localizado;
  const vertices = [...apariencia.vertices, posicion];
  return ok(actualizarApariencia(modelo, opd, aparienciaEnlaceId, vertices));
}

/**
 * Reposiciona un vértice existente de una apariencia de enlace.
 */
export function reposicionarVerticeApariencia(
  modelo: Modelo,
  aparienciaEnlaceId: Id,
  indice: number,
  posicion: Posicion,
): Resultado<Modelo> {
  const localizado = localizarAparienciaEnlace(modelo, aparienciaEnlaceId);
  if (!localizado) return fallo(`Apariencia de enlace no existe: ${aparienciaEnlaceId}`);

  const { opd, apariencia } = localizado;
  if (indice < 0 || indice >= apariencia.vertices.length) {
    return fallo(`Índice de vértice fuera de rango: ${indice}`);
  }

  const vertices = [...apariencia.vertices];
  vertices[indice] = posicion;
  return ok(actualizarApariencia(modelo, opd, aparienciaEnlaceId, vertices));
}

interface ReanclajeResult {
  modelo: Modelo;
  advertencia?: string;
}

/**
 * Reancla un extremo de enlace a una nueva entidad o estado.
 * El nuevo extremo debe pasar los filtros de firma de enlace (HU-10.008/.010).
 * Si falla, retorna error y el modelo queda intacto.
 */
export function reanclarExtremoEnlace(
  modelo: Modelo,
  enlaceId: Id,
  lado: "origen" | "destino",
  nuevoExtremo: ExtremoEnlace,
): Resultado<ReanclajeResult> {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
  const extremoActual = lado === "origen" ? enlace.origenId : enlace.destinoId;
  if (mismoExtremo(extremoActual, nuevoExtremo)) return ok({ modelo });
  const actualizado = {
    ...enlace,
    ...(lado === "origen" ? { origenId: nuevoExtremo } : { destinoId: nuevoExtremo }),
  };
  if (!entidadDeExtremo(modelo, actualizado.origenId) || !entidadDeExtremo(modelo, actualizado.destinoId)) {
    return fallo("Extremo de enlace sin entidad asociada");
  }
  if (
    actualizado.origenId.kind === actualizado.destinoId.kind &&
    actualizado.origenId.id === actualizado.destinoId.id &&
    actualizado.tipo !== "invocacion"
  ) {
    return fallo("No se permite auto-conexión para este tipo de enlace");
  }

  const advertencia = enlace.derivado?.tipo === "enlace-externo-refinamiento"
    ? "Enlace derivado: el reanclaje manual reemplaza el automático"
    : undefined;
  const resultado = apuntarExtremoEnlace(modelo, enlaceId, lado, nuevoExtremo);
  if (!resultado.ok) return resultado;

  return ok({
    modelo: resultado.value,
    ...(advertencia ? { advertencia } : {}),
  });
}

function localizarAparienciaEnlace(
  modelo: Modelo,
  aparienciaEnlaceId: Id,
): { apariencia: AparienciaEnlace; opd: Opd } | null {
  for (const opdId of Object.keys(modelo.opds)) {
    const opd = modelo.opds[opdId];
    if (!opd) continue;
    const apariencia = opd.enlaces[aparienciaEnlaceId];
    if (apariencia) return { apariencia, opd };
  }
  return null;
}

function actualizarApariencia(
  modelo: Modelo,
  opd: Opd,
  aparienciaEnlaceId: Id,
  vertices: Posicion[],
): Modelo {
  const apariencia = opd.enlaces[aparienciaEnlaceId]!;
  return {
    ...modelo,
    opds: {
      ...modelo.opds,
      [opd.id]: {
        ...opd,
        enlaces: {
          ...opd.enlaces,
          [aparienciaEnlaceId]: {
            id: apariencia.id,
            enlaceId: apariencia.enlaceId,
            opdId: apariencia.opdId,
            vertices,
            ...(apariencia.symbolPos ? { symbolPos: apariencia.symbolPos } : {}),
            ...(apariencia.symbolAnchors ? { symbolAnchors: apariencia.symbolAnchors } : {}),
          } satisfies AparienciaEnlace,
        },
      },
    },
  };
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
