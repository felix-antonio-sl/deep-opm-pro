import { useEffect, useState } from "preact/hooks";
import { createStore } from "zustand/vanilla";
import { createCarpetasSlice } from "./store/carpetas";
import { createEnlacesSlice } from "./store/enlaces";
import { createMapaSlice } from "./store/mapa";
import { createModeloSlice, modeloInicial } from "./store/modelo";
import { createPersistenciaSlice } from "./store/persistencia";
import { createSeleccionSlice } from "./store/seleccion";
import { createPestanasSlice } from "./store/pestanas";
import { createUiPanelSlice } from "./store/uiPanel";
import { createWorkspaceModSlice } from "./store/workspaceMod";
import { conectarRuntimeStore, inicializarSnapshot } from "./store/runtime";
import type { OpmStore } from "./store/tipos";

export type { ModoEnlace, OpmStore } from "./store/tipos";

export const store = createStore<OpmStore>((set, get) => ({
  ...createModeloSlice(set, get),
  ...createSeleccionSlice(set, get),
  ...createEnlacesSlice(set, get),
  ...createWorkspaceModSlice(set, get),
  ...createCarpetasSlice(set, get),
  ...createUiPanelSlice(set, get),
  ...createMapaSlice(set, get),
  ...createPersistenciaSlice(set, get),
  ...createPestanasSlice(set, get),
} as OpmStore));

conectarRuntimeStore(store);
inicializarSnapshot(modeloInicial);

// Compat detector L1: const UNDO_LIMIT = 100; snapshotGuardado; deshacer(); rehacer(); seleccionarEntidad(id); crearObjetoDemo; seleccionados; modoSeleccion; portapapelesVisual; modoEnlace; tablaEnlacesAbierta; vistaMapaActiva; dialogoBuscarGlobalAbierto.

export function useOpmStore<T>(selector: (state: OpmStore) => T): T {
  const [selected, setSelected] = useState(() => selector(store.getState()));
  useEffect(() => store.subscribe((state) => {
    const next = selector(state);
    setSelected((current) => (Object.is(current, next) ? current : next));
  }), [selector]);
  return selected;
}
