import { enlaceAdmiteTasa, enlaceAdmiteTiempoMaximo, enlaceAdmiteTiempoMinimo, esEnlaceExcepcionTemporal } from "./constantes";
import type { Id, Modelo, Resultado } from "./tipos";

export function definirBackwardTag(modelo: Modelo, enlaceId: Id, tag: string | undefined): Resultado<Modelo> {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
  if (enlace.tipo !== "etiquetadoBidireccional") return fallo("backwardTag solo aplica a enlace etiquetado bidireccional");
  const texto = tag?.trim();
  const actualizado = { ...enlace };
  if (texto) actualizado.backwardTag = texto;
  else delete actualizado.backwardTag;
  return ok(enlace.backwardTag === actualizado.backwardTag ? modelo : {
    ...modelo,
    enlaces: { ...modelo.enlaces, [enlaceId]: actualizado },
  });
}

export function definirRequisitosEnlace(
  modelo: Modelo,
  enlaceId: Id,
  requisitos: string | undefined,
  mostrar: boolean,
): Resultado<Modelo> {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
  const texto = requisitos?.trim();
  const actualizado = { ...enlace };
  if (texto) {
    actualizado.requisitos = texto;
    actualizado.mostrarRequisitos = mostrar;
  } else {
    delete actualizado.requisitos;
    delete actualizado.mostrarRequisitos;
  }
  return ok(enlace.requisitos === actualizado.requisitos && enlace.mostrarRequisitos === actualizado.mostrarRequisitos ? modelo : {
    ...modelo,
    enlaces: { ...modelo.enlaces, [enlaceId]: actualizado },
  });
}

export function definirTasaEnlace(
  modelo: Modelo,
  enlaceId: Id,
  tasa: string | undefined,
  unidadesTasa: string | undefined,
): Resultado<Modelo> {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
  if (!enlaceAdmiteTasa(enlace.tipo)) return fallo("La tasa solo aplica a consumo, resultado o efecto");
  const tasaNormalizada = tasa?.trim();
  const unidadesNormalizadas = unidadesTasa?.trim();
  const actualizado = { ...enlace };
  if (tasaNormalizada) {
    actualizado.tasa = tasaNormalizada;
    if (unidadesNormalizadas) actualizado.unidadesTasa = unidadesNormalizadas;
    else delete actualizado.unidadesTasa;
  } else {
    delete actualizado.tasa;
    delete actualizado.unidadesTasa;
  }
  return ok(enlace.tasa === actualizado.tasa && enlace.unidadesTasa === actualizado.unidadesTasa ? modelo : {
    ...modelo,
    enlaces: { ...modelo.enlaces, [enlaceId]: actualizado },
  });
}

export function definirTiempoExcepcionEnlace(
  modelo: Modelo,
  enlaceId: Id,
  valores: {
    tiempoMinimo?: string | undefined;
    unidadTiempoMinimo?: string | undefined;
    tiempoMaximo?: string | undefined;
    unidadTiempoMaximo?: string | undefined;
  },
): Resultado<Modelo> {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
  if (!esEnlaceExcepcionTemporal(enlace.tipo)) return fallo("El tiempo de excepción solo aplica a enlaces de excepción temporal");

  const minimo = enlaceAdmiteTiempoMinimo(enlace.tipo) ? valores.tiempoMinimo?.trim() : undefined;
  const unidadMinima = minimo ? valores.unidadTiempoMinimo?.trim() : undefined;
  const maximo = enlaceAdmiteTiempoMaximo(enlace.tipo) ? valores.tiempoMaximo?.trim() : undefined;
  const unidadMaxima = maximo ? valores.unidadTiempoMaximo?.trim() : undefined;

  const actualizado = { ...enlace };
  if (minimo) {
    actualizado.tiempoMinimo = minimo;
    if (unidadMinima) actualizado.unidadTiempoMinimo = unidadMinima;
    else delete actualizado.unidadTiempoMinimo;
  } else {
    delete actualizado.tiempoMinimo;
    delete actualizado.unidadTiempoMinimo;
  }
  if (maximo) {
    actualizado.tiempoMaximo = maximo;
    if (unidadMaxima) actualizado.unidadTiempoMaximo = unidadMaxima;
    else delete actualizado.unidadTiempoMaximo;
  } else {
    delete actualizado.tiempoMaximo;
    delete actualizado.unidadTiempoMaximo;
  }

  const sinCambios = enlace.tiempoMinimo === actualizado.tiempoMinimo &&
    enlace.unidadTiempoMinimo === actualizado.unidadTiempoMinimo &&
    enlace.tiempoMaximo === actualizado.tiempoMaximo &&
    enlace.unidadTiempoMaximo === actualizado.unidadTiempoMaximo;
  return ok(sinCambios ? modelo : {
    ...modelo,
    enlaces: { ...modelo.enlaces, [enlaceId]: actualizado },
  });
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
