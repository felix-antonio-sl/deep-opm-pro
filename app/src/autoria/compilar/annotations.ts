import type { Ancla, ReferenciaNormaExtraida } from "./tipos";

// ── Anclas (W5.2) ──────────────────────────────────────────────────────────
//
// Tres formas se EXTRAEN (y se STRIPEAN antes de clasificar/parsear la oración):
//   · cita normativa entre paréntesis  `(DS art. N[, M…])`, `(NT 2024 §X)`,
//     `(Ley N art. M)`  → ancla `norma` (compila a `vigente`).
//   · cita normativa inline con `#clave`  `Anclaje DS art. 17 #frontera-art17.`
//     → ancla `norma` con `claveExplicita` (sin paréntesis).
//   · `[RATIFICAR[ #clave][: texto]]`  → ancla `ratificacion` (compila a pendiente).
//   · `[C1]`/`[Q14]`/`[B3]`-style  → ancla `candidata` (JAMÁS compila; §10.3).
//
// La oración LIMPIA (sin las marcas) sigue su camino normal de clasificación.

/**
 * Una cita entre paréntesis, reconocida por su FORMA, no por un enum de cuerpos
 * (adjudicación dov-dori 2026-06-05, hallazgo (b): el alfabeto de cuerpos
 * normativos es ABIERTO — LGUC, OGUC, DFL, Res. Ex., NCh, Código Civil, ISO… —
 * y enumerar instancias es el error de eje que indignó al operador). Dos señales
 * independientes, cualquiera basta:
 *
 *  1. LOCALIZADOR (la fuerte, conjunto CERRADO y transversal a todo el derecho):
 *     `art./arts./artículo`, `§`, `inc.`, `letra`, `N°`, `numeral`, `título`
 *     seguido de número/identificador. El cuerpo es lo que PRECEDE, capturado
 *     libre (puede estar vacío: `(art. 17)`).
 *  2. CUERPO-CON-NUMERACIÓN LEGAL (la débil, para citas sin localizador):
 *     sigla/nombre que EMPIEZA EN MAYÚSCULA + número con forma legal (con
 *     punto/barra/guión, o ≥3 dígitos) — `DFL 458`, `DS 1/2022`, `NCh 433`,
 *     `Ley 20.584`. Mitigación anti-falso-positivo: `(versión 2.1)` no dispara
 *     (minúscula); `(v 2.1)` no dispara (decimal corto sin forma legal).
 */
