import { formatearHoraGuardado } from "../../ui/ChipPersistencia";
import { useZustandOpdNavigationPort } from "../ports/zustandOpdNavigationPort";
import { useZustandPersistencePort } from "../ports/zustandPersistencePort";
import { useZustandSelectionPort } from "../ports/zustandSelectionPort";
import { useZustandWorkbenchViewControlsPort } from "../ports/zustandWorkbenchViewControlsPort";

export type InspectorModo = "entidad" | "enlace" | "vacio";

export interface ConteosModeloInspector {
  objetos: number;
  procesos: number;
  opds: number;
}

export function calcularConteosModelo(
  entidades: Record<string, { tipo: "objeto" | "proceso" }>,
  opds: Record<string, unknown>,
): ConteosModeloInspector {
  let objetos = 0;
  let procesos = 0;
  for (const id in entidades) {
    const entidad = entidades[id];
    if (!entidad) continue;
    if (entidad.tipo === "objeto") objetos += 1;
    else if (entidad.tipo === "proceso") procesos += 1;
  }
  return { objetos, procesos, opds: Object.keys(opds).length };
}

export function useInspectorViewModel() {
  const { modelo } = useZustandOpdNavigationPort();
  const { seleccionId, enlaceSeleccionId } = useZustandSelectionPort();
  const { modeloNombre, ultimoAutosalvado } = useZustandPersistencePort();
  const { abrirDialogoConfiguracion } = useZustandWorkbenchViewControlsPort();
  const entidad = seleccionId ? modelo.entidades[seleccionId] : undefined;
  const enlace = enlaceSeleccionId ? modelo.enlaces[enlaceSeleccionId] : undefined;
  const modo: InspectorModo = entidad ? "entidad" : enlace ? "enlace" : "vacio";

  const conteos = calcularConteosModelo(modelo.entidades, modelo.opds);
  const horaEditado = formatearHoraGuardado(ultimoAutosalvado);

  return {
    modo,
    entidad,
    enlace,
    modeloNombre,
    conteos,
    horaEditado,
    abrirDialogoConfiguracion,
  };
}

export type InspectorViewModel = ReturnType<typeof useInspectorViewModel>;
