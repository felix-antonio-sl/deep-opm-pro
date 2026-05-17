/**
 * Adapter del mapa del sistema para JointJS.
 *
 * La frontera pura vive en canvas/mapaSistema; este barrel conserva la
 * proyeccion JointJS y re-exporta el contrato de descriptor para los
 * consumidores visuales que construyen cells.
 *
 * Refs: HU-21.* mapa del sistema, docs/instrucciones-lineas-dev/ronda9.5/.
 */

export type {
  AristaMapa,
  CriterioResaltado,
  DescriptorMapa,
  EstadisticasModelo,
  EstiloResaltadoMapa,
  JointCellJson,
  NodoMapa,
} from "../../canvas/mapaSistema";

export { construirDescriptorMapa } from "../../canvas/mapaSistema";

export { proyectarMapaSistemaAJointCells } from "./mapa/proyeccion";

export { filtrarPorProfundidad, filtrarPorSubarbol } from "../../canvas/mapaSistema";

export { aplicarMarcadores, resaltarPorTipo } from "../../canvas/mapaSistema";

export { calcularEstadisticas } from "../../canvas/mapaSistema";
