import type { Enlace, Id, Modelo, PosicionLabelEnlace, Resultado } from "./tipos";

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

export function normalizarPosicionLabelEnlace(posicion: PosicionLabelEnlace): PosicionLabelEnlace | null {
  if (!Number.isFinite(posicion.distance)) return null;
  const normalizada: PosicionLabelEnlace = {
    distance: redondearLabel(posicion.distance),
  };
  if (typeof posicion.offset === "number") {
    if (!Number.isFinite(posicion.offset)) return null;
    normalizada.offset = redondearLabel(posicion.offset);
  } else if (posicion.offset) {
    if (!Number.isFinite(posicion.offset.x) || !Number.isFinite(posicion.offset.y)) return null;
    normalizada.offset = {
      x: redondearLabel(posicion.offset.x),
      y: redondearLabel(posicion.offset.y),
    };
  }
  if (posicion.angle !== undefined) {
    if (!Number.isFinite(posicion.angle)) return null;
    normalizada.angle = redondearLabel(posicion.angle);
  }
  return normalizada;
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

function redondearLabel(valor: number): number {
  return Math.round(valor * 1000) / 1000;
}
