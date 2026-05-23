import type { Id, Modelo, Resultado } from "./tipos";

/**
 * Multiplicidades canónicas OPM según ISO 19450 §3.60 y OPCloud sandbox.
 * "Custom" permite formato numérico restringido: N, +, *, d, d..d, d..N, d..*.
 */
export const MULTIPLICIDADES_CANONICAS = ["1", "0..1", "N", "0..N", "+", "*", "1..*", "2..*"] as const;
export type MultiplicidadCanonica = (typeof MULTIPLICIDADES_CANONICAS)[number];

/**
 * Regex para validar valores de multiplicidad.
 * Acepta: "N", "+", "*", "d", "d..d", "d..N", "d..*" (d = uno o más dígitos).
 */
const MULTIPLICIDAD_RE = /^\d+$|^N$|^\+$|^\*$|^\d+\.\.\d+$|^\d+\.\.N$|^\d+\.\.\*$/;

/**
 * Valida si un texto es una multiplicidad válida.
 * SSOT: opm-opl-es.md §12 — la multiplicidad aparece en oraciones OPL.
 */
export function validarMultiplicidad(texto: string): boolean {
  return MULTIPLICIDAD_RE.test(texto);
}

/**
 * Fija la multiplicidad del lado origen de un enlace.
 * Si el valor es "", quita la multiplicidad.
 */
export function fijarMultiplicidadOrigen(
  modelo: Modelo,
  enlaceId: Id,
  valor: string,
): Resultado<Modelo> {
  return fijarMultiplicidad(modelo, enlaceId, "multiplicidadOrigen", valor);
}

/**
 * Fija la multiplicidad del lado destino de un enlace.
 */
export function fijarMultiplicidadDestino(
  modelo: Modelo,
  enlaceId: Id,
  valor: string,
): Resultado<Modelo> {
  return fijarMultiplicidad(modelo, enlaceId, "multiplicidadDestino", valor);
}

/**
 * Quita la multiplicidad de un lado del enlace.
 */
export function quitarMultiplicidad(
  modelo: Modelo,
  enlaceId: Id,
  lado: "origen" | "destino",
): Resultado<Modelo> {
  const campo = lado === "origen" ? "multiplicidadOrigen" : "multiplicidadDestino";
  return fijarMultiplicidad(modelo, enlaceId, campo, "");
}

function fijarMultiplicidad(
  modelo: Modelo,
  enlaceId: Id,
  campo: "multiplicidadOrigen" | "multiplicidadDestino",
  valor: string,
): Resultado<Modelo> {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);

  if (valor !== "" && !validarMultiplicidad(valor)) {
    return fallo("Multiplicidad inválida: usa 1, +, *, 2..*, 2..N, 0..N o 1..5");
  }

  const actual = enlace[campo];
  if (valor === "" && actual === undefined) return ok(modelo);
  if (valor !== "" && valor === actual) return ok(modelo);

  const actualizado = { ...enlace };
  if (valor === "") {
    delete actualizado[campo];
  } else {
    actualizado[campo] = valor;
  }

  return ok({
    ...modelo,
    enlaces: {
      ...modelo.enlaces,
      [enlaceId]: actualizado,
    },
  });
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
