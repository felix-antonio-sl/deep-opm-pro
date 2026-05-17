import { useMemo } from "preact/hooks";
import type { PlantillaIndice } from "../../modelo/tipos";
import { useOpmStore } from "../../store";

export function useDialogoPlantillasViewModel(queryFiltrada: string) {
  const catalogoAbierto = useOpmStore((s) => s.dialogoPlantillasAbierto);
  const guardarAbierto = useOpmStore((s) => s.dialogoGuardarPlantillaAbierto);
  const modeloNombre = useOpmStore((s) => s.modelo.nombre);
  const mensaje = useOpmStore((s) => s.mensaje);
  const cerrar = useOpmStore((s) => s.cerrarDialogoPlantillas);
  const abrirGuardar = useOpmStore((s) => s.abrirDialogoGuardarPlantilla);
  const cerrarGuardar = useOpmStore((s) => s.cerrarDialogoGuardarPlantilla);
  const guardar = useOpmStore((s) => s.guardarComoPlantillaConfirmar);
  const insertar = useOpmStore((s) => s.insertarPlantillaEnOpdActivo);
  const plantillas = useOpmStore((s) => s.plantillasGuardadas);
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
