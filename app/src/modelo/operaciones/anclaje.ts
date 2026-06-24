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
import { firmaSnapshotSubmodelo } from "../submodelos/estado";
import { fallo, ok } from "./helpers";

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
): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  return ok({
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [entidadId]: { ...entidad, anclaje: { piezaId, biblioteca } },
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
 * Unidad pura de comparación: el `frozenAtHash` congelado vs el hash vivo. `null`
 * de hash vivo ⇒ `no-resuelto` (la biblioteca no se pudo leer; no se inventa
 * divergencia ni sincronía).
 */
export function evaluarDrift(frozenAtHash: string, hashVivo: string | null): EstadoDrift {
  if (hashVivo === null) return "no-resuelto";
  return hashVivo === frozenAtHash ? "sincronizado" : "divergente";
}

/**
 * Drift de UNA cosa según su anclaje. `null` si la cosa no está anclada (el
 * Centinela no vigila copias locales — solo referencias vivas).
 */
export function evaluarDriftEntidad(entidad: Entidad, hashVivo: string | null): EstadoDrift | null {
  if (!entidad.anclaje) return null;
  return evaluarDrift(entidad.anclaje.biblioteca.frozenAtHash, hashVivo);
}

/**
 * Barrido del modelo: estado de drift de cada cosa ANCLADA. Las no ancladas no
 * entran al reporte. `resolverHashVivo` inyecta la lectura de la biblioteca viva
 * (lo provee el caller con acceso a persistencia); recibe el `Anclaje` completo
 * para que un C4 futuro pueda subir la granularidad a pieza-nivel sin cambiar esta
 * firma. Hoy resuelve biblioteca-nivel por `anclaje.biblioteca.modeloId`.
 */
export function evaluarDriftModelo(
  modelo: Modelo,
  resolverHashVivo: (anclaje: Anclaje) => string | null,
): Record<Id, EstadoDrift> {
  const drift: Record<Id, EstadoDrift> = {};
  for (const [id, entidad] of Object.entries(modelo.entidades)) {
    if (!entidad.anclaje) continue;
    drift[id] = evaluarDrift(entidad.anclaje.biblioteca.frozenAtHash, resolverHashVivo(entidad.anclaje));
  }
  return drift;
}

/**
 * Re-sincronizar: el curador acepta el cambio de la biblioteca y re-congela el
 * `frozenAtHash` al hash vivo. Falla ruidoso si la entidad no existe o no está
 * anclada (anti-silencio: no hay anclaje que re-congelar). Aditivo: solo toca
 * `anclaje.biblioteca.frozenAtHash`.
 */
export function reSincronizarAnclaje(modelo: Modelo, entidadId: Id, hashVivo: string): Resultado<Modelo> {
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
        },
      },
    },
  });
}

/**
 * Soltar (Δ→Σ): la cosa deja de estar anclada y se vuelve copia local desacoplada
 * — pierde comparabilidad (irreversible por diseño: Calco→Anclaje está prohibido,
 * ley de la adjunción). Quita solo `anclaje`; preserva el resto de la cosa. Falla
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
