import { useOpmStore } from "../../store";
import type { ModelSearchDialogPort, SearchDialogsPort, WorkspaceSearchDialogPort } from "./searchDialogsPort";

export function useZustandSearchDialogsPort(): SearchDialogsPort {
  const abrirBusquedaCosas = useOpmStore((s) => s.abrirBusquedaCosas);
  const abrirBusquedaGlobal = useOpmStore((s) => s.abrirDialogoBuscarGlobal);

  return {
    abrirBusquedaCosas,
    abrirBusquedaGlobal,
  };
}

export function useZustandModelSearchDialogPort(): ModelSearchDialogPort {
  const abierto = useOpmStore((s) => s.busquedaCosasAbierta);
  const query = useOpmStore((s) => s.busquedaCosasQuery);
  const filtro = useOpmStore((s) => s.busquedaCosasFiltro);
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const cerrar = useOpmStore((s) => s.cerrarBusquedaCosas);
  const fijarQuery = useOpmStore((s) => s.fijarBusquedaCosasQuery);
  const fijarFiltro = useOpmStore((s) => s.fijarBusquedaCosasFiltro);
  const saltar = useOpmStore((s) => s.saltarAResultadoBusqueda);
  const traerAlOpdActivo = useOpmStore((s) => s.traerCosaAlOpdActivo);

  return {
    abierto,
    query,
    filtro,
    modelo,
    opdActivoId,
    cerrar,
    fijarQuery,
    fijarFiltro,
    saltar,
    traerAlOpdActivo,
  };
}

export function useZustandWorkspaceSearchDialogPort(): WorkspaceSearchDialogPort {
  const open = useOpmStore((s) => s.dialogoBuscarGlobalAbierto);
  const query = useOpmStore((s) => s.busquedaGlobal.query);
  const resultados = useOpmStore((s) => s.busquedaGlobal.resultados);
  const cerrar = useOpmStore((s) => s.cerrarDialogoBuscarGlobal);
  const fijarQuery = useOpmStore((s) => s.fijarBusquedaGlobalQuery);
  const ejecutar = useOpmStore((s) => s.ejecutarBusquedaGlobal);
  const abrirResultado = useOpmStore((s) => s.abrirResultadoBusquedaGlobal);

  return {
    open,
    query,
    resultados,
    cerrar,
    fijarQuery,
    ejecutar,
    abrirResultado,
  };
}
