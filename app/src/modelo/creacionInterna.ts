import { CANON } from "./constantes";
import { contenedorRefinamiento } from "./layout";
import { crearObjeto, crearProceso } from "./operaciones";
import type { Afiliacion, Apariencia, Id, Modelo, Posicion, Resultado, TipoEntidad } from "./tipos";

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
  opciones: { afiliacion?: Afiliacion } = {},
): Resultado<CosaCreadaEnPosicion> {
  const contorno = contenedorRefinamiento(modelo, opdId);
  const operacion = tipo === "objeto" ? crearObjeto : crearProceso;
  const resultado = operacion(modelo, opdId, posicion);
  if (!resultado.ok) return resultado;

  const entidadId = entidadNueva(modelo, resultado.value);
  if (!entidadId) return fallo("No se pudo identificar la cosa creada");
  const apariencia = aparienciaDeEntidad(resultado.value, opdId, entidadId);
  if (!apariencia) return fallo("No se pudo identificar la apariencia creada");
  const interna = contorno ? posicionDentroDeContorno(posicion, contorno) : false;
  const modeloAjustado = contorno && interna
    ? ajustarCreacionInterna(resultado.value, opdId, apariencia, contorno, afiliacionInterna(modelo, contorno, opciones.afiliacion))
    : resultado.value;

  return ok({
    modelo: modeloAjustado,
    entidadId,
    aparienciaId: apariencia.id,
    interna,
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

function posicionDentroDeContorno(
  posicion: Posicion,
  contorno: { x: number; y: number; width: number; height: number },
): boolean {
  return (
    posicion.x >= contorno.x &&
    posicion.y >= contorno.y &&
    posicion.x <= contorno.x + contorno.width &&
    posicion.y <= contorno.y + contorno.height
  );
}

function ajustarCreacionInterna(
  modelo: Modelo,
  opdId: Id,
  apariencia: Apariencia,
  contorno: { x: number; y: number; width: number; height: number },
  afiliacion: Afiliacion | undefined,
): Modelo {
  const clampX = Math.max(contorno.x + 4, Math.min(contorno.x + contorno.width - apariencia.width - 4, apariencia.x));
  const clampY = Math.max(contorno.y + 28, Math.min(contorno.y + contorno.height - apariencia.height - 8, apariencia.y));
  return {
    ...modelo,
    entidades: afiliacion
      ? {
          ...modelo.entidades,
          [apariencia.entidadId]: {
            ...modelo.entidades[apariencia.entidadId]!,
            afiliacion,
          },
        }
      : modelo.entidades,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...modelo.opds[opdId]!,
        apariencias: {
          ...modelo.opds[opdId]!.apariencias,
          [apariencia.id]: {
            ...apariencia,
            x: clampX,
            y: clampY,
          },
        },
      },
    },
  };
}

function afiliacionInterna(modelo: Modelo, contorno: { entidadId: Id }, solicitada: Afiliacion | undefined): Afiliacion | undefined {
  if (solicitada) return solicitada;
  const refinable = modelo.entidades[contorno.entidadId];
  return refinable?.afiliacion === "ambiental" ? "ambiental" : undefined;
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
