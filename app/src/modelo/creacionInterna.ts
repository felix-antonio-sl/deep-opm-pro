import { CANON } from "./constantes";
import { contenedorRefinamiento } from "./layout";
import { crearObjeto, crearProceso } from "./operaciones";
import type { Apariencia, Id, Modelo, Posicion, Resultado, TipoEntidad } from "./tipos";

export interface CosaCreadaEnPosicion {
  modelo: Modelo;
  entidadId: Id;
  aparienciaId: Id;
  interna: boolean;
}

export function crearCosaEnPosicion(
  modelo: Modelo,
  opdId: Id,
  tipo: TipoEntidad,
  posicion: Posicion,
): Resultado<CosaCreadaEnPosicion> {
  const contorno = contenedorRefinamiento(modelo, opdId);
  const operacion = tipo === "objeto" ? crearObjeto : crearProceso;
  const resultado = operacion(modelo, opdId, posicion);
  if (!resultado.ok) return resultado;

  const entidadId = entidadNueva(modelo, resultado.value);
  if (!entidadId) return fallo("No se pudo identificar la cosa creada");
  const apariencia = aparienciaDeEntidad(resultado.value, opdId, entidadId);
  if (!apariencia) return fallo("No se pudo identificar la apariencia creada");

  return ok({
    modelo: resultado.value,
    entidadId,
    aparienciaId: apariencia.id,
    interna: contorno ? dentroDeContorno(apariencia, contorno) : false,
  });
}

function entidadNueva(previo: Modelo, siguiente: Modelo): Id | null {
  const previas = new Set(Object.keys(previo.entidades));
  return Object.keys(siguiente.entidades).find((id) => !previas.has(id)) ?? null;
}

function aparienciaDeEntidad(modelo: Modelo, opdId: Id, entidadId: Id): Apariencia | null {
  return Object.values(modelo.opds[opdId]?.apariencias ?? {})
    .find((apariencia) => apariencia.entidadId === entidadId && esCosaCanonica(apariencia)) ?? null;
}

function esCosaCanonica(apariencia: Apariencia): boolean {
  return apariencia.width === CANON.dims.cosaWidth && apariencia.height === CANON.dims.cosaHeight;
}

function dentroDeContorno(
  apariencia: Apariencia,
  contorno: { x: number; y: number; width: number; height: number },
): boolean {
  return (
    apariencia.x >= contorno.x &&
    apariencia.y >= contorno.y &&
    apariencia.x + apariencia.width <= contorno.x + contorno.width &&
    apariencia.y + apariencia.height <= contorno.y + contorno.height
  );
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
