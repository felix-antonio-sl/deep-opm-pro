import { validarModoImagen, validarUrlImagen } from "../modelo/imagenObjeto";
import { validarAlias, validarImagenEntidad, validarTipoUrlObjeto, validarUnidad, validarUrl } from "../modelo/objetoMetadata";
import type {
  Entidad,
  Id,
  ImagenEntidad,
  Resultado,
  UrlObjetoTipada,
} from "../modelo/tipos";
import { fallo, ok, esAfiliacion, esEsencia, esRecord, esTipoEntidad } from "./validarHelpers";
import { validarRefinamiento } from "./validarOpds";

/**
 * Validadores para entidades y campos avanzados de objeto/proceso.
 *
 * Consumidores conocidos: `serializacion/json.ts`. Anclaje: SSOT OPM ISO
 * 19450 §3.39 objeto, §3.58 proceso, §3.7 alias y §3.4 atributo/unidad.
 */

export function validarEntidades(value: Record<string, unknown>): Resultado<Record<Id, Entidad>> {
  const entidades: Record<Id, Entidad> = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!esRecord(raw)) return fallo(`Entidad inválida: ${id}`);
    if (raw.id !== id) return fallo(`Entidad inválida: ${id}.id`);
    if (!esTipoEntidad(raw.tipo)) return fallo(`Entidad inválida: ${id}.tipo`);
    if (typeof raw.nombre !== "string") return fallo(`Entidad inválida: ${id}.nombre`);
    if (!esEsencia(raw.esencia)) return fallo(`Entidad inválida: ${id}.esencia`);
    if (!esAfiliacion(raw.afiliacion)) return fallo(`Entidad inválida: ${id}.afiliacion`);
    const refinamiento = validarRefinamiento(id, raw.refinamiento);
    if (!refinamiento.ok) return refinamiento;
    if (refinamiento.value?.tipo === "descomposicion" && raw.tipo !== "proceso") return fallo(`Refinamiento inválido: ${id}.tipo`);
    if (refinamiento.value?.tipo === "despliegue" && raw.tipo !== "objeto") return fallo(`Refinamiento inválido: ${id}.tipo`);
    const avanzados = camposEntidadAvanzada(id, raw);
    if (!avanzados.ok) return avanzados;
    entidades[id] = {
      id,
      tipo: raw.tipo,
      nombre: raw.nombre,
      esencia: raw.esencia,
      afiliacion: raw.afiliacion,
      ...(refinamiento.value ? { refinamiento: refinamiento.value } : {}),
      ...avanzados.value,
    };
  }
  return ok(entidades);
}

export function camposEntidadAvanzada(entidadId: Id, raw: Record<string, unknown>): Resultado<Partial<Entidad>> {
  const campos: Partial<Entidad> = {};
  if (raw.alias !== undefined) {
    if (typeof raw.alias !== "string") return fallo(`Entidad inválida: ${entidadId}.alias`);
    const validado = validarAlias(raw.alias);
    if (!validado.ok) return fallo(`Entidad inválida: ${entidadId}.alias`);
    if (raw.alias.trim()) campos.alias = raw.alias.trim();
  }
  if (raw.unidad !== undefined) {
    if (typeof raw.unidad !== "string") return fallo(`Entidad inválida: ${entidadId}.unidad`);
    const validado = validarUnidad(raw.unidad);
    if (!validado.ok) return fallo(`Entidad inválida: ${entidadId}.unidad`);
    if (raw.unidad.trim()) campos.unidad = raw.unidad.trim();
  }
  if (typeof raw.descripcion === "string" && raw.descripcion.trim()) campos.descripcion = raw.descripcion;
  if (raw.descripcion !== undefined && typeof raw.descripcion !== "string") return fallo(`Entidad inválida: ${entidadId}.descripcion`);
  if (Array.isArray(raw.urls)) {
    const urls = raw.urls.flatMap((item): UrlObjetoTipada[] => {
      if (!esRecord(item)) return [];
      if (typeof item.id !== "string" || typeof item.url !== "string" || !validarTipoUrlObjeto(item.tipo)) return [];
      if (!validarUrl(item.url).ok) return [];
      return [{ id: item.id, tipo: item.tipo, url: item.url.trim() }];
    });
    const ids = new Set(urls.map((item) => item.id));
    if (urls.length > 0 && ids.size === urls.length) campos.urls = urls;
    if (urls.length !== raw.urls.length || ids.size !== urls.length) return fallo(`Entidad inválida: ${entidadId}.urls`);
  }
  if (raw.urls !== undefined && !Array.isArray(raw.urls)) return fallo(`Entidad inválida: ${entidadId}.urls`);
  if (raw.imagen !== undefined) {
    if (!esRecord(raw.imagen)) return fallo(`Entidad inválida: ${entidadId}.imagen`);
    if (typeof raw.imagen.url !== "string" || !validarModoImagen(raw.imagen.modo)) return fallo(`Entidad inválida: ${entidadId}.imagen`);
    const url = validarUrlImagen(raw.imagen.url);
    if (!url.ok) return fallo(`Entidad inválida: ${entidadId}.imagen`);
    const imagen: ImagenEntidad = { url: url.value, modo: raw.imagen.modo };
    const validada = validarImagenEntidad(imagen);
    if (!validada.ok) return fallo(`Entidad inválida: ${entidadId}.imagen`);
    campos.imagen = validada.value;
  }
  if (raw.layoutEstados === "horizontal" || raw.layoutEstados === "vertical") campos.layoutEstados = raw.layoutEstados;
  if (raw.layoutEstados !== undefined && raw.layoutEstados !== "horizontal" && raw.layoutEstados !== "vertical") return fallo(`Entidad inválida: ${entidadId}.layoutEstados`);
  return ok(campos);
}
