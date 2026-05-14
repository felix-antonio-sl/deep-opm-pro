import { enlaceAdmiteTasa } from "./constantes";
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

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
