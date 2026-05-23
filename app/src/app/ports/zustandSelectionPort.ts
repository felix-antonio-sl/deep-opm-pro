import { useOpmStore } from "../../store";
import type { SelectionPort } from "./selectionPort";

export function useZustandSelectionPort(): SelectionPort {
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const seleccionados = useOpmStore((s) => s.seleccionados);
  const enlaceSeleccionId = useOpmStore((s) => s.enlaceSeleccionId);
  const estadoSeleccionId = useOpmStore((s) => s.estadoSeleccionId);
  const idsResaltadosTemporales = useOpmStore((s) => s.idsResaltadosTemporales);
  const seleccionarEntidad = useOpmStore((s) => s.seleccionarEntidad);
  const seleccionarPartePlegada = useOpmStore((s) => s.seleccionarPartePlegada);
  const seleccionarEstadoComoExtremo = useOpmStore((s) => s.seleccionarEstadoComoExtremo);
  const seleccionarEnlace = useOpmStore((s) => s.seleccionarEnlace);
  const seleccionarGrupoEstructural = useOpmStore((s) => s.seleccionarGrupoEstructural);
  const setSeleccion = useOpmStore((s) => s.setSeleccion);
  const setSeleccionPorTipo = useOpmStore((s) => s.setSeleccionPorTipo);
  const agregarASeleccion = useOpmStore((s) => s.agregarASeleccion);
  const toggleSeleccion = useOpmStore((s) => s.toggleSeleccion);
  const vaciarSeleccion = useOpmStore((s) => s.vaciarSeleccion);
  const seleccionarEstado = useOpmStore((s) => s.seleccionarEstado);
  const agregarEstadoASeleccion = useOpmStore((s) => s.agregarEstadoASeleccion);
  const toggleSeleccionEstado = useOpmStore((s) => s.toggleSeleccionEstado);

  return {
    seleccionId,
    seleccionados,
    enlaceSeleccionId,
    estadoSeleccionId,
    idsResaltadosTemporales,
    seleccionarEntidad,
    seleccionarPartePlegada,
    seleccionarEstadoComoExtremo,
    seleccionarEnlace,
    seleccionarGrupoEstructural,
    setSeleccion,
    setSeleccionPorTipo,
    agregarASeleccion,
    toggleSeleccion,
    vaciarSeleccion,
    seleccionarEstado,
    agregarEstadoASeleccion,
    toggleSeleccionEstado,
  };
}
