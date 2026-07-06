import {
  construirModeloPersistido,
  type GuardarModeloInput,
  type ModeloPersistido,
  type ResumenModeloPersistido,
} from "../persistencia/modelos";

/**
 * Lógica pura (sin red, sin DOM) del body de ACTUALIZACIÓN de `mesa push`
 * sobre un modelo EXISTENTE.
 *
 * El servidor (`save()` en scripts/model-persistence-api.ts) hace
 * `INSERT ... ON CONFLICT DO UPDATE SET <todas las columnas>` desde el body
 * que se le envía — NO hace merge con lo ya persistido. Si el body trae solo
 * `id/nombre/json/creadoEn/actualizadoEn/revision` (como hacía el CLI antes
 * de este fix), el UPDATE pisa con vacío/defecto `descripcion`, `carpetaId`,
 * `ultimaApertura`, `archivado*`, `versiones` y `crearVersionAlGuardar` — un
 * push silencioso mueve el modelo fuera de su carpeta, vacía su descripción,
 * lo des-archiva y borra su historial de versiones nombradas.
 *
 * `construirModeloPersistido` ya resuelve exactamente este merge
 * (`input.X ?? existente?.X` campo a campo) y es la fuente única de verdad
 * usada por el store del propio producto (`src/store/persistencia.ts`) al
 * guardar un modelo existente. Este helper solo lo aplica al caso `mesa push`:
 * los campos NUEVOS que trae el bundle candidato (id/nombre/json/revision)
 * más el registro existente fetchado del servidor como `existente`.
 */
export function construirBodyActualizacion(
  nuevo: Pick<GuardarModeloInput, "id" | "nombre" | "json" | "revision">,
  existente: ResumenModeloPersistido,
  ahora = new Date().toISOString(),
): ModeloPersistido {
  return construirModeloPersistido(nuevo, existente, ahora);
}
