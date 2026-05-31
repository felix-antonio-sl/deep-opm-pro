import { useMemo } from "preact/hooks";
import { useZustandInteractionModePort } from "../ports/zustandInteractionModePort";
import { useZustandEditabilityPort } from "../ports/zustandEditabilityPort";
import { useZustandModelCommandPort } from "../ports/zustandModelCommandPort";
import { useZustandModelCreationPort } from "../ports/zustandModelCreationPort";
import { useZustandOpdNavigationPort } from "../ports/zustandOpdNavigationPort";
import { useZustandSelectionPort } from "../ports/zustandSelectionPort";

export function useToolbarCreacionViewModel() {
  const { elegirTipoEnlace, cancelarEnlace, crearEnlaceEntreEntidades } = useZustandModelCommandPort();
  const { modoCreacion, fijarModoCreacion } = useZustandModelCreationPort();
  const { modelo } = useZustandOpdNavigationPort();
  const { seleccionId, seleccionados } = useZustandSelectionPort();
  const { modoEnlace, modoSeleccion } = useZustandInteractionModePort();
  const { readOnly } = useZustandEditabilityPort();

  // P1-4 ronda 4: si modoEnlace esta activo, el origen viene de
  // `modoEnlace.origenId` (canon SSOT del modo conectar). El destino sigue
  // siendo la segunda entidad seleccionada o el `seleccionId` cuando este
  // difiere del origen.
  const origenMenuTipo = useMemo(() => {
    if (modoEnlace && modelo.entidades[modoEnlace.origenId]) return modoEnlace.origenId;
    return seleccionId ?? seleccionados.find((id) => !!modelo.entidades[id]) ?? null;
  }, [modelo.entidades, modoEnlace, seleccionId, seleccionados]);

  const destinoMenuTipo = useMemo(() => {
    if (modoEnlace && seleccionId && seleccionId !== origenMenuTipo && modelo.entidades[seleccionId]) return seleccionId;
    if (modoSeleccion !== "multi") return null;
    return seleccionados.find((id) => id !== origenMenuTipo && !!modelo.entidades[id]) ?? null;
  }, [modelo.entidades, modoEnlace, modoSeleccion, origenMenuTipo, seleccionId, seleccionados]);

  return {
    elegirTipoEnlace,
    cancelarEnlace,
    modoEnlace,
    modoCreacion,
    fijarModoCreacion,
    modelo,
    crearEnlaceEntreEntidades,
    origenMenuTipo,
    destinoMenuTipo,
    selectorEnlaceDeshabilitado: readOnly || (!origenMenuTipo && !modoEnlace),
  };
}

export type ToolbarCreacionViewModel = ReturnType<typeof useToolbarCreacionViewModel>;
