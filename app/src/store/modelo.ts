import { crearPestanaNueva } from "./pestanas";
import type { CrearSlice, ModeloSlice } from "./tipos";
import { accionesCanvas } from "./modelo/acciones-canvas";
import { accionesCapacidades } from "./modelo/acciones-capacidades";
import { accionesEnlace } from "./modelo/acciones-enlace";
import { accionesEntidad } from "./modelo/acciones-entidad";
import { accionesEstados } from "./modelo/acciones-estados";
import { accionesOpd } from "./modelo/acciones-opd";
import { accionesUI } from "./modelo/acciones-ui";

/**
 * Barrel composer del slice `modelo` del store.
 *
 * Estado inicial + spread de 6 fragmentos por dominio:
 * - acciones-entidad: crear, renombrar, esencia/afiliación, alias/unidad/descripción/URLs, layoutEstados, toggles.
 * - acciones-estados: estados de objeto, designaciones, suprimir, duración modal.
 * - acciones-opd: refinamiento (descomponer/desplegar), navegación OPD, eliminar OPD desde árbol, navegarAviso.
 * - acciones-enlace: tipo enlace, multiplicidad, extremos, abanicos, modificadores, auto-invocación, etiqueta, ruta.
 * - acciones-canvas: selección, edición desde OPL, plegado, mover apariencia/vértices, estilo, copiar/exportar OPL, deshacer/rehacer.
 * - acciones-ui: menú principal, diálogos persistencia, nuevo modelo, modal URLs.
 *
 * Refs:
 * - docs/instrucciones-lineas-dev/ronda9.5/ (sub-slice ronda 9.5)
 * - opm-extracted/src/app/modules/app/model.service.ts:5-190 (ModelService canónico)
 */

export const pestanaInicial = crearPestanaNueva();
export const modeloInicial = pestanaInicial.modelo;

export type { ModeloSlice } from "./tipos";

export const createModeloSlice: CrearSlice<ModeloSlice> = (set, get) => ({
  modelo: modeloInicial,
  opdActivoId: modeloInicial.opdRaizId,
  mensaje: null,
  dirty: false,
  dirtyModelo: false,
  puedeDeshacer: false,
  puedeRehacer: false,
  idsResaltadosTemporales: [],
  // IFML H-3 / Ronda 15 L3: NavigationFlow tipado del flujo de creación.
  nuevaCosaPendiente: null,

  ...accionesEntidad(set, get),
  ...accionesEstados(set, get),
  ...accionesOpd(set, get),
  ...accionesEnlace(set, get),
  ...accionesCapacidades(set, get),
  ...accionesCanvas(set, get),
  ...accionesUI(set, get),
} as ModeloSlice);
