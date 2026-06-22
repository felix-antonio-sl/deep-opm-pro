/**
 * Barrel agregador de tipos canónicos del modelo OPM.
 * Re-exporta tipos desde sub-archivos por dominio:
 * comunes, entidad, estado, apariencia, enlace, abanico, opd, modelo, pestana, opl, ui.
 *
 * Consumidores: 122+ archivos en app/src/. Las firmas de tipos se preservan
 * sin cambio respecto a la versión monolítica pre-ronda 9. Cero diff runtime
 * (los tipos son zero-cost).
 *
 * Refs: docs/instrucciones-lineas-dev/ronda9/linea-5-tipos-dominios.md,
 *       opm-extracted/src/app/models/DrawnPart/OpmObject.ts:5-15,
 *       opm-extracted/src/app/models/Logical/AggregationLink.ts.
 */

export type { Id, PestanaId, Posicion, Resultado } from "./tipos/comunes";

export type {
  TipoEntidad,
  Esencia,
  Afiliacion,
  TipoRefinamiento,
  ModoDespliegueObjeto,
	  TipoUrlObjeto,
	  ModoImagenEntidad,
	  TipoValorSlot,
	  ValorConcreto,
	  DistribucionSimulacion,
	  RefinamientoEntidad,
	  SlotRefinamiento,
	  UrlObjetoTipada,
	  ImagenEntidad,
	  ValorSlot,
	  FilaTextualSimulacion,
	  ConfiguracionSimulacionNumerica,
	  ConfiguracionSimulacionTextual,
	  ConfiguracionSimulacionEntidad,
	  ParametrosSimulacionEntidad,
	  Entidad,
	} from "./tipos/entidad";

export type { DesignacionEstado, UnidadTiempo, DuracionTemporal, Estado } from "./tipos/estado";

export type {
  ModoPlegado,
  ModoTamano,
  OrdenPartesPlegado,
  LayoutEstados,
  PuertoApariencia,
  RolContextoRefinamiento,
  ContextoRefinamientoApariencia,
  Apariencia,
} from "./tipos/apariencia";

export type {
  TipoEnlace,
  DerivacionOrigen,
  ExtremoKind,
  Modificador,
  SubtipoModificador,
  ExtremoEnlace,
  DerivacionEnlace,
  RolEfectoEscindido,
  EfectoEscindido,
  Enlace,
  AnclajeSimboloEstructural,
  AnclajesSimboloEstructural,
  OffsetLabelEnlace,
  PosicionLabelEnlace,
  AparienciaEnlace,
} from "./tipos/enlace";

export type { OperadorAbanico, PuertoAbanicoExacto, Abanico } from "./tipos/abanico";

export type { Opd } from "./tipos/opd";

export type { VersionResumen, Modelo } from "./tipos/modelo";

export type {
  ModoReforzamientoOntologia,
  TerminoOntologia,
  OntologiaOrganizacional,
  DurezaRequisito,
  EstadoSatisfaccionRequisito,
  RequisitoEntidadMetadata,
  TargetSatisfaccionRequisito,
  SatisfaccionRequisito,
  ReferenciaNorma,
  EstadoAncla,
  NivelAutoridad,
  EstadoRatificacion,
  TargetAncla,
  RatificacionAncla,
  AnclaNormativa,
  NotaMesa,
  SelloProcedencia,
  EstadoCargaSubmodelo,
  SubmodeloSource,
  SubmodeloAnchor,
  SubmodeloContrato,
  SubmodeloMaterializacion,
  SubmodeloReferencia,
  ReferenciaPadreSubmodelo,
  OpdVista,
  DecisionPolicy,
} from "./tipos/extensiones";
export { COMPONENTES_SELLO } from "./tipos/extensiones";

export type { SeveridadAviso, CodigoChecker, AvisoMetodologico, NavegacionAviso } from "./tipos/avisos";

export type { OrigenPestana, HistorialEntrada, Pestana } from "./tipos/pestana";

export type { BloqueOplEstado } from "./tipos/opl";

export type { CrucesPuenteSkill, GridConfig, UiPortapapelesVisual, PreferenciasUiUsuario } from "./tipos/ui";
