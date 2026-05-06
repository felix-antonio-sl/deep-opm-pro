/**
 * Barrel del mapa del sistema: re-exporta firmas públicas desde sub-archivos
 * por dominio (ronda 9.5):
 * - tipos.ts: NodoMapa, AristaMapa, DescriptorMapa, EstiloResaltadoMapa,
 *   CriterioResaltado, EstadisticasModelo, JointCellJson + helpers de descriptor.
 * - descriptor.ts: construirDescriptorMapa.
 * - proyeccion.ts: proyectarMapaSistemaAJointCells.
 * - filtros.ts: filtrarPorProfundidad, filtrarPorSubarbol.
 * - marcadores.ts: resaltarPorTipo, aplicarMarcadores.
 * - estadisticas.ts: calcularEstadisticas.
 *
 * Consumidores externos (~10 archivos en app/src/store/, app/src/ui/, app/src/persistencia/)
 * siguen importando desde "render/jointjs/mapaSistema" sin cambio.
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
} from "./mapa/tipos";

export { construirDescriptorMapa } from "./mapa/descriptor";

export { proyectarMapaSistemaAJointCells } from "./mapa/proyeccion";

export { filtrarPorProfundidad, filtrarPorSubarbol } from "./mapa/filtros";

export { aplicarMarcadores, resaltarPorTipo } from "./mapa/marcadores";

export { calcularEstadisticas } from "./mapa/estadisticas";
