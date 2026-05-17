import { useZustandOpdNavigationPort } from "../ports/zustandOpdNavigationPort";
import { useZustandPersistencePort } from "../ports/zustandPersistencePort";
import { useZustandSelectionPort } from "../ports/zustandSelectionPort";

export type InspectorModo = "entidad" | "enlace" | "vacio";

export function useInspectorViewModel() {
  const { modelo } = useZustandOpdNavigationPort();
  const { seleccionId, enlaceSeleccionId } = useZustandSelectionPort();
  const { abrirDialogoImportarExportarJson: abrirImportarExportarJson } = useZustandPersistencePort();
  const entidad = seleccionId ? modelo.entidades[seleccionId] : undefined;
  const enlace = enlaceSeleccionId ? modelo.enlaces[enlaceSeleccionId] : undefined;
  const modo: InspectorModo = entidad ? "entidad" : enlace ? "enlace" : "vacio";

  return {
    modo,
    entidad,
    enlace,
    abrirImportarExportarJson,
  };
}

export type InspectorViewModel = ReturnType<typeof useInspectorViewModel>;
