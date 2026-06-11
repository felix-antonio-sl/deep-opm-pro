import { useZustandCanvasInteractionPort } from "../ports/zustandCanvasInteractionPort";
import type { OpcionesProyeccion } from "../../render/jointjs/proyeccion";
import type { ModoImagenEntidad } from "../../modelo/tipos";

export function useJointCanvasViewModel() {
  return useZustandCanvasInteractionPort();
}

export type JointCanvasViewModel = ReturnType<typeof useJointCanvasViewModel>;

export function opcionesProyeccionJointCanvas(input: {
  uiAliasVisibles: boolean;
  uiDescripcionesVisibles: boolean;
  uiModoImagenGlobal: ModoImagenEntidad | null;
}): OpcionesProyeccion {
  return {
    aliasVisibles: input.uiAliasVisibles,
    descripcionesVisibles: input.uiDescripcionesVisibles,
    modoImagenGlobal: input.uiModoImagenGlobal,
    canalSeleccion: "halo",
  };
}
