// Operación del modo `anclaje` (referencia viva): ancla una cosa a un tipo de una
// biblioteca de tipos externa (la greda gist) SIN copiar. Es el "anti-injerto":
// espeja el contrato de referencia de `conectarSubmodelo` pero NO materializa el
// snapshot (≠ `injertarEstereotipo`/graft de D6, que clona-e-injerta). Aditivo: no
// toca `estereotipoId` (marker local del graft) ni el resto del modelo.
//
// Derivado de `gist-opm/docs/derivaciones/brecha-anclaje-referencial-opforja-2026-06-23.md`
// §7.3 y del acta `docs/auditorias/2026-06-24-acta-alcance-anclaje-gist.md`. La forma
// OPL/visual del anclaje (C6/C7) espera doctrina custodio-kora (a); este corte es solo
// el kernel referencial + su eval-de-mecanismo.
import type { Anclaje, EstadoDrift, Entidad, Id, Modelo, Resultado, BibliotecaRef } from "../tipos";
import { firmaSnapshotSubmodelo, firmaPieza } from "../submodelos/estado";
import { fallo, ok } from "./helpers";

export { firmaPieza };

/**
 * Ancla `entidadId` al tipo `piezaId` de la biblioteca `biblioteca`, como
 * referencia viva. NO clona ni materializa: el modelo gana 0 entidades; solo se
 * asigna `Entidad.anclaje`. La resolución del tipo contra la biblioteca
 * (render/OPL/validación, drift por `frozenAtHash`) es lazy y vive fuera de esta
 * operación pura.
 */
export function anclarAPieza(
  modelo: Modelo,
  entidadId: Id,
  biblioteca: BibliotecaRef,
  piezaId: Id,
  frozenAtPieza?: string,
): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  const anclaje: Anclaje = {
    piezaId,
    biblioteca,
    // ADITIVO (C4): si el caller congela la firma de la VECINDAD de la Pieza, el anclaje nace a grano
    // pieza. Sin este 5º arg, nace a grano de-biblioteca legacy (`biblioteca.frozenAtHash`).
    ...(frozenAtPieza !== undefined ? { frozenAtPieza } : {}),
  };
  return ok({
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [entidadId]: { ...entidad, anclaje },
    },
  });
}

// --- Centinela de Drift (corte C-1) ----------------------------------------
// El Anclaje gana su valor cuando AVISA: una cosa anclada debe enterarse si la
// biblioteca cambió bajo sus pies. Acta: docs/auditorias/2026-06-24-acta-valor-
// anclaje-centinela-drift.md. Kernel PURO: no lee persistencia — recibe el hash
// vivo (que el caller resuelve contra Postgres/API) o lo resuelve por inyección.

/**
 * Hash VIVO canónico de una biblioteca de Piezas (la greda gist es un `Modelo`
 * persistido aparte). Es el único eslabón nuevo del Centinela: el primer pedacito
 * de la resolución externa C4, sin la cascada completa. Comparte algoritmo con la
 * firma de snapshot de submodelos —ambos son "firma de contenido de un Modelo"—
 * para que congelar (`BibliotecaRef.frozenAtHash`) y comparar usen la MISMA
 * función: ese es el invariante que hace falsable el drift. Si el hash de
 * biblioteca llegara a divergir del de submodelo, se desacopla AQUÍ.
 */
export function firmaBiblioteca(biblioteca: Modelo): string {
  return firmaSnapshotSubmodelo(biblioteca);
}

/**
 * Unidad pura de comparación: el frozen congelado vs el hash vivo. `null`
 * de hash vivo ⇒ `no-resuelto` (la biblioteca no se pudo leer; no se inventa
 * divergencia ni sincronía). INTACTO: es hash-vs-hash, agnóstico al grano.
 */
export function evaluarDrift(frozenAtHash: string, hashVivo: string | null): EstadoDrift {
  if (hashVivo === null) return "no-resuelto";
  return hashVivo === frozenAtHash ? "sincronizado" : "divergente";
}

// --- Granularidad del Centinela (C4) ---------------------------------------
// La PRESENCIA de `frozenAtPieza` decide el grano. Un único predicado que comparten
// el lado del FROZEN (qué se congeló) y el lado VIVO (qué se re-computa): si divergen,
// el Centinela compararía peras con manzanas. SSOT del grano = `granularidadAnclaje`.

/** `"pieza"` si el anclaje congeló `frozenAtPieza` (grano C4); `"biblioteca"` si solo tiene `frozenAtHash`. */
export function granularidadAnclaje(anclaje: Anclaje): "pieza" | "biblioteca" {
  return anclaje.frozenAtPieza !== undefined ? "pieza" : "biblioteca";
}

/** El frozen VIGENTE del anclaje según su grano: `frozenAtPieza` si lo tiene, si no `frozenAtHash`. */
function frozenDelAnclaje(anclaje: Anclaje): string {
  return anclaje.frozenAtPieza ?? anclaje.biblioteca.frozenAtHash;
}

/**
 * Centinela de «pieza ausente»: hash vivo SENTINELA cuando el grano es pieza, la biblioteca SÍ se
 * leyó, pero la Pieza ya no existe en ella. NUNCA colisiona con un `fnv1a-xxxxxxxx` ⇒ `evaluarDrift`
 * da `divergente` (decisión ratificada: pieza borrada ⇒ `divergente`, NO `no-resuelto`; la
 * biblioteca se leyó, la Pieza desapareció bajo los pies de la cosa anclada — eso es deriva, no
 * irresolución). NO se inventa un 4º `EstadoDrift`.
 */
