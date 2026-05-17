import { useOpmStore } from "../../store";
import type { TemplateDialogsPort } from "./templateDialogsPort";

export function useZustandTemplateDialogsPort(): TemplateDialogsPort {
  const catalogoAbierto = useOpmStore((s) => s.dialogoPlantillasAbierto);
  const guardarAbierto = useOpmStore((s) => s.dialogoGuardarPlantillaAbierto);
  const modeloNombre = useOpmStore((s) => s.modelo.nombre);
  const plantillas = useOpmStore((s) => s.plantillasGuardadas);
  const cerrar = useOpmStore((s) => s.cerrarDialogoPlantillas);
  const abrirDialogoGuardarPlantilla = useOpmStore((s) => s.abrirDialogoGuardarPlantilla);
  const cerrarGuardar = useOpmStore((s) => s.cerrarDialogoGuardarPlantilla);
  const guardar = useOpmStore((s) => s.guardarComoPlantillaConfirmar);
  const insertar = useOpmStore((s) => s.insertarPlantillaEnOpdActivo);

  return {
    catalogoAbierto,
    guardarAbierto,
    modeloNombre,
    plantillas,
    cerrar,
    abrirDialogoGuardarPlantilla,
    cerrarGuardar,
    guardar,
    insertar,
  };
}
