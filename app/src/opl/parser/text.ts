// Normalización léxica compartida por las familias de oraciones OPL.
import type { LineaOplNormalizada } from "./tipos";

export const PUNTO_FINAL = /\.\s*$/;
const ETIQUETA_SUFIX = /\s*\[etiqueta:\s*([^\]]+)\]\s*$/i;

/**
 * SSOT §12. Multiplicidad canonica como PREFIJO de nombre. El generador emite
 * la cardinalidad delante del token de entidad: `2 **Pedidos**`, `1..N **Recursos**`,
 * `+ **Componentes**`, `2..* **Cosas**`, `* **Veces**`. Esta regex extrae la
 * cardinalidad y deja el resto del texto.
 *
 * Lenguaje aceptado (subconjunto de `validarMultiplicidad` en
 * `modelo/enlaceMultiplicidad.ts`): `1`, `2..N`, `2..*`, `0..3`, `+`, `*`.
 * `?` no se emite como prefijo: se escribe `un/una … opcional` y se lee como
 * `0..1`. Cualquier otro prefijo no matchea y queda como nombre.
 */
const MULTIPLICIDAD_PREFIJO_RE = /^\s*(?:(\d+(?:\.\.(?:\d+|N|\*))?|N|\+|\*)\s+(.+)|un\s+(.+?)\s+opcional(?:es)?|una\s+(.+?)\s+opcional(?:es)?)$/iu;

/**
 * SSOT §13. Prefijo de ruta etiquetada. El generador emite
 * `Por ruta <etiqueta>, <oracion base>` cuando el enlace tiene `rutaEtiqueta`.
 * La forma simple sigue admitiendo texto sin tipografía (D6).
 */
const RUTA_PREFIJO_RE = /^Por\s+ruta\s+(.+?),\s*(.+)$/iu;

/** Lee la ruta antes de borrar la tipografía que delimita su oración base. */
export function extractRoutePrefix(original: string): { label: string; sentence: string } | null {
  const quoted = /^Por\s+ruta\s+`([^`]+)`,\s*(.+)$/iu.exec(original);
  const body = /^Por\s+ruta\s+(.+)$/iu.exec(original)?.[1];
  // La primera cosa marcada delimita la oración, con o sin multiplicidad.
  // Conserva las comas de la etiqueta y las del nombre de esa cosa.
  if (!quoted && body) {
    for (const separator of body.matchAll(/,\s*/gu)) {
      const sentence = body.slice(separator.index + separator[0].length);
      const subject = extraerMultiplicidad(sentence).nombre;
      if (/^(?:\*\*[^*\n]+\*\*|\*[^*\n]+\*)\s+.+$/u.test(subject)) {
        const label = body.slice(0, separator.index).trim();
        if (label) return { label, sentence };
      }
    }
  }
  const match = quoted ?? RUTA_PREFIJO_RE.exec(original);
  if (!match) return null;
  const label = (match[1] ?? "").trim();
  const sentence = (match[2] ?? "").trim();
  return label && sentence ? { label, sentence } : null;
}

/**
 * Extrae prefijo de multiplicidad (SSOT §12) de un texto. Devuelve la
 * multiplicidad como string literal y el nombre limpio. Si no hay prefijo
 * canonico, `multiplicidad` es undefined y `nombre` es el texto sin tocar.
 *
 * D5: prefijos no canonicos (e.g. `{abc}`) se ignoran silenciosamente —
 * `normalizarNombreOpl` ya descarta `{...}` segun la regla previa y el resto
 * del enlace se aplica.
 *
 * NOTA: este helper opera sobre texto sin pasar por `normalizarNombreOpl`,
 * que descarta el prefijo numerico/estrella. Usar `extraerMultiplicidadDeNombre`
 * para casos donde el texto crudo ya viene con markdown limpiado pero sin
 * normalizar.
 */
export function extraerMultiplicidad(texto: string): { multiplicidad?: string; nombre: string } {
  const match = MULTIPLICIDAD_PREFIJO_RE.exec(texto.trim());
  if (!match) return { nombre: texto.trim() };
  const multiplicidad = (match[1] ?? "").trim() || "0..1";
  const nombre = (match[2] ?? match[3] ?? match[4] ?? "").trim();
  if (!multiplicidad || !nombre) return { nombre: texto.trim() };
  return { multiplicidad, nombre };
}

/**
 * Pipeline canonico para extremos con multiplicidad prefija (SSOT §12).
 * Toma texto crudo (post-`limpiarMarkdown` que ya corrio en `normalizarLinea`),
 * extrae multiplicidad del prefijo y normaliza el nombre restante con
 * `normalizarNombreOpl`.
 *
 * Esta es la API correcta para el parser: si pasamos texto crudo a
 * `normalizarNombreOpl` directamente, el prefijo `2 ` o `*` se descarta
 * silenciosamente (regla previa de `normalizarNombreOpl`) y perdemos la
 * multiplicidad.
 */
export function extraerMultiplicidadDeNombre(crudo: string): { multiplicidad?: string; nombre: string } {
  const extraida = extraerMultiplicidad(crudo);
  return {
    nombre: normalizarNombreOpl(extraida.nombre),
    ...(extraida.multiplicidad ? { multiplicidad: extraida.multiplicidad } : {}),
  };
}

export function normalizarLineas(texto: string): LineaOplNormalizada[] {
  return texto
    .split(/\r?\n/)
    .map((original, index) => normalizarLinea(original, index + 1))
    .filter((linea): linea is LineaOplNormalizada => linea !== null);
}

export function normalizarNombreOpl(raw: string): string {
  return limpiarMarkdown(raw)
    .replace(/^\s*(?:\d+(?:\.\.(?:\d+|N))?|\*)\s+/i, "")
    .replace(/\s+Pr\s*=\s*\d+(?:[.,]\d+)?\s*$/iu, "")
    .replace(/\s+\[[^\]\r\n]+\]/g, "")
    .replace(/\s+\{[^}\r\n]+\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function claveNombre(raw: string): string {
  return normalizarNombreOpl(raw)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("es");
}

function normalizarLinea(original: string, linea: number): LineaOplNormalizada | null {
  const sinNumeracion = original.replace(/^\s*(?:\d+(?:\.\d+)*[.)]|[-•])\s+/, "").trim();
  if (!sinNumeracion) return null;
  const etiquetaMatch = ETIQUETA_SUFIX.exec(sinNumeracion);
  const etiqueta = etiquetaMatch?.[1]?.trim();
  const sinEtiqueta = etiqueta ? sinNumeracion.slice(0, etiquetaMatch!.index).trim() : sinNumeracion;
  return {
    linea,
    original,
    texto: limpiarMarkdown(sinEtiqueta).trim(),
    ...(etiqueta ? { etiqueta } : {}),
  };
}

export function limpiarMarkdown(texto: string): string {
  return texto
    .replace(/\*\*([^*\n]+)\*\*/g, "$1")
    .replace(/\*([^*\s][^*\n]*?)\*/g, "$1")
    .replace(/`([^`\n]+)`/g, "$1");
}

