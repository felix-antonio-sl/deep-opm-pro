import { useMemo } from "preact/hooks";
import { useZustandDiagnosticsQueryPort } from "../ports/zustandDiagnosticsPort";
import { useZustandOpdNavigationPort } from "../ports/zustandOpdNavigationPort";
import { useZustandOpdTreePort } from "../ports/zustandOpdTreePort";

export function useArbolOpdViewModel() {
  const { modelo, opdActivoId, cambiarOpdActivo } = useZustandOpdNavigationPort();
  const {
    vistaMapaActiva,
    modoOrdenArbol,
    fijarModoOrdenArbol,
    seleccionarEntidad,
    eliminarOpdDesdeArbol,
    moverHermano,
    moverOpdEnGestion,
    renombrarOpdDesdeArbol,
    nombresArbolVisibles,
    toggleNombresArbolVisibles,
    navegarOpdArriba,
    navegarOpdAbajo,
    navegarOpdIzquierda,
    navegarOpdDerecha,
    abrirVistaMapa,
    abrirGestionArbol,
  } = useZustandOpdTreePort();
  const { listarAvisos } = useZustandDiagnosticsQueryPort();
  const avisosArbol = useMemo(() => listarAvisos({ tipo: "modelo" }), [listarAvisos]);

  return {
    modelo,
    opdActivoId,
    vistaMapaActiva,
    modoOrdenArbol,
    fijarModoOrdenArbol,
    cambiarOpdActivo,
    seleccionarEntidad,
    eliminarOpdDesdeArbol,
    moverHermano,
    moverOpdEnGestion,
    renombrarOpdDesdeArbol,
    nombresArbolVisibles,
    toggleNombresArbolVisibles,
    navegarOpdArriba,
    navegarOpdAbajo,
    navegarOpdIzquierda,
    navegarOpdDerecha,
    abrirVistaMapa,
    abrirGestionArbol,
    avisosArbol,
  };
}

export type ArbolOpdViewModel = ReturnType<typeof useArbolOpdViewModel>;