// Localizadores-PALABRA exigen dígito a continuación (evita `(con título
// profesional)`); `§` es símbolo legal inequívoco y acepta identificador
// (`§emergencias`, `§Protocolos clínicos`, `§5.1.6`).
const LOCALIZADOR_CITA = /(?:(?:art[s]?\.?|art[íi]culos?|inc\.?|letra|N°|n[uú]m(?:eral)?|t[íi]tulos?)\s*\d|§\s*[\wáéíóúñÁÉÍÓÚÑ])/u;
const ANCLA_PAREN_LOCALIZADOR_RE = new RegExp(
  String.raw`\(\s*([^)]*?${LOCALIZADOR_CITA.source}[^)]*?)\s*(?:#([a-z0-9][a-z0-9-]*))?\s*\)`,
  "giu",
);
const ANCLA_PAREN_CUERPO_NUM_RE =
  /\(\s*((?:[A-ZÁÉÍÓÚÑ][\w.áéíóúñ]*\s+)*[A-ZÁÉÍÓÚÑ][\w.áéíóúñ]*\s+(?:\d{3,}|\d+[./-][\d./-]+))\s*(?:#([a-z0-9][a-z0-9-]*))?\s*\)/gu;
/** Cita normativa inline con `#clave` explícita, FUERA de paréntesis: `… DS art. 17 #frontera-art17`. */
const ANCLA_NORMA_INLINE_RE =
  /\b((?:DS|NT|DTO|Ley|Decreto)(?:\s+[\d./-]+)?(?:\s+(?:art\.?|arts\.?|§)[^#.\n]*?)?)\s+#([a-z0-9][a-z0-9-]*)/giu;
/** `[RATIFICAR[ #clave][: texto]]`. */
const ANCLA_RATIFICAR_RE = /\[\s*RATIFICAR\s*(?:#([a-z0-9][a-z0-9-]*))?\s*(?::\s*([^\]]*?))?\s*\]/giu;
/** Cualquier otra etiqueta entre corchetes (candidata): `[C1]`, `[Q14]`, `[C4/D]`. */
const ANCLA_CORCHETE_RE = /\[([^\]]+)\]/gu;

/**
 * Extrae todas las anclas de una línea cruda del proto, parseando cada forma a su
 * estructura. Función PURA y exportada (la usa el test de extracción por forma).
 * El ORDEN de detección importa: `[RATIFICAR…]` antes que el corchete genérico
 * (para no clasificar un RATIFICAR como candidata).
 */
export function extraerAnclasDeLinea(texto: string): Ancla[] {
  const anclas: Ancla[] = [];

  // 1) Citas normativas entre paréntesis, por FORMA (señal-localizador primero,
  //    luego cuerpo-con-numeración para las que no tienen localizador). Un mismo
  //    paréntesis no se extrae dos veces (dedup por span bruto). Se registran los
  //    rangos [inicio, fin) de cada match para descartar luego una cita inline que
  //    ya quede DENTRO de un paréntesis (compilar-01).
  const brutosVistos = new Set<string>();
  const rangosParen: Array<[number, number]> = [];
  for (const re of [ANCLA_PAREN_LOCALIZADOR_RE, ANCLA_PAREN_CUERPO_NUM_RE]) {
    for (const m of texto.matchAll(re)) {
      if (m.index !== undefined) rangosParen.push([m.index, m.index + m[0].length]);
      if (brutosVistos.has(m[0])) continue;
      brutosVistos.add(m[0]);
      const cuerpo = (m[1] ?? "").trim();
      const claveExplicita = m[2]?.trim();
      anclas.push({
        clase: "norma",
        referencias: parsearReferencias(cuerpo),
        ...(claveExplicita ? { claveExplicita } : {}),
        bruto: m[0],
      });
    }
  }

  // 2) Citas normativas inline con `#clave` (fuera de paréntesis). Si el span del
  //    match queda TOTALMENTE contenido en un rango-paréntesis ya extraído (la
  //    `#clave` vivía dentro de la cita `(… #clave)`), se descarta: esa ancla ya la
  //    materializó el paso 1. La contención es ESTRICTA (s>=ps && e<=pe), no por
  //    solape parcial — una inline legítima fuera del paréntesis no se ve afectada.
  for (const m of texto.matchAll(ANCLA_NORMA_INLINE_RE)) {
    if (m.index !== undefined) {
      const s = m.index;
      const e = m.index + m[0].length;
      if (rangosParen.some(([ps, pe]) => s >= ps && e <= pe)) continue;
    }
    const cuerpo = (m[1] ?? "").trim();
    const claveExplicita = (m[2] ?? "").trim();
    anclas.push({
      clase: "norma",
      referencias: parsearReferencias(cuerpo),
      claveExplicita,
      bruto: m[0],
    });
  }

  // 3) `[RATIFICAR …]`.
  for (const m of texto.matchAll(ANCLA_RATIFICAR_RE)) {
    const claveExplicita = m[1]?.trim();
    const nota = m[2]?.trim();
    anclas.push({
      clase: "ratificacion",
      ...(claveExplicita ? { claveExplicita } : {}),
      ...(nota ? { nota } : {}),
      bruto: m[0],
    });
  }

  // 4) Resto de etiquetas `[…]` → candidatas (NO compilan, §10.3). Excluye las que
  //    ya consumió RATIFICAR.
  for (const m of texto.matchAll(ANCLA_CORCHETE_RE)) {
    const inner = (m[1] ?? "").trim();
    if (/^RATIFICAR/iu.test(inner)) continue;
    anclas.push({ clase: "candidata", id: idDeCandidata(inner), bruto: m[0] });
  }

  return anclas;
}

/** Parsea el cuerpo de una cita (`DS art. 15, 17`, `NT 2024 §X`, `Ley 20.584 art. 12-13`)
 *  a una lista de `ReferenciaNormaExtraida`. Los artículos son VERBATIM (no se
 *  expanden rangos — §10.5). Soporta multi-norma separada por `;`. */
function parsearReferencias(cuerpo: string): ReferenciaNormaExtraida[] {
  const refs: ReferenciaNormaExtraida[] = [];
  for (const trozo of cuerpo.split(/\s*;\s*/u)) {
    const ref = parsearReferenciaUnica(trozo.trim());
    if (ref) refs.push(ref);
  }
  return refs.length ? refs : [{ norma: cuerpo.trim() }];
}

function parsearReferenciaUnica(trozo: string): ReferenciaNormaExtraida | null {
  if (!trozo) return null;
  // Sección `§…` (puede ir sola o tras la norma).
  let seccion: string | undefined;
  let resto = trozo;
  const secM = /\s*(§[^§]+)$/u.exec(resto);
  if (secM) {
    seccion = (secM[1] ?? "").trim();
    resto = resto.slice(0, secM.index).trim();
  }
  // Artículos `art. N`, `arts. N, M`, `art. N-M` — VERBATIM (no expandir).
  let articulos: string[] | undefined;
  const artM = /\s*\b(?:art\.?|arts\.?)\s+(.+)$/iu.exec(resto);
  if (artM) {
    articulos = (artM[1] ?? "")
      .split(/\s*,\s*/u)
      .map((s) => s.trim())
      .filter(Boolean);
    resto = resto.slice(0, artM.index).trim();
  }
  const norma = resto.trim();
  return {
    norma: norma || trozo.trim(),
    ...(articulos && articulos.length ? { articulos } : {}),
    ...(seccion ? { seccion } : {}),
  };
}

/** `Q14 — pata logística` → `Q14`; `C4/D` → `C4/D`; `B3` → `B3`. */
function idDeCandidata(inner: string): string {
  const m = /^([A-Za-z]+\d+[A-Za-z0-9/]*)/u.exec(inner.trim());
  return m ? (m[1] ?? inner).trim() : inner.trim();
}

/** Strip de TODAS las marcas de ancla; deja la oración limpia para clasificar/parsear. */
export function quitarAnclas(texto: string): string {
  return texto
    .replace(ANCLA_PAREN_LOCALIZADOR_RE, "")
    .replace(ANCLA_PAREN_CUERPO_NUM_RE, "")
    .replace(ANCLA_NORMA_INLINE_RE, "")
    .replace(ANCLA_RATIFICAR_RE, "")
    .replace(ANCLA_CORCHETE_RE, "")
    .replace(/\s{2,}/gu, " ")
    .replace(/\s+\./gu, ".")
    .trim();
}
