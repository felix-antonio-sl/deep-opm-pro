import { validarModoImagen, validarUrlImagen } from "../modelo/imagenObjeto";
import { validarAlias, validarImagenEntidad, validarTipoUrlObjeto, validarUnidad, validarUrl } from "../modelo/objetoMetadata";
import { normalizarParametrosSimulacion } from "../modelo/simulacion/parametros";
import type {
  Entidad,
  EstadoSatisfaccionRequisito,
  Id,
  ImagenEntidad,
  RequisitoEntidadMetadata,
  Resultado,
  TipoEnlace,
  TipoValorSlot,
  UrlObjetoTipada,
  ValorSlot,
} from "../modelo/tipos";
import { naturalezaDeEnlace } from "../modelo/constantes";
import { validarValorSlot } from "../modelo/validadores/valorSlot";
import { fallo, ok, esAfiliacion, esEsencia, esRecord, esTipoEntidad } from "./validarHelpers";
import { validarRefinamientos } from "./validarOpds";

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
    const refinamientos = validarRefinamientos(id, raw);
    if (!refinamientos.ok) return refinamientos;
    const avanzados = camposEntidadAvanzada(id, raw);
    if (!avanzados.ok) return avanzados;
    const requisito = validarRequisitoEntidad(id, raw);
    if (!requisito.ok) return requisito;
    entidades[id] = {
      id,
      tipo: raw.tipo,
      nombre: raw.nombre,
      esencia: raw.esencia,
      afiliacion: raw.afiliacion,
      ...(refinamientos.value ? { refinamientos: refinamientos.value } : {}),
      ...(requisito.value ? { estereotipo: "requirement", requisito: requisito.value } : {}),
      ...avanzados.value,
    };
  }
  return ok(entidades);
}

function validarRequisitoEntidad(entidadId: Id, raw: Record<string, unknown>): Resultado<RequisitoEntidadMetadata | undefined> {
  if (raw.estereotipo === undefined && raw.requisito === undefined) return ok(undefined);
  if (raw.estereotipo !== "requirement") return fallo(`Entidad inválida: ${entidadId}.estereotipo`);
  if (!esRecord(raw.requisito)) return fallo(`Entidad inválida: ${entidadId}.requisito`);
  if (typeof raw.requisito.idLogico !== "string" || !raw.requisito.idLogico.trim()) {
    return fallo(`Entidad inválida: ${entidadId}.requisito.idLogico`);
  }
  if (typeof raw.requisito.descripcion !== "string" || !raw.requisito.descripcion.trim()) {
    return fallo(`Entidad inválida: ${entidadId}.requisito.descripcion`);
  }
  if (raw.requisito.dureza !== "hard" && raw.requisito.dureza !== "soft") {
    return fallo(`Entidad inválida: ${entidadId}.requisito.dureza`);
  }
  if (
    raw.requisito.satisfaction !== undefined &&
    raw.requisito.satisfaction !== "pendiente" &&
    raw.requisito.satisfaction !== "satisface" &&
    raw.requisito.satisfaction !== "parcial" &&
    raw.requisito.satisfaction !== "no-satisface"
  ) {
    return fallo(`Entidad inválida: ${entidadId}.requisito.satisfaction`);
  }
  const satisfaction = typeof raw.requisito.satisfaction === "string"
    ? raw.requisito.satisfaction as EstadoSatisfaccionRequisito
    : undefined;
  return ok({
    idLogico: raw.requisito.idLogico.trim(),
    descripcion: raw.requisito.descripcion.trim(),
    dureza: raw.requisito.dureza,
    ...(typeof raw.requisito.actor === "string" && raw.requisito.actor.trim() ? { actor: raw.requisito.actor.trim() } : {}),
    ...(satisfaction ? { satisfaction } : {}),
  });
}

export function camposEntidadAvanzada(entidadId: Id, raw: Record<string, unknown>): Resultado<Partial<Entidad>> {
  const campos: Partial<Entidad> = {};
  if (raw.esAtributo !== undefined) {
    if (raw.esAtributo !== true) return fallo(`Entidad inválida: ${entidadId}.esAtributo`);
    campos.esAtributo = true;
  }
  if (raw.valorSlot !== undefined) {
    const valorSlot = validarValorSlotSerializado(entidadId, raw.valorSlot);
    if (!valorSlot.ok) return valorSlot;
    campos.valorSlot = valorSlot.value;
    if (campos.valorSlot) campos.esAtributo = true;
  }
  if (raw.simulacion !== undefined) {
    if (!campos.valorSlot) return fallo(`Entidad inválida: ${entidadId}.simulacion requiere valorSlot`);
    const simulacion = normalizarParametrosSimulacion(raw.simulacion, campos.valorSlot.tipo);
    if (!simulacion.ok) return fallo(`Entidad inválida: ${entidadId}.simulacion: ${simulacion.error}`);
    campos.simulacion = simulacion.value;
  }
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
  if (raw.orderedFundamentalTypes !== undefined) {
    const ordered = validarOrderedFundamentalTypes(entidadId, raw.orderedFundamentalTypes);
    if (!ordered.ok) return ordered;
    if (ordered.value.length > 0) campos.orderedFundamentalTypes = ordered.value;
  }
  if (raw.lineal !== undefined) {
    if (typeof raw.lineal !== "boolean") return fallo(`Entidad inválida: ${entidadId}.lineal`);
    if (raw.lineal) campos.lineal = true;
  }
  return ok(campos);
}

function validarOrderedFundamentalTypes(entidadId: Id, value: unknown): Resultado<TipoEnlace[]> {
  if (!Array.isArray(value)) return fallo(`Entidad inválida: ${entidadId}.orderedFundamentalTypes`);
  const tipos: TipoEnlace[] = [];
  for (const item of value) {
    if (
      item !== "agregacion" &&
      item !== "exhibicion" &&
      item !== "generalizacion" &&
      item !== "clasificacion"
    ) {
      return fallo(`Entidad inválida: ${entidadId}.orderedFundamentalTypes`);
    }
    if (naturalezaDeEnlace(item) !== "estructural") return fallo(`Entidad inválida: ${entidadId}.orderedFundamentalTypes`);
    if (!tipos.includes(item)) tipos.push(item);
  }
  return ok(tipos);
}

function validarValorSlotSerializado(entidadId: Id, value: unknown): Resultado<ValorSlot> {
  if (!esRecord(value)) return fallo(`Entidad inválida: ${entidadId}.valorSlot`);
  if (!esTipoValorSlot(value.tipo) || value.placeholder !== "value") {
    return fallo(`Entidad inválida: ${entidadId}.valorSlot`);
  }
  const slot: ValorSlot = { tipo: value.tipo, placeholder: "value" };
  if (value.valor !== undefined) {
    if (typeof value.valor !== "number" && typeof value.valor !== "string") {
      return fallo(`Entidad inválida: ${entidadId}.valorSlot.valor`);
    }
    const validado = validarValorSlot(value.tipo, value.valor);
    if (!validado.ok) return fallo(`Entidad inválida: ${entidadId}.valorSlot.valor`);
    slot.valor = validado.value;
  }
  return ok(slot);
}

function esTipoValorSlot(value: unknown): value is TipoValorSlot {
  return value === "integer" || value === "float" || value === "char" || value === "string";
}
