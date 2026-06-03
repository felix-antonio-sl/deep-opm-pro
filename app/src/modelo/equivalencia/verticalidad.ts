import type { Id, Modelo } from "../tipos";
import { entidadDeExtremoFrontera, firmaFronteraDeEnlaces, fronteraDe } from "./frontera";

/**
 * Eje vertical de OPM como construcción categorial (F-V1 / F-V2).
 *
 * El refinamiento (in-zoom / out-zoom) y el árbol de OPDs admiten una lectura
 * categorial verificable bajo la superficie OPM (sin jerga para el modelador):
 *
 *  - F-V1 · in-zoom ⊣ out-zoom como adjunción.  La cara ESTÁTICA (counit iso en
 *    el estado refinado: padre ≅ hijo) ya la observa `observarPreservacionFrontera`.
 *    Aquí aportamos el observable de la UNIT: `firmaFronteraEntidad` permite al
 *    test comprobar que `out-zoom ∘ in-zoom` preserva exactamente la frontera del
 *    proceso ("módulo detalle añadido"). El verificador es puro; el test orquesta
 *    las operaciones para evitar acoplar el kernel a `operaciones/`.
 *
 *  - F-V2 · árbol de OPDs como fibración de Grothendieck.  Cada `enlace-externo-
 *    refinamiento` del hijo es el LIFT CARTESIANO de un enlace de frontera del
 *    padre: `derivado.enlacePadreId` = qué enlace se sube, `derivado.refinamientoId`
 *    = la entidad refinada (el cambio de base). `verificarLiftCartesianoFrontera`
 *    comprueba la propiedad cartesiana: biyección {enlaces de frontera del padre}
 *    ↔ {derivados de frontera del hijo}.
 */

/**
 * Firma de frontera de UNA entidad dentro de un OPD: el patrón de enlaces que la
 * conectan con su exterior, abstraído del interior. Es el observable que la unit
 * η : M ⇒ out-zoom(in-zoom(M)) de la adjunción in-zoom ⊣ out-zoom debe preservar.
 */
export function firmaFronteraEntidad(modelo: Modelo, opdId: Id, entidadId: Id): Set<string> {
  const opd = modelo.opds[opdId];
  if (!opd) return new Set();
  const frontera = new Set(fronteraDe(modelo, entidadId));
  return firmaFronteraDeEnlaces(
    modelo,
    frontera,
    Object.values(opd.enlaces).map((apariencia) => apariencia.enlaceId),
  );
}

export interface LiftCartesianoFrontera {
  /** ¿La proyección de frontera padre→hijo es un lift cartesiano (biyección)? */
  cartesiano: boolean;
  /** Enlaces de frontera del padre que cruzan el contorno del proceso refinado. */
  enlacesFronteraPadre: Id[];
  /** Enlaces de frontera del padre sin derivado en el hijo (lift faltante). */
  faltantes: Id[];
  /** enlacePadreId presente en más de un derivado del hijo (lift no único). */
  duplicados: Id[];
  /** Derivados del hijo cuyo enlacePadreId no cruza la frontera del padre (lift huérfano). */
  huerfanos: Id[];
  /** Derivados cuyo refinamientoId no corresponde a la entidad refinada hacia este OPD (cambio de base incoherente). */
  baseIncoherente: Id[];
}

/**
 * Verifica que la proyección de frontera de un proceso refinado sea un LIFT
 * CARTESIANO (F-V2): biyección entre los enlaces de frontera del padre y los
 * derivados de frontera del hijo, con cambio de base coherente. Puro.
 */
export function verificarLiftCartesianoFrontera(
  modelo: Modelo,
  opdPadreId: Id,
  procesoId: Id,
  opdHijoId: Id,
): LiftCartesianoFrontera {
  const opdPadre = modelo.opds[opdPadreId];
  const opdHijo = modelo.opds[opdHijoId];

  // Enlaces de frontera del padre = en opdPadre, exactamente un extremo es el proceso.
  const enlacesFronteraPadre: Id[] = [];
  const fronteraPadreSet = new Set<Id>();
  if (opdPadre) {
    for (const apariencia of Object.values(opdPadre.enlaces)) {
      const enlace = modelo.enlaces[apariencia.enlaceId];
      if (!enlace) continue;
      const origen = entidadDeExtremoFrontera(enlace.origenId, modelo);
      const destino = entidadDeExtremoFrontera(enlace.destinoId, modelo);
      const tocaProceso = origen === procesoId || destino === procesoId;
      const externo = origen === procesoId ? destino : origen;
      if (tocaProceso && externo != null && externo !== procesoId) {
        enlacesFronteraPadre.push(enlace.id);
        fronteraPadreSet.add(enlace.id);
      }
    }
  }

  // Derivados de frontera del hijo, agrupados por enlacePadreId.
  const porEnlacePadre = new Map<Id, Id[]>();
  const huerfanos: Id[] = [];
  const baseIncoherente: Id[] = [];
  if (opdHijo) {
    for (const apariencia of Object.values(opdHijo.enlaces)) {
      const enlace = modelo.enlaces[apariencia.enlaceId];
      const derivado = enlace?.derivado;
      if (!enlace || derivado?.tipo !== "enlace-externo-refinamiento") continue;

      if (!fronteraPadreSet.has(derivado.enlacePadreId)) {
        huerfanos.push(enlace.id);
        continue;
      }
      // Cambio de base coherente: refinamientoId = entidad refinada que sube a este OPD.
      const refinada = modelo.entidades[derivado.refinamientoId];
      const subeAEsteOpd =
        refinada?.refinamientos?.descomposicion?.opdId === opdHijoId ||
        refinada?.refinamientos?.despliegue?.opdId === opdHijoId;
      if (derivado.refinamientoId !== procesoId || !subeAEsteOpd) {
        baseIncoherente.push(enlace.id);
      }
      const lista = porEnlacePadre.get(derivado.enlacePadreId) ?? [];
      lista.push(enlace.id);
      porEnlacePadre.set(derivado.enlacePadreId, lista);
    }
  }

  const faltantes = enlacesFronteraPadre.filter((id) => !porEnlacePadre.has(id));
  const duplicados = [...porEnlacePadre.entries()].filter(([, ids]) => ids.length > 1).map(([id]) => id);
  const cartesiano =
    faltantes.length === 0 &&
    duplicados.length === 0 &&
    huerfanos.length === 0 &&
    baseIncoherente.length === 0;

  return { cartesiano, enlacesFronteraPadre, faltantes, duplicados, huerfanos, baseIncoherente };
}
