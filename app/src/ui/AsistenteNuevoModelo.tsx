/**
 * Barrel agregador del wizard de creación de modelo.
 * Re-exporta AsistenteNuevoModelo desde asistente/Asistente.tsx.
 *
 * El componente original (935 LOC) se descompuso en:
 * - asistente/{Bienvenida,EtapaFuncionPrincipal,EtapaBeneficiario,EtapaAtributo,
 *   EtapaHandler,EtapaNombreSistema,EtapaHerramientas,EtapaEntradas,EtapaSalidas,
 *   EtapaAmbientales,EtapaConfirmar}.tsx (un componente por etapa, prop-driven)
 * - asistente/Asistente.tsx (orquestador del wizard)
 * - asistente/estilos.ts (objeto S compartido entre etapas)
 *
 * API publica preservada: export AsistenteNuevoModelo. Comportamiento observable
 * idéntico (orden de etapas, opcionalidad, validaciones, navegación, data-testid).
 *
 * Refs: docs/instrucciones-lineas-dev/ronda9/linea-3-asistente-etapas.md.
 */

export { AsistenteNuevoModelo } from "./asistente/Asistente";
