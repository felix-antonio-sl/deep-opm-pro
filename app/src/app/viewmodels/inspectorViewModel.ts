import { useOpmStore } from "../../store";

export type InspectorModo = "entidad" | "enlace" | "vacio";

export function useInspectorViewModel() {
  const modelo = useOpmStore((s) => s.modelo);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const enlaceSeleccionId = useOpmStore((s) => s.enlaceSeleccionId);
  const abrirImportarExportarJson = useOpmStore((s) => s.abrirDialogoImportarExportarJson);
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
