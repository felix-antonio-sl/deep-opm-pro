import { hidratarModelo } from "../serializacion/json";
import { firmaSnapshotSubmodelo } from "../modelo/submodelos";

/**
 * Guard de CLAUSURA de `mesa push` (push∘pull sin delta debe ser no-op): ¿el
 * bundle candidato tiene el MISMO SIGNIFICADO que el `json` remoto vigente?
 * Si sí, el CLI aborta ANTES de escribir — un pull sin ediciones seguido de un
 * push no debe crear revisión ni versión, o cada ciclo pull→push infla la
 * historia sin motivo.
 *
 * Compara `firmaSnapshotSubmodelo` (la firma SEMÁNTICA del Centinela —
 * `src/modelo/submodelos/estado.ts`, doctrina ratificada en
 * `docs/auditorias/2026-06-26-acta-quietud-firma-centinela.md`) en vez de
 * `exportarContextoSkill`: esta última es un documento humano/skill-readable
 * (markdown fechado, pensado para pegar en una sesión), no un oráculo de
 * igualdad de contenido. `firmaSnapshotSubmodelo` SÍ fue construida y sellada
 * exactamente para esta pregunta — proyecta el significado (tipos, nombres,
 * refinamientos, enlaces, estados, abanicos) y EXCLUYE la presentación
 * (coords, tamaño, `modoPlegado`, ports, supresión), con orden de claves
 * canonicalizado (`ordenarJson`) — así que un round-trip de persistencia o un
 * re-layout incidental NUNCA la mueve, y sí la mueve cualquier edición real.
 * Reusa la misma máquina que ya prueba quietud (`anclaje-quietud.test.ts`) y
 * sensibilidad (`anclaje-sensibilidad.test.ts`) en vez de reinventar una
 * comparación ad-hoc.
 *
 * Falla ABIERTA (`false`, "hay delta") si cualquiera de los dos JSON no
 * hidrata: este guard no es el gate de validez del bundle (esa regla vive en
 * `evaluarPush`, regla 1) — ante un error de comparación, deja pasar al resto
 * del pipeline en vez de bloquear un push legítimo con un mensaje engañoso de
 * "sin cambios".
 */
export function esSinDelta(bundleJson: string, remoteJson: string): boolean {
  const candidato = hidratarModelo(bundleJson);
  const remoto = hidratarModelo(remoteJson);
  if (!candidato.ok || !remoto.ok) return false;
  return firmaSnapshotSubmodelo(candidato.value) === firmaSnapshotSubmodelo(remoto.value);
}
