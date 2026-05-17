import { useOpmStore } from "../../store";
import type { SessionTabsPort } from "./sessionTabsPort";

export function useZustandSessionTabsPort(): SessionTabsPort {
  const pestanas = useOpmStore((s) => s.pestanasAbiertas);
  const activa = useOpmStore((s) => s.pestanaActivaId);
  const abrirPestanaNueva = useOpmStore((s) => s.abrirPestanaNueva);
  const cambiarPestanaActiva = useOpmStore((s) => s.cambiarPestanaActiva);
  const cerrarPestana = useOpmStore((s) => s.cerrarPestana);
  const reordenarPestanas = useOpmStore((s) => s.reordenarPestanas);
  const guardarLocal = useOpmStore((s) => s.guardarLocal);

  return {
    pestanas,
    activa,
    abrirPestanaNueva,
    cambiarPestanaActiva,
    cerrarPestana,
    reordenarPestanas,
    guardarLocal,
  };
}
