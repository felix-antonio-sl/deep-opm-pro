import type { Id, Modelo, TipoEntidad } from "../tipos";
import { entidadPorNombreCanonico } from "./entidad";

/**
 * Resultado de detectar una colisión de nombre canónico en el modelo.
 *
 * `mismoTipo` indica si la entidad existente tiene el mismo TipoEntidad que
 * el solicitado — útil para proponer reuso (mismoTipo=true) vs. informar
 * conflicto de heterogeneidad (mismoTipo=false).
 *
 * `ubicaciones` lista todas las apariciones visuales (OPD × apariencia) de la
 * entidad existente, para que la capa de UI pueda ofrecer navegación o
 * diagnóstico contextual.
 */
export interface ColisionNombre {
  nombre: string;
  entidadExistenteId: Id;
  mismoTipo: boolean;
  ubicaciones: Array<{ opdId: Id; aparienciaId: Id }>;
}

/**
 * Helper puro de detección: dado un nombre y un tipo solicitado, retorna la
 * descripción completa de la colisión si existe una entidad con ese nombre
 * canónico, o `null` si el nombre está disponible.
 *
 * No toca `crearEntidad` ni ningún otro operador de mutación — su único
 * propósito es informar. La decisión de reuso/rechazo/renombrado queda en
 * manos de la capa de UI/acciones (unidades B siguientes).
 *
 * @param modelo      Modelo OPM actual (inmutable).
 * @param nombre      Nombre canónico a verificar.
 * @param tipoSolicitado Tipo OPM que se intenta crear ("objeto" | "proceso").
 * @param excluirEntidadId  Id de la entidad que se está editando (self-edit):
 *                          se excluye para que renombrar a sí misma no colisione.
 */
export function detectarColisionNombre(
  modelo: Modelo,
  nombre: string,
  tipoSolicitado: TipoEntidad,
  excluirEntidadId?: Id,
): ColisionNombre | null {
  const existente = entidadPorNombreCanonico(modelo, nombre, excluirEntidadId);
  if (!existente) return null;

  const ubicaciones: Array<{ opdId: Id; aparienciaId: Id }> = [];
  for (const opd of Object.values(modelo.opds)) {
    for (const ap of Object.values(opd.apariencias)) {
      if (ap.entidadId === existente.id) {
        ubicaciones.push({ opdId: opd.id, aparienciaId: ap.id });
      }
    }
  }

  return {
    nombre,
    entidadExistenteId: existente.id,
    mismoTipo: existente.tipo === tipoSolicitado,
    ubicaciones,
  };
}
