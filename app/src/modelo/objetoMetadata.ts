import { imagenConCache, imagenIncluyeBitmap, validarModoImagen, validarUrlImagen } from "./imagenObjeto";
import { estadosDeEntidad } from "./operaciones";
import type { Entidad, Id, ImagenEntidad, Modelo, ModoImagenEntidad, Resultado, TipoUrlObjeto, UrlObjetoTipada } from "./tipos";

export interface NombreCompuesto {
  nombre: string;
  unidad?: string;
  alias?: string;
}

export const TIPOS_URL_OBJETO: readonly TipoUrlObjeto[] = ["imagen", "video", "articulo", "texto", "oslc"] as const;

const PALABRAS_RESERVADAS_ALIAS = new Set([
  "do", "if", "in", "for", "let", "new", "try", "var", "case", "else", "enum", "eval",
  "false", "null", "this", "true", "void", "with", "break", "catch", "class", "const",
  "super", "throw", "while", "yield", "delete", "export", "import", "public", "return",
  "static", "switch", "typeof", "default", "extends", "finally", "package", "private",
  "continue", "debugger", "function", "arguments", "interface", "protected", "implements",
  "instanceof",
]);

export function editarAlias(modelo: Modelo, entidadId: Id, alias: string): Resultado<Modelo> {
  const validado = validarAlias(alias);
  if (!validado.ok) return validado;
  return actualizarEntidad(modelo, entidadId, (entidad) => alias.trim()
    ? { ...entidad, alias: alias.trim() }
    : sinCampo(entidad, "alias"));
}

export function editarUnidad(modelo: Modelo, entidadId: Id, unidad: string): Resultado<Modelo> {
  const validado = validarUnidad(unidad);
  if (!validado.ok) return validado;
  return actualizarEntidad(modelo, entidadId, (entidad) => unidad.trim()
    ? { ...entidad, unidad: unidad.trim() }
    : sinCampo(entidad, "unidad"));
}

export function editarDescripcion(modelo: Modelo, entidadId: Id, descripcion: string): Resultado<Modelo> {
  if (descripcion.length > 5_000) return fallo("La descripción no puede superar 5000 caracteres");
  return actualizarEntidad(modelo, entidadId, (entidad) => descripcion.trim()
    ? { ...entidad, descripcion }
    : sinCampo(entidad, "descripcion"));
}

export function agregarUrl(modelo: Modelo, entidadId: Id, url: UrlObjetoTipada): Resultado<Modelo> {
  const validado = validarUrlObjeto(url);
  if (!validado.ok) return validado;
  return actualizarEntidad(modelo, entidadId, (entidad) => ({
    ...entidad,
    urls: [...(entidad.urls ?? []).filter((item) => item.id !== url.id), { ...url, url: url.url.trim() }],
  }));
}

export function eliminarUrl(modelo: Modelo, entidadId: Id, urlId: Id): Resultado<Modelo> {
  return actualizarEntidad(modelo, entidadId, (entidad) => {
    const urls = (entidad.urls ?? []).filter((item) => item.id !== urlId);
    return urls.length > 0 ? { ...entidad, urls } : sinCampo(entidad, "urls");
  });
}

export function reordenarUrls(modelo: Modelo, entidadId: Id, idsOrdenados: Id[]): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  const urls = entidad.urls ?? [];
  if (urls.length !== idsOrdenados.length) return fallo("El orden debe contener todas las URLs");
  const actuales = new Set(urls.map((url) => url.id));
  if (idsOrdenados.some((id) => !actuales.has(id)) || new Set(idsOrdenados).size !== idsOrdenados.length) {
    return fallo("El orden de URLs no coincide con las URLs existentes");
  }
  const porId = new Map(urls.map((url) => [url.id, url]));
  return actualizarEntidad(modelo, entidadId, (actual) => ({
    ...actual,
    urls: idsOrdenados.map((id) => porId.get(id)!),
  }));
}

export function editarImagen(modelo: Modelo, entidadId: Id, imagen: ImagenEntidad): Resultado<Modelo> {
  const validado = validarImagenEntidad(imagen);
  if (!validado.ok) return validado;
  return actualizarEntidad(modelo, entidadId, (entidad) => {
    if (entidad.tipo !== "objeto") return entidad;
    const modo = modoImagenSeguroParaEstados(modelo, entidadId, validado.value.modo);
    return { ...entidad, imagen: imagenConCache({ ...validado.value, modo }) };
  });
}

export function quitarImagen(modelo: Modelo, entidadId: Id): Resultado<Modelo> {
  return actualizarEntidad(modelo, entidadId, (entidad) => sinCampo(entidad, "imagen"));
}