/** Retira adornos de línea y conserva los límites tipográficos de sus tokens. */
export function originalSentence(original: string): string {
  const sinNumeracion = original.replace(/^\s*(?:\d+(?:\.\d+)*[.)]|[-•])\s+/, "").trim();
  const etiquetaMatch = ETIQUETA_SUFIX.exec(sinNumeracion);
  return etiquetaMatch ? sinNumeracion.slice(0, etiquetaMatch.index).trim() : sinNumeracion;
}

/** Conserva backticks de estado para desambiguar los conectores `de`/`a` de TS3. */
export function textoMarcadoDeLinea(original: string): string {
  return originalSentence(original)
    .replace(/\*\*([^*\n]+)\*\*/g, "$1")
    .replace(/\*([^*\s][^*\n]*?)\*/g, "$1")
    .trim();
}

export function limpiarObjetoConEstadoConMultiplicidad(texto: string): { nombre: string; estado?: string; multiplicidad?: string } {
  const conEstado = /^(.+?)\s+en\s+(.+)$/iu.exec(texto.trim());
  const crudoNombre = (conEstado?.[1] ?? texto).trim();
  const estado = conEstado?.[2] ? limpiarEstado(conEstado[2]) : undefined;
  const extraida = extraerMultiplicidadDeNombre(crudoNombre);
  return {
    nombre: extraida.nombre,
    ...(estado ? { estado } : {}),
    ...(extraida.multiplicidad ? { multiplicidad: extraida.multiplicidad } : {}),
  };
}

export function dividirLista(texto: string, conjuncion: "y" | "o"): string[] {
  const re = conjuncion === "y" ? /\s+y\s+/iu : /\s+o\s+/iu;
  return texto.split(",").flatMap((parte) => parte.split(re)).map((item) => item.trim()).filter(Boolean);
}

export function limpiarEstado(texto: string): string {
  return texto.replace(/\([^)]*\)/g, "").replace(/\.$/, "").trim();
}

export function limpiarEstadoMarcado(texto: string): string {
  return limpiarEstado(texto).replace(/^`|`$/gu, "").trim();
}

const CAMBIO_ESTADO_MARCADO_RE = /^(?:(.+?)\s+)?cambia\s+(.+?)\s+de\s+`([^`]+)`\s+a\s+`([^`]+)`$/iu;
const PROBABILIDAD_MARCADA_SUFIX_RE = /\s+(?:`Pr\s*=\s*\d+(?:[.,]\d+)?`|\(probabilidad:\s*[^)]+\))$/iu;

export function parsearCambioEstadoMarcado(texto: string): {
  proceso?: string;
  objeto: string;
  estadoEntrada: string;
  estadoSalida: string;
} | null {
  const match = CAMBIO_ESTADO_MARCADO_RE.exec(texto.trim().replace(PROBABILIDAD_MARCADA_SUFIX_RE, ""));
  if (!match) return null;
  return {
    ...(match[1] ? { proceso: normalizarNombreOpl(match[1]) } : {}),
    objeto: normalizarNombreOpl(match[2] ?? ""),
    estadoEntrada: limpiarEstado(match[3] ?? ""),
    estadoSalida: limpiarEstado(match[4] ?? ""),
  };
}

export function limpiarObjetoConEstado(texto: string): { nombre: string; estado?: string } {
  const match = /^(.+?) en (.+)$/iu.exec(texto.trim());
  if (!match) return { nombre: normalizarNombreOpl(texto) };
  return { nombre: normalizarNombreOpl(match[1] ?? ""), estado: limpiarEstado(match[2] ?? "") };
}
