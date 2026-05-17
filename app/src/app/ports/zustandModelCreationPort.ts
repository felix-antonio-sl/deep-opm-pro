import { useOpmStore } from "../../store";
import type { ModelCreationPort } from "./modelCreationPort";

export function useZustandModelCreationPort(): ModelCreationPort {
  const crearObjeto = useOpmStore((s) => s.crearObjetoDemo);
  const crearProceso = useOpmStore((s) => s.crearProcesoDemo);
  const crearAtributoNumerico = useOpmStore((s) => s.crearAtributoEnObjetoSeleccionado);
  const fijarModoCreacion = useOpmStore((s) => s.fijarModoCreacion);
  const modoCreacion = useOpmStore((s) => s.modoCreacion);
  const nuevaCosaPendiente = useOpmStore((s) => s.nuevaCosaPendiente);
  const confirmarNombreNuevaCosa = useOpmStore((s) => s.confirmarNombreNuevaCosa);
  const descartarNuevaCosaPendiente = useOpmStore((s) => s.descartarNuevaCosaPendiente);

  return {
    crearObjeto,
    crearProceso,
    crearAtributoNumerico,
    fijarModoCreacion,
    modoCreacion,
    nuevaCosaPendiente,
    confirmarNombreNuevaCosa,
    descartarNuevaCosaPendiente,
  };
}