export function cambiarModoImagen(modelo: Modelo, entidadId: Id, modo: ModoImagenEntidad): Resultado<Modelo> {
  if (!validarModoImagen(modo)) return fallo("Modo de imagen inválido");
  return actualizarEntidad(modelo, entidadId, (entidad) => {
    if (!entidad.imagen) return entidad;
    const modoSeguro = modoImagenSeguroParaEstados(modelo, entidadId, modo);
    return { ...entidad, imagen: imagenConCache({ ...entidad.imagen, modo: modoSeguro }) };
  });
}

export function parsearNombreCompuesto(input: string): NombreCompuesto {
  const limpio = input.trim();
  const match = /^(?<nombre>.*?)(?:\s+\[(?<unidad>[^\]\r\n]+)\])?(?:\s+\{(?<alias>[^}\s._]+)\})?$/.exec(limpio);
  if (!match?.groups) return { nombre: limpio };
  return {
    nombre: (match.groups.nombre ?? "").trim(),
    ...(match.groups.unidad ? { unidad: match.groups.unidad.trim() } : {}),
    ...(match.groups.alias ? { alias: match.groups.alias.trim() } : {}),
  };
}

export function formatearNombreCompuesto(parts: NombreCompuesto, opciones: { aliasVisible?: boolean } = {}): string {
  const nombre = parts.nombre.trim();
  const unidad = parts.unidad?.trim();
  const alias = opciones.aliasVisible === false ? "" : parts.alias?.trim();
  return `${nombre}${unidad ? ` [${unidad}]` : ""}${alias ? ` {${alias}}` : ""}`;
}

export function validarAlias(alias: string): Resultado<void> {
  const limpio = alias.trim();
  if (!limpio) return ok(undefined);
  if (/\s/.test(limpio)) return fallo("El alias no puede contener espacios");
  if (limpio.includes("_") || limpio.includes(".")) return fallo("El alias no puede contener '_' ni '.'");
  if (PALABRAS_RESERVADAS_ALIAS.has(limpio)) return fallo("El alias no puede usar una palabra reservada");
  return ok(undefined);
}

export function validarUnidad(unidad: string): Resultado<void> {
  const limpio = unidad.trim();
  if (!limpio) return ok(undefined);
  if (limpio.length > 20) return fallo("La unidad no puede superar 20 caracteres");
  if (/[\r\n]/.test(limpio)) return fallo("La unidad no puede contener saltos de línea");
  return ok(undefined);
}

export function validarUrl(url: string): Resultado<void> {
  const limpio = url.trim();
  if (!limpio) return fallo("La URL no puede estar vacía");
  if (!/^(https?|data|file):/i.test(limpio)) return fallo("La URL debe ser absoluta http, https, data o file");
  return ok(undefined);
}

export function validarTipoUrlObjeto(tipo: unknown): tipo is TipoUrlObjeto {
  return typeof tipo === "string" && (TIPOS_URL_OBJETO as readonly string[]).includes(tipo);
}

export function validarUrlObjeto(url: UrlObjetoTipada): Resultado<void> {
  if (!url.id.trim()) return fallo("La URL requiere id");
  if (!validarTipoUrlObjeto(url.tipo)) return fallo("Tipo de URL inválido");
  return validarUrl(url.url);
}

export function validarImagenEntidad(imagen: ImagenEntidad): Resultado<ImagenEntidad> {
  const url = validarUrlImagen(imagen.url);
  if (!url.ok) return url;
  if (!validarModoImagen(imagen.modo)) return fallo("Modo de imagen inválido");
  return ok({
    url: url.value,
    modo: imagen.modo,
    ...(imagen.cache?.estado === "ok" || imagen.cache?.estado === "fallido"
      ? { cache: { ts: Number.isFinite(imagen.cache.ts) ? Math.max(0, Math.round(imagen.cache.ts)) : 0, estado: imagen.cache.estado } }
      : {}),
  });
}

function modoImagenSeguroParaEstados(modelo: Modelo, entidadId: Id, modo: ModoImagenEntidad): ModoImagenEntidad {
  const tieneEstadosVisibles = estadosDeEntidad(modelo, entidadId).some((estado) => !estado.suprimido);
  return tieneEstadosVisibles && imagenIncluyeBitmap(modo) ? "texto" : modo;
}

function actualizarEntidad(modelo: Modelo, entidadId: Id, fn: (entidad: Entidad) => Entidad): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  return ok({
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [entidadId]: fn(entidad),
    },
  });
}

function sinCampo<K extends keyof Entidad>(entidad: Entidad, campo: K): Entidad {
  const copia = { ...entidad };
  delete copia[campo];
  return copia;
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
