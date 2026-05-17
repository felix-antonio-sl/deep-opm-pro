import { useOpmStore } from "../../store";
import type { TemplateDialogsPort } from "./templateDialogsPort";

export function useZustandTemplateDialogsPort(): TemplateDialogsPort {
  const abrirDialogoGuardarPlantilla = useOpmStore((s) => s.abrirDialogoGuardarPlantilla);

  return {
    abrirDialogoGuardarPlantilla,
  };
}
