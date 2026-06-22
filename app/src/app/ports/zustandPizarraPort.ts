import { useOpmStore } from "../../store";
import type { PizarraPort } from "./pizarraPort";

export function useZustandPizarraPort(): PizarraPort {
  const modoPizarra = useOpmStore((s) => s.modoPizarra);
  const herramientaPizarra = useOpmStore((s) => s.herramientaPizarra);
  const bocetoSeleccionadoId = useOpmStore((s) => s.bocetoSeleccionadoId);
  const activar = useOpmStore((s) => s.activarModoPizarra);
  const salir = useOpmStore((s) => s.salirModoPizarra);
  const elegirHerramienta = useOpmStore((s) => s.elegirHerramientaPizarra);
  const agregarBoceto = useOpmStore((s) => s.agregarBocetoEnOpd);
  const moverBoceto = useOpmStore((s) => s.moverBocetoActual);
  const editarBoceto = useOpmStore((s) => s.editarBocetoActual);
  const eliminarBoceto = useOpmStore((s) => s.eliminarBocetoActual);
  const seleccionarBoceto = useOpmStore((s) => s.seleccionarBoceto);
  const promoverBoceto = useOpmStore((s) => s.promoverBocetoActual);

  return {
    modoPizarra,
    herramientaPizarra,
    bocetoSeleccionadoId,
    activar,
    salir,
    elegirHerramienta,
    agregarBoceto,
    moverBoceto,
    editarBoceto,
    eliminarBoceto,
    seleccionarBoceto,
    promoverBoceto,
  };
}
