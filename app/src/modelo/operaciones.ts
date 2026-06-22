/**
 * Barrel agregador de operaciones del modelo OPM.
 * Re-exporta todas las funciones públicas desde sub-archivos por dominio:
 * creacion, refinamiento, entidad, estados, enlaces, apariencias, eliminacion.
 *
 * Consumidores: 38 archivos en app/src/. Las firmas públicas se preservan
 * sin cambio respecto a la versión monolítica pre-ronda 9. operaciones.test.ts
 * sigue pasando intacto sobre este barrel.
 *
 * Refs: docs/instrucciones-lineas-dev/ronda9/linea-1-operaciones-dominios.md,
 *       opm-extracted/src/app/models/components/commands/edit-alias.ts:5-30 (patrón comando puro),
 *       opm-extracted/src/app/models/Logical/AggregationLink.ts (separación por familia).
 */

export { crearModelo, crearObjeto, crearProceso } from "./operaciones/creacion";
export { detectarColisionNombre, type ColisionNombre } from "./operaciones/colisionNombre";
export {
  promoverBoceto,
  type PromoverBocetoOpciones,
  type PromoverBocetoEntidadOpciones,
  type PromoverBocetoEnlaceOpciones,
  type BocetoPromovido,
} from "./operaciones/promocion";

export {
  aparienciaEsSubprocesoInternoDeInzoom,
  aplicarOrdenInzoomDerivado,
  derivarOrdenInzoomDeGeometria,
  descomponerProceso,
  distribuirEnlaceExternoEnRefinamiento,
  desplegarObjeto,
  quitarDescomposicionProceso,
  quitarDespliegueObjeto,
  recolectarEnlaceExternoEnRefinamiento,
} from "./operaciones/refinamiento";
export type { DescomposicionProceso, DespliegueObjeto } from "./operaciones/refinamiento";

export {
  renombrarEntidad,
  cambiarEsencia,
  cambiarAfiliacion,
  cambiarLinealidad,
  validarNombreEntidad,
  crearAtributoEnObjeto,
  asignarValorAtributo,
  cambiarTipoValorAtributo,
  configurarSimulacionAtributo,
  esAtributoDerivado,
  entidadPorNombreCanonico,
} from "./operaciones/entidad";
export type { CrearAtributoOpciones, AtributoCreado } from "./operaciones/entidad";

export {
  estadosDeEntidad,
  crearEstadosIniciales,
  agregarEstado,
  renombrarEstado,
  eliminarEstado,
  moverEstado,
  redimensionarEstado,
  quitarEstadosObjeto,
  designarEstadoInicial,
  designarEstadoFinal,
  reordenarEstado,
} from "./operaciones/estados";
export type { EstadosInicialesObjeto, EstadoCreado } from "./operaciones/estados";

export {
  crearEnlace,
  apuntarExtremoEnlace,
  validarMultiplicidad,
  ajustarMultiplicidad,
  moverPuertoEnlace,
  separarGrupoEstructural,
  volverGrupoEstructuralAutomatico,
  cambiarTipoGrupoEstructural,
  fijarOrdenGrupoEstructural,
  relacionesEstructuralesFaltantes,
  traerRelacionesEstructuralesFaltantes,
  agregacionesInzoomFaltantes,
  traerAgregacionesInzoomFaltantes,
  plegarGrupoEstructural,
  plegarCompletoGrupoEstructural,
  relacionesEstructuralesOcultas,
  relacionesSemiplegadasEstructurales,
  relacionesPlegadasEstructurales,
  quitarSemiplegadoEstructural,
  quitarPlegadoCompletoEstructural,
  reanclarEnlaceExternoDerivado,
  volverEnlaceExternoDerivadoAAutomatico,
} from "./operaciones/enlaces";
export type {
  LadoMultiplicidadEnlace,
  LadoExtremoEnlace,
  RelacionesEstructuralesFaltantes,
  RelacionesSemiplegadasEstructurales,
  RelacionesPlegadasEstructurales,
  AgregacionesInzoomFaltantes,
} from "./operaciones/enlaces";

export {
  moverApariencia,
  moverAparienciaPorId,
  actualizarAnclajesSimboloEstructural,
  resetearAnclajesSimboloEstructural,
  actualizarVerticesEnlace,
  actualizarPosicionLabelEnlace,
  actualizarPosicionSimboloEstructural,
  redimensionarApariencia,
  ajustarAlTexto,
  volverAAutoTamano,
  alternarModoTamano,
} from "./operaciones/apariencias";

export {
  actualizarPuertosEnlacesDesdePuntos,
  compartirAnclaExtremosEnlaces,
  fijarAnclaExtremoEnlace,
  sincronizarPuertosEnlaces,
  sincronizarPuertosTodosLosOpd,
  calcularPuertoRelativo,
} from "./operaciones/ports";
export type { AjustePuertoEnlace, LadoPuertoEnlace } from "./operaciones/ports";

export {
  eliminarEntidad,
  eliminarEnlace,
  splitEffectEnPar,
  splitEffectParcial,
  entidadesDelOpd,
} from "./operaciones/eliminacion";

// validarFirmaEnlace vive en helpers.ts (compartido entre refinamiento y enlaces)
// pero se re-exporta como API pública preservando la firma original.
export { validarFirmaEnlace } from "./operaciones/helpers";

export {
  definirBackwardTag,
  definirRequisitosEnlace,
  definirTasaEnlace,
  definirTiempoExcepcionEnlace,
} from "./enlaceMetadatos";

export {
  definirOntologiaOrganizacional,
  evaluarNombreOntologia,
  nombreReforzadoPorOntologia,
} from "./ontologia";

export {
  crearRequirementView,
  crearRequisito,
  marcarEntidadComoRequisito,
  satisfacerRequisito,
} from "./requisitos";
export type { RequisitoCreado } from "./requisitos";

export {
  actualizarMaterializacionSubmodelo,
  conectarSubmodelo,
  descargarVistaSubmodelo,
  desconectarSubmodelo,
  estadoSubmodelo,
  materializacionEfectivaSubmodelo,
  marcarEstadoSubmodelo,
  registrarPadreSubmodelo,
} from "./submodelos";
export type { SubmodeloConectado } from "./submodelos";
