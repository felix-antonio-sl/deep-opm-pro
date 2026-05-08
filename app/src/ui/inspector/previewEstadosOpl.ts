import type { Entidad } from "../../modelo/tipos";

export interface PreviewEstadosOpl {
  texto: string;
  esValido: boolean;
  error?: string;
}

export type ValidacionNombreEstado = { ok: true; nombre: string } | { ok: false; razon: string };

export function generarPreviewEstadosIniciales(
  entidad: Entidad,
  nombre1: string,
  nombre2: string,
  estadosExistentes: ReadonlyArray<string> = [],
): PreviewEstadosOpl {
  const validacion1 = validarNombreEstado(nombre1, estadosExistentes);
  const validacion2 = validarNombreEstado(nombre2, [...estadosExistentes, normalizarNombreEstado(nombre1)]);
  if (!validacion1.ok) return { texto: "", esValido: false, error: validacion1.razon };
  if (!validacion2.ok) return { texto: "", esValido: false, error: validacion2.razon };
  return {
    texto: `**${entidad.nombre}** se encuentra en uno de los siguientes estados: **${validacion1.nombre}** o **${validacion2.nombre}**.`,
    esValido: true,
  };
}

export function generarPreviewEstadoAdicional(
  entidad: Entidad,
  nombreNuevo: string,
  estadosExistentes: ReadonlyArray<string> = [],
): PreviewEstadosOpl {
  const validacion = validarNombreEstado(nombreNuevo, estadosExistentes);
  if (!validacion.ok) return { texto: "", esValido: false, error: validacion.razon };
  return {
    texto: `**${entidad.nombre}** suma el estado **${validacion.nombre}**.`,
    esValido: true,
  };
}

export function validarNombreEstado(nombre: string, estadosExistentes: ReadonlyArray<string>): ValidacionNombreEstado {
  if (contieneCaracterProhibido(nombre)) return { ok: false, razon: "El nombre contiene caracteres no permitidos" };
  const limpio = normalizarNombreEstado(nombre);
  if (limpio.length === 0) return { ok: false, razon: "El nombre no puede estar vacío" };
  if (limpio.length > 200) return { ok: false, razon: "El nombre excede 200 caracteres" };

  const normalizado = claveNombreEstado(limpio);
  const duplicado = estadosExistentes.some((existente) => claveNombreEstado(existente) === normalizado);
  if (duplicado) return { ok: false, razon: "Ya existe un estado con ese nombre" };

  return { ok: true, nombre: limpio };
}

export function normalizarNombreEstado(nombre: string): string {
  return nombre.trim().replace(/\s+/g, " ");
}

function claveNombreEstado(nombre: string): string {
  return normalizarNombreEstado(nombre).toLocaleLowerCase("es");
}

function contieneCaracterProhibido(nombre: string): boolean {
  return /[\p{Cc}\t\n\r]/u.test(nombre);
}
