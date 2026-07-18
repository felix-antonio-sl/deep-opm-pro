import type { Id, Modelo } from "../tipos";
import { entidadDeExtremoFrontera, firmaFronteraDeEnlaces, fronteraDe } from "./frontera";

/**
 * Observables operativos del refinamiento vertical OPM.
 *
 * `firmaFronteraEntidad` permite comprobar que un round-trip conserva la firma.
 * `verifyBoundaryCorrespondence` comprueba la correspondencia uno-a-uno y
 * la procedencia de enlaces derivados entre padre e hijo. Estos observables son
 * compatibles con una futura lectura categorial, pero por sí solos no construyen
 * una adjunción, una fibración ni un lift cartesiano.
 */

/**
 * Firma de frontera de UNA entidad dentro de un OPD: el patrón de enlaces que la
 * conectan con su exterior, abstraído del interior. Es el observable que el
 * round-trip in-zoom/out-zoom debe preservar.
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

export interface BoundaryCorrespondence {
  /** ¿Existe correspondencia completa y uno-a-uno entre padre e hijo? */
  complete: boolean;
  /** Enlaces de frontera del padre que cruzan el contorno del proceso refinado. */
  enlacesFronteraPadre: Id[];
  /** Enlaces de frontera del padre sin derivado en el hijo. */
  faltantes: Id[];
  /** enlacePadreId presente en más de un derivado del hijo. */
  duplicados: Id[];
  /** Derivados del hijo cuyo enlacePadreId no cruza la frontera del padre. */
  huerfanos: Id[];
  /** Derivados cuyo refinamientoId no corresponde a la entidad refinada hacia este OPD (cambio de base incoherente). */
  baseIncoherente: Id[];
}

/**
 * Verifica la correspondencia entre los enlaces de frontera del padre y los
 * derivados del hijo, incluida la procedencia del refinamiento. Es un chequeo
 * de integridad y biyección; no prueba la propiedad universal de un lift
 * cartesiano. Puro.
 */
export function verifyBoundaryCorrespondence(
  modelo: Modelo,
  opdPadreId: Id,
  procesoId: Id,
  opdHijoId: Id,
): BoundaryCorrespondence {
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
  const complete =
    faltantes.length === 0 &&
    duplicados.length === 0 &&
    huerfanos.length === 0 &&
    baseIncoherente.length === 0;

  return { complete, enlacesFronteraPadre, faltantes, duplicados, huerfanos, baseIncoherente };
}
