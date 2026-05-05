import { naturalezaDeEnlace } from "./constantes";
import type { Id, Modelo, Resultado } from "./tipos";

export function definirRutaEtiqueta(modelo: Modelo, enlaceId: Id, etiqueta: string | undefined): Resultado<Modelo> {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
  const rutaEtiqueta = rutaEtiquetaNormalizada(etiqueta);
  if (rutaEtiqueta && !enlaceAdmiteRuta(modelo, enlaceId)) {
    return fallo("La ruta requiere un enlace procedural con extremo Estado");
  }
  if (enlace.rutaEtiqueta === rutaEtiqueta) return ok(modelo);
  const siguiente = { ...enlace };
  if (rutaEtiqueta) {
    siguiente.rutaEtiqueta = rutaEtiqueta;
  } else {
    delete siguiente.rutaEtiqueta;
  }
  return ok({
    ...modelo,
    enlaces: {
      ...modelo.enlaces,
      [enlaceId]: siguiente,
    },
  });
}

export function rutaEtiquetaNormalizada(etiqueta: string | undefined): string | undefined {
  const limpia = etiqueta?.trim();
  return limpia ? limpia : undefined;
}

export function enlaceAdmiteRuta(modelo: Modelo, enlaceId: Id): boolean {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace || naturalezaDeEnlace(enlace.tipo) !== "procedural") return false;
  return enlace.origenId.kind === "estado" || enlace.destinoId.kind === "estado";
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
