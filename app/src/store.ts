import { useSyncExternalStore } from "preact/compat";
import { createStore } from "zustand/vanilla";
import { createAtajosSlice } from "./store/atajos";
import { createCarpetasSlice } from "./store/carpetas";
import { createEnlacesSlice } from "./store/enlaces";
import { createMapaSlice } from "./store/mapa";
import { createModeloSlice, modeloInicial } from "./store/modelo";
import { createPersistenciaSlice } from "./store/persistencia";
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
  if (opciones.conectarRuntimeGlobal) inicializarRuntimeStore(api, modeloInicial);
  return api;
}

export const store = crearOpmStore({ conectarRuntimeGlobal: true });


export function useOpmStore<T>(selector: (state: OpmStore) => T): T {
  const state = useSyncExternalStore(
    store.subscribe,
    store.getState,
  );
  return selector(state);
}
