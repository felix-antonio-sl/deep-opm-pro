import type { Id, ImagenEntidad, Modelo, ModoImagenEntidad, Resultado } from "./tipos";

const EXTENSIONES_VALIDAS = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"] as const;
const DATA_IMAGE_PATTERN = /^data:image\/(?:png|jpe?g|gif|webp);base64,[a-z0-9+/]+={0,2}$/i;
const TIMEOUT_MS = 5_000;

const cacheImagenes = new Map<string, NonNullable<ImagenEntidad["cache"]>>();

/**
 * Helpers de imagen de objeto: URL externa, cache de sesión y degradación.
 *
 * La imagen es presentación de un objeto OPM; no altera semántica ni OPL.
 * Refs: SSOT opm-iso-19450-es.md §Objetos; opm-extracted OpmLogicalThing
 * `backgroundImageUrl` + BackgroundImageState, destilado sin pool multi-user.
 */
export function validarUrlImagen(url: string): Resultado<string> {
  const limpio = url.trim();
  if (!limpio) return fallo("La URL de imagen no puede estar vacía");
  if (limpio.startsWith("data:")) {
    return DATA_IMAGE_PATTERN.test(limpio)
      ? ok(limpio)
      : fallo("La imagen local debe ser PNG, JPG, GIF o WebP codificada como data URL");
  }
  if (!URL.canParse(limpio)) return fallo("La URL de imagen debe ser absoluta");
  const parsed = new URL(limpio);
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return fallo("La URL de imagen debe ser pública http o https");
  }
  const pathname = parsed.pathname.toLocaleLowerCase("es");
  if (!EXTENSIONES_VALIDAS.some((extension) => pathname.endsWith(extension))) {
    return fallo("La URL de imagen debe terminar en .png, .jpg, .jpeg, .gif, .svg o .webp");
  }
  return ok(limpio);
}

export function validarModoImagen(modo: unknown): modo is ModoImagenEntidad {
  return modo === "imagen" || modo === "texto" || modo === "imagen-texto";
}

export function imagenIncluyeBitmap(modo: ModoImagenEntidad): boolean {
  return modo === "imagen" || modo === "imagen-texto";
}

export function cacheImagen(url: string): ImagenEntidad["cache"] | undefined {
  return cacheImagenes.get(url);
}

export function registrarCacheImagen(url: string, estado: "ok" | "fallido", ts = Date.now()): NonNullable<ImagenEntidad["cache"]> {
  const cache = { ts, estado };
  cacheImagenes.set(url, cache);
  return cache;
}

export function limpiarCacheImagenes(): void {
  cacheImagenes.clear();
}

export function precargarBitmap(url: string, timeoutMs = TIMEOUT_MS): Promise<HTMLImageElement | null> {
  if (typeof Image === "undefined") return Promise.resolve(null);
  return new Promise((resolve) => {
    const image = new Image();
    let cerrado = false;
    const finalizar = (value: HTMLImageElement | null) => {
      if (cerrado) return;
      cerrado = true;
      globalThis.clearTimeout(timeout);
      resolve(value);
    };
    const timeout = globalThis.setTimeout(() => finalizar(null), timeoutMs);
    image.onload = () => finalizar(image);
    image.onerror = () => finalizar(null);
    image.src = url;
  });
}

export function imagenConCache(imagen: ImagenEntidad): ImagenEntidad {
  const cache = cacheImagen(imagen.url);
  if (!cache) return imagen;
  return cache.estado === "fallido" && imagenIncluyeBitmap(imagen.modo)
    ? { ...imagen, modo: "texto", cache }
    : { ...imagen, cache };
}

export function degradarSiFallido(modelo: Modelo, entidadId: Id): Modelo {
  const entidad = modelo.entidades[entidadId];
  const imagen = entidad?.imagen;
  if (!entidad || !imagen || imagen.cache?.estado !== "fallido" || !imagenIncluyeBitmap(imagen.modo)) return modelo;
  return {
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [entidadId]: { ...entidad, imagen: { ...imagen, modo: "texto" } },
    },
  };
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
