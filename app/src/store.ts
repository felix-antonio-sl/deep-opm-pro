import { useSyncExternalStore } from "preact/compat";
import { useRef } from "preact/hooks";
import { createStore } from "zustand/vanilla";
import { createAtajosSlice } from "./store/atajos";
import { createCarpetasSlice } from "./store/carpetas";
import { createEnlacesSlice } from "./store/enlaces";
import { createMapaSlice } from "./store/mapa";
import { createModeloSlice, modeloInicial } from "./store/modelo";
import {
  connectBackendSessionBoundary,
  createPersistenciaSlice,
} from "./store/persistencia";
import { createSeleccionSlice } from "./store/seleccion";
import { createPestanasSlice } from "./store/pestanas";
import { createSimulacionSlice } from "./store/simulacion";
import { createUiPanelSlice } from "./store/uiPanel";
import { createWorkspaceModSlice } from "./store/workspaceMod";
import { inicializarRuntimeStore } from "./store/runtime";
import type { OpmStore } from "./store/tipos";

export type { ModoEnlace, OpmStore } from "./store/tipos";

export function crearOpmStore(opciones: { conectarRuntimeGlobal?: boolean } = {}) {
  const api = createStore<OpmStore>((set, get) => ({
    ...createModeloSlice(set, get),
    ...createSeleccionSlice(set, get),
    ...createEnlacesSlice(set, get),
    ...createWorkspaceModSlice(set, get),
    ...createCarpetasSlice(set, get),
    ...createUiPanelSlice(set, get),
    ...createMapaSlice(set, get),
    ...createPersistenciaSlice(set, get),
    ...createPestanasSlice(set, get),
    ...createSimulacionSlice(set, get),
    ...createAtajosSlice(set, get),
  } as OpmStore));
  if (opciones.conectarRuntimeGlobal) {
    inicializarRuntimeStore(api, modeloInicial);
    connectBackendSessionBoundary(
      (partial) => api.setState(partial),
      () => api.getState(),
    );
  }
  return api;
}

export const store = crearOpmStore({ conectarRuntimeGlobal: true });


export function useOpmStore<T>(selector: (state: OpmStore) => T): T {
  // El snapshot es el VALOR seleccionado, no el estado completo: con el estado
  // completo como snapshot toda mutación del store re-renderiza los ~600
  // consumidores. El valor se recomputa en render (el selector puede cerrar
  // sobre props frescas) y se cachea por identidad de estado, conservando la
  // referencia previa cuando Object.is no cambia, para que el componente solo
  // re-renderice cuando SU selección cambia.
  const cache = useRef<{ state: OpmStore; selected: T } | null>(null);
  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  const estadoRender = store.getState();
  const seleccionRender = selector(estadoRender);
  const previo = cache.current;
  cache.current = {
    state: estadoRender,
    selected: previo && Object.is(previo.selected, seleccionRender) ? previo.selected : seleccionRender,
  };

  const getSnapshot = (): T => {
    const state = store.getState();
    const cached = cache.current;
    if (cached && cached.state === state) return cached.selected;
    const selected = selectorRef.current(state);
    const estable = cached && Object.is(cached.selected, selected) ? cached.selected : selected;
    cache.current = { state, selected: estable };
    return estable;
  };

  return useSyncExternalStore(store.subscribe, getSnapshot);
}
