/**
 * Descriptor puro del mapa del sistema.
 *
 * La proyeccion JointJS vive en render/jointjs; esta frontera expone solo
 * datos derivados del modelo, filtros, marcadores y estadisticas.
 */

export type {
  AristaMapa,
  CriterioResaltado,
  DescriptorMapa,
  EstadisticasModelo,
  EstiloResaltadoMapa,
  JointCellJson,
  NodoMapa,
} from "./mapa/tipos";

export { construirDescriptorMapa } from "./mapa/descriptor";

export { filtrarPorProfundidad, filtrarPorSubarbol } from "./mapa/filtros";

export { aplicarMarcadores, resaltarPorTipo } from "./mapa/marcadores";

export { calcularEstadisticas } from "./mapa/estadisticas";
