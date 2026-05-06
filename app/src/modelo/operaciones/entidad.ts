import type { Afiliacion, Esencia, Id, Modelo, Resultado } from "../tipos";
import { fallo, ok } from "./helpers";

/**
 * Operaciones de edición de entidad: renombrar, cambiar esencia, cambiar afiliación.
 * Funciones puras sobre Modelo. La validación de nombre vacío vive aquí; metadata
 * extendida (alias, unidad, descripción, URLs) tiene su propio módulo
 * `modelo/objetoMetadata.ts` (no es parte de operaciones).
 *
 * Refs: SSOT opm-iso-19450-es.md §3.55 / §3.69 (esencia/afiliación).
 */

export function renombrarEntidad(modelo: Modelo, entidadId: Id, nombre: string): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  const limpio = nombre.trim();
  if (limpio.length === 0) return fallo("El nombre no puede estar vacío");
  return ok({
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [entidadId]: { ...entidad, nombre: limpio },
    },
  });
}

export function cambiarEsencia(modelo: Modelo, entidadId: Id, esencia: Esencia): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  return ok({
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [entidadId]: { ...entidad, esencia },
    },
  });
}

export function cambiarAfiliacion(modelo: Modelo, entidadId: Id, afiliacion: Afiliacion): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  return ok({
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [entidadId]: { ...entidad, afiliacion },
    },
  });
}
