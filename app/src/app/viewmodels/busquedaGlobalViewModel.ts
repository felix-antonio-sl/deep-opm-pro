import { useOpmStore } from "../../store";

export function useBusquedaGlobalViewModel() {
  const open = useOpmStore((s) => s.dialogoBuscarGlobalAbierto);
  const cerrar = useOpmStore((s) => s.cerrarDialogoBuscarGlobal);
  const query = useOpmStore((s) => s.busquedaGlobal.query);
  const resultados = useOpmStore((s) => s.busquedaGlobal.resultados);
  const fijarQuery = useOpmStore((s) => s.fijarBusquedaGlobalQuery);
  const ejecutar = useOpmStore((s) => s.ejecutarBusquedaGlobal);
  const abrirResultado = useOpmStore((s) => s.abrirResultadoBusquedaGlobal);

  return {
    open,
    cerrar,
    query,
    resultados,
    fijarQuery,
    ejecutar,
    abrirResultado,
  };
}

export type BusquedaGlobalViewModel = ReturnType<typeof useBusquedaGlobalViewModel>;
