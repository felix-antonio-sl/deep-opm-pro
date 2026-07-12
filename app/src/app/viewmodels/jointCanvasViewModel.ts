import { useZustandCanvasInteractionPort } from "../ports/zustandCanvasInteractionPort";
import type { ModoImagenEntidad } from "../../modelo/tipos";

export function useJointCanvasViewModel() {
  return useZustandCanvasInteractionPort();
}

export type JointCanvasViewModel = ReturnType<typeof useJointCanvasViewModel>;

export function opcionesProyeccionJointCanvas(input: {
  uiAliasVisibles: boolean;
  uiDescripcionesVisibles: boolean;
  uiModoImagenGlobal: ModoImagenEntidad | null;
}) {
  return {
    aliasVisibles: input.uiAliasVisibles,
    descripcionesVisibles: input.uiDescripcionesVisibles,
    modoImagenGlobal: input.uiModoImagenGlobal,
    canalSeleccion: "halo" as const,
  };
}
