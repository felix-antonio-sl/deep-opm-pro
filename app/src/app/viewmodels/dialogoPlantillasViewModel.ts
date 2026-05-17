import { useMemo } from "preact/hooks";
import type { PlantillaIndice } from "../../modelo/tipos";
import { useZustandSessionMessagePort } from "../ports/zustandSessionMessagePort";
import { useZustandTemplateDialogsPort } from "../ports/zustandTemplateDialogsPort";

export function useDialogoPlantillasViewModel(queryFiltrada: string) {
  const {
    catalogoAbierto,
    guardarAbierto,
    modeloNombre,
    plantillas,
    cerrar,
    abrirDialogoGuardarPlantilla: abrirGuardar,
    cerrarGuardar,
    guardar,
    insertar,
  } = useZustandTemplateDialogsPort();
  const { mensaje } = useZustandSessionMessagePort();
  const filtradas = useMemo(() => filtrarPlantillas(plantillas, queryFiltrada), [plantillas, queryFiltrada]);

  return {
    catalogoAbierto,
    guardarAbierto,
    abierto: catalogoAbierto || guardarAbierto,
    modeloNombre,
    mensaje,
    cerrar,
    abrirGuardar,
    cerrarGuardar,
    guardar,
    insertar,
    filtradas,
  };
}

export function filtrarPlantillas(plantillas: PlantillaIndice[], query: string): PlantillaIndice[] {
  if (!query) return plantillas;
  return plantillas.filter((plantilla) => {
    const texto = `${plantilla.nombre} ${plantilla.descripcion ?? ""}`.toLocaleLowerCase("es-CL");
    return texto.includes(query);
  });
}

export type DialogoPlantillasViewModel = ReturnType<typeof useDialogoPlantillasViewModel>;
