import type { Entidad, Estado } from "./tipos";

const PARTICULAS_MINUSCULAS = new Set([
  "a",
  "al",
  "con",
  "de",
  "del",
  "e",
  "el",
  "en",
  "la",
  "las",
  "los",
  "o",
  "para",
  "por",
  "sin",
  "u",
  "y",
]);

export function normalizarSeparadoresNombre(nombre: string): string {
  return nombre.trim().replace(/_+/g, " ").replace(/\s+/g, " ");
}

export function nombreCanonicoEntidad(entidad: Entidad, nombre: string = entidad.nombre): string {
  const normalizado = normalizarSeparadoresNombre(nombre);
  return nombre.includes("_") ? capitalizarLexico(normalizado) : normalizado;
}

export function nombreCanonicoEstado(estado: Estado | string): string {
  const nombre = typeof estado === "string" ? estado : estado.nombre;
  return normalizarSeparadoresNombre(nombre).toLocaleLowerCase("es-CL");
}

export function esNombreProcesoCanonico(nombre: string): boolean {
  const limpio = normalizarSeparadoresNombre(nombre);
  if (esNombreProcesoPlaceholder(limpio)) return false;
  return esFormaVerbalCanonica(limpio);
}

export function esNombreProcesoPlaceholder(nombre: string): boolean {
  const normalizado = normalizarSeparadoresNombre(nombre).toLocaleLowerCase("es-CL");
  return normalizado === "proceso" ||
    /^proceso\s*\d+$/.test(normalizado) ||
    /^proceso\s+parte(?:\s+\d+)?$/.test(normalizado);
}

export function esNombreEstadoCanonico(nombre: string): boolean {
  const limpio = nombreCanonicoEstado(nombre);
  return limpio.length > 0 && !/^estado\s*\d+$/i.test(limpio);
}

export function estadoTieneNombreCanonico(estado: Estado): boolean {
  return esNombreEstadoCanonico(estado.nombre);
}

function capitalizarLexico(nombre: string): string {
  return nombre
    .split(" ")
    .filter(Boolean)
    .map((palabra, index) => capitalizarPalabra(palabra, index))
    .join(" ");
}

function capitalizarPalabra(palabra: string, index: number): string {
  if (/^[A-ZÁÉÍÓÚÜÑ0-9]{1,6}$/.test(palabra)) return palabra;
  if (/[a-záéíóúüñ][A-ZÁÉÍÓÚÜÑ]/.test(palabra)) return palabra;
  const lower = palabra.toLocaleLowerCase("es-CL");
  if (index > 0 && PARTICULAS_MINUSCULAS.has(lower)) return lower;
  const [primera = "", ...resto] = Array.from(lower);
  return `${primera.toLocaleUpperCase("es-CL")}${resto.join("")}`;
}

function esFormaVerbalCanonica(nombre: string): boolean {
  const palabras = palabrasNormalizadas(nombre);
  if (palabras.length === 0) return false;
  return palabras.some((palabra, index) => (index === 0 || index === palabras.length - 1) &&
    /(?:ar|er|ir|izar|ion|aje|miento|ing)$/.test(palabra));
}

function palabrasNormalizadas(nombre: string): string[] {
  return normalizarSeparadoresNombre(nombre)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}
