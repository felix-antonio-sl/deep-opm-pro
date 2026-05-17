import { useMemo } from "preact/hooks";
import { useOpmStore } from "../../store";

export function useToolbarCreacionViewModel() {
  const elegirTipoEnlace = useOpmStore((s) => s.elegirTipoEnlace);
  const cancelarEnlace = useOpmStore((s) => s.cancelarEnlace);
  const modoEnlace = useOpmStore((s) => s.modoEnlace);
  const modoCreacion = useOpmStore((s) => s.modoCreacion);
  const fijarModoCreacion = useOpmStore((s) => s.fijarModoCreacion);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const seleccionados = useOpmStore((s) => s.seleccionados);
  const modoSeleccion = useOpmStore((s) => s.modoSeleccion);
  const modelo = useOpmStore((s) => s.modelo);
  const crearEnlaceEntreEntidades = useOpmStore((s) => s.crearEnlaceEntreEntidades);

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
    selectorEnlaceDeshabilitado: !origenMenuTipo && !modoEnlace,
  };
}

export type ToolbarCreacionViewModel = ReturnType<typeof useToolbarCreacionViewModel>;
