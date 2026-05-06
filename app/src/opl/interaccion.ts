import type { Id } from "../modelo/tipos";

export type OplReferencia =
  | { tipo: "entidad"; id: Id }
  | { tipo: "enlace"; id: Id }
  | { tipo: "estado"; id: Id };

export interface OplToken {
  id: string;
  texto: string;
  rol: "texto" | "nombre" | "verbo" | "estado";
  ref?: OplReferencia;
  markdown?: "objeto" | "proceso" | "estado";
}

export interface OplLineaInteractiva {
  id: string;
  texto: string;
  ordinal: number;
  opdId?: Id;
  opdNombre?: string;
  opdProfundidad?: number;
  refs: OplReferencia[];
  tokens: OplToken[];
}

export interface OplTokenHint {
  texto: string;
  ref: OplReferencia;
  rol: Exclude<OplToken["rol"], "texto">;
  markdown?: OplToken["markdown"];
  /** Texto alternativo para match cuando difiere del `texto` canónico
   *  (ej. estados con tildes donde el hint usa backticks). Opcional. */
  alias?: string;
}

export function crearLineaOplInteractiva(
  id: string,
  texto: string,
  ordinal: number,
  refs: OplReferencia[],
  hints: OplTokenHint[] = [],
  meta: { opdId?: Id; opdNombre?: string; opdProfundidad?: number } = {},
): OplLineaInteractiva {
  const refsUnicas = refsUnicasPorTipoId(refs);
  return {
    id,
    texto,
    ordinal,
    ...meta,
    refs: refsUnicas,
    tokens: tokenizarConHints(id, texto, hints),
  };
}

export function lineaTocaReferencia(linea: OplLineaInteractiva, ref: OplReferencia | null): boolean {
  if (!ref) return false;
  return linea.refs.some((lineaRef) => mismaReferencia(lineaRef, ref));
}

export function filtrarLineasPorReferencia(
  lineas: OplLineaInteractiva[],
  ref: OplReferencia | null,
): OplLineaInteractiva[] {
  if (!ref) return lineas;
  return lineas.filter((linea) => lineaTocaReferencia(linea, ref));
}

export function referenciaEnlaceEspecifico(
  linea: OplLineaInteractiva,
  posicionToken: number,
): OplReferencia | null {
  const token = linea.tokens[posicionToken];
  if (token?.ref?.tipo === "enlace") return token.ref;
  if (token?.ref?.tipo === "entidad") {
    const indiceRef = linea.refs.findIndex((ref) => mismaReferencia(ref, token.ref!));
    const previa = indiceRef > 0 ? linea.refs[indiceRef - 1] : null;
    if (previa?.tipo === "enlace") return previa;
  }
  return null;
}

export function mismaReferencia(a: OplReferencia, b: OplReferencia): boolean {
  return a.tipo === b.tipo && a.id === b.id;
}

function tokenizarConHints(lineId: string, texto: string, hints: OplTokenHint[]): OplToken[] {
  const usados = hints
    .flatMap((hint, hintIndex) => ubicarHint(texto, hint, hintIndex))
    .sort((a, b) => a.start - b.start || b.texto.length - a.texto.length || a.hintIndex - b.hintIndex);

  const tokens: OplToken[] = [];
  let cursor = 0;
  for (const hint of usados) {
    if (hint.start < cursor) continue;
    if (hint.start > cursor) {
      tokens.push(tokenTexto(lineId, tokens.length, texto.slice(cursor, hint.start)));
    }
    tokens.push({
      id: `${lineId}:t${tokens.length}`,
      texto: hint.texto,
      rol: hint.rol,
      ref: hint.ref,
      ...(hint.markdown ? { markdown: hint.markdown } : {}),
    });
    cursor = hint.end;
  }
  if (cursor < texto.length) tokens.push(tokenTexto(lineId, tokens.length, texto.slice(cursor)));
  return tokens.length > 0 ? tokens : [tokenTexto(lineId, 0, texto)];
}

function ubicarHint(texto: string, hint: OplTokenHint, hintIndex: number): Array<OplTokenHint & { start: number; end: number; hintIndex: number }> {
  if (hint.texto.length === 0) return [];
  const textosBusqueda = [hint.texto];
  if (hint.alias && hint.alias.length > 0 && hint.alias !== hint.texto) {
    textosBusqueda.push(hint.alias);
  }
  const ubicaciones: Array<OplTokenHint & { start: number; end: number; hintIndex: number }> = [];
  for (const textoBuscar of textosBusqueda) {
    let start = texto.indexOf(textoBuscar);
    while (start >= 0) {
      // Usamos el texto real del hint (no el alias) para delimitar el token
      ubicaciones.push({ ...hint, start, end: start + textoBuscar.length, hintIndex });
      start = texto.indexOf(textoBuscar, start + textoBuscar.length);
    }
  }
  return ubicaciones;
}

function tokenTexto(lineId: string, index: number, texto: string): OplToken {
  return { id: `${lineId}:t${index}`, texto, rol: "texto" };
}

function refsUnicasPorTipoId(refs: OplReferencia[]): OplReferencia[] {
  const vistas = new Set<string>();
  const resultado: OplReferencia[] = [];
  for (const ref of refs) {
    const key = `${ref.tipo}:${ref.id}`;
    if (vistas.has(key)) continue;
    vistas.add(key);
    resultado.push(ref);
  }
  return resultado;
}
