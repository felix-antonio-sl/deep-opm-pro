import type { Resultado, TipoValorSlot, ValorConcreto } from "../tipos";

/**
 * Validador mínimo del slot de valor de atributo.
 *
 * SSOT: [Glos 3.4] atributo, [V-163] slot de valor, [V-164] placeholder/value.
 * Referencia OPCloud verificada:
 * opm-extracted/src/app/models/modules/attribute-validation/attribute-value.ts
 * opm-extracted/src/app/models/modules/attribute-validation/char-range.ts
 */

export function validarValorSlot(tipo: TipoValorSlot, valor: ValorConcreto): Resultado<ValorConcreto> {
  if (tipo === "integer") return validarEntero(valor);
  if (tipo === "float") return validarFloat(valor);
  if (tipo === "char") return validarChar(valor);
  return validarString(valor);
}

export function placeholderValorSlot(): "value" {
  return "value";
}

function validarEntero(valor: ValorConcreto): Resultado<number> {
  const numero = numeroDesdeValor(valor);
  if (numero === null || !Number.isInteger(numero)) {
    return fallo("El atributo es entero; usa un número entero.");
  }
  return ok(numero);
}

function validarFloat(valor: ValorConcreto): Resultado<number> {
  const numero = numeroDesdeValor(valor);
  if (numero === null) return fallo("El atributo es numérico; usa un número válido.");
  return ok(numero);
}

function validarChar(valor: ValorConcreto): Resultado<string> {
  const texto = String(valor);
  if (texto.length !== 1) return fallo("El atributo es carácter; usa un solo carácter.");
  return ok(texto);
}

function validarString(valor: ValorConcreto): Resultado<string> {
  return ok(String(valor));
}

function numeroDesdeValor(valor: ValorConcreto): number | null {
  if (typeof valor === "number") return Number.isFinite(valor) ? valor : null;
  const limpio = valor.trim();
  if (!limpio) return null;
  const numero = Number(limpio);
  return Number.isFinite(numero) ? numero : null;
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
