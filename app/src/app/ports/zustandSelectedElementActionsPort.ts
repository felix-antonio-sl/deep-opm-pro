import { useOpmStore } from "../../store";
import type { SelectedElementActionsPort } from "./selectedElementActionsPort";

export function useZustandSelectedElementActionsPort(): SelectedElementActionsPort {
  const agregarEstadoSmart = useOpmStore((s) => s.agregarEstadoSmart);
  const descomponerSeleccionada = useOpmStore((s) => s.descomponerSeleccionada);
  const desplegarSeleccionada = useOpmStore((s) => s.desplegarSeleccionada);
  const abrirModalImagen = useOpmStore((s) => s.abrirModalImagen);

  return {
    agregarEstadoSmart,
    descomponerSeleccionada,
    desplegarSeleccionada,
    abrirModalImagen,
  };
}
