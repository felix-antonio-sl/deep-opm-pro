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
	  RefinamientoEntidad,
	  UrlObjetoTipada,
	  ImagenEntidad,
	  ValorSlot,
	  Entidad,
	} from "./tipos/entidad";

export type { DesignacionEstado, UnidadTiempo, DuracionTemporal, Estado } from "./tipos/estado";

export type {
  ModoPlegado,
  ModoTamano,
  OrdenPartesPlegado,
  LayoutEstados,
  EstiloApariencia,
  Apariencia,
} from "./tipos/apariencia";

export type {
  TipoEnlace,
  DerivacionOrigen,
  ExtremoKind,
  Modificador,
  SubtipoModificador,
  EnlaceEstilo,
  ExtremoEnlace,
  DerivacionEnlace,
  Enlace,
  AparienciaEnlace,
} from "./tipos/enlace";

export type { OperadorAbanico, Abanico } from "./tipos/abanico";

export type { Opd } from "./tipos/opd";

export type { VersionResumen, Modelo } from "./tipos/modelo";

export type { OrigenPestana, HistorialEntrada, Pestana } from "./tipos/pestana";

export type { BloqueOplEstado } from "./tipos/opl";

export type { UiPortapapelesVisual, PreferenciasUiUsuario } from "./tipos/ui";

export type { AmbitoPlantilla, Plantilla, PlantillaIndice } from "./tipos/plantilla";
