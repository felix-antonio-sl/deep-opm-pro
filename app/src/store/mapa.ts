import { construirDescriptorMapa } from "../canvas/mapaSistema";
import type { CrearSlice, MapaSlice } from "./tipos";
import {
  leerPreferenciasMapa,
  limitar,
  persistirPreferenciasMapa,
} from "./runtime";

export type { MapaSlice } from "./tipos";

export const createMapaSlice: CrearSlice<MapaSlice> = (set, get) => ({
  vistaMapaActiva: false,
  descriptorMapaCache: null,
  mapaProfundidadMaxima: null,
  mapaSubarbolRaizId: null,
  mapaCriterioResaltado: "ninguno",
  mapaZoom: 1,
  mapaPanX: 0,
  mapaPanY: 0,
  mapaAutoRefresh: true,
  mapaUltimoVisitadoOpdId: null,
  mapaTooltipActivoId: null,
  mapaPanelFiltrosAbierto: false,
  mapaPanelEstadisticasAbierto: false,

  abrirVistaMapa() {
    const { modelo, modeloPersistidoId, indice, contextoSimulacion, readOnlyPrevSimulacion } = get();
    // P0-2 ronda 4: Mapa y Simulacion son mutuamente excluyentes.
    // Si hay simulacion activa, restauramos readOnly y la limpiamos.
    // Cancelamos tambien modoEnlace y modoCreacion (no aplican en vista mapa).
    set({
      vistaMapaActiva: true,
      descriptorMapaCache: construirDescriptorMapa(modelo),
      ...leerPreferenciasMapa(indice, modeloPersistidoId),
      mensaje: null,
      modoEnlace: null,
      modoCreacion: null,
      // P1-5 ronda 4: editor inline (`nuevaCosaPendiente`) no debe sobrevivir
      // un cambio de contexto. Cualquier modo que no sea Modelar lo descarta.
      nuevaCosaPendiente: null,
      ...(contextoSimulacion !== null ? {
        contextoSimulacion: null,
        readOnly: readOnlyPrevSimulacion ?? false,
        readOnlyPrevSimulacion: null,
      } : {}),
    });
  },

  cerrarVistaMapa() {
    set({ vistaMapaActiva: false, descriptorMapaCache: null, mensaje: null });
  },

  refrescarVistaMapa() {
    const { modelo } = get();
    set({
      descriptorMapaCache: construirDescriptorMapa(modelo),
      mensaje: "Mapa actualizado",
    });
  },

  saltarAOpdDesdeMapa(opdId) {
    const { modelo, opdActivoId } = get();
    if (!modelo.opds[opdId]) {
      set({ mensaje: `OPD no existe: ${opdId}` });
      return;
    }
    set({
      vistaMapaActiva: false,
      descriptorMapaCache: null,
      opdActivoId: opdId,
      mapaUltimoVisitadoOpdId: opdActivoId,
      seleccionId: null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  fijarMapaProfundidad(max) {
    const estado = get();
    const valor = max === null ? null : Math.max(1, Math.floor(max));
    const indice = persistirPreferenciasMapa(estado, { profundidadMaxima: valor });
    set({ mapaProfundidadMaxima: valor, indice });
  },

  fijarMapaSubarbol(raizId) {
    const estado = get();
    const valor = raizId && estado.modelo.opds[raizId] ? raizId : null;
    const indice = persistirPreferenciasMapa(estado, { subarbolRaizId: valor });
    set({ mapaSubarbolRaizId: valor, indice });
  },

  fijarMapaCriterioResaltado(criterio) {
    const estado = get();
    const indice = persistirPreferenciasMapa(estado, { criterioResaltado: criterio });
    set({ mapaCriterioResaltado: criterio, indice });
  },

  fijarMapaZoom(zoom) {
    const estado = get();
    const valor = limitar(zoom, 0.25, 2);
    const indice = persistirPreferenciasMapa(estado, { zoom: valor });
    set({ mapaZoom: valor, indice });
  },

  fijarMapaPan(x, y) {
    const estado = get();
    const panX = Math.round(x);
    const panY = Math.round(y);
    const indice = persistirPreferenciasMapa(estado, { panX, panY });
    set({ mapaPanX: panX, mapaPanY: panY, indice });
  },

  toggleMapaAutoRefresh() {
    const estado = get();
    const autoRefresh = !estado.mapaAutoRefresh;
    const indice = persistirPreferenciasMapa(estado, { autoRefresh });
    set({ mapaAutoRefresh: autoRefresh, indice });
  },

  fijarMapaTooltip(opdId) {
    set({ mapaTooltipActivoId: opdId });
  },

  toggleMapaPanelFiltros() {
    set({ mapaPanelFiltrosAbierto: !get().mapaPanelFiltrosAbierto });
  },

  toggleMapaPanelEstadisticas() {
    set({ mapaPanelEstadisticasAbierto: !get().mapaPanelEstadisticasAbierto });
  },

  limpiarFiltrosMapa() {
    const estado = get();
    const indice = persistirPreferenciasMapa(estado, {
      profundidadMaxima: null,
      subarbolRaizId: null,
      criterioResaltado: "ninguno",
    });
    set({
      mapaProfundidadMaxima: null,
      mapaSubarbolRaizId: null,
      mapaCriterioResaltado: "ninguno",
      indice,
    });
  },

});
