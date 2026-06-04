// Compilación de anclas del proto → `AnclaNormativa` del bundle (W5.2).
//
// El normalizador EXTRAE las anclas de cada línea (`extraerAnclasDeLinea`); el
// emisor produce el/los hecho(s) de la línea. Este módulo une ambas: dado el
// conjunto de anclas de una línea y el RESULTADO de emitir esa línea, compila las
// anclas `norma`/`ratificacion` a `AnclaNormativa` con el target correcto, deriva
// la `claveProto` estable, y devuelve la contabilidad L8 (compiladas / candidatas
// / no-compilables-por-rechazo). Las `candidata` (`[C1]`-style) NUNCA compilan.
//
// REGLA DE TARGET (documentada): el ancla se adjunta al hecho PRINCIPAL de la línea:
//   · si la línea emite uno o más ENLACES → target = el PRIMER enlace creado;
//   · si no, pero la línea declara/toca una ENTIDAD (descripción/estados) →
//     target = esa entidad;
//   · una ancla en un COMENTARIO de bloque → target = el OPD del bloque;
//   · si la línea no produjo ni enlace ni entidad (idempotente/dedup) → la ancla
//     se adjunta al OPD del bloque (no se pierde — el hecho conceptual vive ahí).
//
// REGLA DE claveProto (documentada): si el autor acuñó `#clave` explícita, esa es
// (con prefijo de género `ancla:`/`ratificar:`). Si no, derivación DETERMINISTA y
// ESTABLE que NO depende de la nota libre editable: slug de
// `<genero>:<norma+articulos>-<slug-del-target>`. Sobrevive a cualquier reedición
// de la nota (C1/L9). Colisiones → se desambiguan con un sufijo numérico estable.

import type { Autor } from "../dsl";
import type { TargetAnclaEntrada } from "../tipos";
import type { Ancla, ReferenciaNormaExtraida } from "./tipos";
import type { ReferenciaNorma } from "../../modelo/tipos";

/** Contabilidad L8 de una línea: cuántas anclas se detectaron y a dónde fueron. */
export interface ContabilidadAnclas {
  detectadas: number;
  compiladas: number;
  candidatas: number;
  /** Anclas (norma/ratificacion) NO compiladas porque su línea fue rechazada/falló. */
  enRechazadas: number;
}

const CERO: ContabilidadAnclas = { detectadas: 0, compiladas: 0, candidatas: 0, enRechazadas: 0 };

/** Suma dos contabilidades (para el resumen del ledger). */
export function sumarContabilidad(a: ContabilidadAnclas, b: ContabilidadAnclas): ContabilidadAnclas {
  return {
    detectadas: a.detectadas + b.detectadas,
    compiladas: a.compiladas + b.compiladas,
    candidatas: a.candidatas + b.candidatas,
    enRechazadas: a.enRechazadas + b.enRechazadas,
  };
}

/** Cómo terminó la emisión de la línea (lo que el ancla necesita para elegir target). */
export interface ContextoTargetLinea {
  /** Enlaces creados por la línea (el primero es el target preferente). */
  enlaceIds?: string[];
  /** Clave de dominio de la entidad principal declarada (si la línea declara una cosa). */
  entidadKey?: string;
  /** Clave del OPD del bloque (fallback y target de las anclas de comentario). */
  opdKey: string;
}

/** Contador estable de desambiguación de claves derivadas colisionantes (por compilación). */
export interface EstadoClaves {
  usadas: Set<string>;
}

export function nuevoEstadoClaves(): EstadoClaves {
  return { usadas: new Set<string>() };
}

/**
 * Compila las anclas `norma`/`ratificacion` de una línea APLICADA a `AnclaNormativa`,
 * conservando las `candidata`. Devuelve la contabilidad L8. NO lanza: un fallo de
 * adjunción (target irresoluble, clave inestable) degrada a contabilizar la ancla
 * como "en-rechazada" en vez de abortar el hecho (trazabilidad meta, no nuclear).
 */
export function compilarAnclasDeLinea(
  anclas: Ancla[] | undefined,
  ctx: ContextoTargetLinea,
  autor: Autor,
  claves: EstadoClaves,
): ContabilidadAnclas {
  if (!anclas || anclas.length === 0) return CERO;
  let contab: ContabilidadAnclas = { detectadas: 0, compiladas: 0, candidatas: 0, enRechazadas: 0 };
  const target = targetDeLinea(ctx);
  for (const ancla of anclas) {
    contab = { ...contab, detectadas: contab.detectadas + 1 };
    if (ancla.clase === "candidata") {
      // `[C1]`-style: jamás compila (adjudicación §10.3). Se conserva (ya viaja en la
      // línea); aquí solo se contabiliza.
      contab = { ...contab, candidatas: contab.candidatas + 1 };
      continue;
    }
    const ok = compilarUna(ancla, target, autor, claves);
    contab = ok
      ? { ...contab, compiladas: contab.compiladas + 1 }
      : { ...contab, enRechazadas: contab.enRechazadas + 1 };
  }
  return contab;
}

