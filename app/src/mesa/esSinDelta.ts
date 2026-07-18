import { exportarModelo, hidratarModelo } from "../serializacion/json";

/**
 * Guard de CLAUSURA de `mesa push` (push∘pull sin delta debe ser no-op): ¿el
 * bundle candidato tiene el MISMO CONTENIDO PERSISTIDO que el `json` remoto
 * vigente? Si sí, el CLI aborta ANTES de escribir — un pull sin ediciones
 * seguido de un push no debe crear revisión ni versión, o cada ciclo
 * pull→push infla la historia sin motivo.
 *
 * QUÉ COMPARA (oráculo CONSERVADOR, todo el contenido de `Modelo`): se hidrata ambos
 * lados (`hidratarModelo`) y se compara su forma CANÓNICA re-exportada
 * (`exportarModelo`) — string a string. `exportarModelo` es determinista
 * (mismo `Modelo` ⇒ mismo string, sin importar formato/espaciado de bytes de
 * la entrada) e incluye todo lo persistido dentro del modelo: el grafo OPM
 * (entidades/estados/enlaces/opds/abanicos), el layout/apariencias, Y el
 * contenido "meta" de mesa — `notasMesa`, `anclasNormativas`, `procedencia`,
 * `descripcion`, `estereotipos`, `ontologia`, `satisfaccionesRequisito`,
 * `archivado*`, `versiones`. Por eso un round-trip de persistencia (mismo
 * contenido, bytes distintos: reindentado/recompactado) sigue dando `true`,
 * pero cualquier campo del `Modelo` que difiera da `false` — incluido un
 * re-layout puro (mover una apariencia SÍ cuenta como delta ahora: es el
 * precio correcto de nunca tragarse silenciosamente una edición real; no
 * intentar ser astuto ignorando layout).
 *
 * EXCLUSIÓN DELIBERADA: `DocumentoModelo.carpetaId` no pertenece a `Modelo`.
 * Su autoridad viva es el índice/record del workspace y el Bearer del agente
 * no puede mutarlo. Una diferencia solo de carpeta no es un delta de este
 * puente; tratarla como tal crearía una revisión sin efectuar el movimiento y
 * podría dejar JSON y workspace en desacuerdo.
 *
 * POR QUÉ NO `firmaSnapshotSubmodelo` (el hash semántico del Centinela) — BUG
 * REAL hallado en revisión y corregido aquí: esa firma
 * (`src/modelo/submodelos/firmaSemantica.ts::PARTICION_MODELO`) fue
 * construida y ratificada para una pregunta DISTINTA — "¿cambió el
 * significado OPM (drift de ancla/pieza)?" — y por eso EXCLUYE
 * deliberadamente `notasMesa`, `anclasNormativas`, `procedencia`,
 * `descripcion`, `estereotipos`, `ontologia`, `satisfaccionesRequisito` y
 * `archivado*` de la firma. Para ESTA pregunta — "¿el push cambia algo que
 * el puente mesa transporta?" — esos campos SON la carga útil del puente
 * (ratificar un ancla o agregar una nota de mesa es exactamente lo que un
 * push de la skill existe para escribir). Usar la firma del Centinela aquí
 * hacía que `esSinDelta` devolviera `true` ante una ratificación o una nota
 * nuevas → `cmdPush` abortaba ANTES de escribir → pérdida silenciosa de la
 * ratificación/nota (ver `esSinDelta.test.ts`, casos de regresión).
 *
 * Dirección de seguridad: ante cualquier duda, HAY delta (se permite la
 * escritura) — nunca se omite una escritura por optimismo.
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
  return exportarModelo(candidato.value) === exportarModelo(remoto.value);
}
