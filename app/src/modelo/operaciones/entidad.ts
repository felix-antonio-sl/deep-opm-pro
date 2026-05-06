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

export function renombrarEntidad(modelo: Modelo, entidadId: Id, nombre: string, opdActivoId?: Id): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  const validado = validarNombreEntidad(modelo, entidadId, nombre, opdActivoId);
  if (!validado.ok) return validado;
  return ok({
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [entidadId]: { ...entidad, nombre: validado.value },
    },
  });
}

/**
 * Valida nombre de entidad: rechaza vacío y rechaza duplicado dentro del OPD
 * activo (HU-SHARED-009). Si `opdActivoId` no se provee, solo valida vacío.
 * Mismo nombre puede repetirse entre OPDs distintos.
 */
export function validarNombreEntidad(
  modelo: Modelo,
  entidadId: Id,
  nombre: string,
  opdActivoId?: Id,
): Resultado<string> {
  const limpio = nombre.trim();
  if (limpio.length === 0) return fallo("El nombre no puede estar vacío");
  if (opdActivoId === undefined) return ok(limpio);
  const opd = modelo.opds[opdActivoId];
  if (!opd) return ok(limpio);
  const aparienciasOpd = Object.values(opd.apariencias);
  for (const apariencia of aparienciasOpd) {
    if (apariencia.entidadId === entidadId) continue;
    const otra = modelo.entidades[apariencia.entidadId];
    if (otra && otra.nombre === limpio) {
      return fallo(`Ya existe '${limpio}' en este OPD`);
    }
  }
  return ok(limpio);
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