export const CENTINELA_PIEZA_AUSENTE = "pieza-ausente" as const;

/**
 * Firma VIVA de un anclaje contra su biblioteca resuelta (o `null` si no se pudo leer). Centraliza
 * el GRANO + el mapeo de «pieza ausente». Es el corazón puro del resolutor del store:
 *   · biblioteca `null`            ⇒ `null`                   (no-resuelto: honestidad temporal).
 *   · grano biblioteca             ⇒ `firmaBiblioteca`        (hash de toda la biblioteca, legacy).
 *   · grano pieza, pieza presente  ⇒ `firmaPieza`             (hash de la vecindad RADIO-1).
 *   · grano pieza, pieza AUSENTE   ⇒ `CENTINELA_PIEZA_AUSENTE` (⇒ divergente, ver arriba).
 */
export function firmaVivaAnclaje(anclaje: Anclaje, biblioteca: Modelo | null): string | null {
  if (biblioteca === null) return null;
  if (granularidadAnclaje(anclaje) === "biblioteca") return firmaBiblioteca(biblioteca);
  return firmaPieza(biblioteca, anclaje.piezaId) ?? CENTINELA_PIEZA_AUSENTE;
}

/**
 * Drift de UNA cosa según su anclaje. `null` si la cosa no está anclada (el
 * Centinela no vigila copias locales — solo referencias vivas). Grano-aware: compara el frozen
 * VIGENTE (`frozenDelAnclaje`) contra el `hashVivo`, que el caller debe haber resuelto AL MISMO
 * GRANO (firma de pieza vs firma de biblioteca) — `firmaVivaAnclaje` garantiza ese acuerdo.
 */
export function evaluarDriftEntidad(entidad: Entidad, hashVivo: string | null): EstadoDrift | null {
  if (!entidad.anclaje) return null;
  return evaluarDrift(frozenDelAnclaje(entidad.anclaje), hashVivo);
}

/**
 * Barrido del modelo: estado de drift de cada cosa ANCLADA. Las no ancladas no
 * entran al reporte. `resolverHashVivo` inyecta la lectura VIVA de la biblioteca
 * (lo provee el caller con acceso a persistencia) AL GRANO del anclaje: recibe el `Anclaje`
 * completo y, vía `firmaVivaAnclaje`, devuelve `firmaPieza` o `firmaBiblioteca` según el grano.
 * El frozen se elige con el MISMO predicado (`frozenDelAnclaje`) ⇒ pieza-vs-pieza, biblioteca-vs-biblioteca.
 */
export function evaluarDriftModelo(
  modelo: Modelo,
  resolverHashVivo: (anclaje: Anclaje) => string | null,
): Record<Id, EstadoDrift> {
  const drift: Record<Id, EstadoDrift> = {};
  for (const [id, entidad] of Object.entries(modelo.entidades)) {
    if (!entidad.anclaje) continue;
    drift[id] = evaluarDrift(frozenDelAnclaje(entidad.anclaje), resolverHashVivo(entidad.anclaje));
  }
  return drift;
}

/**
 * Re-sincronizar: el curador acepta el cambio de la biblioteca y re-congela el frozen al hash vivo.
 * Falla ruidoso si la entidad no existe o no está anclada (anti-silencio: no hay anclaje que
 * re-congelar). SIEMPRE refresca `biblioteca.frozenAtHash` con `hashVivo`.
 *
 * Grano-aware (C4): si el caller pasa `frozenAtPiezaVivo` (la `firmaPieza` viva de la Pieza),
 * re-sincronizar TAMBIÉN escribe `anclaje.frozenAtPieza` ⇒ SUBE EL GRANO: un anclaje legacy de
 * biblioteca queda MODERNIZADO a grano pieza tras re-sincronizar (decisión ratificada). Sin ese arg
 * (callers legacy de 3 args), el grano no cambia: solo se refresca el `frozenAtHash` de biblioteca.
 */
export function reSincronizarAnclaje(
  modelo: Modelo,
  entidadId: Id,
  hashVivo: string,
  frozenAtPiezaVivo?: string,
): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  if (!entidad.anclaje) return fallo(`Entidad no está anclada: ${entidadId}`);
  return ok({
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [entidadId]: {
        ...entidad,
        anclaje: {
          ...entidad.anclaje,
          biblioteca: { ...entidad.anclaje.biblioteca, frozenAtHash: hashVivo },
          ...(frozenAtPiezaVivo !== undefined ? { frozenAtPieza: frozenAtPiezaVivo } : {}),
        },
      },
    },
  });
}

/**
 * Soltar (Δ→Σ): la cosa deja de estar anclada y se vuelve copia local desacoplada
 * — pierde comparabilidad. Es irreversible por contrato de producto: ningún
 * gesto reconstruye automáticamente el origen. Quita solo `anclaje`; preserva el resto de la cosa. Falla
 * ruidoso si la entidad no existe o ya es local (no hay anclaje que soltar).
 */
export function soltarAnclaje(modelo: Modelo, entidadId: Id): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  if (!entidad.anclaje) return fallo(`Entidad no está anclada: ${entidadId}`);
  const { anclaje: _anclaje, ...sinAnclaje } = entidad;
  return ok({
    ...modelo,
    entidades: { ...modelo.entidades, [entidadId]: sinAnclaje },
  });
}
