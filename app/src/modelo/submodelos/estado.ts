import type { EstadoCargaSubmodelo, Id, Modelo, SubmodeloReferencia } from "../tipos";
import { proyectarSemantico, proyectarSemanticoPieza } from "./firmaSemantica";

export function estadoSubmodelo(ref: SubmodeloReferencia): EstadoCargaSubmodelo {
  if (ref.estado === "desconectado") return "desconectado";
  const materializacion = ref.materializacion;
  if (!materializacion) {
    if (ref.opdVistaId && ref.estado !== "descargado") return ref.estado;
    return "descargado";
  }
  const sourceHash = ref.source?.revisionHash;
  if (sourceHash && materializacion.sourceHash && sourceHash !== materializacion.sourceHash) {
    return "cargado-no-sincronizado";
  }
  return "cargado-sincronizado";
}

export function refConEstadoDerivado(ref: SubmodeloReferencia): SubmodeloReferencia {
  const estado = estadoSubmodelo(ref);
  return {
    ...ref,
    estado,
    modeloId: ref.source?.modeloId ?? ref.modeloId,
    anchorEntidadId: ref.anchor?.entidadId ?? ref.anchorEntidadId,
    ...(ref.materializacion?.opdVistaId ? { opdVistaId: ref.materializacion.opdVistaId } : ref.opdVistaId ? { opdVistaId: ref.opdVistaId } : {}),
    ...(ref.contrato?.compartidas ? { compartidas: ref.contrato.compartidas } : ref.compartidas ? { compartidas: ref.compartidas } : {}),
  };
}

/**
 * Firma de contenido de un `Modelo` (snapshot de submodelo / biblioteca de Piezas del Anclaje).
 *
 * Firma SEMÁNTICA: hashea solo el SIGNIFICADO (tipos, nombres, esencias, refinamientos, enlaces,
 * estados, abanicos) y excluye la PRESENTACIÓN (coords, tamaño, `modoPlegado`, ports, supresión,
 * vértices). La partición campo-a-campo —ratificada por el custodio (Félix)— y la proyección viven
 * en `firmaSemantica.ts` como single source of truth. `ordenarJson` ordena las claves (ignora orden
 * de representación); `proyectarSemantico` descarta lo que no es la cosa. Juntos hacen la firma
 * invariante al round-trip de persistencia y al re-layout ⇒ cero falso-divergente del Centinela.
 *
 * Doctrina: `docs/auditorias/2026-06-26-acta-quietud-firma-centinela.md` (iteración 3 + ratificación
 * HITL del custodio). Leyes que la sellan en pinza: `src/leyes/anclaje-quietud.test.ts` (quietud),
 * `src/leyes/anclaje-sensibilidad.test.ts` (discriminación), `src/leyes/anclaje-particion.test.ts`.
 */
export function firmaSnapshotSubmodelo(modelo: Modelo): string {
  return hashFNV1a(JSON.stringify(ordenarJson(proyectarSemantico(modelo))));
}

/**
 * Firma de contenido de UNA Pieza de una biblioteca (drift granular C4). Hashea la sub-proyección
 * de la VECINDAD RADIO-1 (`proyectarSemanticoPieza`: la entidad-pieza + sus estados + sus enlaces
 * incidentes + abanicos que intersecten), con el MISMO `ordenarJson` + FNV-1a que `firmaSnapshotSubmodelo`
 * (≡ `firmaBiblioteca`): congelar y comparar usan la misma máquina, ese es el invariante que hace
 * falsable el drift de pieza. `null` si la Pieza no existe en la biblioteca (el caller mapea «pieza
 * ausente»). Reusa la partición SSOT (`PARTICION_*`) ⇒ la frontera firmado/excluido de la pieza es la
 * misma que la de la biblioteca: cero falso-divergente por presentación, igual que el grano grueso.
 */
export function firmaPieza(biblioteca: Modelo, piezaId: Id): string | null {
  const proyeccion = proyectarSemanticoPieza(biblioteca, piezaId);
  if (proyeccion === null) return null;
  return hashFNV1a(JSON.stringify(ordenarJson(proyeccion)));
}

function ordenarJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(ordenarJson);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b, "es"))
      .map(([key, item]) => [key, ordenarJson(item)]),
  );
}

function hashFNV1a(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}
