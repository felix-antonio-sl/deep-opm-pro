/**
 * Adapter del mapa del sistema para JointJS.
 *
 * La frontera pura vive en canvas/mapaSistema; este adapter expone solo la
 * proyeccion JointJS y tipos de descriptor para consumidores visuales.
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

export { proyectarMapaSistemaAJointCells } from "./mapa/proyeccion";
