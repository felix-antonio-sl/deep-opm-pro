// Verbo Calcar para Piezas de biblioteca externa (corte "gesto de anclar", B2+B3).
//
// Clona UNA entidad cruda (objeto/proceso) de una biblioteca externa al OPD activo,
// con identidad FRESCA y SIN anclaje. Es el camino fino del verbo Calcar para Piezas
// externas — ⚠️ distinto de `injertarEstereotipo`, que clona un subgrafo-PLANTILLA del
// catálogo LOCAL con su ancla `estereotipoId`. Una Pieza de biblioteca es una ENTIDAD,
// no un `Estereotipo.plantilla`; por eso este camino existe aparte (spec §1, nudo
// resuelto). Patrones-subgrafo y enlaces-como-Pieza quedan DIFERIDOS: el MVP ancla
// entidades-tipo (el caso HODOM→gist).
//
// Aditivo y acotado: NO toca el kernel del Anclaje (`operaciones/anclaje.ts`) ni el
// motor de plantillas (`injertoEstereotipo.ts`). El verbo Anclar (store) compone este
// Calco + `anclarAPieza` (invariante "Unlink = Σ": un Anclaje es un Calco con vínculo).
//
// Puro: sin JointJS, sin DOM, sin Zustand.
// Diseño rector: docs/superpowers/specs/2026-06-29-gesto-anclar-puerta-design.md §1.
import { CANON } from "../constantes";
import type { Apariencia, Entidad, Estado, Id, Modelo, Posicion, Resultado } from "../tipos";
import { fallo, ok, siguienteId } from "./helpers";

export interface ClonEntidadResultado {
  modelo: Modelo;
  /** Id FRESCO de la entidad calcada en el modelo destino. */
  entidadId: Id;
  /** Ids frescos de los estados clonados. */
  estadosCreados: Id[];
  /** Id de la aparición creada en el OPD destino. */
  aparienciaId: Id;
}

function clonar<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * Calca `entidad` (una Pieza de biblioteca) al `opdId` del `modelo` destino, en
 * `posicion`. Clona la entidad + sus `estados` con IDs FRESCOS, crea la aparición y
 * NO deja anclaje (Calcar = copiar y olvidar). Descarta los campos atados al CONTEXTO
 * de la biblioteca de origen —`refinamientos` (apuntan a OPDs ajenos), `estereotipoId`
 * (catálogo local de origen), `anclaje` y `requisito`—: el MVP ancla entidades-tipo.
 *
 * `estados` se filtra por `entidad.id`, así que el caller puede pasar todos los estados
 * de la biblioteca de origen sin pre-filtrar. El nombre se conserva tal cual (igual que
 * `injertarEstereotipo`): es una copia del tipo, no se renombra para deduplicar.
 */
export function clonarEntidadConIdFresco(
  modelo: Modelo,
  entidad: Entidad,
  estados: Estado[],
  opdId: Id,
  posicion: Posicion,
): Resultado<ClonEntidadResultado> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);

  let siguiente: Modelo = { ...modelo };
  const proximo = (prefijo: string): Id => {
    const id = siguienteId(siguiente, prefijo);
    siguiente = { ...siguiente, nextSeq: siguiente.nextSeq + 1 };
    return id;
  };

  // 1. Entidad: id fresco; sin los campos atados al contexto de la biblioteca de origen.
  const entidadId = proximo(entidad.tipo === "objeto" ? "o" : "p");
  const {
    id: _id,
    refinamientos: _refinamientos,
    estereotipoId: _estereotipoId,
    anclaje: _anclaje,
    requisito: _requisito,
    ...resto
  } = clonar(entidad);
  const entidadClon: Entidad = { ...resto, id: entidadId };

  // 2. Estados de ESTA entidad: ids frescos, entidadId remapeado al clon.
  const estadosClon: Record<Id, Estado> = {};
  const estadosCreados: Id[] = [];
  for (const estado of estados) {
    if (estado.entidadId !== entidad.id) continue;
    const estadoId = proximo("s");
    estadosClon[estadoId] = { ...clonar(estado), id: estadoId, entidadId };
    estadosCreados.push(estadoId);
  }

  // 3. Aparición en el OPD destino (dimensiones canónicas).
  const aparienciaId = proximo("a");
  const apariencia: Apariencia = {
    id: aparienciaId,
    entidadId,
    opdId,
    x: posicion.x,
    y: posicion.y,
    width: CANON.dims.cosaWidth,
    height: CANON.dims.cosaHeight,
  };

  const modeloResultante: Modelo = {
    ...siguiente,
    entidades: { ...siguiente.entidades, [entidadId]: entidadClon },
    estados: { ...siguiente.estados, ...estadosClon },
    opds: {
      ...siguiente.opds,
      [opdId]: { ...opd, apariencias: { ...opd.apariencias, [aparienciaId]: apariencia } },
    },
  };

  return ok({ modelo: modeloResultante, entidadId, estadosCreados, aparienciaId });
}