/**
 * Contabiliza las anclas de una línea RECHAZADA / FALLIDA sin compilarlas: las
 * `norma`/`ratificacion` van a `enRechazadas` (no se compilan, pero quedan en el
 * ledger junto al diagnóstico de su línea — L8: no se silencian). Las `candidata`
 * a `candidatas`.
 */
export function contabilizarAnclasNoCompiladas(anclas: Ancla[] | undefined): ContabilidadAnclas {
  if (!anclas || anclas.length === 0) return CERO;
  let contab: ContabilidadAnclas = { detectadas: 0, compiladas: 0, candidatas: 0, enRechazadas: 0 };
  for (const ancla of anclas) {
    contab = { ...contab, detectadas: contab.detectadas + 1 };
    if (ancla.clase === "candidata") contab = { ...contab, candidatas: contab.candidatas + 1 };
    else contab = { ...contab, enRechazadas: contab.enRechazadas + 1 };
  }
  return contab;
}

/** Elige el target de dominio de la línea según la regla documentada. */
function targetDeLinea(ctx: ContextoTargetLinea): TargetAnclaEntrada {
  if (ctx.enlaceIds && ctx.enlaceIds.length > 0) return { enlace: ctx.enlaceIds[0]! };
  if (ctx.entidadKey) return { entidad: ctx.entidadKey };
  return { opd: ctx.opdKey };
}

function compilarUna(
  ancla: Extract<Ancla, { clase: "norma" | "ratificacion" }>,
  target: TargetAnclaEntrada,
  autor: Autor,
  claves: EstadoClaves,
): boolean {
  try {
    if (ancla.clase === "norma") {
      const referencias = ancla.referencias.map(aReferenciaNorma);
      const claveProto = resolverClave("ancla", ancla.claveExplicita, claveDerivadaNorma(referencias, target), claves);
      autor.ancla(target, {
        claveProto,
        estado: "vigente",
        ...(referencias.length ? { referencias } : {}),
        ...(ancla.nota ? { nota: ancla.nota } : {}),
      });
      return true;
    }
    // ratificacion → pendiente-ratificacion. nivelAutoridad propuesto: operador-modelado
    // (la app NO decide autoridad; registra el default declarable, §8 — el LLM E2 puede
    // proponer otro nivel, fuera del alcance determinista de W5.2).
    const claveProto = resolverClave(
      "ratificar",
      ancla.claveExplicita,
      claveDerivadaRatificar(ancla.nota, target),
      claves,
    );
    autor.ancla(target, {
      claveProto,
      estado: "pendiente-ratificacion",
      nivelAutoridad: "operador-modelado",
      ...(ancla.nota ? { nota: ancla.nota } : {}),
    });
    return true;
  } catch {
    // Target irresoluble o clave duplicada en el bundle: contabilizar como no
    // compilada (no se pierde — queda detectada), sin abortar el hecho de la línea.
    return false;
  }
}

function aReferenciaNorma(ref: ReferenciaNormaExtraida): ReferenciaNorma {
  return {
    norma: ref.norma,
    ...(ref.articulos && ref.articulos.length ? { articulos: ref.articulos } : {}),
    ...(ref.seccion ? { seccion: ref.seccion } : {}),
  };
}

/**
 * Resuelve la clave final: la `#clave` explícita manda (con prefijo de género); si
 * no, la derivada determinista. Desambigua colisiones con un sufijo `-N` estable
 * (el orden de compilación es determinista, así que el sufijo también lo es).
 */
function resolverClave(
  genero: "ancla" | "ratificar",
  explicita: string | undefined,
  derivada: string,
  claves: EstadoClaves,
): string {
  const base = explicita ? `${genero}:${slug(explicita)}` : derivada;
  let candidata = base;
  let n = 2;
  while (claves.usadas.has(candidata)) {
    candidata = `${base}-${n++}`;
  }
  claves.usadas.add(candidata);
  return candidata;
}

/** Clave derivada de una cita normativa: `ancla:<norma+articulos>-<target>`. NO usa la nota. */
function claveDerivadaNorma(referencias: ReferenciaNorma[], target: TargetAnclaEntrada): string {
  const normaParte = referencias
    .map((r) => [r.norma, ...(r.articulos ?? []), r.seccion ?? ""].filter(Boolean).join("-"))
    .join("-");
  return `ancla:${slug(normaParte) || "norma"}-${slugTarget(target)}`;
}

/** Clave derivada de un [RATIFICAR] sin clave explícita: `ratificar:<target>`. NO usa la nota. */
function claveDerivadaRatificar(_nota: string | undefined, target: TargetAnclaEntrada): string {
  // La nota es EDITABLE (C1/L9): la clave derivada NO debe depender de ella, o un
  // pendiente ratificado reaparecería al editar la nota. Se ancla al target.
  return `ratificar:${slugTarget(target)}`;
}

/** Slug estable del target de dominio (entidad/opd por clave; enlace por su id de bundle). */
function slugTarget(target: TargetAnclaEntrada): string {
  if ("entidad" in target) return slug(target.entidad);
  if ("opd" in target) return slug(target.opd);
  if ("enlace" in target) return slug(target.enlace);
  return "modelo";
}

function slug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "");
}
