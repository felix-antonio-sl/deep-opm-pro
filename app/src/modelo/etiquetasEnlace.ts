import type { Enlace, Id, Modelo, Resultado } from "./tipos";

export function renombrarEtiquetaEnlace(modelo: Modelo, enlaceId: Id, etiqueta: string): Resultado<Modelo> {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
  const normalizada = etiquetaEnlaceNormalizada(etiqueta);
  const validacion = validarEtiquetaEnlace(enlace, normalizada);
  if (!validacion.ok) return validacion;
  if (enlace.etiqueta === normalizada) return ok(modelo);
  return ok({
    ...modelo,
    enlaces: {
      ...modelo.enlaces,
      [enlaceId]: {
        ...enlace,
        etiqueta: normalizada,
      },
    },
  });
}

export function etiquetaEnlaceNormalizada(etiqueta: string | undefined): string {
  return etiqueta?.trim() ?? "";
}

export function validarEtiquetaEnlace(enlace: Enlace, etiqueta: string): Resultado<true> {
  if (enlaceRequiereEtiqueta(enlace) && etiqueta.length === 0) {
    return fallo("La etiqueta no puede estar vacía");
  }
  return ok(true);
}

export function enlaceRequiereEtiqueta(enlace: Enlace): boolean {
  void enlace;
  return false;
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
